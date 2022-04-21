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
    <transition name="el-loading-fade">
        <div class="loading" v-show="visible">
            <div class="loading-spinner">
                <svg class="circular" viewBox="25 25 50 50">
                    <circle class="path" cx="50" cy="50" r="20" fill="none"/>
                </svg>
                <p class="text">{{title}}</p>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                visible: false,
                title: '正在加载...'
            };
        }
    };
</script>

<style scoped lang="scss">
    .loading {
        position: absolute;
        z-index: 1006;
        background-color: #ffffff;
        margin: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: opacity .3s;
        .loading-spinner {
            top: 50%;
            margin-top: -21px;
            width: 100%;
            text-align: center;
            position: absolute;
            .circular {
                height: 42px;
                width: 42px;
                animation: loading-rotate 2s linear infinite;
                .path {
                    animation: loading-dash 1.5s ease-in-out infinite;
                    stroke-dasharray: 90,150;
                    stroke-dashoffset: 0;
                    stroke-width: 4;
                    stroke: #409eff;
                    stroke-linecap: round;
                }
            }
        }
        .text {
            @include font-14-20;
            color: $text-first;
        }
    }
    @keyframes loading-rotate {
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes loading-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -40px;
        }
        100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -120px;
        }
    }
    .el-loading-fade-enter,
    .el-loading-fade-leave-active {
        opacity: 0;
    }
</style>
