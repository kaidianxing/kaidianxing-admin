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
                        :disabled='!haveJurisdiction.manage'
                        v-model="model.appid"
                        placeholder="请输入小程序APPID"
                        class="width-430"
                    />
                </FormItem> 
                <FormItem label="小程序APP Secret：" prop="app_secret">
                    <i-input
                        :disabled='!haveJurisdiction.manage'
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

            <div class="form-box" v-if="module === 'home' && type === 'wx'">
                <kdx-form-title style="margin-bottom:10px;">
                    跳转小程序名单
                </kdx-form-title>
                <kdx-hint-alert>
                    添加您当前小程序站点需要跳转的小程序AppID信息，可在装修中进行配置跳转小程序。
                    <Button type="text" to="/shop/list/system" target="_blank">
                        前往装修配置
                    </Button>
                </kdx-hint-alert>
                <FormItem label="小程序名单：">
                    <app-table
                        ref="appTable"
                        :list="setting.navigate_appid_list"
                        v-model="model.navigate_appid_list"
                    ></app-table>
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
                        <Radio :disabled='!haveJurisdiction.manage' label="1">开启</Radio>
                        <Radio :disabled='!haveJurisdiction.manage' label="0">关闭</Radio>
                    </RadioGroup>
                    <div class="form-bg" v-show="model.maintain === '1'">
                        <i-input
                         :disabled='!haveJurisdiction.manage'
                            class="width-430 limit-input"
                            placeholder="请输入维护说明"
                            type="textarea"
                            maxlength="100"
                            show-word-limit
                            v-model="model.maintain_explain"
                        />
                    </div>
                </FormItem>
                <FormItem v-if="module === 'home'">
                    <Button
                        class="default-primary"
                        @click="downloadWXapp">
                        下载小程序源码
                    </Button>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
import AppTable from './AppTable'
export default {
    props: {
        module: {
            type: String,
            default: '',
        },
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
    },
    computed: {
        haveJurisdiction() {
            return {
                view:true,
                manage:true,
            }
        },
    },
    components: {
        AppTable,
    },
    data() {
        return {
            model: {
                appid: '',
                app_secret: '',
                // pay_merchant_id: '', // tt 支付商户号
                // pay_appid: '', // tt 支付appid
                // pay_app_secret: '', // tt 支付secret
                maintain: '0',
                maintain_explain: '', // 维护说明
                navigate_appid_list: [],
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
            loading: false,
        }
    },
    methods: {
        // 表单校验
        validate() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let params = { ...this.model }
                    if (this.type == 'wx' && this.module === 'home') {
                        let res = this.$refs.appTable.validate()
                        if (res) {
                            params.navigate_appid_list = res
                        } else {
                            this.$Message.error('请填写小程序名单信息')
                            return
                        }
                    }
                    this.loading = true
                    this.$emit('on-save', params)
                }
            })
        },
        // 下载小程序源码
        downloadWXapp() {
            window.open('https://gitee.com/kaidianxing/kaidianxing-mobile')
        }
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
