/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="credit-info" v-if='currentModal.id=="credit"&&lazyLoad'>
        <i-form :label-width="110" ref='credit' :model="currentModal">
            <MyCollapse>
                <p class="form-title" slot='label'>组件样式</p>
                <form-item label="标签样式：" style='margin-bottom:48px;'>
                    <MyButtonGroup :items='styleType' v-model='currentModal.style.styletype' @change="changeType"></MyButtonGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>内容样式</p>
                <form-item label="搜索框：">
                    <MyRadioGroup :items='showSearch' v-model='currentModal.params.showsearch'>
                        <template v-if="currentModal.params.showsearch === '1'">
                            <form-item label="提示文字：" :label-width="80" class="mb-20">
                                <Input placeholder="搜索积分商品" v-model='currentModal.params.tiptext' :maxlength="10" show-word-limit style="width: 236px"></Input>
                            </form-item>
                            <form-item label="背景颜色：" :label-width="80" class="mb-20">
                                <MyColorPicker v-model='currentModal.style.bgcolor' default='#ffffff'></MyColorPicker>
                            </form-item>
                            <form-item label="图标颜色：" :label-width="80" class="mb-20">
                                <MyColorPicker v-model='currentModal.style.iconcolor' default='#b6b6b6'></MyColorPicker>
                            </form-item>
                            <form-item label="文字颜色：" :label-width="80" style="margin-bottom: 0">
                                <MyColorPicker v-model='currentModal.style.textcolor' default='#c2c2c2'></MyColorPicker>
                            </form-item>
                        </template>
                    </MyRadioGroup>
                </form-item>
                <form-item label="组件背景：" v-if="currentModal.style.styletype === 'two'">
                    <MyRadioGroup :items='tempType' v-model='currentModal.params.temptype'>
                        <form-item :label-width="80" v-if="currentModal.params.temptype === 'img'" label="背景图片：" style="margin-bottom:0;">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='image' v-model='currentModal.params.tempimg' @change='refreshCurrentModal'></MyAddImgImg>
                            <kdx-hint-text style="margin-left: 80px;padding-top: 0;" class="hint-img-text">建议图片尺寸为702x258像素</kdx-hint-text>
                        </form-item>
                        <form-item :label-width="80" v-else label="背景颜色：" style="margin-bottom:0;">
                            <MyColorPicker v-model='currentModal.style.tempcolor' default='#3e4153'></MyColorPicker>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
                <form-item label="卡片背景：">
                    <MyRadioGroup :items='cardType' v-model='currentModal.params.cardtype'>
                        <form-item :label-width="80" v-if="currentModal.params.cardtype === 'img'" label="背景图片：" style="margin-bottom:0;">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='image' v-model='currentModal.params.cardimg' @change='refreshCurrentModal'></MyAddImgImg>
                            <kdx-hint-text style="margin-left: 80px;padding-top: 0;" class="hint-img-text">建议图片尺寸为702x258像素</kdx-hint-text>
                        </form-item>
                        <form-item :label-width="80" v-else label="背景颜色：" style="margin-bottom:0;">
                            <MyColorPicker v-model='currentModal.style.cardcolor' default='#fc6317'></MyColorPicker>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
                <form-item label="卡片圆角：" v-if="currentModal.style.styletype === 'two'">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.borderadius'></MyDraggableProgress>
                </form-item>
                <form-item label="昵称颜色：">
                    <MyColorPicker v-model='currentModal.style.membercolor' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="积分颜色：">
                    <MyColorPicker v-model='currentModal.style.creditcolor' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="积分规则：">
                    <MyColorPicker v-model='currentModal.style.rulecolor' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="积分按钮：">
                    <CheckboxGroup v-model="currentModal.params.creditBtn">
                        <Checkbox v-for="btn in creditBtns" :label="btn.id" :key="btn.id">{{btn.label}}</Checkbox>
                    </CheckboxGroup>
                </form-item>
                <form-item label="积分明细：" v-if="currentModal.params.creditBtn.includes('0')">
                    <div class="bg-color">
                        <form-item label="图标：" :label-width="80">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='icon' v-model='currentModal.params.recordicon' @change='refreshCurrentModal'></MyAddImgImg>
                        </form-item>
                        <form-item :label-width="80" label="图标颜色：">
                            <MyColorPicker v-model='currentModal.style.recordiconcolor' :default='defaultBtnColor'></MyColorPicker>
                        </form-item>
                        <form-item :label-width="80" label="文字颜色：">
                            <MyColorPicker v-model='currentModal.style.recordtextcolor' :default='defaultBtnColor'></MyColorPicker>
                        </form-item>
                        <form-item :label-width="80" label="描边颜色：" v-if="currentModal.style.styletype === 'two'">
                            <MyColorPicker v-model='currentModal.style.recordbcolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                    </div>
                </form-item>
                <form-item label="我的订单：" v-if="currentModal.params.creditBtn.includes('1')">
                    <div class="bg-color">
                        <form-item label="图标：" :label-width="80">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='icon' v-model='currentModal.params.ordericon' @change='refreshCurrentModal'></MyAddImgImg>
                        </form-item>
                        <form-item :label-width="80" label="图标颜色：">
                            <MyColorPicker v-model='currentModal.style.ordericoncolor' :default='defaultBtnColor'></MyColorPicker>
                        </form-item>
                        <form-item :label-width="80" label="文字颜色：">
                            <MyColorPicker v-model='currentModal.style.ordertextcolor' :default='defaultBtnColor'></MyColorPicker>
                        </form-item>
                        <form-item :label-width="80" label="描边颜色：" v-if="currentModal.style.styletype === 'two'">
                            <MyColorPicker v-model='currentModal.style.orderbcolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                    </div>
                </form-item>
                <form-item label="按钮背景：" v-if="currentModal.style.styletype === 'one'">
                    <MyColorPicker v-model='currentModal.style.btncolor' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="分割线颜色：" v-if="currentModal.style.styletype === 'one'">
                    <MyColorPicker v-model='currentModal.style.bordercolor' default='#e6e7eb'></MyColorPicker>
                </form-item>
                <form-item label="上间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.margintop'></MyDraggableProgress>
                </form-item>
                <form-item label="下间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px'
                                         v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                </form-item>
                <form-item label="左右边距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px'
                                         v-model='currentModal.style.marginleft'></MyDraggableProgress>
                </form-item>
                <form-item label="内部间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px'
                                         v-model='currentModal.style.betweenmargin'></MyDraggableProgress>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        name: "Credit",
        mixins: [mixin],
        components: {},
        props: {},
        data() {
            return {
                showSearch: [
                    {
                        label: '显示',
                        id: '1',
                    }, {
                        label: '不显示',
                        id: '0'
                    }
                ],
                tempType: [
                    {
                        label: '颜色',
                        id: 'color'
                    },
                    {
                        label: '背景图片',
                        id: 'img'
                    }
                ],
                cardType: [
                    {
                        label: '颜色',
                        id: 'color'
                    },
                    {
                        label: '背景图片',
                        id: 'img'
                    }
                ],
                creditBtns: [{
                    id:'0',
                    label: '积分明细'
                }, {
                    id: '1',
                    label: '我的订单'
                }],
            }
        },
        computed: {
            styleType() {
                return [{
                    label: '样式1',
                    icon: 'iconfont icon-jifenxinxi1',
                    id: 'one'
                }, {
                    label: '样式2',
                    icon: 'iconfont icon-jifenxinxi2',
                    id: 'two'
                }];
            },
            defaultBtnColor() {
                if (this.currentModal.style.styletype === 'one') {
                    return '#212121'
                } else {
                    return '#ffffff'
                }
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            changeType(e) {
                if (e === 'one') {
                    this.currentModal.style.margintop = 32;
                    this.currentModal.style.recordiconcolor = '#212121'
                    this.currentModal.style.recordtextcolor = '#212121'
                    this.currentModal.style.ordericoncolor = '#212121'
                    this.currentModal.style.ordertextcolor = '#212121'
                } else {
                    this.currentModal.style.margintop = 0
                    this.currentModal.style.recordiconcolor = '#ffffff'
                    this.currentModal.style.recordtextcolor = '#ffffff'
                    this.currentModal.style.ordericoncolor = '#ffffff'
                    this.currentModal.style.ordertextcolor = '#ffffff'
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .credit-info {
        .mb-20 {
            margin-bottom: 20px;
        }
        .bg-color {
            padding: 20px;
            .ivu-form-item {
                margin-bottom: 20px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>