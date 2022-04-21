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
    <div class="goods-list-component">
        <Table ref="table" :columns="columns" :data="currentList"></Table>
        <div class="footer-page">
            <Page :total="page.total" :page-size="page.pageSize" :show-total="showTotal"
                  :show-elevator="showElevator"
                  :current.sync="page.pageNumber" :page-size-opts="pageSizeOption"
                  :show-sizer="showSizer"
                  transfer @on-change="pageNumberChange" @on-page-size-change="pageSizeChange" v-if='page.total>10'/>
        </div>
    </div>
</template>

<script>
    export default {
        name: "GoodsList",
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
                                            src: this.$media(params.row.image)
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
                                                display: params.row.hasoption ? 'inline-block' : 'none'
                                            }
                                        }, '多'),
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
                        title: '价格',
                        key: 'price',
                        minWidth: 80,
                        render: (h, params) => {
                            return h('div', {
                                class: {
                                    price: true
                                }
                            }, [
                                h('span', `￥${params.row.price}`)
                            ]);
                        }
                    },
                    {
                        title: '库存',
                        key: 'inventory',
                        minWidth: 80,
                        render: (h, params) => {
                            return h('div', params.row.inventory, [
                                h('Icon', {
                                    props: {
                                        type: 'ios-create-outline'
                                    },
                                    on: {
                                        click: () => {
                                            this.updateInformation(params.row);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('div', {
                                class: {
                                    action: true
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteShop(params.index, params.row);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                currentList: [],
                page: {
                    total: 0,
                    pageSize: 10,
                    pageNumber: 1 // 页码
                },
                showTotal: true,
                showElevator: true,
                pageSizeOption: [10, 20, 100],
                showSizer: true,
            };
        },
        methods: {
            resetPage() {
                this.page.pageSize = 10;
                this.page.pageNumber = 1;
            },
            // 获取当前显示的商品
            getPageShopData() {
                this.page.total = this.data.length;
                let start = this.page.pageSize * (this.page.pageNumber - 1),
                    end = this.page.pageSize * this.page.pageNumber;
                this.currentList = this.data.slice(start, end);
            },
            // 删除组内商品
            deleteShop(index, row) {
                let dataIndex = index = this.page.pageSize * (this.page.pageNumber - 1);
                this.$emit('on-delete', dataIndex);
            },
            pageNumberChange(pageNumber) {
                this.page.pageNumber = pageNumber;
                this.getPageShopData();
            },
            pageSizeChange(pageSize) {
                this.page.pageSize = pageSize;
                this.getPageShopData();
            },
        },
        watch: {
            data: {
                handler() {
                    this.resetPage();
                    this.getPageShopData();
                },
                immediate: true
            }
        }
    };
</script>

<style scoped lang="scss">


    .goods-list-component {
        /deep/ .ivu-table {
            td {
                padding: 10px 0;

                .shop-box {
                    display: flex;
                    flex-wrap: nowrap;

                    .image {
                        width: 60px;
                        height: 60px;
                        margin-right: 10px;
                        border-radius: 2px;

                        > img {
                            width: 100%;
                            height: 100%;
                            border-radius: 2px;
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
                                margin-right: 10px;
                                width: 18px;
                                height: 18px;
                                text-align: center;
                                line-height: 18px;
                                display: inline-block;
                            }

                            .text {
                                @include font-14-20;
                            }
                        }
                    }
                }

                .price {
                    color: $text-first;
                    @include font-14-20-bold;

                    .icon {
                        display: none;
                        cursor: pointer;
                    }

                    &:hover {
                        > .icon {
                            display: inline-block;
                        }
                    }
                }
            }
        }

        .footer-page {
            padding-top: 20px;
            display: flex;
            justify-content: center;
        }
    }
</style>
