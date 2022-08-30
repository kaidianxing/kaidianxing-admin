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
    <div class="credit-shop-statistics">
        <div class="market-overview-box">
            <div class="card-panel-title">
                <span class="title">积分商城营销概览</span>
                <kdx-hint-tooltip type="form" :max-width="500">
                    <Form :label-width="110">
                        <FormItem label="待发货订单数量：">
                            待发货订单数 / 累计订单数，其中累计订单数 = 成交订单数 - 退款订单数
                        </FormItem>
                        <FormItem label="累计成交积分：">
                            已支付订单中积分部分（不包括已退款订单中产生退还的积分)
                        </FormItem>
                        <FormItem label="累计成交金额：">
                            已支付订单中金额部分(不包括已退款的订单金额)
                        </FormItem>
                    </Form>
                </kdx-hint-tooltip>
                <span class="time marginL-10" v-if="updateTimeText">{{ updateTimeText }}</span>
            </div>
            <data-card :tmp-list="headerCard.tempList" :data="headerCard.data"></data-card>
        </div>
        <activity-chat ref="activity_chart" :chart-line="chartLine" :chart-pie="chartPie"
                       :activity-data="cardData"></activity-chat>
        <ranking-list :goods-data="goodsData" :consume-data="consumeData"></ranking-list>
        <slot></slot>
    </div>
</template>

<script>
import DataCard from "@/components/DataCard";
import ActivityChat from "./components/ActivityChat";
import RankingList from "./components/RankingList";


export default {
    components: {
        DataCard,
        ActivityChat,
        RankingList
    },
    data() {
        return {
            chartLine: {
                color: ['#4A67FF', '#FF9900'],
                data: [],
                legend: ['浏览量（PV）', '访客量（UV）'],
                xAxis: [],
                yAxis: {
                    name: '单位(人)',
                    minInterval: 1
                },
                legendStyle: {
                    right: '30',
                    top: '25'
                },
                grid: {
                    left: 60,
                    right: 40,
                    bottom: 30

                }
            },
            chartPie: {
                legend: {
                    orient: 'vertical',
                    left: 60,
                    top: 90,
                    bottom: 0,
                    data: [],
                },
                radius: ['40%', '60%'],
                center: ['70%', '50%'],
                data: []
            },
            cardData: [],
            headerCard: {
                tempList: [
                    {
                        key: 'credit_wait_order',
                        image: require('@/assets/image/data/data-send.png'),
                        title: '待发货订单数量',
                    },
                    {
                        key: 'goods_count',
                        image: require('@/assets/image/data/data-goods.png'),
                        title: '当前积分商品总数',
                    },
                    {
                        key: 'credit_sum',
                        image: require('@/assets/image/data/data-credit.png'),
                        title: '累计成交积分'
                    },
                    {
                        key: 'price_sum',
                        image: require('@/assets/image/data/data-money.png'),
                        title: '累计成交金额'
                    }
                ],
                data: {}
            },
            goodsData: [],
            consumeData: [],
            updateTimeText: '',
        }
    },
    created() {
        this.getDataInfo();
        this.getLine();
        this.getChannel();
        this.getGoods();
        this.getMember();
    },
    methods: {
        // 数据概览
        getDataInfo() {
            this.$api.creditShopApi.getOverview().then(res => {
                if (res.error !== 0) return;
                this.headerCard.data = {
                    ...res.data,
                    credit_wait_order: {
                        wait_send: `${res.data.wait_send || 0}`,
                        order_count: `${res.data.order_count || 0}`,
                    },
                    price_sum: res.data.price_sum ?  `￥${parseFloat(res.data.price_sum).toFixed(2)}` : '￥0'
                }
            })
        },
        // 曝光量
        getLine() {
            this.$api.creditShopApi.getExposure().then(res => {
                if (res.error !== 0) return;
                    this.chartLine.xAxis = Object.keys(res.data);
                    this.chartLine.data = [
                        this.chartLine.xAxis.map(key => res.data[key]?.view_count || 0),
                        this.chartLine.xAxis.map(key => res.data[key]?.member_count || 0),
                    ];
                    this.$nextTick(() => {
                        this.$refs.activity_chart?.renderLine();
                    })
                
            })
        },
        // 销售额占比
        getChannel() {
            this.$api.creditShopApi.getChannelData().then(res => {
                if (res.error !== 0) return;
                let {channel = []} = res.data;
                this.chartPie.data = channel;
                this.chartPie.legend.data = channel.map(item => item.name);
                this.$nextTick(() => {
                    this.$refs.activity_chart?.renderPie();
                });
            })
        },
        // 商品排行
        getGoods() {
            this.$api.creditShopApi.getGoodsRank().then(res => {
                if (res.error !== 0) return;
                this.goodsData = res.data || [];
            })
        },
        // 会员消费排行
        getMember() {
            this.$api.creditShopApi.getMemberRank().then(res => {
                if (res.error !== 0) return;
                this.consumeData = res.data || []
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.credit-shop-statistics {
    margin-top: 20px;
    margin-bottom: 20px;

    .market-overview-box {
        padding: 30px 40px;
        border-radius: 2px;
        //margin-bottom: 10px;
        background-color: #ffffff;
    }
}
.card-panel-title {
    margin-bottom: 10px;
    .title {
        @include font-16-22-bold;
        color: $text-first;
    }
}
</style>