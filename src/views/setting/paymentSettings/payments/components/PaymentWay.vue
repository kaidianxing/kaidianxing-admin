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
    <div style='box-sizing: border-box;width:100%;'>
        <Form ref="form" :model="model" :rules="rule" :label-width="200">
            <FormItem label="佣金打款：" prop="pay_type_commission">
                <RadioGroup v-model="model.pay_type_commission">
                    <Radio :disabled='noManagePerm' label="1">
                        <span>企业打款</span>
                    </Radio>
                    <Radio :disabled='noManagePerm' label="2">
                        <span>红包付款</span>
                    </Radio>
                </RadioGroup>
                <kdx-hint-text>一般 小额打款 可以使用微信红包 建议使用微信打款金额 超过1000</kdx-hint-text>
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
                <kdx-hint-text>一般 小额打款 可以使用微信红包 建议使用微信打款金额 超过1000</kdx-hint-text>
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
                <kdx-hint-text>如果选用 红包打款，请选择每个红包最大面值</kdx-hint-text>
                <kdx-hint-text>如果是 申请额度是500元 选择的是188元红包 将会发送两个188元红包 和一个124元 红包</kdx-hint-text>
            </FormItem>
        </Form>
    </div>
</template>

<script>
export default {
    name: 'PaymentWay',
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('sysset.pay_set.manage')
        },
    },
    data() {
        return {
            model: {
                pay_type_commission: '1',
                pay_type_withdraw: '1',
                pay_red_pack_money: '1'
            },
            rule: {
                pay_type_commission: [{ required: true }],
                pay_type_withdraw: [{ required: true }],
                pay_red_pack_money: [{ required: true }]
            }
        }
    },
    watch: {
        info: {
            handler(val) {
                this.model = { ...this.model, ...val }
            },
            immediate: true
        }
    },
    methods: {
        handleSave() {
            this.$api.settingApi.editPaySetting(this.model).then(res => {
                if (res.error === 0) {
                    this.$emit('refresh')
                    this.$Message.success('保存成功')
                }
            })
        }
    }
}
</script>

<style scoped >
</style>
