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
    <div class="r-input" :style="{width: width}">
        <div class="close">
            <Input v-model="cacheValue" :disabled="disabled" :placeholder="placeholder" :maxlength="maxlength" :class='[type]'
                   :show-word-limit="showWordLimit" :prefix="prefix" :suffix="suffix" @on-blur='onBlur'>
            </Input>
            <slot name='error'></slot>
        </div>
        <Icon v-show="closable" type="ios-close-circle" class="close-icon" @click="close"/>
    </div>
</template>

<script>
    // 关于一些input的组件
    export default {
        name: "RInput",
        props: {
            value: {
                type: String,
                required: true
            },
            type: {
                type: String,
                default:'text'
            },
            closable: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String
            },
            width: {
                type: Number,
                default: 120
            },
            maxlength: {
                type: Number
            },
            showWordLimit: {
                type: Boolean,
                default: false
            },
            prefix: {
                type: String
            },
            suffix: {
                type: String
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            cacheValue:{
               get(){
                   return this.value;
               },
               set(value){
                   this.$emit('input', value)
               }
            }
        },
        methods: {
            onBlur(){
                this.$emit('blur', this.cacheValue)
            },
            close() {
                this.$emit('close');
            }
        }
    };
</script>

<style lang="scss">


    .r-input {
        display: inline-block;
        position: relative;

        &:hover {
            > .close-icon {
                display: block;
            }
        }

        > .close-icon {
            font-size: 20px;
            position: absolute;
            top: -10px;
            right: -10px;
            color: $text-zhushi;
            cursor: pointer;
            display: none;

            &:hover {
                color: $text-second;
            }
        }
    }
</style>
