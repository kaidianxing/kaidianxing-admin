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
    <div class="data-transaction-make-info">
        <!--应用过期提示-->
        <div class="market-overview-box">
            <market-overview :icon_show="true" :count-data="data"></market-overview>
        </div>
        <activity-chat ref="activity_chart" :chart-line="chartLine" :chart-pie="chartPie"
                       :activity-data="activityData" @on-line-change="changeLine"></activity-chat>
        <data-list :activity-data="activity.data" :activity-total="activity.total" :goods-data="goods.data"
                   :goods-total="goods.total" @on-activity-page="changeActivityPage" @on-goods-page="changeGoodsPage"></data-list>
        <slot></slot>
    </div>
</template>
<script>
import MarketOverview from "./components/MarketOverview";
import ActivityChat from "./components/ActivityChat";
import DataList from "./components/DataList";

export default {
    components: {
        MarketOverview,
        ActivityChat,
        DataList
    },
    data() {
        return {
            data: {
                pay_price_sum: 0,
                order_count: 0,
            },
            chartLine: {
                color: ['#4A67FF', '#FF9900'],
                data: [],
                legend: ['浏览量（PV）', '访客量（UV）'],
                xAxis: [],
                yAxis: {
                    name: '单位(人)',
                    minInterval: 1
                },
                legendStyle: {
                    right: '30',
                    top: '25'
                },
                grid: {
                    left: 60,
                    right: 40,
                    bottom: 30

                }
            },
            chartPie: {
                legend: {
                    orient: 'vertical',
                    left: 60,
                    top: 90,
                    bottom: 0,
                    data: [],
                },
                radius: ['40%', '60%'],
                center: ['70%', '50%'],
                data: []
            },
            activityData: [],
            activityId: '',
            activity: {
                data: [],
                page: {
                    pageSize: 10,
                    pageNumber: 1
                }
            },
            goods: {
                data: [],
                page: {
                    pageSize: 10,
                    pageNumber: 1
                }
            }
        };
    },
    mounted() {
        this.getStatistics();
        this.getLine();
        this.getAllActivity();
        this.getActivityData();
        this.getGoodsData();
    },
    methods: {
        // 活动数据统计-渠道统计以及成交金额
        getStatistics() {
            this.$api.groupsApi.getGroupsStatistics().then(res => {
                if (res.error === 0) {
                    this.data = res?.data?.count;
                    this.chartPie.data = res.data?.channel || [];
                    this.chartPie.legend.data = res.data?.channel.map(item => item.name);
                    this.$nextTick(() => {
                        this.$refs.activity_chart?.renderPie();
                    });
                }
            });
        },
        getLine() {
            let params = {};
            if (this.activityId) {
                params.activity_id = this.activityId;
            }
            this.$api.groupsApi.getGroupsLineData(params).then(res => {
                if (res.error === 0) {
                    this.chartLine.xAxis = Object.keys(res.data);
                    this.chartLine.data = [
                        this.chartLine.xAxis.map(key => res.data[key]?.goods_view_count || 0),
                        this.chartLine.xAxis.map(key => res.data[key]?.member_view_count || 0),
                    ];
                    this.$nextTick(() => {
                        this.$refs.activity_chart?.renderLine();
                    });
                }
            });
        },
        // 获取全部活动
        getAllActivity() {
            this.$api.groupsApi.getGroupActivities({is_all: 1}).then(res => {
                if (res.error === 0) {
                    this.activityData = res.list;
                    this.activityData.unshift({
                        title: '全部',
                        id: 'all'
                    });
                }
            });
        },
        // 获取活动数据
        getActivityData() {
            let params = {
                page: this.activity.page.pageNumber,
                pagesize: this.activity.page.pageSize
            };
            this.$api.groupsApi.getGroupsActivityData(params).then(res => {
                if (res.error === 0) {
                    console.log('res', res);
                    this.activity.data = res.list || [];
                    this.activity.total = res.total;
                }
            });
        },
        getGoodsData() {
            let params = {
                page: this.goods.page.pageNumber,
                pagesize: this.goods.page.pageSize
            };
            this.$api.groupsApi.getGroupsGoodsData(params).then(res => {
                if (res.error === 0) {
                    this.goods.data = res.list || [];
                    this.goods.total = res.total;
                }
            });
        },
        changeLine(activityId) {
            this.activityId = activityId;
            this.getLine();
        },
        changeActivityPage(page) {
            this.activity.page = page;
            this.getActivityData();
        },
        changeGoodsPage(page) {
            this.goods.page = page;
            this.getGoodsData();
        }
    }
};
</script>
<style scoped lang="scss">
.data-transaction-make-info {
    margin-top: 20px;
    margin-bottom: 20px;

    .market-overview-box {
        //padding: 30px 40px;
        border-radius: 2px;
        background-color: #ffffff;
    }
}
</style>
