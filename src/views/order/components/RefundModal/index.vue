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
    <kdx-modal-frame v-model="value" :width="430" :closable="false" okText="关闭并退款" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <div class="order-list-refund-modal">
            <div class="refund-box">
                <div class="icon">
                    <Icon type="ios-help-circle"/>
                </div>
                <div class="content">
                    <div class="title">
                        是否关闭订单并退款
                    </div>
                    <div class="text">
                        请填写关闭订单原因及管理员密码
                    </div>
                    <div class="input">
                        <Form v-if="value" ref="form" :model="model" :rules="rules" @submit.native.prevent>
                            <FormItem prop="refund_reason">
                                <Input type="textarea" v-model="model.refund_reason" autofocus maxlength="40" show-word-limit placeholder="请输入关闭订单原因(非必填)"></Input>
                            </FormItem>
                            <FormItem prop="password">
                                <Input v-model="model.password" :type="showPassword? 'password' : 'text'"
                                       :icon="showPassword? ' iconfont icon-eye-off': ' iconfont icon-eye'"
                                       placeholder="请输入管理员密码"
                                       class="width-350" @on-click="passwordClick" />
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "index",
        props: {
            id: {
                type: [String, Number],
                required: true
            }
        },
        data() {
            return {
                model: {
                    password: '',
                    /* 关闭订单原因 */
                    refund_reason: ''
                },
                rules: {
                    password: [
                        {required: true, message: '管理员密码必填'}
                    ]
                },
                value: false,
                showPassword: true,
                loading: false
            };
        },
        methods: {
            setValue() {
                this.value = true;
                if (this.value) {
                    this.model.password = '';
                }
            },
            handleCancel() {
                this.value = false;
                this.model.refund_reason = '';
            },
            handleOk() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        let params = {
                            order_id: this.id,
                            password: this.model.password,
                            refund_reason: this.model.refund_reason
                        };
                        if(this.loading ) return;
                        this.loading = true;
                        this.$api.orderApi.refundOrder(params).then(res => {
                            if (res.error === 0) {
                                this.$Message.success('退款操作成功');
                                this.value = false;
                                this.model.refund_reason = '';
                                this.$emit('on-refresh');
                            }
                        }).finally(()=> {
                            this.loading = false
                        });
                    }
                });
            },
            passwordClick() {
                this.showPassword = !this.showPassword;
            }
        }
    };
</script>

<style scoped lang="scss">
    .order-list-refund-modal {
        padding: 32px 20px 26px;
        .refund-box {
            display: flex;
            .icon {
                font-size: 24px;
                color: $warning-color;
                padding-right: 10px;
                /deep/ .ivu-icon {
                    vertical-align: super;
                }
            }
            .content {
                .title {
                    @include font-16-22-bold;
                    color: $text-first;
                    padding: 1px;
                }
                .text {
                    @include font-14-20;
                    padding: 10px 0;
                }
                .ivu-form-item {
                    margin-bottom: 9px !important;
                }
            }
        }
    }
</style>
