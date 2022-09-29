/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="seckill-basic-info">
        <Form ref="form" :model="model" :label-width="120" :rules="rule" @submit.native.prevent >
            <kdx-form-title>基本信息</kdx-form-title>
            <FormItem label="活动名称：" prop="activity_name">
                <Input placeholder="请输入活动名称" class="width-390" :class="{'input-disabled': isDisabled}"
                       v-model="model.activity_name" maxlength="20" show-word-limit :disabled="isDisabled || type == 'edit'"/>
            </FormItem>
            <FormItem label="活动期限：" required>
                <div class="flex">
                    <FormItem style="margin-bottom:0;" prop="start_time">
                        <DatePicker :value="model.start_time" type="date" placeholder="开始时间" :options="startOptions"
                                    class="width-250" :disabled="isDisabled || notStarted"
                                    @on-change="changeStartTime"></DatePicker>
                    </FormItem>
                    <div class="marginL-10 marginR-10">~</div>
                    <FormItem style="margin-bottom:0;" prop="end_time">
                        <DatePicker :value="model.end_time" :options="dateOptions"
                                    type="date" placeholder="结束时间" :disabled="type !== 'add' && type !== 'edit' && type !== 'copy'"
                                    @on-change="changeEndTime" class="width-250"></DatePicker>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="活动渠道：" prop="client_type">
                <CheckboxGroup v-model="model.client_type">
                    <Checkbox label="20" :disabled="isDisabled || type == 'edit' && status == '1'">
                        微信公众号
                    </Checkbox>
                    <Checkbox label="21" :disabled="isDisabled || type == 'edit' && status == '1'">
                        微信小程序
                    </Checkbox>
                    <Checkbox label="10" :disabled="isDisabled || type == 'edit' && status == '1'">
                        手机浏览器H5
                    </Checkbox>
                    <Checkbox label="30" :disabled="isDisabled || type == 'edit' && status == '1'">
                        头条/抖音小程序
                    </Checkbox>
                </CheckboxGroup>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    export default {
        name: "BasicInfo",
        props: {
            status: {
              type: [Number,String]
            },
            type: {
              type: String,
              default: ''
            },
            data: {
                type: Object,
                default: () => {
                }
            },
            isDisabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                model: {
                    activity_name: '',//活动名称
                    start_time: '',
                    end_time: '',
                    client_type: []
                },
                rule: {
                    activity_name: [{required: true, message: '请填写活动名称'}],
                    start_time: [
                        {required: true, message: '请选择开始时间'}
                    ],
                    end_time: [
                        {
                            required: true, message: '请选择结束时间',
                        },
                        {
                            validator: (filed, val, callback) => {
                                if (!val) {
                                    callback(new Error('结束日期必填'));
                                    return;
                                }
                                if (new Date(val).getTime() <= new Date(this.model.start_time).getTime()) {
                                    callback(new Error('结束时间需大于开始时间'));
                                    return;
                                }
                                callback();
                            }
                        }
                    ],
                    client_type: [
                        {required: true, message: '活动渠道必选'}
                    ]
                },
                dateOptions: {
                    disabledDate: (date) => {
                        //修改进来结束时间不能超过当前时间或一年后时间
                        if(this.type == 'edit' && this.status == '1'){
                            if (this?.isEdit) {
                                return new Date(date) <= new Date(this.model.end_time);
                            } else if (this.model.start_time) {
                                return (new Date(date).getTime() + 86300000) < new Date().getTime()||(new Date(date).getTime() + 86300000) > (new Date(this.model.start_time).getTime() + 31536000000);
                            }
                        }else {
                            if (this?.isEdit) {
                                return new Date(date) <= new Date(this.model.end_time);
                            } else if (this.model.start_time) {
                                return  (new Date(date).getTime() + 86300000) < new Date().getTime() || (new Date(date).getTime() + 86300000) < new Date(this.model.start_time).getTime() ||(new Date(date).getTime() + 86300000) > (new Date(this.model.start_time).getTime() + 31536000000);
                            }
                        }
                        return true;
                    }
                },
                startOptions: {
                    disabledDate: (date) => {
                        // if(this.type == 'edit'){
                            if (this?.isEdit) {
                                return new Date(date) ;
                            } else if (this.model.start_time == '' || this.model.start_time) {
                                return (new Date(date).getTime() + 86300000) < new Date().getTime();
                            }
                        // }
                        return true;
                    }
                }
            }
        },
        computed: {
            notStarted() {
                let isDisabled = false
                if(this.type == 'copy'){
                    isDisabled = false
                    return isDisabled
                }else {
                    return this.status != '0' && this.status != ''
                }

            },
        },
        watch: {
            data: {
                handler(newValue) {
                    this.model = newValue
                },
                immediate: true
            },
            model: {
                handler(newValue) {
                    this.$emit('update:data', newValue);
                },
                immediate: true
            },
        },
        methods: {
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(async (valid) => {
                        if (valid) {
                            resolve()
                        } else {
                            reject()
                        }
                    })
                })
            },
            changeStartTime(date) {
                this.model.start_time = date;
            },
            changeEndTime(date) {
                this.model.end_time = date;
            },
        },
    }
</script>

<style lang="scss" scoped>
    .seckill-basic-info {
        padding-bottom: 30px;

        .next-box {
            margin-top: 10px;
            background-color: #f4f6f8;
            padding: 30px 20px;
            border-radius: 2px;
            font-size: 14px;
            line-height: 20px;
            color: #262b30;

            /deep/ .ivu-form-item:last-child {
                margin-bottom: 0;
            }

            /deep/ .ivu-form-item-error-tip {
                padding-left: 120px !important;
            }
        }
        .tip-mb-25 {
            /deep/ .ivu-form-item-error-tip {
                margin-top: 25px;
            }
        }

        /deep/ .ivu-form {
            .r-form-item-checkbox {
                .ivu-form-item-content {
                    .ivu-checkbox-group {
                        margin-bottom: -10px;

                        .ivu-checkbox-wrapper {
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }
    }
</style>
