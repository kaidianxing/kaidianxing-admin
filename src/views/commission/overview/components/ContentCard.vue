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
    <div class="content-card">
        <div class="title">
            分销商概览
        </div>
        <div class="content">
            <ul>

                <li class="vip-number">
                    <div class="left">
                        <div class="title">
                            总分销商数量 / 总会员数量
                        </div>
                        <div class="number">
                            <span class="number-font-family">{{data.agent}} / {{data.member}}</span>
                        </div>
                    </div>
                    <div class="right">
                        <chart-pie ref="vip_pie" id="vip_pie" :legend="false" :data="distributor"></chart-pie>
                    </div>
                </li>
                <li class="grade">
                    <chart-pie ref="grade_pie" id="grade_pie" :legend="grade.legend" :data="gradeData"
                               :center="grade.center"></chart-pie>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import ChartPie from "@/components/chart/ChartPie";

    export default {
        name: "ContentCard",
        components: {
            ChartPie
        },
        props: {
            data: {
                type: Object,
                required: true
            },
            distributor: {
                type: Array,
                default: () => []
            },
            gradeData: {
                type: Array,
                default: () => []
            },
            gradeLegendData: {
                type: Array
            }
        },
        data() {
            return {
                vip: {
                    data: [
                        {value: 335, name: '直接访问1'},
                        {value: 310, name: '邮件营销1'},
                        {value: 234, name: '联盟广告1'},
                        {value: 135, name: '视频广告1'},
                        {value: 1548, name: '搜索引擎1'}
                    ]
                },
                grade: {
                    legend: {
                        orient: 'vertical',
                        left: 0,
                        top: 0,
                        bottom: 0,
                    },
                    center: ['85%', '50%'],
                }
            };
        },
        methods: {
            renderDistributor() {
                this.$nextTick(() => {
                    this.$refs['vip_pie'].render();
                });
            },
            renderGrade() {
                this.grade.legend.data = this.gradeLegendData || [];
                this.$nextTick(() => {
                    this.$refs['grade_pie'].render();
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .content-card {
        padding: 20px 40px;
        background-color: #ffffff;
        margin-bottom: 10px;
        .title {
            @include font-16-22-bold;
            color: $text-first;
            padding-bottom: 10px;
        }
        > .content {
            > ul {
                margin: 0 -10px;
                display: flex;
                flex-wrap: nowrap;
                flex: 1;
                > li {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    margin: 0 10px;
                    border: 1px solid $border-color;
                    border-radius: 2px;
                    background-color: $global-bg3;
                    bos-sizing: border-box;
                    padding: 20px;
                    .title {
                        @include font-14-20;
                        color: $text-first;
                        padding-bottom: 20px;
                        width: 100%;
                    }
                    .number {
                        > span {
                            @include font-30-36-500;
                            color: $text-first;
                            padding-right: 10px;
                        }
                    }
                }
                .to-audit {
                    width: 20%;
                }
                .vip-number {
                    flex: 1;
                    justify-content: space-between;
                    width: 30%;
                    .right {
                        min-width: 130px;
                    }
                }
                .grade {
                    flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    width: 50%;
                    /deep/ .data_charts_pie {
                        width: 100%;
                        #pie_grade_pie {
                            > div {
                                float: right;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
