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
    <div class="condition-comp">
        <condition-title
            title="经营状况"
            :text="$store.state.config.data.updateTimeText"
            :max-width="340"
        >
            <template #tooltip>
                <Form :label-width="60">
                    <FormItem label="成交总额：">已支付订单总金额(不包括退款的金额)</FormItem>
                    <FormItem label="订单数：">成交订单数 - 退款订单数</FormItem>
                    <FormItem label="笔单价：">成交金额 / 订单数</FormItem>
                    <FormItem label="支付人次：">订单的支付人次(需剔除在筛选时间段中全部退款的支付人次(部分退款算支付人次))</FormItem>
                    <FormItem label="客单价：">成交金额 / 支付人数</FormItem>
                    <FormItem>
                        <template #label>
                            <div class="top">浏览量：</div>
                            <div class="bottom" style="padding-right: 10px;">(PV)</div>
                        </template>
                        所有用户的访问页面数量总和(1个用户多个页面计多次，多次访问同1个页面计1次)
                    </FormItem>
                    <FormItem>
                        <template #label>
                            <div class="top">独立访客：</div>
                            <div class="bottom" style="padding-right: 10px;">(UV)</div>
                        </template>
                        商城独立访客总人数(1天多次访问商城记1次）
                    </FormItem>
                    <FormItem label="新增会员：">新增的注册会员人数</FormItem>
                </Form>
            </template>
            <template #right>
                <div class="condition-title-right">
                    <RadioGroup
                        type="button"
                        class="chart-time-type"
                        v-model="lineRequestParam.period"
                        @on-change="changePeriod"
                    >
                        <Radio label="day" :disabled="dayDisabled">日</Radio>
                        <Radio label="month">月</Radio>
                        <Radio label="year">年</Radio>
                    </RadioGroup>
                    <DatePicker
                        class="width-250"
                        type="daterange"
                        confirm
                        split-panels
                        placeholder="时间"
                        :clearable="false"
                        :options="dateOptions"
                        @on-change="changeDate"
                        @on-ok="okDate"
                        v-model="date"
                    ></DatePicker>
                </div>
            </template>
        </condition-title>
        <div class="chart">
            <chart-panel :data="panelData" :type="lineRequestParam.type" @on-change="changePanel" v-if='chart.list.length'/>
            <chart-line
                ref="chart_line"
                id="operating_conditions"
                :is-area-style="true"
                :data="chart.list"
                :xAxis="chart.xAxis"
                :yAxis="chart.yAxis"
                :legend="chart.legend"
                :legend-style="chart.legendStyle"
                :area-style="chart.areaStyle"
                :loading="chart.loading"
                :grid="chart.grid"
                @chartLineMounted='chartLineMounted'
            ></chart-line>
        </div>
    </div>
</template>

<script>
import { formatDate } from "@/assets/helpers";
export default {
    components: { 
        ConditionTitle:()=>import("./ConditionTitle.vue"), 
        ChartPanel:()=>import("./ChartPanel.vue"), 
        ChartLine:()=>import("@/components/chart/ChartLine.vue"), 
    },
    data() {
        return {
            date: [
                formatDate(
                    new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                    "yyyy-MM-dd"
                ),
                formatDate(
                    new Date(new Date() - 24 * 60 * 60 * 1000),
                    "yyyy-MM-dd"
                )
            ],
            dateOptions: {
                disabledDate(date) {
                    return date.valueOf() > Date.now() - 24 * 60 * 60 * 1000;
                }
            },
            // 经营状况面板数据
            panelData: {},
            dayDisabled: false, // 禁用日筛选
            // yAxis坐标轴配置
            yAxisConfig: {
                order_pay_price: {
                    name: "成交总额",
                    yAxis: "单位(元)"
                },
                order_pay: {
                    name: "订单数",
                    yAxis: "单位(件)"
                },
                unit_price: {
                    name: "笔单价",
                    yAxis: "单位(元)"
                },
                order_pay_member: {
                    name: "支付人次",
                    yAxis: "单位(人次)"
                },
                guest_unit_price: {
                    name: "客单价",
                    yAxis: "单位(元)"
                },
                pv: {
                    name: "浏览量PV",
                    yAxis: "单位(次)"
                },
                uv: {
                    name: "独立访客UV",
                    yAxis: "单位(人)"
                },
                new_member: {
                    name: "新增会员",
                    yAxis: "单位(人)"
                }
            },
            // 折线图请求数据
            lineRequestParam: {
                start_date: formatDate(
                    new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                    "yyyy-MM-dd"
                ),
                end_date: formatDate(
                    new Date(new Date() - 24 * 60 * 60 * 1000),
                    "yyyy-MM-dd"
                ),
                period: "day",
                type: "order_pay_price"
            },
            chart: {
                data: {},
                list: [],
                xAxis: [],
                yAxis: {
                    name: "单位(元)",
                    minInterval: 1
                },
                legend: ["成交总额"],
                legendStyle: {
                    right: "50",
                    top: "25"
                },
                grid: {
                    left: 80,
                    right: 50
                },
                areaStyle: {
                    color: {
                        type: "linear",
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: "#4A67FF" // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: "rgba(74, 103, 255, 0.1)" // 100% 处的颜色
                            }
                        ],
                        global: false // 缺省为 false
                    }
                },
                loading: false
            }
        };
    },
    created() {
        this.getManageOverview();
        this.getLineData();
    },
    methods: {
        // 经营状况总览
        getManageOverview() {
            this.$api.homeApi
                .getManageOverview({
                    start_date: this.lineRequestParam.start_date,
                    end_date: this.lineRequestParam.end_date
                })
                .then(res => {
                    if (res.error === 0) {
                        this.panelData = { ...res.data };
                    }
                });
        },
        // 经营状况折线图
        getLineData() {
            this.chart.loading = true;
            this.$api.homeApi.getLineData(this.lineRequestParam).then(res => {
                this.chart.loading = false;
                if (res.error === 0) {
                    this.chart.data = res.data;
                    this.formatChart();
                }
            });
        },
        // 点击切换面板
        changePanel(type) {
            this.lineRequestParam.type = type;
            this.getLineData();
        },
        // 切换 日、月、年
        changePeriod() {
            this.getLineData();
        },
        // 日期改变
        changeDate(date) {
            this.lineRequestParam.start_date = date[0];
            this.lineRequestParam.end_date = date[1];
        },
        // 更改日期
        okDate() {
            this.dealDate();
            this.getManageOverview();
            this.getLineData();
        },
        // 超过180天日禁用
        dealDate() {
            if (
                new Date(this.lineRequestParam.end_date) -
                    new Date(this.lineRequestParam.start_date) >
                180 * 24 * 60 * 60 * 1000
            ) {
                this.dayDisabled = true;
                if (this.lineRequestParam.period === "day") {
                    this.lineRequestParam.period = "month";
                }
            } else {
                this.dayDisabled = false;
            }
        },
        chartLineMounted(){
            this.$nextTick(() => {
                this.$refs["chart_line"]?.render();
            });
        },
        // 处理折线图
        formatChart() {
            this.chart.xAxis = this.chart.data.map(item => {
                return item.period;
            });
            this.chart.list = this.chart.data.map(item => {
                return item.count;
            });
            this.chart.legend = [
                this.yAxisConfig[this.lineRequestParam.type].name
            ];
            this.chart.yAxis.name = this.yAxisConfig[
                this.lineRequestParam.type
            ].yAxis;
            this.$nextTick(() => {
                this.$refs["chart_line"]?.render();
            });
        }
    }
};
</script>

<style scoped lang="scss">
// .ivu-form .ivu-form-item {
//     margin-bottom: 13px;
//     /deep/ .ivu-form-item-label {
//         font-weight: bold;
//         font-size: 12px;
//         line-height: 16px;
//         color: #262b30;
//         padding-right: 0;
//         white-space: nowrap;
//     }
//     /deep/ .ivu-form-item-content {
//         font-size: 12px;
//         line-height: 16px;
//         color: #262b30;
//         padding-top: 8px;
//         padding-bottom: 7px;
//     }
// }
.condition-comp {
    padding: 20px;
    background-color: #ffffff;
    .condition-title-right {
        .ivu-radio-group {
            margin-right: 10px;
            .ivu-radio-wrapper {
                &:first-child {
                    border-radius: 2px 0 0 2px;
                }
                &:last-child {
                    border-radius: 0 2px 2px 0;
                }
            }
            .ivu-radio-wrapper-checked {
                background-color: $brand-light;
                color: $data-blue;
                border-color: $data-blue;
            }
        }
    }
    .chart {
        background: #fbfcff;
        border: 1px solid #e9edef;
        border-top: 1px solid transparent;
    }
}
</style>
