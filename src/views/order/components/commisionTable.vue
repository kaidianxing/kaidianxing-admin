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
        <Table ref="table" :columns="columns" :data="list"></Table>
    </div>
</template>

<script>
export default {
    name: 'ChangePriceList',
    props: {
        data: {
            type: Array,
            default: () => [],
            required: true
        },
        editable: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        data: {
            handler() {
                this.list = [...JSON.parse(JSON.stringify(this.data))]
            },
            immediate: true
        }
    },
    data() {
        return {
            list: [],
            columns: [
                {
                    title: '商品',
                    key: 'shop',
                    width: 262,
                    render: (h, params) => {
                        let label
                        if (params.row.option_title) {
                            label = (
                                <div class="shop-label">
                                    <span>{params.row.option_title}</span>
                                </div>
                            )
                        }
                        return (
                            <div class="shop">
                                <div class="shop-image">
                                    <img
                                        src={this.$media(params.row.thumb)}
                                        alt=""
                                        onError={e => {
                                            this.replaceImage(e)
                                        }}
                                    />
                                </div>
                                <div class="shop-information">
                                    <p class=" title two-line-hide">
                                        {params.row.title}
                                    </p>
                                    {label}
                                </div>
                            </div>
                        )
                    }
                },
                {
                    title: '数量',
                    key: 'number',
                    width: 56,
                    render: (h, params) => {
                        return (
                            <div class="shop-price-number">
                                <p>X{params.row.total}</p>
                            </div>
                        )
                    }
                },

                {
                    title: '小计',
                    key: 'total',
                    width: 135,
                    render: (h, params) => {
                        return (
                            <div class="shop-price-number">
                                <p>￥{params.row.price}</p>
                            </div>
                        )
                    }
                },
                {
                    title: '一级佣金',
                    key: '',
                    width: 152,
                    render: (h, { row, index }) => {
                        let template;
                        if(row.level_1.ladder_commission>0) {
                            template =
                                <div className="default-commision">
                                    阶梯佣金:￥
                                    {row.level_1.ladder_commission}
                                </div>

                        }
                        if (row.level_1) {
                            return (
                                <div>
                                    <kdx-rr-input
                                        number
                                        class="first-input"
                                        value={row.level_1.commission}
                                        disabled={!this.editable}
                                        onInput={e => {
                                            let num = e ? parseFloat(e) : e
                                            this.$set(
                                                this.list[index].level_1,
                                                'commission',
                                                num
                                            )
                                        }}
                                        on-on-blur={() => {
                                            let num = this.list[index].level_1
                                                .commission
                                                ? parseFloat(
                                                    this.list[index].level_1
                                                        .commission
                                                ).toFixed(2)
                                                : 0
                                            this.$set(
                                                this.list[index].level_1,
                                                'commission',
                                                num
                                            )
                                        }}
                                    >
                                        <template slot="prepend">
                                            <div>¥</div>
                                        </template>
                                    </kdx-rr-input>
                                    <div class="default-commision">
                                        默认佣金:￥
                                        {row.level_1.original_commission}
                                    </div>
                                    {template}
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    <div class="text-center">-</div>
                                </div>
                            )
                        }
                    }
                },
                {
                    title: '二级佣金',
                    key: '',
                    width: 152,
                    render: (h, { row, index }) => {
                        if (row.level_2) {
                            return (
                                <div>
                                    <kdx-rr-input
                                        number
                                        class="first-input"
                                        value={row.level_2.commission}
                                        disabled={!this.editable}
                                        onInput={e => {
                                            let num = e ? parseFloat(e) : e
                                            this.$set(
                                                this.list[index].level_2,
                                                'commission',
                                                num
                                            )
                                        }}
                                        on-on-blur={() => {
                                            let num = this.list[index].level_2
                                                .commission
                                                ? parseFloat(
                                                    this.list[index].level_2
                                                        .commission
                                                ).toFixed(2)
                                                : 0
                                            this.$set(
                                                this.list[index].level_2,
                                                'commission',
                                                num
                                            )
                                        }}
                                    >
                                        <template slot="prepend">
                                            <div>¥</div>
                                        </template>
                                    </kdx-rr-input>
                                    <div class="default-commision">
                                        默认佣金:￥
                                        {row.level_2.original_commission}
                                    </div>
                                </div>
                            )
                        } else {
                            return (
                                <div>
                                    <div class="text-center">-</div>
                                </div>
                            )
                        }
                    }
                },
            ]
        }
    },
    methods: {
        refreshData() {
            let keys = ['level_1', 'level_2', 'level_3']
            this.list = [...JSON.parse(JSON.stringify(this.data))].map(v => {
                keys.forEach(key => {
                    if (v[key]) {
                        v[key].commission = v[key].original_commission
                    }
                })

                return v
            })
        },
        dealData() {
            let keys = [
                'level_1',
                'level_2',
                'level_3',
                'goods_id',
                'option_id'
            ]
            let result = this.list.map(v => {
                let obj = {}
                keys.forEach(key => {
                    if (key == 'goods_id' || key == 'option_id') {
                        obj[key] = v[key]
                    } else if (v[key]) {
                        obj[key] = {
                            commission: v[key].commission
                        }
                    }
                })
                return obj
            })
            return result
        }
    }
}
</script>

<style scoped lang="scss">
.select-table-list {
    margin-top: 9px;
    border: 1px solid $border-color;
    border-bottom: none;
    border-radius: 2px;
    /deep/ .ivu-table {
        tr {
            th:first-child,
            td:first-child {
                padding-left: 20px;
            }
        }

        .ivu-input-group-prepend {
            width: 30px;
        }
        .ivu-table-header {
            background-color: $background-color;
            th {
                height: 40px;
                background-color: $background-color;

                .ivu-table-cell {
                    padding: 0;
                }
            }
        }
        .ivu-table-body {
            td {
                .ivu-table-cell {
                    padding: 10px 10px 10px 0;

                    .text-center {
                        width: 56px;
                        text-align: center;
                    }
                }
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
                        border: 1px solid $uni-border-color;

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
                            color: #197be1;
                            @include font-12-16;

                            > span {
                                background-color: $brand-light;
                                border-radius: 2px;
                                padding: 2px 8px;
                            }
                        }
                    }
                }

                .red {
                    color: $danger-color;
                }

                .default-commision {
                    margin-top: 7px;
                    @include font-12-16;
                    color: #636669;
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
                                color: #197be1;
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
