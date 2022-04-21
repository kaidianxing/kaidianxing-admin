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
   <kdx-content-bar>
        <div class="seckill-activity-data" v-loading="loading">
        <!-- 秒杀活动营销概览 -->
        <market-overview title="秒杀抢购营销概览" :time="updateTime" :icon_show="true" :show-hover="true" :count-data="statisticsData.count"></market-overview>
        <div class="flex seckill-echart">
            <!-- 活动曝光 -->
            <div class="left">
                <div class="flex space-between seckill-search">
                    <div class="title">活动曝光</div>
                    <div>
                        <Form ref="form" :label-width="80" inline @submit.native.prevent>
                            <FormItem label="活动名称：">
                                <Select v-model="model.activity_id" filterable  placeholder="请选择" class="width-250 active-name" clearable>
                                    <Option :label="active.title" :value="active.id" :key="active.id" v-for="active in activeies"></Option>
                                </Select>
                            </FormItem>
                        </Form>
                    </div>
                </div>
                <div class="chart-content">
                    <chart-line ref="chart_add_bar" id="add_bar" :height="328"
                               :data="addChart.data"
                               :xAxis="addChart.xAxis"
                               :yAxis="addChart.yAxis"
                               :legend="addChart.legend"
                               :legend-style="addChart.legendStyle"
                               :grid="addChart.grid">
                    </chart-line>
                </div>
            </div>
            <!-- 秒杀销售额占比 -->
            <div class="right">
                <div class="right-title">秒杀销售额占比</div>
                <div class="right-echart">
                    <chart-pie ref="seckill_pie" id="seckill_pie" :legend="grade.legend" :height="328" :data="gradeData" :center="grade.center" :radius="grade.radius"></chart-pie>
                </div>
            </div>
        </div>
        <!-- 活动列表 -->
        <activity-list :list="list" :total="total" @changePage="changePage"></activity-list>
    </div>
   </kdx-content-bar>
</template>

<script>
    import marketOverview from './components/MarketOverview'
    import ChartLine from "@/components/chart/ChartLine";
    import ChartPie from "@/components/chart/ChartPie";
    import activityList from './components/ActivityList'
    export default {
        name: "index",
        components: {
            marketOverview,
            ChartLine,
            ChartPie,
            activityList
        },
        props: {},
        data() {
            return {
                loading: false,
                total: 2,
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                },
                model: {
                    activity_id: ''
                },
                list: [], // 活动列表
                statisticsData: {}, // 活动数据
                grade: {
                    legend: {
                        orient: 'vertical',
                        left: 60,
                        top: 90,
                        bottom: 0,
                        data: [],
                    },
                    radius: ['40%', '60%'],
                    center: ['70%', '50%'],
                },
                gradeData: [],
                addChart: {
                    color: ['#4A67FF','#FF9900'],
                    data: [],
                    legend: ['浏览量（PV）','访客量（UV）'],
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
                activeies: [],
                updateTime: ''
            }
        },
        watch: {
            'model.activity_id'(){
                this.getView()
            }
        },
        computed: {},
        created() {
            this.getAllActivies()
            this.getData();
            this.getTime()

        },
        methods: {
            getData() {
                this.loading = true;
                this.getView();
                this.getList();
                this.$api.seckillApi.getSeckillStatistics({}).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.statisticsData = res.data;
                        this.gradeData = res.data.channel;
                        this.grade.legend.data = res.data.channel.map(item =>item.name);
                        this.$nextTick(() => {
                            this.$refs['seckill_pie'].render();
                        });
                    }
                })
            },
            getView() {
                let params = {}

                if(this.model.activity_id) {
                    params.activity_id= this.model.activity_id
                }

                this.$api.seckillApi.getSeckillStatisticsView(params).then((res) => {
                    if (res.error === 0) {
                        this.addChart.xAxis = Object.keys(res.data);
                        this.addChart.data = [
                            this.addChart.xAxis.map(key => res.data[key].goods_pv_count || 0),
                            this.addChart.xAxis.map(key => res.data[key].member_pv_count || 0),
                        ];

                        this.$nextTick(() => {
                            this.$refs['chart_add_bar'].render();
                        });
                    }
                })
            },
            getList() {
                let params = {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                };
                this.$api.seckillApi.getSeckillStatisticsList(params).then((res) => {
                    if (res.error === 0) {
                        this.list = res.list;
                        this.total = res.total
                    }
                })
            },
            getAllActivies(){
                this.$api.seckillApi.getSeckillActivityList({'is_all': 1}).then(res=>{
                    if(res.error == 0) {
                        this.activeies = res.list;
                    }
                })
            },
            getTime(){
                this.$api.seckillApi.getSeckillUpdateTime().then(res=>{
                    if(res.error == 0) {
                        this.updateTime = res.time;
                    }
                })
            },
            changePage(page) {
                this.page = page;
                this.getList()
            }
        },
    }
</script>

<style lang="scss" scoped>
.content {
    .app-overdue {
    margin-top: 0;
}}
    .seckill-activity-data {
        .seckill-echart {
            margin-top: 10px;
            height: 420px;
            justify-content: space-between;
            .left {
                padding-top: 20px;
                margin-right: 10px;
                flex: 2;
                background-color: #fff;
                border-radius: 2px;
                .seckill-search {
                    padding: 0 40px;
                    align-items: center;
                    .title {
                        font-size: 16px;
                        line-height: 22px;
                        font-weight: 600;
                    }
                }
                .ivu-form .ivu-form-item {
                    margin-bottom: 0;
                }
            }
            .right {
                padding: 20px 40px 30px;
                flex-shrink: 0;
                height: 100%;
                width: 600px;
                background-color: #fff;
                border-radius: 2px;
                .right-echart {
                    background-color: $global-bg3;
                    border: 1px solid $border-color;
                }
                .right-title {
                    margin-bottom: 20px;
                    font-size: 16px;
                    line-height: 22px;
                    font-weight: 600;
                }
            }
        }
    }
    @media  screen and (max-width: 1440px) {
        .seckill-activity-data {
           /deep/ .ivu-form {
               .active-name {
                   width: 160px !important;
               }
           }
        }
    }
</style>
