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
    <div
        class='hot_area'
        v-if='currentModal.id=="hot_area"&&lazyLoad'
    >
        <i-form
            :label-width="100"
            ref='line'
            :model="currentModal"
            :rules="validator"
        >
            <MyCollapse>
                <p
                    class="form-title"
                    slot='label'
                >
                    内容样式
                </p>
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
            <MyCollapse no-border>
                <p
                    class="form-title"
                    slot='label'
                >
                    内容
                </p>
                <form-item label="热区图片：">
                    <kdx-hint-alert v-if="currentModal.params.imgurl" :show-icon="false">点击图片打开热区编辑器</kdx-hint-alert>
                    <kdx-hint-text v-else :show-icon="false">建议图片宽度750像素, 高度1000像素以内, 单张图片大小200kb以内</kdx-hint-text>

                    <div class="container">
                        <div
                            class="container_hot"
                            v-loading="{
                                title:'图片加载中...',
                                loading: loadImg
                            }"
                            v-if="currentModal.params.imgurl"
                        >
                            <img
                                :src="$utils.media(currentModal.params.imgurl) || $utils.staticImg('decorate/goods_col1.png')"
                                class="hot_area_img"
                                ref="hot_area_img"
                                @load="loadHandler"
                                @error="loadHandler"
                                @click="addHot"
                            />
                            <div
                                class="add-img-btn"
                                @click="addImg"
                            >{{currentModal.params.imgurl?'替换图片': '添加图片'}}</div>

                            <div
                                class="hot_item"
                                :style="{
                                    left: item.x+'%',
                                    top: item.y+'%',
                                    width: item.w+'%',
                                    height: item.h+'%'
                                }"
                                v-for="(item,index) in currentModal.data"
                                :key="index"
                                @click="addHot"
                            >
                                <div class="hot_item_box two-line-hide">{{item.linkurl_name}}</div>
                            </div>
                        </div>
                        <Button
                            long
                            class="add-btn"
                            @click="addImg"
                            v-else
                        >+添加图片</Button>
                        <Button
                            v-if="currentModal.params.imgurl"
                            long
                            class="add-btn"
                            @click="addHot"
                        >+添加热区</Button>
                    </div>
                </form-item>
            </MyCollapse>
        </i-form>
        <!--图片选择器-->
        <image-selector
            ref="image_selector"
            :current="currentModal.params.imgurl"
            :multiple="false"
            @on-change="changeImage"
        ></image-selector>

        <hot-modify
            v-if="show"
            :imgurl="currentModal.params.imgurl"
            :items="currentModal.data"
            @on-save="saveHandler"
            @on-cancel="cancelHandler"
        > </hot-modify>
    </div>
</template>

<script>
import mixin from './mixin.js'
import HotModify from '@/components/decorate/HotModify.vue'
export default {
    mixins: [mixin],
    components: {
        ImageSelector: () =>
            import('@/components/selector/ImageSelector'),
        HotModify
    },
    name: 'hot_area',
    data() {
        return {
            show: false,
            loadImg: false
        }
    },
    methods: {
        addImg() {
            this.$refs.image_selector.setValue()
        }, 
        changeImage(e) {
            if(e==this.currentModal.params.imgurl){
                return
            }
            this.currentModal.params.imgurl = e
            if (e) {
                this.loadImg = true
            }
            this.currentModal.data = []
        },
        addHot() {
            if (this.currentModal.params.imgurl) {
                this.show = true
            } else {
                this.$Message.error('请先添加图片')
            }
        },
        saveHandler(list) {
            this.currentModal.data = list
            this.show = false
        },
        cancelHandler() {
            this.show = false
        },
        loadHandler() {
            this.loadImg = false
            let img=this.$refs.hot_area_img
            this.currentModal.style.imgheight=img.height;
            this.currentModal.style.imgwidth=img.width;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./common.scss";

.hot_area {
    .container {
        margin-top: 10px;
    }
    .container_hot {
        position: relative;
        .add-img-btn {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 40px;
            font-size: 12px;
            text-align: center;
            line-height: 40px;
            z-index: 10;
            color: #fff;
            background: rgba(0, 0, 0, 0.7);

            &:hover {
                cursor: pointer;
                background: $brand-color;
            }
        }

        .hot_item {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            padding: 5px;
            background: rgba(45, 140, 240, 0.6);

            &_box {
                max-width: 210px;
                padding: 2px;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                line-height: 16px;
                color: #ffffff;
                cursor: pointer;
            }
        }
    }

    /deep/ .loading {
        background: #f4f6f8;
    }

    &_img {
        display: block;
        width: 100%;
        user-select: none;
        cursor: pointer;
    }

    .add-btn {
        margin-top: 10px;
        font-size: 14px;
        line-height: 20px;
        color: #262b30;
    }
}
</style>