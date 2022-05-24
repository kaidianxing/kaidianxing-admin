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
    <div class='menu' v-if='currentModal.id=="menu2"&&lazyLoad'>
        <i-form :label-width="100" ref='menu2' :model="currentModal" :rules="validator">

            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item :label-width="0">
                    <MyDragSortableItems :list='currentModal.data' @end='dragEnd' @delItem='delItem'>
                        <template v-slot='{item}'>
                            <MyTopMenuItem nodel label1='按钮文字：' label2='跳转链接：' placeholder="请输入按钮文字" :item='item' @on-change='getInput(item,$event)'  @change-link='changeLink(item,$event)'>
                                <template #prepend>
                                    <div style='display:flex;margin-bottom:10px;'>
                                        <p class="label">按钮图片：</p>
                                        <MyAddImgImg :value='item.iconclass' type='icon' @change='changeIcon(item,$event)'></MyAddImgImg>
                                    </div>
                                </template>
                            </MyTopMenuItem>
                        </template>
                    </MyDragSortableItems>
                    <i-button style='width:100%;' :style="{color:$css['--theme-color']}" v-if="currentModal.data && currentModal.data.length<3" @click='addItem'>+添加({{currentModal.data.length}}/3)</i-button>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="文字颜色：">
                    <MyColorPicker v-model='currentModal.style.textcolor' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="图标颜色：">
                    <MyColorPicker v-model='currentModal.style.iconcolor' default='#212121'></MyColorPicker>
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
        name: 'menu2',
        data() {
            return {
                id:'menu2',
                btnStyle: [{
                    label: '直角',
                    icon: 'ivu-icon ivu-icon-ios-contract',

                    disabled: false
                }, {
                    label: '圆角',
                    icon: 'ivu-icon ivu-icon-ios-contract',

                    disabled: false
                }, {
                    label: '圆形',
                    icon: 'ivu-icon ivu-icon-ios-contract',

                    disabled: false
                }],
                colCount: [{
                    label: '3个'
                }, {
                    label: '4个'
                }, {
                    label: '5个'
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
            },
            addItem() {
                let len = this.currentModal.data.length
                if (len >= 3) {
                    this.$Message['error']({
                        background: true,
                        content: '最多添加3个'
                    });
                    return;
                }
                this.currentModal.data.push({
                    text: '按钮' + (this.currentModal.data.length+1),
                    iconclass: '',
                    textcolor: '#666666',
                    iconcolor: '#666666',
                    linkurl: '',
                    linkurl_name: '',
                    wxappid: '',
                    video_id: '',
                    keyLink:''
                });
            },
            dragEnd(list) {
                this.currentModal.data = list;
            },
            changeIcon(item, val) {
                item.iconclass = val;
            },
            changeLink(item, val) {
                item.linkurl = val.url;
                item.linkurl_name = val.name;
                item.wxappid = val.wxappid;
                item.video_id = val.video_id;
                item.keyLink = val.keyLink;
            },
            getInput(item, val) {
                item.text = val;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    /deep/ .select-link {
        width: 100%;
    }

    .label {
        width: 70px;
        margin-right:10px;
        text-align: right;
    }
</style>
