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
    <kdx-content-bar class="settle-setting">
        <div class="page-container">
            <Form
                ref="form"
                style="padding-bottom:1px"
                :label-width="150"
                :model="settings"
                :rules="rules"
            >
                <kdx-form-title content="结算设置"></kdx-form-title>
                <FormItem
                    :label-width="120"
                    label="佣金计算方式："
                    prop="calculate_type"
                >
                    <MyRadioGroup
                        :disabled='noManagePerm'
                        :items="calculate_type"
                        v-model="settings.calculate_type"
                    >
                        <kdx-hint-alert :show-icon="false" slot="tip" style="margin-top:6px;">
                            <p style="margin-bottom:10px;">
                                商品折扣价:
                                除运费和会员折扣外其他所有费用全部计算佣金
                                <span class="primary-tip bold">
                                    [商品原价-会员折扣]*佣金比例
                                </span>
                            </p>
                            <p>
                                实际支付价:
                                只计算实际支付和余额抵扣部分的佣金(包括余额支付)
                                <span class="primary-tip bold">
                                    [实际支付+余额抵扣-运费]*佣金比例
                                </span>
                            </p>
                        </kdx-hint-alert>
                    </MyRadioGroup>
                </FormItem>
                <FormItem
                    :label-width="120"
                    label="最低提现额度："
                    prop="withdraw_limit"
                >
                    <kdx-rr-input :disabled='noManagePerm'
                        style="width:250px"
                        v-model="settings.withdraw_limit"
                        :minValue="1"
                        :maxValue="9999999.99"
                        number 
                        :fixed="2"
                    >
                        <span slot="append">元</span>
                    </kdx-rr-input>
                    <p class="tip">提现额度最低可设置为1元。</p>
                </FormItem>
                <FormItem
                    :label-width="120"
                    label="提现手续费："
                    prop="withdraw_fee_type"
                >
                    <MyRadioGroup
                        :disabled='noManagePerm'
                        :items="withdraw_fee_type"
                        v-model="settings.withdraw_fee_type"
                    >
                        <div
                            class="inner-box"
                            v-if="settings.withdraw_fee_type == 2"
                        >
                            <FormItem
                                label="手续费："
                                prop="withdraw_fee"
                                :label-width="120"
                            >
                                <kdx-rr-input
                                    :disabled='noManagePerm'
                                    style="width:250px"
                                    v-model="settings.withdraw_fee"
                                    number
                                    :maxValue="99.9"
                                    :fixed="1"
                                >
                                    <span slot="append">%</span>
                                </kdx-rr-input>
                                <p class="tip" style="margin-left:120px;">
                                    佣金提现时,扣除的提现手续费.
                                </p>
                            </FormItem>
                            <FormItem
                                style="margin-bottom:0"
                                label="免手续费："
                                prop="free_fee_type"
                                :label-width="120"
                            >
                                <MyRadioGroup
                                    :disabled='noManagePerm'
                                    class="withdraw_limit"
                                    :items="free_fee_type"
                                    v-model="settings.free_fee_type"
                                >
                                    <div
                                        class="inner-box"
                                        v-if="settings.free_fee_type == '2'"
                                    >
                                        <div style="display:flex;">
                                            <span>手续费</span>
                                            <kdx-rr-input
                                                :disabled='noManagePerm'
                                                style="width:160px;margin:0 10px;"
                                                v-model="
                                                    settings.free_fee_start
                                                "
                                                number :fixed="2" :min-value="0" :max-value="9999999.99" :maxlength="10"
                                            >
                                                <span slot="append">元</span>
                                            </kdx-rr-input>
                                            <span>-</span>
                                            <kdx-rr-input
                                                :disabled='noManagePerm'
                                                style="width:160px;margin:0 10px;"
                                                v-model="settings.free_fee_end"
                                                number :fixed="2" :min-value="0" :max-value="9999999.99" :maxlength="10"
                                            >
                                                <span slot="append">元</span>
                                            </kdx-rr-input>
                                            <span>时不扣除手续费</span>
                                        </div>
                                        <p class="tip">
                                            当提现手续费金额在此区间时，不扣除手续费，结束金额必须大于开始金额。
                                            <br />例如：设置开始金额0元，结束金额5元。只有提现手续费金额高于5元的时候才会扣除提现手续费
                                        </p>
                                    </div>
                                </MyRadioGroup>
                            </FormItem>
                        </div>
                    </MyRadioGroup>
                </FormItem>
                <FormItem
                    label="结算天数："
                    :label-width="120"
                    prop="settlement_day_type"
                >
                    <MyRadioGroup
                        :disabled='noManagePerm'
                        :items="settlement_day_type"
                        v-model="settings.settlement_day_type"
                    >
                        <div
                            class="inner-box settlement_day"
                            v-if="settings.settlement_day_type == 2"
                        >
                            <FormItem
                                style="margin-bottom:0"
                                label="订单确认收货后："
                                prop="settlement_days"
                                :label-width="150"
                            >
                                <div style="display:flex;">
                                    <kdx-rr-input
                                        :disabled='noManagePerm'
                                        style="width:160px;margin:0 10px 0 0;"
                                        v-model="settings.settlement_days"
                                        number
                                        :maxValue="999999999"
                                        :fixed="0"
                                    >
                                        <span slot="append">天</span>
                                    </kdx-rr-input>
                                    <span>可申请提现</span>
                                </div>
                                <p
                                    class="tip primary-tip"
                                    style="margin-left:150px;"
                                >
                                    建议设置的结算天数大于
                                    <span
                                        style="color:$brand-color;cursor: pointer;"
                                        @click="jumpSafeguard"
                                    >
                                        【设置-维权设置】
                                    </span>
                                    中设置的天数，否则会出现佣金结算后商品被维权的情况，切勿随意修改，修改后立即生效。
                                </p>
                            </FormItem>
                        </div>
                    </MyRadioGroup>
                </FormItem>
                <kdx-form-title content="提现方式"></kdx-form-title>
                <FormItem
                    :label-width="120"
                    label="提现审核："
                    prop="withdraw_audit"
                >
                    <MyRadioGroup
                        :disabled='noManagePerm'
                        :items="withdraw_audit"
                        v-model="settings.withdraw_audit"
                    >
                        <div
                            class="inner-box"
                            v-if="settings.withdraw_audit == 2"
                        >
                            <FormItem
                                label="分销商等级："
                                prop="auto_check_level"
                                :label-width="120"
                            >
                                <Select :disabled='noManagePerm'
                                    v-model="settings.auto_check_level"
                                    style="width:250px"
                                >
                                    <Option
                                        :disabled='noManagePerm'
                                        v-for="item in levelList"
                                        :key="item.id"
                                        :value="item.id"
                                    >
                                        {{ item.name }}
                                    </Option>
                                </Select>
                                <p class="tip" style="margin-left:120px;">
                                    该等级以上分销商提现时，自动审核通过
                                </p>
                            </FormItem>
                            <FormItem
                                style="margin-bottom:0"
                                label="提现金额："
                                prop="auto_check_price"
                                :label-width="120"
                            >
                                <kdx-rr-input :disabled='noManagePerm'
                                    style="width:250px"
                                    v-model="settings.auto_check_price" number :fixed="2" :min-value="0" :max-value="9999999.99" :maxlength="10"
                                >
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                                <p class="tip" style="margin-left:120px;">
                                    申请提现金额小于该设置时，自动审核通过。
                                </p>
                            </FormItem>
                        </div>
                    </MyRadioGroup>
                </FormItem>
                <FormItem
                    :label-width="120"
                    label="提现方式："
                    prop="withdraw_type"
                >
                    <CheckboxGroup
                        v-model="settings.withdraw_type"
                        @on-change="checkAllGroupChange"
                    >
                        <Checkbox :disabled='noManagePerm' label="10">提现到商城余额</Checkbox>
                        <Checkbox :disabled='noManagePerm' label="20">提现到微信钱包</Checkbox>
                        <Checkbox :disabled='noManagePerm' label="30">手动提现到支付宝</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled='noManagePerm' @click="save">保存</Button>
            <!-- <Button class="default-long" @click="cancel">取消</Button> -->
        </template>
    </kdx-content-bar>
</template>

<script>
import MyRadioGroup from '@/components/decorate/RadioGroup'
import { mapState, mapActions } from 'vuex'
export default {
    components: {
        MyRadioGroup,
    },
    computed: {
        ...mapState('commission/settlementSettings', {
            settings: (state) => state.settings,
        }),
        noManagePerm() { //管理权限
            return !this.$getPermMap('commission.settings.settlement.manage')
        },
    },
    data() {
        return {
            calculate_type: [
                {
                    label: '商品折扣价',
                    id: '1',
                },
                {
                    label: '实际支付价',
                    id: '2',
                },
            ],
            withdraw_fee_type: [
                {
                    label: '不扣除',
                    id: '1',
                },
                {
                    label: '自定义 ',
                    id: '2',
                },
            ],
            free_fee_type: [
                {
                    label: '不免手续费',
                    id: '1',
                },
                {
                    label: '自定义免手续费区间',
                    id: '2',
                },
            ],
            settlement_day_type: [
                {
                    label: '订单完成后既可提现',
                    id: '1',
                },
                {
                    label: '自定义结算天数',
                    id: '2',
                },
            ],
            withdraw_audit: [
                {
                    label: '手动审核',
                    id: '1',
                },
                {
                    label: '自动审核',
                    id: '2',
                },
            ],
            withdraw_type: [
                {
                    label: '提现到商城余额',
                    id: '1',
                },
                {
                    label: '提现到微信钱包',
                    id: '2',
                },
                {
                    label: '手动提现到支付宝',
                    id: '3',
                },
            ],
            rules: {
                calculate_type: [{ required: true, message: '' }],
                withdraw_limit: [
                    { required: true, message: '请填写最低提现额度' },
                ],
                withdraw_fee_type: [{ required: true, message: '' }],
                withdraw_fee: [
                    { required: true, message: '请填写提现手续费' },
                ],
                free_fee_type: [{ required: true, message: '' }],
                settlement_day_type: [{ required: true, message: '' }],
                settlement_days: [
                    { required: true, message: '请填写结算天数' },
                ],
                withdraw_audit: [{ required: true, message: '' }],
                auto_check_level: [{ required: true, message: '请选择分销商等级' }],
                auto_check_price: [
                    { required: true, message: '请填写提现金额' },
                ],
                withdraw_type: [{ required: true, message: '请选择提现方式' }],
            },
            levelList: [], // 分销商等级列表
        }
    },
    created() {
        this.getSettings()
        this.getAgentGradeList()
    },
    methods: {
        ...mapActions('commission/settlementSettings', [
            'getSettings',
            'editSettings',
        ]),
        save() {
            this.$refs['form'].validate().then((valid) => {
                if (valid) {
                    this.editSettings().then((res) => {
                        if (res.error == 0) {
                            this.$Message.success('修改成功')
                        }
                    })
                }
            })
        },
        // 获取分销商等级列表
        getAgentGradeList() {
            this.$api.commissionApi.getAgentGradeAllList().then((res) => {
                if (res.error === 0) {
                    this.levelList = [...res.list]
                }
            })
        },
        cancel() {
            this.$router.go(-1)
        },
        checkAllGroupChange() {
            console.log(this.settings.withdraw_type, 'withdraw_type')
        },
        // 跳转维权设置
        jumpSafeguard() {
            this.$utils.openNewWindowPage('/setting/safeguard/index')
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/components/common.scss';
.settle-setting {
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    .page-container {
        background: #fff;
        padding: 40px 40px 0;
        margin: 0 auto;
    }
    /deep/ .add-img-img {
        width: 100px;
        height: 100px;
        .img-img-box,
        img {
            width: 100px;
            height: 100px;
        }
    }
    .withdraw_limit {
        /deep/ .content {
            padding: 0 !important;
        }
    }
    .inner-box {
        /deep/ .ivu-form-item .ivu-form-item-content .ivu-form-item-error-tip {
            padding-left: 120px;
        }
        &.settlement_day {
            /deep/
                .ivu-form-item
                .ivu-form-item-content
                .ivu-form-item-error-tip {
                padding-left: 150px;
            }
        }
    }
    .bold {
        font-weight: bold;
    }
}
</style>
