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
    <div class="default-template">
        <!-- 公众号 -->
        <div class="default-template-content wechat" v-if="type_template=='wechat' && templateCode[type_code] && templateCode[type_code].wechat">
            <img class='bg-img' src="@/assets/image/notice/wxapp_bg.png" alt="">
            <div class="line"></div>
            <div class="wechat-notice">
                <!--<div class="left">商城</div>-->
                <div class="content">
                    <div class="template-title">{{templateCode[type_code].wechat.title}}</div>
                    <div class="template-html">
                        <div class="flex" v-for="(item, index) in templateCode[type_code].wechat.info" :key="index">
                            <div class="label">{{item.key}}：</div>
                            <div>{{item.title}}</div>
                        </div>
                    </div>
                </div>
                <!--<div class="template-link">拒收通知</div>-->
            </div>
        </div>
        <!-- 短信 -->
        <div class="default-template-content wxapp" v-if="type_template=='sms' && templateCode[type_code] && templateCode[type_code].sms">
            <img class='bg-img' src="@/assets/image/notice/sms_bg.png" alt="">
            <div class="sms-notice">
                <img class='sms-icon-img' src="@/assets/image/notice/sms_icon.png" alt="">
                <div class="message-content">{{templateCode[type_code].sms.title}}</div>
            </div>
        </div>
        <!-- 小程序 -->
        <div class="default-template-content wxapp" v-if="type_template=='wxapp' && templateCode[type_code] && templateCode[type_code].wxapp">
            <img class='bg-img' src="@/assets/image/notice/wxapp_bg.png" alt="">
            <div class="line"></div>
            <div class="wxapp-notice">
                <div class="title flex">
                    <div class="logo flex">
                        <div class="logo-icon">商城</div>
                        <div>商城</div>
                    </div>
                    <div class="dot">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="content">
                    <div class="template-title">{{templateCode[type_code].wxapp.title}}</div>
                    <div class="template-html">
                        <div class="flex" v-for="(item, index) in templateCode[type_code].wxapp.info" :key="index">
                            <div class="label">{{item.key}}</div>
                            <div>{{item.title}}</div>
                        </div>
                    </div>
                </div>
                <!--<div class="template-link">进入小程序查看</div>-->
                <div class="template-link">拒收通知</div>
            </div>
        </div>
        <!-- 微信公众号订阅-subscribe -->
        <div class="default-template-content wxapp" v-if="type_template=='subscribe' && templateCode[type_code] && templateCode[type_code].subscribe">
            <img class='bg-img' src="@/assets/image/notice/wxapp_bg.png" alt="">
            <div class="line"></div>
            <div class="wxapp-notice">
                <div class="title flex">
                    <div class="logo flex">
                        <div class="logo-icon">商城</div>
                        <div v-if="type_code == 'credit_sign_notice'">商城名称</div>
                        <div v-else>商城</div>
                    </div>
                    <div class="dot">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="content">
                    <div class="template-title">{{templateCode[type_code].subscribe.title}}</div>
                    <div class="template-html" :class="type_code == 'credit_sign_notice' ? 'template-html-creditSign': ''">
                        <div class="flex" v-for="(item, index) in templateCode[type_code].subscribe.info" :key="index">
                            <div class="label">{{item.key}}</div>
                            <div>{{item.title}}</div>
                        </div>
                    </div>
                </div>
                <div class="template-link">查看详情 <i style="float: right" class="iconfont icon-line-right"></i></div>
            </div>
        </div>
    </div>
</template>

<script>
    import templateCode from "../noticeConfig";

    export default {
        name: "defaultTemplate",
        components: {},
        props: {
            type: {
                type: String,
                default: 'wechat'
            }
        },
        data() {
            return {
                type_template: 'wechat',
                templateCode: templateCode,
                type_code: ''
            }

        },
        watch: {},
        computed: {},
        created() {
        },
        mounted() {
            this.type_template = this.type;
            this.type_code = this.$route.query.type_code;
        },
        methods: {},
    }
</script>

<style lang="scss">
    .default-template {
        position: relative;
        margin-top: 10px;
        padding: 30px 0;
        background-color: $background-color;
        .default-template-content {
            position: relative;
            margin-left: 30px;
        }
        .bg-img {
            width: 250px;
            height: 445px;
        }
        .wechat-notice,
        .wxapp-notice {
            position: absolute;
            left: -51px;
            top: 24px;
            .template-html {
                line-height: 20px;
                font-size: 14px;
                word-break: break-all;
                div.flex {
                    margin-bottom: 10px;
                    &:last-child {
                        margin-bottom: 27px;
                    }
                    .label {
                        flex-shrink: 0;
                        min-width: 83px;
                        color: #969696;
                    }
                }
            }
        }
        .line {
            position: absolute;
            left: 0;
            top: 40px;
            width: 250px;
            height: 1px;
            background-color: #E6E7EB;
        }
        .wechat-notice {
            .left {
                margin-right: 10px;
                width: 37px;
                height: 37px;
                line-height: 37px;
                background-color: #fff;
                border-radius: 2px;
                font-size: 12px;
                color: #367BF5;
                text-align: center;
            }
            .content {
                position: relative;
                width: 351px;
                padding: 18px 16px;
                background-color: #fff;
                font-size: 15px;
                color: #212121;
                border: 1px solid #E5E5E5;
                border-radius: 5px;
                transform: scale(0.66);
                /*&::after {
                    content: '';
                    position: absolute;
                    left: -4px;
                    top: 13px;
                    width: 9px;
                    height: 9px;
                    background-color: #fff;
                    border-radius: 1px;
                    transform: rotate(45deg);
                }*/
                .template-title {
                    margin-bottom: 20px;
                    line-height: 20px;
                    font-size: 14px;
                    color: #969696;
                }
            }
        }
        .wxapp-notice {
            top: 14px;
            padding-right: 6px;
            width: 351px;
            background-color: #fff;
            border: 1px solid #E5E5E5;
            border-radius: 5px;
            overflow: hidden;
            transform: scale(0.66);
            .title {
                padding: 0 20px 0 18px;
                justify-content: space-between;
                align-items: center;
                height: 54px;
                background-color: #fff;
                border-bottom: 1px solid #E5E5E5;
                .logo {
                    align-items: center;
                    font-weight: 700;
                    font-size: 13px;
                    line-height: 18px;
                    color: #1a1a1a;
                    .logo-icon {
                        margin-right: 4px;
                        width: 27px;
                        height: 27px;
                        line-height: 25px;
                        border: 1px solid #E7E7E7;
                        font-size: 9px;
                        color: #367BF5;
                        text-align: center;
                        border-radius: 50%;
                        font-weight: 500;
                        transform: scale(.8);
                    }
                }
                .dot {
                    height: 27px;
                    line-height: 27px;
                    span {
                        display: inline-block;
                        margin-left: 3px;
                        width: 5px;
                        height: 5px;
                        background-color: #c7c7cb;
                        border-radius: 50%;
                    }
                }
            }
            .content {
                padding-left: 18px;
                .template-title {
                    margin: 16px 0 34px;
                    line-height: 24px;
                    font-size: 17px;
                }
            }
            .template-link {
                padding-left: 18px;
                height: 44px;
                line-height: 44px;
                font-size: 16px;
                cursor: default;
                border-top: 1px solid #e5e5e5;
            }
        }

        .sms-notice {
            position: absolute;
            left: -22px;
            top: 86px;
            padding: 5px 12px;
            width: 274px;
            font-size: 15px;
            background-color: #E9E9EB;
            border-radius: 16px;
            transform: scale(0.66);
            .sms-icon-img {
                position: absolute;
                left: -15px;
                bottom: 2px;
                width: 34px;
                height: 41px;
            }
            .message-content {
                position: relative;
                line-height: 22px;
            }
        }
    }
</style>
