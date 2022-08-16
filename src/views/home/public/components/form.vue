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
  <div v-if="currentFormInfoByMenuId.id" class="fm-wp">
    <div class="m">
      <div class="hd">
        {{ isSub ? "二级菜单" : "当前表单" }}
      </div>

      <div style="margin-bottom: 30px;">
        <!-- <kdx-hint-text v-if="!isSub">子菜单最多可以添加5个</kdx-hint-text> -->

        <kdx-hint-text v-if="hasChild">已添加子菜单，仅可设置菜单名称</kdx-hint-text>
      </div>

      <Form
        :label-width="120"
        :model="currentFormInfoByMenuId"
        :rules="rules"
        ref="main"
      >
        <FormItem label="菜单名称：" :prop="getFormCheckFuncName">
          <Input
            @on-change="chMenuName"
            v-model="currentFormInfoByMenuId.menuName"
            class="width-340"
          />
          <kdx-hint-text>{{ getAlt }}</kdx-hint-text>
        </FormItem>

        <div v-if="!hasChild">
          <FormItem label="菜单动作：" prop="content">
            <RadioGroup v-model="currentFormInfoByMenuId.content">
              <Radio
                v-for="item in menuTypeDic"
                :key="item.val"
                :label="item.val"
              >
                {{ item.key }}
              </Radio>
            </RadioGroup>
          </FormItem>
          <!--发送消息-->
          <div class="msg_sender" v-if="0 == currentFormInfoByMenuId.content">
            <ul class="sub_hd">
              <li
                :class="{ ac: msgOptFlg == item.val }"
                v-for="item in msgOpt"
                :key="item.val"
                @click="changeMenu(item.val)"
              >
                {{ item.key }}
              </li>
            </ul>
            <div class="ct">
              <div
                class="out-wrap"
                v-show="0 == formMsgType"
                style="padding:20px 0"
              >
                <!--这里需要能出去做个选择器赶时间所以代码复制粘贴了。-->
                <Button v-if="!txtImgData" @click="txtImgFlg = true">
                  选择图文
                </Button>
                <kdx-modal-frame
                  v-model="txtImgFlg"
                  title="选择图文"
                  :width="1000"
                  @on-cancel="txtImgCancel"
                  @on-ok="txtImgOk"
                  :loading="txtImgLoading"
                  >
                  <div class="ct" v-if="imgTextItems.length">
                    <div
                              :class="{ ac: imgMsgObj.media_id == item.media_id }"
                              @click="setTextImgMid(item)"
                              v-for="item in imgTextItems"
                              :key="item.id"
                              class="img_msg_wrap"
                      >
                        <div>
                          <div class="date">更新于 {{ item.created_at }}</div>

                          <div
                                  class="lq"
                                  v-for="(j, im) in item.news_item"
                                  :key="j.id"
                                  :class="{ im: im > 0 }"
                          >
                            <div style="width:280px;overflow:hidden">
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
                        </div>

                        <div class="opt" style="display:none">
                          <div v-if="imgMsgObj.date" @click="clearImgMsg()">
                            删除
                          </div>
                          <div v-else @click="selectImgMsg()">从素材库选择</div>
                        </div>
                      </div>
                  </div>
                  <div class="no-data" v-else>
                    <img src="@/assets/image/omit-data.png" alt="">
                    暂无数据
                  </div>
                </kdx-modal-frame>

                <div v-if="txtImgData" style="position:relative">
                  <div
                    style="margin:0;"
                    @click="setTextImgMid(item)"
                    v-for="item in imgTextItems"
                    :key="item.id"
                    class="img_msg_wrap"
                    v-show="txtImgData == item.media_id"
                  >
                    <div>
                      <div class="date">更新于 {{ item.created_at }}</div>

                      <div
                        class="lq"
                        v-for="(j, im) in item.news_item"
                        :key="j.id"
                        :class="{ im: im > 0 }"
                      >
                        <div style="width:280px;overflow:hidden">
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
                    </div>

                    <div class="layer player" @click="delLy">
                      <Icon type="ios-close-circle" class="close" />
                    </div>

                    <div class="opt" style="display:none">
                      <div v-if="imgMsgObj.date" @click="clearImgMsg()">
                        删除
                      </div>
                      <div v-else @click="selectImgMsg()">从素材库选择</div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="1 == formMsgType">
                <i-input
                  show-word-limit
                  v-model="imgMsgObj.text"
                  type="textarea"
                  maxlength="900"
                  :rows="15"
                />
                <textarea
                  v-model="imgMsgObj.text"
                  id="textarea"
                  class="textarea"
                  maxlength="900"
                  v-if="0"
                ></textarea>
                <div v-if="0" @click="showDialog = !showDialog">😃</div>
                <VEmojiPicker
                  v-if="0"
                  style="position:absolute"
                  v-show="showDialog"
                  @select="selectEmoji"
                />
              </div>
              <div v-show="2 == formMsgType" style="padding: 20px 0;">
                <div v-if="!imgMsgObj.image"></div>
                <kdx-image-video
                  v-if="!imgMsgObj.image"
                  :key="Math.random()"
                  :weixinControl="weixinControl"
                  :desc="imgMsgObj.image ? '替换图片' : '添加图片'"
                  type="image"
                  @on-change="changeThumb"
                ></kdx-image-video>

                <div v-if="imgMsgObj.image" class="hv">
                  <img
                    style="width:320px"
                    :src="$utils.getWechatImg(imgMsgObj.image)"
                  />

                  <div class="layer" @click="imgMsgObj.image = ''">
                    <Icon type="ios-close-circle" class="close" />
                  </div>
                </div>
              </div>
              <div v-show="3 == formMsgType && 0">
                暂未开发敬请期待
              </div>
              <div
                v-show="4 == formMsgType"
                style="padding: 20px 0;margin-bottom:20px;"
              >
                <div v-if="!imgMsgObj.video" style=""></div>

                <kdx-image-video
                  v-if="!imgMsgObj.video"
                  :weixinControl="weixinControl"
                  :videoName="imgMsgObj.video ? '替换视频' : '添加视频'"
                  type="video"
                  @on-video-change="changeThumbVideo"
                ></kdx-image-video>
                <div
                  v-if="imgMsgObj.video"
                  class="video-wrap"
                  style="margin-bottom:-20px"
                >
                  <div class="in hv">
                    <video
                      :style="videoResize"
                      ref="video"
                      v-if="imgMsgObj.video"
                      :src="$utils.media(imgMsgObj.video, 'video')"
                      @error="replaceImage($event, 'video')"
                      :controls="true"
                    />
                    <div class="layer" @click="imgMsgObj.video = ''">
                      <Icon type="ios-close-circle" class="close" />
                    </div>
                  </div>
                </div>
              </div>
              <div v-show="5 == formMsgType" style="padding:20px 0">
                <Button
                  v-if="!imgMsgObj.keyword"
                  @click="controlDialogPublicNumber = true"
                  >选择关键字</Button
                >

                <div class="hv av" v-if="imgMsgObj && imgMsgObj.keyword">
                  <div class="ax">{{ imgMsgObj ? imgMsgObj.keyword : "" }}</div>
                  <div class="layer" @click="imgMsgObj.keyword = ''">
                    <Icon type="ios-close-circle" class="close" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--跳转网页-->
          <div
            class="msg_sender"
            v-else-if="1 == currentFormInfoByMenuId.content"
          >
            <!-- <kdx-hint-text>订阅者点击该子菜单会跳到以下链接</kdx-hint-text> -->
            <FormItem label="页面地址：" prop="content">
              <Input class="width-340" v-model="otherObj.url" />
              <span class="ck" @click="ckLink" :data-val="otherObj.url">
                选择链接
              </span>
            </FormItem>
          </div>
          <!--跳转小程序-->
          <div
            class="msg_sender"
            v-else-if="2 == currentFormInfoByMenuId.content"
          >
            <FormItem label="APPID：">
              <Input
                class="width-340"
                v-model="otherObj.appId"
                placeholder="请确保公众号与小程序已绑定"
              />
            </FormItem>

            <FormItem label="页面地址：">
              <Input
                class="width-340"
                v-model="otherObj.pageUrl"
                placeholder="请填写跳转页面的小程序访问路径"
              />
              <span
                :data-val="otherObj.pageUrl"
                class="ck"
                @click="
                  ckLink($event);
                  linkFlg = 1;
                "
                >选择链接</span
              >
            </FormItem>

            <FormItem label="URL：">
              <Input
                class="width-340"
                v-model="otherObj.url"
                placeholder="无法打开小程序时跳转的页面"
              />
              <span
                style="display:none"
                :data-val="otherObj.url"
                class="ck"
                @click="
                  ckLink($event);
                  linkFlg = 2;
                "
                >选择链接</span
              >
            </FormItem>
          </div>
        </div>
      </Form>

      <image-msg-selector
        :controlDialog="controlDialog"
        @close="controlDialog = false"
      />

      <public-number-select
        @close="keywordDialogCloase"
        :controlDialog="controlDialogPublicNumber"
      />

      <div v-if="showUnionSelect">
        <union-selector
          v-model="showUnionSelect"
          :tab-name="chooseTabs"
          :current="linkInfo"
          :disabledLink="['wx_service']"
          @on-cancel="handleCancel"
          @on-change="changeLink"
        ></union-selector>
      </div>

      <div class="footer">
        <Button :disabled="noManagePerm" class="primary-long" @click="smit">保存发布</Button>
      </div>

      <div style="display:none">
        form
        {{ menuData }}
        fffffffffffffffffffff
        {{ formData }}
        =======
        {{ currentFormInfoByMenuId }}-- =========
      </div>
    </div>
  </div>
  <div v-else class="notActive">
    点击左侧菜单进行编辑操作
  </div>
</template>
<script>
import DataSourceOption from "./data";
import ImageMsgSelector from "./ImageMsgSelector";
import { VEmojiPicker } from "v-emoji-picker";
import PublicNumberSelect from "./PublicNumberSelect";
import UnionSelector from "@/components/selector/LinkUnionSelector";
import { homeApi } from "@/api/home";

export default {
  created() {
    // 注册
    DataSourceOption.regComponent(this);
    // 获取是否是编辑的页面
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.$api.homeApi
        .menuEditById({ id: this.$route.query.id })
        .then((r) => {
          DataSourceOption.decode(r.data.menu_json);

          // init data
          this.$nextTick(()=>{
            this.txtImgData = this.imgMsgObj.media_id;
          });

          this.getImgTxtData();
        });
    } else {
      this.getImgTxtData();
    }
  },
  components: {
    ImageMsgSelector,
    VEmojiPicker,
    PublicNumberSelect,
    UnionSelector,
  },
  props: {
    parentRf: {
      type: Object,
      default: () => null,
    },
  },
  computed: {
    noManagePerm() {
        //管理权限
        return !this.$getPermMap("channel.wechat.manage");
    },
    getFormCheckFuncName() {
      let rs = "";

      if (this.isSub) {
        rs = "menuName";
      } else {
        rs = "menuName";
      }
      // console.log("@@@@@--->>>>>", rs);
      return rs;
    },
    getAlt() {
      let rs = "";

      if (this.isSub) {
        rs = "字数不超过8个汉字或16个字母";
      } else {
        rs = "字数不超过6个汉字或12个字母";
      }

      return rs;
    },
    videoResize() {
      try {
        // console.log(
        //   this.videoObj.offsetWidth,
        //   this.videoObj.offsetHeight,
        //   this.videoObj
        // );
        if (this.videoObj.offsetWidth > this.videoObj.offsetHeight) {
          return "width:320px;";
        } else {
          return "height:180px;margin:0 auto";
        }
      } catch (e) {
        return "";
      }
    },
    otherObj() {
      return this.currentFormInfoByMenuId.sourceByContent[
        this.currentFormInfoByMenuId.content
      ];
    },
    imgMsgObj() {
      return this.currentFormInfoByMenuId.sourceByContent[
        this.currentFormInfoByMenuId.content
      ][this.formMsgType];
    },
    imgSrc() {
      //   console.log(this.imgMsgObj, "@@");
      // this.imgurl
      //             ? this.$utils.media(this.imgurl)
      //             : this.$utils.staticImg("decorate/goods_col2.png");
      return this.imgMsgObj.image
        ? this.$utils.media(this.imgMsgObj.image)
        : this.$utils.staticImg("decorate/goods_col2.png");
    },
    isSub() {
      return this.currentFormInfoByMenuId.id.includes("-");
    },
    formMsgType() {
      return this.currentFormInfoByMenuId.sourceByContent[
        this.currentFormInfoByMenuId.content
      ].type;
    },

    hasChild() {
      const RES = Object.keys(this.formData).filter((item) => {
        return item.includes(this.currentFormInfoByMenuId.id + "-");
      });

      return !!RES.length;
    },
  },
  data() {
    return {
      txtImgData: "",
      txtImgLoading: false,
      txtImgFlg: false,
      imgTextItems: [],
      weixinControl: {
        isHideMenu: true,
        actionApi: {
          getList: () => this.$api.homeApi.getSyncLibItems,
          uploadFile: () => homeApi.uploadLib.api,
          deleteFile: () => this.$api.homeApi.deleteByMediaId,
          getTypeNameByMsgType: () => {
            const DIC = {
              "0": "news",
              "2": "image",
              "3": "voice",
              "4": "video",
            };

            return DIC[this.formMsgType];
          },
        },
      },
      // 链接选择器不同的标示 0 页面地址 1 APPID 2 页面地址 3 URL
      linkFlg: 0,
      chooseTabs:
        "store,goods,coupon,customPage,customLink,goodsClassify",
      showUnionSelect: false,
      keywordObj: {},
      linkInfo: {
        url: "",
        name: "",
      },
      videoObj: null,
      msgOptFlg: 1,
      msgOpt: [
        // {
        //   key: "文字",
        //   val: "1",
        // },
        {
          key: "图片",
          val: "2",
        },
        // {
        //   key: "语音",
        //   val: "3",
        // },
        {
          key: "视频",
          val: "4",
        },
        {
          key: "图文",
          val: "0",
        },
        {
          key: "关键字",
          val: "5",
        },
      ],
      showDialog: false,
      controlDialog: false,
      controlDialogPublicNumber: false,
      menuData: [],
      formData: {},
      currentFormInfoByMenuId: {},
      menuTypeDic: [
        {
          key: "发送消息",
          val: "0",
        },
        {
          key: "跳转网页",
          val: "1",
        },
        {
          key: "小程序",
          val: "2",
        },
      ],
      rules: {
        menuName: [
          { required: true, message: "请输入菜单名称" },
          {
            validator: (filed, value, callback) => {
              let china = 0;
              let eng = 0;
              let max = 0;

              if (!this.isSub) {
                // 主菜单
                // 纯数字组合
                china = 6;
                eng = china << 1;
                max = eng;
              } else {
                // 子菜单
                china = 8;
                eng = china << 1;
                max = eng;
              }

              if (
                (/^[A-z0-9]+$/.test(value) && eng < value.length) ||
                (/^[\u4e00-\u9fa5]+$/.test(value) && china < value.length) ||
                max <
                  value.match(/[\u4e00-\u9fa5]/g)?.length * 2 +
                    value.match(/[A-z0-9]/g)?.length
              ) {
                callback(new Error(this.getAlt));
              }

              callback();
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    "currentFormInfoByMenuId.id": {
      deep: true,
      handler() {
        // this.$refs["main"]?.resetFields();
        try {
          this.changeMenu();
        } catch (e) {
          // todo
        }
      },
    },
  },
  methods: {
    getImgTxtData() {
      // 获取图文列表
      this.$api.homeApi.getSyncLibItems({ type: "news" }).then((r) => {
        this.imgTextItems = r.list;
        // 如果当前选中的id 和列表没有匹配的从新选择
        let flg = 0;
        this.imgTextItems.forEach((item) => {
          if (!flg && this.txtImgData == item.media_id) {
            flg = 1;
          }
        });
        if (!flg) {
          this.$nextTick(() => {
            // console.log("@@@@@@@@@@@@------>>>>>>>>>");
            this.txtImgData = "";
          });
        }
      });
    },
    delLy() {
      setTimeout(() => {
        this.imgMsgObj.media_id = "";
        this.txtImgData = "";
      }, 0);
    },
    txtImgCancel() {
      this.txtImgFlg = false;
    },
    txtImgOk() {
      this.txtImgCancel();
      this.txtImgData = this.imgMsgObj.media_id;
    },
    ckLink(e) {
      const url = e.target.dataset.val;

      this.linkInfo = {
        name: "",
        url,
      };

      this.showUnionSelect = true;
    },
    setTextImgMid(obj = {}) {
      //   console.log("tag", obj, this.imgMsgObj);
      this.imgMsgObj.media_id = obj.media_id;
    },
    smit() {
      //   console.log(this.parentRf, "====", this.$refs["main"], "llqs");

      this.parentRf.validate((v) => {
        // console.log("@@@@####");
        if (v) {
          this.$refs["main"].validate((v) => {
            if (v) {
              // console.log(this.formData, this.otherObj, "@@@--->>>=====");

              const ITEMS = Object.values(this.formData);
              const KEYS = Object.keys(this.formData);
              // console.log("KEYS==>>", KEYS);

              for (let i = 0; i < ITEMS.length; i++) {
                if (!KEYS[i].includes("-")) {
                  // 如果是顶级的菜单子类有过掉
                  let isChild = false;
                  for (let j = 0; j < this.menuData.length; j++) {
                    if (
                      KEYS[i] == this.menuData[j].id &&
                      "string" != typeof this.menuData[j].children &&
                      this.menuData[j].children.length > 0
                    ) {
                      isChild = true;
                      break;
                    }
                  }
                  if (isChild) {
                    continue;
                  }
                }
                const O = ITEMS[i].sourceByContent[ITEMS[i].content];
                console.log(O, "@@@@@$$$$$$");
                if (!isNaN(O.type)) {
                  const R = O[O.type];
                  let res = true;
                  switch (+O.type) {
                    case 0:
                      res = R.media_id != "";
                      break;
                    case 1:
                      res = R.text != "";
                      break;
                    case 2:
                      res = R.media_id != "";
                      break;
                    case 4:
                      res = R.media_id != "";
                      break;
                    case 5:
                      res = R.keyword != "";
                      break;
                  }

                  if (!res) {
                    this.$Message.error("请设置当前菜单内容");
                    return;
                  }
                } else {
                  const V = Object.values(O);
                  let res = true;
                  for (let i = 0; i < V.length; i++) {
                    if (V[i] == "") {
                      res = false;
                      break;
                    }
                  }
                  if (!res) {
                    this.$Message.error("请设置当前菜单内容");
                    return;
                  }
                }
              }

              const R = DataSourceOption.formatDataEncode();
              (this.id
                ? this.$api.homeApi.editMenu
                : this.$api.homeApi.setMenu)({
                [this.id ? "id" : ""]: this.id,
                name: R.name,
                menu_json: {
                  publicName: DataSourceOption.publicName,
                  formData: this.formData,
                  menuData: this.menuData,
                  currentFormInfoByMenuId: this.currentFormInfoByMenuId,
                  button: R.button,
                },
              }).then((r) => {
                if (0 == r.error) {
                  //   console.log("vvvv", r, this.$toast);
                  this.$Message.success("保存成功");
                  this.$router.push({
                    path: "/home/public/lib/menu",
                  });
                }
              });
            }
          });
        }
      });
    },
    keywordDialogCloase(e) {
      this.controlDialogPublicNumber = false;

      this.keywordObj = e;

      this.imgMsgObj.keyword = e.keyword;
    },
    changeLink(e) {
      //   console.log(e, "@@@@@vvvvv=====>>>>>");
      if (0 === this.linkFlg || 2 == this.linkFlg) {
        this.otherObj.url = e.url;
      } else if (1 == this.linkFlg) {
        // todo
        this.otherObj.pageUrl = e.url;
      }
    },
    handleCancel() {
      this.showUnionSelect = false;
    },
    changeThumb(e, q) {
      //   console.log(e, "mqqqqqqqq===>>>", q);
      this.imgMsgObj.media_id = q;
      this.imgMsgObj.image = e;
    },
    changeThumbVideo(e) {
      // 记录上一次值
      let save = "";
      // 当达到阀值
      let count = 0;
      // 时间间隔
      let timer = 30;

      // 策略执行循环
      const loop = () => {
        // 每次递增时间
        timer *= 1.2;
        setTimeout(() => {
          // 重新获取对象
          const OBJ = this.$refs["video"];

          if (save != OBJ?.offsetWidth) {
            save = OBJ?.offsetWidth;
            count = 0;
          } else {
            if (save) {
              count++;
            }
          }

          if (count > 3) {
            this.videoObj = OBJ;
          } else {
            // console.log("@@@@@", count);
            loop();
          }
        }, timer);
      };

      loop();
      //   console.log("@@@@@@@@@", e);
      this.imgMsgObj.video = e.path;
      this.imgMsgObj.media_id = e.media_id;
    },
    selectEmoji(emoji) {
      // 选择emoji后调用的函数
      let input = document.getElementById("textarea");
      let startPos = input.selectionStart;
      let endPos = input.selectionEnd;
      let resultText =
        input.value.substring(0, startPos) +
        emoji.data +
        input.value.substring(endPos);
      input.value = resultText;
      input.focus();
      input.selectionStart = startPos + emoji.data.length;
      input.selectionEnd = startPos + emoji.data.length;
      this.text = resultText;
      this.imgMsgObj.text = resultText;
    },
    selectImgMsg() {
      //   console.log("selectImgMsg");
      this.controlDialog = true;
    },
    clearImgMsg() {
      for (let i in this.imgMsgObj) {
        this.imgMsgObj[i] = "";
      }
    },
    changeMenu(type = -1) {
      const R = this.currentFormInfoByMenuId.sourceByContent[
        this.currentFormInfoByMenuId.content
      ];
      if (-1 != type) {
        R.type = type;
        this.msgOptFlg = type;
      } else {
        this.msgOptFlg = R.type;
      }
      // 图文的需要更新当前的
      this.txtImgData = this.imgMsgObj.media_id;
    },
    chMenuName() {
      DataSourceOption.asyncFormDataToMenu(this.currentFormInfoByMenuId.id, {
        title: this.currentFormInfoByMenuId.menuName
          ? this.currentFormInfoByMenuId.menuName
          : this.isSub
          ? "二级菜单"
          : "菜单名称",
      });
      //   console.log("e::::::", this.currentFormInfoByMenuId);
    },
  },
};
</script>
<style scoped lang="scss">
.fm-wp {
  padding-left: 24px;
  width: 100%;
  .m {
    border: 1px solid #e7e7eb;
    background: #f4f5f9;
    width: 100%;
    height: 100%;
    padding: 12px;
  }
  .hd {
    font-size: 18px;
    border-bottom: 1px solid #e7e7eb;
    padding-bottom: 8px;
  }
}
.notActive {
  text-align: center;
  width: 100%;
  padding-top: 200px;
}

/deep/.ivu-modal-body,
.msg_sender {
  padding-bottom: 0 !important;
  /deep/.ivu-form-item-content {
    margin-left: -80px !important;
  }
  /deep/.ivu-form-item-label {
    text-align: left;
    width: 80px !important;
  }
  border: 1px solid #e7e7eb;
  padding: 16px 20px;
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
    .img_msg_wrap {
      border-radius: 2px;
      border: 1px solid #e7e7eb;
      margin-bottom: 10px;
      width: 320px;
      overflow: hidden;
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
  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 450px;
    text-align: center;
    color: $text-zhushi;
    >img {
      margin-bottom: 10px;
      width: 87px;
      height: 52px;
    }
  }
}
.textarea {
  width: 100%;
  border: 0;
  height: 180px;
  letter-spacing: 2px;
  border-bottom: 1px solid #e7e7eb;
  padding-bottom: 12px;
  margin-bottom: 12px;
}
.ck {
  cursor: pointer;
  color: #576b95;
  margin-left: 10px;
}
.del {
  cursor: pointer;
  color: #576b95;
}
/deep/.control {
  display: none !important;
}
.video-wrap {
  // margin-top: 40px;
  width: 320px;
  height: 180px;
  background: #000;
  // overflow: hidden;
  .in {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
}
.footer {
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
}
.out-wrap {
  display: flex;
  flex-wrap: wrap;
  .img_msg_wrap {
    cursor: pointer;
    margin-right: 10px;
    &.ac,
    &:hover {
      border-color: $brand-color;
    }
  }
}
.hv {
  position: relative;
  display: inline-block;
  img {
    vertical-align: bottom;
  }
  .layer {
    top: -12px;
    right: -12px;
    position: absolute;
    cursor: pointer;
  }
  &.av {
    .layer {
      right: -10px;
      top: -10px;
    }
    .ivu-icon-ios-close-circle {
      font-size: 20px;
    }
  }
}
/deep/.ivu-icon-ios-close-circle {
  font-size: 26px;
  color: #636669;
}
.ax {
  border: 1px solid var(--border-color);
  padding: 4px 15px;
  border-radius: 2px;
}

/deep/.ivu-modal-body {
  .ct {
    padding: 20px;
    padding-bottom: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .img_msg_wrap {
      margin-bottom: 20px;
      .date {
        margin: 0;
        padding: 12px;
        background: var(--background-color);
      }
      width: 306px !important;
      cursor: pointer;
      &.ac {
        border: 1px solid #2d8cf0;
      }
    }
  }
}
.player {
  position: absolute;
  top: -12px;
  right: -12px;
}
</style>
