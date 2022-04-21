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
    <div class='picture' v-if='currentModal.id=="picture"&&lazyLoad'>
        <i-form :label-width="100" ref='picture' :model="currentModal" :rules="validator">
           
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item :label-width="0">
                    <MyDragSortableItems :list='currentModal.data' @end='dragEnd' @delItem='delItem'>
                        <template v-slot='{item}'>
                            <MyAddImg tip="建议图片宽度750px" draggable :item='item' link='linkurl' url='imgurl' @change-link='changeLink(item,$event)' @change-img='changeImg(item,$event)' @getImgInfo='getImgInfo(item,$event)'></MyAddImg>
                        </template>
                    </MyDragSortableItems>
                    <i-button style='width:100%;' :style="{color:$css['--theme-color']}" @click='addItem'>+添加图片</i-button>
                </form-item>
            </MyCollapse>
             <MyCollapse no-border>
                <p class="form-title" slot='label'>
                   内容样式
                </p>
                <div>
                    <form-item label="上间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.paddingtop'></MyDraggableProgress>
                    </form-item>
                    <form-item label="下间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.paddingbottom'></MyDraggableProgress>
                    </form-item>
                    <form-item label="左右间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.paddingleft'></MyDraggableProgress>
                    </form-item>
                     <form-item label="图片间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbottom'></MyDraggableProgress>
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
                </div>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'picture',
        data() {
            return {
                id: 'picture',
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
                this.currentModal.data.push({
                    imgurl: '',
                    linkurl: '',
                    linkurl_name: '',
                    wxappid: ''
                })
                this.$nextTick(() => {
                    this.$parent.$el.lastChild.scrollTop = this.$parent.$el.lastChild.scrollHeight
                })
            },
            dragEnd(list) {
                this.currentModal.data = list;
            },
            changeLink(item, val) {
                item.linkurl = val.url;
                item.linkurl_name = val.name
                item.wxappid = val.wxappid
                // this.refreshCurrentModal();
            },
            changeImg(item, val) {
                item.imgurl = val;
                this.refreshCurrentModal();
            },
            getImgInfo(item, val) {
                item.imgheight = 750 * val.naturalHeight / val.naturalWidth;
                this.refreshCurrentModal();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>