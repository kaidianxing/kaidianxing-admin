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
    <div class="data-goods-list">
        <header-title title="全部排行">
            <template #right>
                <DatePicker v-model="date" type="daterange" :options="dateOptions" confirm split-panels placeholder="时间"
                            :clearable="false" @on-change="changeDate" @on-ok="okDate" class="width-250"></DatePicker>
            </template>
        </header-title>
        <Table ref="table" :columns="columns" :data="data" @on-sort-change="changeSort"></Table>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
        <multi-specification ref="multi_specification" :id="id"></multi-specification>
    </div>
</template>

<script>
    import HeaderTitle from "../../compnents/HeaderTitle";
    import {formatDate} from '@/assets/helpers';
    import MultiSpecification from "./MultiSpecification";

    export default {
        name: "TableList",
        components: {HeaderTitle, MultiSpecification},
        props: {
            data: {
                type: Array,
                default: () => []
            },
            total: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: '商品',
                        key: 'shop',
                        minWidth: 150,
                        render: (h, params) => {
                            return (
                                <div class="shop-box">
                                    <div class="image">
                                        <img src={this.$media(params.row.thumb)} onError={e=> {this.replaceImage(e)}}/>
                                    </div>
                                    <div class="content">
                                        <div class="content-text">
                                            <span class="mark"
                                                  style={{display: params.row.has_option === '1' ? 'inline-block' : 'none'}}>多</span>
                                            <span class="text">{params.row.title}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    },
                    {
                        title: '销售量(件)',
                        key: 'total',
                        sortable: 'custom',
                    },
                    {
                        title: '销售额',
                        key: 'price',
                        sortable: 'custom',
                        render: (h, params) => {
                            return (
                                <div>
                                    ￥{params.row[params.column.key]}
                                </div>
                            );
                        }
                    },
                    {
                        title: '浏览量(次)',
                        key: 'pv',
                        sortable: 'custom',
                    },
                    {
                        title: '商品状态',
                        key: 'status',
                        // 商品状态 状态, 1上架 2售罄 3下架 4回收站
                        render: (h, params) => {
                            if (params.row.status == '1') {
                                return (
                                    <kdx-status-text type="success">出售中</kdx-status-text>
                                );
                            } else if (params.row.status == '2') {
                                return (
                                    <kdx-status-text type="danger">已售罄</kdx-status-text>
                                );
                            } else if (params.row.status == '3') {
                                return (
                                    <kdx-status-text type="warning">仓库中</kdx-status-text>
                                );
                            }  else if (params.row.status == '4') {
                                return (
                                    <kdx-status-text type="disabled">回收站</kdx-status-text>
                                );
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            if (params.row.has_option === '1') {
                                return (
                                    <div className="action">
                                        <Button type="text"
                                                onClick={() => {
                                                    this.lookDetail(params.row);
                                                }}>查看详情</Button>
                                    </div>
                                );
                            } else {
                                return (
                                    <div>-</div>
                                );
                            }
                        }
                    }
                ],
                page: {
                    pageSize: 10,
                    pageNumber: 1 // 页码
                },
                date: [formatDate(new Date(new Date() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), formatDate(new Date(new Date() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')],
                dateOptions: {
                    disabledDate(date) {
                        return date.valueOf() > Date.now() - 24 * 60 * 60 * 1000;
                    }
                },
                id: ''
            };
        },
        methods: {
            // 重置页码
            reset() {
                this.$refs['page']?.reset();
            },
            changeDate(date) {
                this.date = date;
            },
          okDate() {
            this.$emit('on-table-date-change', this.date);
          },
            changePage(page) {
                this.$emit('on-page-change', page);
            },
            changeSort({key, order}) {
                this.$emit('on-sort', {sort: key, by: order});
            },
            // 查看详情
            lookDetail(row) {
                this.id = row.id;
                this.$nextTick(() => {
                    this.$refs['multi_specification'].setValue();
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .data-goods-list {
        padding: 30px 40px 0 40px;
        margin-top: 10px;

        /deep/ .ivu-table {
            td {
                @include font-14-20;
                // 商品
                .shop-box {
                    display: flex;
                    flex-wrap: nowrap;

                    .image {
                        width: 60px;
                        height: 60px;
                        margin-right: 10px;
                        flex-shrink: 0;
                        border: 1px solid $border-color;
                        border-radius: 2px;
                        overflow: hidden;

                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .content {
                        width: 0;
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
                            }

                            .text {
                                @include font-14-20;
                            }
                        }
                    }
                }

                .action {
                    margin-right: -8px;

                    .ivu-btn-text {
                        margin-right: 8px;
                    }
                }
            }
        }

        .footer-page {
            padding: 20px 0;
            display: flex;
            justify-content: center;
        }
    }
</style>
