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
    <div class="sale">
        <!-- 直播收益预览 -->
        <sale-income :info="incomeInfo"></sale-income>
        <!--  -->
        <div class="sale-chart">
            <div class="sale-chart-left">
                <p class="sale-title">直播销售额统计</p>
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
            </div>
            <div class="sale-chart-right">
                <p class="sale-title">直播销售总额占比</p>
                <div class="sell-info">
                    <div class="sell-info-item">
                        <p class="sell-info-title">直播总销售额 / 商城总销售额</p>
                        <p class="sell-info-num">{{liverMoney}} / {{totalMoney}}</p>
                    </div>
                    <div>
                        <chart-pie
                            ref="sale"
                            id="sale"
                            :legend="false"
                            :data="pieData"
                            :height="202"
                            width="202px"
                        ></chart-pie>
                    </div>
                </div>
            </div>
        </div>
        <!-- 收益排行 -->
        <sale-top
            :goods-list="goodsTop"
            :money-list="moneyTop"
        ></sale-top>
        <slot></slot>
    </div>
</template>


<script>
import SaleIncome from './components/SaleIncome'
import ChartLine from '@/components/chart/ChartLine'
import ChartPie from '@/components/chart/ChartPie'
import SaleTop from './components/SaleTop'

import { formatDate } from '@/assets/helpers'
export default {
    components: {
        SaleIncome,
        ChartLine,
        ChartPie,
        SaleTop
    },
    data() {
        return {

            date: [
                formatDate(
                    new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                    'yyyy-MM-dd'
                ),
                formatDate(
                    new Date(new Date() - 24 * 60 * 60 * 1000),
                    'yyyy-MM-dd'
                ),
            ],
            dateOptions: {
                disabledDate(date) {
                    return date.valueOf() > Date.now() - 24 * 60 * 60 * 1000
                },
            },
            dayDisabled: false, // 禁用日筛选
            // yAxis坐标轴配置
            yAxisConfig: {
                order_pay_price: {
                    name: '成交总额',
                    yAxis: '单位(元)',
                },
            },
            // 折线图请求数据
            lineRequestParam: {
                start_date: formatDate(
                    new Date(new Date() - 30 * 24 * 60 * 60 * 1000),
                    'yyyy-MM-dd'
                ),
                end_date: formatDate(
                    new Date(new Date() - 24 * 60 * 60 * 1000),
                    'yyyy-MM-dd'
                ),
                period: 'day',
                type: 'order_pay_price',
            },
            chart: {
                data: {},
                list: [],
                xAxis: [],
                yAxis: {
                    name: '单位(元)',
                    minInterval: 1,
                },
                legend: [],
                legendStyle: {
                    right: '50',
                    top: '25',
                },
                grid: {
                    left: 80,
                    right: 50,
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
                                color: '#4A67FF', // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(74, 103, 255, 0.1)', // 100% 处的颜色
                            },
                        ],
                        global: false, // 缺省为 false
                    },
                },
                loading: false,
            },
            goodsTop: [],
            moneyTop: [],
            incomeInfo: {},
            pieData: [],
            liverMoney: '',
            totalMoney: ''
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleResize)
        this.getIncome()
    },
    methods: {
        getIncome() {
            this.$api.liverApi.allIncome().then(res => {
                if (res.error == 0) {
                    this.goodsTop = res.goods_rank;
                    this.moneyTop = res.member_rank;
                    let keys = ['order_member_count', 'order_pay_price', 'order_pay_count']
                    keys.forEach(key => {
                        res.yesterday_data[key] = this.$utils.formatNumberData(res.yesterday_data[key])
                    })

                    let pay_percent = res.yesterday_data.pay_percent

                    if (pay_percent == undefined) {
                        pay_percent = 0
                    }


                    res.yesterday_data.pay_percent = parseFloat(pay_percent) + '%';


                    this.incomeInfo = res.yesterday_data
                    if (res.recent_data.length == 0) {
                        res.recent_data = [{
                            date: this.$utils.formatDate(new Date(), 'yyyy-MM-dd'),
                            order_pay_price: "0.00"
                        }]
                    }

                    this.chart.data = res.recent_data.sort((a, b) => {
                        return new Date(a.date).getTime() - new Date(b.date).getTime()
                    })
                    this.liverMoney = res.broadcast_order_total_pay_price;
                    this.totalMoney = res.order_total_pay_price;
                    this.pieData = [
                        { name: '直播销售额占比', value: res.broadcast_order_total_pay_price },
                        { name: '非直播销售额占比', value: res.order_total_pay_price - res.broadcast_order_total_pay_price }
                    ]
                    this.formatChart(this.type)
                    this.renderDistributor()
                }
            })
        },
        renderDistributor() {
            this.$nextTick(() => {
                this.$refs['sale'].render();
            });
        },
        formatChart() {
            this.chart.xAxis = this.chart.data.map((item) => {
                return item.date.replace(' 00:00:00', '')
            })
            this.chart.list = this.chart.data.map((item) => {
                return item.order_pay_price
            })
            this.chart.legend = [
                this.yAxisConfig[this.lineRequestParam.type].name,
            ]

            this.$nextTick(() => {
                this.$refs['chart_line'].render()
            })
        },
    },
    beforeDestroy() {
        window.onresize = null
    }
}
</script>
<style lang="scss" scoped>
.sale {
    padding-top: 20px;

    &-chart {
        margin: 10px 0;
        display: flex;

        &-left {
            width: 50%;
            margin-right: 10px;
            padding-right: 20px;
            background-color: #fff;
            border-radius: px2rpx(2);
        }

        &-right {
            width: 50%;
            background-color: #fff;
            border-radius: px2rpx(2);

            @media screen and (max-width: 1500px) {
                .sell-info {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;

                    &-item {
                        margin-bottom: 60px;
                    }
                }
            }

            @media screen and (min-width: 1500px) {
                .sell-info {
                    display: flex;
                    justify-content: space-between;
                }
            }

            .sell-info {
                margin: 20px 40px;
                padding: 0 40px 0 50px;

                align-items: center;
                height: 450px;
                background: #fbfcff;
                border: 1px solid #e9edef;

                .sell-info-title {
                    font-size: 14px;
                    line-height: 20px;
                    color: #262b30;
                }

                .sell-info-num {
                    margin-top: 20px;
                    font-size: 32px;
                    line-height: 39px;
                    color: #262b30;
                }
            }
        }

        .sale-title {
            padding: 20px 0 0 40px;
            display: flex;
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
            color: #262b30;
        }

        /deep/ .data_charts_line {
            background-color: #fff;
        }
    }
}
</style>
