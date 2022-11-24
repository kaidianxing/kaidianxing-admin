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
    <div class="table-list-box">
        <div class="table-list">
            <Table :columns="columns" :data="data">
                <!--会员-->
                <template slot-scope="{ row }" slot="nickname">
                    <div class="vip-info" @click="jumpVip(row.member_id)">
                        <img :src="$utils.media(row.avatar)" alt="" @error="replaceImage($event, 'avatar')"/>
                        <p class="name">
                            <span class="rr-brand-color pointer" style="margin-bottom:4px;">{{ row.nickname||'-' }}</span>
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
            </Table>
            <div class="footer-page" v-show="total > 10">
                <kdx-page-component :current='current' :pageSize='pageSize' ref="page" :total="total"
                                @on-change="changePage"></kdx-page-component>
            </div>
        </div>

    </div>
</template>

<script>
import { formatDate } from '@/assets/helpers'

export default {
    name: "TableList",
    components: {},
    props: {
        data: {
            type: Array,
            default: () => []
        },
        total: {
            type: Number,
            default: 0
        },
        pageSize: {
            type: Number,
            default: 10
        },
        current: {
            type: Number,
            default: 1
        },
        loading: {
            type: Boolean,
            default: false
        },
        //搜索时间
        date: {
            type: Array
        }
    },
    data() {
        return {
            model: {
                keywords: '',
                search_field: 'nickname',
                level_id: 'all',
                sort: '',
                by: ''
            },
            columns: [
                {
                    title: '分销商',
                    slot: 'nickname',
                },
                {
                    title: '分销商等级',
                    key: 'level_name',
                    render: (h, params) => {
                        if (params.row[params.column.key]) {
                            return (
                                <div class="vip-grade">
                                    <div class="icon">
                                        <kdx-svg-icon type="icon-fenxiaoshang-bg"></kdx-svg-icon>
                                    </div>
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
                    title: '阶梯佣金',
                    key: 'ladder_commission_sum',
                    render: (h, params) => {
                        if (params.row[params.column.key]) {
                            return (
                                <div>￥{params.row[params.column.key]}</div>
                            )
                        } else {
                            return (
                                <div>-</div>
                            )
                        }
                    }
                },
                {
                    title: '订单金额',
                    key: 'order_price_sum',
                    render: (h, params) => {
                        if (params.row[params.column.key]) {
                            return (
                                <div>￥{params.row[params.column.key]}</div>
                            )
                        } else {
                            return (
                                <div>-</div>
                            )
                        }
                    }
                },
                {
                    title: '订单数量',
                    key: 'order_number_count',
                    render: (h, params) => {
                        return (
                            <p class="name">
                                    <span class="rr-brand-color pointer"
                                          onClick={() => {
                                              this.goUrl(params.row.member_id);
                                          }}
                                    >{params.row[params.column.key]}</span>
                            </p>
                        );
                    }
                },
            ]
        }
    },
    computed: {},
    created() {
    },
    mounted() {
    },
    methods: {
        // 跳转会员详情
        jumpVip(id) {
            this.$utils.openNewWindowPage('/vip/detail', { id: id, type: 'commission' })
        },
        changePage(page) {
            this.$emit('on-page-change', page);
        },
        resetPage() {
            this.$refs['page'].reset();
        },
        // 订单数量跳转
        goUrl(id) {
            let start_time = `${formatDate(this.date[0],'yyyy-MM-dd')} 00:00`;
            let end_time = `${formatDate(this.date[1],'yyyy-MM-dd')} 00:00`;
            this.$router.push({
                path: "/commissionAssessment/order/list",
                query: {
                    member_id: id,
                    start_time,
                    end_time
                }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.table-list-box {
    margin-top: 10px;
    background-color: #ffffff;
    .table-list {
        padding: 0 20px 20px 20px;
        position: relative;
        border-radius: 2px;
    }
    /deep/ .ivu-table {
        .ivu-table-header {
            height: 60px;
            background: #F4F6F8;
            thead tr th{
                background: #F4F6F8;
                height: 60px;
                border-bottom: none;
            }
        }
        .ivu-table-cell {
            padding: 14px 15px;
        }
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
</style>