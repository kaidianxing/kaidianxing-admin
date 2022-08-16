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
    <div>
        <p class="title">订单信息</p>
        <Form :label-width="100">
            <FormItem label="会员：">
                <span
                    class="vip-name"
                    :class="{
                  'on':data.member_nickname
                }"
                    @click="skipVipCenter"
                >{{data.member_nickname || ' - '}}</span>
            </FormItem>
            <FormItem label="订单状态：">
                <span class="order-status" :class="getColor">{{data.refund_info.refund_status_text}}</span>
            </FormItem>
            <FormItem label="订单类型：">
                <span v-if="data.activity_type == 2"><span v-if="is_Seckill" class="iconfont icon-dingdanliebiao-miaosha seckill-icon"></span>秒杀订单</span>
                <span v-else-if="data.order_type === '10' || data.order_type == '30'">普通订单</span>
            </FormItem>
            <FormItem label="订单编号：" class="order-no">
                <!--微信图标 订单来源 10:wap-h5 20:公众号 21:微信小程序 30:字节跳动小程序 50:PC-->
                <!--公众号-->
                <span v-if="data.create_from == '20'" class="iconfont icon-weixin icon"></span>
                <!--微信小程序-->
                <span v-if="data.create_from == '21'" class="iconfont icon-weixinxiaochengxu icon"></span>
                <!--头条小程序-->
                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-if="data.create_from == '30'"></kdx-svg-icon>
                <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-if="data.create_from == '32'"></kdx-svg-icon>
                <!--抖音小程序-->
                <kdx-svg-icon class="iconfont" type="icon-douyin" v-if="data.create_from == '31'"></kdx-svg-icon>
                <!--支付宝小程序-->
                <!--<span v-if="data.create_from === '3'" class="iconfont icon-zhifubaoxiaochengxu icon"></span>-->
                <!--百度小程序-->
                <!--<span v-if="data.create_from === '0'" class="iconfont icon-baiduxiaochengxu icon"></span>-->
                <!--h5-->
                <span v-if="data.create_from == '10'" class="iconfont icon-H icon"></span>
                <span style="color:#12aa9c;font-size:16px" class="iconfont icon-PCduan" v-if="data.create_from === '70'"></span>
                <span>{{data.order_no}}</span>
                <kdx-copy-text type="qrCode" :text="data.order_no">
                    <Button type="text" size="small">复制</Button>
                </kdx-copy-text>
            </FormItem>
            <FormItem label="支付方式：">
                <!--1 后台确认2 余额支付3 货到付款20 微信支付30 支付宝支付-->
                <template v-if="data.pay_type === '1'">
                    <payment-tag type="houtai"></payment-tag>
                </template>
                <!--余额支付-->
                <template v-else-if="data.pay_type === '2'">
                    <payment-tag type="balance"></payment-tag>
                </template>
                <!--货到付款-->
                <template v-else-if="data.pay_type === '3'">
                    <payment-tag type="payDelivery"></payment-tag>
                </template>
                <!--微信支付-->
                <template v-else-if="data.pay_type === '20'">
                    <payment-tag type="weichat"></payment-tag>
                </template>
                <!--支付宝支付-->
                <template v-else-if="data.pay_type === '30'">
                    <payment-tag type="alipay"></payment-tag>
                </template>
                <!--字节跳动支付-->
                <template v-else-if="data.pay_type === '40' || data.pay_type === '41'">
                    <payment-tag type="byte_dance"></payment-tag>
                </template>
                <template v-else>
                    <payment-tag type="noPay"></payment-tag>
                </template>
            </FormItem>
            <FormItem label="交易单号：">
                <div v-if="data.trade_no&&data.trade_no !== '0'">
                    <span>{{data.trade_no}}</span>
                    <kdx-copy-text  type="qrCode" :text="data.trade_no">
                        <Button type="text" size="small">复制</Button>
                    </kdx-copy-text>
                </div>
                <span class="vip-name" v-else>-</span>
            </FormItem>
            <FormItem label="付款时间：">{{data.pay_time}}</FormItem>
        </Form>
    </div>
</template>

<script>
import PaymentTag from '@/components/little/PaymentTag'

export default {
    components: {
        PaymentTag
    },
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        getColor() {
            let { status } = this.data.refund_info
            if (0 <= status && status <= 9) {
                return 'pending'
            } else {
                return 'success'
            }
        },
        // 是否秒杀活动
        is_Seckill(){
            return this.data.activity_type ==2
        },
    },
    methods: {
        skipVipCenter() {
            this.$router.push('/member/detail?id=' + this.data.member_id)
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    @include font-16-22-bold;
    color: $text-first;
    padding-left: 20px;
    padding-bottom: 20px;

}
.seckill-icon {
    font-size: 17px;
    color: #ff1f2c;
}

.vip-name {
    cursor: pointer;

    &.on {
        color: $brand-color;
    }
}
.order-status {
    &.pending {
        color: #ff9900;
    }

    &.success {
        color: #19be6b;
    }

    .fail {
        color: #ff1f2c;
    }
}

.ivu-btn-text {
    margin-left: 10px;
}
.order-no {
    .iconfont {
        font-size: 18px;
    }
    .icon-weixin {
        color: $success-color;
    }
    .icon-weixinxiaochengxu {
        color: $channel-weixinxiaochengxu;
    }
    .icon-toutiaoxiaochengxu {
        color: #239BFF;
    }

    .icon-zhifubaoxiaochengxu {
        color: #2094E7;
    }

    .icon-baiduxiaochengxu {
        color: #306CFF;
    }

    .icon-H {
        color: #FF6004;
    }
}
.iconfont.icon-yingyong-pintuan {
    color: #F66000;
    font-size: 18px;
}
.iconfont.icon-dingdanliebiao-pintuanfanli {
    color: #ff9900;
    font-size: 18px;
}
.iconfont.icon-dingdanliebiao-jifen {
    font-size: 18px;
    color: #6100FF;
}
</style>
