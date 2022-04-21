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
    <td :rowspan="list.order_goods.length">
        <kdx-hint-tooltip
                :max-width="310"
                type="form"
        >
            <template #header>
                <div class="shop-payment payment">
                    <div class="shop-payment-price">
                        <span>
                            ￥{{ list.pay_price }}
                        </span>
                        <span class="label" v-if="isInvoiceInfo(list)">
                            票
                        </span>
                        <p v-if="goods.type === '0'">
                            (含运费：￥{{ list.dispatch_price }})
                        </p>
                    </div>
                </div>
            </template>
            <Form :label-width="72">
                <FormItem :label="item.title" v-for="(item, index) in priceList" :key="index">
                    <span>{{item.price}}</span>
                </FormItem>
                <FormItem label="实付款：">
                    <span class="danger-color">￥{{ list.pay_price }}</span>
                </FormItem>
            </Form>
        </kdx-hint-tooltip>
    </td>
</template>

<script>
    export default {
        props: {
            list: {
                type: Object,
                default: () => ({})
            },
            goods: {
                type: Object,
                default: () => ({})
            },
        },
        
        computed: {
            priceList() {
                    let result = [
                        {
                            title: '商品小计：',
                            price: this.calculatePrice,
                            show: true,
                        },
                        {
                            title: '运费：',
                            price: `￥${this.list?.dispatch_price}`,
                            show: this.goods.type === '0',
                        },
                        {
                            title: '改价：',
                            price: this.formatPrice(this.list?.change_price),
                            show: this.list.change_price && parseFloat(this.list.change_price) != '0',
                        },
                        {
                            title: '会员折扣：',
                            price: '-'+this.formatPrice(this.list?.extra_price_package?.member_price),
                            show: this.list.extra_price_package && this.list.extra_price_package.member_price,
                        },
                        {
                            title: '积分抵扣：', // 积分抵扣
                            price: '-'+this.formatPrice(this.list?.extra_price_package?.credit),
                            show: this.list.extra_price_package && this.list.extra_price_package.credit,
                        },
                        {
                            title: '余额抵扣：', // 余额抵扣
                            price: '-'+this.formatPrice(this.list?.extra_price_package?.balance),
                            show: this.list.extra_price_package && this.list.extra_price_package.balance,
                        },
                        {
                            title: '满额立减：',
                            price: '-'+this.formatPrice(this.list?.extra_price_package?.full_deduct),
                            show: this.list.extra_price_package && this.list.extra_price_package.full_deduct,
                        },
                        {
                            title: '优惠券：',
                            price: '-'+this.formatPrice(this.list?.extra_price_package?.coupon),
                            show: this.list.extra_price_package && this.list.extra_price_package.coupon,
                        },
                        // {
                        //     title: '秒杀优惠：',
                        //     price: '-'+this.formatPrice(this.data.extra_price_package.seckill),
                        //     show: this.data.extra_price_package && this.data.extra_price_package.seckill,
                        //     color: true
                        // },
                    ];

                result = result.filter(item=>item.show);
                return result
            },
            calculatePrice() {
                return (`￥${this.list.goods_price}`)
            }
        },
        methods: {
            // 发票是否存在
            isInvoiceInfo(data) {
                let is_company = data?.invoice_info?.is_company // 1个人 2企业
                return is_company && (is_company == '1' || is_company == '2')
            },
            formatPrice(price) {
                if (parseFloat(price) >= 0) {
                    return `￥${parseFloat(price).toFixed(2)}`
                } else {
                    return `-￥${Math.abs(parseFloat(price)).toFixed(2)}`
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
