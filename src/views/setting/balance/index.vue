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
        <div class='balance'>
            <kdx-form-title>余额设置</kdx-form-title>
            <Form
                ref='form'
                :label-width='140'
                :model='model'
                :rules='rules'
                @submit.native.prevent
            >
                <FormItem
                    label='充值设置：'
                    prop='recharge_state'
                >
                    <RadioGroup v-model='model.recharge_state'>
                        <Radio
                            :disabled='noManagePerm'
                            label='1'
                        >
                            <span>开启</span>
                        </Radio>
                        <Radio
                            :disabled='noManagePerm'
                            label='0'
                        >
                            <span>关闭</span>
                        </Radio>
                    </RadioGroup>
                    <div class='fee-main' v-if='model.recharge_state ==1'>
                        <FormItem
                            class="recharge-low"
                            label='最低充值金额：'
                            label-width='120'
                            prop='recharge_money_low'
                        >
                            <div class='number-input'>
                                <div class='flex'>
                                    <kdx-rr-input
                                        class="width-160"
                                        v-model='model.recharge_money_low'
                                        :disabled='noManagePerm'
                                        :fixed='2'
                                        :maxValue='9999999.99'
                                        :minValue='0.10'
                                        number
                                    >
                                        <span slot='append'>元</span>
                                    </kdx-rr-input>
                                </div>
                            </div>
                            <kdx-hint-text class="recharge-text">账户充值时，最低允许的充值金额，系统最低可支持0.1元</kdx-hint-text>
                        </FormItem>
                    </div>
                </FormItem>
                <FormItem label="余额抵扣：" class="form-item-checkbox">
                    <RadioGroup v-model="model.balance_state">
                        <Radio :disabled='noManagePerm' label="1">开启</Radio>
                        <Radio :disabled='noManagePerm' label="0">关闭</Radio>
                    </RadioGroup>
                    <kdx-hint-alert v-show="model.balance_state === '1'" class="alert">
                        会员可以用余额+在线支付方式支付订单，在商品中的营销单独设置更多抵扣数量
                    </kdx-hint-alert>
                </FormItem>
                <FormItem label='余额提现：'>
                    <RadioGroup v-model='model.withdraw_state'>
                        <Radio
                            :disabled='noManagePerm'
                            label='1'
                        >
                            <span>开启</span>
                        </Radio>
                        <Radio
                            :disabled='noManagePerm'
                            label='0'
                        >
                            <span>关闭</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text>是否允许用户将余额提出</kdx-hint-text>
                </FormItem>
                <div v-if='model.withdraw_state == 1'>
                    <FormItem
                        label='提现方式：'
                        prop='withdraw_type'
                    >
                        <CheckboxGroup
                            :value='withdraw_types'
                            @on-change='changeWithdraw'
                        >
                            <Checkbox :disabled='noManagePerm' label='20'>提现到微信钱包</Checkbox>
                            <Checkbox :disabled='noManagePerm' label='30'>手动提现到支付宝</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem label='提现限制：'>
                        <RadioGroup v-model='model.withdraw_limit_type'>
                            <Radio
                                :disabled='noManagePerm'
                                label='1'
                            >
                                <span>不限制</span>
                            </Radio>
                            <Radio
                                :disabled='noManagePerm'
                                label='2'
                            >
                                <span>自定义</span>
                            </Radio>
                        </RadioGroup>
                        <div
                            class='fee-main'
                            v-if='model.withdraw_limit_type==2'
                        >
                            <div class='row'>
                                <span class='paddingR'>余额满</span>
                                <div class='number-input width-160'>
                                    <FormItem
                                        class="flex form-item"
                                        prop='withdraw_limit_money'
                                    >
                                        <kdx-rr-input
                                            :disabled='noManagePerm'
                                            :fixed='2'
                                            :maxValue='9999999.99'
                                            :minValue='0.1'
                                            number
                                            v-model='model.withdraw_limit_money'
                                        >
                                            <span slot='append'>元</span>
                                        </kdx-rr-input>
                                    </FormItem>
                                </div>
                                <span class='paddingL'>可提现</span>
                            </div>
                        </div>
                    </FormItem>

                    <FormItem label='提现手续费：'>
                        <RadioGroup v-model='model.withdraw_fee_type'>
                            <Radio
                                :disabled='noManagePerm'
                                label='1'
                            >
                                <span>不扣除</span>
                            </Radio>
                            <Radio
                                :disabled='noManagePerm'
                                label='2'
                            >
                                <span>自定义</span>
                            </Radio>
                        </RadioGroup>
                        <div
                            class='fee-main'
                            v-if='model.withdraw_fee_type==2'
                        >
                            <div class='row ivu-form-item-required'>
                                <span class='ivu-form-item-label paddingR'>手续费：</span>
                                <div class='number-input width-160'>
                                    <FormItem
                                        class='flex'
                                        prop='withdraw_fee'
                                    >
                                        <kdx-rr-input
                                            :disabled='noManagePerm'
                                            :fixed='1'
                                            :maxValue='99.9'
                                            :minValue='0.1'
                                            number
                                            v-model='model.withdraw_fee'
                                        >
                                            <span slot='append'>%</span>
                                        </kdx-rr-input>
                                    </FormItem>
                                </div>
                            </div>
                            <FormItem
                                class='free-item'
                                label
                            >
                                <span class='paddingR'>免手续费：</span>
                                <RadioGroup v-model='model.free_fee_type'>
                                    <Radio
                                        :disabled='noManagePerm'
                                        label='1'
                                    >
                                        <span>不免手续费</span>
                                    </Radio>
                                    <Radio
                                        :disabled='noManagePerm'
                                        label='2'
                                    >
                                        <span>自定义免手续费区间</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            <div
                                class='ml-70'
                                v-if='model.free_fee_type==2'
                            >
                                <div class='row'>
                                    <div class='number-input width-160'>
                                        <FormItem
                                            class='flex free-fee'
                                            prop='free_fee_start'
                                            ref='start'
                                        >
                                            <kdx-rr-input
                                                :disabled='noManagePerm'
                                                :fixed='2'
                                                :maxValue='9999999.99'
                                                :minValue='0'
                                                number
                                                v-model='model.free_fee_start'
                                            >
                                                <span slot='append'>元</span>
                                            </kdx-rr-input>
                                        </FormItem>
                                    </div>
                                    <span class='operator'> - </span>
                                    <div class='number-input width-160'>
                                        <FormItem
                                            class='flex free-fee'
                                            prop='free_fee_end'
                                            ref='end'
                                        >
                                            <kdx-rr-input
                                                :disabled='noManagePerm'
                                                :fixed='2'
                                                :maxValue='9999999.99'
                                                :minValue='0'
                                                number
                                                v-model='model.free_fee_end'
                                            >
                                                <span slot='append'>元</span>
                                            </kdx-rr-input>
                                        </FormItem>
                                    </div>
                                    <span class='paddingL'>时不扣除手续费</span>
                                </div>
                                <kdx-hint-text class='input-hint'>当手续费金额在此区间内时，不扣除手续费，结束金额 必须大于 开始金额。</kdx-hint-text>
                                <kdx-hint-text>例如 设置开始金额0元 结束金额5元，只有手续费金额高于5元时，才扣除</kdx-hint-text>
                            </div>
                        </div>
                    </FormItem>
                </div>
            </Form>
        </div>
        <template #btn>
            <Button
                :disabled='noManagePerm'
                class="primary-long"
                @click="handleSubmit"
            >保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
import DataCard from "@/components/DataCard";

export default {
    name: 'index',
    components: { DataCard },
    data() {
        const validator = ({ message }, val, callback) => {
            if (val === null || val === '') {
                callback(message);
            } else {
                callback();
            }
        };
        const validStart = (field, val, callback) => {
            if (val === '') {
                callback('起始金额不能为空');
                return;
            }
            let end = this.model.free_fee_end;
            if (end !== null && parseFloat(val) >= parseFloat(end)) {
                callback('起始金额必须小于结束金额');
            }

            this.$refs.end.validateState = '';

            callback();
        };
        const validEnd = (field, val, callback) => {
            if (val === '') {
                callback('结束金额不能为空');
            }
            let start = this.model.free_fee_start;
            if (start !== null && parseFloat(val) <= parseFloat(start)) {
                callback('结束金额必须大于起始金额');
            }
            this.$refs.start.validateState = '';
            callback();
        };
        return {
            headerCard: {
                tempList: [
                    {
                        key: 'total_send',
                        image: require('@/assets/image/data/data-total-money.png'),
                        title: '累计发放余额',
                        prefix: '￥'
                    },
                    {
                        key: 'total_member',
                        image: require('@/assets/image/data/data-surplus.png'),
                        title: '会员账户剩余余额',
                        prefix: '￥'
                    },
                    {
                        key: 'total_use',
                        image: require('@/assets/image/data/data-consume.png'),
                        title: '会员累计消耗余额',
                        prefix: '￥'
                    }
                ],
                data: {}
            },
            model: {
                recharge_state: '0',                // 充值设置
                recharge_give_credit: '1',          // 充值一元送 X 积分	
                recharge_money_low: '0.1',          // 最低充值金额
                withdraw_state: '1',                // 提现设置            0关闭 1开启
                withdraw_limit_type: '1',           // 提现限额设置         1不限制 2自定义
                withdraw_limit_money: '0.1',        // 最低提现金额
                withdraw_fee_type: '2',             // 提现手续费设置       1无手续费 2自定义
                withdraw_fee: null,                 // 提现手续费
                free_fee_type: '2',                 // 免手续费区间设置     1无 2自定义
                free_fee_start: null,               // 免手续费开始 // 初始值
                free_fee_end: null,                 // 免手续费结束
                balance_state: '0',                 // 余额抵扣设置
                withdraw_type: '', // 提现方式
            },
            withdraw_types: ['20', '30'],
            rules: {            // 验证规则
                recharge_money_low: [{ validator, message: '最低充值金额必填' }],
                withdraw_limit_money: [{ validator, message: '最低提现金额必填' }],
                withdraw_fee: [{ validator, message: '手续费必填' }],
                free_fee_start: [{ validator: validStart, trigger: 'blur' }],
                free_fee_end: [{ validator: validEnd, trigger: 'blur' }],
                withdraw_type: [{ validator, message: '提现方式必填' }]
            }
        };
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap('sysset.balance.manage');
        }
    },
    created() {
        this.getStatistics();
        this.getData();
    },
    methods: {
        changeWithdraw(e) {
            this.withdraw_types = e;
            this.model.withdraw_type = e.join(',');     // 返回的数组转换成字符串
        },
        handleSubmit() {
            this.$refs.form.validate().then(valid => {
                if (valid) {
                    this.handleSave();
                }
            })
        },
        handleSave() {
            let data = { ...this.model };

            if (data.withdraw_state === '0') {
                delete data.withdraw_type_card
                delete data.withdraw_limit_type
                delete data.withdraw_limit_money
                delete data.withdraw_fee_type
                delete data.withdraw_fee
                delete data.free_fee_type
                delete data.free_fee_start
                delete data.free_fee_end
            }

            if (data.recharge_state === '0') {
                delete data.recharge_give_credit
                delete data.recharge_money_low
            }

            if (data.withdraw_limit_type === '1') {
                delete data.withdraw_limit_money
            }
            if (data.withdraw_fee_type === '1') {
                delete data.withdraw_fee
                delete data.free_fee_type
                delete data.free_fee_start
                delete data.free_fee_end
            } else {
                if (data.free_fee_type === '1') {
                    delete data.free_fee_end
                    delete data.free_fee_start
                }
            }

            this.$api.settingApi.editBalanceSetting(data).then(res => {
                if (res.error == 0) {
                    this.getData();
                    this.$Message.success('保存成功');
                }
                
            })
        },
        getData() {
            this.$api.settingApi.getBalanceSetting().then(res => {
                let { error, ...info } = res

                if (error === 0) {
                    let keys = [
                        'recharge_money_low',
                        'withdraw_fee',
                        'free_fee_start',
                        'free_fee_end',
                        'withdraw_limit_money'
                    ]

                    keys.forEach(
                        key => (info[key] = this.stringToNum(info[key]))
                    )
                    this.model = {
                        ...this.model,
                        ...info
                    };
                    // 返回字符串转换成数组
                    this.withdraw_types = this.model.withdraw_type.split(',')
                }
            })
        },
        stringToNum(num) {
            if (typeof num === 'string') {
                return parseFloat(num)
            } else {
                return null
            }
        },
        // 获取头部数据
        getStatistics() {
            this.$api.settingApi.getBalanceStatistics().then(res => {
                this.headerCard.data = res.data;
            })
        }
    }
};
</script>

<style lang="scss" scoped>
// 头部卡片数据
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

.balance {
    padding: 40px;
    margin: 0 auto;
    background: #fff;
    min-height: 100%;
}
.fee-main {
    margin-top: 10px;
    padding: 30px 20px 30px;
    display: flex;
    flex-direction: column;
    border-radius: 2px;
    background-color: #f4f6f8;

    .row {
        display: flex;
        flex-direction: row;
        /*margin-bottom: 10px;*/
        .paddingL {
            padding-left: 10px;
        }
        .paddingR {
            padding-right: 5px;
        }
    }

    .ml-70 {
        // 自定义免手续费区间的缩进效果(Tab)
        margin-left: 70px;
    }
    .input-hint {
        padding-top: 30px;
    }
    .operator {
        // 价格区间连接符
        margin: 0 10px;
    }
    .free-item,
    .form-item,
    .free-fee {
        // 解决form下方多出30px问题
        margin-bottom: 0;
    }
    
}
/deep/ .hint-alert-component {
    margin-top: 10px;
    .ivu-btn {
        font-size: 12px;
        font-weight: bold;
        vertical-align: initial;
    }
}

// 最低充值金额
.recharge-low {
    margin-bottom: 0;
    .recharge-text, /deep/.ivu-form-item-error-tip {
        margin-left: 120px;
    }
}
    
</style>
