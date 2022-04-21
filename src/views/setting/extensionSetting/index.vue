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
            <Form :label-width="120" ref="form" :model="model" :rules="rules">
                <div class="card-content">
                    <kdx-form-title>推广佣金设置</kdx-form-title>
                    <FormItem label="推广佣金提现：" prop="enable">
                        <RadioGroup v-model="model.enable">
                            <Radio :label="1" :disabled="noManagePerm">
                                <span>开启</span>
                            </Radio>
                            <Radio :label="0" :disabled="noManagePerm">
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                        <p class='tip'>是否允许用户将余额提出</p>
                    </FormItem>
                    <FormItem label="提现方式：" prop="withdraw_type">
                        <CheckboxGroup v-model="model.withdraw_type" @on-change="changeWithdrawType">
                            <Checkbox :label="20" :disabled="noManagePerm">提现到微信钱包</Checkbox>
                            <Checkbox :label="30" :disabled="noManagePerm">手动提现到支付宝</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem label="提现限制：" prop="min_withdraw_price">
                       <MyRadioGroup :items='limits' v-model="model.withdraw_limit" :disabled="noManagePerm">
                            <FormItem label="推广佣金满：" style='margin:0' v-if='model.withdraw_limit'>
                                <div style="display:flex;">
                                    <!-- <Input v-model="model.min_withdraw_price" style='width:250px;margin:0 10px 0 0'>
                                    <span slot="append">元</span>
                                    </Input> -->
                                    <kdx-rr-input
                                        placeholder="请输入"
                                        style='width:250px;margin:0 10px 0 0'
                                        number
                                        :fixed="2"
                                        :min-value="0"
                                        :max-value="9999999.99"
                                        :disabled="noManagePerm"
                                        v-model="model.min_withdraw_price"
                                    >
                                        <span slot="append">元</span>
                                    </kdx-rr-input>可提现
                                </div>
                            </FormItem>
                       </MyRadioGroup>
                    </FormItem>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button type="primary" :disabled="noManagePerm" @click="submitData">
                提交
            </Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    import MyRadioGroup from '@/components/decorate/RadioGroup.vue'
    export default {
        components: {
            MyRadioGroup
        },
        data() {
            return {
                limits: [{
                    label: '不限制',
                    id: 0
                }, {
                    label: '自定义',
                    id: 1
                }],
                rules: {
                     
                },
                model: {
                    enable: 1,
                    min_withdraw_price: 0,
                    withdraw_limit: 0,
                    withdraw_type: [20],
                }
            }
        },
        computed: {
            noManagePerm(){//无管理权限
                return !this.$getPermMap('merchant_sysset.commission.manage')
            },
        },
        mounted() {
            this.$api.settingApi.getExtentsionSettings().then(res=>{
                if(res.error==0){
                    this.model=res.settings
                }
            })
        },
        methods: {
            changeWithdrawType(val){
                console.log(val)
            },
            submitData(){
                this.$api.settingApi.saveExtentsionSettings(this.model).then(res=>{
                    if(res.error==0){
                        this.$Message.success('保存成功')
                    }
                })
            },
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
    .content {
        background-color: #ffffff;
        margin-top: 20px;
        padding: 40px;
        min-height: calc(100% - 20px);
        /deep/ .ivu-tabs-content {
            padding: 40px;
        }
         .tip {
                display: block;
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 18px;
                color: #939799;
                margin-top: 8px;
            }
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
        }
    }
</style>
