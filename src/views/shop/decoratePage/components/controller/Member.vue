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
    <div class='member' v-if='currentModal.id=="member"&&lazyLoad'>
        <i-form :label-width="120" ref='member' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <div>
                    <form-item label="标签样式：">
                        <MyButtonGroup :items='style' v-model='currentModal.params.style' @change="styleChange"></MyButtonGroup>
                    </form-item>
                    <form-item label="头像形状：">
                        <MyButtonGroup :items='headstyle' v-model='currentModal.style.headstyle'></MyButtonGroup>
                    </form-item>
                </div>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <div>
                    <form-item label="组件背景：">
                        <MyRadioGroup :items='bgstyle' v-model='currentModal.params.bgstyle'>
                            <form-item :label-width="100" class="mb-0" v-if="currentModal.params.bgstyle == 'img'" label="背景图片：" style="margin-bottom:0;">
                                <MyAddImgImg style="display:inline-block;" size='mini' type='image' v-model='currentModal.params.bgimg' @change='refreshCurrentModal'></MyAddImgImg>
                                <kdx-hint-text  class="hint-img-text" v-if="currentModal.params.style=='default1'">建议图片尺寸为750x280像素。</kdx-hint-text>
                                <kdx-hint-text  class="hint-img-text" v-else-if="currentModal.params.style=='default2'">建议图片尺寸为750x380像素。</kdx-hint-text>
                            </form-item>
                            <form-item v-else label="背景颜色：" :label-width="100" class="mb-0">
                                <MyColorPicker v-model='currentModal.style.bgcolor' default='#ff3c29'></MyColorPicker>
                            </form-item>
                        </MyRadioGroup>
                    </form-item>
                    <form-item label="卡片背景：" v-if="currentModal.params.style=='default2'">
                        <MyRadioGroup :items='bgstyle' v-model='currentModal.params.cardbgstyle'>
                            <form-item :label-width="100" class="mb-0" v-if="currentModal.params.cardbgstyle == 'img'" label="背景图片：" style="margin-bottom:0;">
                                <MyAddImgImg style="display:inline-block;" size='mini' type='image' v-model='currentModal.params.cardbgimg' @change='refreshCurrentModal'></MyAddImgImg>
                                <kdx-hint-text  class="hint-img-text">建议图片尺寸为750x332像素。</kdx-hint-text>
                            </form-item>
                            <form-item v-else label="背景颜色：" :label-width="100" class="mb-0">
                                <MyColorPicker v-model='currentModal.style.cardbgcolor' default='#ffffff'></MyColorPicker>
                            </form-item>
                        </MyRadioGroup>
                    </form-item>
                    <form-item label="昵称颜色：">
                        <MyColorPicker v-model='currentModal.style.nickcolor' :default='getColor.nickcolor'></MyColorPicker>
                    </form-item>
                    <form-item label="财务按钮：">
                         <CheckboxGroup v-model="currentModal.params.financeBtn">
                             <Checkbox v-for="btn in financeBtns" :label="btn.id" :key="btn.id">{{btn.label}}</Checkbox>
                         </CheckboxGroup>
                    </form-item>
                    <form-item label="财务样式：">
                        <div class="bg-color">
                            <form-item label="数字颜色：" :label-width="100" class="mb-20">
                                <MyColorPicker v-model='currentModal.style.numcolor'  :default='getColor.numcolor'></MyColorPicker>
                            </form-item>
                            <form-item label="标题颜色：" :label-width="100" class="mb-20">
                                <MyColorPicker v-model='currentModal.style.titlecolor'  :default='getColor.titlecolor'></MyColorPicker>
                            </form-item>
                            <form-item label="分隔线颜色：" :label-width="100" class="mb-0">
                                <MyColorPicker v-model='currentModal.style.linecolor'  :default='getColor.linecolor'></MyColorPicker>
                            </form-item>
                        </div>
                    </form-item>
                </div>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <div>
                    <form-item label="会员等级：">
                         <div class="bg-color">
                            <form-item label="图标：" :label-width="100" class="mb-20">
                                <MyAddImgImg style="display:inline-block;" size='mini' type='icon' v-model='currentModal.params.levelicon' @change='refreshCurrentModal'></MyAddImgImg>
                            </form-item>
                            <form-item label="背景颜色：" :label-width="100"  class="mb-20">
                                <MyColorPicker v-model='currentModal.style.levelbgcolor' default='#31312D'></MyColorPicker>
                            </form-item>
                            <form-item label="文字颜色：" :label-width="100"  class="mb-20">
                                <MyColorPicker v-model='currentModal.style.levelcolor' default='#F2DCAC'></MyColorPicker>
                            </form-item>
                            <form-item label="跳转链接：" :label-width="100"  class="mb-0">
                                <SelectLink :value='{
                                    name: currentModal.params.levellink_name,
                                    url: currentModal.params.levellink,
                                    wxappid: currentModal.params.level_wxappid
                                }'
                                style="width:236px;"
                                @change='changeLink("level",$event)'></SelectLink>
                            </form-item>
                        </div>
                    </form-item>
                </div>
                 <form-item label='设置按钮：'>
                    <div class='bg-color'>
                        <form-item label="图标：" :label-width="100" class="mb-20">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='icon' v-model='currentModal.params.seticon' @change='refreshCurrentModal'></MyAddImgImg>
                        </form-item>
                        <form-item label="按钮颜色：" :label-width="100"  class="mb-20" v-if="currentModal.params.style == 'default1'">
                            <MyColorPicker v-model='currentModal.style.setbtncolor' default='#FFFFFF'></MyColorPicker>
                        </form-item>
                        <form-item label="按钮颜色：" :label-width="100"  class="mb-20" v-else>
                            <MyColorPicker v-model='currentModal.style.setbtncolor2' default='#FFFFFF'></MyColorPicker>
                        </form-item>
                        <form-item label="链接：" :label-width="100"  class="mb-0">
                            <SelectLink :value='{
                                name: currentModal.params.setlink_name,
                                url: currentModal.params.setlink,
                                wxappid: currentModal.params.set_wxappid
                            }'
                            style="width:236px;"
                            @change='changeLink("set",$event)'></SelectLink>
                        </form-item>
                    </div>
                </form-item>
                <form-item label='签到按钮：'>
                    <div class='bg-color'>
                        <form-item label="签到文字：" :label-width="100" class="mb-20">
                            <Input v-model="currentModal.params.signtext" placeholder="请输入"
                                   class="limit-input"
                                   style="width: 235px"
                                   type="text"
                                   maxlength="4"
                                   show-word-limit/>
                        </form-item>
                        <form-item label="文字颜色：" :label-width="100" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.signcolor' default='#FFFFFF'></MyColorPicker>
                        </form-item>
                        <form-item label="背景颜色：" :label-width="100" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.signbgcolor' default='#DF482A'></MyColorPicker>
                        </form-item>
                        <form-item label="透明度：" :label-width='100' class="mb-20 customDraggableProgress">
                            <MyDraggableProgress v-model='currentModal.style.signbgopacity' :min='0' :max='100'
                                                 :ratio='1' unit='%'></MyDraggableProgress>
                        </form-item>
                        <form-item label="链接：" :label-width="100" class="mb-20">
                            <SelectLink :value='{
                                name: currentModal.params.signlink_name,
                                url: currentModal.params.signlink,
                                wxappid: currentModal.params.set_wxappid
                            }'
                                        style="width:236px;"
                                        @change='changeLink("set",$event)'></SelectLink>
                        </form-item>
                    </div>
                </form-item>
            </MyCollapse>
        </i-form>

    </div>
</template>

<script>
 import SelectLink from '@/components/decorate/SelectLink'
    // 样式默认颜色
    let styleObj = {
        default1: {
            nickcolor:'#ffffff',
            numcolor: '#ffffff',
            titlecolor:'#ffffff',
            linecolor: '#ffffff',
        },
        default2: {
                nickcolor:'#212121',
            numcolor: '#212121',
            titlecolor:'#212121',
            linecolor: '#e6e7eb',
        }
    }
    import mixin from './mixin.js'
    export default {
        components: {
            SelectLink
        },
        mixins: [mixin],
        name: 'member',
        data() {
            return {
                id:'member',
                style: [{
                    label: '样式一',
                    icon: 'iconfont icon-zujian-huiyuanxinxi1',
                    id: 'default1'
                },{
                    label: '样式二',
                    icon: 'iconfont icon-zujian-huiyuanxinxi2',
                    id: 'default2'
                }],
                bgstyle: [{
                    id: 'color',
                    label: '颜色'
                },{
                    id: 'img',
                    label: '背景图片'
                }],
                headstyle: [{
                    label: '圆形',
                    icon: 'iconfont icon-zujian-huiyuanxinxi-yuanxing',
                    id: ''
                }, {
                    label: '圆角',
                    icon: 'iconfont icon-zujian-huiyuanxinxi-yuanjiao',
                    id: 'radius'
                }],
                financeBtns: [{
                    id:'0',
                    label: '余额'
                }, {
                    id: '1',
                    label: '积分'
                }, {
                    id: '2',
                    label: '优惠券'
                }],
                show: false
            }
        },
        created(){
           if(!this.currentModal.params.financeBtn) {
               this.currentModal.params.financeBtn = ['0','1']
           }
            
        },
        computed: {
            getColor(){
                return styleObj[this.currentModal.params.style]
            }
        },
        methods: {
            changeIcon(val) {
                this.currentModal.params.seticon = val;
            },
            changeLink(type,val) {
                this.currentModal.params[type + 'link'] = val.url;
                this.currentModal.params[type+ 'link_name'] = val.name
                this.currentModal.params[type+ '_wxappid'] = val.wxappid
            },
            styleChange(e) {
                console.log(e)
                let {nickcolor,numcolor,titlecolor,linecolor} = styleObj[e]
                this.currentModal.style ={...this.currentModal.style,nickcolor,numcolor,titlecolor,linecolor}
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .bg-color {
        border: 1px solid #E9EDEF;
        box-sizing: border-box;
        padding: 20px 0;
        border-radius: 2px;
    }

    /deep/ .radio-group {
        .content {
            padding: 20px 0;
        }
    }

    .mb-20 {
        margin-bottom: 20px;
    }
    .mb-0 {
        margin-bottom: 0;
    }

    .hint-img-text {
        margin-left: 100px;
        padding-top: 0;
    }
</style>
