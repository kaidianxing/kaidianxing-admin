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
    <div class="market-send-coupons-activity-new-user" v-loading="loading">
        <Form ref="form" :model="model" :rules="rules" :label-width="120">
            <FormItem label="活动开启：" prop="state" class="r-form-item-checkbox">
                <RadioGroup v-model="model.state">
                    <Radio label="1">开启</Radio>
                    <Radio label="0">关闭</Radio>
                </RadioGroup>
                <kdx-hint-tooltip
                    style="margin-left: -16px"
                    type="image"
                    :image="require('@/assets/image/example/coupon.png')"
                ></kdx-hint-tooltip>
            </FormItem>
            <div v-show="model.state === '1'">
                <FormItem label="领取条件：" prop="pick_limit" class="r-form-item-checkbox">
                    <RadioGroup v-model="model.pick_limit">
                        <Radio label="0">无消费记录用户</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="选择优惠券：" prop="coupon_ids">
                    <Button class="default-primary" @click="addCoupons">+添加</Button>
                    <kdx-hint-alert
                        style="margin-top: 10px;padding-right: 10px"
                    >最多可选择 <span class="bold">三张优惠券</span> 且优惠券须是在有效期内，此处发放的优惠券数量不影响库存！</kdx-hint-alert>
                    <div class="form-item-bg-box" v-if="selector.list.length > 0">
                        <!--优惠券列表-->
                        <div class="coupons-list">
                            <coupons-list :data="selector.list" @on-delete="deleteCoupons"></coupons-list>
                        </div>
                    </div>
                </FormItem>
                <FormItem label="活动期限：">
                    <RadioGroup v-model="model.limit_time" class="r-form-item-checkbox">
                        <Radio label="0">长期有效</Radio>
                        <Radio label="1">有效时间</Radio>
                    </RadioGroup>
                    <kdx-hint-alert>默认为活动长期有效，若设置活动期限，则优惠券在活动期限内有效。</kdx-hint-alert>
                    <div class="form-item-bg-box" v-if="model.limit_time === '1'">
                        <!--日期内-->
                        <div class="date-range">
                            <FormItem prop="start_time">
                                <DatePicker
                                    v-model="model.start_time"
                                    type="datetime"
                                    placeholder="开始时间"
                                    :clearable="false"
                                    @on-change="changeStartTime"
                                    class="width-250"
                                ></DatePicker>
                            </FormItem>
                            <span class="middle">~</span>
                            <FormItem prop="end_time">
                                <DatePicker
                                    v-model="model.end_time"
                                    type="datetime"
                                    placeholder="结束时间"
                                    :clearable="false"
                                    @on-change="changeEndTime"
                                    class="width-250"
                                ></DatePicker>
                            </FormItem>
                        </div>
                    </div>
                </FormItem>
            </div>
        </Form>
        <div class="footer-btn">
            <Button class="primary-long" @click="handleSave">保存</Button>
        </div>
        <!--优惠券选择器-->
        <coupon-selector
            v-model="selector.value"
            :multiple="true"
            :current-list="selector.list"
            :limit="3"
            @on-change="changeCouponList"
            @on-cancel="cancelSelector"
        ></coupon-selector>
    </div>
</template>

<script>
import CouponsList from '@/views/market/components/CouponsList'
import CouponSelector from '@/components/selector/CouponSelector'
import { formatDate } from  '@/assets/helpers';

export default {
    name: 'index',
    components: { CouponsList, CouponSelector },
    data() {
        return {
            model: {
                state: '0',
                pick_limit: '0',
                limit_time: '0',
                start_time: '',
                end_time: '',
                coupon_ids: ''
            },
            rules: {
                coupon_ids: [{ required: true, message: '优惠券必选' }],
                start_time: [{ required: true, message: '开始时间必填' }],
                end_time: [
                    { required: true, message: '结束时间' },
                    {validator: (rule, value) => this.model.start_time && new Date(value) >= new Date(this.model.start_time), message: '结束时间要大于开始时间'}
                ]
            },
            selector: {
                value: false,
                list: []
            },
            loading: false
        }
    },
    methods: {
        getNewCoupon() {
            this.resetModel()
            this.$api.marketApi.getNewCoupon().then(res => {
                if (res.error === 0) {
                    this.model = Object.assign(this.model, res.item)
                    this.selector.list = res.coupon_info || []
                }
            })
        },
        handleSave() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let params = {}
                    if (this.id) {
                        params = Object.assign({ id: this.id }, this.model)
                    } else {
                        params = Object.assign({}, this.model)
                    }
                    console.log('linit-time', params.limit_time)
                    if (params.limit_time === '1') {
                        if (!params.start_time || !params.end_time) {
                            this.$Message.error('请填写正确的开始与结束时间')
                            return
                        }
                        params.start_time = formatDate(
                            params.start_time,
                            'yyyy-MM-dd hh:mm:ss'
                        )
                        params.end_time = formatDate(
                            params.end_time,
                            'yyyy-MM-dd hh:mm:ss'
                        )
                    }
                    this.$api.marketApi.addNewCoupon(params).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('保存成功')
                            this.getNewCoupon()
                        }
                    })
                }
            })
        },
        // 添加优惠券
        addCoupons() {
            this.selector.value = true
        },
        // 删除优惠券列表
        deleteCoupons(index) {
            this.selector.list.splice(index, 1)
            this.model.coupon_ids = this.selector.list
                .map(item => item.id)
                .join(',')
        },
        changeCouponList(list) {
            this.selector.list = list
            this.cancelSelector()
            this.model.coupon_ids = list.map(item => item.id).join(',')
        },
        cancelSelector() {
            this.selector.value = false
        },
        changeStartTime(date) {
            this.model.start_time = date
        },
        changeEndTime(date) {
            this.model.end_time = date
        },
        resetModel() {
            this.model = {
                state: '0',
                pick_limit: '0',
                limit_time: '0',
                start_time: '',
                end_time: '',
                coupon_ids: ''
            }
        }
    },
    mounted() {
        this.getNewCoupon()
    }
}
</script>

<style scoped lang="scss">
.market-send-coupons-activity-new-user {
    padding-top: 20px;
    .ivu-form {
        padding: 0 40px;
        min-height: calc(100vh - 110px - 73px - 40px - 48px - 40px);
        box-sizing: border-box;
    }

    .form-item-bg-box {
        padding: 30px 20px;
        margin-top: 10px;
        background-color: $background-color;

        .ivu-form-item {
            margin-bottom: 0;
            display: inline-block;
        }

        .coupons-list {
            width: 610px;
        }

        .date-range {
            .middle {
                padding: 0 10px;
            }
        }
    }

    .footer-btn {
        padding: 20px 0 20px 170px;
        border-top: 1px solid $border-color;
        box-sizing: border-box;
    }
}
</style>
