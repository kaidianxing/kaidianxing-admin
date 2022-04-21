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
    <span>
        <span
            v-if="type !== 'text'"
            :class="[
                `log-btn log-btn-${type}`,
                `log-btn--${size}`,
                `log-btn--${shape}`,
                {
                    [`log-btn--disabled`]: disabled,
                    [`log-btn--long`]: long,
                },
            ]"
            @click="handleClick"
        >
            <slot></slot>
        </span>
        <a class="log-btn-text" @click="goPage" v-else><slot></slot></a>
    </span>
</template>

<script>
export default {
    name: 'LogButton',
    props: {
        type: {
            type: String,
            default: 'primary',
            validator: (value) => {
                return ['primary', 'default', 'text'].indexOf(value) > -1
            }
        },
        size: {
            type: String,
            default: 'medium',
            validator: (value) => {
                return ['medium', 'large'].indexOf(value) > -1
            }
        },
        long: {
            type: Boolean,
            default: false
        },
        shape: {
            type: String,
            default: 'radius',
            validator: (value) => {
                return ['circle', 'radius'].indexOf(value) > -1
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        to: {
            type: String
        }
    },
    methods: {
        goPage(e) {
            if (this.disabled) return
            /* 存在跳转链接 */
            if (this.to) {
                this.$router.push({
                    path: this.to
                })
            }

            this.$emit('click', e)
        },
        handleClick(e) {
            if (this.disabled) return
            this.$emit('click', e)
        }
    }
}
</script>

<style lang="scss" scoped>
$prefix: "log-btn";

.#{$prefix} {
    display: inline-block;
    font-size: 16px;
    text-align: center;
    cursor: pointer;

    &-default {
        border: 1px solid $border-color;
    }

    &-primary {
        color: #fff;
        background:var(--theme-color);

    }

    &-text {
        display: inline-block;
        @include font-12-16;
        color: #1254ff;
        cursor: pointer;
    }

    &--medium {
        height: 48px;
        line-height: 48px;
        padding: 0 15px;
        min-width: 100px;
    }

    &--large {
        height: 60px;
        line-height: 60px;
        min-width: 304px;
        font-size: 26px;
    }

    &--long {
        display: block;
        width: 100%;
    }

    &--circle {
        border-radius: 46px;
    }

    &--radius {
        border-radius: 4px;
    }

    &--disabled {
        color: $text-zhushi;
        background: $background-color;
        cursor: not-allowed;
    }
}
</style>