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
    <div class="channel-base-form-data" v-loading="loading">
        <Form ref="form" :model="model" :rules="rules" :label-width="160">
            <div class="form-box">
                <kdx-form-title>参数配置</kdx-form-title>
                <FormItem label="小程序APP ID：" prop="appid">
                    <i-input
                        v-model="model.appid"
                        placeholder="请输入小程序APPID"
                        class="width-430"
                    />
                </FormItem>
                <FormItem label="小程序APP Secret：" prop="app_secret">
                    <i-input
                        v-model="model.app_secret"
                        placeholder="请输入小程序APP Secret"
                        class="width-430"
                    />
                </FormItem>
                <FormItem label="支付设置：">
                    <Button
                        class="default-primary"
                        to="/setting/paymentSettings/way/index"
                        target="_blank"
                    >
                        立即前往设置
                    </Button>
                </FormItem>
            </div>
            <div class="form-box" v-if="type === 'tt'">
                <kdx-form-title>支付设置</kdx-form-title>
                <FormItem label="商户号：" prop="pay_merchant_id">
                    <i-input
                        v-model="model.pay_merchant_id"
                        placeholder="请输入支付商户号"
                        class="width-430"
                    />
                </FormItem>
                <FormItem label="App ID：" prop="pay_appid">
                    <i-input
                        v-model="model.pay_appid"
                        placeholder="请输入支付APPID"
                        class="width-430"
                    />
                </FormItem>
                <FormItem label="支付secret：" prop="pay_app_secret">
                    <i-input
                        v-model="model.pay_app_secret"
                        placeholder="请输入支付secret"
                        class="width-430"
                    />
                </FormItem>
            </div>
            <!-- <div class="form-box">
                <kdx-form-title class="sub-title">订阅消息</kdx-form-title>
                <kdx-hint-alert>本次订阅消息只能覆盖商家“自营-服饰/鞋/箱包”类目，需要商家前往
                    <a href="https://mp.weixin.qq.com/" target="_blank">微信公众号后台</a>
                    -设置-基本设置-服务类目中添加该类目，余额支付则将不能触发。
                </kdx-hint-alert>
                <FormItem label="买家支付通知：" class="r-form-item-checkbox">
                    <RadioGroup v-model="notice.order_buyer_pay" @on-change="changeNotice('order_buyer_pay')">
                        <Radio label="1">启用</Radio>
                        <Radio label="0">不启用</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="卖家发货通知：" class="r-form-item-checkbox">
                    <RadioGroup v-model="notice.order_seller_send" @on-change="changeNotice('order_seller_send')">
                        <Radio label="1">启用</Radio>
                        <Radio label="0">不启用</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="自动发货通知：" class="r-form-item-checkbox">
                    <RadioGroup v-model="notice.order_auto_send" @on-change="changeNotice('order_auto_send')">
                        <Radio label="1">启用</Radio>
                        <Radio label="0">不启用</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="买家收货通知：" class="r-form-item-checkbox">
                    <RadioGroup v-model="notice.order_buyer_receive" @on-change="changeNotice('order_buyer_receive')">
                        <Radio label="1">启用</Radio>
                        <Radio label="0">不启用</Radio>
                    </RadioGroup>
                </FormItem>
            </div>-->
            <div class="form-box" v-if="type == 'wx'">
                <kdx-form-title style="margin-bottom:10px;">跳转小程序名单</kdx-form-title>
                <kdx-hint-alert>添加您当前小程序站点需要跳转的小程序AppID信息，可在装修中进行配置跳转小程序。
                        <Button type="text"  to="/shop/list/system" target="_blank">前往装修配置</Button></kdx-hint-alert>
                <FormItem label="小程序名单：">
                    <app-table ref="appTable" :list="setting.navigate_appid_list" v-model="model.navigate_appid_list"></app-table>
                </FormItem>
            </div>
            <div class="form-box">
                <kdx-form-title>基础设置</kdx-form-title>
                <FormItem
                    label="维护小程序："
                    prop="maintain"
                    class="r-form-item-checkbox"
                >
                    <RadioGroup v-model="model.maintain">
                        <Radio label="1">开启</Radio>
                        <Radio label="0">关闭</Radio>
                    </RadioGroup>
                    <div class="form-bg" v-show="model.maintain === '1'">
                        <i-input
                            v-model="model.maintain_explain"
                            type="textarea"
                            maxlength="100"
                            show-word-limit
                            class="width-430 limit-input"
                            placeholder="请输入维护说明"
                        />
                    </div>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
import AppTable from './AppTable'
export default {
    props: {
        type: {
            type: String,
            default: 'wx',
        },
        setting: {
            type: Object,
            default: () => {
                return {}
            },
        },
        p_notice: {
            type: Object,
            default: () => {
                return {}
            },
        },
    },
    components: {
        AppTable
    },
    data() {
        return {
            model: {
                appid: '',
                app_secret: '',
                pay_merchant_id: '', // tt 支付商户号
                pay_appid: '', // tt 支付appid
                pay_app_secret: '', // tt 支付secret
                maintain: '0',
                maintain_explain: '', // 维护说明
                show_commission: '1',
                navigate_appid_list: []
            },
            rules: {
                appid: [{ required: true, message: '小程序APP ID必填' }],
                app_secret: [
                    { required: true, message: '小程序APP Secret必填' },
                ],
                pay_merchant_id: [
                    { required: true, message: '支付商户号必填' },
                ],
                pay_appid: [{ required: true, message: '支付App ID必填' }],
                pay_app_secret: [{ required: true, message: '支付secret必填' }],
            },
            notice: {
                //订阅消息
                order_buyer_pay: '1',
                order_seller_send: '1',
                order_auto_send: '1',
                order_buyer_receive: '1',
            },
            loading: false,
        }
    },
    methods: {
        // 表单校验
        validate() {
            this.$refs['form'].validate((valid) => {
                if (valid) {

                    let params = {...this.model}
                    if(this.type=='wx') {
                        let res = this.$refs.appTable.validate()
                        if(res) {
                           params.navigate_appid_list = res
                        } else {
                            this.$Message.error('请填写小程序名单信息')
                            return
                        }
                    }
                    this.loading = true
                   
                    this.$emit('save', params)
                }
            })
        },
        // 修改设置
        changeNotice(type) {
            let message = {
                order_buyer_pay: '买家支付通知',
                order_seller_send: '卖家发货通知',
                order_auto_send: '自动发货通知',
                order_buyer_receive: '买家收货通知',
            }
            this.$api.homeApi
                .setWxSetting({ type, status: this.notice[type] })
                .then((res) => {
                    if (res.error === 0) {
                        this.$Message.success(`${message[type]}状态修改成功`)
                    }
                })
        },
    },
    watch: {
        setting: {
            handler(value) {
                this.model = {
                    ...this.model,
                    ...value,
                }
            },
            deep: true,
        },
        p_notice: {
            handler(value) {
                this.notice = {
                    ...this.notice,
                    ...value,
                }
            },
            deep: true,
        },
    },
}
</script>

<style scoped lang="scss">
.channel-base-form-data {
    position: relative;

    .form-box {
        padding-bottom: 30px;

        .ivu-btn {
            border-color: $brand-color;
        }

        .sub-title {
            margin-bottom: 10px;
        }

        /deep/ .ivu-alert {
            max-width: 100%;
            width: 100%;
            margin-bottom: 30px;

            .ivu-alert-message {
                /deep/ .ivu-btn {
                    @include font-12-16;
                }
            }
        }

        .form-bg {
            background-color: $background-color;
            padding: 20px;
            margin-top: 10px;
        }
    }
}
</style>
