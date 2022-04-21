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
        <div class="credit-statistics">
            <div class="market-overview-box">
                <data-card :tmp-list="headerCard.tempList" :data="headerCard.data"></data-card>
            </div>
        </div>
        <div class="credit">
            <kdx-form-title>积分设置</kdx-form-title>
            <Form
                ref="form"
                :model="model"
                :label-width="140"
                :rules="rules"
                @submit.native.prevent
                hide-required-mark
            >
                <!-- 积分上限 -->
                <FormItem label="积分上限：">
                    <RadioGroup v-model="model.credit_limit_type">
                        <Radio :disabled="noManagePerm" label="1">
                            <span>不限制</span>
                        </Radio>
                        <Radio :disabled="noManagePerm" label="2">
                            <span>自定义</span>
                        </Radio>
                    </RadioGroup>
                    <div
                        class="fee-main"
                        v-if="model.credit_limit_type==2"
                    >
                        <div class="flex flex-column">
                            <div class="flex">
                                <span style="padding-right: 5px">最多可获得</span>
                                <div class="number-input width-200 patch-input">
                                    <FormItem
                                        class="flex"
                                        prop="credit_limit"
                                    >
                                        <kdx-rr-input :disabled='noManagePerm'
                                            v-model="model.credit_limit"
                                            number
                                            :minValue="0"
                                            :maxValue="9999999"
                                            :fixed="0"
                                        >
                                            <span slot="append">积分</span>
                                        </kdx-rr-input>
                                    </FormItem>
                                </div>
                            </div>
                            <kdx-hint-text class="input-hint">会员积分大于等于此值时将无法继续增加，后台手动充值不限制，已持有积分不限制</kdx-hint-text>
                        </div>
                    </div>
                </FormItem>
                <!-- 积分换算比例 -->
                <div class="marginB-30">
                    <div class="flex exchange">
                        <FormItem label="积分换算比例：" prop="basic_credit_num">
                            <kdx-rr-input
                                    class="width-160"
                                    v-model="model.basic_credit_num"
                                    :disabled="noManagePerm"
                                    :fixed="0"
                                    :maxValue='9999999'
                                    :minValue='0'
                                    number
                            >
                                <span slot='append'>积分</span>
                            </kdx-rr-input>
                        </FormItem>
                        <span class="operator marginL-10 marginR-10"> = </span>
                        <FormItem :label-width="0" prop="credit_num">
                            <kdx-rr-input
                                    class="width-160 price"
                                    v-model='model.credit_num'
                                    :disabled='noManagePerm'
                                    :fixed='2'
                                    :maxValue='9999999.99'
                                    :minValue='0'
                                    number
                            >
                                <span slot='append'>元</span>
                            </kdx-rr-input>
                        </FormItem>
                    </div>
                    <kdx-hint-text class="marginL-140">变更设置项不影响已经产生的订单</kdx-hint-text>
                </div>
                <!-- 消费得积分 -->
                <FormItem label="消费得积分：" >
                    <RadioGroup v-model="model.give_credit_status">
                        <Radio :disabled="noManagePerm" label="1">
                            <span>开启</span>
                        </Radio>
                        <Radio :disabled="noManagePerm" label="0">
                            <span>关闭</span>
                        </Radio>
                    </RadioGroup>
                    <div class="fee-main" v-if="model.give_credit_status === '1'">
                        <!-- 结算方式 -->
                        <FormItem label="结算方式：" :label-width="120" class="fee-label">
                            <RadioGroup v-model="model.give_credit_type" vertical>
                                <Radio class="marginB-20" label="0" :disabled="noManagePerm">
                                    <FormItem class="form-item limit" prop="give_credit_scale" ref="scale">
                                        <div class="flex">
                                            <span>按每笔订单实付金额的</span>
                                            <kdx-rr-input placeholder="请输入" class="width-110" v-model="model.give_credit_scale" number
                                                    :disabled="noManagePerm" :fixed="2" :max-value="100" :min-value="0.01">
                                                <span slot="append">%</span>
                                            </kdx-rr-input>
                                        </div>
                                    </FormItem>
                                </Radio>
                                <Radio label="1" :disabled="noManagePerm">
                                    <span>按商品</span>
                                </Radio>
                                <kdx-hint-text class="input-hint">需要在【商品编辑-营销】中对单个商品设置独立的赠送积分规则，未设置的商品不赠送积分</kdx-hint-text>
                            </RadioGroup>
                        </FormItem>
                        <FormItem class="form-item last-item fee-label" label="结算时间：" :label-width="120" prop="give_credit_settle_day">
                            <div class="flex">
                                <span>订单完成后</span>
                                <kdx-rr-input placeholder="请输入" class="width-110" v-model="model.give_credit_settle_day" number
                                        :disabled="noManagePerm" :fixed="0" :min-value="0" :max-value="30">
                                    <span slot="append">天</span>
                                </kdx-rr-input>
                            </div>
                            <kdx-hint-text class="input-hint hint-left">积分发放时间必须在0-30天之间；如果订单完成后产生售后维权，已赠送的积分不支持回收</kdx-hint-text>
                        </FormItem>
                    </div>
                </FormItem>
                <!-- 积分抵扣 -->
                <FormItem label="积分抵扣：" class="r-form-item-checkbox">
                    <RadioGroup v-model="model.credit_state">
                        <Radio :disabled='noManagePerm' label="1">开启</Radio>
                        <Radio :disabled='noManagePerm' label="0">关闭</Radio>
                    </RadioGroup>
                    <kdx-hint-alert v-show="model.credit_state === '1'" show-icon class="alert">
                        积分抵扣开启，在商品中的营销单独设置更多抵扣数量
                    </kdx-hint-alert>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button
                :disabled="noManagePerm"
                class="primary-long"
                @click="handleSubmit"
            >保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import DataCard from "@/components/DataCard";

export default {
    name: "index",
    components: { DataCard },
    data() {
        const validatePercent  = (filed, val, callback) => {
            if (this.model.give_credit_status === '1' && this.model.give_credit_type === '0' ) {
                if (this.model.give_credit_scale == '') {
                    callback(new Error('结算比例必填'));
                } else {
                    callback();
                }
            } else {
                // this.$refs.scale.validateState = '';
                callback();
            }
        }
        return {
            headerCard: {
                tempList: [
                    {
                        key: 'total_send',
                        image: require('@/assets/image/data/data-credit.png'),
                        title: '累计发放积分'
                    },
                    {
                        key: 'total_member',
                        image: require('@/assets/image/data/data-surplus.png'),
                        title: '会员账户剩余积分'
                    },
                    {
                        key: 'total_use',
                        image: require('@/assets/image/data/data-consume.png'),
                        title: '会员累计消耗积分'
                    }
                ],
                data: {}
            },
            model: {
                credit_limit_type: "2",         // 积分上限状态：1 不限制; 2 自定义
                credit_limit: "1",              // 积分上限值
                basic_credit_num: '100',        // 积分抵扣比例（积分）
                credit_num: '1.00',             // 积分抵扣比例（元）
                give_credit_status: "1",        // 消费得积分开关：1 开启; 0 关闭
                give_credit_type: "1",          // 结算方式：0 比例; 1 商品
                give_credit_scale: '0.01',      // 结算方式中的比例
                give_credit_settle_day: '7',    // 结算时间
                credit_state: "0",              // 积分抵扣开关：1 开启; 0 关闭
            },
            rules: {
                credit_limit: [{ required: true, message: '积分上限必填' }],
                give_credit_scale: [{ validator: validatePercent }],
                basic_credit_num: [{ required: true, message: '积分必填' }],
                credit_num: [{ required: true, message: '金额必填' }],
                give_credit_settle_day: [{ required: true, message: '时间必填' }]
            }
        };
    },
    mounted() {
        this.getStatistics();
        this.getSetting();
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap('sysset.credit.manage');
        },
    },
    methods: {
        // 自定义名称
        inputCredit(e) {
            // 失去焦点处理
            if (e.target.value.trim() === '') {
                this.model.credit_txet = '积分'
            }
        },
        // 保存
        handleSubmit() {
            this.$refs.form.validate(vaild => {
                if (vaild) {
                    this.editSetting();
                }
            })
        },
        getSetting() {
            this.$api.settingApi.getCreditSetting().then(res => {
                this.model = res
            })
        },
        editSetting() {
            let params = this.model;
            if (params.credit_limit_type === '1') {
                params.credit_limit = ''
            }
            this.$api.settingApi.editCreditSetting({...params}).then(res => {
                if (res.error !== 0) return;
                this.$Message.success('保存成功！');
                this.getSetting();
            })
        },
        // 获取头部数据
        getStatistics() {
            this.$api.settingApi.getCreditStatistics().then(res => {
                this.headerCard.data = res.data;
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .credit-statistics {
        margin-top: 20px;
        margin-bottom: 10px;
        .market-overview-box {
            padding: 30px 40px;
            border-radius: 2px;
            background-color: #ffffff;
            /deep/.data-card ul {
                justify-content: space-between;
                padding: 0 5px;
                li {
                    width: 33%;
                    padding: 10px 5px;
                }
            }
        }
    }
    
    .credit {
        padding: 40px;
        background: #fff;
        min-height: 100%;
    }
    .fee-main {
        display: flex;
        flex-direction: column;
        padding: 30px 20px 30px;
        margin-top: 10px;
        background-color: #f4f6f8;
        border-radius: 2px;
    }
    .patch-input {
        /deep/ .ivu-form-item {
            margin-bottom: 0;
        }
        /deep/ .ivu-form-item-error-tip {
            left: 100%;
            width: 300px;
            top: 50%;
            margin-left: 10px;
            transform: translateY(-50%);
        }
    }
    .input-hint {   // 灰色tips 距离上方的距离
        padding-top: 10px;
    }
    .hint-left {    // 灰色 tips 距离左侧的距离，等于 label-width 的值
        padding-left: 120px;
    }
    .form-item {
        display: inline-block;  
        /deep/ .ivu-input-wrapper {
            margin-left: 10px;  // 输入框和左文本的间距
        }
    }
    .clearing {
        display: flex;
        flex-direction: column;
    }
    // label 对齐
    .fee-label /deep/.ivu-form-item-label{
        padding-top: 6px;
    }
    // 抵扣
    .form-item-bg-box {
        padding: 30px 20px;
        margin-top: 10px;
        background-color: $background-color;
        
    }
    /deep/ .hint-alert-component {
        margin-top: 10px;
        .ivu-btn {
            font-size: 12px;
            font-weight: bold;
            vertical-align: initial;
        }
    }
    .last-item {
        margin-bottom: 0;
        /deep/ .ivu-form-item-error-tip {
            position: absolute;
            left: 330px;
            top: 5px;
        }
    }
    .marginB-30 {
        margin-bottom: 30px;
            // position: relative;
        .exchange {
            /deep/.ivu-form-item {
                margin-bottom: 0;
            }
        }
    }
    .marginL-140 {
            margin-left: 140px;
            margin-top: 7px;
        }
    .operator {
        line-height: 32px;
        font-size: 16px;
    }
</style>
