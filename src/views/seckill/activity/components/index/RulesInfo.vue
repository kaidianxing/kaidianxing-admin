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
    <div class="seckill-rules-info">
        <Form ref="form" :model="model" :label-width="120" :rules="rule">
            <kdx-form-title>规则设置</kdx-form-title>
            <FormItem label="是否参与分销：">
                <RadioGroup v-model="model.is_commission">
                    <Radio label="0" :disabled="type !== 'add'">不参与</Radio>
                    <Radio label="1" :disabled="type !== 'add'">参与</Radio>
                </RadioGroup>
                <kdx-hint-text style="max-width: 610px;">默认不参与分销，分销开启后才能生效</kdx-hint-text>
            </FormItem>
            <FormItem label="限购次数：" >
                <RadioGroup v-model="model.limit_type" vertical>
                    <Radio label="0"  :disabled="type !== 'add'">不限制</Radio>
                    <Radio label="1"  :disabled="type !== 'add'">
                        <FormItem class="radio-item limit1" prop="limit_num1">
                            <div class="flex">
                                <span>活动期内每人最多购买</span>
                                <kdx-rr-input placeholder="请输入" class="width-160" v-model="model.limit_num1" number :fixed="0" :min-value="1" :max-value="999999999" :disabled="type !== 'add'">
                                    <span slot="append">件</span>
                                </kdx-rr-input>
                           </div>
                        </FormItem>
                    </Radio>
                    <Radio label="2"  :disabled="type !== 'add'">
                        <FormItem  class="radio-item limit2"  prop="limit_num2">
                           <div class="flex">
                                <span>活动期内每人每天最多购买</span>
                                <kdx-rr-input placeholder="请输入" class="width-160" v-model="model.limit_num2" number :fixed="0" :min-value="1" :max-value="999999999" :disabled="type !== 'add'">
                                    <span slot="append">件</span>
                                </kdx-rr-input>
                           </div>
                        </FormItem>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="活动预热：" prop="is_preheat">
                <RadioGroup v-model="model.is_preheat">
                    <Radio label="1" :disabled="disabledPreheat">开启 <kdx-hint-tooltip
                        type="image"
                        :image="$utils.staticImg('seckill/preheat_example.png')"
                ></kdx-hint-tooltip></Radio>
                    <Radio label="0" :disabled="disabledPreheat">不开启</Radio>
                </RadioGroup>
                <kdx-hint-text>未达到活动开始时间的秒杀抢购将以倒计时形式展示，此时只可浏览不可购买，未到预热时间不展示</kdx-hint-text>
                <div class="next-box" v-if="model.is_preheat === '1'">
                     <FormItem label="预热时间：" prop="preheat_time">
                        <DatePicker type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="请选择预热时间"
                                    class="width-340"
                                    @on-change="changeTime"
                                    :disabled="disabledPreheat"
                                    :value="model.preheat_time">
                        </DatePicker>
                    </FormItem>
                </div>
            </FormItem>
        </Form>
       
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    export default {
        name: "RulesInfo",
        props: {
            type: {
                type: String,
                default: ''
            },
            activityData: {
                type: Object,
                default: () => {}
            },
            basicInfo: {
                type: Object,
                default: ()=> {}
            }
        },
        data() {
            return {
                model: {
                    is_commission: '0', // 是否参与分销
                    limit_type: '0',
                    limit_num1: null,
                    limit_num2: null,
                    is_preheat: '0',
                    preheat_time:''
                },
                rule: {
                    limit_num1: [{
                        validator: (rule,value,callback)=> {
                           if(this.model.limit_type=='1'&& !value && value !==0 ){
                                callback(new Error('请填写数量'))
                            } else {
                                callback()
                            }
                        }
                    }],
                    limit_num2: [{
                        validator: (rule,value,callback)=> {
                           if(this.model.limit_type=='2' && !value && value !==0){
                                callback(new Error('请填写数量'))
                            } else {
                                callback()
                            }
                        }
                    }],
                    preheat_time: [{ required: true,
                    validator:(rule,value,callback)=> {
                        if(!value){
                            callback(new Error('请设置预热时间'))
                        } else if(value>this.basicInfo.start_time){
                            callback(new Error('预热时间不能大于开始时间'))
                        } else {
                            callback()
                        }
                    }}],
                },
            }
        },
        watch: {
            activityData: {
                handler(newValue) {
                    this.model = newValue;
                }
            },
            model: {
                handler(newValue) {
                    this.$emit('update:activityData', newValue);
                },
                deep: true
            },
            'model.is_commission': {
                deep: true,
                immediate: true,
                handler(val) {
                    this.$emit('is_commission',val)
                }
            },
        },
        computed: {
            ...mapState('config', ['apps']),
            disabledPreheat(){
                return this.basicInfo?.status && this.basicInfo.status<0 || this.$route.query.type=='view';
            }
        },
        methods: {
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(async (valid) => {
                        if (valid) {
                            resolve(valid)
                        } else {
                            reject()
                        }
                    })
                })
            },
            changeTime(e){
                this.model.preheat_time = e
            },
         
        },
    }
</script>

<style lang="scss" scoped>
    .seckill-rules-info {
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
                margin-left: 120px;
            }
        }
        /deep/ .error-tip .ivu-form-item-error-tip {
            padding-left: 120px;
        }
        .goods-box {
            margin-top: 10px;
            max-width: 1400px;
        }

        .radio-item {
            display: inline-block;
           
           /deep/ .ivu-input-wrapper {
               margin-left: 10px;
           }

           &.limit1 {
              /deep/  .ivu-form-item-error-tip {
                   margin-left: 148px;
               }
           }
           &.limit2 {
                /deep/ .ivu-form-item-error-tip {
                   margin-left: 175px;
               }
           }
        }

        /deep/ .ivu-radio-group-vertical .ivu-radio-wrapper {
               &:first-child {
                   margin-top: 3px;
               }

               margin-top: 20px;
           }

        .seckill-item {
            /deep/ .ivu-form-item-content {
                margin-left: 0!important;
            }
        }
       /deep/ .ivu-form {
            .ivu-date-picker-rel {
                .ivu-icon-ios-loading {
                    display: none;
                }
            }
        }
    }
</style>
