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
<script src="../../../../../../../../alone/alone_shop/src/router/index.js"></script>
<template>
    <div class="flex activity-add-wrap">
        <Preview
            :p_model="model"
            :p_preview_credit="preview_credit"
            :p_preview_balance="preview_balance"
            :p_preview_redpacket="preview_redpacket"
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
                            </CheckboxGroup>
                        </FormItem>
                        <kdx-form-title>规则设置</kdx-form-title>
                        <FormItem label="指定商品：" prop="goods_type" style="padding-top: 2px">
                            <div
                                class="next-box"
                            >
                                <!--商品-->
                                <div>
                                    <FormItem
                                        class="error-tip-nopadding"
                                        label=""
                                        prop="goods_id"
                                    >
                                        <div>
                                            <Button
                                                class="default-primary"
                                                :disabled="type !== 'add'"
                                                @click="addGoods"
                                            >
                                                +添加商品
                                            </Button>
                                            <kdx-hint-text>同一商品在同一时段内仅支持参与一个购物奖励活动</kdx-hint-text>
                                            <div
                                                class="marginT-10"
                                                style="max-width: 610px;"
                                                v-show="
                                                    selectedGoodsList.length > 0
                                                "
                                            >
                                                <shop-name-page-list
                                                    ref="shop_name_list"
                                                    :list="selectedGoodsList"
                                                    :disabled="type !== 'add'"
                                                    @on-delete="deleteGoods"
                                                />
                                            </div>
                                        </div>
                                    </FormItem>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem label="适用人群：" prop="member_type">
                            <RadioGroup
                                v-model="model.member_type"
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
                                v-if="model.member_type !== '0'"
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
                            </div>
                        </FormItem>
                        <FormItem label="发奖时间节点：" prop="send_type">
                            <RadioGroup v-model="model.send_type">
                                <Radio label="0" :disabled="type !== 'add'">
                                    下单支付成功
                                </Radio>
                                <Radio label="1" :disabled="type !== 'add'">
                                    订单完成
                                </Radio>
                            </RadioGroup>
                            <kdx-hint-alert style="margin-top: 10px;">
                                如果用户产生维权退款退货，已发放的奖励自动回收，如果奖励已使用则无法回收
                                <br />
                                请注意购物奖励与消费奖励的活动同时进行时，如果用户同时满足两个活动的领取条件，弹窗提醒将重叠显示
                            </kdx-hint-alert>
                        </FormItem>
                        <FormItem label="优惠奖励：" prop="reward">
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
                                <Checkbox label="4" :disabled="type !== 'add'">
                                    红包（企业打款到零钱）
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
                                <FormItem label="单个红包金额：" prop="red_package.money" v-if="new Set(model.reward).has('4')">
                                    <kdx-rr-input class="width-160" placeholder="请输入" number :fixed="2" :minValue="0.3" :maxValue="200" :disabled="type !== 'add'" v-model="model.red_package.money">
                                        <span slot="append">元</span>
                                    </kdx-rr-input>
                                    <kdx-hint-text style="margin-top: 10px;max-width: 610px;margin-left: 120px;">
                                        红包金额支持0.3-200元
                                    </kdx-hint-text>
                                    <kdx-hint-alert style="margin-top: 10px;max-width: 610px;margin-left: 120px;" :show-icon="false">
                                        使用发放红包功能需要商家在微信支付商户开通企业打款到零钱功能 <br />成功领取的红包将自动打款到会员的微信零钱
                                    </kdx-hint-alert>
                                </FormItem>
                                <FormItem label="红包有效时间：" prop="red_package.expiry" v-if="new Set(model.reward).has('4')" class="redpacketTime">
                                    <div class="flex">
                                        <span>发放后</span>
                                        <div>
                                            <kdx-rr-input class="width-160" style="margin: 0 10px;" number :fixed="0" v-model="model.red_package.expiry"
                                                      :min-value="1" :max-value="30" placeholder="请输入" :disabled="type !=='add'">
                                                <span slot="append">天</span>
                                            </kdx-rr-input>
                                            <kdx-hint-text class="marginL-10">设置时间必须在1-30天</kdx-hint-text>
                                        </div>
                                        <span>内买家首次登陆商城时弹窗提示领取，过期不提示</span>
                                    </div>
                                </FormItem>
                                <FormItem label="红包祝福语：" class="noRequired" prop="red_package.blessing" v-if="new Set(model.reward).has('4')">
                                    <Input placeholder="请输入祝福语" class="width-340"
                                           :class="{'input-disabled': type !=='add'}"
                                           v-model="model.red_package.blessing"
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
                        <FormItem label="领取次数：" prop="pick_times_type">
                            <RadioGroup v-model="model.pick_times_type">
                                <Radio
                                    class="marginB-20"
                                    style="margin-top: 8px;"
                                    label="0"
                                    :disabled="type !== 'add'"
                                >
                                    不限制
                                </Radio>
                                <div class="pick_times_type marginB-20">
                                    <Radio label="1" :disabled="type !== 'add'">
                                        每人活动期间最多领取
                                    </Radio>
                                    <FormItem
                                        label=""
                                        prop="pick_times_limit_1"
                                        @click.stop
                                    >
                                        <Select
                                            class="width-100"
                                            v-model="model.pick_times_limit_1"
                                            :disabled="
                                                type !== 'add' ||
                                                    model.pick_times_type !==
                                                        '1'
                                            "
                                        >
                                            <Option
                                                v-for="item in pickTimesList"
                                                :key="item.value"
                                                :value="item.value"
                                            >
                                                {{ item.label }}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                    次
                                </div>
                                <div class="pick_times_type">
                                    <Radio label="2" :disabled="type !== 'add'">
                                        每人每天最多领取
                                    </Radio>
                                    <FormItem
                                        label=""
                                        prop="pick_times_limit_2"
                                        @click.stop
                                    >
                                        <Select
                                            class="width-100"
                                            v-model="model.pick_times_limit_2"
                                            :disabled="
                                                type !== 'add' ||
                                                    model.pick_times_type !==
                                                        '2'
                                            "
                                        >
                                            <Option
                                                v-for="item in pickTimesList"
                                                :key="item.value"
                                                :value="item.value"
                                            >
                                                {{ item.label }}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                    次
                                </div>
                            </RadioGroup>
                        </FormItem>
                    </Form>
                    <!--商品选择器-->
                    <goods-selector
                        v-model="goodsSelector.value"
                        :multiple="true"
                        :current-list="selectedGoodsList"
                        :show_activity="1"
                        :is_shopping_reward="1"
                        @on-change="changeGoodsList"
                        @on-cancel="closeGoodsSelector"
                    />
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
                        to="/shoppingReward/activity/index"
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
import ShopNamePageList from '@/components/ShopNamePageList'
import GoodsSelector from '@/components/selector/GoodsSelector'
import LabelSelector from '@/views/goods/add/limit/components/LabelSelector'
import LevelSelector from '@/views/goods/add/limit/components/LevelSelector'
import CouponsList from '@/views/market/components/CouponsList'
import CouponSelector from '@/components/selector/CouponSelector'
import { dealClassifyList } from '@/assets/helpers'
export default {
    components: {
        Preview,
        ShopNamePageList,
        GoodsSelector,
        LabelSelector,
        LevelSelector,
        CouponsList,
        CouponSelector,
    },
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
        const validatePickTimesLimit1 = (rule, value, callback) => {
            if (this.model.pick_times_type === '1') {
                if (value === '') {
                    callback(new Error('次数必选'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        const validatePickTimesLimit2 = (rule, value, callback) => {
            if (this.model.pick_times_type === '2') {
                if (value === '') {
                    callback(new Error('次数必选'))
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
                goods_type: '1',
                goods_id: [], // 选中商品id
                goods_cate_id: [], // 选中商品组id
                member_type: '0',
                member_info_id: [], // 选中会员信息id
                member_level_id: [], // 选中会员等级id
                member_group_id: [], // 选中会员标签id
                send_type: '0',
                reward: ['1'],
                coupon_ids: '',
                credit: '',
                balance: '',
                pick_times_type: '0',
                pick_times_limit: '',
                pick_times_limit_1: '',
                pick_times_limit_2: '',
                red_package: {
                    money: '', // 单个红包金额
                    expiry: '', // 红包有效时间
                    blessing: '', // 红包有效时间
                },
              popup_type:'0'
            },
            rule: {
                title: [{ required: true, message: '活动名称必填' }],
                activity_time: [{ required: true, message: '' }],
                start_time: [{ validator: validateStartTime }],
                end_time: [{ validator: validateEndTime }],
                client_type: [{ required: true, message: '活动渠道必选' }],
                goods_type: [{ required: true, message: '指定商品必选' }],
                goods_id: [{ required: true, message: '不能为空' }],
                goods_cate_id: [{ required: true, message: '不能为空' }],
                member_type: [{ required: true, message: '参与资格必选' }],
                member_info_id: [{ required: true, message: '不能为空' }],
                send_type: [{ required: true, message: '发放时间节点必选' }],
                reward: [{ required: true, message: '优惠奖励必选' }],
                coupon_ids: [{ required: true, message: '优惠券必选' }],
                credit: [{ required: true, message: '积分必填' }],
                balance: [{ required: true, message: '余额必填' }],
                pick_times_type: [{ required: true, message: '领取次数必选' }],
                pick_times_limit_1: [{ validator: validatePickTimesLimit1 }],
                pick_times_limit_2: [{ validator: validatePickTimesLimit2 }],
                'red_package.money': [{ required: true, message: '单个红包金额必填' }],
                'red_package.expiry': [{ required: true, message: '红包有效时间必填' }],
                popup_type: [{ required: true, message: '弹窗样式必填' }],
            },
            goodsSelector: {
                value: false,
                allowList: [], // 参与商品
                limitList: [], // 不参与商品
            },
            selectedGoodsList: [], // 当前选中商品列表
            goodsCateList: [], // 所有商品分类列表
            memberSelector: {
                levelList: [], // 等级
                labelList: [], // 标签
            },
            selectedMemberList: [], // 当前选中会员信息
            selector: {
                value: false,
                data: [],
            },
            preview_credit: {
                name: '购物奖励积分',
                number: '0',
            },
            preview_balance: {
                name: '购物奖励余额',
                number: '0.00',
            },
            preview_redpacket: {
                name: '购物奖励红包',
                number: '0.00',
            },
            pickTimesList: [],
            loading: false,
            id: '', // 活动id
            type: '', // 类型  add/view/edit
        }
    },
    created() {
        this.getGoodsCateList()
        // 初始化pickTimesList
        for (let i = 1; i < 11; i++) {
            this.pickTimesList.push({
                value: `${i}`,
                label: `${i}`,
            })
        }
        let { id } = this.$route.query
        let { type } = this.$route.params
        this.id = id
        this.type = type
        if (this.id) {
            this.getShoppingRewardDetail()
        }
    },
    methods: {
        // 获取商品分类
        getGoodsCateList() {
            this.$api.goodsApi.goodClassifyList().then((res) => {
                if (res.error === 0) {
                    this.goodsCateList = dealClassifyList(res.list)
                }
            })
        },
        // 获取购物奖励活动详情
        getShoppingRewardDetail() {
            this.$api.shoppingRewardApi
                .getShoppingRewardDetail({
                    id: this.id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        // 处理指定商品（指定参与/指定不参与）
                        if (new Set(['1', '2']).has(res.data.goods_type)) {
                            this.selectedGoodsList = [...res.data.goods]
                            this.model.goods_id = this.selectedGoodsList.map(
                                (item) => item.id
                            )
                        }
                        // 处理参与资格（会员等级/会员标签）
                        if (res.data.member_type === '1') {
                            this.selectedMemberList = [...res.data.member_level]
                        } else if (res.data.member_type === '2') {
                            this.selectedMemberList = [...res.data.member_group]
                        }
                        this.model.member_info_id = this.selectedMemberList.map(
                            (item) => item.id
                        )
                        res.data.reward = res.data?.reward.split(',')
                        if (new Set(res.data.reward).has('1')) {
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
                            goods_cate_id:
                                res.data.goods_type === '3'
                                    ? res.data.goods_cate.map((item) => item.id)
                                    : [],
                            pick_times_limit_1:
                                res.data.pick_times_type === '1'
                                    ? res.data.pick_times_limit
                                    : '', // 领取限制
                            pick_times_limit_2:
                                res.data.pick_times_type === '2'
                                    ? res.data.pick_times_limit
                                    : '', // 领取限制
                        }
                        if(new Set(res.data.reward).has('4')) {
                            this.model.red_package = JSON.parse(res.data?.red_package)

                        }
                    }
                })
        },
        // 切换商品使用限制
        changeGoodsLimit() {
            if (new Set(['1', '2']).has(this.model.goods_type)) {
                if (this.model.goods_type === '1') {
                    // 参与商品
                    this.selectedGoodsList = [...this.goodsSelector.allowList]
                } else {
                    // 不参与商品
                    this.selectedGoodsList = [...this.goodsSelector.limitList]
                }
                this.model.goods_id = this.selectedGoodsList.map(
                    (item) => item.id
                )
            }
        },
        // 添加商品
        addGoods() {
            this.goodsSelector.value = true
        },
        // 添加商品（商品选择器）
        changeGoodsList(list) {
            this.selectedGoodsList = [...list]
            if (this.model.goods_type === '1') {
                this.goodsSelector.allowList = [...list]
            } else if (this.model.goods_type === '2') {
                this.goodsSelector.limitList = [...list]
            }
            this.model.goods_id = list.map((item) => item.id)
            this.closeGoodsSelector()
        },
        // 删除商品
        deleteGoods(index) {
            this.selectedGoodsList.splice(index, 1)
            if (this.model.goods_type === '1') {
                this.goodsSelector.allowList = [...this.selectedGoodsList]
            } else if (this.model.goods_type === '2') {
                this.goodsSelector.limitList = [...this.selectedGoodsList]
            }
            this.model.goods_id = this.selectedGoodsList.map((item) => item.id)
        },
        // 关闭商品选择器
        closeGoodsSelector() {
            this.goodsSelector.value = false
        },
        handleGoodsCateChange(list) {
            // 处理select多选取消选中问题
            function deep(arr = []) {
                if (Array.isArray(arr)) {
                    arr.forEach((item) => {
                        if (item.children && item.children.length > 0) {
                            item.indeterminate = item.children.some(
                                (subItem) => {
                                    return subItem.checked === true
                                }
                            )
                            deep(item.children)
                        }
                    })
                }
            }
            deep(list)
            this.goodsCateList = list
        },
        // 切换参与资格
        changeMemberType() {
            if (new Set(['1', '2']).has(this.model.member_type)) {
                if (this.model.member_type === '1') {
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
            if (this.model.member_type === '1') {
                this.selectedMemberList = [...this.memberSelector.levelList]
                this.$nextTick(() => {
                    this.$refs['level_modal'].setValue()
                })
            } else if (this.model.member_type === '2') {
                this.selectedMemberList = [...this.memberSelector.labelList]
                this.$nextTick(() => {
                    this.$refs['label_modal'].setValue()
                })
            }
        },
        // 选择等级/标签（等级选择器）
        changeMemberInfo(list) {
            if (this.model.member_type === '1') {
                this.selectedMemberList = [...list]
                this.memberSelector.levelList = [...list]
            } else if (this.model.member_type === '2') {
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
            if (this.model.member_type === '1') {
                _content = '是否删除该会员等级'
            } else if (this.model.member_type === '2') {
                _content = '是否删除该会员标签'
            }
            this.$Modal.confirm({
                title: '提示',
                content: _content,
                onOk: () => {
                    this.selectedMemberList.splice(index, 1)
                    if (this.model.member_type === '1') {
                        this.memberSelector.levelList = [
                            ...this.selectedMemberList,
                        ]
                    } else if (this.model.member_type === '2') {
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
                        this.editShoppingRewardActivity()
                    } else {
                        // 新增
                        this.addShoppingRewardActivity()
                    }
                }
            })
        },
        // 添加购物奖励活动
        addShoppingRewardActivity() {
            let params = this.formatParams()
            this.$api.shoppingRewardApi
                .addShoppingRewardActivity({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        this.$router.replace({
                            path:
                                '/shoppingReward/activity/index',
                        })
                    }
                })
        },
        // 编辑购物奖励活动
        editShoppingRewardActivity() {
            let { end_time } = this.model
            let params = {
                end_time: this.$utils.formatDate(
                    new Date(end_time),
                    'yyyy-MM-dd hh:mm:ss'
                ),
                id: this.id,
            }
            this.$api.shoppingRewardApi
                .editShoppingRewardActivity({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        this.$router.replace({
                            path:
                                '/shoppingReward/activity/index',
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
                goods_type,
                goods_id,
                goods_cate_id,
                member_type,
                member_info_id,
                send_type,
                reward,
                coupon_ids,
                credit,
                balance,
                pick_times_type,
                pick_times_limit_1,
                pick_times_limit_2,
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
                goods_type,
                member_type,
                send_type,
                reward: reward.join(','),
                pick_times_type,
            }
            if (new Set(['1', '2']).has(goods_type)) {
                params['goods_id'] = [...goods_id]
            } else if (new Set(['3']).has(goods_type)) {
                params['goods_cate_id'] = [...goods_cate_id]
            }
            if (member_type === '1') {
                params['member_level_id'] = [...member_info_id]
            } else if (member_type === '2') {
                params['member_group_id'] = [...member_info_id]
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
            if (new Set(this.model.reward).has('4')) {
                params['red_package'] = this.model.red_package
            }
            if (pick_times_type === '1') {
                params['pick_times_limit'] = pick_times_limit_1
            } else if (pick_times_type === '2') {
                params['pick_times_limit'] = pick_times_limit_2
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
        'model.red_package.money': {
            handler(value) {
                this.preview_redpacket.number = value
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
        /deep/ .ivu-form-item.error-tip-nopadding {
            .ivu-form-item-error-tip {
                padding-left: 0px !important;
            }
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
    .pick_times_type {
        display: flex;
        align-items: center;
        .ivu-radio-wrapper {
            margin-right: 0;
        }
        .ivu-form-item {
            margin-bottom: 0;
            margin-left: 10px;
            margin-right: 10px;
        }
    }
}
.noRequired {
    /deep/ .ivu-form-item-label:before {
        content: ''
    }
}
.marginL-120 {
    margin-left: 120px;
}
</style>
