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
        <div class="qiNiu">
            <kdx-form-title>七牛修复</kdx-form-title>
            <Form ref="form" :label-width="150" :model="qiNiuData" :rules="rule">
                <Alert>
                    <div class="tip">
                        <p> <span class="danger-color">【重要】</span> 此工具用于修复七牛收回临时域名后导致图片无法显示的问题</p>
                        <p><span class="danger-color">【重要】</span>请您填写原始域名和新域名的时候都要填写完带有带有http或https协议头的域名</p>
                        <p>例如:</p>
                        <p>您曾用的七牛临时域名为http://omn8drpan.bkt.clouddn.com,要转为新域名https://www.storage.com</p>
                        <p>原始域名请填写 http://omn8drpan.bkt.clouddn.com</p>
                        <p>新域名请填写 https://www.storage.com</p>
                    </div>
                </Alert>
                <FormItem label="七牛原始域名：" prop="wx">
                    <Input class="width-250" v-model="qiNiuData.wx"></Input>
                </FormItem>
                <FormItem label="七牛新域名：" prop="key">
                    <Input class="width-250" v-model="qiNiuData.key"></Input>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button type="primary" :loading="submitLoading" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    export default {
        components: {},
        props: {},
        data() {
            return {
                submitLoading: false,
                qiNiuData: {},
                rule: {
                    wx: [
                        {required: true, message: '请填写七牛原始域名', trigger: 'blur'},
                    ],
                    key: [
                        {required: true, message: '请填写七牛新域名', trigger: 'blur'},
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
                this.customForm(this.qiNiuData);
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
    .qiNiu {
        padding: 40px;
        background:#fff;height: 100%;
        margin: 20px auto 0;
        .ivu-alert {
            max-width: 100%;
            margin-bottom: 40px;
        }
        .tip {
            color: $text-first;
            @include font-12-24;
            p {
                &:nth-child(2),
                &:nth-child(1) {
                    color: $text-first;
                }
            }
        }
    }
</style>
