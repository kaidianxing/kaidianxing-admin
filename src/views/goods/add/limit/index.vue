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
    <div class="good-add-limit">
        <Form ref="form" :model="$store.state.goodAddEdit.model" :rules="rules"
              :label-width="120">
            <div class="box">
                <kdx-form-title>商品浏览权限</kdx-form-title>
                <FormItem label="会员等级：" prop="browse_level_perm" class="r-form-item-checkbox">
                    <RadioGroup v-model="model_browse_level_perm">
                        <Radio label="0">不限制会员等级</Radio>
                        <Radio label="1">指定会员等级可见</Radio>
                    </RadioGroup>
                    <kdx-hint-alert v-show="model_browse_level_perm === '1'" class="alert">
                        添加后，只有添加后的会员等级内的会员才可浏览该商品
                    </kdx-hint-alert>
                    <div v-if="model_browse_level_perm === '1'" class="nest-box">
                        <FormItem prop="browse_level_perm_ids">
                            <Button @click="addLevel('browse')" class="add-label ivu-normal brand">+添加</Button>
                            <div v-if="limitLabel.browse_level&&limitLabel.browse_level.length > 0" class="label-list">
                                <kdx-tag-label v-for="(item, index) in limitLabel.browse_level" :key="index"
                                           type="info" border style="margin: 0 10px 10px 0;"
                                           :closable="true" @on-close="closeLevel('browse', index)">
                                    {{item.level_name}}
                                </kdx-tag-label>
                            </div>
                        </FormItem>
                    </div>
                </FormItem>
                <FormItem label="会员标签组：" prop="browse_tag_perm" class="r-form-item-checkbox">
                    <RadioGroup v-model="model_browse_tag_perm">
                        <Radio label="0">不限制标签组</Radio>
                        <Radio label="1">指定标签组可见</Radio>
                    </RadioGroup>
                    <kdx-hint-alert v-show="model_browse_tag_perm === '1'" show-icon class="alert">
                        添加后，只有添加后的会员标签组内的会员才可浏览该商品
                    </kdx-hint-alert>
                    <div v-if="model_browse_tag_perm === '1'" class="nest-box">
                        <FormItem prop="browse_tag_perm_ids">
                            <Button @click="addLabel('browse')" class="add-label ivu-normal brand">+添加</Button>
                            <div v-if="limitLabel.browse_label&&limitLabel.browse_label.length > 0" class="label-list">
                                <kdx-tag-label v-for="(item, index) in limitLabel.browse_label" :key="index"
                                           type="warning" border style="margin: 0 10px 10px 0;"
                                           :closable="true" @on-close="closeLabel('browse', index)">
                                    {{item.group_name}}
                                </kdx-tag-label>
                            </div>
                        </FormItem>
                    </div>
                </FormItem>
            </div>
            <div class="box">
                <kdx-form-title>
                    商品购买权限
                </kdx-form-title>
                <FormItem label="会员等级：" prop="buy_level_perm" class="r-form-item-checkbox">
                    <RadioGroup v-model="model_buy_level_perm">
                        <Radio label="0">不限制会员等级</Radio>
                        <Radio label="1">指定会员等级可购买</Radio>
                    </RadioGroup>
                    <kdx-hint-alert v-show="model_buy_level_perm === '1'" show-icon class="alert">
                        添加后，只有添加后的会员等级内的会员才可购买该商品
                    </kdx-hint-alert>
                    <div v-if="model_buy_level_perm === '1'" class="nest-box">
                        <FormItem prop="buy_level_perm_ids">
                            <Button @click="addLevel('buy')" class="add-label ivu-normal brand">+添加</Button>
                            <div v-if="limitLabel.buy_level&&limitLabel.buy_level.length > 0" class="label-list">
                                <kdx-tag-label v-for="(item, index) in limitLabel.buy_level" :key="index" type="info"
                                           style="margin: 0 10px 10px 0;" border
                                           :closable="true" @on-close="closeLevel('buy', index)">
                                    {{item.level_name}}
                                </kdx-tag-label>
                            </div>
                        </FormItem>
                    </div>
                </FormItem>
                <FormItem label="会员标签组：" prop="buy_tag_perm" class="r-form-item-checkbox">
                    <RadioGroup v-model="model_buy_tag_perm">
                        <Radio label="0">不限制标签组</Radio>
                        <Radio label="1">指定标签组可购买</Radio>
                    </RadioGroup>
                    <kdx-hint-alert v-show="model_buy_tag_perm === '1'" show-icon class="alert">
                        添加后，只有添加后的会员标签组内的会员才可购买该商品
                    </kdx-hint-alert>
                    <div v-if="model_buy_tag_perm === '1'" class="nest-box">
                        <FormItem prop="buy_tag_perm_ids">
                            <Button @click="addLabel('buy')" class="add-label ivu-normal brand">+添加</Button>
                            <div v-if="limitLabel.buy_label&&limitLabel.buy_label.length > 0" class="label-list">
                                <kdx-tag-label v-for="(item, index) in limitLabel.buy_label" :key="index" type="warning"
                                           style="margin: 0 10px 10px 0;" border
                                           :closable="true" @on-close="closeLabel('buy', index)">
                                    {{item.group_name}}
                                </kdx-tag-label>
                            </div>
                        </FormItem>
                    </div>
                </FormItem>
            </div>
        </Form>
        <!--标签选择器-->
        <label-selector ref="label_modal" :current-list="label.list" @on-change="changeLabel"
        ></label-selector>
        <!--会员等级-->
        <level-selector ref="level_modal" :current-list="level.list" @on-change="changeLevel"></level-selector>
    </div>
</template>

<script>
    import LabelSelector from "./components/LabelSelector";
    import LevelSelector from './components/LevelSelector';
    import {
        modelMap
    } from '../base/components/binders';
    import {
        mapState
    } from 'vuex';

    export default {
        name: "index",
        components: {LabelSelector, LevelSelector},
        computed: {
            /**
             * 双向绑定vuex/goodAddEdit.js/state/model
             * 使用方法this.model_${propsName}
             */
            ...modelMap(),
            ...mapState('goodAddEdit', {
                limitLabel: state => state.limitLabel
            })
        },
        data() {
            return {
                type: '',
                label: {
                    list: [],
                    type: ''
                },
                level: {
                    list: [],
                    type: ''
                },

                rules: {
                    browse_level_perm_ids: [
                        {required: true, type: 'array', message: '商品浏览权限会员等级标签必选'}
                    ],
                    browse_tag_perm_ids: [
                        {required: true, type: 'array', message: '商品浏览权限会员标签组必填'}
                    ],
                    buy_level_perm_ids: [
                        {required: true, type: 'array', message: '商品购买权限会员等级标签必填'}
                    ],
                    buy_tag_perm_ids: [
                        {required: true, type: 'array', message: '商品购买权限会员标签组必填'}
                    ],
                    'ext_field.single_max_buy': [
                        {required: true, message: '单次最多购买必填'},
                        // {pattern: /^([1-9][0-9]{0,8})$/, message: '正整数,最大9位数'}
                    ],
                    'ext_field.single_min_buy': [
                        {required: true, message: '单次最少购买必填'},
                        // {pattern: /^([1-9][0-9]{0,8})$/, message: '正整数,最大9位数'}
                    ],
                    'ext_field.max_buy': [
                        {required: true, message: '总共可购买必填'},
                        // {pattern: /^([1-9][0-9]{0,8})$/, message: '正整数,最大9位数'}
                    ]
                }
            };
        },
        methods: {
            // 添加等级
            addLevel(type) {
                this.level.type = type;
                if (type === 'browse') {
                    this.level.list = this.limitLabel.browse_level;
                } else if (type === 'buy') {
                    this.level.list = this.limitLabel.buy_level;
                }
                this.$nextTick(() => {
                    this.$refs['level_modal'].setValue();
                });
            },
            // 新增标签
            addLabel(type) {
                this.label.type = type;
                if (type === 'browse') {
                    this.label.list = this.limitLabel.browse_label;
                } else if (type === 'buy') {
                    this.label.list = this.limitLabel.buy_label;
                }
                this.$nextTick(() => {
                    this.$refs['label_modal'].setValue();
                });
            },
            changeLabel(list) {
                let idArr = list.map(item => item.id);
                if (this.label.type === 'browse') {
                    this.limitLabel.browse_label = list;
                    this.model_browse_tag_perm_ids = idArr;
                } else if (this.label.type === 'buy') {
                    this.limitLabel.buy_label = list;
                    this.model_buy_tag_perm_ids = idArr;
                }
            },
            changeLevel(list) {
                let idArr = list.map(item => item.id);
                if (this.level.type === 'browse') {
                    this.limitLabel.browse_level = list;
                    this.model_browse_level_perm_ids = idArr;
                } else if (this.level.type === 'buy') {
                    this.limitLabel.buy_level = list;
                    this.model_buy_level_perm_ids = idArr;
                }
            },
            closeLevel(type, index) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否删除该会员等级',
                    onOk: () => {
                        if (type === 'browse') {
                            this.limitLabel.browse_level.splice(index, 1);
                            this.model_browse_level_perm_ids.splice(index, 1);
                        } else if (type === 'buy') {
                            this.limitLabel.buy_level.splice(index, 1);
                            this.model_buy_level_perm_ids.splice(index, 1);
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
                        if (type === 'browse') {
                            this.limitLabel.browse_label.splice(index, 1);
                            this.model_browse_tag_perm_ids.splice(index, 1);
                        } else if (type === 'buy') {
                            this.limitLabel.buy_label.splice(index, 1);
                            this.model_buy_tag_perm_ids.splice(index, 1);
                        }
                    },
                    onCancel: () => {
                    }
                });
            },
            validate() {
                return new Promise(resolve => {
                    this.$refs['form'].validate(valid => {
                        resolve(valid);
                    })
                })
            }
        }
    };
</script>

<style scoped lang="scss">
    .good-add-limit {
        > .ivu-form {
            padding: 0 40px;
        }

        .box {
            padding-bottom: 30px;

            .alert {
                margin: 10px 0;
            }

            .shop-limit {
                display: flex;

                > .form {
                    > .ivu-form-item {
                        &:last-child {
                            margin-bottom: 0;
                        }

                    }
                }

                > .alert {
                    margin-left: 40px;
                    margin-top: 0;
                    margin-bottom: 0;
                    width: 100%;
                    min-height: 156px;
                    box-sizing: border-box;
                    .title {
                        font-size: 12px;
                        line-height: 17px;
                        font-weight: bold;
                        color: $text-first;
                        padding-bottom: 10px;
                    }

                    .text {
                        @include font-12-24;
                        padding-bottom: 5px;
                        /*list-style: initial;*/
                        > span {
                            color: $text-second;
                            font-size: 16px;
                            font-weight: bold;
                        }
                    }
                }
            }
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
        .nest-box-limit {
            margin-left: 120px;
            .ivu-form-item {
                margin-bottom: 30px;
            }
        }
    }
</style>
