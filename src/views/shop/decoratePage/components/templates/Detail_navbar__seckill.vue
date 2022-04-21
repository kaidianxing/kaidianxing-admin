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
    <div class="detail_navbar__seckill ">
        <div class="left-btn van-hairline--top" @click="normalClick">
            <div class="left-btn-label">原价购买</div>
            <div class="left-btn-desc">
                ¥{{getPrice}}
            </div>
        </div>
        <div class="right-btn" :class="{
            'disabled': btnDisabled
        }" @click="specialClick">
            <span class="iconfont-m- icon-m-shandian right-btn-icon"></span>
            <span class="right-btn-text" v-if="!btnDisabled || !isSelled">马上抢</span>
            <span class="right-btn-text" v-else>已抢光</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'detail_navbar__seckill',
    props: {
        activityData: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        getPrice(){
            let {min_price,price,has_option} = this.activityData?.params?.goods||{};
            if(has_option=='1'){
                return `${this.formatMoney(min_price)}起`
            } else {
                return this.formatMoney(price)
            }
        },
        btnDisabled(){
            let stock =this.activityData?.params?.seckill?.activity_stock ||0
            return stock<=0;
        },
        // 库存为0
        isSelled(){
            return !this.activityData.params.canbuy;
        },
        // 剩余购买数量
        getSeckillLimit(){
            return this.activityData?.params?.seckill?.rules?.limit_num - this.activityData?.params?.seckill?.buy_count
        },
        limitBuy(){
             let limit_type = this.activityData?.params?.seckill?.rules.limit_type;
             if(limit_type!='0'){
                 return this.getSeckillLimit<=0
             } 
             return false
        }
    },
    methods: {
        normalClick(){
            this.$emit('normal-click', {
                btn:'buy',
            })
        },
        specialClick(){
            if(this.btnDisabled) return
            if(this.limitBuy) {
                this.$toast('购买超过限制')
                return;
            }
            this.$emit('special-click',{
                btn:'buy',
                activeName: 'seckill'
            })
        },
        formatMoney(money) {
            if (typeof money === 'number' || (typeof money === 'string' && money.trim() !== '')) {
                if (money >= 10000) {
                    return parseFloat(money / 10000) + '万'
                } else {
                    return parseFloat(money)
                }
            } else {
                return 0
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.detail_navbar__seckill {
    width: 100%;
    height: px2rpx(48);
    display: flex;
    flex-wrap: nowrap;
    box-sizing: border-box;
    background-color: #fff;

    .left-btn {
        padding: px2rpx(4) 0;
        width: px2rpx(140);
        height: px2rpx(48);
        text-align: center;

        &-label {
            margin-bottom: px2rpx(3);
            font-size: px2rpx(12);
            line-height: px2rpx(17);
            color: #212121;
        }

        &-desc {
            font-size: px2rpx(14);
            line-height: px2rpx(20);
            color: #ff3c29;
        }
    }

    .right-btn {
        text-align: center;
        line-height: px2rpx(48);
        flex: 1;
        color: #ffffff;
        background: linear-gradient(132.57deg, #ff3c29 0%, #ff6f29 94.38%);

        &.disabled {
            background: #CCCCCC;
        }

        &-icon {
            height: px2rpx(20);
            width: px2rpx(20);
            font-size: px2rpx(20);
        }

        &-text {
            font-weight: 600;
            font-size: px2rpx(18);
            line-height: px2rpx(25);
        }
    }
}
</style>
