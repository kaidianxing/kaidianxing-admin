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
        <div class="safeguard-content">
            <kdx-form-title>维权设置</kdx-form-title>
            <Form ref="form" :model="model" :rules="rules" :label-width="140"  @submit.native.prevent>
                <FormItem label="售后维权申请：" prop="apply_type" class="r-form-item-checkbox">
                    <RadioGroup v-model="model.apply_type">
                        <Radio :disabled='noManagePerm' label="1">
                            <span>完成订单不允许售后</span>
                        </Radio>
                        <Radio :disabled='noManagePerm' label="2">
                            <span>自定义时间</span>
                        </Radio>
                    </RadioGroup>
                    <div class="main marginT-10" v-if="model.apply_type=='2'">
                        <FormItem
                                label="订单完成"
                                class="number-input label-width-100 refund-input"
                                prop="apply_days"
                        >
                            <div class="flex width-160 ">
                                <kdx-rr-input :disabled='noManagePerm'
                                        v-model="model.apply_days"
                                        number
                                        :minValue="0"
                                        :maxValue="30"
                                        :fixed="0"
                                ></kdx-rr-input>
                                <span class="ivu-input-group-append item-append">天</span>
                            </div>
                            <span class="paddingL">内可发起售后维权</span>
                        </FormItem>
                        <kdx-hint-text style="margin-left: 120px">售后维权时间必须在订单完成0-30天之间。</kdx-hint-text>
                    </div>
                </FormItem>
                <FormItem label="退款说明：">
                    <Input :disabled='noManagePerm'
                            type="textarea"
                            autosize
                            style="width: 500px"
                            placeholder="订单完成后七天内退换货"
                            v-model="model.refund_info"
                    ></Input>
                    <kdx-hint-text>
                        用户在申请退款页面的说明
                        <kdx-hint-tooltip type="image"
                                      :image="require('@/assets/image/example/refund-tip.png')"></kdx-hint-tooltip>
                    </kdx-hint-text>
                </FormItem>
                <FormItem label="单品退换货：">
                    <RadioGroup v-model="model.single_refund_enable">
                        <Radio :disabled='noManagePerm' label="1">
                            <span>开启</span>
                        </Radio>
                        <Radio :disabled='noManagePerm' label="0">
                            <span>关闭</span>
                        </Radio>
                    </RadioGroup>
                    <kdx-hint-text>
                        开启后，订单支持单件商品退换，订单优惠金额按比例分摊至每件商品
                        <kdx-hint-tooltip type="image"
                                      :image="require('@/assets/image/example/single-refund.png')"></kdx-hint-tooltip>

                    </kdx-hint-text>
                </FormItem>
                <FormItem label="超时取消维权：" prop="timeout_cancel_refund " class="r-form-item-checkbox">
                    <RadioGroup v-model="model.timeout_cancel_refund">
                        <Radio :disabled='noManagePerm' label="0">
                            <span>永不关闭</span>
                        </Radio>
                        <Radio :disabled='noManagePerm' label="1">
                            <span>自定义关闭时间</span>
                        </Radio>
                    </RadioGroup>
                    <div class="main marginT-10" v-if="model.timeout_cancel_refund=='1'">
                        <FormItem
                                label="商家同意退货退款/换货申请后"
                                class="number-input label-width-300 refund-input"
                                prop="timeout_cancel_refund_days"
                        >
                            <div class="flex width-160 ">
                                <kdx-rr-input :disabled='noManagePerm'
                                          v-model="model.timeout_cancel_refund_days"
                                          number
                                          :minValue="1"
                                          :maxValue="30"
                                          :fixed="0"
                                ></kdx-rr-input>
                                <span class="ivu-input-group-append item-append">天</span>
                            </div>
                            <span class="paddingL">内买家未提交快递单号的，自动取消售后维权</span>
                        </FormItem>
                        <kdx-hint-text style="margin-left: 250px">取消售后维权时间必须在1-30天之间。</kdx-hint-text>
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
        components: {},
        data() {
            // 解决iview空字段校验的bug
            const emptyValidtor = (...args) => {
                args[2]();
            };

            return {
                model: {
                    apply_type: '2',
                    apply_days: 0,
                    refund_info: '',
                    single_refund_enable: '1',
                    platform_join: '1',
                    timeout_cancel_refund : '0',
                    timeout_cancel_refund_days : 1
                },
                defaultInfo: {},
                rules: {
                    apply_days: [{required: true, message: '请输入完成天数'}],
                    apply_type: [{validator: emptyValidtor}],
                    timeout_cancel_refund_days : [{required: true, message: '请输入取消维权时间'}],
                    timeout_cancel_refund: [{validator: emptyValidtor}]
                }
            };
        },
        computed: {
            noManagePerm(){//管理权限
                return !this.$getPermMap('sysset.refund.manage')
            },
        },
        mounted() {
            this.getData();
        },
        methods: {
            // 字符串转换成数字
            stringToNum(num) {
                if (typeof num === 'string' && num != 'null') {
                    return parseFloat(num);
                } else {
                    return null;
                }
            },
            getData() {
                this.$api.settingApi.getSafeguardSetting().then(res => {
                    let {error, ...info} = res;
                    if (error === 0) {
                        info.apply_days = this.stringToNum(info.apply_days);
                        this.model = {...this.model,...info};
                        this.defaultInfo = {...info};
                    }
                });
            },

            handleSave() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.handleSubmit();
                    }
                });
            },
            // 提交数据
            handleSubmit() {
                let obj = {
                    ...this.model
                };

                // 过滤数据 保留以前保存的数据
                if (obj.apply_type == '1') {
                    delete obj.apply_days;
                    obj = {...this.defaultInfo, ...obj};
                }
                this.$api.settingApi.editSafeguardSetting(obj).then(res => {
                    if (res.error == 0) {
                        this.getData();

                        this.$Message.success('保存成功');
                    }
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .safeguard-content {
        padding: 40px;
        margin: 20px auto 0;
        background: #fff;
        min-height: 100%;
        .main {
            padding: 30px 30px 30px 20px;
            background-color: #f4f6f8;
            border-radius: 2px;
            .ivu-form-item {
                margin-bottom: 0;
            }
        }

        .label-width-100 {
            /deep/ .ivu-form-item-label {
                width: 100px;
            }
        }
        .label-width-300 {
            /deep/.ivu-form-item-label {
                width: 300px !important;
            }
        }
        .paddingL {
            padding-left: 10px;
        }

        .refund-input {
          /deep/  .ivu-form-item-error-tip {
                top: 60px;
            }
        }

        .number-input {
            display: flex;

            /deep/ .ivu-form-item-content {
                width: 100%;
                display: flex;
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
