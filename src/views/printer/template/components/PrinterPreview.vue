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
    <div class="printer-preview">
        <div class="title" v-if="type != 'preview'">小票预览</div>
        <kdx-hint-alert v-if="type != 'preview'" :show-icon="false">提示：当前小票只适用 58mm规格。</kdx-hint-alert>
        <div class="printer-template-content">
            <!-- 头部内容 -->
            <div class="top" v-if="templateData.header_info.shop_name">
                <!--<div class="shop-logo" v-if="templateData.header_info.shop_logo">
                    <img src="" alt="">
                </div>-->
                <div class="shop-name">店铺名称</div>
            </div>
            <!-- 商品信息 -->
            <div class="goods-info">
                <div class="item flex border" v-if="templateData.goods_info.goods_name || templateData.goods_info.goods_sku || templateData.goods_info.goods_num || templateData.goods_info.goods_price">
                    <div class="item-title" v-if="templateData.goods_info.goods_name || templateData.goods_info.goods_sku">商品名称</div>
                    <div class="item-title" v-if="templateData.goods_info.goods_num">数量</div>
                    <div class="item-title" v-if="templateData.goods_info.goods_stock">库存</div>
                    <div class="item-title price" v-if="templateData.goods_info.goods_price">金额</div>
                </div>
                <div class="border goods-info-content" v-if="templateData.goods_info.goods_name || templateData.goods_info.goods_sku || templateData.goods_info.goods_num || templateData.goods_info.goods_price">
                    <div class="item-info mt-12">
                        <div class="goods-title" v-if="templateData.goods_info.goods_name">塑料玩具储物箱儿童侧开衣物整理箱</div>
                        <div v-if="templateData.goods_info.goods_sku">SC146546546545454</div>
                        <div v-if="templateData.goods_info.goods_option">【中+白】</div>
                    </div>
                    <div class="item flex">
                        <div></div>
                        <div class="item-info" v-if="templateData.goods_info.goods_num">x1</div>
                        <div class="item-info" v-if="templateData.goods_info.goods_stock">99</div>
                        <div class="item-info price" v-if="templateData.goods_info.goods_price">￥299.00</div>
                    </div>
                    <div class="item-info mt-12">
                        <div class="goods-title" v-if="templateData.goods_info.goods_name">塑料玩具储物箱儿童侧开衣物整理箱</div>
                        <div v-if="templateData.goods_info.goods_sku">SC146546546545454</div>
                        <div v-if="templateData.goods_info.goods_option">【中+白】</div>
                    </div>
                    <div class="item flex">
                        <div></div>
                        <div class="item-info" v-if="templateData.goods_info.goods_num">x1</div>
                        <div class="item-info" v-if="templateData.goods_info.goods_stock">99</div>
                        <div class="item-info price" v-if="templateData.goods_info.goods_price">￥299.00</div>
                    </div>
                    <div class="item-info mt-12">
                        <div class="goods-title" v-if="templateData.goods_info.goods_name">塑料玩具储物箱儿童侧开衣物整理箱</div>
                        <div v-if="templateData.goods_info.goods_sku">SC146546546545454</div>
                        <div v-if="templateData.goods_info.goods_option">【中+白】</div>
                    </div>
                    <div class="item flex">
                        <div></div>
                        <div class="item-info" v-if="templateData.goods_info.goods_num">x1</div>
                        <div class="item-info" v-if="templateData.goods_info.goods_stock">99</div>
                        <div class="item-info price" v-if="templateData.goods_info.goods_price">￥299.00</div>
                    </div>
                </div>

            </div>
            <!-- 合计信息 -->
            <div class="calculate-info border">
<!--                <div class="border goods-info-price">-->
                    <div class="item flex" v-if="templateData.calculate_info.order_original_price">
                        <div class="item-info" v-if="templateData.calculate_info.order_original_price">合计</div>
                        <div class="item-info" v-if="templateData.goods_info.goods_num">x3</div>
                        <div class="item-info price" v-if="templateData.calculate_info.order_original_price">￥897.00</div>
                    </div>
                    <div class="item flex" v-if="templateData.calculate_info.dispatch_price">
                        <div class="item-info">运费</div>
                        <div class="item-info price">￥10.00</div>
                    </div>
                    <div class="item flex" v-if="templateData.calculate_info.order_discounts_price">
                        <div class="item-info">优惠金额</div>
                        <div class="item-info price">-￥10.00</div>
                    </div>
                    <div class="item flex" v-if="templateData.calculate_info.order_pay_price">
                        <div class="item-info">实付金额</div>
                        <div class="item-info price">￥897.00</div>
                    </div>
<!--                </div>-->
            </div>
            <!-- 订单信息 -->
            <div class="order-info border">
                <div class="item flex" v-if="templateData.order_info.order_no">
                    <div class="label">订单编号：</div>
                    <div>ME20185464567485465213</div>
                </div>
                <div class="item flex" v-if="templateData.order_info.pay_type">
                    <div class="label">支付方式：</div>
                    <div>微信支付</div>
                </div>
                <div class="item flex" v-if="templateData.order_info.pay_channel">
                    <div class="label">支付渠道：</div>
                    <div>微信小程序</div>
                </div>
                <div class="item flex" v-if="templateData.order_info.created_at">
                    <div class="label">下单时间：</div>
                    <div>2020-07-07 18:21:10</div>
                </div>
                <div class="item" v-if="templateData.order_info.order_form">
                    <div>单行文本标题比如使用人数：</div>
                    <div>单行文本输入内容比如2人</div>
                </div>
                <div class="item flex" v-if="templateData.order_info.pay_time">
                    <div class="label">付款时间：</div>
                    <div>2020-07-07 18:21:10</div>
                </div>
                <div class="item flex" v-if="templateData.order_info.finish_time">
                    <div class="label">收货时间：</div>
                    <div>2020-07-07 18:21:10</div>
                </div>
            </div>
            <!-- 会员信息 -->
            <div class="order-info border">
                <div class="item flex" v-if="templateData.member_info.nickname">
                    <div class="label">会员昵称：</div>
                    <div>咔咔咔</div>
                </div>
                <div class="item flex" v-if="templateData.member_info.mobile">
                    <div class="label">联系方式：</div>
                    <div>18566665555</div>
                </div>
                <div class="item flex" v-if="templateData.member_info.level">
                    <div class="label">会员等级：</div>
                    <div>黄金会员</div>
                </div>
                <div class="item flex" v-if="templateData.member_info.commission_level">
                    <div class="label">分销商等级：</div>
                    <div>二级分销商</div>
                </div>
            </div>
            <!-- 买家备注 -->
            <div class="order-info border" v-if="templateData.mark_info.customer_mark">
                <div class="item flex">
                    <div class="label">买家留言：</div>
                    <div class="bold">请尽快发货！！！</div>
                </div>
            </div>
            <!-- 商家留言 -->
            <!--<div class="order-info border" v-if="templateData.mark_info.saler_mark">
                <div class="item flex">
                    <div class="label">商家留言：</div>
                    <div class="bold">不要辣不要醋不要火腿肠不要辣不要醋不要火腿肠不要辣不要醋不要火腿肠不要辣不要醋不要火腿肠不要辣不要醋不要火腿肠不要辣不要醋不要火腿肠不要辣不要醋不要火腿肠不要辣不要醋不要火腿肠</div>
                </div>
            </div>-->
            <!-- 买家信息 -->
            <div class="order-info border" v-if="templateData.customer_info.name || templateData.customer_info.mobile || templateData.customer_info.address">
                <div class="item flex" v-if="templateData.customer_info.name">
                    <div class="label">买家姓名：</div>
                    <div>张三</div>
                </div>
                <div class="item flex" v-if="templateData.customer_info.mobile">
                    <div class="label">联系方式：</div>
                    <div>18566665555</div>
                </div>
                <div class="item flex" v-if="templateData.customer_info.address">
                    <div class="label">联系地址：</div>
                    <div>XXX省 XXX市 XXX区 XXX街道</div>
                </div>
            </div>
            <!-- 二维码 -->
            <div class="qrcode-info order-info border">
                <div class="item" v-if="templateData.shop_info.qrcode">
                    <i class='iconfont icon-haibao-erweimaneirong'></i>
                </div>
                <div class="item" v-if="templateData.shop_info.mobile">0532-125445588</div>
                <div class="item" v-if="templateData.shop_info.address">XXX省 XXX市 XXX区 XXX街道</div>
            </div>
            <!-- 底部信息 -->
            <div class="qrcode-info order-info border">
                <div class="item">{{footer || '谢谢惠顾，欢迎下次光临'}}</div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "PrinterPreview",
        components: {},
        props: {
            templateList: {
                type: Array,
                default: () => []
            },
            footer: {
                type: String,
                default: '谢谢惠顾，欢迎下次光临'
            },
            type: { // 预览和编辑
                type: String,
                default: '',
            },
        },
        data() {
            return {
                templateDefault: {
                    // 头部内容
                    header_info: {
                        shop_name: 1,
                        // shop_logo: 1
                    },
                    // 商品信息
                    goods_info: {
                        goods_name: 1,
                        goods_num: 1,
                        // goods_stock: 1,
                        goods_price: 1,
                        goods_sku: 0, // 商品编码
                        goods_option: 0, // 商品规格
                    },
                    // 结算信息
                    calculate_info: {
                        order_original_price: 1, // 合计
                        dispatch_price: 0,
                        order_discounts_price: 1, // 优惠金额
                        order_pay_price: 1, // 实付金额
                    },
                    // 订单信息
                    order_info: {
                        order_no: 1,
                        pay_type: 0,
                        pay_channel: 0,
                        created_at: 1,
                        pay_time: 0,
                        finish_time: 0,
                        dispatch_type: 0, //配送方式
                        order_form: 0, //下单表单
                    },
                    // 会员信息
                    member_info: {
                        nickname: 1,
                        mobile: 0,
                        level: 1,
                        commission_level: 0
                    },
                    // 备注
                    mark_info: {
                        customer_mark: 0,
                        // saler_mark: 0,
                    },
                    // 买家信息
                    customer_info: {
                        name: 1,
                        mobile: 1,
                        address: 0,
                    },
                    // 商城信息
                    shop_info: {
                        qrcode: 0,
                        mobile: 1,
                        address: 1,
                    }
                }
            }
        },
        watch: {
            // templateList: {
            //     handler(newValue) {
            //         newValue.map((item) => {
            //             item.children.map((childrenItem) => {
            //                 this.templateData[item.type][childrenItem.type] = childrenItem.status
            //             });
            //         });
            //         console.log(this.templateData, '666666');
            //     },
            //     immediate: true
            // }
        },
        computed: {
            templateData() {
                let arr = this.templateDefault;
                this.templateList.map((item) => {
                    item.children.map((childrenItem) => {
                        arr[item.type][childrenItem.type] = childrenItem.status
                    });
                });
                return arr;
            }
        },
        created() {},
        mounted() {},
        methods: {},
    }
</script>

<style lang="scss" scoped>
    .printer-preview {
        width: 375px;
        height: calc(100vh - 110px - 20px);
        padding: 40px;
        overflow-y: scroll;
        background-color: #fff;
        /*flex-shrink: 0;*/
        margin-right: 10px;
        margin-top: 20px;
        .title {
            margin-bottom: 17px;
            line-height: 22px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            color: $text-first;
        }
        .printer-template-content {
            padding: 20px;
            margin-top: 16px;
            background-color: $background-color;
            border: 1px solid $border-color;
            border-radius: 6px;
            color: $text-first;
            .top {
                text-align: center;
                .shop-logo {
                    img {
                        width: 108px;
                        height: 57px;
                    }
                }
                .shop-name {
                    font-weight: bold;
                    font-size: 18px;
                    line-height: 25px;
                }
            }
            .border {
                border-top: 1px dashed $text-zhushi;
            }
            .goods-info-content {
                .item {
                    margin-top: 12px;
                    align-items: center;
                    &:last-child {
                        margin-bottom: 12px;
                    }
                }
            }
            .goods-info-content {
                .item-info.mt-12 {
                    margin-top: 12px;
                }
                .item {
                    margin-top: 0;
                }
            }
            .calculate-info {
                .item {
                    margin-top: 12px;
                    &:last-child {
                        margin-bottom: 12px;
                    }
                }
            }
            .order-info {
                .item {
                    margin-top: 12px;
                    &:last-child {
                        margin-bottom: 12px;
                    }
                }
            }
            .goods-info {
                margin-top: 20px;
                .item {
                    justify-content: space-between;
                    >div:first-child {
                        flex: 2;
                    }
                    >div:nth-child(2) {
                        flex-shrink: 0;
                        width: 55px;
                        text-align: center;
                    }
                    >div:nth-child(3) {
                        flex-shrink: 0;
                        width: 83px;
                        text-align: center;
                    }
                    >div.price{
                        flex: 1;
                        text-align: right;
                    }
                }
                .item-title {
                    margin: 10px 0;
                }
                .goods-title {
                    font-weight: 600;
                }
            }
            .calculate-info {
                .item {
                    justify-content: space-between;
                    >div:first-child {
                        flex: 2;
                    }
                    >div:nth-child(2) {
                        flex-shrink: 0;
                        width: 55px;
                        text-align: center;
                    }
                    >div:nth-child(3) {
                        flex-shrink: 0;
                        width: 83px;
                        text-align: center;
                    }
                    >div.price{
                        flex: 1;
                        text-align: right;
                    }
                }
            }
            .order-info {
                .item {
                    .label {
                        flex-shrink: 0;
                        width: 75px;
                        &.width-105 {
                            width: 105px;
                        }
                    }
                }
            }
            .qrcode-info {
                padding: 0 17px;
                text-align: center;
                .icon-haibao-erweimaneirong {
                    display: block;
                    margin: 0 auto;
                    width: 120px;
                    height: 120px;
                    line-height: 120px;
                    background-color: #fff;
                    text-align: center;
                    font-size: 105px;
                    color: #000;
                    box-sizing: border-box;
                    border-radius: 2px;
                }
            }
        }
    }
</style>
