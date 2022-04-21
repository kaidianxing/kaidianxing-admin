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
    <kdx-modal-frame v-model="value" title="余额充值" :width="610" @on-cancel="handleCancel">
        <div class="recharge-balance-modal">
            <Form ref="form" :label-width="120" :model="model" :rules="rules"
                  @submit.native.prevent>
                <FormItem label="当前余额：">
                    <div class="balance-data">{{data}}</div>
                </FormItem>
                <FormItem label="变化：" class="r-form-item-checkbox">
                    <RadioGroup v-model="model.change_type">
                        <Radio label="1">增加</Radio>
                        <Radio label="2">减少</Radio>
                        <Radio label="0">最终余额</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="充值数目：" prop="num">
                    <kdx-rr-input v-model="model.num" type="text" :fixed="2" :max-value="9999999.99" number class="width-160" placeholder="请输入充值数目">
                        <span slot="append">元</span>
                    </kdx-rr-input>
                </FormItem>
                <FormItem label="备注：" prop="remark">
                    <Input v-model="model.remark" type="textarea" class="width-430"
                           placeholder="请输入备注"/>
                </FormItem>
                <FormItem label="操作员密码：" prop="password" :error="textError">
                    <Input v-model="model.password" type="password" class="width-430"
                           placeholder="请输入登录操作员密码"/>
                </FormItem>
            </Form>
        </div>
        <template #footer>
            <Button class="default-long" @click="handleCancel">取消</Button>
            <Button class="primary-long" :loading="loading" @click="handleOk">确定</Button>
        </template>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "RechargeIntegral",
        props: {
            id: {
                type: [String, Number]
            },
            data: {
                type: [String, Number]
            }
        },
        data() {
            return {
                value: false,
                textError: '',
                model: {
                    change_type: '1',
                    num: '',
                    remark: '',
                    password: ''
                },
                loading: false,
                rules: {
                    num: [
                        {required: true, message: '请填写充值数目'}
                    ],
                    remark: [
                        {required: true, message: '请填写备注'}
                    ],
                    password: [
                        {required: true, message: '请输入登录操作员密码'}
                    ]
                }
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                // this.value = true;
                if (this.value) {
                    this.resetModel();
                    this.$refs['form'].resetFields();
                }
            },
            handleOk() {
                this.textError = '';
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        let params = Object.assign({ id: this.id, type: 'balance'}, this.model);
                        if (params.num > 9999999.99) {
                            this.$Message.error('充值的数目最大为9999999.99');
                            return;
                        }
                        this.loading = true
                        this.$api.memberApi.rechargeMember(params, {nomessage: true}).then(res => {
                            if (res.error == 211118) {
                                this.textError = '管理员密码不正确';
                            } else if (res.error === 0) {
                                this.$Message.success('余额充值成功');
                                this.$emit('on-refresh');
                                // this.setValue();
                                this.handleCancel();
                            } else {
                                this.$Message.error(res.message)
                            }
                        }).finally(()=> {
                            this.loading = false
                        })
                    }
                })
            },
            handleCancel() {
                // this.setValue();
                this.value = false;
                this.$refs['form'].resetFields();
            },
            resetModel() {
                this.model = {
                    change_type: '1',
                    num: '',
                    remark: '',
                    password: ''
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .recharge-balance-modal {
        padding: 30px 0;
        .balance-data {
            margin-top: 2px;
            color: $warning-color;
            @include font-18-25-bold;
            line-height: 32px;
        }
    }
</style>
