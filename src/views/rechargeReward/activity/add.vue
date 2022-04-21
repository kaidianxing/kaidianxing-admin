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
    <div class="flex activity-add-wrap">
        <Preview
            :p_model="model"
            :rewardData="model.rules.award"
        />
        <div class="right">
            <kdx-content-bar class="content-bar-right">
                <div class="content">
                    <Form
                        ref="form"
                        :model="model"
                        :label-width="120"
                        :rules="rule"
                    >
                        <kdx-form-title>基本信息</kdx-form-title>
                        <FormItem label="活动名称：" prop="title">
                            <i-input
                                placeholder="请输入活动名称"
                                class="width-250"
                                :disabled="type !== 'add'"
                                v-model="model.title"
                            />
                        </FormItem>
                        <FormItem
                            label="活动期限："
                            prop="activity_time"
                            style="margin-bottom: 0;"
                        >
                            <div class="flex">
                                <FormItem label="" prop="start_time">
                                    <DatePicker
                                        type="datetime"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="请选择开始时间"
                                        class="width-250"
                                        :disabled="type !== 'add'"
                                        v-model="model.start_time"
                                    ></DatePicker>
                                </FormItem>
                                <span
                                    style="padding-left: 10px;padding-right: 10px;"
                                >
                                    ~
                                </span>
                                <FormItem label="" prop="end_time">
                                    <DatePicker
                                        type="datetime"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="请选择结束时间"
                                        class="width-250"
                                        :disabled="
                                            type !== 'add' && type !== 'edit'
                                        "
                                        v-model="model.end_time"
                                    ></DatePicker>
                                </FormItem>
                            </div>
                        </FormItem>
                        <FormItem label="活动渠道：" prop="client_type" class="marginB-53">
                            <CheckboxGroup v-model="model.client_type">
                                <Checkbox label="20" :disabled="type !== 'add'">
                                    微信公众号
                                </Checkbox>
                                <Checkbox label="21" :disabled="type !== 'add'">
                                    微信小程序
                                </Checkbox>
                                <Checkbox label="10" :disabled="type !== 'add'">
                                    手机浏览器H5
                                </Checkbox>
                                <Checkbox label="30" :disabled="type !== 'add'">
                                    头条/抖音小程序
                                </Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <kdx-form-title>规则设置</kdx-form-title>
                        <FormItem label="适用人群：" prop="permission">
                            <RadioGroup
                                class="flex"
                                v-model="model.rules.permission"
                                @on-change="changeMemberType"
                            >
                                <Radio label="1" :disabled="type !== 'add'">
                                    会员等级
                                </Radio>
                                <Radio label="2" :disabled="type !== 'add'">
                                    会员标签
                                </Radio>
                                <Radio label="0" :disabled="type !== 'add'">
                                    全部会员
                                </Radio>
                            </RadioGroup>
                            <div
                                class="next-box"
                                v-if="model.rules.permission !== '0'"
                            >
                                <FormItem
                                    class="error-tip-nopadding"
                                    prop="member_info_id"
                                >
                                    <Button
                                        class="ivu-normal brand"
                                        :disabled="type !== 'add'"
                                        @click="addMemberInfo"
                                    >
                                        +添加
                                    </Button>
                                    <div
                                        class="label-list"
                                        v-show="selectedMemberList.length"
                                    >
                                        <kdx-tag-label
                                            v-for="(item,
                                            index) in selectedMemberList"
                                            :key="index"
                                            :type="item.level_name? 'info' : 'warning'"
                                            border
                                            style="margin: 0 10px 10px 0;"
                                            :closable="type == 'add'"
                                            @on-close="deleteMemberInfo(index)"
                                        >
                                            {{
                                                item.level_name ||
                                                item.group_name
                                            }}
                                        </kdx-tag-label>
                                    </div>
                                </FormItem>
                                <!-- 红包 -->
                                <FormItem label="单个红包金额：" prop="redpacket_money" v-if="new Set(model.reward).has('4')">
                                    <kdx-rr-input class="width-160" placeholder="请输入" number :fixed="2" :minValue="0.01" :maxValue="200" :disabled="type !== 'add'" v-model="model.redpacket_money">
                                        <span slot="append">元</span>
                                    </kdx-rr-input>
                                    <kdx-hint-text style="margin-top: 10px;max-width: 610px;margin-left: 120px;">
                                        红包金额支持0.01-200元
                                    </kdx-hint-text>
                                    <kdx-hint-alert style="margin-top: 10px;max-width: 610px;margin-left: 120px;" :show-icon="false">
                                        使用发放红包功能需要商家在微信支付商户开通企业打款到零钱功能 <br />成功领取的红包将自动打款到会员的微信零钱
                                    </kdx-hint-alert>
                                </FormItem>
                                <FormItem label="红包有效时间：" prop="redpacket_time" v-if="new Set(model.reward).has('4')">
                                    <div class="flex">
                                        <span>发放后</span>
                                        <div>
                                            <kdx-rr-input class="width-160" style="margin: 0 10px;" number :fixed="0" v-model="model.redpacket_time"
                                                      :min-value="1" :max-value="30" placeholder="请输入" :disabled="type !=='add'">
                                                <span slot="append">天</span>
                                            </kdx-rr-input>
                                            <kdx-hint-text class="marginL-10">设置时间必须在1-30天</kdx-hint-text>
                                        </div>
                                        <span>内买家首次登陆商城时弹窗提示领取，过期不提示</span>
                                    </div>
                                </FormItem>
                            </div>
                        </FormItem>
                        <FormItem label="消费类型：" prop="type" class="marginB-53">
                            <RadioGroup v-model="model.type" class="flex">
                                <Radio label="0" :disabled="type !== 'add'">累计充值金额满N元</Radio>
                                <Radio label="1" :disabled="type !== 'add'">单次充值金额满N元</Radio>
                            </RadioGroup>
                        </FormItem>
                        <kdx-form-title>奖励设置</kdx-form-title>
                        <reward-levels ref="reward-levels" plugin="rechargeReward" :type='type' :consumeType="model.type" :award="model.rules.award" @update:data="updateData" @handleAdd="handleAdd" @handleDelete="handleDelete"></reward-levels>
                    </Form>
                    <!--会员等级选择器-->
                    <level-selector
                        ref="level_modal"
                        :current-list="selectedMemberList"
                        @on-change="changeMemberInfo"
                    />
                    <!--会员标签选择器-->
                    <label-selector
                        ref="label_modal"
                        :current-list="selectedMemberList"
                        @on-change="changeMemberInfo"
                    />
                </div>
                <template #btn>
                    <Button
                        class="primary-long"
                        type="primary"
                        :loading="loading"
                        :disabled="type !== 'add' && type !== 'edit'"
                        @click="handleSave"
                    >
                        保存
                    </Button>
                    <Button
                        class="default-long"
                        to="/rechargeReward/activity/index"
                    >
                        取消
                    </Button>
                </template>
            </kdx-content-bar>
        </div>
    </div>
</template>

<script>
import Preview from './components/Preview'
import LabelSelector from '@/views/goods/add/limit/components/LabelSelector'
import LevelSelector from '@/views/goods/add/limit/components/LevelSelector'
import RewardLevels from "./components/RewardLevels";
export default {
    components: { Preview, LevelSelector, LabelSelector, RewardLevels },
    data() {
        const validateStartTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('开始时间必选'))
            } else {
                if (this.model.end_time !== '') {
                    // 对 结束时间 验证
                    this.$refs.form.validateField('end_time')
                }
                callback()
            }
        }
        const validateEndTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('结束时间必选'))
            } else if (
                new Date(value).getTime() <=
                new Date(this.model.start_time).getTime()
            ) {
                callback(new Error('结束时间须大于开始时间'))
            } else {
                callback()
            }
        }
        const validateType0Money = (rule, value, callback) => {
            if (this.model.type === '0') {
                if (value === '') {
                    callback(new Error('金额必填'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        const validateType1Money = (rule, value, callback) => {
            if (this.model.type === '1') {
                if (value === '') {
                    callback(new Error('金额必填'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        return {
            model: {
                title: '',
                activity_time: '1', // 必选占位符
                start_time: '',
                end_time: '',
                client_type: ['20'],
                type: '0',
                type_0_money: '',
                type_1_money: '',
                reward: ['1'],
                coupon_ids: '',
                credit: '',
                balance: '',
                member_type: '0', // 适用人群
                member_info_id: [], // 选中会员信息id
                member_level_id: [], // 选中会员等级id
                member_group_id: [], // 选中会员标签id
                rules: {
                    permission: '0', // 适用人群
                    award: [
                        {
                            reward: ['1'],
                            money: '',
                            coupon_ids: '',
                            credit: '',
                            balance: '',
                            showFlag: true, // 奖励展开
                            couponSelector: {
                                value: false,
                                data: [],
                            },
                        }
                    ], // 奖励优惠
                    permission_value: [], // 权限制
                }, //阶梯奖励内容
            },
            init: [
                {
                    reward: ['1'],
                    money: '',
                    coupon_ids: '',
                    credit: '',
                    balance: '',
                    showFlag: true, // 奖励展开
                    couponSelector: {
                        value: false,
                        data: [],
                    },
                }
            ], // 数据初始化
            rule: {
                title: [{ required: true, message: '活动名称必填' }],
                activity_time: [{ required: true, message: '' }],
                start_time: [{ validator: validateStartTime }],
                end_time: [{ validator: validateEndTime }],
                client_type: [{ required: true, message: '活动渠道必选' }],
                type: [{ required: true, message: '充值类型必选' }],
                type_0_money: [{ validator: validateType0Money }],
                type_1_money: [{ validator: validateType1Money }],
                reward: [{ required: true, message: '奖励设置必选' }],
                credit: [{ required: true, message: '积分必填' }],
                balance: [{ required: true, message: '余额必填' }],
                member_info_id: [{ required: true, message: '不能为空' }],
            },
            memberSelector: {
                levelList: [], // 等级
                labelList: [], // 标签
            },
            selectedMemberList: [], // 当前选中会员信息
            loading: false,
            id: '', // 活动id
            type: '', // 类型  add/view/edit
            fullOldData: [], //累计充值数据缓存
            singleOldData: [], //单次充值数据缓存
        }
    },
    created() {
        let { id } = this.$route.query
        let { type } = this.$route.params
        this.id = id
        this.type = type
        if (this.id) {
            this.getRechargeRewardDetail()
        }
    },
    methods: {
        // 获取充值奖励活动详情
        getRechargeRewardDetail() {
            this.$api.rechargeRewardApi
                .getRechargeRewardDetail({
                    id: this.id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        this.model.rules = res.data?.rules;
                        this.model.rules.award.map(item => {
                            this.$set(item,'showFlag', true)
                            this.$set(item,'couponSelector',  {value: false, data: []})
                            // 处理奖励内容
                            if (new Set(item.reward).has('1')) {
                                item.couponSelector.data = [...item.coupon_info]
                                let coupon_ids = item.couponSelector.data.map((item) => item.id);
                                item.coupon_ids = coupon_ids;
                            }
                            delete item.coupon_info
                            return item
                        })
                        this.selector = res.data?.rules.award[0].couponSelector;
                        // 处理参与资格（会员等级/会员标签）
                        if (res.data.rules.permission === '1') {
                            this.selectedMemberList = [...res.data.member_level]
                        } else if (res.data.rules.permission === '2') {
                            this.selectedMemberList = [...res.data.member_group]
                        }
                        this.model.member_info_id = this.selectedMemberList.map(
                            (item) => item.id
                        )
                        this.model = {
                            ...this.model,
                            ...res.data,
                            client_type: res.data.client_type.split(','),
                            type_0_money:
                                res.data.type === '0' ? res.data.money : '',
                            type_1_money:
                                res.data.type === '1' ? res.data.money : '',
                        }
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
            let coupon_ids = this.selector.data.map((item) => item.id)
            this.model.coupon_ids = coupon_ids.join(',')
            this.cancelSelector()
        },
        // 删除优惠券列表
        deleteCoupons(index) {
            this.selector.data.splice(index, 1)
            let coupon_ids = this.selector.data.map((item) => item.id)
            this.model.coupon_ids = coupon_ids.join(',')
        },
        async handleSave() {
            await this.$refs["reward-levels"].validateForm();
            this.$refs['form'].validate().then((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.id) {
                        // 编辑
                        this.editRechargeReward()
                    } else {
                        // 新增
                        this.addRechargeReward()
                    }
                }
            })
        },
        // 添加充值奖励活动
        addRechargeReward() {
            let params = this.formatParams()
            this.$api.rechargeRewardApi
                .addRechargeReward({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        this.$router.replace({
                            path:
                                '/rechargeReward/activity/index',
                        })
                    }
                })
        },
        // 编辑充值奖励活动
        editRechargeReward() {
            let { end_time } = this.model
            let params = {
                end_time: this.$utils.formatDate(
                    new Date(end_time),
                    'yyyy-MM-dd hh:mm:ss'
                ),
                id: this.id,
            }
            this.$api.rechargeRewardApi
                .editRechargeReward({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        this.$router.replace({
                            path:
                                '/rechargeReward/activity/index',
                        })
                    }
                })
        },
        // 处理保存参数
        formatParams() {
            let {
                title,
                start_time,
                end_time,
                client_type,
                type,
                type_0_money,
                type_1_money,
                reward,
                rules
            } = this.model
            let params = {
                title,
                start_time: this.$utils.formatDate(
                    new Date(start_time),
                    'yyyy-MM-dd hh:mm:ss'
                ),
                end_time: this.$utils.formatDate(
                    new Date(end_time),
                    'yyyy-MM-dd hh:mm:ss'
                ),
                client_type: client_type.join(','),
                type,
                money:
                    type === '0'
                        ? Number(type_0_money).toFixed(2)
                        : Number(type_1_money).toFixed(2),
                reward: reward.join(','),
                rules,
            }
            params['rules']['permission_value']=this.model.member_info_id;
            params.rules.award.map(item => {
                delete item.showFlag
                delete item.couponSelector
            })
            return params
        },
        // 切换参与资格
        changeMemberType() {
            if (new Set(['1', '2']).has(this.model.rules.permission)) {
                if (this.model.rules.permission === '1') {
                    // 会员等级
                    this.selectedMemberList = [...this.memberSelector.levelList]
                } else {
                    // 会员标签
                    this.selectedMemberList = [...this.memberSelector.labelList]
                }
                this.model.member_info_id = this.selectedMemberList.map(
                    (item) => item.id
                )
            }
        },
        // 添加等级/标签 (打开会员等级、标签选择器)
        addMemberInfo() {
            if (this.model.rules.permission === '1') {
                this.selectedMemberList = [...this.memberSelector.levelList]
                this.$nextTick(() => {
                    this.$refs['level_modal'].setValue()
                })
            } else if (this.model.rules.permission === '2') {
                this.selectedMemberList = [...this.memberSelector.labelList]
                this.$nextTick(() => {
                    this.$refs['label_modal'].setValue()
                })
            }
        },
        // 选择等级/标签（等级选择器）
        changeMemberInfo(list) {
            if (this.model.rules.permission === '1') {
                this.selectedMemberList = [...list]
                this.memberSelector.levelList = [...list]
            } else if (this.model.rules.permission === '2') {
                this.selectedMemberList = [...list]
                this.memberSelector.labelList = [...list]
            }
            this.model.member_info_id = this.selectedMemberList.map(
                (item) => item.id
            )
        },
        // 删除会员等级/标签
        deleteMemberInfo(index) {
            let _content = ''
            if (this.model.rules.permission === '1') {
                _content = '是否删除该会员等级'
            } else if (this.model.rules.permission === '2') {
                _content = '是否删除该会员标签'
            }
            this.$Modal.confirm({
                title: '提示',
                content: _content,
                onOk: () => {
                    this.selectedMemberList.splice(index, 1)
                    if (this.model.rules.permission === '1') {
                        this.memberSelector.levelList = [
                            ...this.selectedMemberList,
                        ]
                    } else if (this.model.rules.permission === '2') {
                        this.memberSelector.labelList = [
                            ...this.selectedMemberList,
                        ]
                    }
                    this.model.member_info_id = this.selectedMemberList.map(
                        (item) => item.id
                    )
                },
                onCancel: () => {},
            })
        },
        // 获取阶梯奖励
        updateData(data) {
            this.model.rules.award = data;
        },
        // 新增阶梯奖励
        handleAdd() {
            this.model.rules.award.push({
                reward: ['1'],
                money: '',
                coupon_ids: '',
                credit: '',
                balance: '',
                showFlag: true, // 奖励展开
                couponSelector: {
                    value: false,
                    data: [],
                },
            })
        },
        // 删除阶梯奖励
        handleDelete(data) {
            this.model.rules.award.splice(data, 1);
        },
    },
    watch: {
        // 处理左侧预览
        'model.rules.award': {
            handler() {
                if(this.model.type == 1) {
                    this.singleOldData = this.model.rules.award
                }else {
                    this.fullOldData = this.model.rules.award
                }
            },
            immediate: true,
            deep: true,
        },
        // 处理奖励缓存
        'model.type': {
            immediate: true,
            handler(value) {
                if(value == '1') {
                    // 单次满减
                    this.model.rules.award = this.singleOldData.length ? this.singleOldData : this.init
                }else {
                    // 累计满减
                    this.model.rules.award = this.fullOldData
                }
            }
        },
    },
}
</script>

<style scoped lang="scss">
.activity-add-wrap {
    .right {
        flex: 1;
        height: calc(100vh - 110px);
        overflow-y: auto;
        padding-top: 20px;
        .content-bar-right {
            /deep/ .app-overdue {
                margin-top: 0;
            }
        }
    }
}
.content {
    padding: 40px;
    background: #fff;
    min-height: 100%;
    /deep/ .ivu-radio-wrapper {
        display: flex;
        align-items: center;
        line-height: 35px;
    }
    .radio-box {
        display: flex;
        align-items: center;
        /deep/ .ivu-form-item {
            padding-left: 10px;
            margin-bottom: 0;
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
        /deep/ .ivu-form-item-error-tip {
            padding-left: 120px !important;
        }
        .label-list {
            padding-top: 10px;
            margin-bottom: -10px;
        }
    }
    .form-item-bg-box {
        margin-top: 10px;
        margin-left: 120px;
        .coupons-list {
            max-width: 610px;
        }
    }
}
</style>
