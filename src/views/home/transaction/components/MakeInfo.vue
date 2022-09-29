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
    <div class="data-transaction-make-info">
        <header-title
            title="成交信息"
            :text="updateTimeText"
            :max-width="340"
        >
            <template #right>
                <DatePicker
                    v-model="date"
                    type="daterange"
                    :options="dateOptions"
                    confirm
                    split-panels
                    placeholder="时间"
                    :clearable="false"
                    @on-change="changeDate"
                    @on-ok="okDate"
                    class="width-250"
                ></DatePicker>
            </template>
            <template #tooltip>
                <Form :label-width="60">
                    <FormItem label="成交用户：">
                        成功完成订单支付的用户数，同一用户多次成功支付重复计
                    </FormItem>
                    <FormItem label="支付笔数：">
                        商城店铺内完成支付的订单数。
                    </FormItem>
                    <FormItem label="支付金额：">
                        商城店铺内完成支付的订单金额总和。
                    </FormItem>
                    <FormItem label="退款金额：">
                        商城店铺内成功完成退款的退款金额总和。
                    </FormItem>
                </Form>
            </template>
        </header-title>
        <make-panel
            :data="make.data"
            :type="make.type"
            @on-change="changeMake"
        ></make-panel>
        <div class="chart">
            <chart-line
                ref="chart_line"
                id="vip_crease"
                :is-area-style="true"
                :data="chart.list"
                :xAxis="chart.xAxis"
                :yAxis="chart.yAxis"
                :legend="chart.legend"
                :legend-style="chart.legendStyle"
                :area-style="chart.areaStyle"
                :loading="chart.loading"
                :grid="chart.grid"
            ></chart-line>
            <RadioGroup
                v-model="params.interval"
                type="button"
                class="chart-time-type"
                @on-change="changeType"
                style="margin-right: 40px"
            >
                <Radio label="day" :disabled="disabled">日</Radio>
                <Radio label="month">月</Radio>
                <Radio label="year">年</Radio>
            </RadioGroup>
        </div>
    </div>
</template>

<script>
import MakePanel from './MakePanel'
import HeaderTitle from '../../compnents/HeaderTitle'
import { formatDate } from '@/assets/helpers'
import ChartLine from '@/components/chart/ChartLine'

export default {
    name: 'MakeInfo',
    components: { MakePanel, HeaderTitle, ChartLine },
    data() {
        return {
            make: {
                type: 'order_pay_member_count',
                data: {}
            },
            chart: {
                data: {},
                list: [],
                xAxis: [],
                yAxis: {
                    name: '单位(人)',
                    minInterval: 1
                },
                legend: ['成交用户'],
                legendStyle: {
                    left: '120',
                    top: '28'
                },
                grid: {
                    left: 90,
                    right: 70
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: '#4A67FF' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(74, 103, 255, 0.1)' // 100% 处的颜色
                            }
                        ],
                        global: false // 缺省为 false
                    }
                },
                loading: false
            },
            type: '',
            infoConfig: {
                order_pay_count: {
                    name: '支付笔数',
                    yAxis: '单位(笔)'
                },
                order_pay_member_count: {
                    name: '成交用户数',
                    yAxis: '单位(人次)'
                },
                order_pay_price_sum: {
                    name: '支付金额',
                    yAxis: '单位(元)'
                },
                order_refund_price_sum: {
                    name: '退款金额',
                    yAxis: '单位(元)'
                }
            },
            date: [
                formatDate(
                    new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                    'yyyy-MM-dd'
                ),
                formatDate(
                    new Date(new Date() - 24 * 60 * 60 * 1000),
                    'yyyy-MM-dd'
                )
            ],
            dateOptions: {
                disabledDate(date) {
                    return date.valueOf() > Date.now() - 24 * 60 * 60 * 1000
                }
            },
            params: {
                start_date: formatDate(
                    new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                    'yyyy-MM-dd'
                ),
                end_date: formatDate(
                    new Date(new Date() - 24 * 60 * 60 * 1000),
                    'yyyy-MM-dd'
                ),
                interval: 'day'
            },
            disabled: false
        }
    },
    computed: {
        updateTimeText() {
            return this.$store.state.config?.data?.updateTimeText;
        }
    },
    methods: {
        changeDate(date) {
            this.params.start_date = date[0]
            this.params.end_date = date[1]
        },
        okDate() {
            this.dealDate()
            this.getData()
        },
        // 超过180天日禁用
        dealDate() {
            if (
                new Date(this.params.end_date) -
                    new Date(this.params.start_date) >
                180 * 24 * 60 * 60 * 1000
            ) {
                this.disabled = true
                if (this.params.interval === 'day') {
                    this.params.interval = 'month'
                }
            } else {
                this.disabled = false
            }
        },
        changeType() {
            this.getData()
        },
        getData() {
            this.chart.loading = true
            this.$api.homeApi.getTransactionData(this.params).then(res => {
                this.chart.loading = false
                if (res.error === 0) {
                    this.make.data = res.count || {}
                    this.chart.data = res.line_chart_data
                    this.formatChart(this.type)
                }
            })
        },
        formatChart() {
            let keys = Object.keys(this.chart.data)
            this.chart.list = keys.map(
                key => this.chart.data[key][this.make.type]
            )
            this.chart.xAxis = keys
            this.chart.legend = [this.infoConfig[this.make.type].name]
            this.chart.yAxis.name = this.infoConfig[this.make.type].yAxis
            this.$nextTick(() => {
                this.$refs['chart_line']?.render()
            })
        },
        changeMake(type) {
            this.make.type = type
            this.formatChart()
        }
    },
    beforeMount() {
        this.getData()
    }
}
</script>

<style scoped lang="scss">
.data-transaction-make-info {
    /*padding-top: 30px;*/
    /*padding: 30px 40px;*/
    background-color: #ffffff;

    .data-header-title {
        padding: 30px 40px;
    }
    .data-transaction-make-panel {
        padding: 0 40px;
    }
    .chart {
        position: relative;
        padding-top: 10px;

        .chart-time-type {
            position: absolute;
            top: 25px;
            right: 0;
        }

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
