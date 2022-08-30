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
    <div class="ranking-list">
        <div class="rank-item">
            <div class="title">
                <span class="iconfont icon-database warning-color icon-title"></span>
                积分商品TOP排行榜
                <kdx-hint-tooltip style="font-weight: normal">
                    统计数据不包括已退款的商品数量
                </kdx-hint-tooltip>
            </div>
            <Table :columns="goods.columns" :data="goodsData">
                <!-- 排名 -->
                <template #rank="{index}">
                    <div class="rank-index">
                        <kdx-svg-icon type="icon-paihang-jinpai" v-if="index === 0"/>
                        <kdx-svg-icon type="icon-paihang-yinpai" v-else-if="index === 1"/>
                        <kdx-svg-icon type="icon-paihang-tongpai" v-else-if="index === 2"/>
                        <div class="text" v-else>{{ index + 1 }}</div>
                    </div>
                </template>
                <!-- 商品名称 -->
                <template #title="{row}">
                    <div class="title-box">
                        <div class="image" v-if="row.type == 1">
                            <img v-if="row.coupon_sale_type == 1" :src="require('@/assets/image/coupons/full-reduction.png')" alt @error="replaceImage">
                            <img v-if="row.coupon_sale_type == 2" :src="require('@/assets/image/coupons/discount.png')" alt @error="replaceImage">
                        </div>
                        <div class="image" v-else>
                            <img :src="$utils.media(row.thumb)" alt="" @error="replaceImage">
                        </div>
                        <div class="title">
                            <div v-if="row.type == 1">{{ row.coupon_name }}</div>
                            <div v-else>{{ row.title }}</div>
                        </div>
                    </div>
                </template>
                <!--销售数量 -->
                <template #total="{row}">
                    <div class="total">
                        <div>{{row.total}}</div>
                        <div class="piece">件</div>
                    </div>
                </template>
            </Table>
        </div>
        <div class="rank-item">
            <div class="title">
                <span class="iconfont icon-shuju-huiyuanshu success-color icon-title"></span>
                会员消费排行
                <kdx-hint-tooltip style="font-weight: normal">
                    统计数据不包括已退款的订单金额
                </kdx-hint-tooltip>
            </div>
            <Table :columns="consume.columns" :data="consumeData">
                <!-- 排名 -->
                <template #rank="{index}">
                    <div class="rank-index">
                        <kdx-svg-icon type="icon-paihang-jinpai" v-if="index === 0"/>
                        <kdx-svg-icon type="icon-paihang-yinpai" v-else-if="index === 1"/>
                        <kdx-svg-icon type="icon-paihang-tongpai" v-else-if="index === 2"/>
                        <div class="text" v-else>{{ index + 1 }}</div>
                    </div>
                </template>
                <!-- 会员名称 -->
                <template #nickname="{row}">
                    <div class="title-box">
                        <div class="image member-image">
                            <img :src="row.avatar" alt="" @error="replaceImage">
                        </div>
                        <div class="nickname">
                            {{row.nickname}}
                            <div class="member-source">
                                <span v-if="row.source == '10'" class="iconfont icon-source icon-H"></span>
                                <span v-if="row.source == '20'" class="iconfont icon-source icon-weixin"></span>
                                <span v-if="row.source == '21'" class="iconfont icon-source icon-weixinxiaochengxu"></span>
                                <span v-if="row.source == '30'"><kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2"></kdx-svg-icon></span>
                                <span v-if="row.source == '32'"><kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban"></kdx-svg-icon></span>
                                <span v-if="row.source == '31'"><kdx-svg-icon class="iconfont" type="icon-douyin"></kdx-svg-icon></span>
                                <span style="color:#12aa9c;font-size:16px" class="iconfont icon-PCduan" v-else-if="row.source === '70'"></span>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- 消费额 -->
                <template #pay_price="{row}">
                    <div class="total">￥{{row.pay_price || 0}}</div>
                </template>
            </Table>
        </div>
    </div>
</template>

<script>

export default {
    name: "RankingList",
    props: {
        goodsData: {
            type: Array,
            default: () => []
        },
        consumeData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            goods: {
                data: [],
                columns: [
                    {
                        title: '排行',
                        slot: 'rank',
                        width: 60
                    },
                    {
                        title: '商品',
                        slot: 'title'
                    },
                    {
                        title: '销售数量',
                        slot: 'total',
                        maxWidth: 140,
                        align: 'right'
                    }
                ]
            },
            consume: {
                data: [],
                columns: [
                    {
                        title: '排行',
                        slot: 'rank',
                        width: 60
                    },
                    {
                        title: '会员',
                        slot: 'nickname',
                        maxWidth: 300
                    },
                    {
                        title: '消费积分',
                        key: 'pay_credit'
                    },
                    {
                        title: '消费额',
                        slot: 'pay_price',
                        maxWidth: 160,
                        align: 'right'
                    }
                ]
            }
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.ranking-list {
    padding-top: 10px;
    //height: 420px;
    display: flex;
    margin-right: -10px;

    .rank-item {
        background-color: #ffffff;
        margin-right: 10px;
        flex: 1;
        border-radius: 2px;
        padding: 20px;
    }
}

.title {
    font-size: 16px;
    font-weight: bold;
    line-height: 22px;
    color: $text-first;
    padding-bottom: 10px;
    max-height: 50px;
    display: flex;
    align-items: center;
    .icon-title {
        font-size: 20px;
        margin-right: 5px;
    }
}
.rank-index {
    .svg-icon {
        font-size: 28px;
    }
}
.title-box {
    display: flex;
    align-items: center;
    .image {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        img {
            width: 100%;
            height: 100%;
            border-radius: 2px;
        }
    }
    .member-image {
        border-radius: 50%;
        overflow: hidden;
        margin-right: 9px;
    }
    .title {
        @include font-14-20;
        color: $text-first;
        @include font-multiple-omit(2);
        padding-left: 10px;
    }
}
.total {
    display: flex;
    justify-content: flex-end;
    .piece {
        margin-left: 9px;
        text-align: right;
    }
}

.icon-source {
    font-size: 20px;
    border-radius: 100%;
}
.icon-weixin {
    color: $success-color;
}
.icon-weixinxiaochengxu {
    color: #677de0;
}
.icon-toutiaoxiaochengxu {
    color: #239bff;
}
.icon-zhifubaoxiaochengxu {
    color: #2094e7;
}
.icon-baiduxiaochengxu {
    color: #306cff;
}
.icon-H {
    color: #ff6004;
}
</style>
