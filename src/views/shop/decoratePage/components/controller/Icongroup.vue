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
    <div class='icongroup' v-if='currentModal.id=="icongroup"&&lazyLoad'>
        <i-form :label-width="100" ref='icongroup' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <form-item label="每行数量：">
                    <MyRadioGroup :items='colCount' v-model='currentModal.params.rownum'></MyRadioGroup>
                </form-item>
            </MyCollapse>
            
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item :label-width="0">
                    <MyDragSortableItems :list='currentModal.data' @end='dragEnd' @delItem='delItem'>
                        <template v-slot='{item}'> 
                            <MyTopMenuItem label1='按钮文字：' label2='跳转链接：' :item='item' @change-link='changeLink(item,$event)'>
                                    <template #prepend>
                                        <div class='custom-form-item icon-selector' style='margin:0 0 10px ;'>
                                           <p class="label" style='width:80px'>按钮图标：</p>
                                           <MyAddImgImg v-model='item.iconclass' type='icon'></MyAddImgImg>
                                        </div>
                                    </template>
                            </MyTopMenuItem>
                        </template>
                    </MyDragSortableItems>
                <i-button style='width:100%;' :style="{color:$css['--theme-color']}" @click='addItem'>+添加</i-button>
            </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="背景颜色：">
                    <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="图标颜色：">
                    <MyColorPicker v-model='currentModal.style.iconcolor' default='#565656'></MyColorPicker>
                </form-item>
                <form-item label="文字颜色：">
                    <MyColorPicker v-model='currentModal.style.textcolor' default='#565656'></MyColorPicker>
                </form-item>
                <form-item label="角标背景：">
                    <MyColorPicker v-model='currentModal.style.dotcolor' default='#ff3c29'></MyColorPicker>
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
        name: 'icongroup',
        data() {
            return {
                id:'icongroup',
                colCount: [{
                    label: '3个',
                    id: 3
                }, {
                    label: '4个',
                    id: 4
                }, {
                    label: '5个',
                    id: 5
                }],
            }
        },
        methods: {
            delItem(item) {
                for (let k in this.currentModal.data) {
                    if (this.currentModal.data[k] === item) {
                        this.currentModal.data.splice(k, 1);
                        break;
                    }
                }
                this.refreshCurrentModal();
            },
            addItem() {
                let len = this.currentModal.data.length + 1;
                this.currentModal.data.push({
                    iconclass: `iconfont-m- icon-m-xingxingshixin`,
                    linkurl: '',
                    text: '按钮文字' + len,
                    linkurl_name: '',
                    wxappid: ''
                });
                this.refreshCurrentModal();
                
            },
            dragEnd(list) {
                this.currentModal.data = list;
                this.refreshCurrentModal();
            },
            changeLink(item, val) {
                item.wxappid = val.wxappid;
                item.linkurl = val.url;
                item.linkurl_name = val.name
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    /deep/ .select-link {
        width: 100%;
    }
    .icon-selector {
        /deep/ .label {
            padding-right: 10px;
        }
    }
</style>