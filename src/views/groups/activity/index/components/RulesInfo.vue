<template>
    <div class="groups-rules-info">
        <Form ref="rules_form" :model="model" :label-width="120" :rules="rule">
            <kdx-form-title>规则设置</kdx-form-title>
            <FormItem label="成团人数：" v-if="model.inner_type == '1'">
                <ladder-group-num ref="ladder_group_num" :data.sync="model.group_num_list"
                                  :is-disabled="isDisabled"></ladder-group-num>
            </FormItem>
            <FormItem label="拼团商品：" ref="goods_info" prop="goods_info">
                <div class="next-box">
                    <Button class="default-primary" :disabled="isDisabled" @click="addGoods">选择拼团商品</Button>
                    <kdx-hint-text>提示：拼团库存不得大于商品库存，用户付款成功即扣除库存；拼团不支持会员折扣</kdx-hint-text>
                    <div class="goods-box" v-if="model.goods_info && model.goods_info.length > 0">
                        <ladder-rules-goods ref="goods_ladder_goods" v-model="model.goods_info"
                                            :is-disabled="isDisabled"
                                            :type="type" :ladder-num="model.group_num_list"
                                            v-if="model.inner_type == '1'"></ladder-rules-goods>
                        <rules-goods ref="goods_rule" v-model="model.goods_info" :is-disabled="isDisabled"
                                     :type="type" v-else @delete="handleDelete"></rules-goods>
                    </div>
                </div>
            </FormItem>
            <div class="validity">
                <div class="flex">
                    <FormItem label="拼团有效期：" prop="hour">
                        <kdx-rr-input v-model="model.hour" placeholder="请输入" number :min-value="0" :maxValue="999999999" :fixed="0"
                                  class="width-100" :disabled="isDisabled"></kdx-rr-input>
                        <span class="form-item-explain">时</span>
                    </FormItem>
                    <FormItem prop="minute" :label-width="0">
                        <kdx-rr-input v-model="model.minute" placeholder="请输入" number :min-value="0" :fixed="0"
                                  :max-value="59"
                                  class="width-100" :disabled="isDisabled"></kdx-rr-input>
                        <span class="form-item-explain">分</span>
                    </FormItem>
                </div>
                <kdx-hint-text>用户需在有效期内成团，超时则拼团失败</kdx-hint-text>
            </div>
            <FormItem label="成团人数：" prop="rules.success_num" v-if="model.inner_type == '0'">
                <kdx-rr-input placeholder="请输入2-100" class="width-160" v-model="model.rules.success_num" number :fixed="0"
                          :min-value="2" :max-value="100" :disabled="isDisabled">
                    <span slot="append">人</span>
                </kdx-rr-input>
            </FormItem>
            <FormItem label="模拟成团：">
                <RadioGroup v-model="model.rules.virtual_success">
                    <Radio label="1" :disabled="isDisabled">开启</Radio>
                    <Radio label="0" :disabled="isDisabled">关闭</Radio>
                </RadioGroup>
                <kdx-hint-text>开启模拟成团后，拼团有效期内人数未满的团，系统将会模拟“匿名买家”凑满人数，使该团成团。</kdx-hint-text>
                <kdx-hint-text style="padding-top: 0">你只需要对已付款参团的真实买家发货。建议合理开启，以提高成团率。</kdx-hint-text>
                <FormItem label="最多支持虚拟" prop="rules.virtual_success_num" v-if="model.rules.virtual_success == 1"
                          class="marginB-0 paddingT-10">
                    <kdx-rr-input placeholder="请输入1-100" class="width-160" v-model="model.rules.virtual_success_num" number
                              :fixed="0"
                              :min-value="1" :max-value="100" :disabled="isDisabled">
                        <span slot="append">人</span>
                    </kdx-rr-input>
                </FormItem>
            </FormItem>
            <FormItem label="分销：" >
                <RadioGroup v-model="model.rules.is_commission">
                    <Radio label="1" :disabled="isDisabled">参与</Radio>
                    <Radio label="0" :disabled="isDisabled">不参与</Radio>
                </RadioGroup>
                <kdx-hint-text style="max-width: 610px;" >默认不参与分销，分销开启后才能生效，如果活动内包含未设置分销的商品，选择后也不会产生分佣
                </kdx-hint-text>

            </FormItem>

            <FormItem label="优惠券：">

                <RadioGroup v-model="model.rules.use_coupon">
                    <Radio label="1" :disabled="isDisabled">支持</Radio>
                    <Radio label="0" :disabled="isDisabled">不支持</Radio>
                </RadioGroup>
                <kdx-hint-text >开启支持叠加使用优惠券则该活动商品支持使用平台内满足条件的优惠券</kdx-hint-text>
            </FormItem>
            <FormItem label="限购次数：" class="limit-type">
                <RadioGroup v-model="model.rules.limit_type" vertical>
                    <Radio label="0" :disabled="isDisabled">不限制</Radio>
                    <Radio label="1" :disabled="isDisabled">
                        <FormItem class="radio-item limit1" prop="rules.limit_num1">
                            <div class="flex">
                                <span>活动期内每人最多购买</span>
                                <kdx-rr-input placeholder="请输入" class="width-160" v-model="model.rules.limit_num1" number
                                          :fixed="0" :max-value="999999999" :min-value="1" :disabled="isDisabled">
                                    <span slot="append">件</span>
                                </kdx-rr-input>
                            </div>

                            <kdx-hint-text>若开启，活动期间内每人每件商品最多支持购买数量，如商品A活动期间最多支持购买200件</kdx-hint-text>
                        </FormItem>
                    </Radio>
                    <Radio label="2" :disabled="isDisabled">
                        <FormItem class="radio-item limit2" prop="rules.limit_num2">
                            <div class="flex">
                                <span>活动期内每人每天最多购买</span>
                                <kdx-rr-input placeholder="请输入" class="width-160" v-model="model.rules.limit_num2" number
                                          :fixed="0" :max-value="999999999" :min-value="1" :disabled="isDisabled">
                                    <span slot="append">件</span>
                                </kdx-rr-input>
                            </div>
                            <kdx-hint-text>若开启，活动期间内每人每天针对单个商品最多购买数量，如每人每天最多购买商品A200件</kdx-hint-text>
                        </FormItem>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="商品单购：" prop="rules.single_buy">
                <RadioGroup v-model="model.rules.single_buy">
                    <Radio label="1" :disabled="isDisabled">支持</Radio>
                    <Radio label="0" :disabled="isDisabled">不支持</Radio>
                </RadioGroup>
                <kdx-hint-text>开启后，商品详情展示单独购买按钮，支持用户单独购买</kdx-hint-text>
            </FormItem>
            <FormItem label="活动预热：" prop="is_preheat">
                <RadioGroup v-model="model.is_preheat">
                    <Radio label="1" :disabled="disabledPreheat">开启</Radio>
                    <Radio label="0" :disabled="disabledPreheat">不开启</Radio>
                </RadioGroup>
                <kdx-hint-text>开启后，商品详情展示未开始的拼团活动，但活动开始前用户无法拼团购买。</kdx-hint-text>
                <div class="next-box" v-if="model.is_preheat === '1'">
                    <FormItem label="预热时间：" prop="preheat_time">
                        <DatePicker type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="请选择预热时间"
                                    class="width-340"
                                    @on-change="changeTime"
                                    :disabled="disabledPreheat"
                                    :value="model.preheat_time">
                        </DatePicker>
                    </FormItem>
                </div>
            </FormItem>
        </Form>
        <!--商品选择器-->
        <goods-selector v-model="goodsSelector.value" :multiple="true" :current-list="model.goods_info" :flag="'presell'"
                        :show_activity="1"
                        :is_prescription="1"
                        @on-change="changeGoods" @on-cancel="cancelGoods"></goods-selector>
    </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import GoodsSelector from "@/components/selector/GoodsSelector";
import RulesGoods from "./RulesGoods";
import LadderGroupNum from "./LadderGroupNum";
import LadderRulesGoods from "./LadderRulesGoods";

export default {
    name: "RulesInfo",
    components: {
        GoodsSelector,
        RulesGoods,
        LadderGroupNum,
        LadderRulesGoods,
    },
    props: {
        type: {
            type: String,
            default: ''
        },
        activityData: {
            type: Object,
            default: () => {
            }
        },
        basicInfo: {
            type: Object,
            default: () => {
            }
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        id: {
            type: String
        }
    },
    data() {
        return {
            model: {
                is_commission: '0', // 是否参与分销
                limit_type: '0',
                limit_num1: null,
                limit_num2: null,
                is_preheat: '0',
                preheat_time: ''
            },
            rule: {
                goods_info: [
                    {required: true, type: 'array', min: 1, message: '请选择商品'}
                ],
                'rules.limit_num1': [{
                    validator: (rule, value, callback) => {
                        if (this.model.rules.limit_type == '1' && !value && value !== 0) {
                            callback(new Error('请填写数量'));
                        } else {
                            callback();
                        }
                    }
                }],
                'rules.limit_num2': [{
                    validator: (rule, value, callback) => {
                        if (this.model.rules.limit_type == '2' && !value && value !== 0) {
                            callback(new Error('请填写数量'));
                        } else {
                            callback();
                        }
                    }
                }],
                preheat_time: [{
                    required: true,
                    validator: (rule, value, callback) => {
                        let startTime = this.basicInfo?.activity_time?.[0];
                        if (!value) {
                            callback(new Error('请设置预热时间'));
                        } else if (startTime && value > startTime) {
                            callback(new Error('预热时间不能大于开始时间'));
                        } else {
                            callback();
                        }
                    }
                }],
                hour: [{
                    required: true,
                    message: '拼团有效期必填'
                }],
                minute: [
                    {
                        required: true,
                        message: '拼团有效期，分钟必填'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (this.model.hour == 0 && value == 0) {
                                callback('拼团有效期不可为0');
                            }
                            callback();
                        }
                    }
                ],
                'rules.success_num': [{
                    required: true,
                    message: '成团人数必填'
                }],
                'rules.virtual_success_num': [
                    {
                        validator: (rule, value, callback) => {
                            if (!value) {
                                callback(new Error('虚拟成团人数必填'));
                            }
                            value = parseFloat(value);
                            if (this.model.inner_type == 0) {
                                let success_num = this.model.rules.success_num || 2;
                                if (success_num <= value) {
                                    callback(new Error('虚拟成团人数要小于成团人数'));
                                }
                            } else {
                                let success_num = this.model.group_num_list[this.model.group_num_list.length - 1]?.num || 2;
                                if (success_num <= value) {
                                    callback(new Error('虚拟成团人数要小于成团人数'));
                                }
                            }
                            callback();
                        }
                    }
                ]
            },
            goodsSelector: {
                value: false
            },
            cache: {
                goodsList: [],
                ladderGoodsList: []
            }
        };
    },
    computed: {
        ...mapGetters('config', ['getAppPermMap']),
        ...mapState('config', ['apps']),
        disabledPreheat() {
            return (this.activityData?.status && this.activityData.status < 0) || this.$route.query.type=='view';
        },
        // 商品数量
        isShowGoodsList() {
            return this.model?.goods_info?.length;
        },
    },
    created() {
    },
    watch: {
        activityData: {
            handler(newValue) {
                this.model = newValue;
            },
            immediate: true
        },
        model: {
            handler(newValue) {
                this.$emit('update:activityData', newValue);
            },
            deep: true
        },
    },
    methods: {
        handleDelete(index) {
            this.model.goods_info.splice(index, 1);
        },
        validateForm() {
            return new Promise((resolve, reject) => {
                this.$refs['rules_form'].validate(async (valid) => {
                    if (valid) {
                        // 编辑状态不用校验商品信息，由于购买商品库存发生变化，容易校验不通过
                        if (this.id) {
                            resolve();
                            return;
                        }
                        if (this.model.inner_type == 0) {
                            await this.$refs['goods_rule'].validateForm();
                        } else {
                            await this.$refs['ladder_group_num'].validateForm();
                            await this.$refs['goods_ladder_goods'].validateForm();
                        }
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        },
        changeTime(e) {
            this.model.preheat_time = e;
        },
        addGoods() {
            this.goodsSelector.value = true;
        },
        changeGoods(list) {
            this.model.goods_info = list;
        },
        cancelGoods() {
            this.goodsSelector.value = false;
        },
        changeType(type) {
            if (type == 1) {
                this.cache.goodsList = JSON.parse(JSON.stringify(this.model.goods_info));
                this.model.goods_info = this.cache.ladderGoodsList;
            } else {
                this.cache.ladderGoodsList = JSON.parse(JSON.stringify(this.model.goods_info));
                this.model.goods_info = this.cache.goodsList;
            }
        },
        // 获取向后台传递的参数
        getParams() {
            let goods_info = this.getGoodsInfoParams();
            let params = Object.assign({}, {rules: JSON.parse(JSON.stringify(this.model.rules))}, goods_info);
            params.rules.limit_time = this.model.hour * 60 + this.model.minute * 1;
            params.is_preheat = this.model.is_preheat;
            (params.is_preheat == 1) && (params.preheat_time = this.model.preheat_time || '');
            params.inner_type = this.model.inner_type;
            params.rules.virtual_success_num = params.rules.vitrual_success == 0 ? '0' : params.rules.virtual_success_num;
            // 限购次数
            if (params.rules.limit_type == 0) {
                delete params.rules.limit_num;
            } else {
                params.rules.limit_num = params.rules.limit_type == 1 ? params.rules.limit_num1 || '' : params.rules.limit_num2 || '';
            }
            // 阶梯 成团人数
            if (this.model.inner_type == 1) {
                params.rules.success_num = {};
                this.model.group_num_list.forEach((item, i) => {
                    params.rules.success_num[i + 1] = item.num;
                });
            }
            delete params.rules.limit_num1;
            delete params.rules.limit_num2;
            params.rules = JSON.stringify(params.rules);
            console.log('params--------', params);
            return params;
        },
        getGoodsInfoParams() {
            let goods_id = [], option_id = [];
            let goods_info = this.model.goods_info.map(item => {
                goods_id.push(item.id);
                let option = {};
                if (item.has_option == 1) {
                    item.rules.forEach(rule => {
                        option_id.push(rule.option_id);
                    });
                    option = {
                        goods_id: item.id,
                        has_option: '1',
                        rules: item.rules
                    };
                } else {
                    option = {
                        goods_id: item.id,
                        option_id: '0',
                        has_option: '0',
                        activity_stock: item.activity_stock,
                        leader_price: item.leader_price||'-1'
                    };
                    if (this.model.inner_type == 0) {
                        option.activity_price = item.activity_price;
                    } else {
                        option.activity_price = '0';
                        option.ladder_price = {};
                        this.model.group_num_list.forEach((row, i) => {
                            option.ladder_price[i + 1] = item[`activity_price${i + 1}`];
                        });
                    }
                }
                return option;
            });
            return {
                goods_ids: goods_id.join(','),
                option_ids: option_id.join(','),
                goods_info
            };
        },
    },
};
</script>

<style lang="scss" scoped>
.groups-rules-info {
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
            margin-left: 120px;
        }
    }

    /deep/ .error-tip .ivu-form-item-error-tip {
        padding-left: 120px;
    }

    .goods-box {
        margin-top: 10px;
        max-width: 1400px;
    }

    .radio-item {
        display: inline-block;

        /deep/ .ivu-input-wrapper {
            margin-left: 10px;
        }

        &.limit1 {
            /deep/ .ivu-form-item-error-tip {
                margin-left: 148px;
            }
        }

        &.limit2 {
            /deep/ .ivu-form-item-error-tip {
                margin-left: 175px;
            }
        }
    }

    /deep/ .ivu-radio-group-vertical .ivu-radio-wrapper {
        &:first-child {
            margin-top: 3px;
        }

        &:nth-child(3),
        &:nth-child(2) {
            height: 40px;
        }

        margin-top: 20px;
    }

    .presell-item {
        /deep/ .ivu-form-item-content {
            margin-left: 0 !important;
        }
    }

    /deep/ .ivu-form {
        .ivu-date-picker-rel {
            .ivu-icon-ios-loading {
                display: none;
            }
        }
    }

    .marginB-0 {
        margin-bottom: 0;
    }

    .paddingT-10 {
        padding-top: 10px;
    }

    .form-item-explain {
        padding: 0 10px;
        font-size: 14px;
    }

    .validity {
        margin-bottom: 30px;

        .flex {
           /deep/ .ivu-form-item {
                margin-bottom: 0;
                .ivu-form-item-error-tip {
                    top: 50px;
                }
            }
        }

        .hint-text {
            margin-left: 120px;
            padding-top: 6px;
        }
    }
    .limit-type {
        /deep/ .ivu-form-item-error-tip {
            display: none;
        }
    }
}
</style>
