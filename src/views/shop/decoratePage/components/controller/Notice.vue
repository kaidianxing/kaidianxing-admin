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
    <div class='notice' v-if='currentModal.id=="notice"&&lazyLoad'>
        <i-form :label-width="100" ref='notice' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <form-item label="图标样式：" prop="params">
                    <MyButtonGroup v-model="currentModal.params.noticestyle" :items='icons'>
                         <form-item v-if="currentModal.params.noticestyle == 'custom'" label="公告图片：" style="margin-bottom:0;">
                             <MyAddImgImg style="display:inline-block;" size='mini' type='image' v-model='currentModal.params.noticeimg' @change='refreshCurrentModal'></MyAddImgImg>
                             <kdx-hint-text  class="hint-img-text">建议图片尺寸60x36像素</kdx-hint-text>
                         </form-item>
                    </MyButtonGroup>
                </form-item>
            </MyCollapse>
           
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <div class="notice-container">
                    <form-item label="公告内容：" class='notice-content'>
                        <MyRadioGroup :items='noticeContent' v-model='currentModal.params.noticedata'>
                            <form-item label="读取数量：" style='margin-bottom:10px;' v-if='currentModal.params.noticedata!=1'>
                                <MyRadioGroup :items='readCount' v-model='currentModal.params.noticenum'>
                                </MyRadioGroup>
                            </form-item>
                        </MyRadioGroup>
                    </form-item>
                    <form-item class="notice-item" :label-width="0" v-if='currentModal.params.noticedata==1'>
                        <MyDragSortableItems :list='currentModal.data' @end='dragEnd' @delItem='delItem'>
                            <template v-slot='{item}'> 
                                <MyTopMenuItem 
                                    :labelWidth="42" 
                                    nodel 
                                    label1='标题：'  placeholder="请输入标题" :maxlength="20" label2='链接：' :item='item' text='title' 
                                    @on-change='changeTitle(item,$event)'  
                                    @change-link='changeLink(item,$event)'>

                                </MyTopMenuItem>
                            </template>
                        </MyDragSortableItems>
                        <i-button style='width:100%;' :style="{color:$css['--theme-color']}" @click='addItem'>+添加公告</i-button>
                    </form-item>
                </div>
            </MyCollapse>
             <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="文字颜色：">
                    <MyColorPicker v-model='currentModal.style.color' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="背景颜色：">
                    <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="滚动速度：" class='scroll-velocity'>
                    <MyDraggableProgress :min='1' :max='10' unit='秒/次' v-model='currentModal.params.speed'></MyDraggableProgress>
                </form-item>
                 <form-item label="上间距：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.margintop'
                    ></MyDraggableProgress>
                </form-item>
                <form-item label="下间距：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.marginbottom'
                    ></MyDraggableProgress>
                </form-item>
                <form-item label="左右间距：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.marginleft'
                    ></MyDraggableProgress>
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
        name: 'notice',
        data() {
            return {
                id:'notice',
                icons: [{
                    label: '样式1',
                    img: this.$utils.staticImg('decorate/notice/notice_icon1.svg'),
                    id: 1
                },{
                    label: '样式2',
                    img: this.$utils.staticImg('decorate/notice/notice_icon2.svg'),
                    id: 2
                },{
                    label: '样式3',
                    img: this.$utils.staticImg('decorate/notice/notice_icon3.svg'),
                    id: 3
                },{
                    label: '样式4',
                    img: this.$utils.staticImg('decorate/notice/notice_icon4.svg'),
                    id: 4
                },{
                    label: '样式5',
                    img: this.$utils.staticImg('decorate/notice/notice_icon5.svg'),
                    id: 5
                },{
                    label: '自定义',
                    icon: 'iconfont icon-zujian-zidingyi',
                    id: 'custom'
                }],
                noticeContent: [{
                    label: '读取商城公告',
                    id: 0
                }, {
                    label: '手动添加',
                    id: 1
                }],
                readCount: [{
                    label: '5条',
                    id: 5
                }, {
                    label: '10条',
                    id: 10
                }, {
                    label: '15条',
                    id: 15
                }]
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
                    title: `这里是第${len}条自定义公告的标题`,
                    linkurl: '',
                    linkurl_name: '',
                    wxappid: ''
                });
                this.refreshCurrentModal();
            },
            dragEnd(list) {
                this.currentModal.data = list;
                this.refreshCurrentModal();
            },
            changeTitle(item,val) {
                item.title =val;
            },
            changeLink(item,val) {
                item.wxappid = val.wxappid
                item.linkurl =val.url;
                item.linkurl_name = val.name
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .scroll-velocity {
        /deep/ .ivu-input-wrapper {
            width: 100px;
        }
    }

    .notice-container {
         /deep/ .ivu-form-item {
            &:first-child {
                margin-bottom: 0;
            }

            &:last-child {
                 margin-bottom: 30px;
            }
        }

        .notice-item {
            margin-top: 10px;
        }
       
    }
    .notice-content {
        /deep/ .radio-group {
            .content {
                padding-bottom: 0!important;
            }
        }
    }

    .hint-img-text {
        margin-left: 100px;
        padding-top: 0;
    }
</style>