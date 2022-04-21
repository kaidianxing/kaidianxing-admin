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
    <div class='commission_sharecode' v-if='currentModal.id=="commission_sharecode"&&lazyLoad'>
        <i-form :label-width="100" ref='commission_sharecode' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <div>
                    <form-item label="图标：">
                        <MyRadioGroup :items='showicon' v-model='currentModal.params.showicon'></MyRadioGroup>
                    </form-item>
                </div>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="左侧文字：">
                    <MyColorPicker v-model='currentModal.style.textcolor' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="图标颜色：">
                    <MyColorPicker v-model='currentModal.style.iconcolor' default='#ff6f29'></MyColorPicker>
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
                <form-item label="左右间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginleft'></MyDraggableProgress>
                </form-item>
                <form-item label="上边角：">
                    <MyRadioGroup :items='borderradius' v-model='currentModal.params.topborderradius'></MyRadioGroup>
                </form-item>
                <form-item label="下边角：">
                    <MyRadioGroup :items='borderradius' v-model='currentModal.params.bottomborderradius'></MyRadioGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item :label-width="0">
                    <div class="bg-color">
                        <MyListNavigator :value='getParams' @change-icon='changeIcon' @change-link='changeLink' @get-input='getInput'></MyListNavigator>
                    </div>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'commission_sharecode',
        data() {
            return {
                id:'commission_sharecode',
                showicon: [{
                    label: '显示',
                    id: '1'
                }, {
                    label: '隐藏',
                    id: '0'
                }],
                borderradius: [{
                    label: '直角',
                    id: 'block'
                }, {
                    label: '圆角',
                    id: 'round'
                }],
            }
        },
        computed: {
            getParams() {
                let params = this.currentModal.params
                return {
                    'title': params.title,
                    'icon': params.iconclass, //要显示的icon 
                    'subTitle': params.subtitle,
                    'linkurl': params.linkurl,
                    'linkurl_name': params.linkurl_name
                }
            },
            getListStyle() {
                return 0
            }
        },
        methods: {
            changeIcon(val) {
                this.currentModal.params.iconclass = val;
            },
            changeLink(val) {
                this.currentModal.params.linkurl = val.link;
                this.currentModal.params.linkurl_name = val.name;
            },
            getInput(type, val) {
                if (type == 'left') {
                    this.currentModal.params.title = val;
                } else {
                    this.currentModal.params.subtitle = val;
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .bg-color {
        width: 500px;
        background: #F4F6F8;
        /* global/border */
        border: 1px solid #E9EDEF;
        box-sizing: border-box;
        border-radius: 2px;
        padding: 10px 20px 10px;
        /deep/ .right-input,
        /deep/ .left-input {
            width: 355px;
        }
    }
</style>