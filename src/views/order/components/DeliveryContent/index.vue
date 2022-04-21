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
    <kdx-modal-frame
            v-model="value"
            title="发货内容"
            :width="700"
            :is-cancel="false"
            @on-ok="handleOk"
            @on-cancel="handleCancel"
    >
        <div class="delivery">
            <div class="delivery-content">
                <div class="table">
                    <div class="theader">
                        <ul>
                            <li>序号</li>
                            <li>卡密信息</li>
                        </ul>
                    </div>
                    <div class="tbody">
                        <template>
                            <ul class="tr" v-for="(item, index) in virtual" :key="index">
                                <li>
                                    <div class="text">{{index+1}}</div>
                                </li>
                                <li>
                                    <div class="account-info">
                                        <div class="content" v-for="(val, i) in item.config" :key="i">
                                            <div class="contLi" >
                                                <span class="liTit">{{val.key}}：</span>
                                                <span class="liCont">{{item.data[`value${i+1}`]}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "index",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            virtual: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
            };
        },
        methods: {
            handleOk() {
                this.$emit('input', false)
            },
            handleCancel() {
                this.$emit('input', false)
            },
        }
    };
</script>

<style scoped lang="scss">
    .delivery {
        > .delivery-content {
            max-height: calc(100vh - 110px - 160px - 75px);
            padding: 40px;
            overflow-y: auto;
            .table {
                .tbody {
                    .no-data {
                        padding: 10px;
                        text-align: center;
                        border-top: 1px solid #e9edef;
                    }
                }
                ul {
                    display: flex;
                    align-items: center;
                    li:nth-child(1){
                        width: 123px;
                        flex-shrink: 0;
                        text-align: center;
                        padding: 10px 75px 10px 20px;
                        line-height: 20px;
                        font-size: 14px;
                        color: #262B30;
                    }
                    li:nth-child(2)
                    {
                        flex:1;
                    }
                }
                .theader {
                    ul {
                        height: 40px;
                        font-weight: bold;
                        background-color: #F4F6F8;
                        border-bottom: 1px solid #e9edef;
                        /deep/ .hint-tooltip {
                            font-size: 14px;
                            color: #939799;
                            font-weight: normal;
                        }
                        li:nth-child(2) {
                            padding: 10px 75px 10px 0;
                            line-height: 20px;
                            font-size: 14px;
                            color: #262B30;
                        }
                    }
                }
                .tbody {
                    ul {
                        padding-top: 10px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #e9edef;
                        cursor: default;
                        li:nth-child(1) {
                            text-align: center;
                            .text {
                                font-size: 12px;
                                line-height: 20px;
                                color: #262B30;
                                padding-left: 5px;
                            }
                        }
                        li:nth-child(2) {
                            display: flex;
                            align-items: center;
                        }
                    }
                }
            }
        }
    }
    .account-info {
        background: #fff;
        border-radius: px2rpx(6);
        .content {
            display: flex;
            width: 100%;
            justify-content: space-between;
            .liTit {
                color: #262B30;
                font-size: 12px;
                line-height: 16px;
                font-weight: bold;
            }
            .liCont {
                color: #262B30 ;
            }
        }
        .account-cont {
            padding: px2rpx(16) px2rpx(12);
            .item-title {
                font-weight: 500;
                font-size: 12px;
                line-height: 17px;
                color: #212121;
                margin-top: px2rpx(16);
                &:first-child {
                    margin-top: 0;
                }
            }

        }
    }
</style>
