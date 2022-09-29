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
    <div class="check-label">
        <div class="label-item" :class="{'label-checked': checked, 'label-disabled': disabled}" @click="handleClick">
            <span>
                <slot></slot>
            </span>
            <kdx-svg-icon v-if="showIcon" type="icon-chenggong-shixin" class="icon"></kdx-svg-icon>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CheckLabel",
        props: {
            checked: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            showIcon: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            handleClick() {
                if (!this.disabled) {
                    this.$emit('on-change', !this.checked);
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .check-label {
        display: inline-block;
        padding: 0 10px 10px 0;
        .label-item {
            display: inline-block;
            position: relative;
            padding: 5px 0;
            text-align: center;
            color: $text-first;
            border: 1px solid $border-color;
            border-radius: 2px;
            box-sizing: border-box;
            cursor: pointer;
            @include font-14-20;
            .icon {
                position: absolute;
                font-size: 14px;
                color: $brand-color;
                right: -7px;
                bottom: -7px;
                display: none;
            }
        }
        .label-checked {
            border-color: $brand-color;
            color: $brand-color;
            .icon {
                display: inline-block;
            }
        }
        .label-disabled {
            background-color: $global-disable;
            color: $text-zhushi;
            border-color: $global-disable;
            cursor: not-allowed;
        }
    }
</style>
