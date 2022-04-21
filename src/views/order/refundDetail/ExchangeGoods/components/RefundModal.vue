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
    <kdx-modal-frame
        v-model="value"
        title="维权处理"
        :width="700"
        @on-cancel="handleCancel"
        @on-ok="handleOk"
    >
        <Form
            ref="form"
            :label-width="120"
            :model="model"
            class="order-refund-detail-refund-modal"
            :rules="rules"
        >
            <FormItem label="维权类型：" class="r-form-item-text">
                <kdx-tag-label type="danger" size="small">换货</kdx-tag-label>
            </FormItem>
            <FormItem
                label="处理方式："
                class="r-form-item-checkbox"
                porp="type"
            >
                <RadioGroup v-model="model.type">
                    <Radio label="0" v-if="status === 0">驳回申请</Radio>
                    <Radio label="1" v-if="status === 0">通过申请</Radio>
                    <Radio label="2" v-if="status < 3">确认发货</Radio>
                    <Radio label="3" v-if="status === 3">
                        关闭申请（确认换货完成）
                    </Radio>
                </RadioGroup>
                <kdx-hint-alert
                    :show-icon="false"
                    type="info"
                    v-show="model.type === '1'"
                >
                    通过申请后需要收到客户寄回商品才可进行下一步操作
                </kdx-hint-alert>
                <kdx-hint-alert
                    :show-icon="false"
                    type="info"
                    v-show="model.type === '2' && status < 2"
                >
                    无需客户寄回商品，商家直接发换货商品
                </kdx-hint-alert>
            </FormItem>
            <FormItem
                label="驳回原因："
                v-show="model.type === '0'"
                porp="reason"
            >
                <Input
                    type="textarea"
                    class="width-430"
                    placeholder="请输入"
                    autosize
                    :maxlength="200"
                    v-model="model.reason"
                />
            </FormItem>
            <FormItem
                label="退货地址："
                prop="address"
                v-if="model.type === '1'"
            >
                <Select class="width-430" v-model="model.address">
                    <Option
                        :label="address.title"
                        :value="address.id"
                        v-for="address in address.list"
                        :key="address.id"
                    ></Option>
                </Select>
            </FormItem>
            <!-- <FormItem label="留言：" v-show="model.type === '1'" prop="message">
                <Input
                    v-model="model.message"
                    type="textarea"
                    autosize
                    :maxlength="200"
                    class="width-430"
                    placeholder="请输入"
                />
            </FormItem> -->
            <FormItem
                label="选择快递公司："
                prop="express_com"
                v-if="model.type === '2'"
            >
                <select-express
                    class="width-340"
                    :value.sync="model.express_com"
                    :option-data="express.list"
                ></select-express>
            </FormItem>
            <FormItem
                label="快递单号："
                v-if="model.type === '2'"
                prop="express_sn"
            >
                <i-input
                    class="width-340"
                    placeholder="请输入"
                    v-model="model.express_sn"
                />
            </FormItem>
        </Form>
    </kdx-modal-frame>
</template>

<script>
import SelectExpress from '../../../components/SelectExpress'

export default {
    name: 'RefundModal',
    components: { SelectExpress },
    props: {
        visible: {
            type: Number,
            default: 0,
        },
        data: {
            type: Object,
            default: () => {},
        },
        // 维权状态
        status: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            value: false,
            model: {
                type: '0',
                // message: '',
                address: '',
                express_com: '',
                express_sn: '',
                dispatch_type: '30',
            },
            address: {
                list: [],
            },
            express: {
                list: [],
            },
            rules: {
                address: [{ required: true, message: '请选择退货地址' }],
                express_com: [{ required: true, message: '请选择快递公司' }],
                express_sn: [
                    {
                        required: true,
                        message: '请输快递单号',
                        trigger: 'blur',
                    },
                ],
                dispatch_type: [{ required: true, message: '配送方式必选' }],
            },
        }
    },
    watch: {
        visible() {
            this.value = true
            this.getAddress()
            this.getExpress()
        },
        status: {
            handler(val) {
                if (val == 1 || val == 2) {
                    this.model.type = '2'
                } else if (val == 3) {
                    this.model.type = '3'
                }
            },
            immediate: true,
        },
    },
    methods: {
        getAddress() {
            if (this.address.list.length) {
                return
            }
            this.$api.settingApi.getAllRefundAddress().then((res) => {
                if (res.error === 0) {
                    this.address.list = res.list
                }
            })
        },
        getExpress() {
            if (this.express.list.length) {
                return
            }

            this.$api.settingApi.getExpressList().then((res) => {
                if (res.error === 0) {
                    this.express.list = res.list
                }
            })
        },
        handleCancel() {
            this.value = false
            this.$refs.form.resetFields()
        },
        handleOk() {
            let type = this.model.type
            let {
                id,
                refund_type,
                refund_info: { order_goods_id },
            } = this.data

            let data = {
                order_id: id,
            }

            if (refund_type == '2') {
                data.order_goods_id = order_goods_id
            }
            if (type === '0') {
                this.rejectHandler(data)
            } else if (type === '1') {
                this.agreeHandler(data)
            } else if (type === '2') {
                this.sureHandler(data)
            } else {
                this.closeHandler(data)
            }
        },
        closeHandler(data) {
            this.$api.orderApi
                .exchangeClose(data)
                .then((res) => {
                    if (res.error === 0) {
                        this.$Message.success('操作成功')
                        this.$parent.$parent.getData()
                    }
                })
                .finally(() => {
                    this.value = false
                })
        },
        sureHandler(data) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let { code, name, key } = this.express.list.filter(
                        (list) => list.id === this.model.express_com
                    )[0]
                    data = Object.assign(data, {
                        seller_express_sn: this.model.express_sn,
                        seller_express_name: name,
                        seller_express_code: code,
                        seller_express_encoding: key,
                    })
                    this.$api.orderApi
                        .exchangeSend(data)
                        .then((res) => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功')
                                this.$parent.$parent.getData()
                            }
                        })
                        .finally(() => {
                            this.value = false
                        })
                }
            })
        },
        agreeHandler(data) {
            data.refund_address_id = this.model.address

            // if (this.model.message) {
            //   data.seller_message = this.model.message
            // }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$api.orderApi
                        .agreeReturn(data)
                        .then((res) => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功')
                                this.$parent.$parent.getData()
                            }
                        })
                        .finally(() => {
                            this.value = false
                        })
                }
            })
        },
        autoHandler(data) {
            this.$api.orderApi
                .autoRefund(data)
                .then((res) => {
                    if (res.error === 0) {
                        this.$Message.success('操作成功')
                        this.$parent.$parent.getData()
                    }
                })
                .finally(() => {
                    this.value = false
                })
        },
        manualHandler(data) {
            this.$api.orderApi
                .manualRefund(data)
                .then((res) => {
                    if (res.error === 0) {
                        this.$Message.success('操作成功')
                        this.$parent.$parent.getData()
                    }
                })
                .finally(() => {
                    this.value = false
                })
        },
        rejectHandler(data) {
            if (this.model.reason) {
                data.reject_reason = this.model.reason
            }
            this.$api.orderApi
                .refundRejectOrder(data)
                .then((res) => {
                    if (res.error === 0) {
                        this.$Message.success('操作成功')
                        this.$parent.$parent.getData()
                    }
                })
                .finally(() => {
                    this.value = false
                })
        },
    },
}
</script>

<style scoped lang="scss">
.order-refund-detail-refund-modal {
    padding: 30px 20px 20px 0;
    .ivu-form-item {
        margin-bottom: 20px;
        .hint-alert-component {
            margin-top: 10px;
            p {
                @include font-12-24;
            }
        }
    }
    /deep/ .ivu-form-item-label {
        padding-right: 0;
    }
}
</style>
