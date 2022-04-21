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
        <Form ref="form" :label-width="120" class="order-refund-detail-refund-modal">
            <FormItem label="维权类型：" class="r-form-item-text">
                <kdx-tag-label type="danger" size="small">仅退款</kdx-tag-label>
            </FormItem>
            <FormItem label="处理方式：" class="r-form-item-checkbox">
                <RadioGroup v-model="model.type">
                    <Radio label="0">自动退款</Radio>
                    <Radio label="1">手动退款</Radio>
                    <Radio label="2">驳回申请</Radio>
                </RadioGroup>
                <kdx-hint-alert :show-icon="false" v-show="model.type === '0'">
                    <p>微信支付方式：会返回到相应的支付渠道(如零钱或银行卡)</p>
                    <p>其他支付方式：会返回到微信钱包(需商户平台余额充足)</p>
                    <p>如有余额抵扣：会返回金额到商城用户余额</p>
                    <p>如有积分抵扣：申请维权的订单抵扣积分会返回到用户积分中</p>
                </kdx-hint-alert>
                <kdx-hint-alert :show-icon="false" v-show="model.type === '1'">
                    <p>手动退款：订单会完成退款处理，您用其他方式进行退款</p>
                </kdx-hint-alert>
            </FormItem>
            <!-- <FormItem label="返回方式：" v-show="false&&model.type === '1'">
              <Input v-model="model.style" class="width-430" placeholder="请手动输入返回方式" />
            </FormItem> -->
            <!--      <FormItem label="留言：" v-show="false&&(model.type === '0' || model.type === '1')">-->
            <!--        <Input-->
            <!--          v-model="model.message"-->
            <!--          type="textarea"-->
            <!--          autosize-->
            <!--          :maxlength="200"-->
            <!--          class="width-430"-->
            <!--          placeholder="请输入"-->
            <!--        />-->
            <!--      </FormItem>-->
            <FormItem label="驳回原因：" v-show="model.type === '2'">
                <Input
                        v-model="model.reason"
                        type="textarea"
                        :maxlength="200"
                        class="width-430"
                        placeholder="请输入"
                />
            </FormItem>
        </Form>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: 'RefundModal',
        props: {
            visible: {
                type: Number,
                default: 0
            },
            data: {
                type: Object,
                default: () => {
                }
            }
        },
        data() {
            return {
                value: false,
                isCan: false, // 添加锁
                model: {
                    type: '0',
                    // message: '',
                    reason: ''
                }
            }
        },
        watch: {
            visible() {
                this.value = true
            }
        },
        methods: {

            handleCancel() {
                this.value = false
            },
            handleOk() {
                if (this.isCan) {
                    return;
                }
                let type = this.model.type
                let {
                    id,
                    refund_type,
                    refund_info: {order_goods_id}
                } = this.data

                let data = {
                    order_id: id
                }

                if (refund_type == '2') {
                    data.order_goods_id = order_goods_id
                }
                this.isCan = true;
                if (type === '2') {
                    if (this.model.reason) {
                        data.reject_reason = this.model.reason
                    }
                    this.submit('refundRejectOrder', data)
                } else if (type === '1') {
                    this.submit('manualRefund', data)
                } else {
                    this.submit('autoRefund', data)
                }
            },
            submit(type, data) {
                this.$api.orderApi[type](data)
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('操作成功');
                            this.$parent.$parent.getData()
                        }
                    })
                    .finally(() => {
                        this.value = false;
                        this.isCan = false;
                    })
            },
        }
    }
</script>

<style scoped lang="scss">
    .order-refund-detail-refund-modal {
        padding: 30px 20px 20px 0;

        .ivu-form-item {
            margin-bottom: 20px;
        }

        .hint-alert-component {
            margin-top: 10px;

            p {
                @include font-12-24;
            }
        }
    }
</style>
