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
        <kdx-content-bar>
            <div class="content">
                <kdx-form-title>交易设置</kdx-form-title>
                <Form ref="form" :model="model" :rules="rules" :label-width="150">
                    <FormItem label="未付款订单：" prop="close_type">
                        <RadioGroup v-model="model.close_type">
                            <Radio label="1" :disabled='noManagePerm'>
                                <span>永不关闭</span>
                            </Radio>
                            <Radio label="2" :disabled='noManagePerm'>
                                <span>自定义关闭时间</span>
                            </Radio>
                        </RadioGroup>
                        <div class="payment-setting-main" v-if="model.close_type==='2'">
                            <FormItem label="拍下未付款订单：" class="number-input no-width" prop="close_time">
                                <div class="flex width-160">
                                    <kdx-rr-input
                                        v-model="model.close_time"
                                        number
                                        :minValue="20"
                                        :maxValue="1440"
                                        :fixed="0"
                                        :disabled='noManagePerm'
                                    ></kdx-rr-input>
                                    <span class="ivu-input-group-append item-append">分钟</span>
                                </div>
                                <span class="paddingL">内未付款，自动关闭订单</span>
                            </FormItem>
                            <kdx-hint-text class="ml-150">订单取消时间必须在20-1440分钟之间。</kdx-hint-text>
<!--                            <FormItem label="消息通知：" style="margin-top:30px" class="label-width-82">-->
<!--                                <RadioGroup vertical v-model="model.close_notice_type">-->
<!--                                    <Radio label="1">-->
<!--                                        <span>不发送消息通知</span>-->
<!--                                    </Radio>-->
<!--                                    <Radio label="2" class="check-radio  marginT-10">-->
<!--                                        <FormItem label="订单关闭前" class="number-input" prop="close_notice_time" :label-width="100">-->
<!--                                            <div class="flex width-160">-->
<!--                                                <kdx-rr-input v-model="model.close_notice_time" number :minValue="0" :fixed="0"></kdx-rr-input>-->
<!--                                                <span class="ivu-input-group-append item-append">分钟</span>-->
<!--                                            </div>-->
<!--                                            <span class="paddingL">发送未付款通知消息</span>-->
<!--                                        </FormItem>-->
<!--                                    </Radio>-->
<!--                                    <kdx-hint-text class="message-hint">-->
<!--                                        开启后需要在消息提醒中设置-->
<!--                                        <router-link to="/setting/notice/index" target="_blank">消息模板</router-link>-->
<!--                                    </kdx-hint-text>-->
<!--                                </RadioGroup>-->
<!--                            </FormItem>-->
                        </div>
                    </FormItem>
                    <FormItem label="自动收货：" class="label-width-140">
                        <RadioGroup v-model="model.auto_receive">
                            <Radio label="1" :disabled='noManagePerm'>
                                <span>不自动收货</span>
                            </Radio>
                            <Radio label="2" :disabled='noManagePerm'>
                                <span>自定义收货时间</span>
                            </Radio>
                        </RadioGroup>
                        <div class="payment-setting-main" v-if="model.auto_receive==='2'">
                            <FormItem label="发货：" :label-width="150" class="number-input send-goods" prop="auto_receive_days">
                                <div class="flex width-160">
                                    <kdx-rr-input  v-model="model.auto_receive_days" number :minValue="7" :fixed="0" :maxValue="30" :disabled='noManagePerm'></kdx-rr-input>
                                    <span class="ivu-input-group-append item-append">天</span>
                                </div>
                                <span class="paddingL">后自动收货</span>
                            </FormItem>
                            <kdx-hint-text class="ml-150">自动确认收货时间必须在7-30天之间。</kdx-hint-text>
                        </div>
                    </FormItem>
<!--                    <FormItem label="库存预警通知：" class="label-width-140">-->
<!--                        <RadioGroup v-model="model.stock_warning_state">-->
<!--                            <Radio label="1">-->
<!--                                <span>开启</span>-->
<!--                            </Radio>-->
<!--                            <Radio label="2">-->
<!--                                <span>关闭</span>-->
<!--                            </Radio>-->
<!--                        </RadioGroup>-->
<!--                        <div class="payment-setting-main" v-if="model.stock_warning_state=='1'">-->
<!--                            <FormItem label="库存少于：" class="number-input label-width-82" prop="stock_warning_num">-->
<!--                                <div class="flex width-160">-->
<!--                                    <kdx-rr-input v-model="model.stock_warning_num" :minValue="1" :fixed="2" number></kdx-rr-input>-->
<!--                                    <span class="ivu-input-group-append item-append">件</span>-->
<!--                                </div>-->
<!--                            </FormItem>-->
<!--                            <kdx-hint-text style="padding-left: 130px">-->
<!--                                开启后需要在-->
<!--                                <router-link to="/setting/notice/index" target="_blank">消息模板</router-link>中设置消息模板。库存低于多少件后，每当减少库存时会为卖家推送一次库存警报，默认为5件-->
<!--                            </kdx-hint-text>-->
<!--                        </div>-->
<!--                    </FormItem>-->

                    <FormItem label="发票设置："  class="label-width-140">
                        <CheckboxGroup v-model="invoice" @on-change="invoiceChoose">
                            <Checkbox label="1" :disabled='noManagePerm'>纸质发票</Checkbox>
                            <Checkbox label="2" :disabled='noManagePerm'>电子发票</Checkbox>
                        </CheckboxGroup>
                    </FormItem>

                    <kdx-form-title>评价设置</kdx-form-title>
                    <FormItem label="订单评价：">
                        <RadioGroup v-model="model.order_comment">
                            <Radio label="1" :disabled='noManagePerm'>
                                <span>开启</span>
                            </Radio>
                            <Radio label="0" :disabled='noManagePerm'>
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="显示评价：">
                        <RadioGroup v-model="model.show_comment">
                            <Radio label="1" :disabled='noManagePerm'>
                                <span>开启</span>
                            </Radio>
                            <Radio label="0" :disabled='noManagePerm'>
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                        <kdx-hint-text>关闭时建议同步在商品详情页装修版块移除【商品评价】组件</kdx-hint-text>
                    </FormItem>
                    <FormItem label="评价审核：">
                        <RadioGroup v-model="model.comment_audit">
                            <Radio label="1" :disabled='noManagePerm'>
                                <span>开启</span>
                            </Radio>
                            <Radio label="0" :disabled='noManagePerm'>
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="评价会员昵称脱敏：">
                        <RadioGroup v-model="model.comment_desensitization">
                            <Radio label="1" :disabled='noManagePerm'>
                                <span>开启</span>
                            </Radio>
                            <Radio label="0" :disabled='noManagePerm'>
                                <span>关闭</span>
                                <kdx-hint-tooltip type="image" :image="require('@/assets/image/example/desensitization.png')"></kdx-hint-tooltip>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="自动默认评价：">
                        <RadioGroup v-model="model.auto_comment">
                            <Radio label="1" :disabled='noManagePerm'>
                                <span>开启</span>
                            </Radio>
                            <Radio label="0" :disabled='noManagePerm'>
                                <span>关闭</span>
                            </Radio>
                        </RadioGroup>
                        <kdx-hint-text>自动默认评价生成后默认审核通过，在用户端显示</kdx-hint-text>
                        <div class="payment-setting-main" v-if="model.auto_comment==='1'">
                            <FormItem label="自动评价时间：" prop="auto_comment_day">
                                <div class="flex">
                                    <span class="paddingR">订单完成</span>
                                    <kdx-rr-input v-model="model.auto_comment_day" class="width-160" number :minValue="7" :maxValue="180" :fixed="0" :disabled='noManagePerm'>
                                        <span slot="append">天</span>
                                    </kdx-rr-input>
                                    <span class="paddingL">买家未评价的，自动生成默认五星评价</span>
                                </div>
                                <kdx-hint-text class="ml-150">自动评价时间支持7-180天</kdx-hint-text>
                            </FormItem>
                            <FormItem label="默认评价内容：" class="r-form-item-checkbox" prop="auto_comment_content" style="margin-top: 30px;">
                                <Input v-model="model.auto_comment_content" type="textarea" :autosize="{ minRows: 3 }" maxlength="500" show-word-limit class="width-430" placeholder="请输入评价"/>
                            </FormItem>
                        </div>
                    </FormItem>
                </Form>
            </div>
            <template #btn>
                    <Button class="primary-long" :disabled='noManagePerm' @click="handleSave">保存</Button>
            </template>
        </kdx-content-bar>
</template>

<script>
    export default {
        name: 'index',
        data() {
            // 解决iview空字段校验的bug
            const emptyValidtor = (...args) => {
                args[2]()
            }
            return {
                model: {
                    close_type: '2',
                    close_time: 20,
                    auto_receive: '2',
                    auto_receive_days: 7,
                    invoice: '0',
                    order_comment: '0',
                    show_comment: '0',
                    comment_audit: '0',
                    comment_desensitization: '1',
                    auto_comment: '',
                    auto_comment_day: '',
                    auto_comment_content: '此用户没有填写评价'
                },
                defaultInfo: {},
                invoice: [],
                rules: {
                    close_type: [{
                        validator: emptyValidtor
                    }],
                    close_time: [{
                        required: true,
                        message: '请输入订单取消时间'
                    }],
                    auto_receive_days: [{
                        required: true,
                        message: '请输入自动收货天数'
                    }],
                    auto_comment_day: [{required: true, message: '订单时间必填'}],
                    auto_comment_content: [{required: true, message: '评价内容必填'}],
                }
            }
        },
        computed: {
            noManagePerm() {
                return !this.$getPermMap("sysset.trade.manage");
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                this.$api.settingApi.getBusinessSetting().then(res => {
                    let {
                        error,
                        ...info
                    } = res
                    if (error === 0) {
                        let keys = [
                            'close_time',
                            'auto_receive_days'
                        ]
                        this.$store.commit('config/setBusiness', info)
                        keys.forEach(key => {
                            info[key] = this.stringToNum(info[key])
                        })
                        this.invoice = this.parseInvoice(info.invoice)
                        this.model = { ...info
                        }
                        this.defaultInfo = { ...info
                        }
                    }
                })
            },
            // 转换发票数据类型
            parseInvoice(param) {
                let flag = typeof param === 'string'
                let paramArr = [{
                        id: '0',
                        arr: []
                    },
                    {
                        id: '3',
                        arr: ['1', '2']
                    }
                ]
                if (flag) {
                    let res = paramArr.filter(obj => obj.id === param)
                    return res.length ? res[0].arr : [param]
                } else {
                    let res = paramArr.filter(
                        obj => obj.arr.length === param.length
                    )
                    return res.length ? res[0].id : param[0]
                }
            },
            // 字符串转换成数字
            stringToNum(num) {
                if (typeof num === 'string' && num != 'null') {
                    return parseFloat(num)
                } else {
                    return null
                }
            },
            invoiceChoose(e) {
                this.model.invoice = this.parseInvoice(e)
            },
            handleSave() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.$api.settingApi
                            .editBusinessSetting(this.dealData())
                            .then(res => {
                                if (res.error == 0) {
                                    this.getData()
                                    this.$Message.success('操作成功')
                                }
                            })
                    }
                })
            },
            dealData() {
                let obj = {
                    ...this.model
                }
                // 过滤无效数据
                if (obj.close_type == '1') {
                    delete obj.close_time
                }
                if (obj.auto_receive == '1') {
                    delete obj.auto_receive_days
                }
                obj = { ...this.defaultInfo,
                    ...obj
                }
                return obj
            }
        }
    }
</script>

<style scoped lang="scss">
    .content {
        padding: 40px;
        background: #fff;
        margin:20px auto 0;
        min-height: 100%;

        .ml-150 {
            margin-left: 150px;
        }
        .mt-20 {
            margin-top: 20px;
        }
        .label-width-150 {
            /deep/ .ivu-form-item-label {
                width: 150px;
            }
        }
        .label-width-82 {
            /deep/ .ivu-form-item-label {
                width: 82px;
            }
        }
        .label-width-70 {
            /deep/ .ivu-form-item-label {
                width: 70px;
            }
        }
        .label-width-52 {
            /deep/ .ivu-form-item-label {
                width: 52px;
            }
        }
        .example {
            color: #939799;
            &:hover {
                color: #2b85e4;
            }
        }
        .payment-setting-main {
            padding: 30px 20px;
            margin-top: 10px;
            background-color: #F4F6F8;
            .paddingR {
                padding-right: 10px;
            }
            .paddingL {
                padding-left: 10px;
            }
            /deep/ .ivu-form-item {
                margin-bottom: 0;
                .ivu-form-item-content {
                    .ivu-form-item-error-tip {
                        padding-top: 20px;
                    }
                }
            }
            /deep/ .hint-text {
                padding-top: 3px;
                .ivu-btn {
                    font-weight: bold;
                }
                a {
                    font-weight: bold;
                }
            }

              .message-hint {
            /*padding-top: 25px;*/
        }
        }
        .check-radio {
            display: flex;
            align-items: center;
        }
        .number-input {
            display: flex;
            /deep/ .ivu-form-item-content {
                width: 100%;
                display: flex;
            }
            &.no-width {
                /deep/ .ivu-form-item-content {
                    width: inherit;
                }
            }
            &.send-goods {
                /deep/ .ivu-form-item-label {
                    flex-shrink: 0;
                }
            }
            .item-append {
                display: inline-block;
                padding: 0 7px;
                width: auto;
                height: 32px;
                line-height: 32px;
            }
            /deep/ .ivu-input-number {
                flex: 1;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
        }
    }

.ivu-tooltip-popper.ivu-tooltip-light[x-placement] {
    padding: 0;
    .ivu-tooltip-content {
        .ivu-tooltip-inner {
            padding: 6px;
        }

        .ivu-tooltip-arrow {
            display: none;
        }
    }
}
</style>
