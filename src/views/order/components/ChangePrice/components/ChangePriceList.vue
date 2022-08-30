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
    <div class="select-table-list">
        <Table ref="table" :columns="columns" :data="data"></Table>
    </div>
</template>

<script>
    export default {
        name: "ChangePriceList",
        props: {
            data: {
                type: Array,
                default: () => [],
                required: true
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: '商品',
                        key: 'shop',
                        width: 350,
                        render: (h, params) => {
                            let label;
                            if (params.row.option_title || params.row.ext_field.content) {
                                label = (
                                    <div class="shop-label">
                                        <span>{params.row.option_title || params.row.ext_field.content}</span>
                                    </div>
                                );
                            }
                            return (
                                <div class="shop">
                                    <div class="shop-image">
                                        <img src={this.goodsImage} alt="" onError={e => {
                                            this.replaceImage(e);
                                        }}/>
                                    </div>
                                    <div class="shop-information">
                                        <p class=" title two-line-hide">
                                            {params.row.title}
                                        </p>
                                        {
                                            label
                                        }
                                    </div>
                                </div>
                            );
                        }
                    },
                    {
                        title: '单价',
                        key: 'price',
                        width: 100,
                        render: (h, params) => {
                            if (params.row?.credit) {
                                if (params.row.price_unit == 0) {
                                    return (
                                        <div class="shop-price-number">
                                            <p>{params.row.credit_unit}积分</p>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div class="shop-price-number">
                                            <p>{params.row.credit_unit}积分 + ￥{params.row.price_unit}</p>
                                        </div>
                                    )
                                }
                            }
                            return (
                                <div class="shop-price-number">
                                    <p>￥{params.row.price_unit}</p>
                                </div>
                            )
                            
                        }
                    },
                    {
                        title: '数量',
                        key: 'number',
                        width: 80,
                        render: (h, params) => {
                            return (
                                <div class="shop-price-number">
                                    <p>X{params.row.total}</p>
                                </div>
                            );
                        }
                    },
                    {
                        title: '小计',
                        key: 'total',
                        width: 100,
                        render: (h, params) => {
                            if (params.row?.credit) {
                                if (params.row.price == 0) {
                                    return (
                                        <div class="shop-price-number">
                                            <p>{params.row.credit}积分</p>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div class="shop-price-number">
                                            <p>{params.row.credit}积分 + ￥{this.getSubtotal(params.row)}</p>
                                        </div>
                                    )
                                }
                            }
                            return (
                                <div class="shop-price-number">
                                    <p>￥{this.getSubtotal(params.row)}</p>
                                </div>
                            );
                        }
                    },
                    {
                        title: '改价(小计)',
                        key: 'changePrice',
                        width: 200,
                        render: (h, params) => {
                            let option = [];
                            this.optionData.changePrice.forEach(item => {
                                option.push((
                                    <Option value={item.key}>{item.name}</Option>
                                ));
                            });
                            return (
                                <div class="shop-price-number">
                                    <kdx-rr-input value={params.row.change_price} fixed={2} number minValue={0} maxValue={9999999.99}
                                           onOn-blur={e => {
                                               this.changePriceBlur(params.index, params.row.change_price_type, e.target.value, params.row);
                                           }}>
                                        <Select value={params.row.change_price_type} slot="prepend"
                                                onOn-change={e => {
                                                    this.changePriceType(params.index, e, params.row);
                                                }}
                                                style={{backgroundColor: this.getColor(params.row.change_price_type)}}>
                                            {option}
                                        </Select>
                                        <span slot="append">元</span>
                                    </kdx-rr-input>
                                </div>
                            );
                        }
                    },
                    {
                        title: '改价后小计',
                        key: 'changeTotal',
                        minWidth: 100,
                        render: (h, params) => {
                            let total;
                            if (params.row.change_price_total) {
                                total = (
                                    <p>￥{params.row.change_price_total}</p>
                                );
                            }
                            if (params.row?.credit) {
                                if (total == 0) {
                                    return (
                                        <div class={params.row.change_price && params.row.change_price !== '0' ? 'shop-price-number red' : 'shop-price-number'}>
                                            {params.row.credit}积分
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div class={params.row.change_price && params.row.change_price !== '0' ? 'shop-price-number red' : 'shop-price-number'}>
                                            {params.row.credit}积分 + {total}
                                        </div>
                                    )
                                }
                            }
                            return (
                                <div class={params.row.change_price && params.row.change_price !== '0' ? 'shop-price-number red' : 'shop-price-number'}>
                                    {total}
                                </div>
                            );
                        }
                    }
                ],
                optionData: {
                    changePrice: [
                        {
                            id: '1',
                            name: '减价',
                            key: 'sub',
                            color: this.$css['--theme-color']
                        },
                        {
                            id: '2',
                            name: '加价',
                            key: 'add',
                            color: this.$css['--theme-color']
                        }
                    ]
                },
                message: ''
            };
        },
        computed: {
            // 适配积分商城优惠券主图
            goodsImage() {
                if (!this.data[0].thumb) {
                    if (this.data[0]?.ext_field?.coupon_sale_type == '1') {
                        return (require('@/assets/image/coupons/full-reduction.png'))
                    } else if (this.data[0]?.ext_field?.coupon_sale_type == '2') {
                        return (require('@/assets/image/coupons/discount.png'))
                    } else {
                        return (this.$media(this.data[0].thumb))
                    }
                }
                return (this.$media(this.data[0].thumb))
            }
        },
        methods: {
            handleChange(index, row) {
                this.$emit('on-change', index, row);
            },
            // 商品改价失去焦点
            changePriceBlur(index, type, value,item) {
                let data = parseFloat(value) && parseFloat(value) > 0 ? parseFloat(value).toFixed(2) : '0.00';
                this.$emit('on-change', index, type, data,item);
            },
            // 商品改价类型
            changePriceType(index, type, item) {
                this.$emit('on-type-change', index, type, item);
            },
            // 获取颜色
            getColor(key) {
                for (let option of this.optionData.changePrice) {
                    if (option.key === key) {
                        return option.color;
                    }
                }
            },
            // 计算商品小计
            getSubtotal(goods) {
                return (goods.price_unit * goods.total).toFixed(2);
            }
        }
    };
</script>

<style scoped lang="scss">
    .select-table-list {
        border: 1px solid $border-color;
        border-bottom: none;
        border-radius: 2px;
        /deep/ .ivu-table {
            .ivu-table-header {
                background-color: $background-color;
                th {
                    background-color: $background-color;
                }
            }
            .ivu-table-body {
                td {
                    // 商品信息
                    .shop {
                        display: flex;
                        flex-wrap: nowrap;
                        align-items: center;

                        > .shop-image {
                            width: 60px;
                            height: 60px;
                            margin-right: 10px;
                            box-sizing: border-box;
                            border: 1px solid $border-color;
                            border-radius: 2px;
                            overflow: hidden;
                            flex-shrink: 0;

                            > img {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        > .shop-information {
                            flex: 1;
                            width: 0;
                            > .title {
                                height: 40px;
                            }

                            > .shop-label {
                                color: #197BE1;
                                @include font-12-16;

                                > span {
                                    background-color: $brand-light;
                                    border-radius: 2px;
                                    padding: 2px 8px;
                                }
                            }
                        }
                    }

                    // 价格、数量
                    .shop-price-number {
                        .ivu-select {
                            width: 60px;
                            color: #ffffff;

                            .ivu-select-arrow {
                                color: #ffffff;
                            }
                        }
                    }

                    .red {
                        color: $danger-color;
                    }
                }
            }
        }
        // table-body
        .table-body {
            > table {
                > tr {
                    > td {
                        @include font-14-20;
                        color: $text-first;
                        padding: 10px 15px;
                        border-bottom: 1px solid $border-color;

                        // 商品信息
                        > .shop {
                            display: flex;
                            flex-wrap: nowrap;

                            > .shop-image {
                                width: 80px;
                                height: 80px;
                                margin-right: 10px;
                                box-sizing: border-box;
                                border: 1px solid $border-color;
                                border-radius: 2px;
                                overflow: hidden;
                                flex-shrink: 0;

                                > img {
                                    width: 100%;
                                    height: 100%;
                                }
                            }

                            > .shop-information {
                                flex: 1;
                                width: 0;
                                > .title {
                                    display: -webkit-box;
                                    -webkit-box-orient: vertical;
                                    -webkit-line-clamp: 3;
                                    overflow: hidden;
                                    height: 60px;
                                    word-break: break-all;
                                }

                                > .shop-label {
                                    color: #197BE1;
                                    @include font-12-16;

                                    > span {
                                        background-color: $brand-light;
                                        border-radius: 2px;
                                        padding: 2px 8px;
                                    }
                                }
                            }
                        }

                        // 价格、数量
                        > .shop-price-number {
                            .ivu-select {
                                width: 60px;
                                color: #ffffff;

                                /deep/ .ivu-select-arrow {
                                    color: #ffffff;
                                }
                            }
                        }

                        > .red {
                            color: $danger-color;
                        }
                    }
                }
            }
        }
    }
</style>
