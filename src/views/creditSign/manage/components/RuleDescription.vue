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
    <div class="other-set">
        <Form ref="form" :model="model" :label-width="120" :rules="rules" >
            <div class="pb-30">
                <kdx-form-title>规则说明</kdx-form-title>
                <FormItem label="规则说明：" prop="rule">
                    <div class="editor">
                        <editor ref="editor" v-model="model.rule" :plugins="plugins" :isDisabled="isDisabled" :height="380"></editor>
                        <div class="btn-group">
                            <Button class="goods-btn default-primary" :disabled="isDisabled||data.end_time==''" @click="rest">恢复默认说明</Button>
                        </div>
                    </div>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
import Editor from "@/components/Editor";
    export default {
        name: "RuleDescription",
        components: {
            Editor
        },
        props: {
            isDisabled: {
                type: Boolean,
                default: false
            },
            data:{
                type: Object,
                default: ()=>{}
            },
            ruleDescription: {
                type: Object,
                default: ()=>{}
            },
        },
        watch: {
            ruleDescription:{
              handler(newValue){
                  this.model = newValue
              },
                immediate: true,
            },
            model: {
                handler(newValue){
                    this.$emit( 'updata:ruleDescription',newValue)
                },
                immediate: true,
            },
            'data.start_time':{
                handler(val) {
                    if(val != ''){
                        let y = new Date(val).getFullYear();
                        let m = new Date(val).getMonth()+1;
                        let d = new Date(val).getDate();
                        this.start_time = `${y}年${m}月${d}日`
                    }
                },
                immediate: true,
            },
            'data.end_time':{
                handler(val) {
                    if(this.ifwatch){
                        if(val != ''){
                            this.ifwatch = false
                            let y = new Date(val).getFullYear();
                            let m = new Date(val).getMonth()+1;
                            let d = new Date(val).getDate();
                            this.end_time = `${y}年${m}月${d}日`
                            if(this.start_time && !this.ruleDescription.rule){
                                this.model.rule = `<div style="margin: 30px 0 74px 20px"><div style="font-weight: bold;margin-bottom:6px">活动时间</div>
                                                    <div style="color: #636669;margin-bottom: 20px">${this.start_time}-${this.end_time}</div>
                            <div style="font-weight: bold;margin-bottom:6px">签到规则</div><div style="color: #636669;margin-bottom: 6px">·每日签到可以获得日签奖励，活动周期内连续签到可以获得连签奖励，可在签到页面查看具体奖励内容；</div>
                            <div style="color: #636669;margin-bottom: 6px">·断签后支持补签，可通过积分兑换补签次数；</div><div style="color: #636669;">·活动奖励仅在活动周期内支持领取，最终解释权归商家所有</div></div>`
                            }
                        }
                    }

                },
                // immediate: true,
            },
        },
        computed: {
            getData() {
                return this.ruleDescription
            }
        },
        data() {
            return {
                start_time:'',
                end_time:'',
                ifwatch:true,
                plugins: 'lists image media table wordcount link preview paste quickbars noneditable',
                model:{
                    rule:""
                },
                rules:{
                    rule: [{ required: true, message: "规则说明必填" }],
                }
            }
        },
        mounted() {
        },
        methods: {
            rest() {
                // this.ifwatch =true
                let y = new Date(this.data.end_time).getFullYear();
                let m = new Date(this.data.end_time).getMonth()+1;
                let d = new Date(this.data.end_time).getDate();
                this.end_time = `${y}年${m}月${d}日`
                this.model.rule = `<div style="margin: 30px 0 74px 20px"><div style="font-weight: bold;margin-bottom:6px">活动时间</div>
                                                    <div style="color: #636669;margin-bottom: 20px">${this.start_time}-${this.end_time}</div>
                            <div style="font-weight: bold;margin-bottom:6px">签到规则</div><div style="color: #636669;margin-bottom: 6px">·每日签到可以获得日签奖励，活动周期内连续签到可以获得连签奖励，可在签到页面查看具体奖励内容；</div>
                            <div style="color: #636669;margin-bottom: 6px">·断签后支持补签，可通过积分兑换补签次数；</div><div style="color: #636669;">·活动奖励仅在活动周期内支持领取，最终解释权归商家所有</div></div>`
            },
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['form'].validate(valid => {
                        if (valid) {
                            resolve();
                        } else {
                            reject();
                        }
                    })
                })
            }
        },
    }
</script>

<style scoped lang="scss">
.other-set {
    .pb-30 {
        padding-bottom: 30px;
    }
    .editor {
        display: flex;
        flex-wrap: nowrap;
        .btn-group {
            display: flex;
            margin-left: 13px;
            flex-direction: column;
            .goods-btn {
                margin-bottom: 10px;
            }
        }
    }
}

</style>