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
    <div class="send-goods-list">
        <Table :columns="columns" :data="data"></Table>
    </div>
</template>

<script>
export default {
    name: 'GoodsList',
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            columns: [
                {
                    title: '商品',
                    key: 'shop',
                    width: 300,
                    render: (h, params) => {
                        let label;
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
                                    <img src={this.$media(params.row.thumb)} onError={e=> { this.replaceImage(e)}}/>
                                </div>
                                <div class="shop-information">
                                    <div class="title two-line-hide">
                                        {params.row.title}
                                    </div>
                                    {label}
                                </div>
                            </div>
                         )
                    }
                },
                {
                    title: '数量',
                    key: 'total',
                    render: (h, params) => {
                        return h('div', `X${params.row.total}`)
                    }
                },
                {
                    title: '发货状态',
                    key: 'status',
                    render: (h, params) => {
                        if (params.row.status == 10) {
                            return (
                                <kdx-status-text type="disabled" >未发货</kdx-status-text>
                            )
                        } else if (params.row.status == -1) {
                            return (
                                <kdx-status-text type="disabled" >已关闭</kdx-status-text>
                            )
                        } else {
                            return (
                                <kdx-status-text type="success" >已发货</kdx-status-text>
                            )
                        }
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        return h('div', [
                            h(
                                'Button',
                                {
                                    props: {
                                        type: 'primary'
                                    },
                                    on: {
                                        click: () => {
                                            this.selectList(params.row.id)
                                        }
                                    },
                                    style: {
                                        display: params.row.checked
                                            ? 'inline-block'
                                            : 'none'
                                    }
                                },
                                '已选'
                            ),
                            h(
                                'Button',
                                {
                                    props: {
                                        disabled: params.row.can_send != '1' // 不可发货
                                    },
                                    class: {
                                        'default-primary': true
                                    },
                                    on: {
                                        click: () => {
                                            this.selectList(params.row.id)
                                        }
                                    },
                                    style: {
                                        display: !params.row.checked
                                            ? 'inline-block'
                                            : 'none'
                                    }
                                },
                                '选择'
                            )
                        ])
                    }
                }
            ]
        }
    },
    methods: {
        // 选中/选择
        selectList(id) {
            this.$emit('on-change', id)
        }
    }
}
</script>

<style lang="scss" scoped>
.send-goods-list {
    .shop-more {
        padding: 20px;
        background-color: $background-color;
    }

    /deep/ .ivu-table {
        td {
            .shop {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;

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
                    > .title {
                        height: 40px;
                    }

                    > .shop-label {
                        color: #197be1;
                        @include font-12-16;
                        padding-top: 4px;

                        > span {
                            background-color: $brand-light;
                            border-radius: 2px;
                            padding: 2px 8px;
                        }
                    }
                }
            }
        }
    }
}
</style>
