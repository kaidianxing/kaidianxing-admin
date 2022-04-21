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
    <div class="income">
        <div class="income-title">
            <p>直播收益概览</p>
            <kdx-hint-tooltip
                type="form"
                placement="right"
            >
                <template #header>
                    <div class="example">
                        <i class="iconfont icon-shili" />
                        <span class="example-tip">说明</span>
                    </div>
                </template>
                <div>通过直播间进入商城产生销售额的总计</div>
            </kdx-hint-tooltip>
        </div>
        <div class="income-items">
            <div
                class="income-item"
                v-for="(item,index) in items"
                :key="index"
            >
                <img
                    :src="item.src"
                    class="income-item-img"
                />
                <div class="income-item-info">
                    <p class="income-item-title">{{item.label}}</p>
                    <p class="income-item-desc">{{info[item.key]}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => { }
        },
    },
    data() {

        return {
            items: [{
                label: '付款总金额(元)',
                key: 'order_pay_price',
                src: require('@/assets/image/data/data-money.png')
            }, {
                label: '付款总订单(笔)',
                key: 'order_pay_count',
                src: require('@/assets/image/data/data-order.png')
            }, {
                label: '付款总数(人)',
                key: 'order_member_count',
                src: require('@/assets/image/data/data-person.png')
            }, {
                label: '订单转化率 ',
                value: '23,123.22',
                key: 'pay_percent',
                src: require('@/assets/image/data/data-parse.png')
            }]
        }
    }
}
</script>
<style lang="scss" scoped>
.income {
    border-radius: px2rpx(2);
    padding: 30px 40px;
    background-color: #fff;
    
    &-title {
        display: flex;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        color: #262b30;
    }

    .example {
        display: flex;
        align-items: center;
        .icon-shili {
            font-size: 14px;
            color: #b8b9bd;
        }

        &-tip {
            font-size: 12px;
            line-height: 16px;
            color: #636669;
        }
    }

    &-items {
        margin-top: 30px;
        display: flex;
        justify-content: flex-start;
    }

    @media screen and (max-width: 1500px) {
        .income-item {
            padding-left: 20px;
        }
        .income-item-img {
            margin-right: 10px;
            height: 48px;
            width: 48px;
        }

        .income-item-desc {
            font-size: 28px;

        }
    }
    @media screen and (min-width: 1500px) {
        .income-item {
            padding-left: 40px;
        }
        .income-item-img {
            margin-right: 20px;
            height: 60px;
            width: 60px;
        }

        .income-item-desc {
            font-size: 32px;
            line-height: 39px;
        }
    }

    &-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-right: 20px;
        border: 1px solid #e9edef;
        border-radius: 2px;
        padding-left: 40px;
        height: 120px;
        background: linear-gradient(180deg, #F7F8FF 0%, #FFFFFF 100%);

        :last-child {
            margin-right: 0;
        }

        &-title {
            font-size: 12px;
            line-height: 16px;
            color: #636669;
        }
        &-desc {
            margin-top: 4px;
            font-size: 30px;
            line-height: 36px;
            color: #262b30;
        }
    }
}
</style>