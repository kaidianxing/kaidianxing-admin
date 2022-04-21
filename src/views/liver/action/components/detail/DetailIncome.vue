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
        <p class="income-title">直播间收益概览</p>
        <div class="income-list">
            <div
                class="income-item"
                v-for="(item,index) in items"
                :key="index"
            >
                <div class="icon-box-container">
                    <div
                        class="icon-box"
                        :style="{
                            background: item.bgcolor
                        }"
                    >
                        <i
                            class="iconfont"
                            :class="item.icon"
                            :style="{
                            color: item.color
                        }"
                        ></i>
                    </div>
                </div>
                <div>
                    <p class="income-item-title">{{item.title}}</p>
                    <p class="income-item-value">{{info[item.key]}}</p>
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
        }
    },
    data() {
        return {
            items: [{
                icon: 'icon-haibao-jianglishezhi-top',
                bgcolor: '#F0FAFF',
                color:this.$css['--theme-color'],
                title: '付款总金额',
                key: 'order_pay_price'
            }, {
                icon: 'icon-yongjin',
                bgcolor: '#EDFFF3',
                color: '#19BE6B',
                title: '付款总订单',
                key: 'order_pay_count'
            }, {
                icon: 'icon-xiaochengxuzhibo-fukuanzongrenshu',
                bgcolor: '#FFF9E6',
                color: '#FF9900',
                title: '付款总人数',
                key: 'order_member_count'
            }, {
                icon: 'icon-xiaochengxuzhibo-zhuanhuashuai',
                bgcolor: '#F0FAFF',
                color:this.$css['--theme-color'],
                title: '订单转化率',
                key: 'pay_percent'
            }]
        }
    }
}
</script>

<style lang="scss" scoped>
.income {
    margin-bottom: 10px;
    padding: 20px 40px;
    background: #fff;
    border-radius: 2px;

    &-title {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
        color: #262b30;
    }

    &-list {
        display: flex;
        justify-content: space-between;
    }

    &-item {
        flex: 1;
        display: flex;
        align-items: center;
        margin-right: 10px;
        border: 1px solid #e9edef;
        border-radius: 2px;
        padding-left: 28px;
        height: 132px;

        &:last-child {
            margin-right: 0;
        }

        @media screen and (max-width: 1440px) {
            .icon-box-container {
                width: 1232px;
            }
        }
        @media screen and (min-width: 1440px) {
            .icon-box-container {
                width: 132px;
            }
        }

        .icon-box {
            border-radius: 50%;
            height: 74px;
            width: 74px;
            text-align: center;
            line-height: 74px;

            .iconfont {
                font-size: 50px;
            }
        }

        &-title {
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 20px;
            color: #262b30;
        }

        &-value {
            font-size: 24px;
            line-height: 34px;
            color: #262b30;
        }
    }
}
</style>