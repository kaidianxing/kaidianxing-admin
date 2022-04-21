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
    <div class="chart-card">
        <div class="chart-left">
            <div class="title">
                新增分销商数
            </div>
            <div class="chart-content">
                <chart-bar ref="chart_add_bar" id="add_bar" :data="add.data" :xAxis="addChart.xAxis"
                           :legend="add.legend"></chart-bar>
            </div>
        </div>
        <div class="chart-right">
            <div class="header">
                <div class="title">
                    分销商排行top10
                </div>
                <div class="radio-btn">
                    <RadioGroup v-model="type" type="button" class="chart-time-type" @on-change="changeType">
                        <Radio label="rank">累计佣金排行</Radio>
                        <Radio label="child">下级分销商数量排行</Radio>
                    </RadioGroup>
                </div>
            </div>
            <div class="chart-content">
                <chart-bar ref="chart_rank_bar" id="rank_bar" :grid="grid" typeXAxis="value" :data="rank.data" :yAxis="rank.yAxis"
                           :legend="rank.legend"></chart-bar>
            </div>
        </div>
    </div>
</template>

<script>
    import ChartBar from "@/components/chart/ChartBar";

    export default {
        name: "ChartCard",
        components: {
            ChartBar
        },
        props: {
            add: {
                type: Object,
                required: true
            },
            commission: {
                type: Object,
                required: true
            },
            child: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                type: 'rank',
                rank: {
                    data: [],
                    yAxis: {
                        type: 'category',
                        data: [],
                    },
                    legend: []
                },
                grid: {
                    left: '15%'
                },
                addChart: {
                    xAxis: {
                        minInterval: 1,
                        data: []
                    }
                }
            };
        },
        methods: {
            changeType() {
                if (this.type === 'rank') {
                    this.renderRank();
                } else if (this.type === 'child') {
                    this.renderChild();
                }
            },
            renderAdd() {
                this.addChart.xAxis = {
                    minInterval: 1,
                    data: this.add.xAxis
                }
                this.$nextTick(() => {
                    this.$refs['chart_add_bar'].render();
                });
            },
            renderRank() {
                this.type = 'rank';
                this.rank = {
                    data: this.commission.data,
                    yAxis: {
                        type: 'category',
                        data: this.commission.yAxis
                    },
                    legend: this.commission.legend
                };
                this.$nextTick(() => {
                    this.$refs['chart_rank_bar'].render();
                });
            },
            renderChild() {
                this.type = 'child';
                this.rank = {
                    data: this.child.data,
                    yAxis: {
                        type: 'category',
                        data: this.child.yAxis
                    },
                    legend: this.child.legend
                };
                this.$nextTick(() => {
                    this.$refs['chart_rank_bar'].render();
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .chart-card {
        display: flex;
        flex-wrap: nowrap;
        margin: 0 -5px;
        > div {
            margin: 0 5px;
            width: 50%;
            background-color: #ffffff;
            border-radius: 2px;
            padding: 30px 40px;
            .title {
                @include font-16-22-bold;
                color: $text-first;
            }
        }
        .chart-right {
            .header {
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                align-items: center;
                .radio-btn {
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
                            color: $brand-color;
                            border-color: $brand-color;
                        }
                    }
                }
            }
        }
    }
</style>
