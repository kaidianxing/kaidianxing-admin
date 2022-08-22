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
