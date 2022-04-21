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
    <div class="data-vip-increase">
        <header-title title="会员增长趋势">
            <template #right>
                <RadioGroup v-model="date.interval" type="button" @on-change="changeType">
                    <Radio label="day" :disabled="disabled">日</Radio>
                    <Radio label="month">月</Radio>
                    <Radio label="year">年</Radio>
                </RadioGroup>
                <DatePicker v-model="time" type="daterange" :options="dateOptions" confirm split-panels placeholder="时间"
                            :clearable="false" @on-change="changeDate" @on-ok="okDate" class="width-250"></DatePicker>
            </template>
        </header-title>
        <chart-line ref="chart_line" id="vip_crease" :data="chart.data" :xAxis="chart.xAxis" :yAxis="chart.yAxis"
                    :legend="chart.legend" :grid="chart.grid"></chart-line>
    </div>
</template>

<script>
    import HeaderTitle from "../../compnents/HeaderTitle";
    import {formatDate} from '@/assets/helpers';
    import ChartLine from '@/components/chart/ChartLine';

    export default {
        name: "VipIncrease",
        components: {HeaderTitle, ChartLine},
        data() {
            return {
                date: {
                    interval: 'day',
                    start_date: formatDate(new Date(new Date() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
                    end_date: formatDate(new Date(new Date() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
                },
                time: [formatDate(new Date(new Date() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), formatDate(new Date(new Date() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')],
                dateOptions: {
                    disabledDate(date) {
                        return date.valueOf() > Date.now() - 24 * 60 * 60 * 1000;
                    }
                },
                chart: {
                    data: [[], []],
                    xAxis: [],
                    yAxis: {
                        name: '单位 (人)',
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        },
                      minInterval: 1
                    },
                    legend: ['新增会员数', '新增访客数'],
                    grid: {
                        left: 50,
                        right: 30
                    },
                },
                disabled: false
            };
        },
        methods: {
            changeDate(date) {
                this.date.start_date = date[0];
                this.date.end_date = date[1];
            },
          okDate() {
            this.dealDate();
            this.getChartData();
          },
            // 超过180天日禁用
            dealDate() {
                if (new Date(this.date.end_date) - new Date(this.date.start_date) > 180 * 24 * 60 * 60 * 1000) {
                    this.disabled = true;
                    if (this.date.interval === 'day') {
                        this.date.interval = 'month';
                    }
                } else {
                    this.disabled = false;
                }
            },
            changeType() {
                this.getChartData();
            },
            getChartData() {
                this.$api.memberApi.getVipIncrease(this.date)
                    .then(res => {
                        if (res.error === 0) {
                            let data = res;
                            delete data.error;
                            this.formatChartData(data);
                        }
                    });
            },
            formatChartData(data) {
                let keys = Object.keys(data);
                let increase = [], visit = [];
                keys.forEach(item => {
                    increase.push(data[item].member_count);
                    visit.push(data[item].member_pv_count);
                });
                this.chart.data = [increase, visit];
                this.chart.xAxis = keys;
                this.$nextTick(() => {
                    this.$refs['chart_line'].render();
                });
            }
        },
        mounted() {
            this.getChartData();
        }
    };
</script>

<style scoped lang="scss">
    .data-vip-increase {
        margin-top: 10px;
        background-color: #ffffff;
        padding: 30px 40px 0 40px;
        // .ivu-radio-group-button .ivu-radio-wrapper:first-child
        .data-header-title {
            padding-bottom: 20px;

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
    }
</style>
