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
    <div class="channel-manage-card" v-loading="loading">
        <div class="left">
            <div class="icon">
                <!--微信小程序-->
                <template v-if="type === 'weixin-xiaochengxu'">
                    <span class="iconfont icon-qudao-weixinxiaochengxu"></span>
                </template>
                <!--微信公众号-->
                <template v-else-if="type === 'weixin'">
                    <span class="iconfont icon-qudao-weixin"></span>
                </template>
                <!--浏览器-->
                <template v-else-if="type === 'browser'">
                    <span class="iconfont icon-qudao-liulanqi"></span>
                </template>
                <!--抖音小程序-->
                <template v-else-if="type === 'tt-dy'">
                    <kdx-svg-icon class="iconfont" type="icon-qudao-douyin2"></kdx-svg-icon>
                </template>
                <!--头条小程序-->
                <template v-else-if="type === 'tt-tt'">
                    <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao"></kdx-svg-icon>
                </template>
                <!--支付宝小程序-->
                <template v-else-if="type === 'alipay'">
                    <span class="iconfont icon-qudao-zhifubaoxiaochengxu"></span>
                </template>
                <!--百度小程序-->
                <template v-if="type === 'baidu'">
                    <span class="iconfont icon-qudao-baiduxiaochengxu"></span>
                </template>
            </div>
            <div class="left-content">
                <!--微信小程序-->
                <template v-if="type === 'weixin-xiaochengxu'">
                    <p class="title">
                        微信小程序
                    </p>
                    <p class="text">
                        微信扫描右方二维码进行预览
                    </p>
                    <p class="left-btn">
                        <Button class="btn-config" :class='{noManagePerm:noWxManagePerm}' :disabled='noWxManagePerm' v-if="data.status == '0'" @click="handleConfig">
                            配置微信小程序
                        </Button>
                        <Button class="btn-config" :class='{noManagePerm:noWxManagePerm}' :disabled='noWxManagePerm' v-else-if="data.status == '1'" @click="handleManage">
                            管理微信小程序
                        </Button>
                    </p>
                </template>
                <!--微信公众号-->
                <template v-else-if="type === 'weixin'">
                    <p class="title">
                        微信公众号
                    </p>
                    <p class="text">
                        绑定微店公众号，把店铺和微店打通
                    </p>
                    <p class="left-btn">
                        <Button class="btn-config-weixin" :class='{noManagePerm:noManagePerm}' :disabled='noManagePerm' v-if="data.status == '0'" @click="handleConfig">
                            配置微信公众号
                        </Button>
                        <Button class="btn-config-weixin" :class='{noManagePerm:noManagePerm}' :disabled='noManagePerm' v-else-if="data.status == '1'" @click="handleManage">
                            管理微信公众号
                        </Button>
                    </p>
                </template>
                <!--浏览器-->
                <template v-else-if="type === 'browser'">
                    <p class="title">
                        手机浏览器H5
                    </p>
                    <p class="text">
                        绑定微店公众号，把店铺和微店打通
                    </p>
                    <p class="left-btn">
                        <template v-if="data.is_open == '1'">
                            <Button class="btn-browser-close" :class='{noManagePerm:noManagePerm}' :disabled='noManagePerm' @click="changeStatus('0')">
                                关闭访问
                            </Button>
                            <kdx-copy-text :text="data.url">
                                <Button class="default-primary copy-link">
                                    复制链接
                                </Button>
                            </kdx-copy-text>
                        </template>
                        <template v-else-if="data.is_open == '0'">
                            <Button class="btn-browser-close" :class='{noManagePerm:noManagePerm}' :disabled='noManagePerm' @click="changeStatus('1')">
                                开启访问
                            </Button>
                        </template>
                    </p>
                </template>
                <!--头条小程序-->
                <template v-if="type === 'tt-tt'">
                    <p class="title">
                        头条小程序
                    </p>
                    <p class="text">
                        头条APP扫描右方二维码进行预览
                    </p>
                    <p class="left-btn">
                        <Button class="btn-config-tt" :class='{noManagePerm:noTtManagePerm}' :disabled='noTtManagePerm' v-if="data.status == '0'" @click="handleConfig">
                            配置头条小程序
                        </Button>
                        <Button class="btn-config-tt" :class='{noManagePerm:noTtManagePerm}' :disabled='noTtManagePerm' v-else-if="data.status == '1'" @click="handleManage">
                            管理头条小程序
                        </Button>
                    </p>
                </template>
                <!--抖音小程序-->
                <template v-if="type === 'tt-dy'">
                    <p class="title">
                        抖音小程序
                    </p>
                    <p class="text">
                        抖音APP扫描右方二维码进行预览
                    </p>
                    <p class="left-btn">
                        <Button class="btn-config-tt-dy" :class='{noManagePerm:noTtManagePerm}' :disabled='noTtManagePerm' v-if="data.status == '0'" @click="handleConfig">
                            配置抖音小程序
                        </Button>
                        <Button class="btn-config-tt-dy" :class='{noManagePerm:noTtManagePerm}' :disabled='noTtManagePerm' v-else-if="data.status == '1'" @click="handleManage">
                            管理抖音小程序
                        </Button>
                    </p>
                </template>
            </div>
        </div>
        <div class="right">
            <div class="right-image" v-if="data.status == '1'">
                <template v-if="type === 'weixin-xiaochengxu'">
                    <img :src="`${data.qrcode}?v=${new Date().getTime()}`" alt="">
                </template>
                <template v-else-if="type === 'browser'">
                    <qr-code :url="data.url"></qr-code>
                </template>
                <template v-else-if="type === 'weixin'">
                    <img :src="`${data.qrcodeimgsrc}?v=${new Date().getTime()}`" alt="">
                </template>
                <template v-else-if="type === 'tt-dy'">
                    <img :src="`${data.douyin_qrcode}?v=${new Date().getTime()}`" alt="">
                </template>
                <template v-else-if="type === 'tt-tt'">
                    <img :src="`${data.toutiao_qrcode}?v=${new Date().getTime()}`" alt="">
                </template>
            </div>
            <div class="right-icon" v-else>
                <span class="iconfont icon-erweima"></span>
            </div>
        </div>
    </div>
</template>

<script>
  import QrCode from "@/components/QrCode";

  export default {
    name: "CardChannel",
    components: {QrCode},
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('channel.wap.manage')
        },
        noWxManagePerm() { // wx管理权限
            return !this.$getPermMap('channel.wxapp.manage')
        },
        noTtManagePerm() { // tt管理权限
            return !this.$getPermMap('channel.byteDance.manage')
        },
    },
    props: {
      type: {
        type: String,
        required: true,
        validate: ['weixin-xiaochengxu', 'weixin', 'browser', 'toutiao', 'alipay', 'baidu']
      },
      text: {
        type: String
      },
      image: {
        type: String,
        default: require('@/assets/image/qr-code.png')
      },
      status: {
        type: String,
        default: '0'
      },
      data: {
        type: Object,
        default: () => {
        }
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleConfig() {
        this.$emit('on-config');
      },
      handleManage() {
        this.$emit('on-manage');
      },
      changeStatus(status) {
        this.$emit('on-change', status);
      }
    }
  };
</script>

<style scoped lang="scss">
    .channel-manage-card {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 30px 20px;
        border: 1px solid $border-color;
        border-radius: 2px;
        background-color: #FAFDFF;
        box-sizing: border-box;
        position: relative;

        > .left {
            display: flex;
            flex-wrap: nowrap;
            flex-shrink: 0;

            .icon {
                .iconfont {
                    font-size: 56px;
                }

                // 微信小程序
                .icon-qudao-weixinxiaochengxu {
                    color: $channel-weixinxiaochengxu;
                }

                // 微信公众号
                .icon-qudao-weixin {
                    color: $channel-weixin;
                }

                // 浏览器
                .icon-qudao-liulanqi {
                    color: $channel-browser;
                }

                // 头条小程序
                .icon-qudao-toutiaoxiaochengxu {
                    color: $channel-toutiao;
                }

                // 支付宝小程序
                .icon-qudao-zhifubaoxiaochengxu {
                    color: $channel-alipay;
                }

                // 百度小程序
                .icon-qudao-baiduxiaochengxu {
                    color: $channel-baidu;
                }

            }

            .left-content {
                padding-left: 20px;

                .title {
                    @include font-24-34-bold;
                    color: $text-first;
                }

                .text {
                    @include font-14-20;
                    color: $text-second;
                    padding: 10px 0 20px 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .left-btn {
                    .ivu-btn {
                        margin-right: 10px;
                        color: #ffffff;
                        border-radius: 2px;
                    }

                    .btn-config {
                        background-color: $channel-weixinxiaochengxu;
                        &:hover {
                            border-color: $channel-weixinxiaochengxu;
                        }
                    }

                    .btn-config-weixin {
                        background-color: $channel-weixin;
                    }

                    .btn-config-tt-dy {
                        background-color: $channel-douyin;
                    }

                    .btn-config-tt {
                        background-color: $channel-toutiao;
                    }

                    .btn-browser-close {
                        background-color: $channel-browser;
                        &:hover {
                            border-color: $channel-browser;
                        }
                    }

                    .copy-link {
                        border-color: $channel-browser;
                        color: $channel-browser;
                    }
                }
            }
        }

        > .right {
            .right-image {
                width: 100px;
                height: 100px;
                border: 1px solid $border-color;
                border-radius: 2px;
                box-sizing: border-box;
                overflow: hidden;
                flex-shrink: 0;

                > img {
                    width: 100%;
                    height: 100%;
                }
            }

            .right-icon {
                line-height: initial;
                > span {
                    font-size: 100px;
                    opacity: 0.1;
                }
            }
        }
    }
</style>
