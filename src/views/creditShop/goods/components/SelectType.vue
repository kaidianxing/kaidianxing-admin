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
    <Form class="content" ref="form">
        <kdx-form-title>商品类型</kdx-form-title>
        <FormItem label="" :label-width="0" :model="model">
            <div class="multi-select">
                <RadioGroup v-model="model.type" @on-change="changeType">
                    <Radio label="0" border :disabled="isDisabled">
                        <div class="tit">商品</div>
                        <!--<div class="desc">产生商品订单</div>-->
                        <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                    </Radio>
                    <Radio label="1" border :disabled="isDisabled">
                        <div class="tit">优惠券</div>
                        <!--<div class="desc">支付后立即到账</div>-->
                        <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
                    </Radio>
                </RadioGroup>
            </div>
        </FormItem>
    </Form>
</template>

<script>
    export default {
        name: "SelectType",
        components: {},
        props: {
            value: {
                type: String,
                default: '0'
            },
            isDisabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                model: {
                    type: '0'
                }
            }
        },
        watch: {
            value: {
                handler(value) {
                    this.model.type = value
                },
                immediate: true,
            },
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            changeType() {
                this.$emit('input', this.model.type)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        padding-bottom: 30px;
    }
    .multi-select {
        /deep/ .ivu-radio {
            display: none;
        }
        /deep/ .ivu-radio-group {
            display: flex;
            align-items: center;
        }
        .ivu-radio-group-item {
            position: relative;
            box-sizing: border-box;
            padding-left: 0;
            padding-right: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 60px;
            font-size: 14px;
            line-height: 20px;
            border-radius: 2px;
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
            .tit {
                font-size: 14px;
                line-height: 20px;
                font-weight: bold;
                color: #262b30;
            }
            .desc {
                font-size: 12px;
                line-height: 16px;
                color: #636669;
                margin-top: 2px;
            }
            .icon {
                position: absolute;
                font-size: 24px;
                bottom: -2px;
                right: 0;
                color: $brand-color;
                display: none;
            }
        }
        .ivu-radio-wrapper-disabled {
            background-color: $background-color;
        }
        .ivu-radio-wrapper-checked {
            background-color: #fff;
            border-width: 2px;
            border-color: $brand-color;
            .tit {
                color: $brand-color;
            }
            .icon {
                display: inline-block;
            }
        }
    }
</style>