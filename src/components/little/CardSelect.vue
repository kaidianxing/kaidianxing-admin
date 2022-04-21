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
    <div class="card-select">
        <div v-for="(item, index) in tmpList" :key="index"
             :class="['card-item', {'checked': +item.id === +value, 'disabled': item.disabled || disabled}]"
             @click="handleClick(item)">
            <slot :item="item">{{ item.name }}</slot>
            <kdx-svg-icon type="icon-yes1" class="icon-svg"></kdx-svg-icon>
        </div>
    </div>
</template>

<script>
export default {
    name: "CardSelect",
    props: {
        value: {
            type: [Number, String],
        },
        tmpList: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClick(item) {
            if (!item.disabled && !this.disabled) {
                this.$emit('input', item.id);
                this.$emit('on-change', item.id);
            }
        }
    },
};
</script>

<style scoped lang="scss">
.card-select {
    display: flex;
    align-items: center;

    .card-item {
        position: relative;
        padding: 20px 16px;
        border: 1px solid $border-color;
        border-radius: 2px;
        @include font-14-20;
        color: $text-first;
        margin-right: 10px;
        cursor: pointer;
        min-width: 140px;

        &.checked {
            border: 2px solid $brand-color;
            color: $brand-color;
            .icon-svg {
                display: block;
            }
        }
        &.disabled {
            cursor: not-allowed;
            background-color: $global-disable;
            color: $text-zhushi;
            border-color: $global-disable;
        }
        .icon-svg {
            position: absolute;
            bottom: 0;
            right: 0;
            display: none;
        }
    }
}
</style>
