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
    <div class="full-mail-list">
        <Table :columns="columns" :data="data"></Table>
    </div>
</template>

<script>
    export default {
        name: "FullReductionList",
        props: {
            data: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: '商品',
                        key: 'shop',
                        minWidth: 450,
                        render: (h, params) => {
                            let getType;
                            switch (params.row.type) {
                                case '0':
                                    getType = {
                                        goodsText : '实'
                                    }
                                    break;

                                case '1':
                                    getType = {
                                        goodsText : '虚'
                                    }
                                    break;

                                case '2':
                                    getType = {
                                        goodsText: '密'
                                    }
                                    break;

                                case '3':
                                    getType = {
                                        goodsText: '预'
                                    }
                                    break;
                            }
                            return h('div', {
                                'class': {
                                    'shop-box': true
                                }
                            }, [
                                // image
                                h('div', {
                                    'class': {
                                        'image': true
                                    }
                                }, [
                                    h('img', {
                                        attrs: {
                                            src: this.$media(params.row.thumb)
                                        },
                                      on: {
                                          error: e=> {
                                            this.replaceImage(e)
                                          }
                                      }
                                    })
                                ]),
                                // 商品标题
                                h('div', {
                                    'class': {
                                        content: true
                                    }
                                }, [
                                    h('div', {
                                        'class': {
                                            'content-text': true
                                        },
                                        on: {
                                            click: e => {
                                                this.startUpdateShopName(params.index);
                                                e.stopPropagation();
                                            }
                                        }
                                    }, [
                                        // 多规格标志
                                        h('span', {
                                            'class': {
                                                mark: true
                                            },
                                            style: {
                                                display: params.row.has_option === '1' ? 'inline-block' : 'none'
                                            }
                                        }, '多'),
                                        // 实体、虚拟商品标志
                                        h(
                                            'span',
                                            {
                                                class: {
                                                    mark: true,
                                                    real: params.row.type === '0',
                                                    virtual: params.row.type === '1',
                                                    secret: params.row.type === '2',
                                                }
                                            },
                                            getType.goodsText
                                        ),
                                        h('span', {
                                            'class': {
                                                text: true
                                            }
                                        }, params.row.title)
                                    ])
                                ])
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'text'
                                },
                                on: {
                                    click: () => {
                                        this.deleteList(params.index, params.row);
                                    }
                                }
                            }, '删除');
                        }
                    }
                ]
            };
        },
        methods: {
            deleteList(index) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除该商品吗?',
                    onOk: () => {
                        this.$emit('on-delete', index);
                    },
                    onCancel: () => {

                    }
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .full-mail-list {
        /deep/ .ivu-table {
            th {
                padding: 0;

                .ivu-table-cell {
                    padding: 15px;
                }
            }

            td {
                .shop-box {
                    display: flex;
                    flex-wrap: nowrap;

                    .image {
                        width: 60px;
                        height: 60px;
                        margin-right: 10px;

                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .content {
                        width: 100%;
                        flex: 1;

                        .content-text {
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            height: 50px;
                            padding: 10px 0;

                            .mark {
                                @include font-12-16;
                                color: #ed4014;
                                background-color: #ffefe6;
                                border-radius: 2px;
                                margin-right: 4px;
                                width: 18px;
                                height: 18px;
                                text-align: center;
                                line-height: 18px;
                                display: inline-block;
                                &:nth-last-child(2) {
                                    margin-right: 6px;
                                }
                                &.real {
                                    background-color: #F0FAFF;
                                    color: $brand-color;
                                }
                                &.virtual {
                                    background-color: #E6FFF9;
                                    color: #00C5C5;
                                }
                                &.secret {
                                    background-color: #FFCDD0;
                                    color: #FF000F;
                                }
                            }

                            .text {
                                @include font-14-20;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
