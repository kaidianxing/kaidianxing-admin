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
    <div class='overview'>
        <header-card :data="data"></header-card>
        <content-card ref="content_card" :data="data" :distributor="chart.distributor" :grade-data="chart.grade"
                      :grade-legend-data="chart.legend"></content-card>
        <chart-card ref="chart_card" :add="agent.new" :commission="rank" :child="child"></chart-card>
        <slot></slot>
    </div>
</template>

<script>
    import HeaderCard from "./components/HeaderCard";
    import ContentCard from "./components/ContentCard";
    import ChartCard from "./components/ChartCard";

    export default {
        components: {
            HeaderCard,
            ContentCard,
            ChartCard
        },
        data() {
            return {
                data: {},
                chart: {
                    distributor: [],
                    grade: [],
                    legend: []
                },
                agent: {
                    new: {
                        data: [],
                        xAxis: [],
                        legend: []
                    }
                },
                rank: {
                    data: [],
                    yAxis: [],
                    legend: []
                },
                child: {
                    data: [],
                    yAxis: [],
                    legend: []
                }
            };
        },
        methods: {
            getData() {
                this.$api.commissionApi.getCommissionIndex()
                    .then(res => {
                        if (res.error === 0) {
                            let {agent_level = [], new_agent, total_rank = [], total_child = [], ...data} = res.data;
                            this.data = data;
                            this.chart.distributor = [
                                {name: '分销商占比', value: data.agent_member_per},
                                {name: '非分销商占比', value: parseFloat(1 - data.agent_member_per).toFixed(2)}
                            ];
                            agent_level.forEach(item => {
                                this.chart.grade.push({
                                    name: item.name,
                                    value: item.chain
                                });
                                this.chart.legend.push(item.name);
                            });
                            this.$nextTick(() => {
                                this.$refs['content_card'].renderDistributor();
                                this.$refs['content_card'].renderGrade();
                            });
                            this.getNewAgent(new_agent);
                            this.getRank(total_rank, total_child);
                        }
                    });
            },
            // 获取新增分销商数据
            getNewAgent(data) {
                // 新分销商
                this.agent.new.xAxis = Object.keys(data);
                this.agent.new.data = this.agent.new.xAxis.map(key => data[key].total || 0);
                this.agent.new.legend = ['新增分销商数'];
                this.$nextTick(() => {
                    this.$refs['chart_card'].renderAdd();
                });
            },
            // 获取排行榜
            getRank(rank, child) {
                rank.forEach(item => {
                    this.rank.data.push(item.commission_total);
                    this.rank.yAxis.push(item.nickname);
                    this.rank.legend = ['累计佣金排行榜'];
                });
                child.forEach(item => {
                    this.child.data.push(item.commission_child);
                    this.child.yAxis.push(item.nickname);
                    this.child.legend = ['下线分销商排行榜'];
                });
                this.$nextTick(() => {
                    this.$refs['chart_card'].renderRank();
                });
            }
        },
        mounted() {
            this.getData();
        }
    };
</script>

<style lang="scss" scoped>
    @import '@/components/common.scss';

    .overview {
        background-color: $background-color;
        margin: 20px auto;
    }

</style>
