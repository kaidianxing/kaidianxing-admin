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
        <kdx-form-title>领取规则</kdx-form-title>
        <FormItem label="领取方式：" class="r-form-item-checkbox">
            <RadioGroup v-model="model_pick_type">
                <Radio label="0" :disabled="isDisabled">
                    <span>领券中心</span>
                </Radio>
                <Radio label="1" :disabled="isDisabled">
                    <span>直接链接领取</span>
                </Radio>
                <Radio label="2" :disabled="isDisabled">
                    <span>活动领取</span>
                </Radio>
                <kdx-hint-tooltip type="form">
                    <Form :label-width="85">
                        <FormItem label="领券中心：">
                            创建的优惠券，会员可以在领券中心进行领取。
                        </FormItem>
                        <FormItem label="直接链接领取：">
                            创建的优惠券，商家可通过连接单独发送给会员。
                        </FormItem>
                        <FormItem label="活动领取：">
                            创建的优惠券，只能通过营销活动进行发放。
                        </FormItem>
                    </Form>
                </kdx-hint-tooltip>
            </RadioGroup>
            <kdx-hint-alert
                v-show="model_pick_type === '0'"
                style="margin-top: 10px"
            >
                领券中心可支持免费领取，也可通过消耗积分或者花费金额进行支付获取优惠券
            </kdx-hint-alert>
            <div class="form-item-bg-box" v-show="model_pick_type === '0'">
                <div class="coupons-get-center">
                    <div class="get-free">
                        <Radio
                            v-model="model_is_free"
                            :disabled="isDisabled"
                            true-value="1"
                            false-value="0"
                        >
                            免费领取
                        </Radio>
                    </div>
                    <div class="get-pay">
                        <div class="r-form-item-checkbox">
                            <Radio
                                v-model="model_is_free"
                                :disabled="isDisabled"
                                true-value="0"
                                false-value="1"
                            >
                                付费领取
                            </Radio>
                        </div>
                        <div class="left-text">花费</div>
                        <template v-if="model_is_free == '0'">
                            <FormItem prop="balance" class="r-form-item-checkbox">
                                <kdx-rr-input v-model="model_balance" :disabled="isDisabled || model_is_free == '1'" class="width-160"
                                          placeholder="请输入" number :fixed="2" :min-value="0" :max-value="9999999.99">
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                        </template>
                        <template v-else>
                            <Input
                                v-model="model_balance"
                                :disabled="isDisabled || model_is_free == '1'"
                                class="width-160"
                                placeholder="请输入"
                            >
                                <span slot="append">元</span>
                            </Input>
                        </template>
                        <div class="middle-text">消耗</div>
                        <template v-if="model_is_free == '0'">
                            <FormItem prop="credit" class="r-form-item-checkbox">
                                <kdx-rr-input v-model="model_credit" :disabled="isDisabled || model_is_free == '1'" :fixed="0" number :max-value="999999999" class="width-160" placeholder="请输入">
                                    <span slot="append">积分</span>
                                </kdx-rr-input>
                            </FormItem>
                        </template>
                        <template v-else>
                            <kdx-rr-input
                                class="width-160"
                                placeholder="请输入"
                                v-model="model_credit"
                                :disabled="isDisabled || model_is_free == '1'"
                                number
                                :fixed="0"
                                :max-value="999999999"
                            >
                                <span slot="append">积分</span>
                            </kdx-rr-input>
                        </template>
                        <!-- <Checkbox
                            v-model="model_use_balance"
                            true-value="1"
                            false-value="0"
                            :disabled="isDisabled"
                        >
                            优先使用余额支付
                        </Checkbox> -->
                    </div>
                    <kdx-hint-text style="margin-left: 140px;padding-top: 6px">
                        抵扣积分+余额支付时，如用户取消支付时，积分不退。
                    </kdx-hint-text>
                </div>
            </div>
        </FormItem>
        <FormItem label="领取人限制：" class="r-form-item-checkbox" v-if="model_pick_type !== '2'">
            <RadioGroup v-model="model_limit_member">
                <Radio label="0">全部会员</Radio>
                <Radio label="1">指定会员身份</Radio>
            </RadioGroup>
            <div
                class="form-item-bg-box-label get-rules-checkbox"
                v-if="model_limit_member === '1'"
            >
                <FormItem
                    label="会员等级："
                    :prop="!isShowCommissionLevel ? 'member_level' : ''"
                    class="r-form-item-checkbox"
                >
                    <CheckboxGroup v-model="model_member_level">
                        <Checkbox
                            v-for="item in vipLevel"
                            :key="item.id"
                            :label="item.id"
                        >
                            {{ item.level_name }}
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem
                    label="分销商等级："
                    class="r-form-item-checkbox"
                    v-if="isShowCommissionLevel"
                >
                    <CheckboxGroup v-model="model_commission_level">
                        <Checkbox
                            v-for="item in commissionLevel"
                            :key="item.id"
                            :label="item.id"
                        >
                            {{ item.name }}
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </div>
        </FormItem>
        <FormItem
            label="每人领取张数："
            prop="get_max_type"
            class="r-form-item-checkbox"
            v-if="model_pick_type !== '2'"
        >
            <RadioGroup v-model="model_get_max_type">
                <Radio label="0" :disabled="isDisabled">
                    <span>不限制</span>
                </Radio>
                <Radio label="1" :disabled="isDisabled">
                    <span>自定义</span>
                </Radio>
            </RadioGroup>
            <div
                class="form-item-bg-box-label"
                v-if="model_get_max_type === '1'"
            >
                <FormItem label="每人限领：" prop="get_max" v-error-item.get_max>
                    <kdx-rr-input
                        v-model="model_get_max"
                        :disabled="isDisabled"
                        class="width-160"
                        placeholder="请输入"
                        :fixed="0" number :max-value="999999999"
                    >
                        <span slot="append">张</span>
                    </kdx-rr-input>
                </FormItem>
            </div>
        </FormItem>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { modelMap } from './binders.js'

export default {
    name: 'GetRules',
    computed: {
        ...modelMap(),
        ...mapState('couponAdd', {
            isDisabled: (state) => state.isDisabled,
            vipLevel: (state) => state.vipLevel,
            commissionLevel: (state) => state.commissionLevel,
        }),
        isShowCommissionLevel() {
            return (
                parseInt(
                    this.$store.state?.config?.commission?.setting
                        ?.commission_level || '-1'
                ) > 0
            )
        },
    },
}
</script>

<style scoped lang="scss"></style>
