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
        <div class="left">
            <div class="preview-title">充值奖励预览</div>
            <div class="preview-box">
                <div class="top-bg"></div>
                <div class="coupon-box">
                    <div class="activity-name">
                        <div class="name">充值奖励</div>
                        <div
                            class="desc"
                            v-if="
                                (model.type === '0' && model.type_0_money) ||
                                    (model.type === '1' && model.type_1_money)
                            "
                        >
                            {{ model.type === '0' ? '累计' : '单次' }}充值满
                            <span>
                                {{
                                    model.type === '0'
                                        ? model.type_0_money
                                        : model.type_1_money
                                }}元
                            </span>
                            享受以下奖励
                        </div>
                    </div>
                    <div class="coupon-box-content">
                        <div class="scroll-box">
                            <ul
                                class="coupon-list"
                                v-if="
                                    new Set(model.reward).has('1') &&
                                        selector.data.length > 0
                                "
                            >
                                <li
                                    class="item"
                                    v-for="(item, index) in selector.data"
                                    :key="index"
                                >
                                    <div class="item-left">
                                        <span
                                            class="unit"
                                            v-if="item.coupon_sale_type === '1'"
                                        >
                                            ￥
                                        </span>
                                        <span
                                            class="price"
                                        >
                                            {{
                                                parseFloat(item.discount_price)
                                            }}
                                        </span>
                                        <span
                                            class="unit"
                                            v-if="item.coupon_sale_type === '2'"
                                        >
                                            折
                                        </span>
                                    </div>
                                    <div class="item-right">
                                        <div class="tit">
                                            {{ item.coupon_name }}
                                        </div>
                                        <div class="desc">
                                            {{ item.content }}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div
                                class="other"
                                v-if="new Set(model.reward).has('2')"
                            >
                                <div class="item">
                                    <div class="item-left">
                                        <span class="price">
                                            {{ preview_credit.number }}
                                        </span>
                                        <span class="unit">积分</span>
                                    </div>
                                    <div class="item-right">
                                        <div class="tit">
                                            {{ preview_credit.name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="other"
                                v-if="new Set(model.reward).has('3')"
                            >
                                <div class="item">
                                    <div class="item-left">
                                        <span class="unit">￥</span>
                                        <span class="price">
                                            {{
                                                parseFloat(
                                                    preview_balance.number
                                                )
                                            }}
                                        </span>
                                    </div>
                                    <div class="item-right">
                                        <div class="tit">
                                            {{ preview_balance.name }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <kdx-content-bar>
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
                        <FormItem label="活动渠道：" prop="client_type">
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
                            </CheckboxGroup>
                        </FormItem>
                        <kdx-form-title>规则设置</kdx-form-title>
                        <FormItem label="适用人群：">
                            全部会员
                        </FormItem>
                        <FormItem label="充值类型：" prop="type">
                            <RadioGroup vertical v-model="model.type">
                                <Radio label="0" :disabled="type !== 'add'">
                                    <div class="radio-box">
                                        <div class="text">累计充值金额满</div>
                                        <FormItem label="" prop="type_0_money">
                                            <kdx-rr-input
                                                class="width-160"
                                                placeholder="请输入"
                                                number
                                                :fixed="2"
                                                :maxValue="9999999.99"
                                                :disabled="
                                                    type !== 'add' ||
                                                        model.type !== '0'
                                                "
                                                v-model="model.type_0_money"
                                            >
                                                <span slot="append">元</span>
                                            </kdx-rr-input>
                                        </FormItem>
                                    </div>
                                </Radio>
                                <Radio label="1" :disabled="type !== 'add'">
                                    <div class="radio-box">
                                        <div class="text">单次充值金额满</div>
                                        <FormItem label="" prop="type_1_money">
                                            <kdx-rr-input
                                                class="width-160"
                                                placeholder="请输入"
                                                number
                                                :fixed="2"
                                                :maxValue="9999999.99"
                                                :disabled="
                                                    type !== 'add' ||
                                                        model.type !== '1'
                                                "
                                                v-model="model.type_1_money"
                                            >
                                                <span slot="append">元</span>
                                            </kdx-rr-input>
                                        </FormItem>
                                    </div>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="奖励设置：" prop="reward">
                            <CheckboxGroup v-model="model.reward">
                                <Checkbox label="1" :disabled="type !== 'add'">
                                    优惠券
                                </Checkbox>
                                <Checkbox label="2" :disabled="type !== 'add'">
                                    积分
                                </Checkbox>
                                <Checkbox label="3" :disabled="type !== 'add'">
                                    余额
                                </Checkbox>
                            </CheckboxGroup>
                            <div class="next-box" v-if="model.reward.length">
                                <FormItem
                                    label="优惠券选择："
                                    prop="coupon_ids"
                                    v-if="new Set(model.reward).has('1')"
                                >
                                    <Button
                                        class="default-primary"
                                        :disabled="type !== 'add'"
                                        @click="showSelector"
                                    >
                                        {{
                                            selector.data.length === 3
                                                ? '重新选择优惠券'
                                                : `+添加优惠券(${selector.data.length}/3)`
                                        }}
                                    </Button>
                                    <kdx-hint-alert
                                        style="margin-top: 10px;max-width: 610px;margin-left: 120px;"
                                    >
                                        优惠券最多可添加3张，支付完成后将获得优惠，推荐使用优惠券。如果维权则整单维权完成后收回优惠，
                                        如果优惠券已使用则无法收回，奖励的积分和余额将从当前积分和余额中扣除
                                    </kdx-hint-alert>
                                    <div
                                        class="form-item-bg-box"
                                        v-if="selector.data.length > 0"
                                    >
                                        <!--优惠券列表-->
                                        <div class="coupons-list">
                                            <coupons-list
                                                :data="selector.data"
                                                :showStock="true"
                                                @on-delete="deleteCoupons"
                                            />
                                        </div>
                                    </div>
                                </FormItem>
                                <FormItem
                                    label="积分："
                                    prop="credit"
                                    v-if="new Set(model.reward).has('2')"
                                >
                                    <kdx-rr-input
                                        class="width-160"
                                        placeholder="积分"
                                        number
                                        :fixed="0"
                                        :disabled="type !== 'add'"
                                        v-model="model.credit"
                                    >
                                        <span slot="append">积分</span>
                                    </kdx-rr-input>
                                </FormItem>
                                <FormItem
                                    label="余额："
                                    prop="balance"
                                    v-if="new Set(model.reward).has('3')"
                                >
                                    <kdx-rr-input
                                        class="width-160"
                                        placeholder="余额"
                                        number
                                        :fixed="2"
                                        :maxValue="9999999.99"
                                        :disabled="type !== 'add'"
                                        v-model="model.balance"
                                    >
                                        <span slot="append">元</span>
                                    </kdx-rr-input>
                                </FormItem>
                            </div>
                        </FormItem>
                    </Form>
                    <!--优惠券选择器-->
                    <coupon-selector
                        v-model="selector.value"
                        :multiple="true"
                        :limit="3"
                        pick_way="4"
                        :currentList="selector.data"
                        @on-change="changeCouponList"
                        @on-cancel="cancelSelector"
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
import CouponsList from '@/views/market/components/CouponsList'
import CouponSelector from '@/components/selector/CouponSelector'
export default {
    components: { CouponsList, CouponSelector },
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
                coupon_ids: [],
                credit: '',
                balance: '',
            },
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
                coupon_ids: [{ required: true, message: '优惠券必选' }],
                credit: [{ required: true, message: '积分必填' }],
                balance: [{ required: true, message: '余额必填' }],
            },
            preview_credit: {
                name: '充值奖励积分',
                number: '0',
            },
            preview_balance: {
                name: '充值奖励金额',
                number: '0.00',
            },
            selector: {
                value: false,
                data: [],
            },
            loading: false,
            id: '', // 活动id
            type: '', // 类型  add/view/edit
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
        // 获取新人送礼活动详情
        getRechargeRewardDetail() {
            this.$api.rechargeRewardApi
                .getRechargeRewardDetail({
                    id: this.id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        res.data.reward = res.data?.reward.split(',')
                        if (new Set(res.data.reward).has('1')) {
                            // 优惠券
                            this.selector.data = [...res.data.coupon_info]
                        }
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
            if (this.type !== 'add') {
                // 只有新增才能编辑
                this.$Message.error('不允许删除')
                return
            }
            this.selector.data.splice(index, 1)
            let coupon_ids = this.selector.data.map((item) => item.id)
            this.model.coupon_ids = coupon_ids.join(',')
        },
        handleSave() {
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
                coupon_ids,
                credit,
                balance,
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
                money: type === '0' ? type_0_money : type_1_money,
                reward: reward.join(','),
            }
            if (new Set(reward).has('1')) {
                params['coupon_ids'] = coupon_ids
            }
            if (new Set(reward).has('2')) {
                params['credit'] = credit
            }
            if (new Set(reward).has('3')) {
                params['balance'] = Number(balance).toFixed(2)
            }
            return params
        },
    },
    watch: {
        'model.credit': {
            handler(value) {
                this.preview_credit.number = parseInt(value) || '0'
            },
            immediate: true,
        },
        'model.balance': {
            handler(value) {
                this.preview_balance.number = value
                    ? parseFloat(value).toFixed(2)
                    : '0.00'
            },
            immediate: true,
        },
    },
}
</script>

<style scoped lang="scss">
.activity-add-wrap {
    .left {
        width: 380px;
        height: calc(100vh - 110px - 20px);
        padding-bottom: 20px;
        box-sizing: border-box;
        overflow-y: hidden;
        background-color: #fff;
        flex-shrink: 0;
        margin-right: 20px;
        margin-top: 20px;
        .preview-title {
            padding: 40px 0;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
        }
        .preview-box {
            transform: scale(0.8);
            transform-origin: top;
            width: 375px;
            min-height: 667px;
            margin: 0 auto;
            box-shadow: 0px 4px 8px rgba(133, 148, 162, 0.3);
            border-radius: 6px;
            background-color: #f5f5f5;
            .top-bg {
                width: 375px;
                height: 288px;
                background: url('~@/assets/image/rechargeReward/rechargeReward-preview-bg.png')
                    no-repeat left top;
            }
            .coupon-box {
                position: relative;
                margin: 8px 12px 0;
                min-height: 370px;
                background-color: #fff;
                border-radius: 6px;
                padding-left: 12px;
                padding-right: 12px;
                padding-bottom: 40px;
                .activity-name {
                    display: flex;
                    align-items: center;
                    height: 42px;
                    .name {
                        font-weight: 500;
                        font-size: 14px;
                        line-height: 20px;
                        color: #212121;
                        padding-right: 10px;
                    }
                    .desc {
                        font-size: 12px;
                        line-height: 17px;
                        color: #969696;
                        display: flex;
                        span {
                            color: #ff3c29;
                            font-weight: bold;
                            padding-left: 4px;
                            padding-right: 4px;
                        }
                    }
                }
                .coupon-box-content {
                    .item {
                        height: 68px;
                        border-radius: 4px;
                        display: flex;
                        overflow: hidden;
                        margin-bottom: 8px;
                        background: url('~@/assets/image/rechargeReward/coupon-bg.png')
                            no-repeat center;
                        background-size: cover;
                        &:last-child {
                            margin-bottom: 0;
                        }
                        .item-left {
                            display: flex;
                            justify-content: center;
                            width: 100px;
                            flex-shrink: 0;
                            .unit {
                                font-size: 12px;
                                line-height: 68px;
                                color: #ff3c29;
                                transform: translateY(3px);
                            }
                            .price {
                                padding-left: 4px;
                                padding-right: 4px;
                                font-weight: bold;
                                font-size: 24px;
                                line-height: 68px;
                                color: #ff3c29;
                            }
                        }
                        .item-right {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            padding-left: 14px;
                            .tit {
                                width: 200px;
                                font-size: 12px;
                                line-height: 17px;
                                color: #212121;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            .desc {
                                width: 200px;
                                margin-top: 2px;
                                font-size: 12px;
                                line-height: 17px;
                                color: #969696;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                        }
                    }
                    .other {
                        margin-top: 8px;
                    }
                }
            }
        }
    }
    .right {
        flex: 1;
        height: calc(100vh - 110px);
        overflow-y: auto;
        padding-top: 20px;
    }
}
.content {
    padding: 40px;
    background: #fff;
    min-height: 100%;
    /deep/ .ivu-radio-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
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
