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
    <div class="form-title" :class="{ hasMargin: hasMargin }">
        <span> {{ content }}</span>
        <slot></slot>
        <span class="text">
            <slot name="text"></slot>
        </span>
    </div>
</template>

<script>
// 用于form表单上面的标题显示--如添加商品上基本信息
export default {
    name: 'kdxFormTitle',
    props: {
        content: {
            type: String
        },
        hasMargin: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style scoped lang="scss">
.form-title {
    @include font-16-22-bold;
    padding: 9px 20px;
    background-color: $background-color;
    border-radius: 2px;
    &.hasMargin {
        margin-bottom: 30px;
    }
    .text {
        @include font-12-16;
        color: $text-first;
        font-weight: normal;
    }
}
</style>
