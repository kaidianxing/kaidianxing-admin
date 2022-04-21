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
    <kdx-modal-frame :value="value" :width="800" title="评价奖励发放" @on-cancel="handleCancel" @on-ok="handleOk">
        <div class="reward-content">
            <kdx-hint-alert class="alert" type="error">
                <p v-if="model.is_reward == '1'">当前评价已发放奖励</p>
                <div v-else>
                    <p>每条评价仅支持发放一次评价奖励</p>
                    <p>发放后奖励立即到账，且无法撤回，请谨慎处理</p>
                </div>
            </kdx-hint-alert>
            <Form ref="form" v-if="value" :model="model" :rules="rule" :label-width="140" @submit.native.prevent>
                <FormItem label="奖励内容：" prop="rewards">
                    <CheckboxGroup v-model="model.rewards">
                        <Checkbox label="1" :disabled="noManagePerm">优惠券</Checkbox>
                        <Checkbox label="2" :disabled="noManagePerm">积分</Checkbox>
                        <Checkbox label="3" :disabled="noManagePerm">余额</Checkbox>
                        <Checkbox label="4" :disabled="noManagePerm">红包（企业打款到零钱）</Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <div class="next-box" v-if="model.rewards.length">
                    <FormItem label="优惠券选择：" prop="coupon_id" v-if="new Set(model.rewards).has('1')">
                        <Button class="default-primary" :disabled="noManagePerm" @click="showSelector">
                            {{selector.data.length === 3 ? '重新选择优惠券' : `+添加优惠券(${selector.data.length}/3)` }}
                        </Button>
                        <kdx-hint-alert style="margin-top: 10px;max-width: 610px;">
                            最多可选择3张优惠券且优惠券须是在有效期内
                        </kdx-hint-alert>
                        <div class="form-item-bg-box" v-if="selector.data.length > 0">
                            <!--优惠券列表-->
                            <div class="coupons-list">
                                <coupons-list :data="selector.data" :showStock="true" :disabled="noManagePerm" @on-delete="deleteCoupons"/>
                            </div>
                        </div>
                    </FormItem>
                    <FormItem label="积分：" prop="credit" v-if="new Set(model.rewards).has('2')">
                        <kdx-rr-input class="width-160" placeholder="积分" number :fixed="0" :maxValue="9999999"  v-model="model.credit" :disabled="noManagePerm">
                            <span slot="append">积分</span>
                        </kdx-rr-input>
                    </FormItem>
                    <FormItem label="余额：" prop="balance" v-if="new Set(model.rewards).has('3')">
                        <kdx-rr-input class="width-160" placeholder="余额" number :fixed="2" :maxValue="9999999.99" v-model="model.balance" :disabled="noManagePerm">
                            <span slot="append">元</span>
                        </kdx-rr-input>
                    </FormItem>
                    <FormItem label="单个红包金额：" prop="red_package.money" v-if="new Set(model.rewards).has('4')">
                        <kdx-rr-input class="width-160" placeholder="请输入" number :fixed="2" :minValue="0.3" :maxValue="200" v-model="model.red_package.money" :disabled="noManagePerm">
                            <span slot="append">元</span>
                        </kdx-rr-input>
                        <kdx-hint-text style="margin-top: 10px;max-width: 610px;">
                            红包金额支持0.3-200元
                        </kdx-hint-text>
                        <kdx-hint-alert style="margin-top: 10px;max-width: 610px;" :show-icon="false">
                            使用发放红包功能需要商家在微信支付商户开通企业打款到零钱功能 <br />成功领取的红包将自动打款到会员的微信零钱
                        </kdx-hint-alert>
                    </FormItem>
                    <FormItem label="红包有效时间：" prop="red_package.expiry" class="expiry"  v-if="new Set(model.rewards).has('4')">
                        <div class="flex">
                            <span>发放后</span>
                            <div>
                                <kdx-rr-input class="width-160" style="margin: 0 10px;" number :fixed="0" v-model="model.red_package.expiry" :disabled="noManagePerm"
                                          :min-value="1" :max-value="30" placeholder="请输入">
                                    <span slot="append">天</span>
                                </kdx-rr-input>
                                <kdx-hint-text class="marginL-10">设置时间必须在1-30天</kdx-hint-text>
                            </div>
                            <span>内买家首次登陆商城时弹窗提示领取，过期不提示</span>
                        </div>
                    </FormItem>
                    <FormItem label="红包祝福语：" class="noRequired" prop="red_package.blessing" v-if="new Set(model.rewards).has('4')">
                        <Input placeholder="请输入祝福语" class="width-340"
                               :class="{'input-disabled': noManagePerm}"
                               v-model="model.red_package.blessing"
                               :disabled="noManagePerm"
                               maxlength="15"
                               show-word-limit>
                        </Input>
                        <kdx-hint-tooltip
                            type="image"
                            :image="require('@/assets/image/example/groups/blessing.png')"
                        ></kdx-hint-tooltip>
                        <kdx-hint-text>根据微信支付说明，请注意敏感词处理，否则设置敏感词会被转义成字符*</kdx-hint-text>
                    </FormItem>
                </div>
            </Form>
        </div>

        <!--优惠券选择器-->
        <coupon-selector v-model="selector.value" :multiple="true" :limit="3" pick_way="4" :currentList="selector.data" @on-change="changeCouponList" @on-cancel="cancelSelector"/>

    </kdx-modal-frame>
</template>

<script>
    import CouponsList from '@/views/market/components/CouponsList'
    import CouponSelector from '@/components/selector/CouponSelector'
    export default {
        name: "SiftComment",
        components: {
            CouponsList,
            CouponSelector
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            rewardData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                selector: {
                    value: false,
                    data: [],
                },
                setData: {
                    choice_status: 1, // 精选
                    comment_reward_status: 1, // 奖励
                }, // 设置权限
                model: {
                    rewards: ['1'],
                    coupon_id: '',
                    credit: '',
                    balance: '',
                    is_reward: 0,
                    red_package: {
                        money: '',
                        expiry: '',
                        blessing: '',
                    },
                },
                rule: {
                    rewards: [{ required: true, message: '优惠奖励必选' }],
                    coupon_id: [
                        {
                            validator: (rule, value, callback) => {
                                if (this.selector.data.length == 0) {
                                    callback(new Error('优惠券必选'))
                                } else if (this.selector.data.some(item => item.surplus == 0&&item.stock_type!=0)) {
                                    callback(new Error('优惠券库存不足请重新选择'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ],
                    credit: [{ required: true, message: '积分必填' }],
                    balance: [{ required: true, message: '余额必填' }],
                    'red_package.money': [{ required: true, message: '红包金额必填' }],
                    'red_package.expiry': [{ required: true, message: '红包有效时间必填' }],
                },
            }
        },
        computed: {
            noManagePerm(){ //无管理权限
                return !this.$getPermMap('commentHelper.index.manage') || this.setData.comment_reward_status==0 || this.model.is_reward == '1'
            },
        },
        watch: {
            rewardData: {
                handler(value) {
                    if (value?.reward_content) {
                        this.model = {
                            ...value,
                            ...value.reward_content,
                            rewards: value.reward_content.rewards.split(','),
                            coupon_id: value.reward_content?.coupon_id?.join(',')||''
                        };
                        this.selector.data = value.reward_content?.coupon_info || []
                    } else {
                        this.model.id = value.id
                        this.model.member_id = value.member_id
                        this.model.is_reward = value.is_reward
                    }
                }
            }
        },
        created() {
            this.getSet()
        },
        mounted() {
        },
        methods: {
            getSet() {
                this.$api.commentHelperApi.getSetting({}).then(res => {
                    if (res.error === 0) {
                        this.setData = {
                            choice_status: +res.data.choice_status,
                            comment_reward_status: +res.data?.comment_reward_status
                        }
                    }
                })
            },
            handleCancel() {
                this.$emit('input', false);
                this.model = {
                    rewards: ['1'],
                    coupon_id: '',
                    credit: '',
                    balance: '',
                    redpacket: '',
                    red_package: {
                        money: '',
                        expiry: '',
                        blessing: '',
                    },
                }
                this.selector =  {
                    value: false,
                    data: [],
                }
            },
            handleOk() {
                // if (this.noManagePerm) {
                //     this.handleCancel();
                //     return
                // }
                this.$refs.form.validate(valid => {
                    if (valid) {
                        let params = {
                            ...this.model
                        };
                        params.rewards = params.rewards.join(',');
                        params.coupon_id = params.coupon_id.split(',');
                        delete params.coupon_info;
                        this.$emit('handleOk', params);
                        this.handleCancel();
                    }
                })
            },
            // 打开优惠券选择器
            showSelector() {
                this.selector.value = true
            },
            // 关闭优惠券选择器
            cancelSelector() {
                this.selector.value = false
            },
            // 选择优惠券
            changeCouponList(row) {
                this.selector.data = [...row]
                let coupon_id = this.selector.data.map((item) => item.id)
                this.model.coupon_id = coupon_id.join(',')
                this.cancelSelector()
            },
            // 删除优惠券列表
            deleteCoupons(index) {
                this.selector.data.splice(index, 1)
                let coupon_id = this.selector.data.map((item) => item.id)
                this.model.coupon_id = coupon_id.join(',')
            },
        },
    }
</script>

<style lang="scss" scoped>
    .reward-content {
        padding-top: 10px;
        height: 580px;
        overflow-y: auto;
        .alert {
            margin: 0 20px 30px;
        }
        .next-box {
            margin: -20px 40px 60px;
            background-color: #f4f6f8;
            padding: 30px 30px 30px 0;
            border-radius: 2px;
            font-size: 14px;
            line-height: 20px;
            color: #262b30;
            /deep/ .ivu-form-item:last-child {
                margin-bottom: 0;
            }
            /deep/ .expiry .ivu-form-item-error-tip {
                margin-left: 50px;
            }
        }
        .form-item-bg-box {
            margin-top: 10px;
            .coupons-list {
                max-width: 610px;
            }
        }
        .marginL-120 {
            margin-left: 120px;
        }
    }
</style>