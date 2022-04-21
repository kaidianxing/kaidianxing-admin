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
    <div class='audio' v-if='currentModal.id=="audio"&&lazyLoad'>
        <i-form :label-width="100" ref='audio' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <form-item label="播放样式：">
                    <MyRadioGroup :items='playerstyle' v-model='currentModal.params.playerstyle'></MyRadioGroup>
                </form-item>
                <form-item label="选择音频：">
                    <MyInputWithReset v-model='currentModal.params.audiourl'></MyInputWithReset>
                </form-item>
                <form-item label="标题：">
                    <Input v-model='currentModal.params.title'></Input>
                </form-item>
                <form-item label="副标题：">
                    <Input v-model='currentModal.params.subtitle'></Input>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="上下间距：">
                    <MyDraggableProgress :min='10' :max='50' unit='px' v-model='currentModal.style.paddingtop'></MyDraggableProgress>
                </form-item>
                <form-item label="左右间距：">
                    <MyDraggableProgress :min='10' :max='50' unit='px' v-model='currentModal.style.paddingleft'></MyDraggableProgress>
                </form-item>
                <form-item label="消息宽度：">
                    <MyDraggableProgress :min='80' :max='180' unit='px' v-model='currentModal.style.width'></MyDraggableProgress>
                    <p class='tip'>提示：可根据消息的不同长度设置不同的宽度</p>
                </form-item>
                <form-item label="背景颜色：">
                    <MyColorPicker v-model='currentModal.style.background'></MyColorPicker>
                </form-item>
                <form-item label="边框颜色：">
                    <MyColorPicker v-model='currentModal.style.bordercolor'></MyColorPicker>
                </form-item>
                <form-item label="标题颜色：">
                    <MyColorPicker v-model='currentModal.style.textcolor'></MyColorPicker>
                </form-item>
                <form-item label="副标题颜色：">
                    <MyColorPicker v-model='currentModal.style.subtitlecolor'></MyColorPicker>
                </form-item>
                <form-item label="时间颜色：">
                    <MyColorPicker v-model='currentModal.style.timecolor'></MyColorPicker>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    其他
                </p>
                <form-item label="循环播放：">
                    <MyRadioGroup :items='loopplay' v-model='currentModal.params.loopplay'>
                    </MyRadioGroup>
                </form-item>
                <form-item label="播放设置：">
                    <MyRadioGroup :items='pausestop' v-model='currentModal.params.pausestop'>
                    </MyRadioGroup>
                </form-item>
            </MyCollapse>
        </i-form>
        <Alert>提示：编辑页面播放只提供播放/停止功能，更多动画、功能请在手机端查看</Alert>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'audio',
        data() {
            return {
                id:'audio',
                playerstyle: [{
                    label: '音乐播放模式',
                    id: '0'
                }, {
                    label: '语音消息模式',
                    id: '1'
                }],
                loopplay: [{
                    label: '关闭',
                    id: '0'
                }, {
                    label: '启用',
                    id: '1'
                }],
                pausestop: [{
                    label: '暂停后再恢复播放时，继续播放',
                    id: '0'
                }, {
                    label: '暂停后再恢复播放时，从头播放',
                    id: '1'
                }],
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>