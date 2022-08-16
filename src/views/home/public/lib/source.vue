/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */
<template>
  <div class="fans-label" v-loading="loading">
    <kdx-header-bar type="little">
      <template #header>
        <div class="header-btn">
          <kdx-image-video
            style="margin-right:20px"
            :key="Math.random()"
            :weixinControl="weixinControl"
            v-if="auth != 'news'"
            class="marginL-10 blk"
            :desc="`添加微信${dic[auth]}素材`"
            :videoName="`添加微信${dic[auth]}素材`"
            :type="auth"
            :isReadonly="noManagePerm"
            @on-change="createLib"
            @on-video-change="createLib"
          ></kdx-image-video>

          <Button  @click="syncLib" :disabled="noManagePerm" class="btn"
            >同步微信{{ dic[auth] }}素材</Button
          >
        </div>
      </template>
    </kdx-header-bar>

    <div class="table-list" v-loading="loadingTable">
      <div class="sync-time">
        上次同步时间：<span class="time">{{
          lastSyncTime || "00-00-00 00:00:00"
        }}</span>
      </div>

      <div class="image-selector-modal">
        <div class="image-selector-local">
          <div class="image-content">
            <div class="image-list" ref="scrollBox">
              <ul v-if="'video' != auth && 'news' != auth">
                <li v-for="item in list" :key="item.media_id">
                  <div
                    class="image"
                    v-if="['image', 'voice'].includes(item.type)"
                  >
                    <img
                      :src="$utils.getWechatImg(item.url)"
                      alt=""
                      @error="replaceImage"
                      v-if="'image' == item.type"
                    />
                    <audio
                      v-else-if="'voice' == item.type"
                      :src="$media(item.url)"
                    />
                    <div v-if="'voice' == item.type" class="awp">
                      {{ item.title }}
                    </div>
                    <div class="layer">
                      <Icon
                        v-if="!noManagePerm"
                        type="ios-close-circle"
                        class="close"
                        @click="del(item.media_id)"
                      />

                      <div class="image-size">
                        {{ item.created_at }}
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              <div
                class="msg_sender"
                v-if="'news' == auth"
                style="margin-bottom:10px;"
              >
                <div class="ct">
                  <div
                    class="img_msg_wrap"
                    v-for="item in list"
                    :key="item.media_id"
                  >
                    <div class="date">更新于 {{ item.created_at }}</div>

                    <div
                      class="lq"
                      v-for="(j, im) in item.news_item"
                      :key="j.id"
                      :class="{ im: im > 0 }"
                    >
                      <div style="width:215px;overflow:hidden">
                        <img
                          class="img"
                          :src="$utils.getWechatImg(j.thumb_url)"
                          @error="replaceImage"
                        />
                      </div>
                      <div class="sub_title">
                        {{ j.title || "-" }}
                      </div>
                    </div>

                    <div class="layer">
                      <Icon
                        type="ios-close-circle"
                        class="close"
                        @click="del(item.media_id)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div style="margin-bottom:10px;" v-if="'video' == auth">
                <Table :columns="columns" :data="list" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="border-top:1px solid #e9edef" v-if="'video' != auth"></div>

      <kdx-page-component
        style="text-align:center;margin-top:20px"
        ref="page"
        :total="total"
        :pageSize="page.pagesize"
        @on-change="handlePageChange"
      ></kdx-page-component>
    </div>

    <!--微信公众号类型错误-->
    <wechat-empty v-if="!isIdentifyService"></wechat-empty>
  </div>
</template>
<script>
import { homeApi } from "@/api/home";
import WechatEmpty from "@/views/home/wechat/components/WechatEmpty";
export default {
  created() {
    this.$store
      .dispatch("channel/getWechatInfo")
      .then(({ isIdentifyService }) => {
        this.isIdentifyService = isIdentifyService;
      });
  },
  components: {
    WechatEmpty,
  },
  watch: {
    "$route.params.type": {
      immediate: true,
      handler(val) {
          console.log(val,'val------')
        this.auth = val;
        this.getSyncLibItems();
      },
    },
  },
  computed: {  
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("channel.wechat.manage");
        },
  },
  methods: {
    del(media_id = "") {
      this.$Modal.confirm({
        title: "提示",
        content: "确认删除吗?",
        onOk: () => {
          this.$api.homeApi
            .deleteByMediaId({
              media_id,
            })
            .then((r) => {
              if (0 == r.error) {
                this.$Message.success("删除成功");
                this.resetPage();
              }
            });
        },
      });
    },
    getSyncLibItems() {
      this.$api.homeApi
        .getSyncLibItems({
          type: this.auth,
          ...this.page,
        })
        .then((r) => {
          this.total = r.total;
          this.list = r.list;
          this.lastSyncTime = r.last_sync_time || "";
          console.log(r, "@@@====>>>>");
        });
    },
    changeThumb() {},
    handlePageChange(page) {
      this.page.pagesize = page.pageSize;
      this.page.page = page.pageNumber;

      this.getSyncLibItems();
    },
    // 重置页码
    resetPage() {
      this.page = {
        pagesize: 10,
        page: 1,
      };
      this.$refs["page"]?.reset();
      this.getSyncLibItems();
    },
    syncLib() {
      this.loadingTable = true;
      this.$api.homeApi
        .syncLib({
          type: this.auth,
        })
        .then((res) => {
          if (0 == res.error) {
            let Mq = () => {
              this.$api.homeApi
                .syncLibStatus({
                  task_id: res.task_id,
                })
                .then((r) => {
                  let rs = "";
                  if (0 == r?.data?.status) {
                    rs = "";
                  } else if (1 == r?.data?.status) {
                    rs = "成功";
                    this.loadingTable = false;
                  } else if (2 == r?.data?.status) {
                    rs = "失败";
                    this.loadingTable = false;
                  }

                  if ("" == rs) {
                    setTimeout(() => {
                      Mq();
                    }, 3000);
                  } else {
                    this.resetPage();

                    this.$Message.success(rs);
                  }
                });
            };
            Mq();
          }
        });
    },
    createLib() {
      // console.log("admin------>>>>>>");
      this.resetPage();
    },
  },
  data() {
    return {
      weixinControl: {
        isHideMenu: true,
        actionApi: {
          getList: () => this.$api.homeApi.getSyncLibItems,
          uploadFile: () => homeApi.uploadLib.api,
          deleteFile: () => this.$api.homeApi.deleteByMediaId,
          getTypeNameByMsgType: () => {
            return this.auth;
          },
        },
      },
      lastSyncTime: "",
      dic: {
        image: "图片",
        video: "视频",
        voice: "音频",
        news: "图文",
      },
      isIdentifyService: false, // 是否是认证服务号
      columns: [
        {
          title: "名称",
          key: "title",
          render: (h, params) => {
            return (
              <div class="vp">
                <video src={this.$media(params.row.url)} />
                {params.row.title}
              </div>
            );
          },
        },
        {
          title: "状态",
          key: "status",
          render: () => {
            return <div>-</div>;
          },
        },
        {
          title: "更新时间",
          key: "created_at",
        },
        {
          title: "操作",
          render: (h, params) => {
            return (
              <Button
                class="del"
                disabled={this.noManagePerm}
                type="text"
                onClick={() => {
                  this.del(params.row.media_id);
                }}
              >
                删除
              </Button>
            );
          },
        },
      ],
      data: [],
      page: {
        pagesize: 10,
        page: 1,
      },
      total: 0,
      list: [],
      loading: false,
      loadingTable: false,
      auth: "",
    };
  },
};
</script>
<style scoped lang="scss">
/deep/.vp {
  display: flex;
  align-items: center;
  video {
    width: 100px;
    height: 100px;
    border: 1px solid $border-color;
    margin-right: 10px;
    border-radius: 2px;
  }
}
.fans-label {
  margin: 20px auto;
}
.table-list {
  padding: 0 20px 20px 20px;
  background-color: #ffffff;
  border-radius: 2px;
  /deep/ .ivu-table {
    .ivu-table-header tr th {
      background-color: #f4f6f8;
    }
  }
  .sync-time {
    padding: 20px 0 10px 0;
    font-size: 14px;
    @include font-14-20;
    color: $text-second;
    .time {
      @include font-14-20;
      padding-left: 10px;
      font-weight: bold;
    }
  }
  .footer-page {
    padding-bottom: 0;
  }
}

.image-selector-modal {
  //   height: 570px;
  //   overflow: hidden;
  /deep/ .ivu-tabs {
    // tabs样式修改
    .ivu-tabs-bar {
      margin-bottom: 0;
      .ivu-tabs-nav-scroll {
        display: flex;
        justify-content: center;
        .ivu-tabs-nav {
          .ivu-tabs-tab {
            padding: 12px 50px;
            @include font-18-25-bold;
            color: $text-first;
          }
          .ivu-tabs-tab-active {
            color: $brand-color;
          }
        }
      }
    }
  }
  // 本地图片
  .image-selector-local {
    display: flex;
    flex-wrap: nowrap;
    // 分组
    .group {
      min-width: 200px;
      max-width: 200px;
      padding: 20px 0;
      border-right: 1px solid $border-color;
      //   overflow-x: hidden;
      //   overflow-y: auto;
      .add-group {
        padding: 0 20px;
        .add-group-btn {
          margin-bottom: 8px;
          width: 159px;
        }
      }
      .group-content {
        // height: 460px;
        // overflow-x: hidden;
        // overflow-y: auto;
        > ul {
          > li {
            list-style: none;
            /deep/ .ivu-poptip {
              display: block;
              .ivu-poptip-rel {
                display: block;
              }
            }
            .btn {
              padding-right: 10px;
              color: $brand-color;
              white-space: nowrap;
              display: none;
              font-size: 14px;
              > .ivu-btn {
                font-size: 14px;
              }
            }
            .group-list {
              display: flex;
              justify-content: space-between;
              flex-wrap: nowrap;
              /*padding: 12px 0 12px 30px;*/
              align-items: center;
              color: $text-first;
              height: 40px;
              //   overflow: hidden;
              cursor: pointer;
              .title {
                width: 130px;
                padding-left: 20px;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                font-size: 12px;
                .system-label {
                  margin-left: 4px;
                  display: inline-block;
                  width: 28px;
                  height: 18px;
                  line-height: 18px;
                  font-size: 12px;
                  color: $brand-color;
                  border: 1px solid $brand-color;
                  border-radius: 2px;
                }
              }
              .number {
                font-size: 12px;
                padding-right: 20px;
              }
              &:hover {
                background-color: #f0faff;
                color: $brand-color;
              }
            }
            .group-other {
              .title {
                padding-left: 30px;
              }
              &:hover {
                .btn {
                  display: block;
                }
                .number {
                  display: none;
                }
              }
            }
            .group-update {
              display: flex;
              justify-content: space-between;
              flex-wrap: nowrap;
              /*padding: 12px 0 12px 30px;*/
              align-items: center;
              //color: $text-first;
              height: 40px;
              overflow: hidden;
              cursor: pointer;
              .ivu-input-wrapper {
                flex: 1;
                width: 0;
                .ivu-input {
                  border: none;
                  box-shadow: none;
                }
              }
              .btn {
                display: inline-block;
              }
            }
          }
          .all {
            .title {
              padding-left: 20px;
              width: 140px;
            }
            &:hover {
              .number {
                display: block;
              }
            }
          }
          .group-active {
            border-right: 2px solid $brand-color;
            background-color: #f0faff;
            .group-list {
              color: $brand-color;
            }
          }
        }
      }
    }
    // 图片列表
    .image-content {

      width: 100%;
      //   overflow-y: auto;
      > .image-header {
        padding-top: 20px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding-bottom: 10px;
        > .btn {
          flex: 1;
          > button {
            margin-right: 10px;
          }
        }
        > .search {
          > button {
            margin-left: -1px;
          }
        }
      }
      > .image-list {
        // overflow-y: auto;
        // overflow-x: hidden;
        // height: 410px;
        // padding-top: 10px;
        > ul {
          display: flex;
          flex-wrap: wrap;
          margin-right: -10px;
          > li {
            list-style: none;
            padding: 0 10px 20px 0;
            > .image {
              position: relative;
              width: 138px;
              height: 138px;
              border: 1px solid $border-color;
              border-radius: 2px;
              cursor: pointer;
              background-color: $background-color;
              &:hover {
                > .layer {
                  display: block;
                  > .close {
                    /*display: block;*/
                    color: $text-zhushi;
                  }
                }
              }
              > img {
                width: 100%;
                height: 100%;
              }

              > .layer-disappear {
                display: none;
                > .close {
                  display: none;
                }
                > .image-size {
                  display: none;
                }
              }
              > .image-select-layer {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                border-radius: 2px;
                > .checked {
                  display: inline-block;
                  margin: auto;
                  color: $brand-color;
                  font-size: 30px;
                }
              }
            }
            > .text {
              @include font-12-16;
              color: $text-first;
              margin-top: 10px;
              width: 138px;
              word-break: break-all;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
          }
        }
        // 没有数据时显示
        .image-list-none {
          width: 100%;
          height: 100%;
          margin: auto;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          div {
            > .icon {
              .iconfont {
                font-size: 80px;
              }
            }
            > .btn {
              color: $text-second;
              @include font-14-20;
            }
          }
        }
      }
      > .image-footer {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 10px 0;
        background-color: #ffffff;
        > .checkbox {
          .ivu-checkbox-wrapper {
            margin-right: 10px;
          }
        }
      }
    }
  }
  // 网络图片
  .image-selector-network {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
.image-selector-header {
  padding: 3px 4px;
  height: 20px;
  display: flex;
  align-items: center;
  .title {
    @include font-16-22-bold;
    color: $text-first;
  }
  .storage-content {
    padding-left: 20px;
    @include font-14-20;
    color: $text-third;
  }
}
.blk {
  display: inline-block;
}
/deep/.show-img ul .add {
  background: var(--theme-color);
  span{
    color: #fff !important;
    font-size: 14px !important;
  }
  border: 0 !important;
  width: auto !important;
  height: auto !important;
  margin: 0 !important;
  .text-icon {
    padding: 7px 15px;
    span {
      display: inline !important;
    }
    .icon {
      padding: 0 !important;
      line-height: 0;
      margin-right: 5px;
    }
  }
}
/deep/.show-img ul {
  margin: 0 !important;
}
/deep/.header-btn {
  .ivu-btn,
  .show-img {
    vertical-align: middle;
  }
}
/deep/.icon-tianjiatupian:before {
  font-size: 14px;
}
/deep/.del {
  color: var(--theme-color);
  cursor: pointer;
}
.msg_sender {
  /deep/.ivu-form-item-content {
    margin-left: -80px !important;
  }
  /deep/.ivu-form-item-label {
    text-align: left;
    width: 80px !important;
  }

  background: #fff;
  .sub_hd {
    background: #f6f8f9;
    margin: -16px -20px 0 -20px;
    padding: 16px 0;
    display: flex;
    li {
      padding: 0 20px;
      cursor: pointer;
      &.ac {
        color: #2d8cf0;
      }
    }
  }
  .ct {
    display: flex;
    align-items: top;
    flex-wrap: wrap;
    .img_msg_wrap {
      position: relative;
      margin-right: 10px;
      margin-bottom: 10px;
      border: 1px solid #e7e7eb;
      width: 240px;
      border-radius: 2px;
      &:hover {
        .layer {
          display: block !important;
        }
      }
    }
    .date {
      margin: 0 12px;
      padding: 12px 0;
      color: #353535;
      border-bottom: 1px solid #e7e7eb;
    }
    .lq {
      &.im {
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
        img {
          width: 80px !important;
        }
        .sub_title {
          flex: 1;
        }
      }
      padding: 12px;
      text-align: center;
      .img {
        height: 100px;
      }
      .sub_title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        padding-top: 5px;
        text-align: left;
      }
    }
    .opt {
      text-align: center;
      cursor: pointer;
      padding: 12px 0;
    }
  }
}
.layer {
  cursor: pointer;
  display: none;
  > .close {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 20px;
    color: $text-zhushi;
    &:hover {
      color: $text-second;
    }
  }
  > .image-size {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    font-size: 12px;
  }
}
.awp {
  text-align: center;
  line-height: 138px;
}
/deep/.video-btn.control {
  display: none !important;
}
/deep/.video-btn {
  .icon-tianjiashipin:before {
    font-size: 14px;
    content: "\e90f";
  }
}
.btn {
    border:1px solid #2d8cf0;
    color:#2d8cf0
}
</style>
