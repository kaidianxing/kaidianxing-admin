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
    <div class="data-transaction-make-panel">
        <Row>
            <Col span="6" :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :xxl="6">
                <card-panel type="blue" :image="user" title="成交用户数(人)"
                            :class="{checked: type === 'order_pay_member_count'}"
                            @click="handleClick('order_pay_member_count')">
                    {{$utils.formatNumberData(data.order_pay_member_count)}}
                    <div class="box"></div>
                </card-panel>
            </Col>
            <Col span="6" :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :xxl="6">
                <card-panel type="blue" :image="order" title="支付笔数(笔)" :class="{checked: type === 'order_pay_count'}"
                            @click="handleClick('order_pay_count')">
                    {{$utils.formatNumberData(data.order_pay_count)}}
                    <div class="box"></div>
                </card-panel>
            </Col>
            <Col span="6" :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :xxl="6">
                <card-panel type="blue" :image="money" title="支付金额(元)"
                            :class="{checked: type === 'order_pay_price_sum'}"
                            @click="handleClick('order_pay_price_sum')">
                    {{$utils.formatNumberData(data.order_pay_price_sum)}}
                    <div class="box"></div>
                </card-panel>
            </Col>
            <Col span="6" :xs="6" :sm="6" :md="6" :lg="6" :xl="6" :xxl="6">
                <card-panel type="blue" :image="goods" title="退款金额(元)"
                            :class="{checked: type === 'order_refund_price_sum'}"
                            @click="handleClick('order_refund_price_sum')">
                    {{$utils.formatNumberData(data.order_refund_price_sum)}}
                    <div class="box"></div>
                </card-panel>
            </Col>
        </Row>
    </div>
</template>

<script>
    import CardPanel from "../../compnents/CardPanel";

    export default {
        name: "MakePanel",
        components: {CardPanel},
        props: {
            data: {
                type: Object,
                default: () => {
                }
            },
            type: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                user: require('@/assets/image/data/data-user.png'),
                order: require('@/assets/image/data/data-order.png'),
                money: require('@/assets/image/data/data-money.png'),
                goods: require('@/assets/image/data/data-goods.png')
            };
        },
        methods: {
            handleClick(type) {
                this.$emit('on-change', type);
            }
        }
    };
</script>

<style scoped lang="scss">
    .data-transaction-make-panel {
        .ivu-row {
            margin-left: -10px;
            margin-right: -10px;

            .ivu-col {
                .data-card-panel {
                    padding: 0 10px;
                   /deep/ .card-panel-box {
                        position: relative;
                        cursor: pointer;
                       &:hover {
                           border-color: $data-blue;
                           /*.box {*/
                           /*    display: inline-block;*/
                           /*}*/
                       }
                       .box {
                           position: absolute;
                           bottom: -8px;
                           right: 0;
                           left: 0;
                           width: 15px;
                           height: 15px;
                           transform: rotate(-45deg);
                           border-style: solid;
                           border-width: 0 0 1px 1px;
                           border-color: $data-blue;
                           border-radius: 0 0 0 2px;
                           background: #ffffff;
                           margin: 0 auto;
                           display: none;
                       }
                    }
                }

                .checked {
                    /deep/ .card-panel-box {
                        border: 1px solid $data-blue;
                        box-shadow: 0 0 15px rgba(0, 78, 121, 0.11);
                        .card-panel-description {
                            .data {
                                color: $data-blue;
                            }
                        }
                        .box {
                            display: inline-block;
                        }
                    }
                }
            }
        }
    }
</style>
