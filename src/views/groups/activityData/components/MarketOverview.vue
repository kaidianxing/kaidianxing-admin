<template>
    <div class="market-overview">
        <div class="card-panel-title">
            <span class="title">{{title}}</span>
            <span class="time" v-if="updateTime">{{ updateTime }}</span>
        </div>
        <Row :gutter="20">
            <Col span="6">
                <div class="card-panel-box" :class="{'card-hover': showHover}">
                    <div class="flex card-panel-price">
                        <div class="icon" v-if="icon_show">
                            <img src="@/assets/image/data/data-money.png" alt="">
                        </div>
                        <div>
                            <div>成交总金额
                                <kdx-hint-tooltip>
                                    全部拼团活动的支付金额的总和，包含退款金额
                                </kdx-hint-tooltip>
                            </div>
                            <div class="price">¥{{countData.pay_price_sum || 0}}</div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col span="6">
                <div class="card-panel-box" :class="{'card-hover': showHover}">
                    <div class="flex card-panel-price">
                        <div class="icon" v-if="icon_show">
                            <img src="@/assets/image/data/data-order.png" alt="">
                        </div>
                        <div>
                            <div>累计订单数
                                <kdx-hint-tooltip>
                                    全部拼团活动的订单总数，包含取消订单数
                                </kdx-hint-tooltip>
                            </div>
                            <div class="price">{{countData.order_count || 0}}</div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col span="6">
                <div class="card-panel-box" :class="{'card-hover': showHover}">
                    <div class="flex card-panel-price">
                        <div class="icon" v-if="icon_show">
                            <img src="@/assets/image/data/data-view.png" alt="">
                        </div>
                        <div>
                            <div>活动总浏览量
                                <kdx-hint-tooltip>
                                    全部拼团活动，浏览商品详情的数据的累计，不去重
                                </kdx-hint-tooltip>
                            </div>
                            <div class="price">{{countData.goods_view_count || 0}}</div>
                        </div>
                    </div>
                </div>
            </Col>
            <Col span="6">
                <div class="card-panel-box" :class="{'card-hover': showHover}">
                    <div class="flex card-panel-price">
                        <div class="icon" v-if="icon_show">
                            <img src="@/assets/image/data/data-goods.png" alt="">
                        </div>
                        <div>
                            <div>活动商品数量
                                <kdx-hint-tooltip>
                                    拼团活动在数据更新时，所有参与活动的商品总数量
                                </kdx-hint-tooltip>
                            </div>
                            <div class="price">{{countData.sales_goods_total || 0}}</div>
                        </div>
                    </div>

                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "MarketOverview",
        components: {},
        props: {
            title: {
                type: String,
                default: '活动营销概览'
            },
            icon_show: {
                type: Boolean,
                default: false
            },
            countData: {
                type: Object,
                default: () => {
                    return {
                        pay_price_sum: '0',
                        order_count: '0',
                        goods_view_count: '0',
                        sales_goods_total: '0'
                    }
                }
            },
            time: {
                type: String,
                default: ''
            },
            showHover: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                data: {}
            }
        },
        computed: {
            updateTime() {
                console.log('update-time', this.$store.state.config?.data?.updateTimeText)
                return this.$store.state.config?.data?.updateTimeText;
            }
        },
        watch: {},
        created() {
        },
        mounted() {
        },
        methods: {},
    }
</script>

<style lang="scss" scoped>
    .market-overview {
        padding: 30px 40px;
        background-color: #fff;
        .card-panel-title {
            margin-bottom: 30px;
            font-size: 16px;
            line-height: 22px;
            color: $text-first;
            .title {
                font-weight: bold;
            }

            .time {
                margin-left: 20px;
                font-size: 14px;
                line-height: 20px;
                color: $text-second;
            }
        }
        .card-panel-box {
            padding: 20px;
            background: linear-gradient(180deg, #F7F8FF 0%, #FFFFFF 100%);
            border: 1px solid $border-color;
            border-radius: 2px;
            &.card-hover {
                &:hover {
                    border-color: $data-blue;
                    .price {
                        color: $data-blue;
                    }
                }
            }
            .card-panel-price {
                padding-top: 4px;
                font-size: 12px;
                line-height: 16px;
                color: $text-first;
                align-items: center;
                .icon {
                    margin-right: 20px;
                    margin-left: 10px;
                    width: 60px;
                    height: 60px;
                    flex-shrink: 0;
                    > img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .price {
                    margin-top: 10px;
                    font-size: 30px;
                    line-height: 36px;
                }
            }
            .card-panel-description {
                font-size: 12px;
                line-height: 16px;
                color: $text-second;
                border-top: 1px solid $border-color;
                >.flex {
                    margin-top: 10px;
                }
            }
        }
    }
    @media  screen and (max-width: 1440px) {
        .market-overview {
            .card-panel-box {
                .card-panel-price {
                    > .icon {
                        width: 48px;
                        height: 48px;
                        margin-left: 0;
                    }
                    .price {
                        font-size: 28px;
                    }
                }
            }
        }
    }
</style>
