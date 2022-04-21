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
    <div class='detail_spec' v-if='currentModal.id=="detail_spec"&&lazyLoad'>
        <i-form :label-width="100" ref='detail_spec' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="标题颜色：">
                    <MyColorPicker v-model='currentModal.style.titlecolor' default='#969696'></MyColorPicker>
                </form-item>
                <form-item label="内容文字：">
                    <MyColorPicker v-model='currentModal.style.textcolor' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="箭头颜色：">
                    <MyColorPicker v-model='currentModal.style.arrowcolor' default='#969696'></MyColorPicker>
                </form-item>
                <form-item label="背景颜色：">
                    <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="上间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.margintop'></MyDraggableProgress>
                </form-item>
                <form-item label="下间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'detail_spec',
        data() {
            return {
                id: 'detail_spec',
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>