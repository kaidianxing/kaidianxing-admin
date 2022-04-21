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
    <Form :label-width="120" ref="form" :model="model" :rules="rules">
        <div class="card-content"  v-if="name !== 'H5' && name !== 'byte_dance'">
            <kdx-form-title>微信支付</kdx-form-title>
            <kdx-hint-alert class="alert" :show-icon="false">
                如果是微信用户，授权目录与“支付选项”中的说明不同，应在 微信商户后台->微信支付->公众号支付 追加一条支付授权目录：{{ white_host || '-' }}
                <br />特约商户一般没有申请订单或者充值余额退款权限，需要
                <Button type="text" @click="skipWx">【点击跳转】</Button>在这里申请一下
            </kdx-hint-alert>
            <FormItem label="微信支付:" prop="wechat.enable">
                <RadioGroup v-model="model.wechat.enable">
                    <Radio :disabled='noManagePerm' label="1">
                        <span>开启</span>
                    </Radio>
                    <Radio :disabled='noManagePerm' label="0">
                        <span>关闭</span>
                    </Radio>
                </RadioGroup>
                <div class="pay-detail" v-if="model.wechat.enable === '1'">
                    <FormItem label="微信支付:" prop="wechat.id">
                        <Select v-model="model.wechat.id" class="width-430" placeholder="请选择">
                            <Option
                                v-for="wechat in wechatTemp"
                                :key="wechat.id"
                                :label="wechat.title"
                                :value="wechat.id"
                            ></Option>
                        </Select>
                    </FormItem>
                    <div class="right">
                        <Button class="refresh" type="text" @click="handleRefresh('wechat_template')">刷新</Button>
                        <Button class="create" type="text" to="/setting/paymentSettings/mould/addMoulde?type=1" target="_blank">创建支付模板</Button>
                    </div>
                </div>
            </FormItem>
        </div>
        <div class="card-content" v-if="name !== 'wxapp' && name !== 'byte_dance'">
            <kdx-form-title>支付宝支付</kdx-form-title>
            <kdx-hint-alert class="alert" :show-icon="false">
                <!-- bug 22808 -->
                <!-- 在开启支付宝支付方式前，请到
                <Button :disabled='noManagePerm' type="text" @click="skipSet">【支付选项】</Button>去设置好参数。（微信中支付宝支付也属于WAP支付）
                 <br /> -->
               新版支付宝请到
                <Button :disabled='noManagePerm' type="text" @click="skipManage">【支付模板管理】</Button>页面添加模板
            </kdx-hint-alert>
            <FormItem label="支付宝支付:">
                <RadioGroup v-model="model.alipay.enable">
                    <Radio :disabled='noManagePerm' label="1">
                        <span>开启</span>
                    </Radio>
                    <Radio :disabled='noManagePerm' label="0">
                        <span>关闭</span>
                    </Radio>
                </RadioGroup>
                <div class="pay-detail" v-if="model.alipay.enable === '1'">
                    <FormItem label="新版支付宝：" prop="alipay.id">
                        <Select v-model="model.alipay.id" class="width-430" placeholder="请选择">
                            <Option
                                v-for="alipay in alipayTemp"
                                :key="alipay.id"
                                :label="alipay.title"
                                :value="alipay.id"
                            ></Option>
                        </Select>
                    </FormItem>
                    <div class="right">
                        <Button class="refresh" type="text" @click="handleRefresh('alipay_template')">刷新</Button>
                        <Button class="create" type="text" to="/setting/paymentSettings/mould/addMoulde?type=2" target="_blank">创建支付模板</Button>
                    </div>
                </div>
            </FormItem>
        </div>
        <div class="card-content" v-if="name !== 'byte_dance'">
            <kdx-form-title>余额支付</kdx-form-title>
            <kdx-hint-alert class="alert" :show-icon="false">开启后，粉丝可以用账户余额去商城消费.</kdx-hint-alert>
            <FormItem label="余额支付:"  prop="balance.enable">
                <RadioGroup v-model="model.balance.enable">
                    <Radio :disabled='noManagePerm' label="1">
                        <span>开启</span>
                    </Radio>
                    <Radio :disabled='noManagePerm' label="0">
                        <span>关闭</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
        </div>
        <!-- 字节跳动小程序不支持货到付款 -->
        <div class="card-content" v-if="name !== 'byte_dance'">
            <kdx-form-title>货到付款</kdx-form-title>
            <kdx-hint-alert class="alert" :show-icon="false">如果需支持货到付款，也需要将商品设置成货到付款.</kdx-hint-alert>
            <FormItem label="货到付款:">
                <RadioGroup v-model="model.delivery.enable">
                    <Radio :disabled='noManagePerm' label="1">
                        <span>开启</span>
                    </Radio>
                    <Radio :disabled='noManagePerm' label="0">
                        <span>关闭</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
        </div>
        <!-- 字节跳动小程序担保支付 -->
        <div class="card-content" v-if="name === 'byte_dance'">
            <kdx-form-title>字节跳动小程序担保支付</kdx-form-title>
            <kdx-hint-alert class="alert" :show-icon="false">
                抖音/头条小程序支付需要在
                <Button :disabled='noManagePerm' type="text" @click="skipTT">【字节跳动小程序】</Button>功能管理-支付版块开通担保交易，
                <br />开通担保交易后获得其“担保交易设置”版块的信息，填入下方 <kdx-hint-tooltip type="image" :image=" require('@/assets/image/example/tt_pay.png') "></kdx-hint-tooltip>
            </kdx-hint-alert>
            <FormItem label="字节担保支付:">
                <RadioGroup v-model="model.byte_dance.enable">
                    <Radio :disabled='noManagePerm' label="1">
                        <span>开启</span>
                    </Radio>
                    <Radio :disabled='noManagePerm' label="0">
                        <span>关闭</span>
                    </Radio>
                </RadioGroup>
                <div class="next-box" v-if="model.byte_dance.enable === '1'">
                    <FormItem label="字节小程序商户号：" :label-width="160" prop="byte_dance.merchant_id">
                        <Input type="text" v-model="model.byte_dance.merchant_id" placeholder="请输入" class="width-430"/>
                    </FormItem>
                    <FormItem label="SALT：" :label-width="160" prop="byte_dance.salt">
                        <Input type="text" v-model="model.byte_dance.salt" placeholder="请输入" class="width-430"/>
                    </FormItem>
                    <FormItem label="Token(令牌)：" :label-width="160" prop="byte_dance.token">
                        <Input type="text" v-model="model.byte_dance.token" placeholder="请输入" class="width-430"/>
                    </FormItem>
                </div>
            </FormItem>
        </div>
    </Form>
</template>

<script>
export default {
    name: 'wxPay',
    props: {
        setting: {
            type: Object,
            default: () => {}
        },
        wechatTemp: {
            type: Array,
            default: () => []
        },
        alipayTemp: {
            type: Array,
            default: () => []
        },
        name: {
            type: String,
            default: ''
        },
        white_host: {
            type: String,
            default: ''
        },
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('sysset.pay-type_set.manage')
        },
    },
    data() {
        return {
            rules: {
                'alipay.id': [{ required: true, message: '请选择支付宝模板' }],
                'wechat.id': [{ required: true, message: '请选择微信模板' }],
                'byte_dance.merchant_id': [{ required: true, message: '商户号必填' }],
                'byte_dance.salt': [{ required: true, message: 'SALT必填' }],
                'byte_dance.token': [{ required: true, message: 'Token必填' }],
                'balance.enable':[]
            },
            model: {
                wechat: { enable: '0', id: '' },
                balance: { enable: '0', id: '' },
                delivery: { enable: '0', id: '' },
                alipay: { enable: '0', id: '' },
                byte_dance: { enable: '0', id: '' },
            }
        }
    },
    watch: {
        setting: {
            handler(val) {
                this.model = { ...this.model, ...val }
            },
            immediate: true
        },
    },
    mounted() {
        let {wechat,alipay} = this.model
        if(wechat.enable == '1'){
            let res = this.wechatTemp.filter(item=> item.id == wechat.id)
            if(res.length == 0) {
                wechat.id = ''
            }
        }
        if(alipay.enable == '1'){
             let res = this.alipayTemp.filter(item=> item.id == alipay.id)
            if(res.length == 0) {
                alipay.id = ''
            }
        }
    },
    methods: {
        validate() {
            let data = { ...this.model }

            if(this.name === 'wxapp') {
                data.alipay && delete data.alipay
            }

            if(this.name == 'H5') {
                data.wechat && delete data.wechat
            }

            if(this.name =='byte_dance') {
                data?.wechat && delete data.wechat
                data?.delivery && delete data.delivery
                if (data.byte_dance.enable === '0') {
                    this.$emit('submit', data)
                    return
                }
            }

            this.$refs.form.validate(valid => {
                if (valid) {
                    let keys = ['wechat', 'alipay']

                    keys.forEach(v => {
                        data[v] && data[v].enable == '0' && delete data[v].id
                    })
                    this.$emit('submit', data)
                }
            })
        },
        skipWx() {
            window.open(
                'https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F'
            )
        },
        skipSet() {
            window.open(
                `https://${location.host}/web/index.php?c=profile&a=payment&`
            )
        },
        skipTT() {
            window.open(
                `https://microapp.bytedance.com/`
            )
        },
        skipManage() {
            this.$router.push('/setting/paymentSettings/mould/list')
        },
        // 刷新
        handleRefresh(type) {
            this.$emit('on-refresh', type)
        },
    }
}
</script>

<style scoped lang="scss">
.card-content {
    margin-bottom: 60px;

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

    /deep/ .form-title {
        margin-bottom: 10px;
    }

    /deep/ .ivu-form-item {
        margin: 30px 0 0 0;

        .ivu-form-item-error-tip {
            left: 120px;
        }
    }

    .pay-detail {
        margin-top: 3px;
        overflow: hidden;
        background-color: #f4f6f8;
        border-radius: 2px;
        display: flex;
        align-items: center;
        /deep/ .ivu-form-item {
            margin-bottom: 30px;
            width: 550px;
        }
        .right {
            display: flex;
            align-items: center;
            /deep/ .ivu-btn {
                margin-left: 20px;
            }
        }
    }
    .next-box {
        margin-top: 10px;
        padding: 30px 20px;
        background-color: $background-color;
        border-radius: 2px;
        /deep/ .ivu-form-item {
            margin-bottom: 30px;
            .ivu-form-item-error-tip {
                left: 160px;
            }
        }
    }

    //   .title-content {
    //     display: flex;
    //     justify-content: space-between;
    //     align-items: center;
    //     .title {
    //       font-family: PingFang SC;
    //       font-style: normal;
    //       font-weight: bold;
    //       font-size: 16px;
    //       line-height: 22px;
    //       display: flex;
    //       align-items: center;
    //       padding-top: 20px;
    //       padding-bottom: 25px;
    //     }
    //   }
}
</style>
