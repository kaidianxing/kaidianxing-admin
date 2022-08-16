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
    <div class="good-list-table-list">
        <Table ref="table" :columns="columns" :data="data" @on-sort-change="changeSort"></Table>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TableList",
        components: {},
        props: {
            data: {
                type: Array,
                default: () => []
            },
            total: {
                type: [String, Number],
                default: 0
            },
            groupList: {
                type: Array,
                default: () => []
            },
            levelList: {
                type: Array,
                default: () => []
            },
            page: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                selectRows: [], // 选中项
                isSelectAll: false,
                columns: [
                    {
                        title: '排行',
                        width: 80,
                        render: (h, params) => {
                            let index = this.page.pageSize * (this.page.pageNumber - 1) + params.index + 1;
                            if (index === 1) {
                                return (
                                    <div class="consume-rank">
                                        <kdx-svg-icon type="icon-paihang-jinpai"></kdx-svg-icon>
                                    </div>
                                );
                            } else if (index === 2) {
                                return (
                                    <div class="consume-rank">
                                        <kdx-svg-icon type="icon-paihang-yinpai"></kdx-svg-icon>
                                    </div>
                                );
                            } else if (index === 3) {
                                return (
                                    <div class="consume-rank">
                                        <kdx-svg-icon type="icon-paihang-tongpai"></kdx-svg-icon>
                                    </div>
                                );
                            } else {
                                return (
                                    <div class="consume-rank">{index}</div>
                                );
                            }
                        }
                    },
                    {
                        title: '会员',
                        key: 'vip',
                        minWidth: 160,
                        maxWidth: 350,
                        render: (h, params) => {
                            // 用户来源 10: h5;20: 微信公众号;2:H5;21: 微信小程序;4:抖音小程序;5:支付宝小程序;
                            let component;
                            if (params.row.source == '20') {
                                // 公众号
                                component = (
                                    <span class="iconfont icon-weixin icon"></span>
                                );
                            } else if (params.row.source == '21') {
                                // 微信小程序
                                component = (
                                    <span class="iconfont icon-weixinxiaochengxu icon"></span>
                                );
                            }
                            else if (params.row.client_type == '30') {
                                // 头条小程序 字节跳动小程序
                                component = (
                                    <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2"></kdx-svg-icon>
                                );
                            }
                            else if (params.row.client_type == '32') {
                                // 头条小程序 字节跳动小程序
                                component = (
                                    <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban"></kdx-svg-icon>
                                );
                            }
                            else if (params.row.client_type == '31') {
                                // 抖音小程序 字节跳动小程序
                                component = (
                                    <kdx-svg-icon class="iconfont" type="icon-douyin"></kdx-svg-icon>
                                );
                            }
                            // else if (params.row.source == '5') {
                            //     // 支付宝小程序
                            //     component = (
                            //         <span class="iconfont icon-zhifubaoxiaochengxu icon"></span>
                            //     );
                            // }
                            else if (params.row.source == '10') {
                                // h5
                                component = (
                                    <span class="iconfont icon-H icon"></span>
                                );
                            }
                            else if(params.row.source == '70'){
                                component = (
                                    <span style="color:#12aa9c;font-size:16px" className="iconfont icon-PCduan"></span>
                                )
                            }
                            // 百度小程序
                            // <span v-if="list.create_from === '0'" class="iconfont icon-baiduxiaochengxu icon"></span>
                            return (
                                <div class="vip">
                                    <div class="vip-image">
                                        <img src={this.$media(params.row.avatar)} onError={e => {
                                            this.replaceImage(e, 'avatar');
                                        }}/>
                                    </div>
                                    <div class="vip-content">
                                        <div class="vip-name" onClick={() => {this.routerPage('vip-detail', params.row.id)}}>
                                            {params.row.nickname || '-'}
                                        </div>
                                        <div class="vip-platform">
                                            {component}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    },
                    {
                        title: '手机号码',
                        key: 'mobile',
                        minWidth: 100,
                        maxWidth: 200,
                        render: (h, params) => {
                            if (params.row[params.column.key]) {
                                return (
                                    <div>{params.row[params.column.key]}</div>
                                )
                            } else {
                                return (
                                    <div>-</div>
                                )
                            }
                        }
                    },
                    {
                        title: '会员等级',
                        key: 'level_name',
                        minWidth: 120,
                        maxWidth: 300,
                        render: (h, params) => {
                            if (!params.row?.is_default_level) {
                                return (
                                    <div class="vip-grade">
                                        <div class="icon">
                                            <kdx-svg-icon type="icon-huiyuan-bg"></kdx-svg-icon>
                                        </div>
                                        <div class="text">{params.row[params.column.key]}</div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div>{params.row[params.column.key]}</div>
                                );
                            }
                        }
                    },
                    {
                        title: '消费金额',
                        key: 'order_money',
                        minWidth: 100,
                        sortable: 'custom',
                        render: (h, params) => {
                            return (
                                <div class="consume">￥{params.row[params.column.key]}</div>
                            );
                        }
                    },
                    {
                        title: '订单数量',
                        key: 'order_count',
                        minWidth: 100,
                        maxWidth: 200,
                        sortable: 'custom',
                        render: (h, params) => {
                            let data = parseInt(params.row[params.column.key]);
                            if (!data && data !== 0) {
                                return (
                                    <div>-</div>
                                );
                            } else if (data <= 999) {
                                return (
                                    <div>{data}</div>
                                );
                            } else {
                                return (
                                    <div>'999+'</div>
                                );
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        minWidth: 100,
                        maxWidth: 150,
                        render: (h, params) => {
                            return (
                                <div class="action">
                                    <Button type="text" onClick={() => {
                                        this.routerPage('order',params.row.id);
                                    }}>查看订单</Button>
                                </div>
                            );
                        }
                    }
                ],
            };
        },
        methods: {
            changePage(page) {
                this.$emit('on-change-page', page);
            },
            // 排序
            changeSort({key, order}) {
                if (order === 'normal') {
                    this.$emit('on-sort', {});
                } else {
                    this.$emit('on-sort', {sort: key, by: order});
                }
            },
            reset() {
                this.$refs['page'].reset();
            },
            // 查看订单详情
            routerPage(type, id) {
                let query = {}, path = '';
                if (type === 'vip-detail') {
                    path = '/member/detail';
                    query = {
                        id
                    }
                } else {
                    path = '/order/list/all';
                    query = {
                        search_field: 'member_id',
                        keywords: id
                    }
                }
                this.$utils.openNewWindowPage(path, query);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .good-list-table-list {
        /deep/.ivu-table {
            td {
                // 排行
                .consume-rank {
                    text-align: center;

                    .svg-icon {
                        font-size: 40px;
                    }
                }

                // 会员
                .vip {
                    display: flex;
                    flex-wrap: nowrap;

                    > .vip-image {
                        width: 46px;
                        height: 46px;
                        border-radius: 100%;
                        border: 1px solid $border-color;
                        box-sizing: border-box;
                        overflow: hidden;
                        flex-shrink: 0;

                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    > .vip-content {
                        padding-left: 10px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        > .vip-name {
                            width: 100%;
                            padding-bottom: 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: $brand-color;
                            cursor: pointer;
                        }

                        > .vip-platform {
                            > .icon {
                                font-size: 18px;
                                margin-right: 10px;
                                vertical-align: middle;
                            }

                            .icon-weixin {
                                color: $success-color;
                            }
                            .icon-weixinxiaochengxu {
                                color: #677DE0;
                            }
                            .icon-toutiaoxiaochengxu {
                                color: #239BFF;
                            }

                            .icon-zhifubaoxiaochengxu {
                                color: #2094E7;
                            }

                            .icon-baiduxiaochengxu {
                                color: #306CFF;
                            }

                            .icon-H {
                                color: #FF6004;
                            }
                        }
                    }
                }

                // 会员等级
                .vip-grade {
                    display: flex;
                    flex-wrap: nowrap;
                    .icon {
                        flex-shrink: 0;
                        .svg-icon {
                            font-size: 20px;
                            padding-right: 4px;
                            vertical-align: bottom;
                        }
                    }
                    .text {
                        width: 0;
                        flex: 1;
                    }
                }

                // 消费金额
                .consume {
                    color: $text-first;
                    font-weight: bold;
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
