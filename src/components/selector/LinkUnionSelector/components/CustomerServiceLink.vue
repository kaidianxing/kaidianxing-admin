/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="goods-preview">
      <div class="goods-preview-content" ref="scrollBox">
        <div class="search">
          <Input
            v-model="service_name"
            search
            enter-button="搜索"
            placeholder="请输入客服昵称"
            @on-search="handleSearch"
            @on-enter="handleSearch"
            class="width-250"
          />
        </div>
        <Table
          ref="table"
          :columns="columns"
          :data="table.data"
          v-loading="table.loading"
        ></Table>
      </div>
      <div class="footer-page" v-show="table.total > 10">
        <kdx-page-component
          ref="page"
          :total="table.total"
          @on-change="handlePageChange"
        ></kdx-page-component>
      </div>
    </div>
</template>

<script>
export default {
  name: "customerServiceLink",
  props: {
    current: {
      type: [String, Object],
      default: () => ({}),
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      service_name:'',
      columns: [
        {
          title: "客服名称",
          key: 'name',
          minWidth: 150,
        },

        {
          title: "操作",
          key: "action",
          width: 150,
          render: (h, params) => {
            return (
              <div class="action">
                <Button
                  class="default-primary"
                  style={{
                    display: params.row.checked ? "none" : "block",
                  }}
                  onClick={() => {
                    this.setChecked(params.index, true);
                  }}
                >
                  选择
                </Button>
                <Button
                  type="primary"
                  style={{
                    display: params.row.checked ? "block" : "none",
                  }}
                  onClick={() => {
                    this.setChecked(params.index, false);
                  }}
                >
                  已选
                </Button>
              </div>
            );
          },
        },
      ],
      page: {
        pagesize: 10,
        page: 1,
      },
      selectRow: {},
      table: {
        data: [],
        loading: false,
        total: 0,
      },
    };
  },
  methods: {
    handleSearch() {
      this.resetPage();
      this.getQywxCustomerServiceList();
    },
    resetPage() {
      this.page.page = 1;
      this.getQywxCustomerServiceList();
      this.$refs["page"]?.reset();
    },
    // 页码改变
    handlePageChange(page) {
    this.page.page = page.pageNumber;
      this.page.pagesize = page.pageSize;
      this.getQywxCustomerServiceList();
      try {
        this.$refs.scrollBox.scrollTop = 0;
      } catch (e) {
        console.log(e);
      }
    },
    // 进行默认选中
    defaultChecked() {
      console.log(this.current, 22222222222222)
            this.table.data?.forEach((item, index) => {
                if (this.current.url && item.link === this.current.url) {
                    this.$set(this.table.data[index], 'checked', true)
                } else {
                    this.$set(this.table.data[index], 'checked', false)
                }
            })
    },
    // 选择、取消选择
    setChecked(index, isChecked) {
      // 单选
            if (isChecked) {
                this.table.data.forEach((item, i) => {
                    this.$set(this.table.data[i], 'checked', false)
                })
                this.$set(this.table.data[index], 'checked', true)
                this.$emit('on-change', {url: this.table.data[index]?.link, name: this.table.data[index]?.name});
            } else {
                this.$set(this.table.data[index], 'checked', false)
                this.$emit('on-change', {});
            }
    },
    // 客服列表
    getQywxCustomerServiceList() {
      this.table.loading = true;
       const params = {
        name: this.service_name,
        ...this.page,
      };
      this.$api.customerApi
        .getServiceList(params)
        .then((res) => {
          this.table.loading = false;
          if (res.error === 0) {
            this.table.data = res.data.list;
            this.table.total = res.data.total;
            this.defaultChecked();
          }
        })
        .catch();
    },
    resetSearch() {
      this.service_name = ''
    },
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.selectRow = this.current;
          this.resetSearch();
          this.resetPage();
          this.getQywxCustomerServiceList();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
.goods-preview {
  > .goods-preview-content {
    max-height: calc(100vh - 110px - 160px - 75px);
    padding: 20px;
    overflow-y: auto;
    > .search {
      display: flex;
      padding-bottom: 20px;
      .label {
        display: inline-block;
        width: 100px;
        padding-top: 6px;
        text-align: right;
        color: $text-first;
        @include font-14-20;
      }
    }
    /deep/ .ivu-table {
      td {
        .shop-box {
          display: flex;
          flex-wrap: nowrap;
          .image {
            width: 60px;
            height: 60px;
            margin-right: 10px;
            border-radius: 2px;
            border: 1px solid $border-color;
            box-sizing: border-box;
            > img {
              width: 100%;
              height: 100%;
              border-radius: 2px;
            }
          }
          .content {
            width: 100%;
            flex: 1;
            .content-text {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              height: 50px;
              padding: 10px 0;
              .mark {
                @include font-12-16;
                color: #ed4014;
                background-color: #ffefe6;
                border-radius: 2px;
                margin-right: 4px;
                width: 18px;
                height: 18px;
                text-align: center;
                line-height: 18px;
                display: inline-block;
                &:nth-last-child(2) {
                  margin-right: 6px;
                }
                &.real {
                  background-color: #f0faff;
                  color: $brand-color;
                }
                &.virtual {
                  background-color: #e6fff9;
                  color: #00c5c5;
                }
              }
              .text {
                @include font-14-20;
              }
            }
          }
        }
        .price {
          color: $text-first;
          @include font-14-20-bold;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .icon {
            display: none;
            cursor: pointer;
          }
          &:hover {
            > .icon {
              display: inline-block;
            }
          }
        }
      }
    }
  }
  .footer-page {
    background-color: #ffffff;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    border-top: 1px solid $border-color;
  }
}
@media only (max-width: 1550px) {
  .goods-preview {
    > .goods-preview-content {
      max-height: calc(100vh - 110px - 80px - 75px);
    }
  }
}
</style>
