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
    <div class="order-list">
        <div class="form-title">
            拼团订单
        </div>
        <div class="table-list">
            <Table ref="table" :columns="columns" :data="data">
                <template #title="{row}">
                    <div class="title-box line-hide">
                        <div class="icon">
                            <!--微信图标  订单来源 10:wap-h5 20:公众号 21:微信小程序 30:字节跳动小程序 50:PC	-->
                            <span v-if="row.create_from == '10'" class="iconfont icon-H icon"></span>
                            <!--公众号-->
                            <span v-else-if="row.create_from == '20'" class="iconfont icon-weixin icon"></span>
                            <!--微信小程序-->
                            <span v-else-if="row.create_from == '21'" class="iconfont icon-weixinxiaochengxu icon"></span>
                            <!--头条小程序-->
                            <svg-icon class="iconfont icon" type="icon-qudao-toutiao2"
                                      v-else-if="row.create_from == '30'"></svg-icon>
                            <svg-icon class="iconfont icon" type="icon-qudao-toutiaojisuban"
                                      v-else-if="row.create_from == '32'"></svg-icon>
                            <!--抖音小程序-->
                            <svg-icon class="iconfont icon" type="icon-douyin"
                                      v-else-if="row.create_from == '31'"></svg-icon>
                            <svg-icon class="iconfont icon" type="icon-qudao-App"
                                      v-else-if="row.create_from == '40'"></svg-icon>
                            <span style="color:#12aa9c;font-size:16px" class="iconfont icon-PCduan" v-else-if="row.create_from === '70'"></span>
                        </div>
                        <div class="order-no line-hide" @click="handleOrderNo(row.order_no)">
                            {{ row.order_no }}
                        </div>
                    </div>
                </template>
                <template #goods="{row}">
                    <div class="goods">
                        <div class="thumb">
                            <img :src="$media(row.thumb)" alt="" @error="replaceImage">
                        </div>
                        <div class="content">
                            <div class="title">
                                {{ row.title }}
                            </div>
                            <div class="option" v-if="row.option_title">
                                {{ row.option_title }}
                            </div>
                        </div>
                    </div>
                </template>
                <template #price_num="{row}">
                    <div class="price-num">
                        <div class="price">
                            ￥{{ row.price_unit }}
                        </div>
                        <div class="num">
                            X {{row.total}}
                        </div>
                    </div>
                </template>
                <template #create_time="{row}">
                    <div class="create-time">
                        {{ row.create_time }}
                    </div>
                </template>
                <template #user="{row}">
                    <div class="user">
                        <div class="user-name">
                            {{ row.nickname }}
                        </div>
                        <div class="user-tele">
                            {{ row.mobile }}
                        </div>
                    </div>
                </template>
                <template #payment="{row}">
                    <div class="payment">
                        <div class="price">
                            ￥{{ row.price}}
                        </div>
                        <div class="freight">
                            (含运费：¥{{row.dispatch_price}})
                        </div>
                    </div>
                </template>
                <template #payment_type="{row}">
                    <div class="payment-type alipay" v-if="row.pay_type == 30">
                        <span class="iconfont icon-alipay"></span>
                        <span>支付宝</span>
                    </div>
                    <div class="payment-type weichat" v-if="row.pay_type == 20">
                        <span class="iconfont icon-wechatpay"></span>
                        <span>微信支付</span>
                    </div>
                    <div class="payment-type balance" v-if="row.pay_type == 2">
                        <span class="iconfont icon-money-pay"></span>
                        <span>余额支付</span>
                    </div>
                </template>
                <template #order_status="{row}">
                    <div class="order-status wait brand-color" v-if="row.status == 10 && info.success == 0">
                        待成团
                    </div>
                    <div class="order-status success warning-color" v-else-if="row.status == 10 &&info.success == 1">
                        待发货
                    </div>
                    <div class="order-status success disabled-color" v-else-if="row.status == -1">
                        已关闭
                    </div>
                    <div class="order-status success success-color" v-else-if="row.status == 30">
                        已完成
                    </div>
                    <div class="order-status success warning-color" v-else-if="row.status == 20 && 20 === +row.dispatch_type">
                        待核销
                    </div>
                    <div class="order-status success brand-color" v-else-if="row.status == 20 && 20 !== +row.dispatch_type">
                        待收货
                    </div>
                </template>
            </Table>
        </div>
    </div>
</template>

<script>
export default {
    name: "OrderList",
    props: {
        data: {
            type: Array,
            default: () => []
        },
        info: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            columns: [
                {
                    title: "订单编号",
                    slot: 'title',
                },
                {
                    title: '商品名称',
                    slot: 'goods',
                    minWidth: 120
                },
                {
                    title: '单价/数量',
                    slot: 'price_num',
                    maxWidth: 150
                },
                {
                    title: '下单时间',
                    slot: 'create_time',
                    maxWidth: 200
                },
                {
                    title: '买家',
                    slot: 'user',
                    maxWidth: 150
                },
                {
                    title: '实付款',
                    slot: 'payment',
                    maxWidth: 250,
                },
                {
                    title: '支付方式',
                    slot: 'payment_type',
                    maxWidth: 200
                },
                {
                    title: '订单状态',
                    slot: 'order_status',
                    maxWidth: 150
                }
            ]
        };
    },
    methods: {
        handleOrderNo(orderNo) {
            this.$emit('on-order', orderNo)
        }
    }
};
</script>

<style lang="scss" scoped>
.order-list {
    padding: 0 40px 40px;

    .form-title {
        @include font-16-22-bold;
        color: $text-first;
        padding: 9px 20px;
        background-color: $background-color;
        border-radius: 2px;
    }

    .title-box {
        display: flex;
        align-items: center;

        .icon {
            font-size: 24px;
            margin-right: 4px;
            vertical-align: middle;
        }
        .icon-weixin {
            color: $success-color;
        }
        .icon-weixinxiaochengxu {
            color: #677de0;
        }
        .icon-toutiaoxiaochengxu {
            color: #239bff;
        }
        .icon-zhifubaoxiaochengxu {
            color: #2094e7;
        }
        .icon-baiduxiaochengxu {
            color: #306cff;
        }
        .icon-H {
            color: #ff6004;
        }

        .order-no {
            @include font-14-20;
            color: $brand-color;
            cursor: pointer;
            //word-break: break-all
        }
    }

    .goods {
        display: flex;
        align-items: center;

        .thumb {
            width: 80px;
            height: 80px;
            box-sizing: border-box;
            border: 1px solid $border-color;
            border-radius: 2px;
            flex-shrink: 0;

            img {
                max-width: 100%;
                max-height: 100%;
            }
        }

        .content {
            padding: 5px 0 5px 10px;

            .title {
                @include font-14-20;
                color: $text-first;
                @include font-multiple-omit(2);
                height: 40px;
                margin-bottom: 10px;
            }

            .option {
                @include font-12-16;
                color: $brand-color;
                padding: 2px 5px;
                background-color: $brand-light;
                border-radius: 2px;
                display: inline-block;
            }
        }
    }

    .price-num {
        @include font-14-20-bold;
        color: $text-first;
    }

    .create-time {
        @include font-14-20;
        color: $text-first;
        word-break: normal;
    }

    .user {
        @include font-14-20;
        color: $text-first;

        .user-tele {
            padding-top: 6px;
        }
    }

    .payment {
        @include font-14-20;
        color: $text-first;
    }

    .payment-type {
        @include font-14-20;
        color: $text-first;

        > .iconfont {
            color: #FFFFFF;
            font-size: 14px;
            padding-right: 2px;
            vertical-align: bottom;
        }

        &.alipay {
            .iconfont {
                color: $brand-color;
            }
        }

        &.weichat {
            .iconfont {
                color: #16B944;
            }
        }

        &.balance {
            .iconfont {
                color: #FF9900;
            }
        }

        &.yinlian {
            .iconfont {
                color: #004097;
            }
        }
    }
    .order-status {
        @include font-14-20-bold;
    }
    /deep/ .ivu-table {
        .ivu-table-tbody {
            tr {
                td {
                    border-right: 1px solid $border-color;
                    &:first-child {
                        border-left: 1px solid $border-color;
                    }
                }
            }
        }
    }
}
</style>