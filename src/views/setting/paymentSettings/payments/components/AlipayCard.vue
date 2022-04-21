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
    <div style='height: 100%;' class='alipay-card'>
        <div class="content">
            <!--  <kdx-form-title>
                    支付宝打款
                </kdx-form-title>-->
            <Form ref="form" :model="model" :label-width="220" :rules="rule">
                <FormItem label="APPID：" prop="alipay_appid">
                    <Input :disabled='noManagePerm' v-model="model.alipay_appid" class="width-340"></Input>
                    <kdx-hint-text>开放平台应用id</kdx-hint-text>
                </FormItem>
                <FormItem label="验签方式(SIGN_TYPE)：" prop="single_alipay_sign_type">
                    <RadioGroup v-model="model.single_alipay_sign_type">
                        <Radio :disabled='noManagePerm' label="1">RSA</Radio>
                        <Radio :disabled='noManagePerm' label="2">RSA2</Radio>
                    </RadioGroup>
                    <kdx-hint-text>
                        请选择正确的验证签名方式，否则支付宝支付不起作用（
                        <span style="color:red">建议使用RSA2</span>）
                    </kdx-hint-text>
                </FormItem>
                <FormItem label="支付宝公钥(PUBLIC_KEY)：" prop="single_public_key">
                    <Input :disabled='noManagePerm' type="textarea" v-model="model.single_public_key" class="width-340"></Input>
                    <kdx-hint-text>一行且不能有空格</kdx-hint-text>
                </FormItem>
                <FormItem label="应用私钥(PRIVATE_KEY)：" prop="single_private_key">
                    <Input :disabled='noManagePerm' type="textarea" v-model="model.single_private_key" class="width-340"></Input>
                    <kdx-hint-text>一行且不能有空格</kdx-hint-text>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'AlipayCard',
        props: {
            model: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            noManagePerm(){//管理权限
                return !this.$getPermMap('sysset.pay_set.manage')
            },
        },
        data() {
            return {
                rule: {
                    alipay_appid: [{
                        required: true,
                        message: '请输入APPID'
                    }],
                    single_alipay_sign_type: [{
                        required: true,
                        message: '请输入验签方式'
                    }],
                    single_public_key: [{
                        required: true,
                        message: '请输入支付宝公钥'
                    }],
                    single_private_key: [{
                        required: true,
                        message: '请输入应用私钥'
                    }]
                }
            }
        },
        methods: {
            handleSave() {
                return new Promise((resolve) => {
                    this.$refs.form.validate(valid => {
                        resolve(valid)
                    })
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .content {}
</style>
