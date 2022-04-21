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
    <kdx-modal-frame v-model="value" title="订单改价" :width="1000" @on-cancel="handleCancel" @on-ok="handleOk">
        <div class="order-list-change-price">
            <div class="header">
                <kdx-hint-alert type="error">该订单最多支持 <span class="bold">10</span> 次改价，您已经修改了 <span class="bold">{{data.change_price_count}}</span> 次，改价之后的价格不能小于0元</kdx-hint-alert>
                <div class="btn">
                    <Button type="text" :to="`/order/change-price-record?id=${id}`" target="_blank">查看改价记录</Button>
                </div>
            </div>
            <!--运费修改-->
            <div class="freight">
                <Form :label-width="80">
                    <FormItem label="修改运费：">
                        <kdx-rr-input v-model="data.dispatch_price" number :fixed="2" :minValue="0" :maxValue="9999999.99" :disabled="!goodsType" class="width-160" @on-blur="changeFreight">
                            <span slot="append">元</span>
                        </kdx-rr-input>
                    </FormItem>
                </Form>
            </div>
            <!--列表-->
<!--            {{data.order_goods}}-->
            <div class="change-price-list">
                <change-price-list :data="data.order_goods" @on-change="changePrice"
                                   @on-type-change="changeTypePrice"></change-price-list>
            </div>
            <!--合计-->
            <div class="shop-total">
                <div class="shop-total-content">
                    <div class="shop-total-content-item">
                        <div class="label">
                            商品合计 <span class="change-price-tag" v-show="totalChange">改</span> ：
                        </div>
                        <div class="price">
                            ￥{{data.total_price}}
                        </div>
                    </div>
                    <div class="shop-total-content-item" v-if="goodsType">
                        <div class="label">
                            运费 <span class="change-price-tag" v-show="dispatchChange">改</span> ：
                        </div>
                        <div class="price">
                            ￥{{data.dispatch_price}}
                        </div>
                    </div>
                    <div class="shop-total-content-item emphasize">
                        <div class="label">
                            买家实付：
                        </div>
                        <div class="price">
                            ￥{{data.pay_price}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    import ChangePriceList from "./components/ChangePriceList";

    export default {
        name: "index",
        components: {ChangePriceList},
        props: {
            id: {
                type: [Number, String],
                required: true
            }
        },
        data() {
            return {
                value: false,
                model: {
                    change_freight: '', // 改价
                    freight: '0',
                    total: '0',
                    payment: '0'
                },
                data: {},
                isChangePrice: false,
                number: 1,
                totalChange: false,
                dispatchChange: false
            };
        },
        computed: {
            /* 获取商品类型 == 处理非实体商品运费置灰与隐藏  */
            goodsType() {
                let goodsInfo = this.data.order_goods, goods_type,
                    dispatch_type = this.data.dispatch_type;
                if(goodsInfo && goodsInfo.length > 0) {
                    goods_type = goodsInfo[0]?.type
                }
                return goods_type == 0 && dispatch_type != '20'
            },
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    this.reset();
                    this.getData();
                }
            },
            handleCancel() {
                this.value = false;
            },
            handleOk() {
                if (parseInt(this.data.change_price_count) >= 10) {
                    this.$Message.error('订单最多支持10次改价');
                    return;
                }
                let change_item = [];
                let goods_type;
                this.data.order_goods.forEach(item => {
                    let price_change = item.change_price;
                    if (item.change_price_type === 'sub') {
                        price_change = `-${price_change}`;
                    }
                    if (price_change && price_change !== '0') {
                        let obj = {
                            id: item.id,
                            price_change
                        }
                        change_item.push(obj);
                    }
                    goods_type = item.type
                });
                let params = {
                    order_id: this.id,
                    total_price: this.data.pay_price,
                };
                goods_type == '3' ? params.order_type = '30' : ''
                if (this.dispatchChange) {
                    params.dispatch_price = this.data.dispatch_price;
                }
                if (change_item.length > 0) {
                    params.change_item = change_item;
                }
                this.$api.orderApi.setChangePrice(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('订单改价成功');
                            this.setValue();
                            this.$emit('on-refresh');
                        }
                    });
            },
            /**
             * 改价
             * @param index 索引
             * @param type 类型(sub/add)
             * @param value 数值
             * @constructor
             */
            changePrice(index, type, value) {
                this.totalChange = true;
                if (value === this.data.order_goods[index].change_price && value === '9999999.99') {
                    this.$set(this.data.order_goods[index], 'change_price', '0.00');
                    this.$nextTick(() => {
                        this.$set(this.data.order_goods[index], 'change_price', value);
                    })
                } else {
                    this.$set(this.data.order_goods[index], 'change_price', value);
                }
                if (type === 'add') {
                    let price = (parseFloat(this.data.order_goods[index].price_original) + parseFloat(value)).toFixed(2);
                    this.$set(this.data.order_goods[index], 'change_price_total', price);

                } else if (type === 'sub') {
                    let price = (parseFloat(this.data.order_goods[index].price_original) - parseFloat(value)).toFixed(2);
                    this.$set(this.data.order_goods[index], 'change_price_total', price);
                }
                this.isChangePrice = true;
                this.calculateShopTotal();
                this.data.order_goods = JSON.parse(JSON.stringify(this.data.order_goods));
            },
            changeTypePrice(index, type, item) {
                this.$set(this.data.order_goods[index], 'change_price_type', type);
                this.changePrice(index, type, this.data.order_goods[index].change_price, item);
            },
            // 运费改变
            changeFreight() {
                this.dispatchChange = true;
                this.$nextTick(() => {
                    if (parseFloat(this.data.dispatch_price) && parseFloat(this.data.dispatch_price) > 0) {
                        this.data.dispatch_price = parseFloat(this.data.dispatch_price).toFixed(2);
                    } else {
                        this.data.dispatch_price = '0.00';
                        this.$set(this.data, 'dispatch_price', '0.00');
                    }
                    this.calculateShopPayment();
                })
            },
            // 计算商品合计
            calculateShopTotal() {
                let total = 0;
                this.data.order_goods.forEach(item => {
                    total += parseFloat(item.change_price_total);
                });
                this.data.total_price = total.toFixed(2);
                this.calculateShopPayment();
            },
            // 计算实付款
            calculateShopPayment() {
                this.data.pay_price = (parseFloat(this.data.total_price) + parseFloat(this.data.dispatch_price)).toFixed(2);
            },
            getData() {
                this.$api.orderApi.getChangePrice({order_id: this.id})
                    .then(res => {
                        if (res.error === 0) {
                            this.initData(res);
                        }
                    });
            },
            initData(data) {
                data.order_goods.forEach(item => {
                    item.change_price = '0';
                    item.change_price_type = 'add';
                    item.change_price_total = item.price;
                });
                data.total_price = (parseFloat(data.pay_price) - parseFloat(data.dispatch_price)).toFixed(2);
                this.data = data;
            },
            reset() {
                this.totalChange = false;
                this.dispatchChange = false;
            }
        }
    };
</script>

<style scoped lang="scss">
    .order-list-change-price {
        padding: 20px;

        > .header {
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            padding-bottom: 10px;

            .ivu-alert {
                color: $danger-color;
                background-color: $danger-light;
                border-color: $danger-color;

                /deep/ .ivu-alert-icon {
                    color: $danger-color;
                }
            }
        }

        > .freight {
            padding: 30px;
            background-color: $background-color;

            /deep/.ivu-form .ivu-form-item {
                margin-bottom: 0 !important;
            }
        }

        > .change-price-list {
            padding: 10px 0;
        }

        // 商品合计
        .shop-total {
            display: flex;
            flex-wrap: nowrap;
            justify-content: flex-end;

            > .shop-total-content {
                > .shop-total-content-item {
                    padding-bottom: 10px;
                    padding-right: 40px;
                    @include font-14-20;
                    color: $text-first;

                    > .label {
                        display: inline-block;
                        width: 100px;
                        text-align: right;

                        > .change-price-tag {
                            @include font-12-16;
                            color: $danger-color;
                            background-color: $danger-light;
                            border-radius: 2px;
                            padding: 1px 3px;
                        }
                    }

                    > .price {
                        display: inline-block;
                        padding-left: 10px;
                    }
                }

                // 强调
                .emphasize {
                    @include font-14-20-bold;
                    color: $danger-color;
                    .price {
                        font-size: 16px;
                    }
                }
            }
        }
    }
</style>
