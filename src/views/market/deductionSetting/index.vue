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
    <kdx-content-bar>
        <div class="market-deduction-setting">
            <Form
                ref="form"
                :model="model"
                :label-width="120"
                :rules="rules"
                @submit.native.prevent
            >
                <div class="market-deduction-setting-content">
                    <kdx-form-title>积分抵扣</kdx-form-title>
                    <FormItem label="积分抵扣：" class="r-form-item-checkbox">
                        <RadioGroup v-model="model.credit_state">
                            <Radio :disabled='noManagePerm' label="1">开启</Radio>
                            <Radio :disabled='noManagePerm' label="0">关闭</Radio>
                        </RadioGroup>
                        <kdx-hint-alert v-show="model.credit_state === '1'" show-icon class="alert">
                            积分抵扣开启，在商品中的营销单独设置更多抵扣数量
                        </kdx-hint-alert>
                        <div class="form-item-bg-box" v-show="model.credit_state === '1'">
                            <FormItem label="积分抵扣比例：" prop="credit_state">
                                <kdx-rr-input :disabled='noManagePerm' v-model="model.credit_num" number :maxValue="9999999.99" class="width-250" :fixed="2">
                                    <span slot="prepend">1积分抵扣</span>
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                                <!-- <kdx-hint-text>最低支持0.01元</kdx-hint-text> -->
                            </FormItem>
                        </div>
                    </FormItem>
                </div>
                <div class="market-deduction-setting-content">
                    <kdx-form-title>余额抵扣</kdx-form-title>
                    <FormItem label="余额抵扣：" class="r-form-item-checkbox">
                        <RadioGroup v-model="model.balance_state">
                            <Radio :disabled='noManagePerm' label="1">开启</Radio>
                            <Radio :disabled='noManagePerm' label="0">关闭</Radio>
                        </RadioGroup>
                        <kdx-hint-alert v-show="model.balance_state === '1'" class="alert">
                            会员可以用余额+在线支付方式支付订单，在商品中的营销单独设置更多抵扣数量
                        </kdx-hint-alert>
                    </FormItem>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    name: 'index',
    data() {
        const validator = (filed, val, callback) => {
            if (this.submitValid && val === '1') {
                if (isNaN(this.model.credit_num)) {
                    callback(new Error('请正确填写积分抵扣比例'))
                } else if (this.model.credit_num < 0.01) {
                    callback(new Error('最低支持0.01元'))
                } else if (this.model.credit_num >= Math.pow(10, 10)) {
                    callback(new Error('积分抵扣比例需小于10亿'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        return {
            model: {
                credit_state: '0',
                credit_num: 0.1,
                balance_state: '0'
            },
            submitValid: false,
            rules: {
                credit_state: [
                    {
                        required: true,
                        validator
                    }
                ]
            }
        }
    },
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('sale.basic.deduct.manage')
        },
    },
    mounted() {
        this.getData()
    },
    methods: {
        handleSave() {
            if (this.submitValid) return
            this.submitValid = true

            let data = {
                ...this.model
            }

            if (data.credit_state === '0') {
                delete data.credit_num
            }

            this.$refs.form.validate(valid => {
                this.submitValid = false
                if (valid) {
                    this.$api.marketApi.editDeduction(data).then(res => {
                        if (res.error === 0) {
                            this.getData()
                            this.$Message.success('保存成功')
                        }
                    })
                }
            })
        },
        getData() {
            this.$api.marketApi.getDeduction({}).then(res => {
                let { error, ...info } = res
                if (error === 0) {
                    this.model = { ...this.model, ...info }
                    // 更新全局配置字段
                    this.$store.commit('config/setMDeduct', {
                        credit_state: res.credit_state,
                        balance_state: res.balance_state
                    })
                }
            })
        },
        skipAddPage() {
            this.$utils.openNewWindowPage('/goods/add');
        }
    }
}
</script>

<style scoped lang="scss">
.market-deduction-setting {
    //background-color: $background-color;
    background-color: #ffffff;
    padding: 40px;
    min-height: 100%;
    margin-top: 20px;
    /deep/ .ivu-form-item {
        .ivu-form-item {
            margin-bottom: 0;
            .ivu-form-item-content {
                margin-left: 120px !important;
            }
        }
    }
    /deep/ .hint-alert-component {
        margin-top: 10px;
        .ivu-btn {
            font-size: 12px;
            font-weight: bold;
            vertical-align: initial;
        }
    }
    .form-item-bg-box {
        padding: 30px 20px;
        margin-top: 10px;
        background-color: $background-color;
    }
}
</style>
