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
    <div class='menu' v-if='currentModal.id=="menu"&&lazyLoad'>
        <i-form :label-width="100" ref='menu' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <form-item label="按钮形状：" style='margin-bottom:50px;'>
                    <MyButtonGroup :items='btnStyle' v-model='currentModal.style.navstyle'></MyButtonGroup>
                </form-item>
                <form-item label="每页行数：">
                    <MyRadioGroup :items='pagenum' v-model='currentModal.style.pagenum' ></MyRadioGroup>
                </form-item>
                <form-item label="每行数量：">
                    <MyRadioGroup :items='colCount' v-model='currentModal.style.rownum' @change="changeRownum"></MyRadioGroup>
                </form-item>
            </MyCollapse>

            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item :label-width="0">
                    <MyDragSortableItems :list='currentModal.data' @end='dragEnd' @delItem='delItem'>
                        <template v-slot='{item}'>
                            <MyTopMenuItem nodel label1='按钮文字：' label2='跳转链接：' :item='item' @on-change='getInput(item,$event)'  @change-link='changeLink(item,$event)'>
                                <template #prepend>
                                    <div style='display:flex;margin-bottom:6px;'>
                                        <p class="label">按钮图片：</p>
                                        <MyAddImgImg size='mini' :value='item.imgurl' @change='changeImg(item,$event)'></MyAddImgImg>
                                    </div>
                                    <kdx-hint-text class="hint-text">建议图片尺寸为200x200，比例为1:1</kdx-hint-text>
                                </template>
                            </MyTopMenuItem>
                        </template>
                    </MyDragSortableItems>
                <i-button style='width:100%;' :style="{color:$css['--theme-color']}" v-if="currentModal.data && currentModal.data.length<20" @click='addItem'>+添加按钮({{currentModal.data.length}}/20)</i-button>
            </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="文字颜色：">
                    <MyColorPicker v-model='currentModal.style.color' default='#565656'></MyColorPicker>
                </form-item>
                <form-item label="背景颜色：">
                    <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="上间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.margintop'></MyDraggableProgress>
                </form-item>
                <form-item label="下边距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                </form-item>
                <form-item label="左右边距：">
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
        name: 'menu',
        data() {
            return {
                id:'menu',
                pagenum:[{
                    label: '1行',
                    id: 1
                },{
                    label: '2行',
                    id: 2
                },],
                btnStyle: [ {
                    label: '圆形',
                    icon: 'iconfont icon-zujian-anniuzu-yuanxing',
                    id: 'circle'
                },{
                    label: '圆角',
                    icon: 'iconfont icon-zujian-anniuzu-yuanjiao',
                    id: 'radius'
                },],
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
        props: {
            scrollBody: {
                type: Object,
                default: null
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
                    imgurl: '',
                    linkurl: '',
                    text: '按钮文字' + len,
                    color: this.currentModal.style.color,
                    wxappid: '',
                    video_id: '',
                    keyLink:''
                });
                this.refreshCurrentModal();
            },
            changeRownum(rownum) {
                let num = rownum - this.currentModal.data.length;
                for(let i =0;i<num;i++) {
                    this.currentModal.data.push({
                        imgurl: '',
                        linkurl: '',
                        text: '按钮文字' + (rownum+i),
                        color: this.currentModal.style.color,
                        wxappid: '',
                        video_id: '',
                        keyLink:''
                    })
                }
            },
            dragEnd(list) {
                this.currentModal.data = list;
                this.refreshCurrentModal();
            },
            changeImg(item, val) {
                item.imgurl = val;
            },
            changeLink(item, val) {
                item.wxappid = val.wxappid
                item.linkurl = val.url;
                item.linkurl_name = val.name;
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
        margin-right:10px;
        width:70px;
        text-align:right;
    }

    .hint-text {
        padding-top: 0;
        margin: 0 0 10px 80px;
    }
</style>
