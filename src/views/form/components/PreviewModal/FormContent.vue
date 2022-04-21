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
    <div class="form-content">
        <div class="form-content-header" :class="{'phone-main-content-box-goods': type === 'goods'}">
            <div class="phone-top">

                <img style="width:258px;" v-if="type==='order'" :src="require('@/assets/image/form/order_header.png')" alt />
                <img style="width:258px;" v-else-if="type === 'commission'" :src="require('@/assets/image/form/commission_header.png')" alt />
                <img style="width:258px;" v-else-if="type==='vip'" :src="require('@/assets/image/form/vip_header.png')" alt />
                <img style="width:258px;" v-else-if="type==='goods'" :src="require('@/assets/image/form/goods_header.png')" alt />
                <template v-else>
                    <img style="width:258px; display: block" :src="require('@/assets/image/decorate/status-bar.png')" alt />
                    <img style="width:258px;" :src="require('@/assets/image/decorate/navbar.png')" alt />
                    <p class="page-title">页面名称</p>
                </template>
            </div>
            <div class="phone-content">
                <div class="phone-main-top">
                    <div class="phone-manual" :class="{'phone-manual-radius': !items.length}" v-if="type === 'commission'">
                        <div class="phone-manual-item">
                            <div class="label flex1">
                                请填写申请信息
                            </div>
                        </div>
                        <div class="phone-manual-item">
                            <div class="label">
                                <span class="label-required">*</span>
                                <span>邀请人</span>
                            </div>
                            <div class="content">
                                请填写邀请人
                            </div>
                        </div>
                        <div class="phone-manual-item">
                            <div class="label">
                                姓名
                            </div>
                            <div class="content">
                                请填写姓名
                            </div>
                        </div>
                        <div class="phone-manual-item">
                            <div class="label">
                                手机号
                            </div>
                            <div class="content">
                                请填写手机号
                            </div>
                        </div>
                    </div>
                </div>
                <div class="phone-main-content" :class="{'phone-main-radius': !type || type === 'order'}">
                    <div v-for="(item,index) in items" :key='index' class="phone-main-content-item">
                        <form-items :model='item'></form-items>
                    </div>
                </div>
                <div class="commission-footer" v-if="type === 'commission'">
                    <div class="protocol">
                        <div class="checkbox"></div>
                        <div class="text">
                            我已阅读并了解了
                            <span>《申请成为分销商协议》</span>
                        </div>
                    </div>
                    <div class="commission-btn">
                        申请成为分销商
                    </div>
                    
                </div>
                </div>
        </div>
        <div class="form-content-footer" v-if="type === 'order' || type === 'goods'">
            <div class="order-footer">
                <img v-if="type==='order'" style="width:258px;display: block" :src="require('@/assets/image/form/order_foot.png')" alt />
                <img v-else-if="type === 'goods'" style="width:258px;display: block" :src="require('@/assets/image/form/goods_foot.png')" alt />
            </div>
        </div>
    </div>
</template>

<script>
    import FormItems from '../templates/index'
    export default {
        name: "FormContent",
        components:{
            FormItems
        },
        props: {
            type: {
                type: String,
                default: ''
            },
            items: {
                type: Array,
                default: () => []
            }
        }
    };
</script>

<style scoped lang="scss">
    .form-content {
        display: flex;
        flex-direction: column;
        height: 100%;

        .form-content-header {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding-bottom: 10px;
            &.phone-main-content-box-goods {
                background-color: #FFFFFF;
            }
            .phone-top {
                position: relative;
                .page-title {
                    position: absolute;
                    top: 20px;
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    font-weight: bold;
                }
            }
            .phone-content {
                    margin: 0 6px;
                    width: 375px;
                    transform: scale(0.65);
                    -webkit-transform-origin: left top;
                    .phone-manual {
                        background-color: #FFFFFF;
                        /*margin: 0 12px;*/
                        padding-left: 12px;
                        border-top-left-radius: px2rpx(12);
                        border-top-right-radius: px2rpx(12);
                        &.phone-manual-radius {
                            border-radius: px2rpx(12);
                        }
                        .phone-manual-item {
                            padding: 14px 0;
                            border-bottom: 1px solid $border-color;
                            display: flex;
                            flex-wrap: nowrap;
                            >.label {
                                @include font-14-20;
                                color: #212121;
                                width: 80px;
                                flex-shrink: 0;
                                > .label-required {
                                    color: $danger-color;
                                    width: 12px;
                                    display: inline-block;
                                }
                            }
                            >.content {
                                @include font-14-20;
                                color: #CCCCCC;
                            }
                        }
                    }
                    .phone-main-content {
                        background-color: #ffffff;
                        border-bottom-left-radius: 6px;
                        border-bottom-right-radius: 6px;
                        padding-bottom: px2rpx(16);
                        &:phone-main-radius {
                            border-radius: 6px;
                        }
                        .phone-main-content-item {
                            /*padding-bottom: px2rpx(16);*/
                            /*margin-left: px2rpx(12);*/
                            /*border-bottom: 1px solid #E6E7EB;*/
                        }
                    }
                    .commission-footer {
                        padding: 0 12px;
                        margin-top: 10px;
                        >.protocol {
                            display: flex;
                            padding: 0 0 12px 12px;
                            .checkbox {
                                width: 14px;
                                height: 14px;
                                border: 1px solid #FFFFFF;
                                background-color: #FFFFFF;
                                border-radius: 2px;
                            }
                            .text {
                                font-size: 12px;
                                line-height: 17px;
                                color: #212121;
                                padding-left: 6px;
                                > span {
                                    color: #367BF5 ;
                                }
                            }
                        }
                        >.commission-btn {
                            width: 100%;
                            height: 40px;
                            text-align: center;
                            font-size: 14px;
                            line-height: 20px;
                            font-weight: bold;
                            color: #FFFFFF;
                            background-color: #FF3C29;
                            border-radius: 20px;
                            padding: 10px 0;
                        }
                        > .commission-hint {
                            padding: 8px 0 8px 15px;
                            font-size: 12px;
                            line-height: 17px;
                            color: #969696;
                        }
                    }
                }
        }
        .form-content-footer {
            flex-shrink: 0;
        }
    }
</style>
