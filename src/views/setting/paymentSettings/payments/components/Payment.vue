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
    <Form :label-width="120" ref="form" :model="model" :rules="rules">
        <div class="card-content">
            <kdx-form-title>支付宝打款</kdx-form-title>
            <kdx-hint-alert
                class="alert"
                :show-icon="false"
            >说明：新接口需签约"转账到支付宝账户" , 之前已经签约使用旧接口可以正常打款的无需修改</kdx-hint-alert>
            <FormItem label="支付宝打款:" prop="alipay.enable">
                <RadioGroup v-model="model.alipay.enable">
                    <Radio :disabled='noManagePerm' label="1">
                        <span>开启</span>
                    </Radio>
                    <Radio :disabled='noManagePerm' label="0">
                        <span>关闭</span>
                    </Radio>
                </RadioGroup>
                <div class="pay-detail" v-if="model.alipay.enable === '1'">
                    <FormItem label="打款模板:" prop="alipay.id">
                        <Select v-model="model.alipay.id" class="width-430" placeholder="请选择">
                            <Option
                                v-for="alipay in alipayTemp"
                                :key="alipay.id"
                                :label="alipay.title"
                                :value="alipay.id"
                            ></Option>
                        </Select>
                    </FormItem>
                </div>
            </FormItem>
        </div>
        <div class="card-content">
            <kdx-form-title>微信打款</kdx-form-title>
            <FormItem label="微信打款:">
                <RadioGroup v-model="model.wechat.enable">
                    <Radio :disabled='noManagePerm' label="1">
                        <span>开启</span>
                    </Radio>
                    <Radio :disabled='noManagePerm' label="0">
                        <span>关闭</span>
                    </Radio>
                </RadioGroup>
                <div class="pay-detail" v-if="model.wechat.enable === '1'">
                    <FormItem label="公众号模板" prop="wechat.wechat.id">
                        <Select :disabled='noManagePerm'
                            v-model="model.wechat.wechat.id"
                            class="width-430"
                            placeholder="请选择"
                        >
                            <Option 
                                v-for="wechat in wechatTemp"
                                :key="wechat.id"
                                :label="wechat.title"
                                :value="wechat.id"
                            ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="小程序模板" prop="wechat.wxapp.id">
                        <Select :disabled='noManagePerm' v-model="model.wechat.wxapp.id" class="width-430" placeholder="请选择">
                            <Option
                                v-for="wxapp in wechatTemp"
                                :key="wxapp.id"
                                :label="wxapp.title"
                                :value="wxapp.id"
                            ></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="佣金打款：" prop="pay_type_commission">
                        <RadioGroup v-model="model.pay_type_commission">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>企业打款</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="2">
                                <span>红包付款</span>
                            </Radio>
                        </RadioGroup>
                        <div class="tip">
                            <kdx-hint-text>一般 小额打款 可以使用微信红包 建议使用微信打款金额 超过1000</kdx-hint-text>
                        </div>
                    </FormItem>
                    <FormItem label="提现申请：" prop="pay_type_withdraw">
                        <RadioGroup v-model="model.pay_type_withdraw">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>企业打款</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="2">
                                <span>红包付款</span>
                            </Radio>
                        </RadioGroup>
                        <div class="tip">
                            <kdx-hint-text>一般 小额打款 可以使用微信红包 建议使用微信打款金额 超过1000</kdx-hint-text>
                        </div>
                    </FormItem>
                    <FormItem label="红包金额：" prop="pay_red_pack_money">
                        <RadioGroup v-model="model.pay_red_pack_money">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>188元</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="2">
                                <span>288元</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="3">
                                <span>388元</span>
                            </Radio>
                        </RadioGroup>
                        <div class="tip">
                            <kdx-hint-text>如果选用 红包打款，请选择每个红包最大面值</kdx-hint-text>
                            <kdx-hint-text>如果申请额度是500元，选择的是188红包，将会发送两个188红包和一个124红包</kdx-hint-text>
                        </div>
                    </FormItem>
                </div>
            </FormItem>
        </div>
    </Form>
</template>

<script>
export default {
    name: 'wxPay',
    props: {
        setting: {
            type: Object,
            default: () => {}
        },
        wechatTemp: {
            type: Array,
            default: () => []
        },
        alipayTemp: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('sysset.pay_set.manage')
        },
    },
    data() {
        return {
            rules: {
                'alipay.id': [{ required: true, message: '请选择支付宝模板' }],
                'wechat.wechat.id': [
                    { required: true, message: '请选择微信模板' }
                ],
                'wechat.wxapp.id': [
                    { required: true, message: '请选择小程序模板' }
                ],
                pay_type_commission: [{ required: true }],
                pay_type_withdraw: [{ required: true }],
                pay_red_pack_money: [{ required: true }]
            },
            model: {
                wechat: {
                    enable: '0',
                    wechat: {
                        id: ''
                    },
                    wxapp: {
                        id: ''
                    }
                },
                alipay: { enable: '0', id: '' },
                pay_type_commission: '1',
                pay_type_withdraw: '1',
                pay_red_pack_money: '1'
            }
        }
    },
    watch: {
        setting: {
            handler(val) {
                this.model = { ...this.model, ...val }
            },
            immediate: true
        }
    },
    methods: {
        validate() {
            let data = JSON.parse(JSON.stringify(this.model))
            return new Promise((resolve, reject) => {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        data.alipay.enable == '0' && delete data.alipay.id
                        if (data.wechat.enable == '0') {
                            delete data.wechat.wechat
                            delete data.wechat.wxapp
                        }
                        resolve(data)
                    } else {
                        reject(false)
                    }
                })
            })
        }
    }
}
</script>

<style scoped lang="scss">
.card-content {
    padding-bottom: 30px;

    &:nth-last-child(2) {
        margin-bottom: 30px;
    }
    &:nth-last-child(1) {
        margin-bottom: 0;
    }

    /deep/ .ivu-alert {
        max-width: 100%;

        &-message {
            @include font-12-24;
            color: $text-second;
        }
    }

    /deep/ .ivu-form-item-error-tip {
        left: 120px;
    }

    /deep/ .form-title {
        margin-bottom: 10px;
    }

    /deep/ .ivu-form-item {
        margin: 30px 0 0 0;
    }

    .pay-detail {
        margin-top: 3px;
        overflow: hidden;
        background-color: #f4f6f8;
        border-radius: 2px;

        /deep/ .ivu-form-item {
            margin-bottom: 30px;
        }
    }

    .tip {
        padding-left: 120px;
    }
}
</style>
