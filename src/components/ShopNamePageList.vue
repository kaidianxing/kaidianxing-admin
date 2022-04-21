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
        <div class="footer-page" v-show="total > 10">
            <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FullReductionList",
        props: {
            list: {
                type: Array,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: '商品',
                        key: 'shop',
                        render: (h, params) => {
                            let getType = {
                                goodsText: ''
                            };
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
                                            error: e => {
                                                this.replaceImage(e);
                                            }
                                        }
                                    })
                                ]),
                                // 商品标题
                                h('div', {
                                    'class': {
                                        'title-content': true
                                    }
                                }, [
                                    h('div', {
                                        'class': {
                                            'content-text': true
                                        },
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
                                                },
                                                style: {
                                                     display: params.row.type ? 'inline-block' : 'none'
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
                        width: 100,
                        render: (h, params) => {
                            return (
                                <Button type="text" disabled={this.disabled} onClick={() => {this.deleteList(params.index, params.row)}}>
                                            删除
                                </Button>
                            )
                        }
                    }
                ],
                page: {
                    pageSize: 10,
                    pageNumber: 1 // 页码
                },
                data: [],
                total: 0
            };
        },
        watch: {
            list: {
                handler() {
                    this.$nextTick(() => {
                        this.reset()
                    });
                },
                immediate: true,
                deep: true,
            }
        },
        methods: {
            handlePageChange(page) {
                this.page = page;
                this.getPageData();
            },
            // 获取当前显示的商品
            getPageData() {
                this.total = this.list.length;
                let start = this.page.pageSize * (this.page.pageNumber - 1),
                    end = this.page.pageSize * this.page.pageNumber;
                this.data = this.list.slice(start, end);
            },
            reset() {
                this.$refs['page']?.reset();
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.getPageData();
            },
            deleteList(index) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除该商品吗?',
                    onOk: () => {
                        let pageIndex = (this.page.pageNumber-1)*this.page.pageSize + index;
                        this.$emit('on-delete', pageIndex);
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
        padding: 0 20px;
        background-color: #ffffff;
        /deep/ .ivu-table {
            .ivu-table-body {
                margin-bottom: -2px;
            }
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
                        border: 1px solid $border-color;
                        border-radius: 2px;
                        overflow: hidden;

                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .title-content {
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
        .footer-page {
            border-top: 1px solid $border-color;
            background-color: #ffffff;
            padding-top: 20px;
            display: flex;
            justify-content: center;
        }
    }
</style>
