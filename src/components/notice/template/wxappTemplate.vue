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
    <div class="wxapp-template">
        <div class="tip">
            <kdx-hint-alert :show-icon="false">
                <div>
                    请到微信小程序管理后台服务类目中添加 【商家自营】-【服饰/内衣】
                </div>
            </kdx-hint-alert>
        </div>
        <kdx-form-title>发送设置</kdx-form-title>
        <Form ref="form" :model="model" :rules="rules" :label-width="120">
            <FormItem class="r-form-item-checkbox" label="发送设置：">
                <RadioGroup v-model="model.status">
                    <Radio :label="1">开启</Radio>
                    <Radio :label="0">关闭</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem class="r-form-item-checkbox" label="发送时间：">
                <span>{{sendTime}}</span>
                <kdx-hint-text v-if="type_code==='credit_sign_notice'">系统将在该时间点为当天未进行签到的用户发送签到提醒</kdx-hint-text>
            </FormItem>
            <FormItem class="r-form-item-checkbox" label="模板设置：">
                <RadioGroup v-model="model.is_default">
                    <Radio :label="1">系统默认</Radio>
                </RadioGroup>
                <default-template type="wxapp"></default-template>
            </FormItem>
        </Form>
    </div>
</template>

<script>

    import defaultTemplate from "./defaultTemplate";

    export default {
        name: "wxappTemplate",
        components: {
            defaultTemplate
        },
        props: {
            value: {
                type: Object,
                default: () => {}
            },
            sendTime: {
                type: String,
                default: ''
            },
            type_code: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                model: {
                    status: 0,
                    is_default: 1,
                },
                rules: {}
            }
        },
        watch: {
            model: {
                handler(newValue) {
                    this.$emit('input', newValue)
                },
                deep: true
            },
            value: {
                handler(newValue) {
                    this.model = newValue
                },
                deep: true,
                immediate: true
            },
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
        },
    }
</script>

<style lang="scss">
    .wxapp-template {

    }
</style>
