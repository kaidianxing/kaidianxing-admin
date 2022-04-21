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
    <div
        class='richtext'
        :style="{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`}"
        v-if='componentData&&componentData.id=="richtext"'
    >
        <div
            class="container"
            :style="{
                background:componentData.style.background, 
                borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
                padding: `0 ${px2rpx(componentData.style.padding)}`
            }"
        >
            <my-rich-text :content='componentData.params.content'></my-rich-text>
        </div>
    </div>
</template>

<script>
import mixin from './mixin.js'
import MyRichText from '../templates-shim/RichText.vue'
export default {
    mixins: [mixin],
    name: 'richtext',
    components: {
        MyRichText
    },
    data() {
        return {
            content: ''
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./decorate.scss";
.richtext {
    box-sizing: border-box;
    .container {
        border-radius: px2rpx(6);
        min-height: rpx(100);
        overflow: hidden;
    }
}
</style>