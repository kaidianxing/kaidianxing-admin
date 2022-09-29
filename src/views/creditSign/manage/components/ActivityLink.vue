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
        <Form ref="form" :model="model" :label-width="120" :rules="rules">
            <div class="pb-30">
                <kdx-form-title>页面设置</kdx-form-title>
                <FormItem label="页面名称：" prop="link_name" >
                    <Input placeholder="请输入页面名称" class="width-340"
                           v-model="model.link_name" maxlength="6" show-word-limit :disabled="isDisabled || notChange"/>
                </FormItem>
                <FormItem label="活动链接：" class="r-form-item-checkbox" prop="activity_link">
                    <RadioGroup v-model="model.activity_link">
                        <Radio label="1" :disabled="isDisabled || notChange">开启</Radio>
                        <Radio label="0" :disabled="isDisabled || notChange">关闭</Radio>
                    </RadioGroup>
                    <div class="bg-box" v-if="model.activity_link == 1" >
                        <FormItem label="活动标题：" prop="activity_title" class="title">
                            <Input placeholder="请输入活动标题" class="width-340"
                                   v-model="model.activity_title" maxlength="10" show-word-limit :disabled="isDisabled || notChange"/>
                        </FormItem>
                        <FormItem label="入口文案：" class="marginL-53 vertical"  prop="content">
                            <Input placeholder="请输入入口文案" class="width-340"
                                   v-model="model.content" maxlength="4" show-word-limit :disabled="isDisabled || notChange"/>
                        </FormItem>
                        <FormItem label="跳转链接：" class="vertical" prop="link_url">
                                <MySelectLink class="mb-0" :value='{
                                name: model.linkurl_name,
                                url: model.link_url,
                                wxappid: model.wxappid
                               }'  :enabled="type == 'edit' || type == 'view' ?false:true" @change='changeLink' style="width: 340px"></MySelectLink>
                        </FormItem>
                    </div>
                </FormItem>
            </div>
        </Form>
    </div>
</template>

<script>
import MySelectLink from '@/components/decorate/SelectLink.vue'
export default {
    name: "ActivityLink",
    props: {
        type: {
            type: String,
            default: ''
        },
        pageSetup:{
            type:Object,
            default:()=>{}
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    components: {
        MySelectLink
    },
    watch: {
        pageSetup: {
            handler( newValue) {
                this.model = newValue
            }
        },
        model: {
            handler(newValue) {
                this.$emit('update:pageSetup', newValue);
            },
            deep: true
        }
    },
    computed:{
      notChange(){
          if(this.type == 'edit'){
              return true
          }else {
              return false
          }
      }
    },
    data(){
        return {
            show:false,
            model:{
                activity_link:'0',
                link_name:'',
                content:'查看',
                activity_title: "",
                link_url: "",
            },
            rules:{
                link_name:[{required: true,message:"页面名称必填"}],
                activity_link:[{required: true,message:"活动链接必填"}],
                activity_title:[{required: true,message:"活动标题必填"}],
                link_url:[{required: true,message:"活动链接必填"}],
                content:[{required: true,message:"入口文案必填"}],
            },
        }
    },
    methods:{
        changeLink(val) {
            this.model.wxappid = val.wxappid
            this.model.linkurl_name = val.name
            this.model.link_url = val.url;
        },
        // 关闭链接选择器
        handleCancel() {
            this.show = false
        },
        // 选择链接
        // changeLink(val) {
        //     this.model.link_url = val.url
        //     this.show = false
        // },
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
    }
}
</script>

<style scoped lang="scss">
.other-set {
    .pb-30 {
        padding-bottom: 30px;
    }
    .bg-box{
        overflow: auto;
        margin-top:10px;
        padding-top: 30px;
        background-color: $background-color;
        /deep/ .ivu-form-item-error-tip {
            margin-left: 120px!important;
        }
    }
}
</style>