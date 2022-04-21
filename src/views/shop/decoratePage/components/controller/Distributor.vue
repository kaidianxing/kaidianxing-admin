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
    <div class='distributor' v-if='currentModal.id=="distributor"&&lazyLoad'>
        <i-form :label-width="120" ref='distributor' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <div>
                    <form-item label="按钮形状：">
                        <MyRadioGroup :items='style' v-model='currentModal.params.style'></MyRadioGroup>
                    </form-item>
                </div>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <div>
                    <form-item label="昵称颜色：">
                        <MyColorPicker v-model='currentModal.style.nicknamecolor' default='#ffffff'></MyColorPicker>
                    </form-item>
                    <form-item label="推荐人颜色：">
                        <MyColorPicker v-model='currentModal.style.recommendercolor' default='#ffffff'></MyColorPicker>
                    </form-item>
                    <form-item label="背景颜色：">
                        <MyColorPicker v-model='currentModal.style.background' default='#FF6F29'></MyColorPicker>
                    </form-item>
                    <form-item label="标题颜色：">
                        <MyColorPicker v-model='currentModal.style.titlecolor' default='#212121'></MyColorPicker>
                    </form-item>
                    <form-item label="金额颜色：">
                        <MyColorPicker v-model='currentModal.style.moneycolor' default='#212121'></MyColorPicker>
                    </form-item>
                    <form-item label="高亮颜色：">
                        <MyColorPicker v-model='currentModal.style.hightlightcolor' default='#FF3C29'></MyColorPicker>
                    </form-item>
                </div>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item label="推荐人：">
                    <MyRadioGroup :items='show_recommender' v-model='currentModal.params.show_recommender'></MyRadioGroup>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'distributor',
        data() {
            return {
                id:'distributor',
                style: [{
                    label: '样式一',
                    id: 'default1'
                }],
                show_recommender: [{
                    label: '显示',
                    id: '1'
                }, {
                    label: '隐藏',
                    id: '0'
                }]
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss'; 
</style>