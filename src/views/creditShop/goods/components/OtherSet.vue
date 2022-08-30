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
        <Form ref="form" :model="model" :label-width="120" :rules="rule">
            <div class="pb-30">
                <kdx-form-title>购买权限</kdx-form-title>
                <FormItem label="会员等级：" class="r-form-item-checkbox">
                    <RadioGroup v-model="model.member_level_limit_type">
                        <Radio label="0">不限制会员等级</Radio>
                        <Radio label="1">指定会员等级可购买</Radio>
                        <Radio label="2">指定会员等级不可购买</Radio>
                    </RadioGroup>
                    <div v-if="model.member_level_limit_type === '1'" class="nest-box">
                        <FormItem prop="member_level_id">
                            <Button class="add-label ivu-normal brand" @click="addLevel">+添加</Button>
                            <div v-if="level.list&&level.list.length > 0" class="label-list">
                                <kdx-tag-label v-for="(item, index) in level.list" :key="index" type="info"
                                           style="margin: 0 10px 10px 0;" border
                                           :closable="true" @on-close="closeLevel(index)">
                                    {{item.level_name}}
                                </kdx-tag-label>
                            </div>
                        </FormItem>
                    </div>
                    <div v-if="model.member_level_limit_type === '2'" class="nest-box">
                        <FormItem prop="member_level_id">
                            <Button class="add-label ivu-normal brand" @click="addLevel">+添加</Button>
                            <div v-if="level.noList&&level.noList.length > 0" class="label-list">
                                <kdx-tag-label v-for="(item, index) in level.noList" :key="index" type="info"
                                           style="margin: 0 10px 10px 0;" border
                                           :closable="true" @on-close="closeLevel(index)">
                                    {{item.level_name}}
                                </kdx-tag-label>
                            </div>
                        </FormItem>
                    </div>
                </FormItem>
                <FormItem label="会员标签组：" class="r-form-item-checkbox">
                    <RadioGroup v-model="model.member_group_limit_type">
                        <Radio label="0">不限制标签组</Radio>
                        <Radio label="1">指定标签组可购买</Radio>
                        <Radio label="2">指定标签组不可购买</Radio>
                    </RadioGroup>
                    <div v-if="model.member_group_limit_type === '1'" class="nest-box">
                        <FormItem prop="member_group_id">
                            <Button class="add-label ivu-normal brand" @click="addLabel">+添加</Button>
                            <div v-if="label.list&&label.list.length > 0" class="label-list">
                                <kdx-tag-label v-for="(item, index) in label.list" :key="index" type="warning"
                                           style="margin: 0 10px 10px 0;" border
                                           :closable="true" @on-close="closeLabel(index)">
                                    {{item.group_name}}
                                </kdx-tag-label>
                            </div>
                        </FormItem>
                    </div>
                    <div v-if="model.member_group_limit_type === '2'" class="nest-box">
                        <FormItem prop="member_group_id">
                            <Button class="add-label ivu-normal brand" @click="addLabel">+添加</Button>
                            <div v-if="label.noList&&label.noList.length > 0" class="label-list">
                                <kdx-tag-label v-for="(item, index) in label.noList" :key="index" type="warning"
                                           style="margin: 0 10px 10px 0;" border
                                           :closable="true" @on-close="closeLabel(index)">
                                    {{item.group_name}}
                                </kdx-tag-label>
                            </div>
                        </FormItem>
                    </div>
                </FormItem>
                <form-item label="商品限购：">
                    <RadioGroup v-model="model.goods_limit_type" vertical>
                        <Radio label="0">不限制</Radio>
                        <Radio label="1">
                            <FormItem class="radio-item limit-num" prop="goods_limit_num" :label-width="0">
                                <div class="flex">
                                    <div class="flex">
                                        <span>每人限购</span>
                                        <kdx-rr-input placeholder="请输入" class="width-160 input-gap" v-model="model.goods_limit_num" number :fixed="0" :min-value="1" :max-value="999999999">
                                            <span slot="append">件</span>
                                        </kdx-rr-input>
                                    </div>
                                </div>
                            </FormItem>
                        </Radio>
                        <Radio label="2">
                            <div class="radio-item limit-day">
                                <div class="flex">
                                    <span>每人每</span>
                                    <FormItem label=" " :label-width="0" style="margin-bottom: 0" prop="goods_limit_day">
                                        <kdx-rr-input placeholder="请输入" class="width-160 input-gap" v-model="model.goods_limit_day" number :fixed="0" :min-value="1" :max-value="999999999">
                                            <span slot="append">天</span>
                                        </kdx-rr-input>
                                    </FormItem>
                                    <span class="input-gap">限购</span>
                                    <FormItem label=" " :label-width="0" style="margin-bottom: 0" prop="goods_limit_num1">
                                        <kdx-rr-input placeholder="请输入" class="width-160 input-gap" v-model="model.goods_limit_num1" number :fixed="0" :min-value="1" :max-value="999999999">
                                            <span slot="append">件</span>
                                        </kdx-rr-input>
                                    </FormItem>
                                </div>
                            </div>
                        </Radio>
                    </RadioGroup>
                </form-item>
            </div>

            <kdx-form-title>商品状态</kdx-form-title>
            <FormItem label="上架设置：" class="r-form-item-checkbox">
                <RadioGroup v-model="model.status">
                    <Radio label="1">上架</Radio>
                    <Radio label="0">下架</Radio>
                </RadioGroup>
                <kdx-hint-text>积分商品的下架不影响原商品的上架状态；原商品如果下架或删除，积分商品自动下架并且无法上架</kdx-hint-text>
            </FormItem>

        </Form>

        <!--标签选择器-->
        <label-selector ref="label_modal" :current-list="model.member_group_limit_type === '1'?label.list:label.noList" @on-change="changeLabel"></label-selector>
        <!--会员等级-->
        <level-selector ref="level_modal" :current-list="model.member_level_limit_type === '1'?level.list:level.noList" @on-change="changeLevel"></level-selector>

    </div>
</template>

<script>
    import LabelSelector from '@/views/goods/add/limit/components/LabelSelector'
    import LevelSelector from "@/views/goods/add/limit/components/LevelSelector";
    export default {
        name: "OtherSet",
        components: {
            LabelSelector,
            LevelSelector
        },
        props: {
            otherSetData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                label: {
                    list: [],
                    noList: [],
                },
                level: {
                    list: [],
                    noList: [],
                },
                model: {
                    member_level_limit_type: '0',
                    member_level_id: '',
                    member_group_limit_type: '0',
                    member_group_id: '',
                    goods_limit_type: '0', //限购次数类型
                    goods_limit_num: '', //限购数量
                    goods_limit_num1: '', // 每N天限购数量
                    goods_limit_day: '',
                    status: '1'
                },
                rule: {
                    goods_limit_type: [
                        {
                            validator: (field, value, callback) => {
                                // 购买限制类型切换时校验其他两个表单的状态，去除错误显示
                                if (value != 1) {
                                    this.$refs.form.validateField("goods_limit_num");
                                } else if (value != 2) {
                                    this.$refs.form.validateField("goods_limit_num1");
                                    this.$refs.form.validateField("goods_limit_day");
                                }
                                callback();
                            },
                        },
                    ],
                    goods_limit_num: [
                        {
                            validator: (field, value, callback) => {
                                if (this.model.goods_limit_type == 1 && !value) {
                                    callback(new Error("限购数量必填"));
                                } else {
                                    callback();
                                }
                            },
                        },
                    ],
                    goods_limit_num1: [
                        {
                            validator: (field, value, callback) => {
                                if (this.model.goods_limit_type == 2 && !value) {
                                    callback(new Error("限购数量必填"));
                                } else {
                                    callback();
                                }
                            },
                        },
                    ],
                    goods_limit_day: [
                        {
                            validator: (field, value, callback) => {
                                if (this.model.goods_limit_type == 2 && !value) {
                                    callback(new Error("天数必填"));
                                } else {
                                    callback();
                                }
                            },
                        },
                    ],
                    member_group_id: [
                        { required: true, message: '会员标签组必填' }
                    ],
                    member_level_id: [
                        { required: true, message: '会员等级必填' }
                    ]
                }
            }
        },
        computed: {},
        watch: {
            otherSetData: {
                handler(newValue) {
                    if (newValue?.member_level&&newValue.member_level_limit_type!=0) {
                        let result = newValue?.member_level.filter(item => newValue.member_level_id.split(',').includes(item.id))
                        if (newValue.member_level_limit_type == 1) {
                            this.level.list = result
                        } else if (newValue.member_level_limit_type == 2) {
                            this.level.noList = result
                        }
                    }
                    if (newValue?.member_group&&newValue.member_group_limit_type!=0) {
                        let result = newValue?.member_group.filter(item => newValue.member_group_id.split(',').includes(item.id))
                        if (newValue.member_group_limit_type == 1) {
                            this.label.list = result
                        } else if (newValue.member_group_limit_type == 2) {
                            this.label.noList = result
                        }
                    }
                    this.model = newValue
                }
            },
            model: {
                handler(newValue) {
                    this.$emit('update:otherSetData', newValue);
                },
                deep: true
            },
        },
        created() {
        },
        mounted() {
        },
        methods: {
            // 添加等级
            addLevel() {
                this.$nextTick(() => {
                    this.$refs['level_modal'].setValue();
                });
            },
            // 新增标签
            addLabel() {
                this.$nextTick(() => {
                    this.$refs['label_modal'].setValue();
                });
            },
            changeLabel(list) {
                let idArr = list.map(item => item.id);
                if (this.model.member_group_limit_type === '1') {
                    this.label.list = list;
                } else {
                    this.label.noList = list;
                }
                this.model.member_group_id = idArr.join(',');
            },
            changeLevel(list) {
                let idArr = list.map(item => item.id);
                if (this.model.member_level_limit_type === '1') {
                    this.level.list = list;
                } else {
                    this.level.noList = list;
                }
                this.model.member_level_id = idArr.join(',');
            },
            closeLevel(type, index) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否删除该会员等级',
                    onOk: () => {
                        if (this.model.member_level_limit_type === '1') {
                            this.level.list.splice(index, 1);
                            this.model.member_level_id = this.level.list.map(item => item.id).join(',');
                        } else {
                            this.level.noList.splice(index, 1);
                            this.model.member_level_id = this.level.noList.map(item => item.id).join(',');
                        }
                    },
                    onCancel: () => {
                    }
                });
            },
            closeLabel(type, index) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否删除该会员标签组',
                    onOk: () => {
                        if (this.model.member_group_limit_type === '1') {
                            this.label.list.splice(index, 1);
                            this.model.member_group_id = this.label.list.map(item => item.id).join(',');
                        } else {
                            this.label.noList.splice(index, 1);
                            this.model.member_group_id = this.label.noList.map(item => item.id).join(',');
                        }
                    },
                    onCancel: () => {
                    }
                });
            },
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(valid => {
                        if (valid) {

                            console.log(valid,'valid>>>>>');

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
        .nest-box {
            padding: 30px 20px;
            margin-top: 10px;
            background-color: $background-color;

            .label-list {
                padding-top: 10px;
                margin-bottom: -10px;
            }
            .ivu-form-item {
                margin-bottom: 0;
            }
        }
        .radio-item {
            display: inline-block;

            .input-gap {
                margin-left: 10px;
            }

            &.used-date {
                /deep/ .ivu-form-item-error-tip {
                    margin-left: 65px;
                }
            }
            &.used-day {
                /deep/ .ivu-form-item-error-tip {
                    margin-left: 50px;
                }
            }
        }
        .radio-item {
            &.limit-num {
                /deep/ .ivu-form-item-error-tip {
                    margin-left: 66px;
                }
            }

            &.limit-day {
                /deep/ .ivu-form-item-error-tip {
                    margin-left: 8px;
                }
            }
        }
        /deep/ .ivu-radio-group-vertical {
            .ivu-radio-wrapper {
                &:first-child {
                    margin-top: 3px;
                }

                &:nth-child(n+2) {
                    margin-top: 26px;
                }
            }
        }
    }
</style>