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
        <preview :selector="couponSelector" :popup_type="model.popup_type" :preview_credit="preview_credit" :preview_balance="preview_balance" :reward="this.model.rules.award[0].reward" :preview_redpacket="preview_redpacket"></preview>
        <div class="right">
            <kdx-content-bar class="content-bar-right">
                <div class="content">
                    <Form ref="form" :model="model" :label-width="120" :rules="rule">
                        <kdx-form-title>基本信息</kdx-form-title>
                        <FormItem label="活动名称：" prop="title">
                            <i-input placeholder="请输入活动名称" class="width-250" :disabled="type !== 'add'" v-model="model.title"/>
                        </FormItem>
                        <FormItem label="活动时间：" prop="activity_time">
                            <div class="flex activity-time">
                                <FormItem label="" prop="start_time" style="margin-bottom: 0;">
                                    <DatePicker type="datetime"
                                                format="yyyy-MM-dd HH:mm"
                                                placeholder="请选择开始时间"
                                                class="width-250"
                                                :disabled="type !== 'add'"
                                                v-model="model.start_time">
                                    </DatePicker>
                                </FormItem>
                                <span style="padding-left: 10px;padding-right: 10px;">~</span>
                                <FormItem label="" prop="end_time" style="margin-bottom: 0;">
                                    <DatePicker type="datetime"
                                                format="yyyy-MM-dd HH:mm"
                                                placeholder="请选择结束时间"
                                                class="width-250"
                                                :disabled="type !== 'add' && type !== 'edit'"
                                                v-model="model.end_time">
                                    </DatePicker>
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
                        <FormItem label="活动渠道：" prop="client_type" class="marginB-53 vertical">
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
                        <FormItem label="适用人群：" class="r-form-item-checkbox" prop="permission">
                            <RadioGroup
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
                                            v-for="(item,index) in selectedMemberList"
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
                        <FormItem label="支付方式：" prop="pay_type" class="vertical">
                            <CheckboxGroup v-model="model.pay_type">
                                <Checkbox label="2" :disabled="type !== 'add'">余额支付</Checkbox>
                                <Checkbox label="20" :disabled="type !== 'add'">支付宝支付</Checkbox>
                                <Checkbox label="30" :disabled="type !== 'add'">微信支付</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="消费类型：" prop="type">
                            <RadioGroup v-model="model.type">
                                <Radio label="0" :disabled="type !== 'add'">累计消费金额满N元</Radio>
                                <Radio label="1" :disabled="type !== 'add'">单次消费金额满N元</Radio>
                            </RadioGroup>
                            <kdx-hint-text v-if="model.type == '0'">活动期间内，消费金额累计满足 N元 可获得奖励，每个用户只限制领取一次。 消费金额不包含邮费，整单维权完成后收回奖励。</kdx-hint-text>
                            <kdx-hint-text v-if="model.type == '1'">活动期间内，单次消费金额满足N元可获得奖励，每个用户限制可领取一次，消费金额不包含邮费</kdx-hint-text>
                            <div class="next-box"  v-if="model.type == '1'">
                                <FormItem label="可重复领取：" prop="is_repeat" :label-width="135">
                                    <RadioGroup v-model="model.is_repeat">
                                        <Radio label="0" :disabled="type !== 'add'">不重复</Radio>
                                        <Radio label="1" :disabled="type !== 'add'">可重复领取</Radio>
                                    </RadioGroup>
                                    <kdx-hint-text style="max-width: 610px;margin-left: 135px;">
                                        设置可重复领取，不建议进行维权售后的商品，如设置可维权商品存在刷单的风险
                                    </kdx-hint-text>
                                </FormItem>
                            </div>
                        </FormItem>
                        <FormItem label="赠送时间：" prop="send_type" class="marginB-53">
                            <RadioGroup v-model="model.send_type">
                                <Radio label="0" :disabled="type !== 'add'">订单完成后</Radio>
                                <Radio label="1" :disabled="type !== 'add'">订单付款后</Radio>
                            </RadioGroup>
                        </FormItem>
                        <kdx-form-title>奖励设置</kdx-form-title>
                        <reward-levels ref="reward-levels" plugin="shoppingReward" :type='type' :consumeType="model.type" :award="model.rules.award" @update:data="updateData" @handleAdd="handleAdd" @handleDelete="handleDelete"></reward-levels>
                        <kdx-form-title>活动限制</kdx-form-title>
                        <FormItem label="活动限制：" class="vertical">
                            <CheckboxGroup v-model="model.activity_limit">
                                <Checkbox label="1" :disabled="type !== 'add'">使用优惠券不能参与</Checkbox>
                                <Checkbox label="2" :disabled="type !== 'add'">参与满额立减不能参与</Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="不参与活动商品：" :label-width="135">
                            <div class="next-box">
                                <Button class="default-primary" :disabled="type !== 'add'" @click="addShop">+添加商品</Button>
                                <div class="goods-box">
                                    <shop-name-page-list v-if="goodSelector.data && goodSelector.data.length > 0"
                                                         ref="shop_name_list"
                                                         :disabled="type !== 'add'"
                                                         :list="goodSelector.data" @on-delete="deleteGoods">
                                    </shop-name-page-list>
                                </div>
                            </div>
                        </FormItem>
                    </Form>
                    <!--商品选择器-->
                    <goods-selector v-model="goodSelector.value" :multiple="true" :current-list="goodSelector.data"
                                    @on-change="changeGoodList" @on-cancel="cancelGoodSelector"></goods-selector>
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
                    <Button class="primary-long" type="primary" :loading="loading" :disabled="type !== 'add' && type !== 'edit'" @click="handleSave">保存</Button>
                    <Button class="default-long" to="/consumeReward/activity/list">取消</Button>
                </template>
            </kdx-content-bar>
        </div>
    </div>
</template>

<script>
    import shopNamePageList from "@/components/ShopNamePageList";
    import goodsSelector from "@/components/selector/GoodsSelector";
    import preview from "./components/Preview";
    import LabelSelector from '@/views/goods/add/limit/components/LabelSelector'
    import LevelSelector from '@/views/goods/add/limit/components/LevelSelector'
    import RewardLevels from "./components/RewardLevels";
    export default {
        components: { preview, shopNamePageList, goodsSelector, LabelSelector, LevelSelector, RewardLevels },
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
            };
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
            };
            return {
                model: {
                    title: '',
                    activity_time: '1', // 必选占位符
                    start_time: '',
                    end_time: '',
                    client_type: ['10','20','21'],
                    pay_type: ['2','20','30'],
                    type: '0',
                    money: '0',
                    is_repeat: '0',
                    reward: ['0'],
                    coupon_ids: '',
                    credit: '',
                    balance: '',
                    red_package: {
                        money: '', // 单个红包金额
                        expiry: '', // 红包有效时间
                        blessing: '', // 红包有效时间
                    },
                    send_type: '0',
                    activity_limit: ['1'],
                    goods_limit: '',
                    popup_type:'0',
                    member_info_id: [], // 选中会员信息id
                    member_level_id: [], // 选中会员等级id
                    member_group_id: [], // 选中会员标签id
                    rules: {
                        permission: '0', // 适用人群
                        permission_value: '', // 权限制
                        award: [
                            {
                                reward: ['1'],
                                money: '',
                                coupon_ids: '',
                                credit: '',
                                balance: '',
                                red_package: {
                                    money: '', // 单个红包金额
                                    expiry: '', // 红包有效时间
                                    blessing: '', // 红包有效时间
                                },
                                // 无需向后台传参
                                showFlag: true, // 奖励展开
                                couponSelector: {
                                    value: false,
                                    data: [],
                                },
                            }
                        ], // 奖励优惠
                    }, //阶梯奖励内容
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
                    pay_type: [{ required: true, message: '支付方式必选' }],
                    type: [{ required: true, message: '消费类型必选' }],
                    money: [{ required: true, message: '消费金额必填' }],
                    is_repeat: [{ required: true, message: '重复领取必选' }],
                    reward: [{ required: true, message: '奖励必选' }],
                    coupon_ids: [{ required: true, message: '优惠券必选'}],
                    credit: [{ required: true, message: '积分必填' }],
                    balance: [{ required: true, message: '余额必填' }],
                    'red_package.money': [{ required: true, message: '单个红包金额必填' }],
                    'red_package.expiry': [{ required: true, message: '红包有效时间必填' }],
                    send_type: [{ required: true, message: '余额必填' }],
                    'rules.permission': [{ required: true, message: '参与资格必选' }],
                    member_info_id: [{ required: true, message: '适用人群不能为空' }],
                    popup_type: [{ required: true, message: '弹窗样式必填' }],
                },
                memberSelector: {
                    levelList: [], // 等级
                    labelList: [], // 标签
                },
                selectedMemberList: [], // 当前选中会员信息
                preview_credit: {
                    name: '消费奖励积分',
                    number: '0',
                },
                preview_balance: {
                    name: '消费奖励余额',
                    number: '0.00',
                },
                preview_redpacket: {
                    name: '消费奖励红包',
                    number: '0.00',
                },
                couponSelector: {
                    value: false,
                    data: [],
                },
                goodSelector: {
                    value: false,
                    data: [],
                },
                loading: false,
                id: '', // 活动id
                type: '', // 类型  add/view/edit
                fullOldData: [], //累计满减数据缓存
                singleOldData: [], //单次满减数据缓存
                init: [
                    {
                        reward: ['1'],
                        money: '',
                        coupon_ids: '',
                        credit: '',
                        balance: '',
                        red_package: {
                            money: '', // 单个红包金额
                            expiry: '', // 红包有效时间
                            blessing: '', // 红包有效时间
                        },
                        showFlag: true, // 奖励展开
                        couponSelector: {
                            value: false,
                            data: [],
                        },
                    }
                ],
            }
        },
        created() {
            let { id, type } = this.$route.query;
            this.id = id;
            this.type = type;
            if (this.id) {
                this.getConsumeDetail()
            }
        },
        methods: {
            // 获取消费奖励活动详情
            getConsumeDetail() {
                this.$api.consumeRewardApi.getConsumeDetail({id: this.id,}).then((res) => {
                    if (res.error == 0) {
                        res.data.client_type = res.data?.client_type.split(',');
                        res.data.pay_type = res.data?.pay_type.split(',');
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
                        this.couponSelector = res.data?.rules.award[0].couponSelector;
                        // 处理参与资格（会员等级/会员标签）
                        if (res.data.rules.permission === '1') {
                            this.selectedMemberList = [...res.data.member_level]
                        } else if (res.data.rules.permission === '2') {
                            this.selectedMemberList = [...res.data.member_group]
                        }
                        this.model.member_info_id = this.selectedMemberList.map(
                            (item) => item.id
                        )
                        if (res.data.goods_limit) {
                            this.goodSelector.data = [...res.data.goods_info];
                        }
                        this.model = {
                            ...this.model,
                            ...res.data,
                        }
                    }
                })
            },
            changeType() {
                this.$refs['form'].fields.forEach(function (e) {
                    if (e.prop == 'money') {
                        e.resetField()
                    }
                })
            },
            // 打开商品选择器
            addShop() {
                this.goodSelector.value = true;
            },
            // 删除组内商品
            deleteGoods(index) {
                if (this.type !== 'add') {
                    // 只有新增才能编辑
                    this.$Message.error('不允许删除');
                    return
                }
                this.goodSelector.data.splice(index, 1);
                let goods_ids = this.goodSelector.data.map((item) => item.id);
                this.model.goods_limit = goods_ids.join(',')
            },
            // 选择商品
            changeGoodList(list) {
                this.goodSelector.data = [...list];
                let goods_ids = this.goodSelector.data.map((item) => item.id);
                this.model.goods_limit = goods_ids.join(',');
                this.cancelSelector();
            },
            // 关闭商品选择器
            cancelGoodSelector() {
                this.goodSelector.value = false;
            },
            async handleSave() {
                await this.$refs["reward-levels"].validateForm();
                this.$refs['form'].validate().then((valid) => {
                    if (valid) {
                        this.loading = true;
                        if (this.id) {
                            // 编辑
                            this.editConsumeActivity()
                        } else {
                            // 新增
                            this.addConsumeActivity()
                        }
                    }
                })
            },
            // 添加消费奖励活动
            addConsumeActivity() {
                let params = this.formatParams();
                this.$api.consumeRewardApi.addConsumeActivity({ ...params }).then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功');
                        this.$router.replace({
                            path: '/consumeReward/activity/list',
                        })
                    }
                })
            },
            // 编辑消费奖励活动
            editConsumeActivity() {
                let { end_time } = this.model
                let params = {
                    end_time: this.$utils.formatDate(
                        new Date(end_time),
                        'yyyy-MM-dd hh:mm'
                    ),
                    id: this.id,
                };
                this.$api.consumeRewardApi.editConsumeActivity({ ...params }).then((res) => {
                    this.loading = false;
                    if (res.error == 0) {
                        this.$Message.success('保存成功');
                        this.$router.replace({
                            path: '/consumeReward/activity/list',
                        })
                    }
                })
            },
            // 处理保存参数
            formatParams() {
                let params = {
                    ...this.model,
                    start_time: this.$utils.formatDate(new Date(this.model.start_time), 'yyyy-MM-dd hh:mm'),
                    end_time: this.$utils.formatDate(new Date(this.model.end_time), 'yyyy-MM-dd hh:mm'),
                    client_type: this.model.client_type.join(','),
                    pay_type: this.model.pay_type.join(','),
                    reward: this.model.reward.join(','),
                    activity_limit: this.model.activity_limit.join(','),
                };
                delete params.activity_time;
                delete params.credit;
                delete params.balance;
                delete params.red_package;
                delete params.goods_limit;
                delete params.member_info_id;
                delete params.member_level_id;
                delete params.member_group_id;
                delete params.rules;
                params['rules'] = this.model.rules;
                params['rules']['permission_value']=this.model.member_info_id;
                params.rules.award.map(item => {
                    delete item.showFlag
                    delete item.couponSelector
                })
                if (this.model.goods_limit) {
                    params['goods_limit'] = this.model.goods_limit
                }
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
                    red_package: {
                        money: '', // 单个红包金额
                        expiry: '', // 红包有效时间
                        blessing: '', // 红包有效时间
                    },
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
                handler(value) {
                    if(value && value.length) {
                        // 优惠券
                        if(new Set(value[0].reward).has('1')) {
                            this.couponSelector = value[0].couponSelector
                        }
                        // 积分
                        if(new Set(value[0].reward).has('2')) {
                            this.preview_credit.number = parseInt(value[0].credit) || '0'
                        }
                        // 余额
                        if(new Set(value[0].reward).has('3')) {
                            this.preview_balance.number = value[0].balance
                                ? parseFloat(value[0].balance).toFixed(2)
                                : '0.00'
                        }
                        if(new Set(value[0].reward).has('4')) {
                            this.preview_redpacket.number = value[0].red_package.money
                                ? parseFloat(value[0].red_package.money).toFixed(2)
                                : '0.00'
                        }
                    }
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
                        this.model.rules.award = this.singleOldData.length>0 ? this.singleOldData : this.init
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
        }
        .form-item-bg-box {
            margin-top: 10px;
            margin-left: 120px;
            .coupons-list {
                max-width: 610px;
            }
        }
        .goods-box {
            margin-top: 10px;
            max-width: 610px;
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
    /deep/ .ivu-form .vertical .ivu-form-item-label {
        padding: 6px 10px 6px 0;
    }
</style>
