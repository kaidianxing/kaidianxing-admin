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
    <div class="good-add-market">
        <Form ref="form" :model="model" :rules="rules" :label-width="120"  @submit.native.prevent>
            <div class="box">
                <kdx-form-title>
                    抵扣设置
                </kdx-form-title>
                <FormItem label="积分抵扣：" prop="deduction_credit_type" class="r-form-item-checkbox">
                    <RadioGroup v-model="model_deduction_credit_type" @on-change="pointsDeductionChange">
                        <Radio label="0">关闭</Radio>
                        <Radio label="1">不限制抵扣数量</Radio>
                        <Radio label="2">自定义最多抵扣</Radio>
                    </RadioGroup>
                    <div v-if="model_deduction_credit_type === '2'" class="nest-box">
                        <FormItem label="最多抵扣：" prop="deduction_credit">
                            <kdx-rr-input v-model="model_deduction_credit" class="width-160" number :fixed="2" :min-value="0" :max-value="9999999.99" :maxlength="10" placeholder="请输入">
                                <span slot="append">元</span>
                            </kdx-rr-input>
                            <Checkbox v-model="model_deduction_credit_repeat"
                                      true-value="1" false-value="0">
                                允许多件累计抵扣
                            </Checkbox>
                        </FormItem>
                    </div>
                </FormItem>
                <FormItem label="余额抵扣：" prop="deduction_balance_type" class="r-form-item-checkbox">
                    <RadioGroup v-model="model_deduction_balance_type" @on-change="balanceDeductionChange">
                        <Radio label="0">关闭</Radio>
                        <Radio label="1">不限制抵扣数量</Radio>
                        <Radio label="2">自定义最多抵扣</Radio>
                    </RadioGroup>
                    <div v-if="model_deduction_balance_type === '2'" class="nest-box">
                        <FormItem label="最多抵扣：" prop="deduction_balance">
                            <kdx-rr-input v-model="model_deduction_balance" class="width-160" number :fixed="2" :min-value="0" :max-value="9999999.99" :maxlength="10" placeholder="请输入">
                                <span slot="append">元</span>
                            </kdx-rr-input>
                            <Checkbox v-model="model_deduction_balance_repeat"
                                      true-value="1" false-value="0">
                                允许多件累计抵扣
                            </Checkbox>
                        </FormItem>
                    </div>
                </FormItem>
            </div>
            <div class="box" v-if="model_type != '2'">
                <kdx-form-title style="margin-bottom: 0">
                    单件包邮
                </kdx-form-title>
                <kdx-hint-alert show-icon class="alert">开启后用户需单独购买该商品才支持满件/满额包邮</kdx-hint-alert>
                <FormItem label="单品满件包邮：" prop="single_full_unit_switch" class="r-form-item-checkbox">
                    <RadioGroup v-model="model_single_full_unit_switch">
                        <Radio label="1">开启</Radio>
                        <Radio label="0">关闭</Radio>
                    </RadioGroup>
                    <div class="nest-box" v-if="model_single_full_unit_switch === '1'">
                        <FormItem label="包邮条件：" prop="single_full_unit">
                            <kdx-rr-input number :fixed="0" :minValue="0" v-model="model_single_full_unit" :max-value="999999999" class="width-250"
                                   placeholder="请输入">
                            <span slot="prepend">满</span>
                            <span slot="append">件</span>
                            </kdx-rr-input>
                        </FormItem>
                    </div>
                </FormItem>
                <FormItem label="单品满额包邮：" prop="single_full_quota_switch" class="r-form-item-checkbox">
                    <RadioGroup v-model="model_single_full_quota_switch">
                        <Radio label="1">开启</Radio>
                        <Radio label="0">关闭</Radio>
                    </RadioGroup>
                    <div class="nest-box" v-if="model_single_full_quota_switch === '1'">
                        <FormItem label="包邮条件：" prop="single_full_quota">
                            <kdx-rr-input v-model="model_single_full_quota" :fixed="2" number :max-value="9999999.99" class="width-250"
                                   placeholder="请输入">
                            <span slot="prepend">满</span>
                            <span slot="append">元</span>
                            </kdx-rr-input>
                        </FormItem>
                    </div>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
    import {
        modelMap
    } from '../base/components/binders';
    import {
        mapState
    } from 'vuex';

    export default {
        name: "index",
        computed: {
            /**
             * 双向绑定vuex/goodAddEdit.js/state/model
             * 使用方法this.model_${propsName}
             */
            ...modelMap(),
            ...mapState('goodAddEdit', {
                model: state => state.model
            })
        },
        data() {
            return {
                rules: {
                    deduction_credit: [{
                        required: true,
                        message: '最多积分抵扣额必填',
                        trigger: 'blur'
                    },
                        // {
                        // pattern: /^(0|[1-9][0-9]{0,6})(.[0-9]{1,2})?$/,
                        // message: '小数点前7位小数点后两位'}
                    ],
                    deduction_balance: [{
                        required: true,
                        message: '最多余额抵扣额必填'
                    }],
                    single_full_unit: [{
                        required: true,
                        message: '单品满件包邮必填'
                    }],
                    single_full_quota: [{
                        required: true,
                        message: '单品满额包邮必填'
                    }]
                }
            };
        },
        methods: {
            // 积分抵扣
            pointsDeductionChange(value) {
              console.log('$store',this.$store.state.config.deduct)
                // 不限制抵扣数量/自定义最多抵扣时，查看是否开启全局积分抵扣，为开启，弹窗提示
              if (this.$store.state.config.deduct.credit_state != '1') {
                if (value === '1' || value === '2') {
                  this.$Modal.confirm({
                    title: '您还未开启积分抵扣设置',
                    okText: '去设置',
                    render: () => {
                        return (
                            <kdx-hint-text>
                                <span>设置单商品积分抵扣时,需要在营销</span>
                              【抵扣设置】
                                <span>中开启积分抵扣</span>
                            </kdx-hint-text>
                        )
                    },
                    onOk: () => {
                     let routeData = this.$router.resolve({
                        path: '/market/deduction-setting'
                      })
                      window.open(routeData.href, '_blank')
                    },
                    onCancel: () => {
                        this.model_deduction_credit_type = '0';
                    }
                  });
                }
              }
            },
            // 余额抵扣
            balanceDeductionChange(value) {
                // 不限制抵扣数量/自定义最多抵扣时，查看是否开启全局积分抵扣，为开启，弹窗提示
              if (this.$store.state.config.deduct.balance_state != '1') {
                if (value === '1' || value === '2') {
                  this.$Modal.confirm({
                    title: '您还未开启余额抵扣设置',
                    okText: '去设置',
                    render: () => {
                        return (
                            <kdx-hint-text>
                                <span>设置单商品余额抵扣时,需要在营销</span>
                                【抵扣设置】
                                <span>中开启余额抵扣</span>
                            </kdx-hint-text>
                        )
                    },
                    onOk: () => {
                     let routeData = this.$router.resolve({
                        path: '/market/deduction-setting'
                      })
                      window.open(routeData.href, '_blank')
                    },
                    onCancel: () => {
                        this.model_deduction_balance_type = '0';
                    }
                  });
                }
              }
            },
            validate() {
                return new Promise(resolve => {
                    this.$refs['form'].validate(valid => {
                        resolve(valid);
                    })
                })
            }
        }
    };
</script>

<style scoped lang="scss">
    .good-add-market {
        > .ivu-form {
            padding: 0 40px;
        }
        .box {
            padding-bottom: 30px;
            .alert {
                margin-top: 10px;
                margin-bottom: 30px;
            }
        }
        .nest-box {
            padding: 30px 0;
            margin-top: 10px;
            background-color: $background-color;
            .ivu-checkbox-wrapper {
                margin-left: 10px;
                margin-top: 0;
            }
            /deep/ .ivu-form-item {
                margin-bottom: 0;
                .ivu-form-item-content {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    .ivu-input-type-text {
                    }
                }
            }
        }
    }

    .modal-content-market {
        display: flex;
        flex-wrap: nowrap;
        > .content-item {
            padding-left: 10px;
            color: $text-first;
            @include font-16-22-bold;
        }
    }
</style>
