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
    <div class='diymenu' v-if='currentModal.id=="diymenu"&&lazyLoad'>
        <i-form :label-width="120" ref='diymenu' :model="currentModal" :rules="ruleValidate">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <div>
                    <form-item label="图标样式：" style='margin-bottom:40px;'>
                        <MyButtonGroup :items='icon_type' v-model='currentModal.icon_type' @change='refresh'></MyButtonGroup>
                    </form-item>
                    <form-item label="图标位置：" v-if='currentModal.icon_type=="0"'>
                        <MyRadioGroup :items='icon_position' v-model='currentModal.icon_position' @change='refresh'></MyRadioGroup>
                    </form-item>
                </div>
            </MyCollapse>
             <MyCollapse>
                <p class="form-title" slot='label'>
                    菜单内容
                </p>
                <div class="content-setting">
                    <form-item label="菜单名称：" prop="name">
                        <Input v-model="currentModal.name" @on-change='changeName'></Input>
                    </form-item>
                    <form-item label="购物车数量：">
                        <MyRadioGroup :items='cart_number' v-model='currentModal.cart_number' @change='refreshCurrentModal'>
                            <form-item label="背景颜色：" v-if='currentModal.cart_number==1' style='margin:10px 0;'>
                                <MyColorPicker v-model='currentModal.cart_bgcolor' @change='refreshCurrentModal' default='#ff3c29'></MyColorPicker>
                            </form-item>
                        </MyRadioGroup>
                        <p class="tip">提示：开启后将在链接为"购物车"的一级菜单上显示购物车数量。</p>
                    </form-item>
                </div>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    图标内容
                </p>
                <IconContent :current-modal='currentModal'></IconContent>
            </MyCollapse>
            
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <div>
                    <form-item label="分割线颜色：">
                        <MyColorPicker v-model='currentModal.style.bordercolor' default='#eeeeee'></MyColorPicker>
                    </form-item>
                    <form-item label="背景颜色：" v-if='currentModal.icon_type=="1"'>
                        <MyColorPicker v-model='currentModal.style.bgcolor' default='#ffffff'></MyColorPicker>
                    </form-item>
                    <div v-if='currentModal.icon_type=="0"'>
                        <form-item label="文字：">
                            <div class="bg-color" style='padding:20px 0 10px;'>
                                <form-item label="默认颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.textcolor' default='#565656'></MyColorPicker>
                                </form-item>
                                <form-item label="选中颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.textcoloron' default='#212121'></MyColorPicker>
                                </form-item>
                            </div>
                        </form-item>
                        <form-item label="图标：">
                            <div class="bg-color" style='padding:20px 0 10px;'>
                                <form-item label="默认颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.iconcolor' default='#565656'></MyColorPicker>
                                </form-item>
                                <form-item label="选中颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.iconcoloron' default='#ff3c29'></MyColorPicker>
                                </form-item>
                            </div>
                        </form-item>
                        <form-item label="子级：">
                            <div class="bg-color" style='padding:20px 0 10px;'>
                                <form-item label="文字颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.childtextcolor' default='#212121'></MyColorPicker>
                                </form-item>
                                <form-item label="背景颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.childbgcolor' default='#ffffff'></MyColorPicker>
                                </form-item>
                                <form-item label="选中颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.childactivebgcolor' default='#e6e7eb'></MyColorPicker>
                                </form-item>
                            </div>
                        </form-item>
                        <form-item label="背景：">
                            <div class="bg-color" style='padding:20px 0 10px;'>
                                <form-item label="默认颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.bgcolor' default='#ffffff'></MyColorPicker>
                                </form-item>
                                <form-item label="选中颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.bgcoloron' default='#ffffff'></MyColorPicker>
                                </form-item>
                            </div>
                        </form-item>
                    </div>
                </div>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import IconContent from './Diymenu/IconContent.vue'
    export default {
        components: {
            IconContent
        },
        mixins: [mixin],
        name: 'diymenu',
        data() {
            return {
                id:'diymenu',
                icon_type: [{
                    label: '图标+文字',
                    icon: 'iconfont icon-zujian-tubiaowenzi',
                    id: '0'
                }, {
                    label: '图片',
                    icon: 'iconfont icon-zujian-tupian',
                    id: '1'
                }],
                cart_number: [{
                    label: '不显示',
                    id: '0'
                }, {
                    label: '显示',
                    id: '1'
                }],
                icon_position: [{
                    label: '上方',
                    id: 'top'
                }, {
                    label: '左侧',
                    id: 'left'
                }],
                ruleValidate: {
                    name: [{
                        required: true,
                        message: '请输入菜单名称'
                    }]
                }
            }
        },
        watch: {
            currentModal: {
                immediate: true,
                handler() {
                    this.currentModal.items.forEach(item => {
                        item['icon_url_' + this.currentModal.icon_type] = item.icon_url
                    })
                    this.currentModal.app_type = this.$route.query.type
                    this.pageInfo.title = this.currentModal.name;
                }
            }
        }, 
        methods: {
            changeName(e) {
                let name = e.target.value;
                this.pageInfo.title = name;
                this.refreshPageInfo();
            },
            refresh(val) {
                this.currentModal.items.forEach(item => {
                    item.icon_url = item['icon_url_' + val] || ''
                })
                this.refreshCurrentModal()
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';

    .content-setting {
        /deep/ .content {
            padding: 10px 0;
        }
    }
</style>