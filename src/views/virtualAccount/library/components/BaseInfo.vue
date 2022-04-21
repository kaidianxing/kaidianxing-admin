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
    <div class="base-info">
        <Form ref="form" :model="model" :rules="rules" :label-width="120">
            <kdx-form-title>基础信息</kdx-form-title>
            <FormItem label="卡密库名称：" prop="name" :error="nameError">
                <Input v-model="model.name" maxlength="20" show-word-limit class="width-340" placeholder="如：游戏点卡" @on-blur="checkVirtualName"/>
            </FormItem>
            <FormItem class="r-form-item-checkbox" label="使用说明：">
                <RadioGroup v-model="model.use_description">
                    <Radio :label="1">开启</Radio>
                    <Radio :label="0">关闭
                        <kdx-hint-tooltip
                                style="margin-left:-6px;"
                                type="image"
                                :image="require('@/assets/image/virtualAccount/info.png')"
                        ></kdx-hint-tooltip>
                    </Radio>
                </RadioGroup>
                <div class="bg-color" v-if="model.use_description ===  1">
                    <FormItem label="文字标题：" prop="use_description_title">
                        <Input v-model="model.use_description_title" maxlength="20" show-word-limit class="width-340" placeholder="请输入使用说明标题"/>
                    </FormItem>
                    <FormItem label="说明内容：" prop="use_description_remark">
                        <Input v-model="model.use_description_remark" type="textarea" :rows="1" autosize maxlength="50" show-word-limit class="width-340" placeholder="请输入说明内容"/>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem class="r-form-item-checkbox" label="使用地址：">
                <RadioGroup v-model="model.use_address">
                    <Radio :label="1">开启</Radio>
                    <Radio :label="0">关闭</Radio>
                </RadioGroup>
                <kdx-hint-text>
                    <span>开启后，手机浏览器H5端用户在完成订单后，可直接点击跳转到相应卡密使用的地址。</span>
                    <kdx-hint-tooltip  type="image" :image="require('@/assets/image/virtualAccount/address.png')"></kdx-hint-tooltip>
                </kdx-hint-text>
                <div class="bg-color" v-if="model.use_address ===  1">
                    <FormItem label="文字标题：" prop="use_address_title">
                        <Input v-model="model.use_address_title" maxlength="20" show-word-limit class="width-340" placeholder="请输入使用说明标题"/>
                    </FormItem>
                    <FormItem label="链接地址：" prop="use_address_address">
                        <Input v-model="model.use_address_address" class="width-340" placeholder="支持http或https"/>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem class="r-form-item-checkbox" label="发送顺序：">
                <RadioGroup v-model="model.sequence">
                    <Radio :label="0">按最新导入发送</Radio>
                    <Radio :label="1">按卡密权重值发送</Radio>
                </RadioGroup>
                <kdx-hint-text v-if="model.sequence === 0">按照最新的添加时间进行发送，时间相同时按照自增ID倒叙依次发送</kdx-hint-text>
                <kdx-hint-text v-if="model.sequence === 1">新增卡密数据默认权重为0，在不改变卡密权重时，按照数据库中的自增ID进行发送，权重值数字越大，权重越大。</kdx-hint-text>
            </FormItem>
            <FormItem class="r-form-item-checkbox" label="邮箱发送：">
                <RadioGroup v-model="model.mailer">
                    <Radio :label="1" :disabled="mailer_status">开启</Radio>
                    <Radio :label="0" :disabled="mailer_status">关闭</Radio>
                </RadioGroup>
                <kdx-hint-text>
                    <div v-if="mailer_status">
                        <span class="danger-color marginR-10">邮箱配置暂未开启，请前往消息通知进行配置</span>
                        <Button class="marginR-10" type="text" @click="toSet">立即配置</Button>
                        <Button type="text" @click="getMailer">刷新</Button>
                        <div><span>开启后，支持卡密信息已邮件形式发送到用户邮箱。</span></div>
                    </div>
                    <div v-else>
                        <span>开启后，支持卡密信息已邮件形式发送到用户邮箱。</span>
                        <Button class="marginR-10" type="text" @click="toSet">立即配置</Button>
                        <Button type="text" @click="getMailer">刷新</Button>
                    </div>
                </kdx-hint-text>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "BaseInfo",
        components: {},
        props: {
            baseInfo: {
                type: Object,
                default: () => {}
            },
            disabled: {
                type: Boolean,
                default: false
            },
            mailer_status: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                nameError: '', // 错误提示
                oldName: '',
                model: {
                    name: '',
                    use_description: 0,
                    use_description_title: '使用说明',
                    use_description_remark: '',
                    use_address: 0,
                    use_address_title: '使用地址',
                    use_address_address: '',
                    sequence: 0,
                    mailer: 0,
                },
                rules: {
                    name: [
                        {required: true, message: '卡密库名称必填'},
                        {
                            validator: (rule, value, callback) => {
                                if (this.nameError) {
                                    callback(new Error('卡密库名称已存在'))
                                } else {
                                    callback()
                                }
                            },
                            trigger: 'blur'
                        }
                    ],
                    use_description_title: [
                        {required: true, message: '使用说明标题必填'}
                    ],
                    use_description_remark: [
                        {required: true, message: '使用说明必填'}
                    ],
                    use_address_title: [
                        {required: true, message: '使用地址标题必填'}
                    ],
                    use_address_address: [
                        {required: true, message: '使用地址必填'}
                    ],
                }
            }
        },
        computed: {},
        watch: {
            baseInfo: {
                handler(newValue) {
                    this.oldName = newValue.name;
                    this.model = Object.assign({}, newValue)
                }
            },
        },
        created() {
        },
        mounted() {
        },
        methods: {
            getMailer() {
                this.$emit('getMailer')
            },
            checkVirtualName(e) {
                // 编辑
                if (e.target.value === this.oldName && this.disabled) {
                    return
                }
                if (e.target.value) {
                    let obj = {
                        name: e.target.value
                    };
                    this.nameError = '';
                    this.$api.virtualAccountApi.checkvirtualAccounName(obj, {nomessage: true}).then(res => {
                        if (res.error === 0) {
                            this.nameError = ''
                        } else {
                            this.nameError = '卡密库名称已存在'
                        }
                    });
                }
            },
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            resolve(valid)
                        } else {
                            reject()
                        }
                    })
                })
            },
            getParams() {
                return {
                    ...this.model
                }
            },
            toSet() {
                this.$utils.openNewWindowPage('/notice/email/index')
            }
        },
    }
</script>

<style lang="scss" scoped>
    .base-info {
        .bg-color {
            margin-top: 10px;
            padding: 30px 0;
            background-color: #F4F6F8;
            /deep/ .ivu-form-item {
                &:last-child {
                    margin-bottom: 0;
                }
                .ivu-form-item-content {
                    .ivu-form-item-error-tip {
                        margin-left: 120px;
                    }
                }
            }
        }
    }
</style>