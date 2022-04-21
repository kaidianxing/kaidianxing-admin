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
    <div class='title' v-if='currentModal.id=="title"&&lazyLoad'>
        <i-form :label-width="100" ref='title' style="width:100%;" :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <form-item label="样式：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='iconStyle' v-model='currentModal.style.textalign'></MyButtonGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="背景颜色：">
                    <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="跳转链接：">
                    <MySelectLink class="mb-0" :value='{
                        name: currentModal.params.linkurl_name,
                        url: currentModal.params.linkurl,
                        wxappid: currentModal.params.wxappid
                    }' @change='changeLink'></MySelectLink>
                </form-item>
                <form-item label="标题：">
                    <div class="style-container">
                        <form-item label="显示文字：" class="form-input-item">
                            <Input placeholder="留空则不显示" v-model='currentModal.params.title' style="width: 100%"/>
                        </form-item>
                        <form-item label="图标：" :label-width="110" class="form-input-item">
                            <MyAddImgImg v-model='currentModal.params.icon' type='icon'></MyAddImgImg>
                        </form-item>

                        <form-item label="标题大小：" :label-width="110">
                            <MyDraggableProgress v-model='currentModal.style.titlesize' :step="2" :min='24' :max='48'
                                                 unit='px'></MyDraggableProgress>
                        </form-item>
                        <form-item label="标题粗细：" :label-width="110">
                            <MyRadioGroup :items='weightStyle' v-model='currentModal.params.titleweight'></MyRadioGroup>
                        </form-item>


                        <form-item label="文字颜色：" :label-width="110">
                            <MyColorPicker v-model='currentModal.style.color' default='#212121'></MyColorPicker>
                        </form-item>
                        <form-item label="图标颜色：" :label-width="110">
                            <MyColorPicker v-model='currentModal.style.iconcolor' default='#212121'></MyColorPicker>
                        </form-item>
                    </div>
                </form-item>
                <form-item label="查看更多：">
                    <MyRadioGroup :items='isShowMore' v-model="currentModal.params.showmore">
                        <form-item label="显示文字：" :label-width="110" class="form-input-item mb-20">
                            <Input placeholder="留空则不显示" v-model='currentModal.params.subTitle' style="width: 100%"/>
                        </form-item>
                        <form-item label="右侧文字：" :label-width="110" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.subtitlecolor' default='#969696'></MyColorPicker>
                        </form-item>
                        <form-item label="右侧图标：" :label-width="110" class="form-input-item mb-20">
                            <MyAddImgImg type='icon' v-model='currentModal.params.righticon'></MyAddImgImg>
                        </form-item>
                        <form-item label="右侧图标颜色：" :label-width="110" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.righticoncolor'
                                           default='#969696'></MyColorPicker>
                        </form-item>
                    </MyRadioGroup>
                </form-item>

                <form-item label="上间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px'
                                         v-model='currentModal.style.paddingtop'></MyDraggableProgress>
                </form-item>
                <form-item label="下间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px'
                                         v-model='currentModal.style.paddingbottom'></MyDraggableProgress>
                </form-item>
                <form-item label="左右间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px'
                                         v-model='currentModal.style.paddingleft'></MyDraggableProgress>
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
    name: 'title',
    data() {
        return {
            id: 'title',
            isShowIcon: [{
                label: '不显示',
                id: 0
            }, {
                label: '显示',
                id: 1
            }],
            isShowMore: [{
                label: '显示',
                id: 1
            }, {
                label: '不显示',
                id: 0
            }],
            iconStyle: [{
                label: '居左',
                icon: 'iconfont icon-zujian-liebiaodaohang-juzuo',


                id: 'left'
            }, {
                label: '居中',
                icon: 'iconfont icon-zujian-liebiaodaohang-juzhong',


                id: 'center'
            }],
            weightStyle: [{
                label: '常规体',
                id: 'normal'
            }, {
                label: '加粗体',
                id: 'bold'
            }]
        }
    },
    methods: {
        changeIcon(val) {
            this.currentModal.params.icon = val;
            this.refreshCurrentModal();
        },
        changeLink(val) {
            this.currentModal.params.wxappid = val.wxappid
            this.currentModal.params.linkurl = val.url;
            this.currentModal.params.linkurl_name = val.name
        },
        getInput(type, val) {
            if (type == 'left') {
                this.currentModal.params.title = val;
            } else {
                this.currentModal.params.subTitle = val;
            }
            this.refreshCurrentModal();
        },
        changeIconStyle(index) {
            let style = ['left', 'right']
            this.currentModal.style.textalign = style[index];
            this.refreshCurrentModal();
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

/deep/ .ivu-form-item .ivu-form-item .ivu-form-item-content {
    margin-left: 90px !important;
}

.bg-color {
    padding: 10px;
}

/deep/ .radio-group .content {
    padding: 20px 20px 0 0;

    .form-input-item {
        .ivu-form-item-content {
            margin-left: 110px !important;
        }
    }
}

.mb-20 {
    margin-bottom: 20px;
}

.add-img-img {
    /deep/ .img-img-box {
        position: absolute;
    }
}

.style-container {
    border: 1px solid #E9EDEF;
    box-sizing: border-box;
    padding: 20px 20px 0 0;
    border-radius: 2px;
    background: #F4F6F8;

    /deep/ .ivu-form-item {
        margin-bottom: 20px;
    }

    .form-input-item {
        /deep/ .ivu-form-item-content {
            margin-left: 110px !important;
        }
    }
}

.mb-0 {
    margin-bottom: 0 !important;
}
</style>
