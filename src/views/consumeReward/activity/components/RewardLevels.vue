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
    <div>
        <div class="collapse">
            <Form ref="form" :model="model" :rules="rules" :label-width="120">
                <ul>
                    <li class="collapse-item" v-for="(item, index) in model.list" :key="index">
                        <div class="header" v-if="consumeType === '1'">
                            <span class="icon iconfont"
                                  :class="{ 'icon-full-right': !item.showFlag,'icon-full-down': item.showFlag }"
                                  @click="item.showFlag = !item.showFlag"></span>
                            {{ rewardLevel(index) }}级奖励规则
                            <Button type="text" @click="handleDelete(index)" v-show="index !== 0" :disabled="type !== 'add'">删除</Button>
                        </div>
                        <div class="body" :class="{ show: item.showFlag, fullShow: consumeType === '0' }">
                            <FormItem label="奖励条件：" v-if="consumeType === '0'" class="vertical customType" :prop="`list.${index}.money`" :rules="rules.money">
                                <div class="flex">
                                    <span>累计{{ plugin == 'shoppingReward'? '消费' : '充值' }}金额满</span>
                                    <kdx-rr-input class="width-160 marginL-10" placeholder="请输入" number :fixed="2" :maxValue="9999999.99" :disabled="type !== 'add'" v-model="item.money">
                                        <span slot="append">元</span>
                                    </kdx-rr-input>
                                </div>
                            </FormItem>
                            <FormItem label="奖励条件：" class="vertical customType" :style="{marginTop: consumeType === '0'? '0' : '30px' }" v-else :prop="`list.${index}.money`" :rules="rules.money">
                                <div class="flex">
                                    <span>单次{{ plugin == 'shoppingReward'? '消费' : '充值' }}金额满</span>
                                    <kdx-rr-input class="width-160 marginL-10" placeholder="请输入" number :fixed="2"
                                              :maxValue="9999999.99" :disabled="type !== 'add'" v-model="item.money">
                                        <span slot="append">元</span>
                                    </kdx-rr-input>
                                </div>
                            </FormItem>
                            <FormItem label="奖励内容：" class="vertical" :prop="`list.${index}.reward`" :rules="rules.reward">
                                <CheckboxGroup v-model="item.reward">
                                    <Checkbox label="1" :disabled="type !== 'add'">优惠券</Checkbox>
                                    <Checkbox label="2" :disabled="type !== 'add'">积分</Checkbox>
                                    <Checkbox label="3" :disabled="type !== 'add'">余额</Checkbox>
                                    <Checkbox label="4" :disabled="type !== 'add'" v-if="plugin=='shoppingReward'">红包（企业打款到零钱）</Checkbox>
                                </CheckboxGroup>
                                <div class="next" v-if="item.reward.length">
                                    <FormItem label="优惠券选择：" :ref="`coupon_ids_${index}`" :prop="`list.${index}.coupon_ids`" :rules="rules.coupon_ids"
                                              v-if="new Set(item.reward).has('1')">
                                        <Button class="default-primary" :disabled="type !== 'add'"
                                                @click="showSelector(index)">
                                            {{
                                                item.couponSelector.data.length === 3 ? '重新选择优惠券' : `+添加优惠券(${item.couponSelector.data.length}/3)`
                                            }}
                                        </Button>
                                        <kdx-hint-alert style="margin-top: 10px;max-width: 610px;margin-left: 120px;">
                                            最多可选择3优惠券且优惠券须是在有效期内
                                        </kdx-hint-alert>
                                        <div class="form-item-bg-box" v-if="item.couponSelector.data.length > 0">
                                            <!--优惠券列表-->
                                            <div class="coupons-list">
                                                <coupons-list :data="item.couponSelector.data" :showStock="true"
                                                              :disabled="type !== 'add'" @on-delete="deleteCoupons($event, index)"/>
                                            </div>
                                        </div>
                                    </FormItem>
                                    <FormItem label="积分：" :prop="`list.${index}.credit`" :rules="rules.credit" v-if="new Set(item.reward).has('2')">
                                        <kdx-rr-input class="width-160" placeholder="积分" number :fixed="0"
                                                  :disabled="type !== 'add'" v-model="item.credit">
                                            <span slot="append">积分</span>
                                        </kdx-rr-input>
                                    </FormItem>
                                    <FormItem label="余额：" :prop="`list.${index}.balance`" :rules="rules.balance" v-if="new Set(item.reward).has('3')">
                                        <kdx-rr-input class="width-160" placeholder="余额" number :fixed="2"
                                                  :maxValue="9999999.99" :disabled="type !== 'add'"
                                                  v-model="item.balance">
                                            <span slot="append">元</span>
                                        </kdx-rr-input>
                                    </FormItem>
                                    <FormItem label="单个红包金额：" :prop="`list.${index}.red_package.money`" :rules="rules[`red_package.money`]"
                                              v-if="new Set(item.reward).has('4') && plugin=='shoppingReward'">
                                        <kdx-rr-input class="width-160" placeholder="请输入" number :fixed="2"
                                                  :minValue="0.3" :maxValue="200" :disabled="type !== 'add'"
                                                  v-model="item.red_package.money">
                                            <span slot="append">元</span>
                                        </kdx-rr-input>
                                        <kdx-hint-text style="max-width: 610px;margin-left: 120px;">
                                            红包金额支持0.3-200元
                                        </kdx-hint-text>
                                        <kdx-hint-alert style="margin-top: 10px;max-width: 610px;margin-left: 120px;"
                                                    :show-icon="false">
                                            使用发放红包功能需要商家在微信支付商户开通企业打款到零钱功能 <br/>成功领取的红包将自动打款到会员的微信零钱
                                        </kdx-hint-alert>
                                    </FormItem>
                                    <FormItem label="红包有效时间："
                                              :prop="`list.${index}.red_package.expiry`"
                                              :rules="rules[`red_package.expiry`]"
                                              v-if="new Set(item.reward).has('4') && plugin=='shoppingReward'"
                                              class="redpacketTime">
                                        <div class="flex">
                                            <span>发放后</span>
                                            <div>
                                                <kdx-rr-input class="width-160" style="margin: 0 10px;" number :fixed="0"
                                                          v-model="item.red_package.expiry"
                                                          :min-value="1" :max-value="30" placeholder="请输入"
                                                          :disabled="type !=='add'">
                                                    <span slot="append">天</span>
                                                </kdx-rr-input>
                                                <kdx-hint-text class="marginL-10">设置时间必须在1-30天</kdx-hint-text>
                                            </div>
                                            <span>内买家首次登陆商城时弹窗提示领取，过期不提示</span>
                                        </div>
                                    </FormItem>
                                    <FormItem label="红包祝福语：" class="noRequired" :prop="`list.${index}.red_package.blessing`"
                                              v-if="new Set(item.reward).has('4') && plugin=='shoppingReward'">
                                        <Input placeholder="请输入祝福语" class="width-340"
                                               :class="{'input-disabled': type !=='add'}"
                                               v-model="item.red_package.blessing"
                                               maxlength="15"
                                               show-word-limit
                                               :disabled="type !=='add'">
                                        </Input>
                                        <kdx-hint-tooltip
                                            type="image"
                                            :image="require('@/assets/image/example/groups/blessing.png')"
                                        ></kdx-hint-tooltip>
                                        <kdx-hint-text class="marginL-120">根据微信支付说明，请注意敏感词处理，否则设置敏感词会被转义成字符*</kdx-hint-text>
                                    </FormItem>
                                </div>
                            </FormItem>
                        </div>
                        <!--优惠券选择器-->
                        <coupon-selector v-model="item.couponSelector.value" :multiple="true" :limit="3" pick_way="4"
                                         :currentList="item.couponSelector.data" @on-change="changeCouponList"
                                         @on-cancel="cancelSelector"/>
                    </li>
                </ul>
            </Form>
        </div>
        <div class="addReward" v-if="model.list.length < 10 && consumeType === '1'">
            <Button
                :disabled="type !== 'add'"
                class="default-primary"
                @click="handleAdd"
            >+添加奖励规则（{{ model.list.length }} / 10）
            </Button>
        </div>
    </div>
</template>

<script>
import CouponSelector from '@/components/selector/CouponSelector'
import CouponsList from '@/views/market/components/CouponsList'

export default {
    name: "RewardLevels",
    components: {CouponSelector, CouponsList},
    props: {
        /*
        * 表示哪个插件进入
        * shoppingReward 消费奖励有红包奖励项
        * rechargeReward 充值奖励无红包奖励项
        * */
        plugin: {
            type: String
        },
        /*
        * 进入页面类型
        * 判断是否置灰 add不置灰
        * view、edit置灰
        * */
        type: {
            type: String
        },
        // 消费类型 0累计 1单次
        consumeType: {
            type: [String, Number]
        },
        // 奖励数据
        award: {
            type: Array,
            default: () => []
        },
    },
    watch: {
        award: {
            immediate: true,
            deep: true,
            handler(val) {
                this.model.list = val;
                this.updateData()
            }
        },
    },
    data() {
        return {
            levelIndex: '', //优惠券触发位置
            rewardList: [],
            model: {
                list: []
            },
            list: [],
            item: {},
            rules: {
                money: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            let index = rule.field.split('.')[1];
                            if (!value) {
                                callback(new Error(`奖励条件必填`));
                            } else {
                                if (index >0) {
                                    let prevNum = this.model.list[index-1].money,
                                        nextNum = this.model.list?.[index+1]?.money;
                                    if (prevNum && prevNum*100 >= value*100) {
                                        callback(`奖励条件必须递增`);
                                    } else if (nextNum && nextNum*100 <= value*100) {
                                        callback(`奖励条件必须递增`);
                                    }
                                }
                                callback();
                            }
                        }
                    }
                ],
                reward: [{ required: true, message: '奖励必选' }],
                coupon_ids: [{ required: true, message: '优惠券必选'}],
                credit: [{ required: true, message: '积分必填' }],
                balance: [{ required: true, message: '余额必填' }],
                'red_package.money': [{ required: true, message: '单个红包金额必填' }],
                'red_package.expiry': [{ required: true, message: '红包有效时间必填' }],
            },
        }
    },
    methods: {
        // 打开优惠券选择器
        showSelector(index) {
            this.levelIndex = index;
            this.model.list[this.levelIndex].couponSelector.value = true
        },
        // 关闭优惠券选择器
        cancelSelector() {
            this.model.list[this.levelIndex].couponSelector.value = false
        },
        // 选择优惠券
        changeCouponList(row) {
            this.model.list[this.levelIndex].couponSelector.data = [...row];
            let coupon_ids = this.model.list[this.levelIndex].couponSelector.data.map((item) => item.id);
            this.model.list[this.levelIndex].coupon_ids = coupon_ids.join(',');
            this.$refs[`coupon_ids_${this.levelIndex}`].validateState = '';
            this.cancelSelector()
        },
        // 删除优惠券列表
        deleteCoupons(e, index) {
            this.model.list[index].couponSelector.data.splice(e, 1);
            let coupon_ids = this.model.list[index].couponSelector.data.map((item) => item.id);
            this.model.list[index].coupon_ids = coupon_ids.join(',');
        },
        // 新增奖励阶梯
        handleAdd() {
            this.$emit('handleAdd')
        },
        // 删除奖励阶梯
        handleDelete(index) {
            this.$emit('handleDelete', index)
        },
        // 数据更新
        updateData() {
            this.$emit('update:data', this.model.list);
        },
        // 阶梯奖励校验
        validateForm() {
            return new Promise((resolve, reject) => {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        resolve();
                    } else {
                        reject();
                    }
                })
            })
        },
        // 处理阶梯奖励
        rewardLevel(index) {
            let num = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
            return num[index]
        },
    },
}
</script>

<style scoped lang="scss">
// 折叠面板
.collapse {
    .collapse-item {
        margin-bottom: 10px;
        color: #262b30;
        &:nth-child(10) {
            margin-bottom: 60px;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 17px 20px 17px 56px;
            background-color: #f4f6f8;
            border: 1px solid #e9edef;
            font-weight: bold;
            position: relative;

            .icon {
                position: absolute;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 18px;
                color: $text-zhushi;
                cursor: pointer;

                &:hover {
                    color: $brand-color;
                }
            }
        }

        .body {
            height: 0;
            overflow: hidden;
            transition: height 0.3s linear;
            padding: 0 20px;
            &:first-child{
                padding-top: 30px;
            }
            &.show {
                height: auto;
                border: 1px solid #e9edef;
                border-top: none;
            }
            &.fullShow{
                // 消費满N样式
                padding: 0 20px;
                border: none;
            }
        }
    }
    .next {
        margin-top: 10px;
        background-color: #f4f6f8;
        padding: 30px 20px;
        border-radius: 2px;
        font-size: 14px;
        line-height: 20px;
        color: #262b30;

        /deep/ .ivu-form-item:last-child {
            margin-bottom: 0;
        }

        /deep/ .ivu-form-item-error-tip {
            padding-left: 120px !important;
        }
        .label-list {
            padding-top: 10px;
            margin-bottom: -10px;
        }
    }
    /deep/ .redpacketTime .ivu-form-item-error-tip {
        margin-left: 50px;
    }

    .form-item-bg-box {
        margin-top: 10px;
        margin-left: 120px;

        .coupons-list {
            max-width: 610px;
        }
    }
}

/deep/ .ivu-form .vertical .ivu-form-item-label {
    padding: 6px 10px 6px 0;
}
/deep/ .ivu-form .vertical.customType .ivu-form-item-error-tip{
    margin-left: 109px;
}
.noRequired {
    /deep/ .ivu-form-item-label:before {
        content: ''
    }
}

.addReward {
    margin-bottom: 60px;
    .default-primary {
        height: 52px;
        width: 100%;
        line-height: 42px;
        border-color: #e9edef;
    }
}
</style>