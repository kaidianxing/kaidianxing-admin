/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="award-list">
        <!--应用过期提示-->
        <search-header ref="search_header" @on-search="handleSearch"></search-header>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data" @on-sort-change="changeSort">
                <template slot-scope="{ row }" slot="nickname">
                    <div class="vip-info">
                        <img :src="$utils.media(row.avatar)" alt="" @error="replaceImage($event, 'avatar')"/>
                        <p class="name">
                            <span style="margin-bottom:4px;">{{ row.nickname||'-' }}</span>
                            <i class="iconfont" :class="{
                                        'icon-H': row.source === '10',
                                        'icon-weixin': row.source === '20',
                                        'icon-weixinxiaochengxu': row.source === '21'}"
                               v-if="new Set(['10', '20', '21']).has(row.source)">
                            </i>
                            <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="row.source === '30'"></kdx-svg-icon>
                            <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="row.source === '32'"></kdx-svg-icon>
                            <kdx-svg-icon class="iconfont" type="icon-douyin" v-else-if="row.source === '31'"></kdx-svg-icon>
                            <kdx-svg-icon class="iconfont" type="icon-qudao-App" v-else-if="row.source === '40'"></kdx-svg-icon>
                        </p>
                    </div>
                </template>
<!--                <template slot-scope="{ row }" slot="award">-->
<!--                    <div class="award">-->
<!--                        <p v-if="row.award&&row.award.credit">{{`积分：${row.award.credit}`}}</p>-->
<!--                        <p v-if="row.award&&row.award.balance">{{`余额：￥${row.award.balance}`}}</p>-->
<!--                        <p v-if="row.award&&row.award.redpack">{{`红包：￥${row.award.redpack}`}}</p>-->
<!--                        <kdx-hint-tooltip type="form" placement="right" v-if="row.award&&row.award.coupon">-->
<!--                            <div class="coupons-title" slot="header">-->
<!--                                优惠券-->
<!--                            </div>-->
<!--                            <div class="coupons">-->
<!--                                <div class="coupons-name" v-for="item in row.award.coupon_info" :key="item.id">-->
<!--                                    <div class="coupons-type deduction" v-if="item.coupon_sale_type === '2'">-->
<!--                                        <span>折扣券</span>-->
<!--                                        <img src="@/assets/image/coupons/subtract-blue.png" alt="">-->
<!--                                    </div>-->
<!--                                    <div class="coupons-type full-reduction" v-else>-->
<!--                                        <span>满减券</span>-->
<!--                                        <img src="@/assets/image/coupons/subtract-yellow.png" alt="">-->
<!--                                    </div>-->
<!--                                    <div class="coupons-name-content">-->
<!--                                        <div class="name">{{item.coupon_name}}</div>-->
<!--                                        <div class="content">{{item.content}}</div>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </kdx-hint-tooltip>-->
<!--                        <p v-if="row.award&&+row.award.upgrade">升级</p>-->
<!--                        <p v-if="row.award&&row.award.custom">{{row.award.custom}}</p>-->
<!--                    </div>-->
<!--                </template>-->
<!--                <template slot-scope="{ row }" slot="send_award_status">-->
<!--                    <kdx-status-text type="warning" v-if="row.send_award_status === '0'">待发放</kdx-status-text>-->
<!--                    <kdx-status-text type="success" v-if="row.send_award_status === '1'">已发放</kdx-status-text>-->
<!--                    <kdx-status-text type="danger" v-if="row.send_award_status === '-1'">已失效</kdx-status-text>-->
<!--                </template>-->
            </Table>
            <div class="footer-page" v-show="data.length > 0">
                <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchHeader from './components/SearchHeader'

    export default {
        name: "index",
        components: {
            SearchHeader
        },
        props: {},
        data() {
            return {
                query: {},
                loading: false,
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                },
                search: {},
                data: [],
                total: 0,
                columns: [
                    {
                        title: "会员昵称",
                        slot: "nickname",
                    },
                    {
                        title: "首次签到时间",
                        key: "first_date",
                        sortable: 'custom',
                        render: (h, params) => {
                            if (params.row[params.column.key]) {
                                return (
                                    <div class="vip-grade">
                                    <div class="text">{params.row[params.column.key]}</div>
                                    </div>
                            )
                            } else {
                                return (
                                    <div>-</div>
                            )
                            }
                        }
                    },
                    {
                        title: "上次签到时间",
                        key: "last_date",
                        sortable: 'custom',
                    },
                    {
                        title: "累计签到天数",
                        key: "sign_day",
                        sortable: 'custom',
                    },
                    {
                        title: "最长连续签到天数",
                        key: "longest_day",
                        sortable: 'custom',
                    },
                    {
                        title: "奖励领取情况",
                        key: 'award_time',
                        render: (h, params) => {
                            return (
                                <div>
                                   <div>积分：{ params.row.credit_num > 0 ? `${params.row.credit_num}个`:'-'}</div>
                                   <div>优惠券：{ params.row.coupon_num > 0?`${params.row.coupon_num}张` :'-'}</div>
                                </div>
                            )
                        }
                    },
                ],
            }
        },
        computed: {
            // noManagePerm(){//管理权限
            //     return !this.$getPermMap('performanceAward.record.manage')
            // },
        },
        created() {
        },
        mounted() {
            let query = this.$route.query || {};
            this.handleSearch(query);
            this.$nextTick(() => {
                this.$refs['search_header'].reset(query);
            })
        },
        methods: {
            changeSort({key,order}) {
                this.sort = {sort: key, by: order}
                this.refreshTable();
            },
            handleSearch(search) {
                this.search = search;
                this.refreshTable();
            },
            // 获取活动列表
            getList() {
                this.loading = true;
                let params = {
                    ...this.sort,
                    ...this.search,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                    ...this.query
                };
                this.$api.creditSignApi.getRecordList(params).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.data = res.list;
                        this.total = res.total;
                    }
                });
            },
            // 切换页码
            changePage(page) {
                this.page = page;
                this.getList();
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1,
                };
                this.$refs["page"].reset();
                this.getList();
            },
        },
    }
</script>

<style lang="scss" scoped>
    .award-list {
        background-color: $background-color;
        margin: 20px auto;

        .table-list {
            position: relative;
            padding: 0 20px;
            background-color: #ffffff;
            border-radius: 2px;

            .vip-info {
                display: flex;
                flex-wrap: nowrap;
                img {
                    width: 44px;
                    height: 44px;
                    border: 1px solid #e9edef;
                    box-sizing: border-box;
                    border-radius: 50%;
                    margin-right: 10px;
                }
                .name {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .iconfont {
                    font-size: 20px;
                    width: 20px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                }
                .icon-weixin {
                    color: $success-color;
                }
                .icon-weixinxiaochengxu {
                    color: #677de0;
                }
                .icon-toutiaoxiaochengxu {
                    color: #239bff;
                }

                .icon-zhifubaoxiaochengxu {
                    color: #2094e7;
                }

                .icon-baiduxiaochengxu {
                    color: #306cff;
                }

                .icon-H {
                    color: #ff6004;
                }
            }
        }
        /deep/ .ivu-table {
            // 分销商等级
            .vip-grade {
                display: flex;
                flex-wrap: nowrap;
                .icon {
                    flex-shrink: 0;
                    .kdx-svg-icon {
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
        }
    }
    // 优惠券名称
    .coupons-title {
        color: $text-first;
    }
    .coupons-name {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        height: 60px;
        border-bottom: 1px solid $border-color;
        &:last-child {
            border-bottom-width: 0;
        }

        .coupons-type {
            position: relative;
            padding: 5px 14px 5px 16px;
            border-radius: 2px;
            color: #ffffff;
            display: inline-block;
            flex-shrink: 0;
            @include font-14-20;

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

        .coupons-name-content {
            padding-left: 10px;
            @include font-14-20;
            overflow: hidden;

            .name {
                color: $text-second;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .content {
                margin-top: 4px;
                color: $text-zhushi;
                @include font-12-16;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
</style>