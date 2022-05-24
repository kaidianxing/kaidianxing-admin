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
    <div class='banner' v-if='currentModal.id=="banner"&&lazyLoad'>
        <i-form :label-width="100" ref='banner' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    轮播点设置
                </p>
                <div>
                    <form-item label="样式：">
                        <MyButtonGroup :items='pointStyle' v-model='currentModal.style.dotstyle'></MyButtonGroup>
                    </form-item>
                    <form-item label="位置：">
                        <MyButtonGroup :items='getDotPos' v-model='currentModal.style.dotalign'></MyButtonGroup>
                    </form-item>
                    <form-item label="选中颜色：" v-if='currentModal.style.dotstyle!="number"'>
                        <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                    </form-item>
                </div>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item label="" :label-width='0'>
                    <MyDragSortableItems :list='currentModal.data' @end='dragEnd' @delItem='delItem' v-if='currentModal.data'>
                        <template v-slot='{item}'>
                            <MyAddImg draggable :item='item' url='imgurl' link='linkurl' video_id="video_id" keyLink="keyLink" @change-img='changeImg' @change-link='changeLink'></MyAddImg>
                        </template>
                        </MyDragSortableItems>
                        <i-button :style='{width:"100%",color:$css["--theme-color"]}' @click='addItem'>+添加图片</i-button>
                    </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
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
    import { px2rpx } from '@/assets/jsTools/environment'
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'notice',
        data() {
            return {
                id:'banner',
                pointStyle: [{
                    label: '圆角',
                    icon: 'iconfont icon-zujian-lunbodian-yuanjiaojuxing',


                    id: 'rectangle'
                }, {
                    label: '圆形',
                    icon: 'iconfont icon-zujian-lunbodian-yuanxing',


                    id: 'round'
                }, {
                    label: '数字',
                    icon: 'iconfont icon-zujian-lunbodian-shuzi',


                    id: 'number'
                }]
            }
        },
        computed: {
            getDotPos() {
                let position = [{
                    label: '居左',
                    icon: 'iconfont icon-duiqi-zuoduiqi',


                    id: 'left'
                }, {
                    label: '居右',
                    icon: 'iconfont icon-duiqi-youduiqi',


                    id: 'right'
                }]
                if (this.currentModal.style.dotstyle == 'number') {
                    return position
                } else {
                    position.splice(1, 0, {
                        label: '居中',
                        icon: 'iconfont icon-duiqi-juzhongduiqi',


                        id: 'center'
                    })
                    return position
                }
            }
        },
        watch: {
            'currentModal.data':{
                handler(newVal) {
                    if(newVal[0]) {
                        let imgurl = newVal[0].imgurl? this.$utils.media(newVal[0].imgurl) :this.$utils.staticImg('decorate/banner.png');
                        this.$utils.getImgSize(imgurl).then(img=> {
                            let width = 750 - this.currentModal.style.marginleft
                            let ratio = parseInt(px2rpx(width)) /img.width;
                            this.currentModal.style.imgheight = img.height * ratio
                        })
                    }
                },
                immediate: true
            }
        },
        methods: {
            dragEnd(e) {
                this.currentModal.data = e;
                this.refreshCurrentModal();
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
                    imgurl: '',
                    linkurl: '',
                    wxappid: '',
                    video_id: '',
                    keyLink:''
                })
            },
            changeLink(val, item) {
                item.wxappid = val.wxappid
                item.linkurl = val.url;
                item.linkurl_name = val.name;
                item.video_id = val.video_id;
                item.keyLink = val.keyLink;
                this.refreshCurrentModal();
            },
            changeImg(val, item) {
                item.imgurl = val;
                this.refreshCurrentModal();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    /deep/ .body {
        width: 100%;
        .select-link {
            width: 100%;
            .input.ivu-input-wrapper {
                width: 100%;
            }
        }
    }
</style>
