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
    <div class="base-data">
        <Form ref="form" :model="model" :label-width="120">
            <kdx-form-title>
                <span>数据结构</span>
                <span class="tip danger-color">（创建后不可更改）</span>
            </kdx-form-title>
            <kdx-hint-alert style="margin-bottom: 30px">
                <p>创建后的数据结构不可删除</p>
                <p>如果出售虚拟卡密只有一条数据时，下方只需添加一条字段内容。如果出售的虚拟卡密有多条数据时，下方需要添加多条字段内容,最多支持10条数据字段。</p>
                <p>例如：如出售网盘提取密码时：需要添加提取密码一条数据组合成为一条虚拟卡密；如果出售账号及密码时，需要添加2条数据组合为一条虚拟卡密。</p>
            </kdx-hint-alert>
            <FormItem class="r-form-item-checkbox" label="卡密数据排重：">
                <RadioGroup v-model="model.repeat">
                    <Radio :label="1" :disabled="disabled">开启</Radio>
                    <Radio :label="0" :disabled="disabled">关闭
                        <kdx-hint-tooltip :maxWidth="410" style="margin-left:-6px;">
                            <p>【账号：666】【密码：888】【邮箱：aaa】已有数据；</p>
                            <p>【账号：666】【密码：888】【邮箱：bbb】可正常添加，</p>
                            <p>【账号：666】【密码：888】【邮箱：aaa】不可添加，视为重复数据。</p>
                        </kdx-hint-tooltip>
                    </Radio>
                </RadioGroup>
                <kdx-hint-text>
                    <p>开启后，每次向卡密库添加新数据时，若新数据与已存在的数据重复，则无法添加。</p>
                    <p>当卡密数据由多个字段组成时，所有字段均重复才视为此条数据为重复数据。</p>
                </kdx-hint-text>
                <div class="config-data">
                    <Table ref="table" border :columns="columns" :data="model.config">
                        <template slot-scope="{ row, index }" slot="key">
                            <FormItem>
                                <Input :class="{error: model.config[index].errorKey}" v-model="model.config[index].key" :disabled="disabled"
                                       maxlength="10" :show-word-limit="!disabled"
                                       class="width-340" placeholder="请输入字段名称"
                                       @on-blur="handleBlur($event,index)"/>
                            </FormItem>
                        </template>
                        <template slot-scope="{ row, index }" slot="type">
                            <div>
                                <RadioGroup v-model="model.config[index].type">
                                    <Radio :label="0" :disabled="disabled">文本</Radio>
                                    <Radio :label="1" :disabled="disabled">超链接</Radio>
                                </RadioGroup>
                            </div>
                        </template>
                    </Table>
                    <Button class="brand" v-if="model.config.length<10" :disabled="disabled" @click="addConfigData">{{`+添加一条字段（${model.config.length}/10）`}}</Button>
                </div>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "BaseData",
        components: {},
        props: {
            baseData: {
                type: Object,
                default: () => {}
            },
            disabled: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                model: {
                    repeat: 1,
                    config: [
                        {
                            key: '',
                            type: 0,
                        }
                    ],
                },
                columns: [
                    {
                        title: ' ',
                        key: 'icon',
                        align: 'center',
                        width: 20,
                    },
                    {
                        title: '字段',
                        key: 'name',
                        width: 100,
                        render: (h, params) => {
                            return (
                                <div class={params.index === 0?'ivu-form-item-required':''}><label class="ivu-form-item-label">{`字段${params.index+1}`}</label></div>
                            )
                        }
                    },
                    {
                        title: '字段名称',
                        key: 'key',
                        slot: 'key',
                    },
                    {
                        title: '字段属性',
                        key: 'type',
                        slot: 'type',
                        width: 200,
                        renderHeader: () => {
                            return (
                                <div>
                                    <span>字段属性</span>
                                    <kdx-hint-tooltip maxWidth={200} style="font-weight: 500;">超链接的字段，在手机浏览器H5浏览时，可直接点击进行访问； 小程序受访问白名单限制，只能进行复制。</kdx-hint-tooltip>
                                </div>
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 60,
                        render: (h, params) => {
                            if (params.index === 0) {
                                return (<div></div>)
                            } else {
                                return (
                                    <Button type="text" disabled={this.disabled} onClick={()=>this.deleteKey(params.index)}>删除</Button>
                                )
                            }
                        }
                    },
                ]
            }
        },
        computed: {},
        watch: {
            baseData: {
                handler(newValue) {
                    this.model = Object.assign({}, newValue)
                }
            },
        },
        created() {
        },
        mounted() {
        },
        methods: {
            deleteKey(index) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除该字段',
                    onOk: () => {
                        this.model.config.splice(index, 1)
                    },
                });
            },
            addConfigData() {
                if (this.model.config.some(item => !item.key)) {
                    this.$Message.error('字段名称必填');
                    return
                }
                if (this.model.config.some(item => item.errorKey)) {
                    return
                }
                this.model.config.push({
                    key: '',
                    type: 0,
                });
            },
            handleBlur(e,index) {
                if (!e.target.value) {
                    this.$Message.error('字段名称必填');
                    this.$nextTick(() => {
                        this.$set(this.model.config[index], 'errorKey', true);
                    });
                    return
                }
                // 验证是否重复
                let result = this.model.config.some((item, idx) => item.key == e.target.value&&idx!=index);
                if (result) {
                    this.$Message.error('字段名称已存在');
                    this.$nextTick(() => {
                        this.$set(this.model.config[index], 'errorKey', true);
                    });
                    return
                }
                this.$set(this.model.config[index], 'errorKey', false);
            },
            validateForm() {
                return new Promise((resolve, reject) => {
                    if (this.model.config.some(item => !item.key)) {
                        this.$Message.error('字段名称不能为空');
                        reject()
                    } else if (this.model.config.some(item => item.errorKey)) {
                        reject()
                    } else {
                        resolve()
                    }
                })
            },
            getParams() {
                this.model.config.map(item => {
                    delete item.errorKey
                });
                return {
                    ...this.model,
                    config: JSON.stringify(this.model.config)
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .base-data {
        /deep/ .form-title.hasMargin {
            margin-bottom: 10px;
        }
        .ivu-form .ivu-form-item {
            margin-bottom: 0;
        }
        .tip.danger-color {
            font-size: 14px;
            font-weight: 500;
        }
    }
    .config-data {
        margin-top: 10px;
        max-width: 813px;
        .ivu-btn {
            width: 100%;
            padding-top: 16px;
            padding-bottom: 16px;
            height: inherit;
            transform: translateY(-1px);
        }
        .error {
            /deep/ .ivu-input {
                border-color: #ed4014;
            }
        }
        /deep/ .ivu-table {
            th,
            td {
                border-right: none;
                border-color: $border-color;
            }
            .ivu-table-header {
                thead tr th {
                    background-color: $background-color;
                }
                .ivu-table-cell {
                    padding: 16px 0;
                }
            }
            .ivu-table-body {
                .ivu-table-cell {
                    padding: 10px 0;
                    .edit-table-input {
                        padding-right: 10px;
                    }
                }
            }
        }
    }
</style>