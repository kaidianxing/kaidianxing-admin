/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="deal-set">
        <Form ref="form" :model="model" :label-width="120" :rules="rule">
            <kdx-form-title>交易设置</kdx-form-title>
            <FormItem class="r-form-item-checkbox" label="批量添加商品：">
                <div class="block">
                    <FormItem label="" prop="goods_list" style="margin-bottom: 0;">
                        <Button v-if="type==='0'" class="default-primary" :disabled="isDisabled" @click="chooseShop">选择商城商品</Button>
                        <Button v-else class="default-primary" :disabled="isDisabled" @click="chooseCoupon">选择付费优惠券</Button>
                        <Button v-if="isDisabled" class="marginL-10" type="text" @click="jumpGoodDetail">{{type === '0'?'查看原商品':'查看原优惠券'}}</Button>
                        <div class="goods-box" v-if="model.goods_list && model.goods_list.length > 0">
                            <rules-goods ref="goodsRule" v-model="model.goods_list" :type="type" :is-disabled="isDisabled"></rules-goods>
                        </div>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="运费设置：" v-if="type==='0'">
                <RadioGroup v-model="model.dispatch_type">
                    <Radio label="0">读取商品设置</Radio>
                    <Radio label="1">包邮</Radio>
                </RadioGroup>
            </FormItem>
        </Form>

        <!--商品选择器-->
        <goods-selector v-model="goodSelector.value" :multiple="true"
                        flag='creditShop'
                        :current-list="goodSelector.data"
                        @on-change="changeGoodList" @on-cancel="cancelGoodSelector"></goods-selector>

        <!-- 优惠券选择器 -->
        <coupon-selector v-model="couponSelector.value" :multiple="true"
                         :params="{ is_credit_shop: 1, is_validity: 1 }"
                         :current-list="couponSelector.data" pick_way="2"
                         @on-change="changeCouponList" @on-cancel="cancelCouponSelector"></coupon-selector>
    </div>
</template>

<script>
    import RulesGoods from './RulesGoods'
    import GoodsSelector from "@/components/selector/GoodsSelector";
    import CouponSelector from "@/components/selector/CouponSelector";
    export default {
        name: "DealSet",
        components: {
            RulesGoods,
            GoodsSelector,
            CouponSelector
        },
        props: {
            type: {
                type: [String, Number],
                default: '0'
            },
            dealSetData: {
                type: Object,
                default: () => {}
            },
            isDisabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                couponSelector: {
                    value: false,
                    data: []
                },
                goodSelector: {
                    value: false,
                    data: []
                },
                model: {
                    dispatch_type: '0',
                    goods: [],
                    goods_list: []
                },
                rule: {
                    goods_list: [
                        {required: true, type: 'array', min: 1,  message: '请选择商品'}
                    ],
                }
            }
        },
        computed: {},
        watch: {
            dealSetData: {
                handler(newValue) {
                    this.model = newValue;
                }
            },
            model: {
                handler(newValue) {
                    this.$emit('update:dealSetData', newValue);
                },
                deep: true
            },
            type: {
                handler(newValue) {
                    if (this.isDisabled) { return }
                    this.model.goods_list = newValue === '1'?this.couponSelector.data:this.goodSelector.data
                },
            },
        },
        created() {
        },
        mounted() {
        },
        methods: {
            chooseShop() {
                this.goodSelector.value = true;
            },
            // 选择商品
            changeGoodList(list) {
                this.goodSelector.data = list.map(item => {
                    return {
                        ...item,
                        credit_shop_stock: item?.credit_shop_stock || '',
                        credit_shop_price: item?.credit_shop_price || '',
                        credit_shop_credit: item?.credit_shop_credit || '',
                    };
                });
                this.model.goods_list = this.goodSelector.data;
                this.cancelGoodSelector();
            },
            // 关闭商品选择器
            cancelGoodSelector() {
                this.goodSelector.value = false;
            },
            chooseCoupon() {
                this.couponSelector.value = true;
            },
            changeCouponList(list) {
                this.couponSelector.data = list.map(item => {
                    return {
                        ...item,
                        goods_id: item.id,
                        credit_shop_stock: item?.credit_shop_stock || '',
                        credit_shop_price: item?.credit_shop_price || '',
                        credit_shop_credit: item?.credit_shop_credit || '',
                        has_option: 0
                    };
                });
                this.model.goods_list = this.couponSelector.data;
                this.cancelCouponSelector()
            },
            cancelCouponSelector() {
                this.couponSelector.value = false;
            },
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(async (valid) => {
                        if (valid) {
                            try {
                                await this.$refs.goodsRule.validateForm();
                                let result = await this.handleGoodsRules();
                                if(result.some(item=> item.has_option=='1' && !item.rules)){
                                    this.$Message.error('每个商品必须有一个规格参加活动')
                                    reject()
                                }
                                this.model.goods = result;
                                resolve()
                            } catch (e) {
                                reject()
                            }
                        } else {
                            reject()
                        }
                    })
                })
            },
            handleGoodsRules() {
                let result = this.model.goods_list.map(item => {
                    if (+item?.has_option === 0 || (this.isDisabled&&+this.type)) {
                        item = {
                            goods_id: item.id,
                            has_option: item?.has_option || 0,
                            option_id: 0,
                            credit_shop_stock: item.credit_shop_stock,
                            credit_shop_credit: item.credit_shop_credit,
                            credit_shop_price: item.credit_shop_price || 0
                        }
                    } else {
                        item = {
                            goods_id: item.id,
                            has_option: item.has_option,
                            rules: item.rules
                        }
                    }
                    return item
                });
                return result
            },
            jumpGoodDetail() {
                let path = this.type === '0'?'/goods/add':'/market/coupons/base/edit';
                this.$utils.openNewWindowPage(path, { id: this.model.goods_list[0].id})
            }
        },
    }
</script>

<style lang="scss" scoped>
    .deal-set {
        padding-bottom: 30px;
        .block {
            /*max-width: 1105px;*/
            padding: 30px;
            background-color: $background-color;
        }
        .goods-box {
            max-width: 1105px;
            margin-top: 10px;
        }
    }
</style>