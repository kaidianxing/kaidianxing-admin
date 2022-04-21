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
    <div class="hint-text">
        <span class='content' v-html='content'></span>
        <span>
            <slot></slot>
        </span>
        <router-link v-if="path" class="router" :to="path">{{routeContent}}</router-link>
        <span v-if="!path" class="router">{{routeContent}}</span>
        <span class="error vip-error" v-show="errContent">{{errContent}}</span>
    </div>
</template>

<script>
    // 下方说明文字
    export default {
        name: "kdxHintText",
        props: {
            content: {
                type: String
            },
            routeContent: {
                type: String
            },
            path: {
                type: String
            },
            errContent: {
                type: String
            }
        }
    };
</script>

<style scoped lang="scss">
    .hint-text {
        @include font-12-16;
        padding-top:10px;
        color: $text-third;
        /deep/ .ivu-btn {
            font-size: 12px;
        }
        a {
            color: $brand-color;
            &.ivu-btn {
                height: inherit;
                vertical-align: inherit;
            }
        }
        .content {
            font-size: 12px;
            line-height: 16px;
            color: $text-third;
            padding-top: 6px;
        }
        .router {
            color: $brand-color;
        }
        .error {
            color: #FF1F2C;
            font-weight: bold;
            font-size: 12px;
            line-height: 17px;
        }
        /*.vip-error {*/
        /*    font-size: 14px;*/
        /*}*/
    }
</style>
