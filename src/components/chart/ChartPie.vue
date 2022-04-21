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
    <div class="data_charts_pie" v-loading="loading">
        <div
            :id="`pie_${id}`"
            :style="{ width, height: `${height}px` }"
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
        // 图例
        legend: {
            type: [Object, Boolean],
            default: () => {}
        },
        height: {
            type: Number,
            default: 130
        },
        loading: {
            type: Boolean,
            default: false
        },
        // 弧度配置
        radius: {
            type: [Array, String],
            default: () => ['70%', '90%']
        },
        label: {
            type: Object,
            default: () => {}
        },
        // 环形图鼠标移入放大距离
        hoverOffset: {
            type: Number,
            default: 2
        },
        center: {
            type: Array,
            default: () => ['50%', '50%']
        },
        width: {
            type: [String, Number],
            default: '100%'
        }
    },
    data() {
        return {
            myCharts: null,
            option: {
                title: {},
                grid: {
                    left: '0%',
                    right: '0%',
                    bottom: '0%',
                    containLabel: false
                },
                tooltip: {
                    trigger: 'item',
                    padding: [0]
                    // formatter: '{b} : {c} ({d}%)'
                },
                legend: {
                    icon: 'circle',
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        color: '#636669'
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: this.radius,
                        hoverOffset: this.hoverOffset,
                        center: this.center,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                formatter: '{b}132: \n{d}',
                                rich: {
                                    b: {
                                        color: '#636669',
                                        fontSize: 12,
                                        lineHeight: 16,
                                        fontFamily: 'din,PingFang SC,Microsoft YaHei'
                                    },
                                    d: {
                                        color: '#636669',
                                        fontSize: 20,
                                        lineHeight: 28,
                                        fontWeight: 'bold',
                                        fontFamily: 'din,PingFang SC,Microsoft YaHei'
                                    }
                                }
                            }
                        },
                        // 高亮区标签显示
                        emphasis: {
                            label: {
                                show: true,
                                // formatter: ['{a|这段文本采用样式a}'].join('\n'),
                                rich: {
                                    a: {
                                        color: '#636669',
                                        fontSize: 12,
                                        lineHeight: 16,
                                        fontFamily: 'din,PingFang SC,Microsoft YaHei'
                                    },
                                    b: {
                                        color: '#262b30',
                                        fontSize: 20,
                                        lineHeight: 32,
                                        fontWeight: 'bold',
                                        fontFamily: 'din,PingFang SC,Microsoft YaHei'
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        }
    },
    methods: {
        init() {
            // 注册主题
            echarts.registerTheme('theme', theme)
            this.myCharts = echarts.init(
                document.getElementById(`pie_${this.id}`),
                theme
            )
        },
        render() {
            if (!this.myCharts) {
                this.init()
            }
            let option = JSON.parse(JSON.stringify(this.option))
            if (this.legend) {
                Object.assign(option.legend, this.legend)
            } else {
                delete option.legend
            }
            option.series[0].data = this.data
            option.series[0].emphasis.label.formatter = params => {
                let name = params.name
                let value = params.percent
                return [`{a|${name}}`, `{b|${value}%}`].join('\n')
            }
            // tooltip formatter
            option.tooltip.formatter = function(params) {
                let name = params.name
                // let seriesName = params[0].seriesName;
                let value = params.percent
                let color = params.color
                return `<div style="background:#fff;border-radius: 2px;padding: 12px 48px 12px 12px;box-shadow: 0px 4px 10px rgba(0, 49, 95, 0.08);">
                    <div style="display:flex;align-items:center;margin-top:4px;">
                        <span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;background:${color};"></span>
                        <span style="color:#636669;">${name}：${value}%</span>
                    </div>
                </div>`
            }
            this.myCharts.setOption(option);
            // 高亮索引 默认第一个高亮
            let defaultIndex = 0
            this.myCharts.dispatchAction({
                type: 'highlight',
                seriesIndex: 0,
                dataIndex: defaultIndex
            });
            this.myCharts.on('mouseover',(e) => {
                // 清空所有高亮，防止和图例事件冲突
                this.data.forEach((item, index) => {
                    this.myCharts.dispatchAction({
                        type: 'downplay',
                        seriesIndex: 0,
                        dataIndex: index
                    });
                })
                this.myCharts.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: e.dataIndex
                });
            });
            this.myCharts.on('mouseout',(e) => {
                defaultIndex = e.dataIndex
                this.myCharts.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: e.dataIndex
                });
            });
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
}
</script>

<style scoped lang="scss">
.data_charts_pie {
    position: relative;
    .label_formatter_box {
        > .title {
            @include font-12-16;
            color: $text-first;
        }
        > .value {
            font-size: 20px;
            font-weight: bold;
            line-height: 28px;
            color: $text-first;
        }
    }
}
</style>
