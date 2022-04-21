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
    <div class="data-indicator-chunk">
        <header-title title="核心销售数据" :max-width="340">
            <template #tooltip>
                <Form :label-width="85">
                    <FormItem label="成交转换率：">
                        完成订单支付的用户数/商品访客数。
                    </FormItem>
                    <FormItem label="客单价：">
                        订单总金额/商城内完成支付订单的用户数。
                    </FormItem>
                    <FormItem label="付费会员占比：">
                        付费会员数/总会员数。
                    </FormItem>
                    <FormItem label="退款率：">
                        退款订单数/支付订单数。
                    </FormItem>
                </Form>
            </template>
        </header-title>
        <ul>
            <li>
                <div class="title">
                    成交转化率
                </div>
                <div class="data">
                    {{data.pay_conversion || '0'}}
                </div>
                <div class="text-box">
                    <div cass="label">
                        支付总用户数：
                    </div>
                    <div class="label-data">
                        {{data.order_pay_member_count || '0'}}
                    </div>
                </div>
                <div class="text-box">
                    <div cass="label">
                        总访问次数：
                    </div>
                    <div class="label-data">
                        {{data.goods_view_times || '0'}}
                    </div>
                </div>
            </li>
            <li>
                <div class="title">
                    客单价
                </div>
                <div class="data">
                   ￥{{data.member_unit_price || '0'}}
                </div>
                <div class="text-box">
                    <div cass="label">
                        订单总金额：
                    </div>
                    <div class="label-data">
                       ￥{{data.order_pay_price_sum || '0'}}
                    </div>
                </div>
                <div class="text-box">
                    <div cass="label">
                        完成支付订单的用户数：
                    </div>
                    <div class="label-data">
                        {{data.order_pay_member_count || '0'}}
                    </div>
                </div>
            </li>
            <li>
                <div class="title">
                    付费会员占比
                </div>
                <div class="data">
                    {{data.pay_member_scale || '0'}}
                </div>
                <div class="text-box">
                    <div cass="label">
                        付费会员数：
                    </div>
                    <div class="label-data">
                        {{data.order_pay_member_count}}
                    </div>
                </div>
                <div class="text-box">
                    <div cass="label">
                        总会员数：
                    </div>
                    <div class="label-data">
                        {{data.member_count || '0'}}
                    </div>
                </div>
            </li>
            <li>
                <div class="title">
                    退款率
                </div>
                <div class="data">
                    {{data.refund_scale || '0'}}
                </div>
                <div class="text-box">
                    <div cass="label">
                        退款订单数：
                    </div>
                    <div class="label-data">
                        {{data.order_refund_count || '0'}}
                    </div>
                </div>
                <div class="text-box">
                    <div cass="label">
                        支付订单数：
                    </div>
                    <div class="label-data">
                        {{data.order_pay_count || '0'}}
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import HeaderTitle from "../../compnents/HeaderTitle";

    export default {
        name: "IndicatorChunk",
        components: {HeaderTitle},
        data() {
            return {
                data: {}
            };
        },
        methods: {
            getData() {
                this.$api.homeApi.getMarketData()
                    .then(res => {
                        if (res.error === 0) {
                            this.data = res.core_indicator || {};
                        }
                    });
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style scoped lang="scss">
    .data-indicator-chunk {
        padding: 30px 40px;
        margin-top: 10px;
        background-color: #ffffff;

        > ul {
            padding-top: 20px;
            display: flex;
            flex-wrap: nowrap;
            margin-right: -20px;

            > li {
                border: 1px solid $border-color;
                border-radius: 2px;
                background: linear-gradient(180deg, #F7F8FF 0%, #FFFFFF 100%);
                margin-right: 20px;
                padding: 20px;
                box-sizing: border-box;
                width: 25%;

                .title {
                    @include font-12-16;
                    color: $text-first;
                }

                .data {
                    @include font-24-34-bold;
                    color: $text-first;
                    padding: 10px 0;
                    border-bottom: 1px solid $border-color;
                }
                .label-data {
                    color: $text-first;
                }
                .text-box {
                    @include font-12-16;
                    color: $text-second;
                    display: flex;
                    justify-content: space-between;
                    padding-top: 10px;
                }
            }
        }
    }
</style>
