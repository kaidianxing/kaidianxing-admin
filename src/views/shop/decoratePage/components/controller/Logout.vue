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
    <div class='logout' v-if='currentModal.id=="logout"&&lazyLoad'>
        <i-form :label-width="120" ref='logout' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <div>
                    <form-item label="主要颜色：">
                        <MyColorPicker v-model='currentModal.style.maincolor' default='ff3c29'></MyColorPicker>
                    </form-item>
                    <form-item label="辅助颜色：">
                        <MyColorPicker v-model='currentModal.style.subcolor' default='#ffffff'></MyColorPicker>
                    </form-item>
                    <form-item label="上间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.margintop'></MyDraggableProgress>
                    </form-item>
                     <form-item label="下间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                    </form-item>
                </div>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'logout',
        data() {
            return {
                id: 'logout',
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>