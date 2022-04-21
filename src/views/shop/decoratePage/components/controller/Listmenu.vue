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
    <div class='listmenu' v-if='currentModal.id=="listmenu"&&lazyLoad'>
        <i-form :label-width="100" ref='listmenu' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item :label-width="0">
                    <MyDragSortableItems class='drag-list' :list='currentModal.data' @end='dragEnd' @delItem='delItem'>
                        <template v-slot='{item}'> 
                            <MyListNavigator noicon onelabel linkLabel="跳转链接：" label2="左侧标题：" :value='getParams(item)' @change-icon='changeIcon(item,$event)' @change-link='changeLink(item,$event)' @selectLink='selectLink(item)' @get-input='(type,val)=>{getInput(item,type,val)}'>
                                <template #center>
                                    <form-item label="标题颜色：">
                                         <MyColorPicker v-model='item.textcolor' default='#212121'></MyColorPicker>
                                    </form-item>
                                </template>
                                <template #bottom>
                                    <div>
                                        <form-item label="左侧图标：">
                                            <MyAddImgImg style="display:inline-block;" size='mini' type='icon' v-model='item.iconclass'></MyAddImgImg>
                                        </form-item>
                                        <form-item label="图标颜色：" style="margin-bottom: 0;">
                                            <MyColorPicker v-model='item.iconcolor' default='#212121'></MyColorPicker>
                                        </form-item>
                                    </div>
                                </template>
                            </MyListNavigator>
                        </template>
                    </MyDragSortableItems> 
                    <i-button class='brand-color' style='width:100%;background:rgba(0,0,0,0)' @click='addItem'>+添加</i-button>
                </form-item> 
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="查看更多：">
                    <MyRadioGroup :items='showMore' v-model="currentModal.params.showmore">
                         <div v-if="currentModal.params.showmore =='1'">
                            <form-item label="显示文字：" :label-width="110" class="mb-20 input-item">
                                <Input v-model="currentModal.params.remark" :maxlength="5" show-word-limit placeholder="非必填" />
                            </form-item>
                                            
                            <form-item label="右侧图标：" :label-width="110" class="mb-20">
                                <MyAddImgImg style="display:inline-block;" size='mini' type='icon' v-model='currentModal.params.righticon'></MyAddImgImg>
                            </form-item>
                            <form-item label="右侧文字：" :label-width="110" class="mb-20">
                                <MyColorPicker v-model='currentModal.style.remarkcolor' default='#969696'></MyColorPicker>
                            </form-item>
                            
                            <form-item label="右侧图标颜色：" :label-width="110" class="mb-0">
                                <MyColorPicker v-model='currentModal.style.righticoncolor' default='#969696'></MyColorPicker>
                            </form-item>
                    </div>
                    </MyRadioGroup>
                   
                </form-item>
                 <form-item label="分隔线颜色：">
                    <MyColorPicker v-model='currentModal.style.dividercolor' default='#e6e7eb'></MyColorPicker>
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
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.topradius'
                    ></MyDraggableProgress>
                </form-item>
                <form-item label="下边角：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.bottomradius'
                    ></MyDraggableProgress>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'listmenu',
        data() {
            return {
                id:'listmenu',
                showMore: [{id: '1',label:'显示'},{id:'0',label:'不显示'}]
            }
        },
        computed: {
            getListStyle() {
                return 0
            }
        },
        methods: {
            dragEnd(list) {
                this.currentModal.data = list;
            },
            delItem(item) {
                for (let i = 0; i < this.currentModal.data.length; i++) {
                    if (item === this.currentModal.data[i]) {
                        this.currentModal.data.splice(i, 1);
                        break;
                    }
                }
            },
            addItem() {
                this.currentModal.data.push({
                    text: '文字' + (this.currentModal.data.length + 1),
                    textcolor: '#212121',
                    linkurl: '',
                    iconclass: '',
                    iconcolor: '#212121',
                    linkurl_name: '',
                    wxappid: ''
                })
          
            },
            getParams(data) {
                return {
                    'icon': data.iconclass, //要显示的icon 
                    'subTitle': data.text,
                    'linkurl': data.linkurl,
                    'linkurl_name': data.linkurl_name,
                    'wxappid': data.wxappid,
                }
            },
            changeIcon(item, val) {
                item.iconclass = val;
            },
            changeLink(item, val) {
                item.wxappid = val.wxappid
                item.linkurl = val.url;
                item.linkurl_name = val.name
            },
            getInput(item, val) {
                item.text = val;
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';

    /deep/ .ivu-form-item .ivu-form-item .ivu-form-item-content{
        margin-left: 70px!important;
    }

    .ivu-form-item.input-item {
        /deep/ .ivu-form-item-content{
            margin-left: 110px!important;
        }
    }

     .mb-20 {
        margin-bottom: 20px;
    }
    .mb-0 {
        margin-bottom: 0;
    }
</style>