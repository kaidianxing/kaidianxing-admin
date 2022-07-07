<template>
    <div class="groups-data-list">
        <Tabs value="name1" :animated="false">
            <TabPane label="活动数据" name="name1">
                <Table :columns="activity.columns" :data="activityData">
                    <template #activity_time="{row}">
                        <div class="time flex">起：{{ getTime(row.start_time) }}</div>
                        <div class="time flex">止：{{ getTime(row.end_time) }}</div>
                    </template>
                    <template #pay_price_sum="{row}">
                        <div class="activity-price">
                            {{row.pay_price_sum}}
                        </div>
                    </template>
                    <template #pay_price_sum="{row}">
                        <div class="activity-price">
                            {{row.pay_price_sum}}
                        </div>
                    </template>
                </Table>
                <div class="footer-page">
                    <kdx-page-component ref="page" :total="activityTotal" @on-change="changeActivityPage"></kdx-page-component>
                </div>
            </TabPane>
            <TabPane label="商品数据" name="name2">
                <Table :columns="goods.columns" :data="goodsData">
                    <template #goods="{row}">
                        <div class="goods">
                            <div class="image">
                                <img :src="$media(row.thumb)" alt="" @error="replaceImage">
                            </div>
                            <div class="title">
                                {{row.title}}
                            </div>
                        </div>
                    </template>
                    <template #pay_price="{row}">
                        <div class="activity-price">
                            {{row.pay_price}}
                        </div>
                    </template>
                    <template #refund_price="{row}">
                        <div class="activity-price">
                            {{row.refund_price}}
                        </div>
                    </template>
                </Table>
                <div class="footer-page">
                    <kdx-page-component ref="page" :total="goodsTotal" @on-change="changeGoodsPage"></kdx-page-component>
                </div>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
export default {
    name: "DataList",
    props: {
        activityData: {
            type: Array,
            default: () => []
        },
        goodsData: {
            type: Array,
            default: () => []
        },
        activityTotal: {
            type: Number,
            default: 0
        },
        goodsTotal: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            activity: {
                columns: [
                    {
                        title: '活动名称',
                        key: 'title',
                        minWidth: 230
                    },
                    {
                        title: '活动时间',
                        slot: 'activity_time',
                        minWidth: 130,
                        maxWidth: 300
                    },
                    {
                        title: '停止时间',
                        key: 'stop_time',
                        render: (h, params) => {
                            return <div>{this.getTime(params.row[params.column.key])}</div>
                        }
                    },
                    {
                        title: '拼团订单',
                        key: 'order_count',
                        render:(h,params)=> {
                            return <div>{this.formatData(params.row.order_count)}</div>
                        },
                    },
                    {
                        title: '成交金额',
                        slot: 'pay_price_sum',
                        render:(h,params)=> {
                            return <div>{this.formatData(params.row.pay_price_sum)}</div>
                        },
                    },
                    {
                        title: '退款金额',
                        slot: 'refund_price_sum',
                        minWidth: 90,
                        render:(h,params)=> {
                            return <div>{this.formatData(params.row.refund_price_sum)}</div>
                        },
                    },
                    {
                        title: '参与人数',
                        key: 'pay_member_count',
                        minWidth: 90,
                        maxWidth: 200,
                        render:(h,params)=> {
                            return <div>{this.formatData(params.row.pay_member_count)}</div>
                        },
                    }
                ]
            },
            goods: {
                columns: [
                    {
                        title: '商品名称',
                        slot: 'goods'
                    },
                    {
                        title: '成交商品数',
                        key: 'order_count'
                    },
                    {
                        title: '成交金额',
                        slot: 'pay_price'
                    },
                    {
                        title: '退款金额',
                        slot: 'refund_price'
                    },
                    {
                        title: '参与人数',
                        key: 'member_count'
                    }
                ]
            }
        };
    },
    methods: {
        changeActivityPage(page) {
            this.$emit('on-activity-page', page);
        },
        changeGoodsPage(page) {
            this.$emit('on-goods-page', page);
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
};
</script>

<style lang="scss" scoped>
.groups-data-list {
    background-color: #ffffff;
    margin-top: 10px;
    /deep/ .ivu-tabs {
        .ivu-tabs-bar {
            padding: 0 30px;
            margin-bottom: 0;
            .ivu-tabs-tab {
                padding: 12px 30px;
                font-size: 16px;
            }
        }
        .ivu-tabs-content {

        }
        .ivu-table-wrapper {
            margin: 0 20px;
        }
    }
    .activity-price  {
        @include font-14-20-bold;
        color: $text-first;
    }
    .goods {
        display: flex;
        align-items: center;
        .image {
            width: 60px;
            height: 60px;
            border: 1px solid $border-color;
            box-sizing: border-box;
            flex-shrink: 0;
            border-radius: 2px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .title {
            flex: 1;
            width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            max-height: 40px;
            padding-left: 10px;
            @include font-14-20;
            color: $text-first;
        }
    }
}
</style>
