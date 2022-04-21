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
    <div v-loading="loading">
        <div class="notice-buyer-index">
            <kdx-form-title v-if="is_title">{{typeTitle[type.group_item_name]}}</kdx-form-title>
            <!-- 通知列表 -->
            <div class="flex notice-buyer-index-box">
                <div class="notice-list-box" @click="toDetail(item.scene_code, item.item)"
                     v-for="(item, index) in list" :key="index">
                    <Card class="notice-list">
                        <div class="card-title flex space-between" slot="title">
                            <div class="flex align-center">
                                <i class="iconfont" :class="templateCode[item.scene_code].icon"></i>
                                <span class="title-name">{{templateCode[item.scene_code].title}}</span>
                            </div>
                            <div>
                                <i class="iconfont icon-line-right"></i>
                            </div>
                        </div>
                        <div class="list-card-content" v-if="item.item">
                            <div class="flex list-card-child" v-if="item.item.wechat">
                                <div>微信模板消息</div>
                                <i class="iconfont"
                                   :class="item.item.wechat.status == 1?'icon-chenggong-shixin success-color':'icon-del danger-color'"></i>
                            </div>
                            <div class="flex list-card-child" v-if="item.item.sms">
                                <div>{{type.group_item_name == 'verify_code' ? '短信验证':'短信通知'}}</div>
                                <i class="iconfont"
                                   :class="item.item.sms.status == 1?'icon-chenggong-shixin success-color':'icon-del danger-color'"></i>
                            </div>
                            <div class="flex list-card-child" v-if="item.item.wxapp">
                                <div>微信小程序订阅消息</div>
                                <i class="iconfont"
                                   :class="item.item.wxapp.status == 1?'icon-chenggong-shixin success-color':'icon-del danger-color'"></i>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import templateCode from "./noticeConfig";
    export default {
        name: "list",
        components: {},
        props: {
            type: {
                type: Object,
                default: () => {}
            },
            is_title: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                loading: false,
                templateCode: templateCode,
                list: [],
                typeTitle: {
                    basic: '基础通知',
                    sale: '营销通知',
                    verify_code: '验证码',
                    buyer_notice: '买家通知',
                    seller_notice: '卖家通知'
                }
            }
        },
        watch: {
            type: {
                handler(newValue) {
                    this.getList(newValue)
                },
                deep: true,
                immediate: true
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            getList(obj) {
                this.loading = true;
                this.$api.noticeApi.getNoticeList(obj).then(res => {
                    this.loading = false;
                    this.list = res.data;
                })
            },
            toDetail(type_code, item) {
                let obj = {
                    type_code,
                    items: Object.keys(item)
                };
                this.$emit('toDetail', obj);
            }
        },
    }
</script>

<style lang="scss" scoped>
    .notice-buyer-index {
        /*padding: 40px;
        margin-top: 20px;
        min-height: 100%;
        background-color: #FFFFFF;*/

        .notice-buyer-index-box {
            flex-wrap: wrap;
            margin-right: -30px;
            .notice-list-box {
                margin-bottom: 30px;
                margin-right: 30px;
                /*&:nth-child(4n) {*/
                /*    margin-right: 0;*/
                /*}*/
            }
            .notice-list {
                width: 324px;
                height: 200px;
                border: 1px solid $border-color;
                color: $text-first;
                border-radius: 6px;
                /deep/ .ivu-card-head {
                    padding: 20px;
                    border-bottom: 1px solid $border-color;
                }

                /deep/ .ivu-card-body {
                    padding: 20px;
                }

                .card-title {
                    align-items: center;
                    font-weight: bold;
                    font-size: 18px;
                    line-height: 25px;

                    > .flex i {
                        margin-right: 6px;
                        font-size: 24px;
                        color: $text-first;
                        font-weight: 500;
                    }
                }

                .list-card-content {
                    .list-card-child {
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 10px;
                        font-size: 14px;
                        line-height: 20px;

                        &:last-child {
                            margin-bottom: 0;
                        }

                        i {
                            font-size: 16px;
                        }
                    }
                }
            }
        }
    }
</style>
