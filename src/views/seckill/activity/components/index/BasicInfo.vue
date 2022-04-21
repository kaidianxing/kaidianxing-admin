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
    <div class="seckill-basic-info">
        <Form ref="form" :model="model" :label-width="120" :rules="rule"  @submit.native.prevent>
            <kdx-form-title>基本信息</kdx-form-title>
            <FormItem label="活动名称：" prop="title">
                <Input placeholder="请输入活动名称" class="width-340" :class="{'input-disabled': type !== 'add'}" v-model="model.title" maxlength="20" show-word-limit :disabled="type !== 'add'"></Input>
            </FormItem>
            <FormItem label="活动期限：" required>
                <div class="flex">
                    <FormItem style="margin-bottom:0;" prop="start_time">
                        <DatePicker :value="model.start_time" type="datetime" placeholder="开始时间" class="width-250" :disabled="editabled" @on-change="changeStartTime"></DatePicker>
                    </FormItem>
                    <div class="marginL-10 marginR-10">~</div>
                    <FormItem style="margin-bottom:0;" prop="end_time" :key="editabled">
                        <DatePicker :value="model.end_time" :options="dateOptions" :disabled="type=='view'" type="datetime" placeholder="结束时间"
                                    @on-change="changeEndTime" class="width-250"></DatePicker>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="活动渠道：" prop="client_type" class="r-form-item-checkbox">
                <CheckboxGroup v-model="model.client_type">
                    <Checkbox label="20" :disabled="type !== 'add'">
                        微信公众号
                    </Checkbox>
                    <Checkbox label="21" :disabled="type !== 'add'">
                        微信小程序
                    </Checkbox>
                    <Checkbox label="10" :disabled="type !== 'add'">
                        手机浏览器H5
                    </Checkbox>
                    <Checkbox label="30" :disabled="type !== 'add'">
                        头条/抖音小程序
                    </Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="秒杀商品：" ref="goods_list" prop="goods_list">
               <div class="content">
                    <Button class="default-primary" :disabled="type !== 'add'" @click="chooseShop">选择商品</Button>
                    <kdx-hint-text>提示：秒杀库存不得大于商品库存，用户下单成功即扣除库存；秒杀抢购不支持会员折扣</kdx-hint-text>
                    <div class="goods-box"  v-if="model.goods_list && model.goods_list.length > 0">
                        <rules-goods ref="goodsRule" v-model="model.goods_list" :type="type" @delete="handleDelete"></rules-goods>
                    </div>
               </div>
            </FormItem>
        </Form>
         <!--商品选择器-->
        <goods-selector  v-model="goodSelector.value" :multiple="true" :current-list="model.goods_list" :show_activity="1"
                        @on-change="changeGoodList" flag="seckill" @on-cancel="cancelGoodSelector"></goods-selector>
    </div>
</template>

<script>
    import goodsSelector from "@/components/selector/GoodsSelector";
    import rulesGoods from './RulesGoods'

    export default {
        name: "BasicInfo",
        components: {
            rulesGoods, goodsSelector
        },
        props: {
            type: {
                type: String,
                default: ''
            },
            value: {
                type: Object,
                default: () => {}
            },
            status: { // 活动状态
                type: String,
                default: ''
            },
            editabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                old_end_time: '',
                model: {
                    title: '',
                    client_type: [],
                    goods_list: [], // 选择的商品
                    start_time: '',
                    end_time: '',
                },
                rule: {
                    title: [{ required: true, message: '请填写活动名称' }],
                    client_type: [{ required: true, message: '请选择活动渠道' }],
                    goods_list: [
                        {required: true, type: 'array', min: 1,  message: '请选择商品'}
                    ],
                    start_time: [
                        { required: true, message: '请选择活动开始日期' }
                    ],
                    end_time: [
                        { required: true, message: '请选择活动结束日期',
                        },
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
                goodSelector: { // 商品选择器
                    value: false
                },
                dateOptions:{
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
        watch: {
            value: {
                handler(newValue) {
                    if (this.editabled) {
                        this.old_end_time = newValue.end_time
                    }
                    this.model = newValue
                }
            },
            model: {
                handler(newValue) {
                    this.$emit('input', newValue);
                },
                deep: true
            },
        },
        created() {
        },
        mounted() {
        },
        methods: {
            handleDelete(index) {
                this.model.goods_list.splice(index, 1);
            },
            validateForm() {
                return new Promise((resolve, reject) => {
                   try {
                        this.$refs['form'].validate(async (valid) => {
                        if (valid) {
                             try {
                                await this.$refs.goodsRule.validateForm();
                                let result = await this.handleGoodsRules();

                                if(result.some(item=> item.has_option=='1' && !item.rules)){
                                    this.$Message.error('每个商品必须有一个规格参加活动')
                                    reject()
                                }
                                resolve(result)
                            } catch (e) {
                                reject()
                            }
                        } else {
                            reject()
                        }
                    })
                   } catch (error) {
                      console.log(error,'error') 
                   }
                })
            },
            handleGoodsRules() {
                let result = this.model.goods_list.map(item => {
                    if (item.has_option == 0) {
                        item = {
                            goods_id: item.id,
                            has_option: item.has_option,
                            option_id: 0,
                            activity_stock: item.activity_stock,
                            activity_price: item.activity_price
                        }
                    } else {
                        item = {
                            goods_id: item.id,
                            has_option: item.has_option,
                            rules: item.rules
                        }
                    }
                    return item
                });
                return result
            },
            // 商品选择器
            chooseShop() {
                this.goodSelector.value = true;
            },
             // 选择商品
            changeGoodList(list) {
                this.model.goods_list = list.map(item => {
                    return {
                        ...item,
                        activity_stock: item?.activity_stock || '',
                        activity_price: item?.activity_price || '',
                    };
                });
                this.cancelGoodSelector();
                this.$refs.goods_list.validateState = '';
            },
            changeStartTime(date) {
                this.model.start_time = date;
            },
            changeEndTime(date) {
                this.model.end_time = date;
            },
            // 关闭商品选择器
            cancelGoodSelector() {
                this.goodSelector.value = false;
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

        .content {
            border-radius: 2px;
            padding: 30px;
            background: #F4F6F8;

              .goods-box {
                margin-top: 10px;
                max-width: 925px;
                  &.merchant {
                   max-width: 1100px;
                  }
            }
        }
    }
</style>
