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
    <div class="tag-label">
        <div class="label-content" :class="[`label-${type}`, `label-size-${size}`, border?`label-${type}-border`:'']" @click="labelClick">
           <span class="text">
                <slot></slot>
           </span>
            <!--<span v-show="closable" class="iconfont icon-del close" @click.stop="close"></span>-->

            <div class="close" v-show="closable" @click.stop="close" @mouseleave="handleLeave" @mouseenter="handleEnter">
                <kdx-svg-icon class="close-icon" :type="enterClose?'icon-hover':'icon-guanbi-shixin'"></kdx-svg-icon>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "kdxTagLabel",
        props: {
            color: {
                type: String,
                default: '#E18110'
            },
            bgColor: {
                type: String,
                default: '#FFF9E6'
            },
            closable: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'default',
                validate: () => ['default', 'info', 'warning', 'danger', 'success', 'border-color', 'disabled',]
            },
            size: {
                type: String,
                default: 'default',
                validate: () => ['small', 'default']
            },
            border: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                enterClose: false
            }
        },
        methods: {
            close() {
                this.$emit('on-close');
            },
            labelClick(){
                this.$emit('label-click')
            },
            handleLeave() {
                this.enterClose = false
            },
            handleEnter() {
                this.enterClose = true
            }
        }
    };
</script>

<style scoped lang="scss">
    .tag-label {
        display: inline-block;
        > .label-content {
            padding: 2px 8px;
            position: relative;
            display: inline-block;
            border-radius: 2px;
            box-sizing: border-box;
            &:hover {
                .close {
                    display: block;
                }
            }
            .text {
                /*vertical-align: text-top;*/
            }
            .close {
                display: none;
                position: absolute;
                top: -10px;
                right: -8px;
                width: 16px;
                height: 16px;
                line-height: 16px;
                cursor: pointer;
                color: $text-zhushi;
                .close-icon {
                    font-size: 16px;
                }
                &:hover {
                    color: $text-second;
                }
            }
        }
        // 有边框，背景黑色
        > .label-default {
            color: $text-first;
            border: 1px solid $border-color;
        }
        > .label-info {
            color: $brand-color;
            background-color: $brand-light;
        }
        > .label-warning {
            color: $warning-color;
            background-color: $warning-light;
        }
        > .label-danger {
            color: $danger-color;
            background-color: $danger-light;
        }
        > .label-success {
            color: $success-color;
            background-color: $success-light;
        }
        > .label-disabled {
            color: $text-third;
            background-color: $background-color;
        }
        // 背景为border颜色，无边框
        > .label-border-color {
            color: $text-second;
            background-color: $border-color;
        }
        > .label-size-default {
            @include font-14-20;
        }
        > .label-size-small {
            @include font-12-16;
        }
        // border
        >.label-default-border {
            border: none;
        }
        >.label-info-border {
            border: 1px solid $brand-color;
            padding: 1px 7px;
        }
        >.label-warning-border {
            border: 1px solid $warning-color;
            padding: 1px 7px;
        }
        >.label-danger-border {
            border: 1px solid $danger-color;
            padding: 1px 7px;
        }
        >.label-success-border {
            border: 1px solid $success-color;
            padding: 1px 7px;
        }
    }
</style>
