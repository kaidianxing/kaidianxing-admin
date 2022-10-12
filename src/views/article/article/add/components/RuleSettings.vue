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
    <div>
        <Form ref="form" :model="model" :label-width="120" :rules="rule"  @submit.native.prevent>
            <kdx-form-title>规则设置</kdx-form-title>
            <FormItem label="阅读数量：" prop="read_number_status" class="r-form-item-checkbox" >
                <RadioGroup class="radio-box" v-model="model.read_number_status">
                    <Radio label="1">展示</Radio>
                    <Radio label="0">隐藏</Radio>
                </RadioGroup>
                <div class="nest-box" v-if="model.read_number_status == 1" >
                    <FormItem label="初始阅读量：" prop="read_number_init" >
                        <kdx-rr-input
                            placeholder="请输入"
                            class="width-340 "
                            v-model.number="model.read_number_init"
                            number
                            :fixed="0"
                            :min-value="0"
                            :max-value="999999999"/>
                    </FormItem>
                    <FormItem label="阅读数量：" prop="read_number_step" >
                        <kdx-rr-input
                            placeholder="请输入"
                            class="width-340 "
                            v-model.number="model.read_number_step"
                            number
                            :fixed="0"
                            :min-value="1"
                            :max-value="100"/>
                        <kdx-hint-text>阅读者每阅读一次，记录的阅读次数，输入框输入最大值，根据设置的最大值随机新增</kdx-hint-text>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="点赞数：" prop="thumps_up_status" class="r-form-item-checkbox" >
                <RadioGroup class="radio-box" v-model="model.thumps_up_status">
                    <Radio label="1">展示</Radio>
                    <Radio label="0">隐藏</Radio>
                </RadioGroup>
                <div class="nest-box" v-if="model.thumps_up_status == 1" >
                    <FormItem label="初始点赞量：" prop="thumps_up_number_init" >
                        <kdx-rr-input
                            placeholder="请输入"
                            class="width-340 "
                            v-model.number="model.thumps_up_number_init"
                            number
                            :fixed="0"
                            :min-value="0"
                            :max-value="999999999"/>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="访问权限：" prop="member_level_limit_type" class="r-form-item-checkbox" >
                <RadioGroup class="radio-box" v-model="model.member_level_limit_type" @on-change="changeMemberType">
                    <Radio label="0">全部会员</Radio>
                    <Radio label="1">指定会员等级</Radio>
                    <Radio label="2">指定会员标签组</Radio>
                </RadioGroup>
                <kdx-hint-text>只有添加后的会员等级/会员标签组内的会员才可浏览该文章</kdx-hint-text>
                <div class="next-box" v-if="model.member_level_limit_type !== '0'">
                    <FormItem class="error-tip-nopadding" prop="member_level_limit_ids">
                        <Button class="ivu-normal brand" @click="addMemberInfo">+添加</Button>
                        <div class="label-list" v-show="model.member_level_limit_list.length">
                            <kdx-tag-label
                                v-for="(item,index) in model.member_level_limit_list"
                                :key="index"
                                :type="item.level_name? 'info' : 'warning'"
                                border
                                style="margin: 0 10px 10px 0;"
                                :closable="true"
                                @on-close="deleteMemberInfo(index)">
                                {{ item.level_name || item.group_name }}
                            </kdx-tag-label>
                        </div>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="分销商等级：" prop="commission_level_limit_type" class="r-form-item-checkbox" >
                <RadioGroup class="radio-box" v-model="model.commission_level_limit_type">
                    <Radio label="0">全部分销商</Radio>
                    <Radio label="1">指定分销商身份</Radio>
                </RadioGroup>
                <div class="nest-box" v-if="model.commission_level_limit_type == 1" >
                    <FormItem label="分销商等级：" prop="commission_level_limit_ids" >
                        <CheckboxGroup v-model="model.commission_level_limit_ids">
                            <Checkbox v-for="item in agentGradeList" :key="item.id" :label="item.id">{{ item.name }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="奖励设置：" prop="reward_type" class="r-form-item-checkbox" >
                <RadioGroup class="radio-box" v-model="model.reward_type">
                    <Radio label="0">无奖励</Radio>
                    <Radio label="1">积分</Radio>
                    <Radio label="2">余额</Radio>
                    <Radio label="3">优惠券</Radio>
                </RadioGroup>
                <!-- 积分 -->
                <div class="nest-box nest-box-reward" v-if="model.reward_type == 1" >
                    <FormItem key="creditOnce" label="用户每次分享文章可得：" :label-width="180" prop="creditOnce" >
                        <kdx-rr-input
                            v-model="model.creditOnce" 
                            placeholder="请输入" 
                            number
                            :fixed="0" 
                            :min-value="0" 
                            :max-value="999999999" 
                            class="width-172">
                            <span slot="append">积分</span>
                        </kdx-rr-input>
                        <kdx-hint-text>分享出去的文章，需用户进行阅读相应时间后才进行发放</kdx-hint-text>
                    </FormItem>
                    <FormItem key="creditMax" label="限制每人最多支持获得：" :label-width="180" prop="creditMax" >
                        <kdx-rr-input
                            v-model="model.creditMax" 
                            placeholder="请输入" 
                            number
                            :fixed="0" 
                            :min-value="0" 
                            :max-value="999999999" 
                            class="width-172">
                            <span slot="append">积分</span>
                        </kdx-rr-input>
                        <kdx-hint-text>设置限制发放最大值后，用户再进行转发操作后不再进行奖励的发放</kdx-hint-text>
                    </FormItem>
                </div>
                <!-- 余额 -->
                <div class="nest-box nest-box-reward" v-if="model.reward_type == 2" >
                    <FormItem key="balanceOnce" label="用户每次分享文章可得：" :label-width="180" prop="balanceOnce" >
                        <kdx-rr-input
                            v-model="model.balanceOnce" 
                            placeholder="请输入" 
                            number
                            :fixed="2" 
                            :min-value="0" 
                            :max-value="9999999.99" 
                            class="width-172">
                            <span slot="append">余额</span>
                        </kdx-rr-input>
                        <kdx-hint-text>分享出去的文章，需用户进行阅读相应时间后才进行发放</kdx-hint-text>
                    </FormItem>
                    <FormItem key="balanceMax" label="限制每人最多支持获得：" :label-width="180" prop="balanceMax" >
                        <kdx-rr-input
                            v-model="model.balanceMax" 
                            placeholder="请输入" 
                            number
                            :fixed="2" 
                            :min-value="0" 
                            :max-value="9999999.99" 
                            class="width-172">
                            <span slot="append">余额</span>
                        </kdx-rr-input>
                        <kdx-hint-text>设置限制发放最大值后，用户再进行转发操作后不再进行奖励的发放</kdx-hint-text>
                    </FormItem>
                </div>
                <!-- 优惠券 -->
                <div class="nest-box nest-box-coupon" v-if="model.reward_type == 3" >
                    <FormItem label="优惠券选择" prop="coupon">
                        <Button class="default-primary" @click="showSelector">
                            {{model.coupon.length === 20 ? '重新选择优惠券' : `+添加优惠券(${model.coupon.length}/20)`}}
                        </Button>
                        <div class="form-item-bg-box" v-if="model.coupon.length > 0">
                            <div class="coupons-list">
                                <coupons-list :list="model.coupon" :showStock="true" @on-delete="deleteCoupons"/>
                            </div>
                        </div>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="文章发布状态：" prop="status" class="r-form-item-checkbox">
                <RadioGroup class="radio-box" v-model="model.status">
                    <Radio label="1">显示</Radio>
                    <Radio label="0">隐藏</Radio>
                </RadioGroup>
            </FormItem>
        </Form>
        <!--会员等级选择器-->
        <level-selector
            ref="level_modal"
            :current-list="model.member_level_limit_list"
            @on-change="changeMemberInfo"
        />
        <!--会员标签选择器-->
        <label-selector
            ref="label_modal"
            :current-list="model.member_level_limit_list"
            @on-change="changeMemberInfo"
        />
        <!--优惠券选择器-->
        <coupon-selector v-model="couponSelector" :multiple="true" :limit="20" pick_way="4"
            :currentList="model.coupon" @on-change="changeCouponList"
            @on-cancel="cancelSelector"
        />
    </div>
</template>

<script>
import LabelSelector from "@/components/selector/LabelSelector";
import LevelSelector from "@/components/selector/LevelSelector";
import CouponSelector from '@/components/selector/CouponSelector'
import CouponsList from './CouponsList'
export default {
    props: {
        id: {
            type: String,
            default: ''
        },
        value: {
            type: Object,
            default: () => {}
        },
        selectedMemberList: {
            type: Object,
            default: () => {}
        }
    },
    components: { 
        LabelSelector, 
        LevelSelector,
        CouponSelector,
        CouponsList
    },
    data() {
        const validateCredit = (filed, val, callback) => {
            if (Number(this.model.creditMax) < Number(this.model.creditOnce)) {
                callback(new Error('最大值应大于每次获取值'));
            } else {
                callback();
            }
        };
        const validateBalance = (filed, val, callback) => {
            if (Number(this.model.balanceMax) < Number(this.model.balanceOnce)) {
                callback(new Error('最大值应大于每次获取值'));
            } else {
                callback();
            }
        };
        return {
            couponSelector: false,
            model: {
                read_number_status: "1",
                read_number_init: "",
                read_number_step: "",
                thumps_up_status: "1",
                thumps_up_number_init: "",
                member_level_limit_type: "0",
                member_level_limit_ids: [],
                member_level_limit_list: [],
                commission_level_limit_type: "0",
                commission_level_limit_ids: [],
                reward_type: "0",
                reward_rule: {},
                creditOnce: "",
                creditMax: "",
                balanceOnce: "",
                balanceMax: "",
                status: "1",
                coupon: [],
                rule_coupon_ids: "",
            },
            rule: {
                member_level_limit_ids: [{ required: true, message: "访问权限必选" }],
                commission_level_limit_ids: [{ required: true, message: "分销商等级必选" }],
                creditOnce: [{ required: true, message: "每次分享可得积分必填" }],
                creditMax: [{ required: true, message: "最多获得积分必填" }, {validator: validateCredit}],
                balanceOnce: [{ required: true, message: "每次分享可得余额必填" }],
                balanceMax: [{ required: true, message: "最多获得余额必填" }, {validator: validateBalance}],
                coupon: [{ 
                    required: true, 
                    validator: (rule, value, callback) => {
                        if (!value.length) {
                            callback(new Error('请选择优惠券'));
                        } else {
                            callback();
                        }
                    } 
                }],
            },
            memberSelector: {
                levelList: [], // 等级
                labelList: [], // 标签
            },
            agentGradeList: [],
        };
    },
    created() {
        this.getAgentGradeList();
    },
    watch: {
        value: {
            handler(newValue) {
                this.model = newValue
            },
            immediate: true,
            deep: true,
        },
        model: {
            handler(newValue) {
                this.$emit('input', newValue);
            },
            deep: true
        },
        selectedMemberList: {
            immediate: true,
            deep: true,
            handler(val) {
                if(val.labelList) {
                    this.memberSelector = JSON.parse(JSON.stringify(val))
                }
            }
        }
    },
    methods: {
        // 打开优惠券选择器
        showSelector() {
            this.couponSelector = true
        },
        // 选择优惠券
        changeCouponList(row) {
            this.model.coupon = [...row];
            let rule_coupon_ids = this.model.coupon.map((item) => item.id);
            this.model.rule_coupon_ids = rule_coupon_ids.join(',');
            this.cancelSelector()
        },
        // 删除优惠券列表
        deleteCoupons(e) {
            this.model.coupon.splice(e, 1);
            let rule_coupon_ids = this.model.coupon.map((item) => item.id);
            this.model.rule_coupon_ids = rule_coupon_ids.join(',');
        },
        // 关闭选择器
        cancelSelector() {
            this.couponSelector = false;
        },
        // 切换访问权限
        changeMemberType() {
            console.log(this.memberSelector, 8787)
            if (new Set(['1', '2']).has(this.model.member_level_limit_type)) {
                if (this.model.member_level_limit_type === '1') {
                    // 会员等级
                    this.model.member_level_limit_list = [...this.memberSelector.levelList]
                } else {
                    // 会员标签
                    this.model.member_level_limit_list = [...this.memberSelector.labelList]
                }
                this.model.member_level_limit_ids = this.model.member_level_limit_list.map(
                    (item) => item.id
                )
            }
        },
        // 添加等级/标签 (打开会员等级、标签选择器)
        addMemberInfo() {
            if (this.model.member_level_limit_type === '1') {
                this.model.member_level_limit_list = [...this.memberSelector.levelList]
                this.$nextTick(() => {
                    this.$refs['level_modal'].setValue()
                })
            } else if (this.model.member_level_limit_type === '2') {
                this.model.member_level_limit_list = [...this.memberSelector.labelList]
                this.$nextTick(() => {
                    this.$refs['label_modal'].setValue()
                })
            }
        },
        // 选择等级/标签（等级选择器）
        changeMemberInfo(list) {
            if (this.model.member_level_limit_type === '1') {
                this.model.member_level_limit_list = [...list]
                this.memberSelector.levelList = [...list]
            } else if (this.model.member_level_limit_type === '2') {
                this.model.member_level_limit_list = [...list]
                this.memberSelector.labelList = [...list]
            }
            this.model.member_level_limit_ids = this.model.member_level_limit_list.map(
                (item) => item.id
            )
        },
        // 删除会员等级/标签
        deleteMemberInfo(index) {
            let _content = ''
            if (this.model.member_level_limit_type === '1') {
                _content = '是否删除该会员等级'
            } else if (this.model.member_level_limit_type === '2') {
                _content = '是否删除该会员标签'
            }
            this.$Modal.confirm({
                title: '提示',
                content: _content,
                onOk: () => {
                    this.model.member_level_limit_list.splice(index, 1)
                    if (this.model.member_level_limit_type === '1') {
                        this.memberSelector.levelList = [
                            ...this.model.member_level_limit_list,
                        ]
                    } else if (this.model.member_level_limit_type === '2') {
                        this.memberSelector.labelList = [
                            ...this.model.member_level_limit_list,
                        ]
                    }
                    this.model.member_level_limit_ids = this.model.member_level_limit_list.map(
                        (item) => item.id
                    )
                },
                onCancel: () => {},
            })
        },
        // 获取分销商等级列表
        getAgentGradeList() {
            // let params = {
            //     pager: 0
            // }
            this.$api.commissionApi.getAgentGradeAllList().then((res) => {
                if (res.error === 0) {
                    this.agentGradeList = [...res.list]
                }
            })
        },
        validateForm() {
            return new Promise((resolve) => {
                this.$refs.form.validate(valid => {
                    console.log(121212)
                    if (valid) {
                        resolve(valid);
                    } else {
                        resolve(valid);
                    }
                })
            })
        }
    },
};
</script>
<style lang='scss' scoped>
.nest-box {
    position: relative;
    background-color: $background-color;
    padding: 30px 0;
    margin-top: 10px;
    /deep/.ivu-form-item {
        &:last-child {
            margin-bottom: 0;
        }
    }
    /deep/.hint-text {
        margin-left: 120px;
    }
    /deep/.ivu-form-item-error-tip {
        margin-left: 120px;
    }
    &.nest-box-reward {
        /deep/.hint-text {
            margin-left: 180px;
        }
        /deep/.ivu-form-item-error-tip {
            margin-left: 180px;
        }
    }
}

.next-box {
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
    .label-list {
        padding-top: 10px;
        margin-bottom: -10px;
    }
    &.goods {
        margin-left: 120px;
    }
}
.coupons-list {
    max-width: 610px;
    margin: 10px 30px 0 120px;
}
</style>