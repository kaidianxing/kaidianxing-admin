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
    <div class="activity-list">
        <Table ref="table" :columns="columns" :data="list">
            <template slot-scope="{ row }" slot="date">
                <div class="time">起：<span style="word-break: normal;">{{ row.start_time |filterTime }}</span></div>
                <div class="time">止：<span style="word-break: normal;">{{ row.end_time |filterTime }}</span></div>
            </template>
        </Table>
        <div class="footer-page" v-if="total>10">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ActivityList",
        components: {},
        props: {
            list: {
                type: Array,
                default: () => []
            },
            total: {
                type: [String, Number],
                default: 0
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: '活动名称',
                        key: 'title',
                        minWidth: 230
                    },
                    {
                        title: '起止时间',
                        slot: 'date',
                        minWidth: 130,
                        maxWidth: 300
                    },
                     {
                        title: '成交订单',
                        key: 'order_count',
                        // sortable: true,
                        minWidth: 90,
                        maxWidth: 300,
                        render:(h,params)=> {
                            return <div>{this.formatData(params.row.order_count)}</div>
                        },
                    },
                    {
                        title: '成交金额',
                        key: 'pay_price_sum',
                        // sortable: true,
                        minWidth: 90,
                        render:(h,params)=> {
                            return <div>{this.formatData(params.row.pay_price_sum)}</div>
                        },
                    },

                    {
                        title: '累计优惠金额',
                        key: 'refund_price_sum',
                        // sortable: true,
                        minWidth: 90,
                        render:(h,params)=> {
                            return <div>{this.formatData(params.row.refund_price_sum)}</div>
                        },
                    },
                    {
                        title: '销售数量',
                        key: 'sales_goods_total',
                        // sortable: true,
                        minWidth: 90,
                        render:(h,params)=> {
                            return <div>{this.formatData(params.row.sales_goods_total)}</div>
                        },
                    },
                    {
                        title: '成交人数',
                        key: 'pay_member_count',
                        // sortable: true,
                        minWidth: 90,
                        maxWidth: 200,
                        render:(h,params)=> {
                            return <div>{this.formatData(params.row.pay_member_count)}</div>
                        },
                    }
                ]
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        filters: {
            filterTime(time){
                if(time == '0000-00-00 00:00:00') {
                    return '-'
                } else {
                    return time
                }
            }
        },
        methods: {
            changePage(page) {
                this.$emit('changePage', page)
            },
             getTime(time) {
                if (time === '0000-00-00 00:00:00') {
                    return '-'
                } else {
                    return time
                }
            },
            formatData(data){
                if(!!data && (typeof data!="number")){
                    return data
                } else {
                    return '-'
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .activity-list {
        position: relative;
        margin-top: 10px;
        padding: 0 20px;
        background-color: #ffffff;
        border-radius: 2px;
        .time {
            display: flex;
        }
    }
</style>
