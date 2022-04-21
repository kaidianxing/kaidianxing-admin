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
        <div class="enter-shop">
           <!-- <kdx-form-title>七牛</kdx-form-title>-->
            <Form ref="form" :label-width="150" :model="data" :rules="rule">
                <FormItem label="七牛原始域名：" prop="wx">
                    <Input class="width-250" v-model="data.wx"></Input>
                </FormItem>
                <FormItem label="七牛新域名：" prop="key">
                    <Input class="width-250" v-model="data.key"></Input>
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
                data: {},
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
                this.customForm(this.data);
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
            }
        },
    }
</script>

<style lang="scss">
    .enter-shop {
        padding: 40px;
        .ivu-alert {
            max-width: 100%;
            margin-bottom: 40px;
        }
        .tip {
            color: #B8B9BD;
            @include font-12-16;
        }
    }
</style>
