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
            :p_preview_credit="preview_credit"
            :p_preview_balance="preview_balance"
            :p_selector="selector"
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
                        <FormItem label="弹窗样式：" prop="popup_type">
                            <RadioGroup v-model="model.popup_type">
                                <Radio label="0" :disabled="type !== 'add'">
                                    样式一
                                </Radio>
                                <Radio label="1" :disabled="type !== 'add'">
                                    样式二
                                </Radio>
                            </RadioGroup>
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
                                <Checkbox label="30" :disabled="type !== 'add'">
                                    头条/抖音小程序
                                </Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <kdx-form-title>规则设置</kdx-form-title>
                        <FormItem label="领取条件：" prop="pick_type">
                            <RadioGroup v-model="model.pick_type">
                                <Radio label="0" :disabled="type !== 'add'">
                                    无消费记录用户
                                </Radio>
                                <Radio label="1" :disabled="type !== 'add'">
                                    新注册会员
                                </Radio>
                            </RadioGroup>
                            <kdx-hint-alert style="margin-top: 10px;">
                                在活动期间内满足领取的用户，每个用户ID新人活动只能发放1次
                            </kdx-hint-alert>
                        </FormItem>
                        <FormItem label="优惠奖励：" prop="gifts">
                            <CheckboxGroup v-model="model.gifts">
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
                            <div class="next-box" v-if="model.gifts.length">
                                <FormItem
                                    label="优惠券选择："
                                    prop="coupon_ids"
                                    v-if="new Set(model.gifts).has('1')"
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
                                        最多可选择3张优惠券且优惠券须是在有效期内
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
                                                :disabled="type !== 'add'"
                                                @on-delete="deleteCoupons"
                                            />
                                        </div>
                                    </div>
                                </FormItem>
                                <FormItem
                                    label="积分："
                                    prop="credit"
                                    v-if="new Set(model.gifts).has('2')"
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
                                    v-if="new Set(model.gifts).has('3')"
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
                        to="/newGifts/activity/index"
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
import CouponsList from '@/views/market/components/CouponsList'
import CouponSelector from '@/components/selector/CouponSelector'
export default {
    components: { Preview, CouponsList, CouponSelector },
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
        return {
            model: {
                title: '',
                activity_time: '1', // 必选占位符
                start_time: '',
                end_time: '',
                client_type: [],
                pick_type: '',
                gifts: ['1'],
                coupon_ids: '',
                credit: '',
                balance: '',
                popup_type:'0'
            },
            rule: {
                title: [{ required: true, message: '活动名称必填' }],
                activity_time: [{ required: true, message: '' }],
                start_time: [
                    {
                        validator: validateStartTime,
                    },
                ],
                end_time: [
                    {
                        validator: validateEndTime,
                    },
                ],
                client_type: [{ required: true, message: '活动渠道必选' }],
                pick_type: [{ required: true, message: '领取类型必选' }],
                gifts: [{ required: true, message: '优惠奖励必选' }],
                coupon_ids: [{ required: true, message: '优惠券必选' }],
                credit: [{ required: true, message: '积分必填' }],
                balance: [{ required: true, message: '余额必填' }],
                popup_type: [{ required: true, message: '弹窗样式必填' }],
            },
            preview_credit: {
                name: '新人专享积分',
                number: '0',
            },
            preview_balance: {
                name: '新人赠送余额',
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
            this.getNewGiftsDetail()
        }
    },
    methods: {
        // 获取新人送礼活动详情
        getNewGiftsDetail() {
            this.$api.newGiftsApi
                .getNewGiftsDetail({
                    id: this.id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        res.data.gifts = res.data?.gifts.split(',')
                        if (new Set(res.data.gifts).has('1')) {
                            // 优惠券
                            this.selector.data = [...res.data.coupon_info]
                            let coupon_ids = this.selector.data.map(
                                (item) => item.id
                            )
                            this.model.coupon_ids = coupon_ids.join(',')
                        }
                        this.model = {
                            ...this.model,
                            ...res.data,
                            client_type: res.data.client_type.split(','),
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
        handleSave() {
            this.$refs['form'].validate().then((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.id) {
                        // 编辑
                        this.editNewGiftsActivity()
                    } else {
                        // 新增
                        this.addNewGiftsActivity()
                    }
                }
            })
        },
        // 添加新人送礼活动
        addNewGiftsActivity() {
            let params = this.formatParams()
            console.log({ ...params })
            this.$api.newGiftsApi
                .addNewGiftsActivity({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        this.$router.replace({
                            path: '/newGifts/activity/index',
                        })
                    }
                })
        },
        // 编辑新人送礼活动
        editNewGiftsActivity() {
            let { end_time } = this.model
            let params = {
                end_time: this.$utils.formatDate(
                    new Date(end_time),
                    'yyyy-MM-dd hh:mm:ss'
                ),
                id: this.id,
            }
            this.$api.newGiftsApi
                .editNewGiftsActivity({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        this.$router.replace({
                            path: '/newGifts/activity/index',
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
                pick_type,
                gifts,
                coupon_ids,
                credit,
                balance,
                popup_type
            } = this.model
            let params = {
                title,
                popup_type,
                start_time: this.$utils.formatDate(
                    new Date(start_time),
                    'yyyy-MM-dd hh:mm:ss'
                ),
                end_time: this.$utils.formatDate(
                    new Date(end_time),
                    'yyyy-MM-dd hh:mm:ss'
                ),
                client_type: client_type.join(','),
                pick_type,
                gifts: gifts.join(','),
            }
            if (new Set(gifts).has('1')) {
                params['coupon_ids'] = coupon_ids
            }
            if (new Set(gifts).has('2')) {
                params['credit'] = credit
            }
            if (new Set(gifts).has('3')) {
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
