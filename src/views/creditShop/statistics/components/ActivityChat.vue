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
    <div class="activity-chart">
        <div class="activity-line">
            <div class="activity-line-header">
                <div class="title">
                    积分商城曝光量
                </div>
            </div>
            <div class="chart-line">
                <chart-line ref="chart_line" id="groups_line"
                            :data="chartLine.data" 
                            :x-axis="chartLine.xAxis"
                            :y-axis="chartLine.yAxis"
                            :legend="chartLine.legend" :legend-style="chartLine.legendStyle" :grid="chartLine.grid"
                            :height="328"></chart-line>
            </div>
        </div>
        <div class="activity-pie">
            <div class="activity-pie-header">
                销售额占比
            </div>
            <div class="chart-pie">
                <chart-pie ref="chart_pie" id="groups_pie" :legend="chartPie.legend" :height="328" :data="chartPie.data"
                           :center="chartPie.center" :radius="chartPie.radius"></chart-pie>
            </div>
        </div>
    </div>
</template>

<script>
import ChartLine from "@/components/chart/ChartLine";
import ChartPie from "@/components/chart/ChartPie";

export default {
    name: "ActivityChat",
    components: {
        ChartPie,
        ChartLine
    },
    props: {
        chartLine: {
            type: Object,
            default: () => {
            }
        },
        chartPie: {
            type: Object,
            default: () => {
            }
        },
        activityData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            activity_id: 'all',
        };
    },
    methods: {
        changeActivity() {
            if (this.activity_id === 'all') {
                this.$emit('on-line-change', '');
            } else {
                this.$emit('on-line-change', this.activity_id);
            }
        },
        renderLine() {
            this.$refs['chart_line'].render();
        },
        renderPie() {
            this.$refs['chart_pie'].render();
        }
    }
}
</script>

<style lang="scss" scoped>
.activity-chart {
    padding-top: 10px;
    height: 420px;
    display: flex;

    .activity-line {
        margin-right: 10px;
        background-color: #ffffff;
        border-radius: 2px;
        flex: 1;
    }

    .activity-line-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 40px 0;
        @include font-16-22-bold;
        color: $text-first;

        .name {
            display: flex;
            align-items: center;
            @include font-14-20;
        }
    }

    .activity-pie {
        background-color: #ffffff;
        border-radius: 2px;
        width: 556px;
        flex-shrink: 0;
        padding: 20px 40px 30px;

        .activity-pie-header {
            @include font-16-22-bold;
            color: $text-first;
            padding-bottom: 10px;
        }
        .chart-pie {
            border: 1px solid $border-color;
            background-color: $global-bg3;
            border-radius: 2px;
        }
    }
}
</style>