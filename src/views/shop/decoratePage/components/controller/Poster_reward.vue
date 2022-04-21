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
    <div class='poster-push-setting' v-if='currentModal.id=="poster_reward"&&lazyLoad'>
        <i-form :label-width="110" ref='poster_reward' :model="currentModal" :rules="validator">
            <MyCollapse :no-border='!currentModal.params.open'>
                <p class="form-title" slot='label'>
                    关注奖励
                </p>
                <form-item label="关注奖励：" style='margin-bottom:20px;'>
                    <MyRadioGroup :items='open' v-model='currentModal.params.open'>
                    </MyRadioGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse v-if="currentModal.params.open">
                <p class="form-title" slot='label'>
                    推荐人
                </p>
                <form-item label="推荐人获得：" style='margin-bottom:20px;' required prop='recommender'>
                    <CheckboxGroup style='margin-top:3px;' v-model="currentModal.params.recommend.reward">
                        <Checkbox label="score">积分</Checkbox>
                        <Checkbox label="cash">现金</Checkbox>
                        <Checkbox label="coupon">优惠券</Checkbox>
                    </CheckboxGroup>
                </form-item>
                <form-item label="积分：" style='margin-bottom:20px;' v-if="currentModal.params.recommend.reward.indexOf('score')>-1" prop='recommenderScore'>
                    <div style='background: #F4F6F8;border-radius: 2px;padding:10px 20px 10px 0;'>
                        <form-item label="奖励积分：" :label-width='160' style='margin-top:10px;margin-bottom:30px;' required>
                             <kdx-rr-input
                                placeholder="请输入积分" 
                                v-model='currentModal.params.recommend.score.num'
                                style="width: 160px;"
                                class="table-input"
                                type="text"
                                number
                                :fixed='0'
                                :min-value='0'
                            >
                                <span slot="append">积分</span>
                            </kdx-rr-input>
                        </form-item>
                        <form-item label="每月积分奖励上限：" :label-width='160' style='margin-bottom:10px;'>
                             <kdx-rr-input
                                placeholder="请输入上限" 
                                v-model='currentModal.params.recommend.score.limit'
                                style="width: 160px;"
                                class="table-input"
                                type="text"
                                number
                                :fixed='0'
                                :min-value='0'
                            >
                                <span slot="append">积分</span>
                            </kdx-rr-input>
                        </form-item>
                    </div>
                </form-item>
                <form-item label="现金：" style='margin-bottom:20px;' v-if="currentModal.params.recommend.reward.indexOf('cash')>-1" prop='recommenderCash'>
                    <MyRadioGroup :items='type' v-model='currentModal.params.recommend.cash.type'>
                        <p class='tip' slot="tip">使用红包奖励请前往<a  :style="{color:$css['--theme-color']}" href='javascript:void(0)' @click='toSetWxPay'>【设置微信支付】</a></p>
                        <form-item label="奖励现金：" :label-width='160' style='margin-top:10px;' required>
                             <kdx-rr-input
                                placeholder="请输入金额" 
                                v-model='currentModal.params.recommend.cash.num'
                                style="width: 160px;"
                                class="table-input"
                                type="text"
                                number
                                :fixed='2'
                                :min-value='0'
                            >
                                <span slot="append">元</span>
                            </kdx-rr-input>
                        </form-item>
                        <form-item label="每月现金奖励上限：" :label-width='160' style='margin-bottom:10px;'>
                             <kdx-rr-input
                                placeholder="请输入上限" 
                                v-model='currentModal.params.recommend.cash.limit' 
                                style="width: 160px;"
                                class="table-input"
                                type="text"
                                number
                                :fixed='2'
                                :min-value='0'
                            >
                                <span slot="append">元</span>
                            </kdx-rr-input>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
                <form-item label="优惠券：" v-if="currentModal.params.recommend.reward.indexOf('coupon')>-1" prop='recommenderCoupon'>
                    <Button style='margin-bottom:10px;' :style='{color:$css["--theme-color"]}' @click='addItem("recommend")' v-if='!currentModal.params.recommend.coupon.list.length'>+添加</Button>
                    <div class='bg-color' v-for='(item,index) in currentModal.params.recommend.coupon.list' :key='index'>
                        <p class="coupon-img">
                            <img :src="item.coupon_sale_type==2?$utils.staticImg('coupon/coupon-1.png'):$utils.staticImg('coupon/coupon-2.png')" alt="">
                        </p>
                        <div class="body">
                            <p class="name">优惠券名称：{{item.coupon_name}}</p>
                            <p class="demon">使用条件：{{item.content}}</p>
                            <p class="demon">库存：{{item.stock_type==0?'不限制':item.stock}}</p>
                        </div>
                        <span class="del-item close ivu-icon ivu-icon-md-close-circle" @click='delItem(item,currentModal.params.recommend.coupon.list)'></span>
                    </div>
                    <form-item label="每月最多发放张数：" :label-width='140' style='margin-bottom:10px;' v-if='currentModal.params.recommend.coupon.list.length'>
                         <kdx-rr-input
                            placeholder="请输入张数" 
                            v-model='currentModal.params.recommend.coupon.limit' 
                            style="width: 160px;"
                            class="table-input"
                            type="text"
                            number
                            :fixed='0'
                            :min-value='0'
                            :max-value='currentModal.params.recommend.coupon.list[0].stock_type==0?undefined:currentModal.params.recommend.coupon.list[0].stock*1'
                        >
                        <span slot="append">张</span>
                        </kdx-rr-input>
                    </form-item>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border v-if="currentModal.params.open">
                <p class="form-title" slot='label'>
                    关注人
                </p>
                <form-item label="关注人获得：" style='margin-bottom:20px;' required prop='follower'>
                    <CheckboxGroup style='margin-top:3px;' v-model="currentModal.params.follower.reward">
                        <Checkbox label="score">积分</Checkbox>
                        <Checkbox label="cash">现金</Checkbox>
                        <Checkbox label="coupon">优惠券</Checkbox>
                    </CheckboxGroup>
                </form-item>
                <form-item label="奖励积分：" style='margin-bottom:20px;' required v-if='currentModal.params.follower.reward.indexOf("score")>-1' prop='followerScore'>
                    <kdx-rr-input
                        placeholder="请输入积分" 
                        v-model='currentModal.params.follower.score.num'
                        style="width: 160px;"
                        class="table-input"
                        type="text"
                        number
                        :fixed='0'
                        :min-value='0'
                    >
                        <span slot="append">积分</span>
                    </kdx-rr-input>
                </form-item>
                <form-item label="现金：" style='margin-bottom:30px;' v-if='currentModal.params.follower.reward.indexOf("cash")>-1' prop='followerCash'>
                    <MyRadioGroup :items='type' v-model='currentModal.params.follower.cash.type'>
                        <p class='tip' slot="tip">使用红包奖励请前往<a :style='{color:$css["--theme-color"]}' href='javascript:void(0)' @click='toSetWxPay'>【设置微信支付】</a></p>
                        <form-item label="奖励现金：" :label-width='160' style='margin-top:10px;margin-bottom:10px;' required>
                            <kdx-rr-input
                                placeholder="请输入金额" 
                                v-model='currentModal.params.follower.cash.num'
                                style="width: 160px;"
                                class="table-input"
                                type="text"
                                number
                                :fixed='2'
                                :min-value='0'
                            >
                                <span slot="append">元</span>
                            </kdx-rr-input>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
                <form-item label="优惠券：" v-if='currentModal.params.follower.reward.indexOf("coupon")>-1' prop='followerCoupon'>
                    <Button style='margin-bottom:10px;' :style='{color:$css["--theme-color"]}' @click='addItem("follower")' v-if='!currentModal.params.follower.coupon.list.length'>+添加</Button>
                    <div class='bg-color' v-for='(item,index) in currentModal.params.follower.coupon.list' :key='index'>
                        <p class="coupon-img">
                            <img :src="item.coupon_sale_type==2?$utils.staticImg('coupon/coupon-1.png'):$utils.staticImg('coupon/coupon-2.png')" alt="">
                        </p>
                        <div class="body">
                            <p class="name">优惠券名称：{{item.coupon_name}}</p>
                            <p class="demon">使用条件：{{item.content}}</p>
                            <p class="demon">库存：{{item.stock_type==0?'不限制':item.stock}}</p>
                        </div>
                        <span class="del-item close ivu-icon ivu-icon-md-close-circle" @click='delItem(item,currentModal.params.follower.coupon.list)'></span>
                    </div>
                </form-item>
            </MyCollapse>
            <coupon-selector :value='showSelector' :current-list="[]" :pick_way='4'  @on-change='getCoupons' @on-cancel='cancel'></coupon-selector>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import CouponSelector from '@/components/selector/CouponSelector'
    export default {
        components: {
            CouponSelector
        },
        mixins: [mixin],
        name: 'poster_reward',
        data() {
            return {
                id:'poster_reward',
                operingList: '',
                showSelector: false,
                open: [{
                    label: '开启',
                    id: 1
                }, {
                    label: '关闭',
                    id: 0
                }],
                type: [{
                    label: '余额',
                    id: 'balance'
                }, {
                    label: '红包',
                    id: 'redpackets'
                }]
            }
        },
        methods: {
            toSetWxPay(){
                 // 跳转到发票管理页面
                let routeData = this.$router.resolve({
                    path: '/setting/paymentSettings/way/index'
                });
                window.open(routeData.href, '_blank');
            },
            addItem(listname) {
                this.showSelector = true;
                this.operingList = listname;
            },
            cancel() {
                this.showSelector = false;
            },
            delItem(item, list) {
                for (let k in list) {
                    if (list[k] === item) {
                        list.splice(k, 1)
                    }
                }
                this.refreshCurrentModal();
            },
            getCoupons(val) {
                this.currentModal.params[this.operingList].coupon.list.push({
                    id: val.id,
                    coupon_name: val.coupon_name,
                    content: val.content,
                    coupon_sale_type: val.coupon_sale_type,
                    stock:val.stock,
                    stock_type:val.stock_type
                })
                this.showSelector = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .bg-color {
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #E9EDEF;
        position: relative;
        display: flex;
        flex-wrap: nowrap;
        .close {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 18px;
            top: -6px;
            right: -9px;
            color: rgba(0, 0, 0, 0.3);
            display: none;
        }
        &:hover {
            .close {
                display: inline;
                cursor: pointer;
            }
        }
        .coupon-img {
            width: 44px;
            height: 30px;
            border-radius: 2px 0px 0px 2px;
            margin: auto 18px auto 10px;
            flex-shrink: 0;
            text-align: center;
            line-height: 30px;
            color: #fff;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            position: relative;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
</style>