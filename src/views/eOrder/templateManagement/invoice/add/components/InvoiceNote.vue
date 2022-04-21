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
    <div class="invoice-note-box" ref="note_box" id="note_box">
        <div class="invoice-note" ref="note">
            <!--头部-->
            <div class="note-header" :class="{'note-header-no-long': getType, 'action': checkedKey==='send_message'}"
                 v-if="note.send_message && note.send_message.children" @click="changeKey('send_message')">
                <div class="title-box">
                    <div class="title" v-if="note.send_message.children.send_title">
                        {{data.send_title}}
                    </div>
                    <div class="time" v-if="note.send_message.children.print_time">
                        {{dataBase.print_time}}
                    </div>
                </div>
                <div class="logo" v-if="data.logo">
                    <img :src="$media(data.logo)" alt="">
                </div>
                <div class="bar-code" v-if="note.send_message.children.send_code">
                    <div class="code-image">
                        <img src="@/assets/image/bar_code.png" alt="">
                    </div>
                    <div class="code">
                        发货单编号：{{dataBase.send_code}}
                    </div>
                </div>
            </div>
            <div class="note-content" :class="{'note-content-no-long': getType}">
                <ul>
                    <!--订单信息-->
                    <li v-if="note.order_message && (note.order_message.checked || note.order_message.indeterminate)" @click="changeKey('order_message')">
                        <div class="item-title" v-if="!getType">
                            {{note.order_message.name}}
                        </div>
                        <div class="item-info-box order-info" v-if="note.order_message.children"  :class="{'action': checkedKey==='order_message'}">
                            <ul>
                                <template  v-for="item in note.order_message.children">
                                    <li :key="item.key" v-if="item.checked">
                                    <span class="label">
                                        {{item.name}}：
                                    </span>
                                        <span class="content">
                                        {{dataBase[item.key]}}
                                    </span>
                                    </li>
                                </template>
                            </ul>
                        </div>
                    </li>
                    <!--收货人信息-->
                    <li v-if="note.consignee_message && (note.consignee_message.checked || note.consignee_message.indeterminate)" @click="changeKey('consignee_message')">
                        <div class="item-title" v-if="!getType">
                            {{note.consignee_message.name}}
                        </div>
                        <div class="item-info-box user-info" v-if="note.consignee_message.children"  :class="{'action': checkedKey==='consignee_message'}">
                            <ul>
                                <li class="name" v-if="note.consignee_message.children.buyer_name">
                                <span class="label">
                                    {{note.consignee_message.children.buyer_name.name}}：
                                </span>
                                    <span class="content">
                                    {{dataBase.buyer_name}}
                                </span>
                                </li>
                                <li class="contact-way" v-if="note.consignee_message.children.buyer_mobile">
                                <span class="label">
                                    {{note.consignee_message.children.buyer_mobile.name}}：
                                </span>
                                    <span class="content">
                                    {{dataBase.buyer_mobile}}
                                </span>
                                </li>
                                <li class="address" v-if="note.consignee_message.children.address_code">
                                <span class="label">
                                    {{note.consignee_message.children.address_code.name}}：
                                </span>
                                    <span class="content">
                                    {{dataBase.address_code}}
                                </span>
                                </li>
                            </ul>
                            <div class="leave-message" v-if="note.consignee_message.children.buyer_remark">
                                <span class="label">
                                    {{note.consignee_message.children.buyer_remark.name}}：
                                </span>
                                <span class="content">
                                    {{dataBase.buyer_remark}}
                                </span>
                            </div>
                        </div>
                    </li>
                    <!--商品信息-->
                    <li v-if="note.goods_message && (note.goods_message.checked || note.goods_message.indeterminate)" @click="changeKey('goods_message')">
                        <div class="item-title" v-if="!getType">
                            {{note.goods_message.name}}
                        </div>
                        <div class="shop-table-list" v-if="note.goods_message.children"  :class="{'action': checkedKey==='goods_message'}">
                            <table width="100%">
                                <thead class="table-header">
                                <tr>
                                    <template v-for="item in note.goods_message.children">
                                        <th :class="item.key" :key="item.id" v-if="item.checked">
                                            {{item.name}}
                                        </th>
                                    </template>
                                </tr>
                                </thead>
                                <tbody class="table-content">
                                <template v-for="(base, index) in dataBase.order_goods">
                                    <tr :key="index">
                                        <template  v-for="item in note.goods_message.children">
                                            <td :class="item.key" :key="item.id" v-if="item.checked">
                                                <div>
                                                    <div :class="{'goods-two-line-hide': item.key === 'title' || item.key === 'option_title'}">
                                                        {{item.key === 'price_unit' || item.key === 'price' ? '￥': ''}}{{base[item.key] || '-'}}</div>
                                                </div>
                                            </td>
                                        </template>
                                    </tr>
                                </template>

                                </tbody>
                            </table>
                        </div>
                    </li>
                    <!--费用信息-->
                    <li v-if="note.price_message && (note.price_message.checked || note.price_message.indeterminate)" @click="changeKey('price_message')">
                        <div class="item-title" v-if="!getType">
                            {{note.price_message.name}}
                        </div>
                        <div class="item-info-box recharge-info-box" v-if="note.price_message.children"  :class="{'action': checkedKey==='price_message'}">
                            <ul class="recharge-info" v-if="!getType">
                                <li v-if="note.price_message.children.goods_count" class="goods-total-li">
                                    <div class="goods-total">商品件数合计：{{dataBase.goods_count}}</div>
                                </li>
                                <li>
                                    <ul>
                                        <li v-if="note.price_message.children.goods_price">
                                            <div class="label">
                                                {{note.price_message.children.goods_price.name}}：
                                            </div>
                                            <div class="content">
                                                ¥{{dataBase.goods_price}}
                                            </div>

                                        </li>
                                        <li v-if="note.price_message.children.dispatch_price">
                                            <div class="label">
                                                {{note.price_message.children.dispatch_price.name}}：
                                            </div>
                                            <div class="content">
                                                ¥{{dataBase.dispatch_price}}
                                            </div>
                                        </li>
                                        <li v-if="note.price_message.children.discount_price">
                                            <div class="label">
                                                {{note.price_message.children.discount_price.name}}：
                                            </div>
                                            <div class="content">
                                                -¥{{dataBase.discount_price}}
                                            </div>
                                        </li>
                                        <li class="payment" v-if="note.price_message.children.pay_price">
                                            <div class="label">{{note.price_message.children.pay_price.name}}：</div>
                                            <div class="content"><span style="font-size: 14px">¥</span>{{dataBase.pay_price}}</div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                            <ul class="recharge-info-no-long" v-else>
                                <li class="goods-number" v-if="note.price_message.children.goods_count">
                                    <div>
                                        商品件数合计：{{dataBase.goods_count}}
                                    </div>
                                </li>
                                <li class="payment">
                                    <div class="left">
                                        <div class="left-item" v-if="note.price_message.children.goods_price">
                                            {{note.price_message.children.goods_price.name}}：¥{{dataBase.goods_price}}
                                        </div>
                                        <div class="left-item" v-if="note.price_message.children.dispatch_price">
                                            {{note.price_message.children.dispatch_price.name}}：¥{{dataBase.dispatch_price}}
                                        </div>
                                        <div class="left-item" v-if="note.price_message.children.discount_price">
                                            {{note.price_message.children.discount_price.name}}：-¥{{dataBase.discount_price}}
                                        </div>
                                    </div>
                                    <div class="right" v-if="note.price_message.children.pay_price">
                                        <span class="label">{{note.price_message.children.pay_price.name}}：</span>
                                        <span class="content"><span style="font-size: 14px">¥</span>{{dataBase.pay_price}}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <!--底部信息-->
            <div class="note-footer" :class="{'note-footer-no-long': getType}" v-if="data.qr_code || data.footer">
                <div class="qr-code" v-if="data.qr_code">
                    <qr-code :url="data.qr_code" :size="getType == 1 ? 60 : 124"></qr-code>
                </div>
                <div class="name" v-if="data.footer">
                    {{data.footer}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import QrCode from "@/components/QrCode";

    const dataBase = {
        send_title: '发货单',
        send_code: '202012354789',
        order_no: 'SH20191123102338822883',
        order_code: 'SH20191123102338822883',
        member_nickname: 'Authur',
        member_level: '白金会员',
        pay_type: '微信',
        print_time: '2020-08-16 10:10:10',
        created_at: '2020-08-15 10:12:20',
        pay_time: '2020-08-16 10:20:10',
        dispatch_type: '普通快递',
        buyer_name: '王五',
        buyer_mobile: '15210530729',
        address_code: '山东省济南市天桥区',
        buyer_remark: '麻烦请发顺丰，不然邮寄不到',
        order_goods: [
            {
                number: '1',
                title: '美威 智利原味三文鱼排（大西洋 鲑）240g/袋 4片 含Ω3 BAP认证',
                short_name: '小核蜜丁香小',
                option_title: '智利原味三文鱼排（大西洋鲑） 240g/袋 4片 含Ω3 BAP认证',
                goods_sku: '1234567899625566',
                price_unit: '1234567.74',
                price: '123456.789',
                total: '2'
            }
        ],
        goods_price: '12346.00',
        dispatch_price: '10',
        discount_price: '120',
        pay_price: '199',
        goods_count: '1'
    };
    export default {
        name: "InvoiceNote",
        components: {
            QrCode
        },
        props: {
            data: {
                type: Object
            },
            note: {
                type: Object,
                default: () => {
                }
            },
            checkedKey: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                style: {
                    A4: {
                        width: 1143,
                        height: 1579,
                        rate: 1.38
                    },
                    A5: {
                        width: 2480,
                        height: 1654,
                        rate: 0.67
                    }
                },
                width: 1143,
                dataBase: dataBase,
                type: 'A4',
            };
        },
        computed: {
            getType() {
                // true 样式2A5 false 样式1A4
                return this.data?.type == 1;
            },
        },
        methods: {
            changeKey(key) {
                this.$emit('on-change-key', key)
            }
        }
    };
</script>

<style scoped lang="scss">
    .invoice-note-box {
        flex-shrink: 0;
        width: 842px;
        margin-right: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #FFFFFF;
    }

    .action {
        background-color: $brand-light !important;
    }
    .goods-two-line-hide {
        word-break:break-all;
        overflow: hidden;
        box-sizing: border-box;
    }
    .invoice-note {
        background-color: #ffffff;
        padding: 30px 20px;
        /*width: 900px;*/
        /*height: 3425px;*/
        box-sizing: border-box;
        min-height: 100%;
        /*transform: scale(0.8);*/
        /* transform-origin: left top;*/
        .note-header {
            position: relative;
            color: $text-first;
            min-height: 56px;

            .title-box {
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                min-height: 62px;
                .title {
                    font-size: 28px;
                    font-weight: 600;
                    line-height: 39px;
                    text-align: center;
                }

                .time {
                    font-size: 14px;
                    line-height: 20px;
                    text-align: center;
                }
            }

            .logo {
                position: absolute;
                left: 0;
                top: 0;
                max-width: 100%;
                height: 58px;

                > img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }

            .bar-code {
                position: absolute;
                right: 0;
                top: 0;

                .code-image {
                    /*width: 222px;*/
                    height: 42px;
                    overflow: hidden;

                    > img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                }

                .code {
                    font-size: 14px;
                    line-height: 20px;
                    text-align: right;
                }
            }
        }

        .note-content {
            > ul {
                > li {
                    .item-title {
                        font-size: 16px;
                        line-height: 22px;
                        color: $text-first;
                        padding-top: 20px;
                        font-weight: bold;
                        padding-bottom: 10px;
                    }
                    .item-info-box {
                        border: 1px solid $text-second;
                        padding: 12px 12px 6px 12px;
                        font-size: 14px;
                        line-height: 20px;
                        &.order-info {
                           >ul {
                               >li {
                                   width: 240px;
                                   margin-right: 20px;
                                   &:nth-child(3n+1) {
                                       width: 250px;
                                   }
                                   &:nth-child(3n) {
                                       margin-right: 0;
                                   }
                               }
                           }
                        }
                        &.user-info {
                            padding: 12px 0 6px 0;

                            > ul {
                                padding-left: 12px;
                                > li {
                                    /*padding-right: 20px;*/
                                    font-size: 14px;
                                    line-height: 20px;
                                    /*height: 30px;*/
                                    width: 240px;
                                    &.name,
                                    &.contact-way {
                                        margin-right: 20px;
                                    }
                                    &:first-child {
                                        &.name {
                                            width: 250px;
                                        }
                                        &.contact-way {
                                            width: 250px;
                                        }
                                    }
                                }
                            }

                            .leave-message {
                                width: 100%;
                                padding: 12px 12px 6px 12px;
                                margin-top: 6px;
                                border-top: 1px solid $text-second;
                            }
                        }

                        > ul {
                            display: flex;
                            flex-wrap: wrap;

                            > li {
                                /*width: 33.3%;*/
                                font-size: 14px;
                                line-height: 20px;
                                color: $text-first;
                                padding-bottom: 6px;

                                &.address {
                                    width: 100%;
                                }
                            }
                        }

                        &.recharge-info-box {
                            padding: 0;

                            .recharge-info {
                                display: flex;
                                align-items: stretch;
                                justify-content: flex-end;

                                > li {
                                    display: table-cell;
                                    padding-bottom: 0;

                                    &:first-child {
                                        font-size: 18px;
                                        line-height: 25px;
                                        width: 40%;
                                        text-align: center;
                                    }

                                    &:last-child {
                                        width: 60%;
                                        display: flex;
                                        justify-content: flex-end;
                                    }
                                    &.goods-total-li {
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        border-right: 1px solid $text-second;
                                    }


                                    > ul {
                                        padding: 12px 12px 6px 12px;

                                        > li {
                                            display: flex;
                                            font-size: 14px;
                                            line-height: 20px;
                                            padding-bottom: 6px;
                                            justify-content: center;

                                            .label {
                                                text-align: right;
                                                min-width: 800px;
                                                flex-shrink: 0;
                                            }

                                            .content {
                                                min-width: 80px;
                                            }

                                            &.payment {
                                                align-items: center;
                                                .label {
                                                    font-size: 14px;
                                                    line-height: 20px;
                                                    vertical-align: middle;
                                                }

                                                .content {
                                                    font-size: 20px;
                                                    line-height: 28px;
                                                    font-weight: bold;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .shop-table-list {
                        border: 1px solid #636669;
                        thead {
                            background-color: #f4f6fb;
                            width: 100%;
                        }

                        table {
                            border-collapse: collapse;

                            tr {
                                th,
                                td > div {
                                    padding: 10px 20px 10px 0;
                                    text-align: left;
                                    font-size: 14px;
                                    line-height: 20px;
                                }

                                td > div {
                                    padding: 4px 20px 4px 0;
                                }

                                th,
                                td {
                                    &:first-child {
                                        padding-left: 12px;
                                    }
                                    &:last-child {
                                        >div {
                                            padding-right: 12px;
                                        }
                                    }
                                }

                                th {
                                    font-weight: bold;
                                    &.number {
                                        padding-right: 12px;
                                    }
                                }

                                td {
                                    border-top: 1px solid #636669;
                                }

                                .number {
                                    width: 55px;
                                }

                                .title {
                                    min-width: 100px;

                                    .goods-two-line-hide {
                                        max-height: 40px;
                                    }
                                }

                                .short_name {
                                    min-width: 80px;
                                }

                                .goods_sku {
                                    min-width: 80px;
                                }

                                .option_title {
                                    min-width: 100px;

                                    .goods-two-line-hide {
                                        max-height: 40px;
                                    }
                                }

                                .price_unit {
                                    min-width: 60px;
                                }

                                .total {
                                    min-width: 50px;
                                }

                                .price {
                                    min-width: 60px;
                                }
                            }
                        }
                    }
                }
            }
        }

        .note-footer {
            padding-top: 70px;
            margin: 0 auto;

            .qr-code {
                width: 124px;
                height: 124px;
                overflow: hidden;
                margin: 0 auto;

                > img {
                    width: 100%;
                    height: 100%;
                }
            }

            .name {
                font-size: 14px;
                line-height: 20px;
                color: $text-first;
                text-align: center;
                padding-top: 6px;
            }
        }

        // A5纸张效果
        .note-header-no-long {
            padding-bottom: 40px;
        }

        .note-content-no-long {
            > ul {
                > li {
                    &:last-child {
                        border-bottom: 1px solid $text-second;
                    }

                    .item-info-box {
                        border-bottom: none;

                        &.user-info {
                            display: flex;
                            padding: 0;

                            > ul,
                            .leave-message {
                                padding: 12px 12px 6px 12px;
                                margin-top: 0;
                                border-top: none;
                                border-left: 1px solid $text-second;
                            }

                            > ul {
                                width: 70%;
                                //border-right: 1px solid $text-second;
                                >li {
                                    width: 36.3%;
                                    &.address {
                                        width: 100%;
                                    }
                                }
                            }

                            .leave-message {
                                width: 30%;
                                padding-bottom: 18px;
                            }
                        }

                        &.recharge-info-box {
                            .recharge-info-no-long {
                                display: flex;
                                align-items: stretch;

                                .goods-number {
                                    border-right: 1px solid $text-second;
                                    text-align: center;
                                    font-size: 18px;
                                    line-height: 25px;
                                    width: 25%;
                                    display: flex;
                                    align-items: center;
                                    >div {
                                        text-align: center;
                                    }
                                }

                                > li {
                                    padding: 12px 12px 12px 12px;

                                    &.payment {
                                        flex: 1;
                                        display: flex;
                                        justify-content: flex-end;
                                        align-items: center;

                                        .left {
                                            display: flex;
                                            align-items: center;

                                            .left-item {
                                                padding-right: 20px;
                                                font-size: 14px;
                                                line-height: 20px;
                                            }
                                        }

                                        .right {
                                            .label {
                                                font-size: 14px;
                                                line-height: 20px;
                                            }

                                            .content {
                                                font-size: 20px;
                                                line-height: 28px;
                                                font-weight: bold;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    .shop-table-list {
                        border-bottom: none;
                    }
                }
            }
        }

        .note-footer-no-long {
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 10px;

            .qr-code {
                width: 60px;
                height: 60px;
                margin: 0;
                flex-shrink: 0;
            }

            .name {
                padding-top: 0;
                padding-left: 6px;
                font-size: 12px;
                line-height: 17px;
                text-align: left;
            }
        }
    }
</style>
