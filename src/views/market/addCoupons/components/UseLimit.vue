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
    <div class="level">
        <kdx-form-title>使用限制</kdx-form-title>
        <FormItem label="商品使用限制：" class="r-form-item-checkbox">
            <RadioGroup v-model="model.goods_limit" @on-change="changeGoodsLimit">
                <Radio label="0" :disabled="isDisabled">不限制</Radio>
                <Radio label="1" :disabled="isDisabled">允许以下商品使用</Radio>
                <Radio label="2" :disabled="isDisabled">限制以下商品使用</Radio>
                <Radio label="3" :disabled="isDisabled">允许以下商品分类使用</Radio>
            </RadioGroup>
            <!--商品分类-->
            <div v-if="model.goods_limit === '3'" class="form-item-bg-box">
                <tree-select v-model="model.goods_ids" :transfer="true" :show-checkbox="true" :data="shopLevel"
                             :disabled="isDisabled"
                             :multiple="true" @change-data="handleShopLevelChange" class="width-430"></tree-select>
            </div>
            <!--商品-->
            <div class="form-item-bg-box" v-else-if="model.goods_limit !== '0'">
                <div class="shop-list-box">
                    <Button class="default-primary" :disabled="isDisabled" @click="addShop">+添加商品</Button>
                    <div class="shop-list" v-show="goods.list.length > 0">
                        <shop-name-page-list ref="shop_name_list" :list="goods.list" :disabled="isDisabled"
                                             @on-delete="deleteShop"></shop-name-page-list>
                    </div>
                </div>
            </div>
        </FormItem>
        <FormItem label="优惠使用限制：">
            <RadioGroup v-model="model.coupon_sale_limit">
                <Radio label="0" :disabled="isDisabled">不限制</Radio>
                <Radio label="1" :disabled="isDisabled">不可与会员折扣同时使用</Radio>
                <kdx-hint-tooltip type="form">
                    <p class="bold" style="padding-bottom: 4px">不限制：</p>
                    <p style="padding-bottom: 12px"> 优惠券无任何使用限制，可以和其他活动进行同时使用。</p>
                    <p class="bold" style="padding-bottom: 4px">不可与会员折扣同时使用：</p>
                    <p>用户在支付时，优惠券优惠与会员折扣优惠只能享受一种，不能同时使用。</p>
                </kdx-hint-tooltip>
            </RadioGroup>
        </FormItem>
        <FormItem label="使用说明：" class="r-form-item-checkbox">
            <RadioGroup v-model="model.default_description">
                <Radio label="1" :disabled="isDisabled">统一说明</Radio>
                <Radio label="2" :disabled="isDisabled">单独设置</Radio>
            </RadioGroup>
            <kdx-hint-text>统一说明在<router-link to="/market/coupons/other-setting" target="_blank" class="bold">【其他设置】</router-link>中设置，如果使用统一说明，则在优惠券说明前面显示统一说明</kdx-hint-text>
            <div v-show="model.default_description === '2'" class="marginT-10">
                <!--富文本编辑器-->
                <editor v-model="model.description" :height="300"></editor>
            </div>
        </FormItem>
        <!--商品选择器-->
        <goods-selector v-model="selector.modal" :multiple="true" :current-list="goods.list"
                        @on-change="selectorChange" @on-cancel="selectorCancel"></goods-selector>

    </div>
</template>

<script>
    import {
        mapState
    } from 'vuex';
    import TreeSelect from '@/components/tree-select/index';
    import Editor from "@/components/Editor";
    import GoodsSelector from "@/components/selector/GoodsSelector";
    import ShopNamePageList from "@/components/ShopNamePageList";

    export default {
        name: "UseLimit",
        components: {
            TreeSelect,
            Editor,
            GoodsSelector,
            ShopNamePageList
        },
        props: {
            id: {
                type: [String, Number]
            }
        },
        data() {
            return {
                selector: {
                    modal: false,
                    allowList: [], // 允许商品
                    limitList: [] // 限制商品
                },
              page: {
                pageSize: 10,
                pageNumber: 1 // 页码
              },
            };
        },
        computed: {
            ...mapState('couponAdd', {
                model: state => state.model,
                isDisabled: state => state.isDisabled,
                shopLevel: state => state.shopLevel,
                goods: state => state.goods
            })
        },
        methods: {
            handleShopLevelChange(list) {
                // 处理select多选取消选中问题
                function deep(arr = []) {
                    if (Array.isArray(arr)) {
                        arr.forEach(item => {
                            if (item.children && item.children.length > 0) {
                                item.indeterminate = item.children.some(subItem => {
                                    return subItem.checked === true
                                })
                                deep(item.children)
                            }
                        })
                    }
                }
                deep(list)
                this.$store.commit('couponAdd/setShopLevel', list)
            },
          // 切换商品限制
            changeGoodsLimit() {
              // 允许商品
                if (this.model.goods_limit === '1') {
                  this.selector.limitList = [...this.goods.list];
                  this.goods.list = this.selector.allowList || [];
                  this.model.goods_ids = this.goods.list.map(item => item.id).join(',');
                } else if (this.model.goods_limit == '2') {
                  // 限制商品
                  this.selector.allowList = [...this.goods.list];
                  this.goods.list = this.selector.limitList || [];
                  this.model.goods_ids = this.goods.list.map(item => item.id).join(',');
                } else {
                  this.model.goods_ids = '';
                  this.goods.list = [];
                }
            },
            // 添加商品
            addShop() {
                this.selector.modal = true;
            },
            // 商品选择器
            selectorChange(list) {
                this.model.goods_ids = list.map(item => item.id).join(',');
                this.goods.list = list;
                this.selectorCancel();
            },
            selectorCancel() {
                this.selector.modal = false;
            },
          // 删除商品
            deleteShop(index) {
              this.goods.list.splice(index, 1);
              this.model.goods_ids = this.goods.list.map(item => item.id).join(',');
            },
        }
    };
</script>

<style scoped lang="less">

</style>
