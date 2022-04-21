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
            <Form ref="form" :model="model" :rules="rules" :label-width="120">
                <FormItem label="未付款订单：" prop="close_type">
                    <RadioGroup v-model="model.close_type">
                        <Radio label="0" :disabled="noManagePerm">
                            <span>永不关闭</span>
                        </Radio>
                        <Radio label="1" :disabled="noManagePerm">
                            <span>自定义关闭时间</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text>秒杀抢购只读取本交易规则设置</kdx-hint-text>
                    <div
                            class="payment-setting-main"
                            v-if="model.close_type === '1'"
                    >
                        <FormItem
                                :label-width="135"
                                label="拍下未付款订单"
                                class="number-input no-width"
                                prop="close_time"
                        >
                            <div class="flex width-160">
                                <kdx-rr-input
                                        v-model="model.close_time"
                                        number
                                        :minValue="5"
                                        :maxValue="60"
                                        :fixed="0"
                                        :disabled="noManagePerm"
                                ></kdx-rr-input>
                                <span class="ivu-input-group-append item-append"
                                >分钟</span
                                >
                            </div>
                            <span class="paddingL">内未付款，自动关闭订单</span>
                        </FormItem>
                        <kdx-hint-text class="ml-150"
                        >订单自动关闭时间必须在5-60分钟之间，订单关闭后自动退还库存。</kdx-hint-text>
                    </div>
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button type="primary" class="primary-long" :disabled="noManagePerm" @click.native="setData">保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
    export default {
        computed: {
            noManagePerm() {
                //管理权限
                return !this.$getPermMap("seckill.setting.manage");
            },
        },
        data() {
            return {
                model: {
                    close_type: "1",
                    close_time: "15",
                },
                rules: {
                    close_type: [{ required: true, message: "请选择订单关闭方式" }],
                    close_time: [{ required: true, message: "请选择关闭时间" }],
                },
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$api.seckillApi.getSeckillSet().then((res) => {
                    if (res.error === 0) {
                        let { close_type, close_time } = res.data;
                        this.model = { ...this.model, close_type, close_time };
                    }
                });
            },
            setData() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$api.seckillApi
                            .setSeckillSet(this.model)
                            .then((res) => {
                                if (res.error === 0) {
                                    this.$Message.success("操作成功");
                                    this.getData();
                                }
                            });
                    }
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    .content {
        background-color: #fff;
        padding: 40px;
        min-height: 100%;
        margin: 0 auto 0;

        .payment-setting-main {
            padding: 30px 20px;
            margin-top: 10px;
            background-color: #f4f6f8;
            .paddingR {
                padding-right: 10px;
            }
            .paddingL {
                padding-left: 10px;
            }

            /deep/ .ivu-form-item {
                margin-bottom: 0;
            }

            .ivu-form-item-error+.hint-text {
                padding-top: 20px;
            }

            /deep/ .hint-text {
                padding-top: 10px;
                .ivu-btn {
                    font-weight: bold;
                }
                a {
                    font-weight: bold;
                }
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

            }
        }
    }
</style>
