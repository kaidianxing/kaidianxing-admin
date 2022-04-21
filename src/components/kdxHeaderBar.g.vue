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
    <div class="header-bar" v-loading="loading">
        <!--多行显示-->
        <div class="more" v-if="type === 'more'">
            <div class="header" v-if="$slots.header">
                <div class="header-content">
                    <slot name="header"></slot>
                </div>
            </div>
            <div class="search" v-if="$slots.default">
                <div class="content">
                    <slot></slot>
                </div>
                <div class="btn" v-if="$slots.btn">
                    <slot name="btn"></slot>
                </div>
            </div>
        </div>
        <!--单行显示-->
        <div class="little" v-else>
            <!--跳转按钮-->
            <div class="header">
                <slot name="header"></slot>
            </div>
            <div class="search">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'kdxHeaderBar',
        props: {
            // 类型,more/little
            type: {
                type: String,
                default: 'more',
                validate: type => {
                    return ['more', 'little'].indexOf(type) > -1;
                }
            },
            loading: {
                type: Boolean,
                default: false
            }
        }
    };
</script>

<style scoped lang="scss">
    .header-bar {
        margin-bottom: 10px;
        /*overflow: auto;*/
        width: 100%;
        border-radius: 2px;
        > .more {
            > .header {
                padding: 0 30px;
                background-color: #ffffff;
                > .header-content {
                    padding: 20px 0;
                    border-bottom: 1px solid $border-color;
                }
            }
            > .search {
                padding-top: 20px;
                background-color: #ffffff;
                display: flex;
                flex-wrap: wrap;
                /deep/ .ivu-form {
                    .ivu-form-item {
                        margin-bottom: 20px;
                      // 搜索中form label不需要右边padding
                      .ivu-form-item-label {
                        padding-right: 0;
                      }
                    }
                    .ivu-form-item-btn {
                        display: inline-block;
                        padding-left: 20px;
                        padding-bottom: 20px;
                    }
                    .ivu-btn-text {
                        margin-left: 20px;
                    }
                }
                .ivu-btn-text {
                    margin-left: 20px;
                }
                .btn {
                    padding-left: 20px;
                    padding-bottom: 20px;
                }
            }
        }
        > .little {
            background-color: #ffffff;
            display: flex;
            flex-wrap: nowrap;
            height: 72px;
            align-items: center;
            justify-content: space-between;
            padding: 0 30px;
            > .header {
                flex: 1;
            }
            > .search {
                /deep/ .ivu-form {
                    .ivu-form-item {
                        margin-bottom: 0;
                        .ivu-form-item-label {
                            padding-right: 0;
                        }
                    }
                    .ivu-form-item-btn {
                        display: inline-block;
                        padding-left: 20px;
                        padding-bottom: 0;
                        .ivu-btn-text {
                            margin-left: 20px;
                        }
                    }
                }
            }
        }
    }
</style>
