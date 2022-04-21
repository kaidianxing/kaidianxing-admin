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
        <div class="content">
            <Form ref="form" :model="model" :rules="rules" :label-width="165">
                <kdx-form-title>基础设置</kdx-form-title>
                <FormItem class="r-form-item-checkbox" label="未付款订单关闭时间：" prop="close_type">
                    <RadioGroup v-model="model.close_type">
                        <Radio :label="0" :disabled="noManagePerm">默认系统</Radio>
                        <Radio :label="1" :disabled="noManagePerm">自定义</Radio>
                    </RadioGroup>
                    <kdx-hint-text v-if="model.close_type === 0">
                        <span>用户下单后未付款订单自动关闭时间读取商城系统设置时间，如需查看或修改请点击</span>
                        <Button class="marginL-10" type="text" to="/setting/business/index" target="_blank">立即前往</Button>
                    </kdx-hint-text>
                    <div class="bg-color" v-if="model.close_type ===  1">
                        <FormItem label="未付款订单" prop="close_time">
                            <kdx-rr-input class="width-200" type="text" v-model="model.close_time" number :fixed="0" :min-value="20" :max-value="1440" placeholder="请输入">
                                <span slot="append">分钟</span>
                            </kdx-rr-input>
                        </FormItem>
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :loading="submitLoading" :disabled="noManagePerm" @click="handleSave">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    export default {
        name: "index",
        components: {},
        props: {},
        data() {
            return {
                submitLoading: false,
                model: {
                    close_type: 0,
                    close_time: ''
                },
                rules: {
                    close_type: [
                        { required: true, message: '未付款订单关闭时间必选' }
                    ],
                    close_time: [
                        { required: true, message: '未付款订单关闭时间必填' }
                    ],
                }
            }
        },
        computed: {
            noManagePerm() {
                return !this.$getPermMap('virtualAccount.setting.manage')
            }
        },
        created() {
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.$api.virtualAccountApi.getVirtualSet({}).then(res => {
                    if (res.error === 0) {
                        this.model = {
                            close_type: +res.data.close_type,
                            close_time: res.data?.close_time ? res.data?.close_time:''
                        }
                    }
                })
            },
            handleSave() {
                this.submitLoading = true;
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.submit()
                    } else {
                        this.submitLoading = false;
                    }
                })
            },
            submit() {
                this.$api.virtualAccountApi.setVirtualSet({...this.model}).then(res => {
                    if (res.error == 0) {
                        this.getData();
                        this.$Message.success('保存成功')
                    }
                    this.submitLoading = false;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        background-color: #fff;
        padding: 40px;
        min-height: 100%;
        margin: 0 auto 0;
        border-radius: 2px;
        .bg-color {
            margin-top: 10px;
            padding: 30px 0;
            background-color: #F4F6F8;
            /deep/ .ivu-form-item {
                &:last-child {
                    margin-bottom: 0;
                }
                .ivu-form-item-content {
                    .ivu-form-item-error-tip {
                        margin-left: 165px;
                    }
                }
            }
        }
    }
</style>
