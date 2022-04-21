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
    <!-- 废弃 2021.08.04 -->
    <kdx-content-bar>
        <div class="content">
            <div class="part1">
                <kdx-form-title>积分设置</kdx-form-title>
                <Form
                    ref="form1"
                    :model="model"
                    :label-width="140"
                    :rules="rules1"
                    @submit.native.prevent
                >
                    <FormItem label="积分文字定义:">
                        <Input :disabled='noManagePerm'
                            style="width: 300px"
                            maxlength="4"
                            show-word-limit
                            v-model="model.credit_text"
                            @on-blur="inputCredit"
                        ></Input>
                    </FormItem>
                    <FormItem label="积分上限:">
                        <RadioGroup v-model="model.credit_limit_type">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>不限制</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="2">
                                <span>自定义</span>
                            </Radio>
                        </RadioGroup>

                        <div
                            class="fee-main"
                            v-if="model.credit_limit_type==2"
                        >
                            <div class="flex flex-column">
                                <div class="flex">
                                    <span style="padding-right: 5px">最多可获得</span>
                                    <div class="number-input width-200 patch-input">
                                        <FormItem
                                            class="flex"
                                            prop="credit_limit"
                                        >
                                            <kdx-rr-input :disabled='noManagePerm'
                                                v-model="model.credit_limit"
                                                number
                                                :minValue="0"
                                                :maxValue="999999999"
                                                :fixed="0"
                                            ></kdx-rr-input>
                                            <span class="ivu-input-group-append item-append">积分</span>
                                        </FormItem>
                                    </div>
                                </div>
                                <kdx-hint-text class="input-hint">会员积分大于等于此值时将无法继续增加，后台手动充值不限制，已持有积分不限制</kdx-hint-text>
                            </div>
                        </div>
                    </FormItem> 
                </Form>
            </div>
            <div class="part2">
                <kdx-form-title>余额设置</kdx-form-title>
                <Form
                    ref="form2"
                    :model="model"
                    :label-width="140"
                    :rules="rules"
                    @submit.native.prevent
                >
                    <FormItem label="余额文字定义：">
                        <Input :disabled='noManagePerm'
                            style="width: 300px"
                            placeholder="请输入"
                            maxlength="4"
                            show-word-limit
                            v-model="model.balance_text"
                            @on-blur="inputBalance"
                        ></Input>
                    </FormItem>
                    <FormItem label="充值设置：" prop="recharge_state">
                        <RadioGroup v-model="model.recharge_state">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>开启</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <div v-if="model.recharge_state =='1'">
                        <FormItem
                            label="最低充值金额："
                            prop="recharge_money_low"
                        >
                            <div class="number-input width-200">
                                <div class="flex">
                                    <kdx-rr-input :disabled='noManagePerm'
                                        v-model="model.recharge_money_low"
                                        :minValue="0.10"
                                        :maxValue="9999999.99"
                                        :fixed="2"
                                        number
                                    ></kdx-rr-input>
                                    <span class="ivu-input-group-append item-append">元</span>
                                </div>
                            </div>

                            <kdx-hint-text>账户充值时，最低允许的充值金额，系统最低可支持0.1元</kdx-hint-text>
                        </FormItem>
                    </div>
                    <FormItem label="余额提现：">
                        <RadioGroup v-model="model.withdraw_state">
                            <Radio :disabled='noManagePerm' label="1">
                                <span>开启</span>
                            </Radio>
                            <Radio :disabled='noManagePerm' label="0">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                        <kdx-hint-text>是否允许用户将余额提出</kdx-hint-text>
                    </FormItem>
                    <div v-if="model.withdraw_state == '1'">
                        <FormItem
                            label="提现方式："
                            prop="withdraw_type"
                        >
                            <CheckboxGroup
                                :value="withdraw_types"
                                @on-change="changeWithdraw"
                            >
                                <Checkbox :disabled='noManagePerm' label="20">提现到微信钱包</Checkbox>
                                <Checkbox :disabled='noManagePerm' label="30">手动提现到支付宝</Checkbox>
                            </CheckboxGroup>
                        </FormItem>

                        <FormItem label="提现限制：">
                            <RadioGroup v-model="model.withdraw_limit_type">
                                <Radio :disabled='noManagePerm' label="1">
                                    <span>不限制</span>
                                </Radio>
                                <Radio :disabled='noManagePerm' label="2">
                                    <span>自定义</span>
                                </Radio>
                            </RadioGroup>
                            <div
                                class="fee-main"
                                v-if="model.withdraw_limit_type=='2'"
                            >
                                <div class="row">
                                    <span class="paddingR">余额满</span>
                                    <div class="number-input width-160">
                                        <FormItem
                                            class="flex"
                                            prop="withdraw_limit_money"
                                        >
                                            <kdx-rr-input :disabled='noManagePerm'
                                                v-model="model.withdraw_limit_money"
                                                :maxValue="9999999.99"
                                                :minValue="0.1"
                                                :fixed="2"
                                                number
                                            ></kdx-rr-input>
                                            <span class="ivu-input-group-append item-append">元</span>
                                        </FormItem>
                                    </div>
                                    <span class="paddingL">可提现</span>
                                </div>
                            </div>
                        </FormItem>

                        <FormItem label="提现手续费：">
                            <RadioGroup v-model="model.withdraw_fee_type">
                                <Radio :disabled='noManagePerm' label="1">
                                    <span>不扣除</span>
                                </Radio>
                                <Radio :disabled='noManagePerm' label="2">
                                    <span>自定义</span>
                                </Radio>
                            </RadioGroup>
                            <div
                                class="fee-main"
                                v-if="model.withdraw_fee_type=='2'"
                            >
                                <div class="row ivu-form-item-required" >
                                    <span class="ivu-form-item-label paddingR">手续费：</span>
                                    <div class="number-input width-160">
                                        <FormItem
                                            class="flex"
                                            prop="withdraw_fee"
                                        >
                                            <kdx-rr-input :disabled='noManagePerm'
                                                v-model="model.withdraw_fee"
                                                :maxValue="99.9"
                                                :minValue="0"
                                                :fixed="1"
                                                number
                                            ></kdx-rr-input>
                                            <span class="ivu-input-group-append item-append">%</span>
                                        </FormItem>
                                    </div>
                                </div>
                                <FormItem
                                    label
                                    class="free-item"
                                >
                                <span class="paddingR">免手续费：</span>
                                    <RadioGroup v-model="model.free_fee_type">
                                        <Radio :disabled='noManagePerm' label="1">
                                            <span>不免手续费</span>
                                        </Radio>
                                        <Radio :disabled='noManagePerm' label="2">
                                            <span>自定义免手续费区间</span>
                                        </Radio>
                                    </RadioGroup>
                                </FormItem>
                                <div v-if="model.free_fee_type=='2'" class="ml-70">
                                    <div class="row free-fee">
                                        <div class="number-input width-160">
                                            <FormItem
                                                class="flex"
                                                prop="free_fee_start"
                                                ref="start"
                                            >
                                                <kdx-rr-input :disabled='noManagePerm'
                                                    v-model="model.free_fee_start"
                                                    :maxValue="9999999.99"
                                                    :minValue="0"
                                                    :fixed="2"
                                                    number
                                                ></kdx-rr-input>
                                                <span class="ivu-input-group-append item-append">元</span>
                                            </FormItem>
                                        </div>
                                        <span class="operator">-</span>
                                        <div class="number-input width-160">
                                            <FormItem
                                                class="flex"
                                                prop="free_fee_end"
                                                ref="end"
                                            >
                                                <kdx-rr-input :disabled='noManagePerm'
                                                    v-model="model.free_fee_end"
                                                    :maxValue="9999999.99"
                                                    :minValue="0"
                                                    :fixed="2"
                                                    number
                                                ></kdx-rr-input>
                                                <span class="ivu-input-group-append item-append">元</span>
                                            </FormItem>
                                        </div>
                                        <span class="paddingL">时不扣除手续费</span>
                                    </div>
                                    <kdx-hint-text class="input-hint">当手续费金额在此区间内时，不扣除手续费，结束金额 必须大于 开始金额。</kdx-hint-text>
                                    <kdx-hint-text>例如 设置开始金额0元 结束金额5元，只有手续费金额高于5元时，才扣除</kdx-hint-text>
                                </div>
                            </div>
                        </FormItem>
                    </div>
                </Form>
            </div>
        </div>
        <template #btn>
            <Button :disabled='noManagePerm'
                class="primary-long"
                @click="handleSubmit"
            >保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    name: 'index',
    components: {},
    data() {
        const validator = ({ message }, val, callback) => {
            if (val === null || val === '') {
                callback(message)
            } else {
                callback()
            }
        }

        const validStart = (field, val, callback) => {
            if (val === null) {
                callback('起始金额不能为空')
                return
            }
            let end = this.model.free_fee_end
            if (end !== null && parseFloat(val) >= parseFloat(end)) {
                callback('起始金额必须小于结束金额')
            }

            this.$refs.end.validateState = ''

            callback()
        }

        const validEnd = (field, val, callback) => {
            if (val === null) {
                callback('结束金额不能为空')
            }
            let start = this.model.free_fee_start
            if (start !== null && parseFloat(val) <= parseFloat(start)) {
                callback('结束金额必须大于起始金额')
            }
            this.$refs.start.validateState = ''
            callback()
        }

        return {
            model: {
                credit_text: '积分',
                credit_limit_type: '1',
                credit_limit: null,
                balance_text: '余额',
                recharge_state: '0',
                recharge_money_low: 0.1,
                withdraw_state: '0',
                withdraw_type: '',
                withdraw_limit_type: '1',
                withdraw_limit_money: null,
                withdraw_fee_type: '1',
                withdraw_fee: null,
                free_fee_type: '1',
                free_fee_start: null,
                free_fee_end: null
            },
            moneyFormat: value => {
                if (value != null) {
                    return parseFloat(value)
                }
            },
            withdraw_types: [],
            rules1: {
                credit_limit: [{ required: true, message: '请输入积分上限' }],

            },
            rules: {
                recharge_state: [{message:''}],
                recharge_money_low: [
                    {
                        validator,
                        message: '请输入最低充值金额'
                    }
                ],
                withdraw_type: [{
                    validator,
                    message: '请选择提现方式'
                }],
                withdraw_limit_money: [
                    { required: true, message: '请输入最低提现金额' }
                ],
                withdraw_fee: [{ required: true, message: '请输入手续费' }],
                free_fee_start: [
                    {
                        validator: validStart,
                        trigger: 'blur'
                    }
                ],
                free_fee_end: [
                    {
                        validator: validEnd,
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('sysset.credit.manage')
        },
    },
    mounted() {
        // this.getData()
    },
    methods: {
        getData() {
            this.$api.settingApi.getIntegralSetting({}).then(res => {
                let { error, ...info } = res

                if (error === 0) {
                    let keys = [
                        'credit_limit',
                        'recharge_money_low',
                        'withdraw_fee',
                        'free_fee_start',
                        'free_fee_end',
                        'withdraw_limit_money'
                    ]

                    keys.forEach(
                        key => (info[key] = this.stringToNum(info[key]))
                    )
                    this.model = {
                        ...this.model,
                        ...info
                    }
                    if (this.model.withdraw_type.indexOf(',') == 0) {
                        this.model.withdraw_type.slice(1)
                    }
                    this.withdraw_types = this.model.withdraw_type.split(',')
                }
            })
        },
        stringToNum(num) {
            if (typeof num === 'string') {
                return parseFloat(num)
            } else {
                return null
            }
        },
        changeWithdraw(e) {
            this.withdraw_types = e
            this.model.withdraw_type = e.join(',')
        },

        inputBalance(e) {
            if (e.target.value.trim() === '') {
                this.model.balance_text = '余额'
            }
        },
        inputCredit(e) {
            if (e.target.value.trim() === '') {
                this.model.credit_text = '积分'
            }
        },
        handleSubmit() {
            if (this.model.credit_limit_type == 2) {
                this.$refs.form1.validate().then(valid => {
                    if (valid) {
                        this.secondValid()
                    }
                })
            } else {
                this.secondValid()
            }
        },
        secondValid() {
            this.$refs.form2.validate().then(valid => {
                if (valid) {
                    this.handleSave()
                }
            })
        },
        handleSave() {
            let data = { ...this.model }
            if (data.credit_limit_type === '1') {
                delete data.credit_limit
            }

            if (data.withdraw_limit_type === '1') {
                delete data.withdraw_limit_money
            }

            if (data.withdraw_fee_type === '1') {
                delete data.withdraw_fee
                delete data.free_fee_type
                delete data.free_fee_end
                delete data.free_fee_start
            } else {
                if (data.free_fee_type === '1') {
                    delete data.free_fee_end
                    delete data.free_fee_start
                }
            }

            this.$api.settingApi.editIntegralSetting(data).then(res => {
                if (res.error === 0) {
                    this.$Message.success('保存成功')
                    this.getData()
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.content {
    padding: 40px;
    margin: 20px auto 0;
    background: #fff;
    min-height: 100%;
    .part2,
    .part1 {
        padding-bottom: 30px;
    }
    .fee-main {
        display: flex;
        padding: 30px 20px 30px;
        margin-top: 10px;
        background-color: #f4f6f8;
        border-radius: 2px;
    }

    .ml-70 {
        margin-left: 70px;
    }

    .part2 {
        .fee-main {
            flex-direction: column;

            .row {
                display: flex;
                flex-direction: row;
                /*margin-bottom: 10px;*/
                .paddingL {
                    padding-left: 5px;
                }
                .paddingR {
                    padding-right: 5px;
                }
            }

            .free-item {
                margin: 30px 0 0 0;
            }
        }
    }

    .min-pay {
        /deep/ .ivu-form-item-error-tip {
            left: 92px;
            top: 52px;
        }
    }

    .patch-input {
        /deep/ .ivu-form-item-error-tip {
            left: 100%;
            width: 300px;
            top: 50%;
            margin-left: 10px;
            transform: translateY(-50%);
        }
    }

    .width-200 {
        width: 200px;
    }

    .input-hint {
        padding-top: 10px;
    }
    .number-input {
        display: inline-block;

        /deep/ .ivu-form-item {
            margin-bottom: 0;

            .ivu-form-item-content {
                width: 100%;
                display: flex;
            }
        }

        .item-append {
            display: inline-block;
            padding: 0 7px;
            width: auto;
            height: 32px;
            line-height: 32px;
        }

        /deep/ .ivu-input-number {
            flex: 1;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
    }

    .operator {
        margin: 0 10px;
    }

    .free-fee {
        /*margin-bottom: 30px;*/
    }
}
</style>
