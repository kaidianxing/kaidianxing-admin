/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <kdx-content-bar v-loading="loading">
        <kdx-hint-alert>
            <div>积分商城商品不参与会员折扣、分销、积分抵扣，支持商品余额抵扣；积分商城订单不支持叠加营销的优惠券、满额立减、满额包邮</div>
        </kdx-hint-alert>
        <div class="settings">
            <Form ref="form" :model="model" :rules="rules" :label-width="120">
                <div class="settings-item">
                    <kdx-form-title>基础设置</kdx-form-title>
                    <FormItem label="积分商城：" prop="status">
                        <RadioGroup v-model="model.status">
                            <Radio label="1" :disabled="noManagePerm">开启</Radio>
                            <Radio label="0" :disabled="noManagePerm">关闭</Radio>
                        </RadioGroup>
                        <kdx-hint-text class="text">开启后用户端可通过装修的积分商城首页或积分商品访问并下单 <span class="jump-decoration" @click="jumpDecorate">立即装修</span></kdx-hint-text>
                    </FormItem>
                    
                    <FormItem label="售后维权：" prop="refund_type">
                        <RadioGroup v-model="model.refund_type">
                            <Radio label="0" :disabled="noManagePerm">读取系统设置</Radio>
                            <Radio label="1" :disabled="noManagePerm">自定义售后规则</Radio>
                        </RadioGroup>
                        <!-- 系统售后设置 -->
                        <div v-if="model.refund_type==='0'">
                            <kdx-hint-text class="text">读取系统【设置-维权设置】内容</kdx-hint-text>
                        </div>
                        <kdx-hint-alert style="margin:10px 0">
                            <div>
                                积分商品订单的售后维权仅支持整单全金额售后，不支持修改退款金额
                            </div>
                        </kdx-hint-alert>
                        <!-- 自定义售后规则 -->
                        <div class="payment-setting-main" v-if="model.refund_type==='1'">
                            <FormItem label="已完成订单：" class="number-input no-width" prop="finish_order_refund_type">
                                <RadioGroup v-model="model.finish_order_refund_type" vertical>
                                    <Radio label="0" :disabled="noManagePerm">不允许售后</Radio>
                                    <Radio label="1" class="radio-flex mt-15" :disabled="noManagePerm">
                                        <FormItem class="flex margin refund_rule" prop="finish_order_refund_days">
                                            <div class="flex">
                                                <span class="marginR-10">订单完成后</span>
                                                <kdx-rr-input
                                                    class="width-160"
                                                    v-model="model.finish_order_refund_days"
                                                    :minValue="0"
                                                    :maxValue="30"
                                                    :fixed="0"
                                                    number
                                                    :disabled="noManagePerm"
                                                >
                                                    <span slot="append">天</span>
                                                </kdx-rr-input>
                                                <span class="marginL-10">内可发起售后维权</span>
                                            </div>
                                        </FormItem>
                                    </Radio>
                                    <kdx-hint-text class="mL-20 marginT-10">售后维权时间必须在订单完成0～30天之间</kdx-hint-text>
                                </RadioGroup>
                            </FormItem>
                        </div>
                    </FormItem>
                    <!-- 退款规则 -->
                    <FormItem label="退款规则：" class="number-input no-width" prop="refund_rule">
                        <RadioGroup v-model="model.refund_rule">
                            <Radio label="0" :disabled="noManagePerm">全部退款</Radio>
                            <Radio label="1" :disabled="noManagePerm">不退积分</Radio>
                        </RadioGroup>
                    </FormItem>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button class="primary-long" :disabled="noManagePerm" @click="handleSubmit('model')">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    name: 'index',
    data() {
        const validator = ({message}, value, callback) => {
            if (value === '' || value === null) {
                callback(message);
            } else {
                callback()
            }
        };
        return {
            loading: false,
            model: {
                status: '1',
                refund_type: '1',
                finish_order_refund_type: '1',
                finish_order_refund_days: null,
                refund_rule: '1'
            },
            rules: {
                finish_order_refund_days: [{ validator, message: '允许售后天数必填' }],
            },
            
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('creditShop.setting.manage')
        },
    },
    mounted() {
        this.getSetting();
    },
    methods: {
        getSetting() {
            this.loading = true;
            this.$api.creditShopApi.getSetting({}).then(res => {
                this.loading = false;
                if (res.error !== 0) return;
                this.model = res.data;
            }).catch(() => {this.loading = false})
        },
        jumpDecorate() {
            this.$utils.openNewWindowPage("/shop/list/system");
        },
        handleSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.setSetting()
                    this.$Message.success('保存成功！');
                }
            })
        },
        setSetting() {
            let params = this.model;
            this.loading = true;
            this.$api.creditShopApi.setSetting({...params}).then(() => {
                this.loading = false;
                this.getSetting();
            }).catch(() => {this.loading = false})
        }
    }
}
</script>

<style lang="scss" scoped>
.settings {
    height: 100%;
    margin-top: 10px;
    padding: 40px 40px 0 40px;
    background-color: #ffffff;
    .mt-15 {
        margin-top: 15px;
    }
    .ml-150 {
        margin-left: 140px;
    }
    .settings-item {
        padding-bottom: 30px;
        .jump-decoration {
            color: $brand-color;
            cursor: pointer;
        }
    }
    .payment-setting-main {
        padding: 30px 20px 30px;
        margin-top: 10px;
        background-color: #F4F6F8;
        .paddingR {
            padding-right: 10px;
        }
        .paddingL {
            padding-left: 10px;
        }
        /deep/ .ivu-form-item {
            margin-bottom: 0;
        }
        
        /deep/ .hint-text {
            padding-top: 3px;
            .ivu-btn {
                font-weight: bold;
            }
            a {
                font-weight: bold;
            }
        }
        
    }
    .radio-flex {
        display: flex;
        align-items: center;
        position: relative;
        /deep/ .ivu-form-item {
            margin-bottom: 2px;
        }
        /deep/ .ivu-form-item-error-tip {
            position: absolute;
            top: 60px; left: 80px;
        }
    }
}
</style>
