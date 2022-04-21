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
        <div class="payment-LCE">
            <kdx-form-title>支付证书验证</kdx-form-title>
            <Form ref="form" :label-width="165" :model="paymentData" :rules="rule">
                <Alert>
                    <div class="tip">
                        <p>【重要】微信支付计划更换服务器证书，请开发人员验证以免影响交易 ! 详见 <a class="brand-color bold" target="_blank" href="https://pay.weixin.qq.com/index.php/public/cms/content_detail?platformType=0&lang=zh&id=56602">【微信商户平台公告】</a></p>
                        <p> <span class="danger-color">注意：</span> 此根证书是服务器证书 , 并非微信支付API证书 , 此处只需要验证服务器证书 , 不需要更换API证书</p>
                        <p> <span class="danger-color">提示：</span> 如果验证证书失败 , 按指引进行自行安装证书! 方法见 <a class="brand-color bold" target="_blank" href="https://pay.weixin.qq.com/wiki/doc/api/micropay.php?chapter=23_4">【微信支付HTTPS服务器证书验证指引】</a></p>
                    </div>
                </Alert>
                <FormItem label="微信商户号(Mch_Id)：" prop="wx">
                    <Input class="width-250" v-model="paymentData.wx"></Input>
                </FormItem>
                <FormItem label="支付秘钥(APIKEY)：" prop="key">
                    <Input class="width-250" v-model="paymentData.key"></Input>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button type="primary" :loading="submitLoading" @click="handleSave">保存</Button>
        </template>
        <slot></slot>
    </kdx-content-bar>
</template>

<script>
    export default {
        components: {},
        props: {},
        data() {
            return {
                submitLoading: false,
                paymentData: {},
                rule: {
                    wx: [
                        {required: true, message: '请填写微信商户号', trigger: 'blur'},
                    ],
                    key: [
                        {required: true, message: '请填写支付秘钥', trigger: 'blur'},
                    ]
                }
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            // 表单验证
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            resolve(valid);
                        } else {
                            reject();
                        }
                    });
                });
            },
            handleSave() {
                this.submitLoading = true;
                this.customForm(this.paymentData);
            },
            async customForm(data) {
                try {
                    await this.validateForm();
                    this.submit(data);
                } catch (e) {
                    this.submitLoading = false;
                }
            },
            submit(data) {
                console.log(data);
                this.submitLoading = false;
            }
        },
    }
</script>

<style lang="scss">
    .payment-LCE {
        padding: 40px;
        background:#fff;height: 100%;
        margin: 20px auto 0;
        .ivu-alert {
            max-width: 100%;
            margin-bottom: 40px;
        }
        .tip {
            color: #B8B9BD;
            @include font-12-24;
        }
    }
</style>
