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
        <p class="title">收款方式</p>
        <div class="flex align-center info-list">
            <div class="info-label">收款渠道：</div>
            <div class="flex align-center channel" :class="getPayType.icon">
                <i class="iconfont channel-icon" :class="'icon-'+getPayType.icon"></i>
                <span class="channel-text">{{info.type_text}}</span>
            </div>
        </div>
        <div class="flex align-center info-list">
            <div class="info-label">收款人：</div>
            <div class="info-desc">{{info.realname || '-'}}</div>
        </div>
        <div class="flex align-center info-list">
            <div class="info-label">收款账号：</div>
            <div class="info-desc">{{info.alipay || '-'}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        getPayType() {
            let typeList = [
                {
                    id: '10',
                    text: '余额',
                    icon: 'money-pay'
                },

                {
                    id: '20',
                    text: '微信',
                    icon: 'wechatpay'
                },
                {
                    id: '30',
                    text: '支付宝',
                    icon: 'alipay'
                }
            ]
            return typeList.filter(list => list.id == this.info.type)[0] || {}
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    @include font-16-22-bold;
    color: $text-first;
    padding: 0 0 20px 20px;
}

.info-list {
    margin-bottom: 24px;
    @include font-12-16;

    .info-label {
        width: 100px;
        text-align: right;
        color: #262b30;
    }

    .info-value {
        color: #262b30;

        &.bold {
            font-weight: bold;
        }
    }

    .channel {
        border-radius: 2px;
        padding: 0 2px;
        min-width: 44px;
        height: 18px;

        &.money-pay {
            background-color: #ff9900;
        }

        &.wechatpay {
            background-color: #00ac1c;
        }
        &.alipay {
            background-color: #00a0ee;
        }
        &.weixin {
            background-color: $success-color;
        }

        .channel-icon {
            font-size: 14px;
            color: #fff;
        }

        .channel-text {
            @include font-12-16;
            color: #fff;
        }
    }
}
</style>