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
    <!--售后详情-->
    <div class="order-detail">
        <!--0仅退货1：退货退款2换货-->
        <!--仅退款-->
        <detail-refund v-if="refundStatus === '0'" :status="status" :data="data"></detail-refund>
        <!--退货退款-->
        <returns-refunds v-else-if="refundStatus === '1'" :status="status" :data="data"></returns-refunds>
        <!--换货-->
        <exchange-goods v-else-if="refundStatus === '2'" :status="status" :data="data"></exchange-goods>
        <slot></slot>
    </div>
</template>

<script>
    import DetailRefund from './refund/index';
    import ReturnsRefunds from './ReturnsRefunds/index';
    import ExchangeGoods from './ExchangeGoods/index';

    export default {
        name: "index",
        components: {DetailRefund, ReturnsRefunds, ExchangeGoods},
        data() {
            return {
                status: '0',
                id: '0',
                refundStatus: '0',
                data: {
                    "id": "1",
                    "uniacid": "dnu",
                    "order_sn": "gf6",
                    "trans_id": "CkXH9",
                    "member_id": "0vK",
                    "price": "o6H1",
                    "real_price": "AWDHDB",
                    "discount_price": "6W(XU3J",
                    "discount_info": "r1AKm0",
                    "dispatch": "8)1&CF",
                    "goods_info": "]#qH[*",
                    "province": "LQJ(6",
                    "city": "GUbWe",
                    "area": "@i[]",
                    "address_code": "N4m4KZ",
                    "address": "Z@j",
                    "agent_id": "kPjN",
                    "status": "tAwG8",
                    "pay_type": "s[sfJG",
                    "created_at": "2iaoc(",
                    "pay_time": "5uJ",
                    "send_time": "0wAV$",
                    "finisn_time": "[IOqz",
                    "cancel_time": "@yY7CP",
                    "cancel_reason": "(2K%x",
                    "buyer_name": "TQIqG#",
                    "buyer_mobile": "4Tybn",
                    "refund_status": "p[(GUN",
                    "buyer_remark": "EFYa0K",
                    "user_delete": "d*CnBdr",
                    "order_type": "4^o0K0x",
                    "member_nickname": "[*1[@8m",
                    "member_realname": "lqKt",
                    "member_mobile": "L8EY(",
                    "change_price": "@pKXfS",
                    "change_dispatch": "6Ey)4e",
                    "create_from": "bCD",
                    "dispatch_type": "g9iHV6",
                    "is_refund": "4]sXMw",
                    "remark": "(aQm",
                    "cost_price": "PW4",
                    "auto_finish_time": "(dCp",
                    "pay_type_text": "HIr[9Q",
                    "dispatch_type_text": "A2636P0",
                    "status_text": "uUas!",
                    "create_from_text": "L)P",
                    "type_text": "Ljw5&L",
                    "coupon_price": "sl$%",
                    "member_discount": "Tvq",
                    "credit_discount": "hGH]ga]",
                    "banlance_discount": "KEH!",
                    "enough_discount": "@qoQv",
                    "sale_discount": "GlPZO^"
                }
            };
        },
        watch: {
            '$route.path': {
                handler(val) {
                    console.log('val', val, this.$router.params, this.$route.query);
                    this.status = this.$route.query.status;
                    this.refundStatus = this.$route.query.refundStatus;
                    this.id = this.$route.query.id;
                    this.data.status = this.status;
                },
                immediate: true
            }
        }
    };
</script>

<style scoped lang="scss">


    .order-detail {
        background-color: $background-color;

        /deep/ .ivu-card-body {
            padding: 30px;

            .ivu-steps {
                padding: 0 130px;
            }
        }

        .order-detail-content {
            overflow: hidden;
            margin-top: 10px;
            padding: 0 40px;
            background-color: #ffffff;
        }
    }
</style>
