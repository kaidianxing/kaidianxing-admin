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
    <div class="other-set">
        <Form ref="form" :model="model" :label-width="120" :rules="rules">
            <div class="pb-30">
                <kdx-form-title>规则设置</kdx-form-title>
                <FormItem label="日签奖励：" prop="day_reward" class="dayAward">
                    <div class="flex">
                        <span class="marginR-10">每日签到固定奖励</span>
                        <div>
                            <kdx-rr-input class="width-160" type="text" v-model="model.day_reward" number :fixed="0" :min-value="0" :max-value="999999999" placeholder="请输入" :disabled="isDisabled">
                                <span slot="append">积分</span>
                            </kdx-rr-input>
                        </div>
                    </div>
                    <kdx-hint-text>用户每日签到可以获得的固定奖励</kdx-hint-text>
                </FormItem>
                <FormItem label="递增奖励：" class="r-form-item-checkbox" prop="increasing.status">
                    <RadioGroup v-model="model.increasing.status">
                        <Radio label="1" :disabled="isDisabled || notChange">开启</Radio>
                        <Radio label="0" :disabled="isDisabled || notChange">关闭</Radio>
                    </RadioGroup>
                    <kdx-hint-text>
                        用户连续签到的第二天起，开始递增奖励，若断签，需要重新计算 <span>
                        <kdx-hint-tooltip type="form" :hintText='`示例`'>举例说明，除了每日签到固定奖励5个积分以外，同时设置从第二天起递增奖励2积分，3天后不再递增。此种情况下，小明第一天签到得固定的奖励5个积分，第二天签到除了5个积分的固定奖励，同时得到递增奖励的2个积分，共7个积分；第三天得5+4个积分，第四天得5+6，第五天不再进行递增，可得奖励5+6个积分，第六天、第七天同理可得5+6个积分。若断签，则重新计算；若活动进行中修改规则，则按照新规则重新发放奖励。</kdx-hint-tooltip>
                        </span>
                    </kdx-hint-text>
                    <div v-if="model.increasing.status === '1'" class="nest-box">
                            <div class="flex align-center">
                                <span class="marginR-10">第二天起递增奖励</span>
                                <FormItem prop="increasing.integral">
                                    <kdx-rr-input class="width-160" type="text" v-model="model.increasing.integral" number :fixed="0" :min-value="0" :max-value="999999999" placeholder="请输入" :disabled="isDisabled || notChange">
                                        <span slot="append">积分</span>
                                    </kdx-rr-input>
                                </FormItem>
                                <span class="marginR-10 marginL-10">且</span>
                            </div>

                            <div class="flex align-center">
                                <FormItem prop="increasing.day" class="rulesBox">
                                    <kdx-rr-input class="width-160" type="text" v-model="model.increasing.day" number :fixed="0" :min-value="0" :max-value="999999999" placeholder="请输入" :disabled="isDisabled || notChange">
                                        <span slot="append">天</span>
                                    </kdx-rr-input>
                                </FormItem>
                                <span class="marginR-10 marginL-10">不再递增</span>
                            </div>

                        </div>
<!--                    </div>-->
                </FormItem>
                <FormItem label="连续签到奖励：" prop="continuity.status">
                    <RadioGroup v-model="model.continuity.status">
                        <Radio label="1" :disabled="isDisabled || notChange">开启</Radio>
                        <Radio label="0" :disabled="isDisabled || notChange">关闭</Radio>
                    </RadioGroup>
                    <kdx-hint-text>
                        用户达到指定天数后，将触发额外奖励，签满最长连续天数后，不再赠送连续奖励，若断签则重新计算
                        <kdx-hint-tooltip type="form" :hintText='`示例`'>举例说明，除了每日签到固定奖励5个积分以外，同时设置连续签到3天得10个积分，连签5天的20个积分，连续签到5天的情况下用户可正常领取奖励；若第四天断签，则第五天签到时仅能领取日签奖励5个积分，且不再触发3天连签奖励（已在第三天领取过），需自第五天起签满5天才可获得5天连签奖励的20个积分。
                            若断签，则重新计算。活动进行中不可更改连签规则</kdx-hint-tooltip>
                    </kdx-hint-text>
                    <ul v-if="model.continuity.status == 1">
                        <li v-for="(item,index) in model.continuity.info" :key="index">
                            <div class="header">
                                <div class="flex formBox">
                                    <span class="marginR-10">连续签到</span>
                                    <FormItem class="ruleBox" :prop="`continuity.info.${index}.day`" :rules="rules.day">
                                        <kdx-rr-input class="width-160" type="text" v-model="item.day" number :fixed="0" :min-value="0" :max-value="999999999" placeholder="请输入" :disabled="isDisabled || notChange">
                                             <span slot="append">天</span>
                                        </kdx-rr-input>
                                    </FormItem>
                                    <div class="marginR-10 marginL-10">赠送以下奖励</div>
                                </div>
                                <Button style="margin-top: 6px"  type="text" @click="handleDelete(index)" v-show="index !== 0"
                                        :disabled="isDisabled || notChange">删除
                                </Button>
                            </div>
                            <div class="body" :class="{ show: item.showFlag}" >
                                <FormItem label="奖励内容：" class="vertical" :prop="`continuity.info.${index}.award.select`" :rules="rules['award.select']">
                                    <CheckboxGroup v-model="item.award.select">
                                        <Checkbox label="credit" :disabled="isDisabled || notChange">积分</Checkbox>
                                        <Checkbox label="coupon" :disabled="isDisabled || notChange">优惠券</Checkbox>
                                    </CheckboxGroup>
                                    <div class="next marginT-10" v-if="item.award&&item.award.select.length">
                                        <FormItem label="积分："
                                                  v-if="new Set(item.award.select).has('credit')" :prop="`continuity.info.${index}.award.credit`" :rules="rules['award.credit']">
                                            <kdx-rr-input class="width-160" placeholder="请输入" number :fixed="0" :min-value="0" :max-value="999999999"
                                                      :disabled="isDisabled || notChange" v-model="item.award.credit">
                                                <span slot="append">积分</span>
                                            </kdx-rr-input>
                                        </FormItem>
                                        <FormItem label="优惠券选择：" :ref="`coupon_ids_${index}`" :prop="`continuity.info.${index}.award.coupon`" :rules="rules['award.coupon']"
                                                  v-if="new Set(item.award.select).has('coupon')">
                                            <Button class="default-primary" :disabled="isDisabled || notChange"
                                                    @click="showSelector(index)">
                                                {{item.couponSelector.data.length === 3 ? '重新选择优惠券' :
                                                    `+添加优惠券(${item.couponSelector.data.length}/3)`}}
                                            </Button>
                                            <hint-alert style="margin-top: 10px;margin-bottom: 10px;max-width: 610px;margin-left: 120px;">
                                                最多可选择3优惠券且优惠券须是在有效期内
                                            </hint-alert>
                                            <div class="form-item-bg-box" v-if="item.couponSelector.data.length > 0">
                                                <!--优惠券列表-->
                                                <div class="coupons-list">
                                                    <coupons-list v-if="item.couponSelector.data.length > 0" :data="item.couponSelector.data" :showStock="true"
                                                                  :disabled="isDisabled || notChange" @on-delete="deleteCoupons($event,index)"/>
                                                </div>
                                            </div>
                                        </FormItem>
                                    </div>

                                </FormItem>
                            </div>
                            <coupon-selector v-model="item.couponSelector.value" :multiple="true" :limit="3" pick_way="4"
                                             :currentList="item.couponSelector.data" @on-change="changeCouponList"
                                             @on-cancel="cancelSelector"/>
                        </li>
                        <div class="addReward" >
                            <Button class="default-primary" :disabled="isDisabled || notChange" @click="handleAdd">+添加奖励规则（{{ model.continuity.info.length }} / 7）</Button>
                        </div>
                    </ul>
                </FormItem>
                <FormItem label="补签设置：" prop="supplementary.status">
                    <RadioGroup v-model="model.supplementary.status">
                        <Radio label="1" :disabled="isDisabled">开启</Radio>
                        <Radio label="0" :disabled="isDisabled">关闭</Radio>
                    </RadioGroup>
                    <kdx-hint-text>
                        用户断签后，可以通过补签维持连续签到状态，次数不可超过当前设定周期
                        <kdx-hint-tooltip type="form" :hintText='`示例`'>举例说明，除了每日签到固定奖励5个积分以外，同时设置连续签到3天得10个积分，连签5天的20个积分。用户在第三天完成签到后发现第2天断签，立即进行补签。补签后先获得日签奖励5积分，后判断已满足连签3天，可领取10积分。
                            若修改进行中的活动的补签规则，则按照新规则消耗积分和计算次数。</kdx-hint-tooltip>
                    </kdx-hint-text>
                    <div class="bg-box" v-if="model.supplementary.status == 1">
                        <FormItem label="补签次数：" prop="supplementary.num">
                            <div class="flex">
                                <div>
                                    <kdx-rr-input class="width-160" type="text" v-model="model.supplementary.num" number :fixed="0" :min-value="0" :max-value="999999999" placeholder="请输入" :disabled="isDisabled">
                                        <span slot="append">次</span>
                                    </kdx-rr-input>
                                </div>
                            </div>
                        </FormItem>
                        <FormItem label="积分消耗：" prop="supplementary.consume" class="rulesBox">
                            <div class="flex">
                                <span class="marginR-10">每次消耗固定</span>
                                <div>
                                    <kdx-rr-input class="width-160" type="text" v-model="model.supplementary.consume" number :fixed="0" :min-value="0" :max-value="999999999" placeholder="请输入" :disabled="isDisabled">
                                        <span slot="append">积分</span>
                                    </kdx-rr-input>
                                </div>
                            </div>
                        </FormItem>
                    </div>
                </FormItem>
            </div>
        </Form>

    </div>
</template>

<script>
import CouponsList from '@/views/market/components/CouponsList'
import CouponSelector from "@/components/selector/CouponSelector";
    export default {
        name: "RulesInfo",
        components: {
            CouponsList,
            CouponSelector
        },
        props: {
            status: {
                type: [Number,String]
            },
            type: {
              type: String,
              default: ''
            },
            isDisabled: {
                type: Boolean,
                default: false
            },
            data: {
                type: Object,
                default: () => {}
            },
            // 奖励设置中数据
            award_stage: {
                type: Object,
                default: () => {}
            },
        },
        data() {
            const validateDay = (rule, value, callback) => {
                let date = (new Date(this.data.end_time).getTime()-new Date(this.data.start_time).getTime())/(1000*60*60*24);
                let nowData = (new Date(this.data.end_time).getTime()-new Date().getTime())/(1000*60*60*24);
                if(!value){
                    callback()
                } else {
                    if(value < 1){
                        callback(new Error('递增天数不能为0'))
                    }
                    if(this.type == 'edit' && this.status == '1'){
                    //     // if( this.oldData.start_time != this.data.start_time ||  this.oldData.end_time != this.data.end_time){
                            if(value > nowData){
                                callback(new Error('递增奖励天数必须小于剩余活动周期'))
                            }
                    //     // }
                    }else
                    if (value > date) {
                        callback(new Error('递增奖励天数必须小于活动周期'))
                    }
                    callback()
                }
            }
            return {
                oldData: {},
                date:  (new Date(this.data.end_time).getTime()-new Date(this.data.start_time).getTime())/(1000*60*60*24),
                levelIndex: '', //优惠券触发位置
                level: {
                    list: [],
                },
                model: {},
                list:[],
                rules: {
                    day_reward: [
                        {required: true, message: '每日签到固定奖励必填'}
                    ],
                    'increasing.status': [
                        {required: true, message: '递增奖励必填'}
                    ],
                    'increasing.day': [{
                        validator: validateDay
                    }],
                    'increasing.integral': [
                        {
                            validator: (rule, value, callback) => {
                                if(!value){
                                    callback(new Error('递增奖励必填'))
                                }else if(value < 1){
                                    callback(new Error('递增奖励不可为0'))
                                } else{
                                    callback()
                                }
                            }
                        }
                    ],
                    'continuity.status': [
                        {required: true, message: '连续签到奖励必填'}
                    ],
                    'supplementary.status': [
                        {required: true, message: '补签设置必填'}
                    ],
                    day: [
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                let index = rule.field.split('.')[2];
                                let date = (new Date(this.data.end_time).getTime()-new Date(this.data.start_time).getTime())/(1000*60*60*24);
                                let nowData = (new Date(this.data.end_time).getTime()-new Date().getTime())/(1000*60*60*24);
                                if (!value) {
                                    callback(new Error(`连续签到天数必填`));
                                } else {
                                    if(value <= 0){
                                        callback(`连续签到天数不可低于1天`);
                                    }
                                    if (index >0) {
                                        let prevNum = this.model.continuity.info?.[index-1].day,
                                                nextNum = this.model.continuity.info?.[index+1]?.day;
                                        if (prevNum && prevNum*100 >= value*100) {
                                            callback(`奖励条件必须递增`);
                                        } else if (nextNum && nextNum*100 <= value*100) {
                                            callback(`奖励条件必须递增`);
                                        }
                                    }
                                    if(this.type == 'edit' && this.status == '1'){
                                        // if( this.oldData.start_time != this.data.start_time ||  this.oldData.end_time != this.data.end_time){
                                            if(value > nowData){
                                                callback(new Error('连续奖励天数必须小于剩余活动周期'))
                                            }
                                        // }
                                    } else
                                    if(value > date){
                                        callback(new Error(`最大不可超过活动周期的天数`));
                                    }
                                    callback();
                                }
                            }
                        }
                    ],
                    'supplementary.num': [
                        {
                            validator: (rule, value, callback) => {
                                let date = (new Date(this.data.end_time).getTime() - new Date(this.data.start_time).getTime()) / (1000 * 60 * 60 * 24);
                                let nowData = (new Date(this.data.end_time).getTime()-new Date().getTime())/(1000*60*60*24);
                                if (!value) {
                                    callback(new Error('补签次数必填'))
                                } else {
                                    if(this.type == 'edit' && this.status == '1'){
                                        // if( this.oldData.start_time != this.data.start_time ||  this.oldData.end_time != this.data.end_time){
                                            if(value > nowData){
                                                callback(new Error('补签次数不可超过当前剩余活动周期'))
                                            }
                                            if(value < 1){
                                                callback(new Error('补签次数设置次数最小不可低于1次'))
                                            } else{
                                                callback()
                                            }
                                        // }
                                    }else
                                        if (value > date) {
                                            callback(new Error('补签次数不可超过当前设定周期'))
                                        }
                                        if(value < 1){
                                            callback(new Error('补签次数设置次数最小不可低于1次'))
                                        } else{
                                            callback()
                                        }
                                }
                            }
                        }
                    ],
                    'supplementary.consume': [
                        {
                            validator: (rule, value, callback) => {
                                if(!value){
                                    callback(new Error('积分消耗必填'))
                                }else if(value < 1){
                                    callback(new Error('积分消耗不可为0'))
                                }else{
                                    callback()
                                }
                            }
                        }
                    ],
                    'award.credit': [
                        {
                            validator:(rule,value,callback)=>{
                                if(!value) {
                                    callback(new Error("积分必填"))
                                }else if(value < 1){
                                    callback(new Error("积分不可为0"))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ],
                    'award.select': [
                        {
                            validator:(rule,value,callback)=>{
                                if(!value || value.length == 0) {
                                    console.log("----")
                                    callback(new Error("奖励内容必填"))
                                }else {
                                    callback()
                                }
                            }
                        }
                    ],
                    'award.coupon': [
                        {
                            validator:(rule,value,callback)=>{
                                if(!value) {
                                    callback(new Error("优惠券必填"))
                                }else {
                                    callback()
                                }
                            }
                        }
                    ]
                }
            }
        },
        computed: {
            getData() {
                return this.award_stage
            },
            notChange() {
                let change = false
                if(this.type == 'edit' && this.status == '1'){
                    change = true
                }
                return change
            }
        },
        watch: {
            data: {
                // immediate: true,
                handler(val){
                    this.oldData = JSON.parse(JSON.stringify(val))
                }
            },
            award_stage: {
                immediate: true,
                handler(val) {
                    this.model = val
                    this.updateData()
                },
                deep: true,
            },
        },
        created() {

        },
        mounted() {
        },
        methods: {
            // 数据更新
            updateData() {
                this.$emit('update:award_stage', this.model);
            },
            // 新增奖励阶梯
            handleAdd() {
                this.$emit('handleAdd')
            },
            // 删除奖励阶梯
            handleDelete(index) {
                this.$emit('handleDelete', index)
            },
            // 打开优惠券选择器
            showSelector(index) {
                this.levelIndex = index;
                this.model.continuity.info[this.levelIndex].couponSelector.value = true
            },
            // 关闭优惠券选择器
            cancelSelector() {
                this.model.continuity.info[this.levelIndex].couponSelector.value = false
            },
            // 选择优惠券
            changeCouponList(row) {
                this.model.continuity.info[this.levelIndex].couponSelector.data = [...row];
                let coupon_ids = this.model.continuity.info[this.levelIndex].couponSelector.data.map((item) => item.id);
                this.model.continuity.info[this.levelIndex].award.coupon = coupon_ids.join(',');
                this.$refs[`coupon_ids_${this.levelIndex}`].validateState = '';
                this.cancelSelector()
            },
            // 删除优惠券列表
            deleteCoupons(e, index) {
                this.model.continuity.info[index].couponSelector.data.splice(e, 1);
                let coupon_ids = this.model.continuity.info[index].couponSelector.data.map((item) => item.id);
                this.model.continuity.info[index].award.coupon = coupon_ids.join(',');
            },
            // 添加等级
            addLevel() {
                this.$nextTick(() => {
                    this.$refs['level_modal'].setValue();
                });
            },
            changeLevel(list) {
                let idArr = list.map(item => item.id);
                this.level.list = list;
                this.model.level_id = idArr.join(',');
                this.$refs.form.validateField('level_id')
            },
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            resolve()
                        } else {
                            reject()
                        }
                    })
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .other-set {
        .pb-30 {
            padding-bottom: 30px;
        }
        .dayAward {
            /deep/ .ivu-form-item-error-tip {
                margin-left: 120px!important;
            }
        }
        .nest-box {
            min-width: 754px;
            display: flex;
            align-items: center;
            padding: 30px 40px;
            margin-top: 10px;
            background-color: $background-color;
            .rulesBox {
                /deep/ .ivu-form-item-error-tip {
                    margin-left: 0px!important;
                    width: 200px;
                }
            }
            /deep/.ivu-form-item {
                margin-bottom: 0!important;
            }
            .label-list {
                padding-top: 10px;
                margin-bottom: -10px;
            }
            .ivu-form-item:last-child {
                margin-bottom: 0;
            }
            &.tip-120 {
                /deep/ .ivu-form-item-error-tip {
                    margin-left: 120px;
                }
            }
            .marginR-10 {
                margin-right: 10px;
            }
            .marginL-10 {
                margin-left: 10px;
            }

        }
        .header {
            margin-top: 10px;
            display: flex;
            min-width: 754px;
            align-items: flex-start;
            justify-content: space-between;
            padding: 30px 20px 0px 40px;
            background-color: #f4f6f8;
            border: 1px solid #e9edef;
            position: relative;
            .formBox {
                .ruleBox{
                    /deep/ .ivu-form-item-error-tip {
                        padding-left: 0 !important;
                        width:200px
                    }
                }
            }
        }
        .bg-box {
            min-width: 754px;
            margin-top: 10px;
            padding: 17px 20px 17px 20px;
            background-color: #f4f6f8;
            /deep/ .ivu-form-item-error-tip {
                padding-left: 120px !important;
            }
            .rulesBox{
                /deep/ .ivu-form-item-error-tip {
                    padding-left: 216px !important;
                }
            }
        }
        .body {
            min-width: 754px;
            height: 0;
            overflow: hidden;
            transition: height 0.3s linear;
            padding: 30px 20px 0;

            &.show {
                height: auto;
                border: 1px solid #e9edef;
                border-top: none;
            }

            /deep/ .kdx-hint-tooltip .kdx-hint-tooltip-tooltip .icon-shili {
                padding-left: 6px;
            }
            /deep/ .ivu-form-item-error-tip {
                padding-left: 120px !important;
            }
        }
        .next {
            margin-left: 120px;
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

            &.ml-140 /deep/ .ivu-form-item-error-tip {
                padding-left: 140px !important;
            }

            .label-list {
                padding-top: 10px;
                margin-bottom: -10px;
            }
        }
        @media  screen and (max-width: 1550px) {
            .min-width {
                width: 340px !important;
            }
        }
        /deep/ .show-img ul > .add {
            background-color: #fff;
        }
        /deep/ .ivu-form .vertical .ivu-form-item-label {
            padding: 6px 10px 6px 0;
        }
        .addReward {
            margin-top: 10px;

            .default-primary {
                min-width: 754px;
                height: 52px;
                width: 100%;
                line-height: 42px;
            }
        }
    }
</style>