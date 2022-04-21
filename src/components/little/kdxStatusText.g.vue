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
    <div class="status-text" @click="handleClick">
        <span :class="[`status-text-${type}`, `status-text-size-${size}`]">
            <slot></slot>
        </span>
    </div>
</template>

<script>
    // 用于一些状态字显示
    export default {
        name: "kdxStatusText",
        props: {
            type: {
                type: String,
                default: 'default',
                validate: ['info', 'success', 'warning', 'danger', 'disabled']
            },
            size: {
                type: String,
                default: 'default',
                validate: ['default', 'large', 'small', '24-34']
            }
        },
        methods: {
            handleClick(e) {
                this.$emit('click', e);
            }
        }
    };
</script>

<style scoped lang="scss">
    .status-text {
        display: inline-block;
        // default
        .status-text-default {
            color: $text-first;
        }
        .status-text-info {
            color: $brand-color;
        }
        .status-text-success {
            color: $success-color;
        }
        .status-text-warning {
            color: $warning-color;
        }
        .status-text-danger {
            color: $danger-color;
        }
        .status-text-disabled {
            color: $text-third;
        }
        .status-text-size-default {
            @include font-14-20;
        }
        .status-text-size-large {
            @include font-18-25-bold;
        }
        .status-text-size-small {
            @include font-12-16;
        }
        .status-text-size-24-34 {
            @include font-24-34-bold;
        }
    }
</style>
