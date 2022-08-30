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
        <Form ref="form" :model="model" :label-width="120" :rules="rule"  @submit.native.prevent>
            <kdx-form-title>基本信息</kdx-form-title>
            <FormItem label="活动名称：" prop="title">
                <Input placeholder="请输入活动名称" class="width-340" :class="{'input-disabled': isDisabled}" v-model="model.title" maxlength="20" show-word-limit :disabled="isDisabled"></Input>
            </FormItem>
            <FormItem label="活动期限：" required>
                 <div class="flex">
                     <FormItem style="margin-bottom:0;" prop="start_time">
                         <DatePicker :value="model.start_time" type="datetime" placeholder="开始时间" class="width-250" :disabled="editabled" @on-change="changeStartTime"></DatePicker>
                     </FormItem>
                    <div class="marginL-10 marginR-10">~</div>
                    <FormItem prop="end_time" style="margin-bottom:0;">
                        <DatePicker :value="model.end_time" :options="dateOptions" type="datetime" placeholder="结束时间" :disabled="type=='view'"
                                    @on-change="changeEndTime" class="width-250"></DatePicker>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="活动渠道：" prop="client_type" class="r-form-item-checkbox">
                <CheckboxGroup v-model="model.client_type">
                    <Checkbox label="20" :disabled="isDisabled">
                        微信公众号
                    </Checkbox>
                    <Checkbox label="21" :disabled="isDisabled">
                        微信小程序
                    </Checkbox>
                    <Checkbox label="10" :disabled="isDisabled">
                        手机浏览器H5
                    </Checkbox>
                    <Checkbox label="30" :disabled="isDisabled">
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
            data: {
                type: Object,
                default: () => {}
            },
            isDisabled: {
                type: Boolean,
                default: false
            },
            status: { // 活动状态
                type: String,
                default: ''
            },
            type: { // 操作方式
                type: String,
                default: ''
            }
        },
        data() {
            return {
                old_end_time: '',
                model: {
                    title: '',
                    client_type: [],
                    start_time: '',
                    end_time: '',
                },
                rule: {
                    title: [{ required: true, message: '请填写活动名称' }],
                    client_type: [{ required: true, message: '请选择活动渠道' }],
                   /* activity_time: [
                        {
                            required: true, type: 'array',
                            fields: {
                                0: {type: 'date', required: true, message: '请选择活动日期'},
                                1: {type: 'date', required: true, message: '请选择活动日期'}
                            }
                        },
                    ],
                    end_time: [{validator(rule,value,callback){
                        value?callback():callback(new Error('请选择活动日期'))
                    }}]*/
                    start_time: [
                        { required: true, message: '请选择活动开始日期' }
                    ],
                    end_time: [
                        { required: true, message: '请选择活动结束日期'},
                        {
                            validator: (filed,val,callback)=> {
                                if(!val){
                                    callback(new Error('请选择活动结束日期'))
                                    return
                                }
                                if(new Date(val)< new Date(this.model.start_time)){
                                    callback(new Error('结束日期不能小于开始日期'))
                                    return
                                }
                                callback()
                            }
                        }
                    ]
                },
                dateOptions:{ // 设置结束时间禁用项
                    disabledDate: (date) =>{
                        if (this.editabled) {
                            return new Date(date)<=new Date(this.old_end_time)
                        } else if(this.model.start_time){
                            return (new Date(date).getTime()+86300000)<new Date(this.model.start_time).getTime()
                        }
                        return true
                    }
                }
            }
        },
        computed: {
            editabled(){
                return (this.status =='0' ||this.status =='1') && this.type=='edit' || this.type == 'view'
            },
        },
        watch: {
            data: {
                handler(newValue) {
                    if (this.editabled) {
                        this.old_end_time = newValue.end_time
                    }
                    this.model = Object.assign({}, newValue)
                }
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
            // 获取向后台传递的参数
            getParams() {
                return  {
                    title: this.model.title,
                    client_type: this.model.client_type.join(','),
                    start_time: this.model.start_time,
                    end_time: this.model.end_time
                };
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
