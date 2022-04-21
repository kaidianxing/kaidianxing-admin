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
    <div class="data-card-panel" @click="handleClick">
        <div class="card-panel-box" :class="[`card-panel-${type}`]">
            <div class="icon" v-if="icon">
                <span :class="['iconfont', icon]"></span>
            </div>
            <div class="image" v-else-if="image">
                <img :src="image" alt="">
            </div>
            <div class="card-panel-description">
                <p class="title">
                    {{title}}
                </p>
                <p class="data">
                    <slot></slot>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CardPanel",
        props: {
            type: {
                type: String,
                validate: ['info', 'success', 'warning', 'danger', 'blue', 'purple']
            },
            icon: {
                type: String,
            },
            image: {
                type: String,
            },
            title: {
                type: String
            }
        },
        methods: {
            handleClick() {
                this.$emit('click');
            }
        }
    };
</script>

<style scoped lang="scss">
    .data-card-panel {
        > .card-panel-box {
            border: 1px solid $border-color;
            border-radius: 2px;
            box-sizing: border-box;
            display: flex;
            flex-wrap: nowrap;
            align-items: center;

            .icon {
                padding: 25px 0 25px 30px;
                flex-shrink: 0;

                span {
                    font-size: 36px;
                    padding: 15px;
                    border-radius: 100%;
                }
            }

            .image {
                width: 60px;
                height: 60px;
                margin-left: 40px;
                flex-shrink: 0;

                > img {
                    width: 100%;
                    height: 100%;
                }
            }

            .card-panel-description {
                padding: 30px 0 30px 20px;

                .title {
                    @include font-12-16;
                    color: $text-second;
                    padding-bottom: 5px;
                }

                .data {
                    @include font-32-39-500;
                    color: $text-first;
                    font-family: "PingFang SC", "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
                }
            }
        }

        // 颜色
        .card-panel-warning {
            background: $data-liner-goods;

            > .icon {
                span {
                    background-color: $warning-light;
                    color: $warning-color;
                }
            }
        }

        .card-panel-success {
            background: $data-liner-vip;

            > .icon {
                span {
                    background-color: $success-light;
                    color: $success-color;
                }
            }
        }

        // blue
        .card-panel-blue {
            background: $data-bg-liner;
        }

        // blue
        .card-panel-purple {
            background: $data-bg-purple;
            > .icon {
                span {
                    background-color: rgba(143,128,255,0.1);
                    color: #5D60F6;
                }
            }
        }
    }
    @media  screen and (max-width: 1440px) {
        .data-card-panel {
            .card-panel-box {
                > .image {
                    width: 48px;
                    height: 48px;
                    margin-left: 20px;
                }
               > .icon {
                    padding-left: 20px;
                    span {
                        padding: 10px;
                        font-size: 24px !important;
                    }
                }
                .card-panel-description {
                    padding: 20px 0 20px 10px;
                    .data {
                        font-size: 28px;
                    }
                }
            }
        }
    }
</style>
