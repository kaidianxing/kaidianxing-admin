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
    <div class="data_charts_line" v-loading="loading">
        <div
            :id="`line_${id}`"
            :style="{ width: '100%', height: `${height}px` }"
        ></div>
    </div>
</template>

<script>
import echarts from 'echarts'
import theme from './theme'

export default {
    name: 'ChartLine',
    props: {
        id: {
            type: String,
            required: true
        },
        data: {
            type: Array,
            default: () => []
        },
        legend: {
            type: Array,
            default: () => []
        },
        legendStyle: {
            type: Object,
            default: () => {
                return {
                    right: '0',
                    top: '25'
                }
            }
        },
        xAxis: {
            type: Array,
            default: () => []
        },
        yAxis: {
            type: [Array, Object],
            default: () => {}
        },
        height: {
            type: Number,
            default: 450
        },
        // 图表下方是否有背景
        isAreaStyle: {
            type: Boolean,
            default: false
        },
        areaStyle: {
            type: [Array, Object],
            default: () => []
        },
        loading: {
            type: Boolean,
            default: false
        },
        grid: {
            type: Object,
            default: () => {}
        },
        // 新增折线颜色
        lineColors: {
            type: Array,
            default: () => []
        },
        showYAxis: {
            type: Boolean,
            default: false
        }
        
    },
    data() {
        return {
            myCharts: null,
            option: {
                title: {},
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: false
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false,
                        lineStyle: {
                            color: '#BFBFBF'
                        }
                    },
                    padding: [0],
                    textStyle: {
                        color: '#262B30',
                        fontSize: 12
                    }
                },
                legend: {
                    icon: 'circle',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        color: '#939799'
                    },
                    data: this.legend,
                    ...this.legendStyle
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.xAxis
                },
                yAxis: {
                    nameTextStyle: {
                        color: '#262B30'
                    },
                    splitLine: {
                        lineStyle: {
                            type: 'dashed'
                        }
                    },
                    axisLabel: {}
                    // minInterval: 1
                },
                series: this.data
            }
        }
    },
    methods: {
        init() {
            // 注册主题
            echarts.registerTheme('theme', theme)
            this.myCharts = echarts.init(
                document.getElementById(`line_${this.id}`),
                theme
            )
        },
        render() {
            if (!this.myCharts) {
                this.init()
            }
            let option = JSON.parse(JSON.stringify(this.option))
            Object.assign(option.grid, this.grid);
            option.legend.data = this.legend
            // 增加折线配置颜色
            if(this.lineColors.length) {
                option.color = this.lineColors
            }
            option.xAxis.data = this.xAxis
            if (this.yAxis instanceof Array) {
                option.yAxis = this.yAxis.map((v,i)=> {
                    // 设置线条
                    v.splitLine= option.yAxis.splitLine
                    if(this.showYAxis && i ==1) {
                        v.inverse = false
                    }
                    return v
                }) || []
                // 兼容yAxis传入多个
                option.yAxis.forEach(opt => {
                    if (!opt?.axisLabel?.formatter) {
                        opt.axisLabel = {
                            ...opt.axisLabel,
                            formatter: (value) => {
                                if (value >= 1000) {
                                    return `${parseFloat(value / 1000).toFixed(1)}K`
                                }
                                return value;
                            }
                        }
                    }
                })

            } else if (this.yAxis instanceof Object) {
                option.yAxis = Object.assign(option.yAxis, this.yAxis)

                if (!option.yAxis?.axisLabel?.formatter) {
                    option.yAxis.axisLabel.formatter = (value) => {
                        if (value >= 1000) {
                            return `${parseFloat(value / 1000).toFixed(1)}K`
                        }
                        return value;
                    }
                }
            }
            // 多条曲线
            if (this.legend.length > 1) {
                option.series = this.legend.map((item, index) => {
                    let obj = {
                        name: item,
                        type: 'line',
                        data: this.data[index] || [],
                    }

                    // 增加副坐标轴显示
                    if(this.showYAxis && index == 1){
                        obj.yAxisIndex = 1;
                    }
                    if (this.isAreaStyle) {
                        obj.areaStyle = this.areaStyle[index] || {}
                    }
                    return obj
                })
            } else {
                option.series = [
                    {
                        name: this.legend[0],
                        type: 'line',
                        data: this.data || []
                    }
                ]
                if (this.isAreaStyle) {
                    option.series[0].areaStyle = this.areaStyle || {}
                }
            }
            // tooltip formatter
            option.tooltip.formatter = function(params) {
                let component = '',name = params[0].name;
                params.forEach(item => {
                    let seriesName = item.seriesName
                    let value = item.value
                    let color = item.color
                    component += `
                                  <div style="display:flex;align-items:center;margin-top:4px;">
                                  <span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;background:${color};"></span>
                                  <span style="color:#636669;">${seriesName}：${value}</span>
                                  </div>`
                })

                return `<div style="background:#fff;border-radius: 2px;padding: 12px 48px 12px 12px;box-shadow: 0px 4px 10px rgba(0, 49, 95, 0.08);">
                                <div>${name}</div>
                                ${component}
                        </div>`
            }
            this.myCharts.setOption(option)
        },
        handleResize() {
            if (this.myCharts) {
                this.myCharts.resize();
            }
        }
    },
    mounted() {
        // 监听窗口的变化
        this.$emit('chartLineMounted')
        window.addEventListener('resize', this.handleResize)
    }
}
</script>

<style scoped lang="scss">
.data_charts_line {
    position: relative;
}
</style>
