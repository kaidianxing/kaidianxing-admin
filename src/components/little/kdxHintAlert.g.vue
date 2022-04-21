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
    <div class="hint-alert-component">
        <Alert :show-icon="showIcon" :class="[`alert-${type}`]">
            <slot></slot>
        </Alert>
    </div>
</template>

<script>
    export default {
        name: "kdxHintAlert",
        props: {
            showIcon: {
                type: Boolean,
                default: true
            },
            type: {
                type: String,
                default: 'default',
                validate: value => {
                    return ['default', 'info', 'warning', 'error'].indexOf(value) > -1;
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .hint-alert-component {
        /deep/ .ivu-alert {
            padding: 7px 9px;
            border-radius: 2px;
            margin: 0;
            @include font-12-16;
            .ivu-alert-icon {
                top: 7px;
                .ivu-icon {
                    font-size: 14px;
                }
            }
            .ivu-alert-message {
                vertical-align: middle;
                // 字体颜色的class
                .text-brand {
                    vertical-align: bottom;
                    color: $brand-color;
                }
            }
            a {
                color: $brand-color;
            }
            .ivu-btn {
                font-size: 12px;
                line-height: 16px;
            }
        }
        /deep/ .ivu-alert.ivu-alert-with-icon {
            padding-left: 32px;
        }
        // type
        /deep/ .alert-default {
            color: $text-second;
        }
        /deep/ .alert-info {
            color: $brand-color;
        }
        /deep/ .alert-error {
            color: $danger-color;
            background-color: $danger-light;
            border-color: $danger-color;
            .ivu-alert-icon {
                color: $danger-color;
            }
        }
        /deep/ .alert-warning {
            color: $warning-color;
            background-color: $warning-light;
            border-color: $warning-color;
            .ivu-alert-icon {
                color: $warning-color;
            }
        }
    }
</style>
