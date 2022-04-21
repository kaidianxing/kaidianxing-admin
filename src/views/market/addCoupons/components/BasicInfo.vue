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
        <kdx-form-title content="基本信息"></kdx-form-title>
        <FormItem label="优惠券名称：" prop="coupon_name" v-error-item.coupon_name>
            <Input v-model="model.coupon_name" maxlength="10" show-word-limit :disabled="isDisabled"
                   class="width-250" :class="{'input-disabled':isDisabled}" placeholder="请输入"/>
        </FormItem>
        <FormItem label="优惠券类型：" prop="coupon_sale_type" class="form-coupons-type">
            <RadioGroup v-model="model.coupon_sale_type">
                <Radio label="1" :disabled="isDisabled">
                    <div class="coupons-full">
                        <span>满减券</span>
                        <img src="@/assets/image/coupons/subtract-yellow.png" alt="">
                    </div>
                </Radio>
                <Radio label="2" :disabled="isDisabled">
                    <div class="coupons-discount">
                        <span>折扣券</span>
                        <img src="@/assets/image/coupons/subtract-blue.png" alt="">
                    </div>
                </Radio>
            </RadioGroup>
            <div class="form-item-bg-box">
                <!--满减券-->
                <div class="coupons-type " v-if="model.coupon_sale_type === '1'">
                    <FormItem label="消费满" prop="enough" v-error-item.enough>
                        <kdx-rr-input v-model="model.enough" number :fixed="2" :min-value="0" :max-value="9999999.99" :maxlength="10" :disabled="isDisabled" class="width-160" placeholder="请输入">
                            <span slot="append">元</span>
                        </kdx-rr-input>
                    </FormItem>
                    <FormItem label="减" prop="discount_price"  class="sub" v-error-item.discount_price>
                        <kdx-rr-input v-model="model.discount_price" number :fixed="2" :min-value="0" :max-value="9999999.99" :maxlength="10" :disabled="isDisabled" class="width-160"
                               placeholder="请输入">
                            <span slot="append">元</span>
                        </kdx-rr-input>
                    </FormItem>
                </div>
                <!--折扣券-->
                <div class="coupons-type" v-if="model.coupon_sale_type === '2'">
                    <FormItem label="消费满" prop="enough" v-error-item.enough>
                        <kdx-rr-input v-model="model.enough" number :fixed="2" :min-value="0" :max-value="9999999.99" :maxlength="10" :disabled="isDisabled" class="width-160" placeholder="请输入">
                            <span slot="append">元</span>
                        </kdx-rr-input>
                    </FormItem>
                    <FormItem label="享" prop="discount_price" class="sub" v-error-item.discount_price>
                        <kdx-rr-input v-model="model.discount_price" :disabled="isDisabled" :fixed="1" number :minValue="0.1" :maxValue="9.9"
                                  class="width-160" placeholder="请输入0.1-9.9">
                            <span slot="append">折</span>
                        </kdx-rr-input>
                    </FormItem>
                </div>
            </div>
        </FormItem>
        <FormItem label="发放总量：" prop="stock_type" class="r-form-item-checkbox">
            <RadioGroup v-model="model.stock_type">
                <Radio label="0">
                    <span>不限制</span>
                </Radio>
                <Radio label="1">
                    <span>限制</span>
                </Radio>
            </RadioGroup>
            <!--限制-->
            <div class="form-item-bg-box-label" v-if="model.stock_type === '1'">
                <FormItem label="限制张数：" prop="stock" v-error-item.stock>
                    <kdx-rr-input v-model="model.stock" class="width-160" :fixed="0" number :max-value="999999999" placeholder="请输入">
                        <span slot="append">张</span>
                    </kdx-rr-input>
                </FormItem>
            </div>
        </FormItem>
        <FormItem label="使用时间限制：" class="r-form-item-checkbox">
            <RadioGroup v-model="model.time_limit" @on-change="changeTimeLimit">
                <Radio label="1">
                    <span>获得后</span>
                </Radio>
                <Radio label="0">
                    <span>日期内</span>
                </Radio>
            </RadioGroup>
            <div class="form-item-bg-box" style="padding-left: 0">
                <!--获得后-->
                <div class="time-limit" v-if="model.time_limit === '1'">
                    <FormItem label="限制天数：" prop="limit_day" class="flex" v-error-item.limit_day>
                        <kdx-rr-input number :fixed="0" :maxValue="999999999"  v-model="model.limit_day" class="width-160" placeholder="请输入">
                            <span slot="append">天</span>
                        </kdx-rr-input>
                    </FormItem>
                        <span class="postfix">内有效</span>
                        <kdx-hint-tooltip>
                            有效期按自然天计算。举例：如设置领券次日起2天内可用，用户在5月22日的14:00领取优惠券，则该优惠券的可用时间为5月22日的00:00:00到5月23日的23:59:59
                        </kdx-hint-tooltip>
                </div>
                <!--日期内-->
                <div class="date-range" v-else-if="model.time_limit === '0'">
                    <FormItem label="选择时间：" prop="start_time" v-error-item.start_time>
                        <DatePicker v-model="model.start_time" type="datetime" placeholder="开始时间"
                                    @on-change="changeStartTime" class="width-250"></DatePicker>
                    </FormItem>
                    <div class="marginL-10 marginR-10">~</div>
                    <FormItem prop="end_time" v-error-item.end_time>
                        <DatePicker v-model="model.end_time" type="datetime" placeholder="结束时间"
                                    @on-change="changeEndTime" class="width-250"></DatePicker>
                    </FormItem>
                </div>
            </div>
        </FormItem>
        <FormItem label="排序：" prop="sort">
            <kdx-rr-input v-model="model.sort" number :maxlength="4" :fixed="0" show-word-limit :disabled="isDisabled"
                   class="width-160" :class="{'input-disabled':isDisabled}" placeholder="请输入"/>
            <kdx-hint-text>最多4位数字，数字越大，排名越靠前，默认排序为创建时间</kdx-hint-text>
        </FormItem>
    </div>
</template>

<script>
    import {
        mapState
    } from 'vuex';

    export default {
        name: "BasicInfo",
        data() {
            return {
                // options: {
                //     endTime: {
                //         disabledDate: (date) => {
                //             // console.log('date', date, new Date());
                //             return this.model.end_time && date.valueOf() < new Date(this.model.start_time).getTime()
                //         }
                //     }
                // }
            };
        },
        computed: {
            ...mapState('couponAdd', {
                model: state => state.model,
                isDisabled: state => state.isDisabled
            })
        },
        methods: {
            changeStartTime(date) {
                this.model.start_time = date;
            },
            changeEndTime(date) {
                this.model.end_time = date;
            },
            changeTimeLimit() {
                if (this.model.time_limit === '0') {
                    if (!this.model.end_time && !this.model.start_time) {
                        this.model.start_time = new Date();
                        this.model.end_time = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
                    }
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .level {
        .date-range {
            display: flex;
            align-items: center;
            /deep/ .ivu-form-item {
                display: flex;
                .ivu-form-item-content {
                    .ivu-form-item-error-tip {
                        margin-left: 0 !important;
                    }
                    .ivu-date-picker {
                          .ivu-input-icon-validate {
                            display: none;
                        }
                    }

                }
            }
        }
        .coupons-type {
            /deep/ .ivu-form-item {
                display: flex;
                .ivu-form-item-label {
                    width: 70px !important;
                }
                &.sub {
                    display: contents;
                    .ivu-form-item-label {
                        width: 30px !important;
                    }
                }
            }
        }
    }
</style>
