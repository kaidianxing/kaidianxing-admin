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
    <div class="payment-tag">
        <div class="content alipay" v-if="type === 'alipay'">
            <span class="iconfont icon-alipay"></span>
            <span>支付宝</span>
        </div>
        <div class="content weichat" v-else-if="type === 'weichat' || type === 'wechat'">
            <span class="iconfont icon-wechatpay"></span>
            <span>微信支付</span>
        </div>
        <div class="content balance" v-else-if="type === 'balance'">
            <span class="iconfont icon-money-pay"></span>
            <span>余额支付</span>
        </div>
        <div class="content houtai" v-else-if="type === 'houtai'">
            <span class="iconfont icon-zhifu-houtaizhifu"></span>
            <span>后台付款</span>
        </div>
        <div class="content pay-delivery" v-else-if="type === 'payDelivery'">
            <span class="iconfont icon-zhifu-huodaofukuan"></span>
            <span>货到付款</span>
        </div>
        <div class="content yinlian" v-else-if="type === 'yinlian'">
            <span class="iconfont icon-zhifu-yinlian-bai"></span>
            <span>银联支付</span>
        </div>
        <div class="content byte-dance" v-else-if="type === 'byte_dance'">
            <span class="iconfont icon-zijietiaodongzhifu"></span>
            <span>字节跳动支付</span>
        </div>
        <div class="content no-pay" v-else-if="type === 'noPay'">
            <span class="iconfont icon-money-pay"></span>
            <span v-if="status!=0">无需支付</span>
            <span v-else>未支付</span>
        </div>
        <div class="content user" v-else-if="type === 'user'">
            <span>用户购买</span>
        </div>
        <div class="content recharge" v-else-if="type === 'recharge'">
            <span>手动充值</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PaymentTag",
        props: {
            type: {
                type: String,
                required: true
            },
            status: {
                type: String,Number
            }
        }
    };
</script>

<style scoped lang="scss">
    .payment-tag {
        display: inline-block;

        > .content {
            display: inline-block;
            padding: 1px 2px;
            border-radius: 2px;
            color: #ffffff;
            @include font-12-16;

            > .iconfont {
                color: #FFFFFF;
                font-size: 14px;
                padding-right: 2px;
                vertical-align: bottom;
            }
            > .svg-icon {
                color: #FFFFFF;
                font-size: 14px;
                padding-right: 2px;
                vertical-align: bottom;
            }
        }

        > .alipay {
            background-color: $brand-color;
        }

        > .weichat {
            background-color: #16B944;
        }

        > .balance {
            background-color: #FF9900;
        }
        > .houtai {
            background-color: $warning-color;
        }
        > .pay-delivery {
            background-color: #FF3D00;
        }
        > .yinlian {
            background-color: #004097;
        }
        > .byte-dance {
            background-color: #528AF7;;
        }
        > .no-pay {
            background-color: $text-zhushi;
        }
        > .user {
            background-color: $brand-color;
            color: #FFFFFF;
        }
        > .recharge {
            background-color: $warning-color;
            color: #FFFFFF;
        }
    }
</style>
