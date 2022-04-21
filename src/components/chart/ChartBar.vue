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
    import echarts from 'echarts';
    import theme from './theme';

    export default {
        name: 'ChartBar',
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
                default: () => [],
                required: true
            },
            // 是否显示legend
            isLegend: {
                type: Boolean,
                default: false
            },
            legendStyle: {
                type: Object,
                default: () => {
                    return {
                        right: '0',
                        top: '25'
                    };
                }
            },
            xAxis: {
                type: [Array, Object],
                default: () => []
            },
            yAxis: {
                type: [Array, Object],
                default: () => {
                }
            },
            height: {
                type: Number,
                default: 450
            },
            loading: {
                type: Boolean,
                default: false
            },
            // xAxis中的type
            typeXAxis: {
                type: String,
                default: 'category'// 柱状图类型 value/category
            },
            grid: {
                type: Object,
                default: () => {}
            },
            // 柱状图宽度
            barMaxWidth: {
                type: Number,
                default: 24
            },
            // 颜色
            color: {
                type: Array,
                default: () => []
            },
            showBackground: {
                type: Boolean,
                default: false
            },
            backgroundStyle: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                myCharts: null,
                option: {
                    title: {},
                    grid: {
                        left: '5%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: false
                    },
                    color: this.color||[],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: true,
                            type: 'shadow',
                            lineStyle: {
                                color: '#BFBFBF'
                            },
                            shadowStyle: {
                                shadowColor: '#ccd6ec',
                                opacity: 0.3
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
                        type: this.typeXAxis,
                        boundaryGap: true,
                        data: this.xAxis,
                        minInterval: 1,
                        axisTick: {
                            alignWithLabel: true // 在坐标轴中间显示
                        }
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
                        axisTick: {
                            alignWithLabel: true // 在坐标轴中间显示
                        },
                        minInterval: 1
                    },
                    series: this.data
                }
            };
        },
        methods: {
            init() {
                // 注册主题
                echarts.registerTheme('theme', theme);
                this.myCharts = echarts.init(
                    document.getElementById(`line_${this.id}`),
                    theme
                );
            },
            render() {
                if (!this.myCharts) {
                    this.init();
                }
                let option = JSON.parse(JSON.stringify(this.option));
                if (this.isLegend) {
                    option.legend.data = this.legend;
                }
                Object.assign(option.grid, this.grid);
                Object.assign(option.xAxis, this.xAxis);
                if (this.yAxis instanceof Array) {
                    option.yAxis = this.yAxis || [];
                } else if (this.yAxis instanceof Object) {
                    option.yAxis = Object.assign(option.yAxis, this.yAxis);
                }
                // 多个直方图
                if (this.legend.length > 1) {
                    option.series = this.legend.map((item, index) => {
                        let obj = {
                            name: item,
                            type: 'bar',
                            data: this.data[index] || [],
                            showBackground: this.showBackground,
                            backgroundStyle: this.backgroundStyle
                        };
                        return obj;
                    });
                } else {
                    option.series = [
                        {
                            name: this.legend[0],
                            type: 'bar',
                            data: this.data || [],
                            barMaxWidth: this.barMaxWidth,
                            showBackground: this.showBackground,
                            backgroundStyle: this.backgroundStyle,
                            emphasis: {
                                itemStyle: {
                                    // borderColor: '#F4F6F8',
                                    // borderWidth: '10',
                                    // shadowColor: '#F4F6F8',
                                    // shadowBlur: 10
                                }
                            }
                        }
                    ];
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
                this.myCharts.setOption(option);
            },
            handleResize() {
                if (this.myCharts) {
                    this.myCharts.resize();
                }
            }
        },
        mounted() {
            // 监听窗口的变化
            window.addEventListener('resize', this.handleResize)
        }
    };
</script>

<style scoped lang="scss">
    .data_charts_line {
        position: relative;
    }
</style>
