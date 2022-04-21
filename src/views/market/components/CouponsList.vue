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
    <div class="market-send-coupons-list">
        <Table :columns="columns" :data="data">
            <template slot-scope="{ row }" slot="stock">
                {{
                    row.stock_type === '0'
                        ? '不限制'
                        : parseInt(row.stock) - parseInt(row.get_total)
                }}
            </template>
        </Table>
    </div>
</template>

<script>
export default {
    name: 'CouponsList',
    props: {
        data: {
            type: Array,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        showStock: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            columns: [],
        }
    },
    methods: {
        deleteCoupons(index) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认删除该优惠券吗?',
                onOk: () => {
                    this.$emit('on-delete', index)
                },
                onCancel: () => {},
            })
        },
    },
    watch: {
        showStock: {
            handler(value) {
                if (value) {
                    this.columns = [
                        {
                            title: '优惠券名称',
                            key: 'coupon_name',
                            minWidth: 180,
                            render: (h, params) => {
                                let component
                                if (params.row.coupon_sale_type === '2') {
                                    component = [
                                        h('span', '折扣券'),
                                        h('img', {
                                            attrs: {
                                                src: require('@/assets/image/coupons/subtract-blue.png'),
                                            },
                                        }),
                                    ]
                                } else if (
                                    params.row.coupon_sale_type === '1'
                                ) {
                                    component = [
                                        h('span', '满减券'),
                                        h('img', {
                                            attrs: {
                                                src: require('@/assets/image/coupons/subtract-yellow.png'),
                                            },
                                        }),
                                    ]
                                }
                                return h(
                                    'div',
                                    {
                                        class: {
                                            'coupons-name': true,
                                        },
                                    },
                                    [
                                        h(
                                            'div',
                                            {
                                                class: {
                                                    'coupons-type': true,
                                                    deduction:
                                                        params.row
                                                            .coupon_sale_type ===
                                                        '2',
                                                    'full-reduction':
                                                        params.row
                                                            .coupon_sale_type ===
                                                        '1',
                                                },
                                            },
                                            component
                                        ),
                                        h(
                                            'div',
                                            {
                                                class: {
                                                    'coupons-name-content': true,
                                                },
                                            },
                                            [
                                                h(
                                                    'p',
                                                    {
                                                        class: {
                                                            name: true,
                                                        },
                                                    },
                                                    params.row[
                                                        params.column.key
                                                    ]
                                                ),
                                                h(
                                                    'p',
                                                    {
                                                        class: {
                                                            content: true,
                                                        },
                                                    },
                                                    params.row?.content
                                                ),
                                            ]
                                        ),
                                    ]
                                )
                            },
                        },
                        {
                            title: '库存',
                            slot: 'stock',
                            width: 80,
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 60,
                            render: (h, params) => {
                                return (
                                    <Button
                                        type="text"
                                        disabled={this.disabled}
                                        onClick={() => {
                                            this.deleteCoupons(params.index)
                                        }}
                                    >
                                        删除
                                    </Button>
                                )
                            },
                        },
                    ]
                } else {
                    this.columns = [
                        {
                            title: '优惠券名称',
                            key: 'coupon_name',
                            minWidth: 180,
                            render: (h, params) => {
                                let component
                                if (params.row.coupon_sale_type === '2') {
                                    component = [
                                        h('span', '折扣券'),
                                        h('img', {
                                            attrs: {
                                                src: require('@/assets/image/coupons/subtract-blue.png'),
                                            },
                                        }),
                                    ]
                                } else if (
                                    params.row.coupon_sale_type === '1'
                                ) {
                                    component = [
                                        h('span', '满减券'),
                                        h('img', {
                                            attrs: {
                                                src: require('@/assets/image/coupons/subtract-yellow.png'),
                                            },
                                        }),
                                    ]
                                }
                                return h(
                                    'div',
                                    {
                                        class: {
                                            'coupons-name': true,
                                        },
                                    },
                                    [
                                        h(
                                            'div',
                                            {
                                                class: {
                                                    'coupons-type': true,
                                                    deduction:
                                                        params.row
                                                            .coupon_sale_type ===
                                                        '2',
                                                    'full-reduction':
                                                        params.row
                                                            .coupon_sale_type ===
                                                        '1',
                                                },
                                            },
                                            component
                                        ),
                                        h(
                                            'div',
                                            {
                                                class: {
                                                    'coupons-name-content': true,
                                                },
                                            },
                                            [
                                                h(
                                                    'p',
                                                    {
                                                        class: {
                                                            name: true,
                                                        },
                                                    },
                                                    params.row[
                                                        params.column.key
                                                    ]
                                                ),
                                                h(
                                                    'p',
                                                    {
                                                        class: {
                                                            content: true,
                                                        },
                                                    },
                                                    params.row?.content
                                                ),
                                            ]
                                        ),
                                    ]
                                )
                            },
                        },
                        {
                            title: '操作',
                            key: 'action',
                            width: 60,
                            render: (h, params) => {
                                return (
                                    <Button
                                        type="text"
                                        disabled={this.disabled}
                                        onClick={() => {
                                            this.deleteCoupons(params.index)
                                        }}
                                    >
                                        删除
                                    </Button>
                                )
                            },
                        },
                    ]
                }
            },
            immediate: true,
        },
    },
}
</script>

<style scoped lang="scss">
.market-send-coupons-list {
    padding: 0 20px;
    background-color: #ffffff;
    /deep/ .ivu-table {
        .ivu-table-tbody tr:last-child {
            td {
                border-bottom: 0;
            }
        }
        td {
            @include font-14-20;
            // 优惠券类型
            .coupons-name {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;

                > .coupons-type {
                    position: relative;
                    padding: 5px 14px 5px 16px;
                    border-radius: 2px;
                    color: #ffffff;
                    display: inline-block;
                    flex-shrink: 0;

                    > img {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        right: -2px;
                    }
                }

                .deduction {
                    background-color: $brand-color;
                }

                .full-reduction {
                    background-color: $warning-color;
                }

                > .coupons-name-content {
                    @include font-14-20;
                    color: $text-first;
                    padding-left: 10px;
                    overflow: hidden;

                    > .name {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    > .content {
                        color: $text-third;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
}
</style>
