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
    <div class="show-img">
        <template v-if="type === 'image' || type === 'ad'">
            <div class="slide-image">
                <!--图片-->
                <ul ref="sortableImg" class="image">
                    <!--轮播图-->
                    <template v-if="multiple && currentList.length > 0">
                        <li v-for="(item, index) in currentList" :key="`${item}_${index}`" :class="['img-li', {'img-move': isDrag}]"
                            :style="{width: `${width}px`, height: `${height}px`}">
                            <img :src="$media(item)" alt="" @error="replaceImage">
                            <Icon type="ios-close-circle" class="close" @click="deleteImage(index)" v-if="!isReadonly"/>
                            <div class="single-replace" @click="addImage" v-if="!isReadonly">
                                替换
                            </div>
                        </li>
                    </template>
                    <!--不可拖拽新增-->
                    <li class="slide-image-add" v-if="!isDrag && !isReadonly && multiple && currentList.length < limit" @click="addImage"
                        :style="{width: `${width}px`, height: `${height}px`}">
                        <div class="text-icon">
                            <span class="iconfont icon-tianjiatupian icon"></span>
                            <span>添加图片</span>
                        </div>
                    </li>
                </ul>
                <!--可拖拽新增-->
                <div class="slide-image-add" v-if="isDrag && !isReadonly && multiple && currentList.length < limit" @click="addImage"
                     :style="{width: `${width}px`, height: `${height}px`}">
                    <div class="text-icon">
                        <span class="iconfont icon-tianjiatupian icon"></span>
                        <span>添加图片</span>
                    </div>
                </div>
            </div>
            <!--图片-->
            <ul v-if="!multiple" class="image">
                <!--单个图片-->
                <li class="img-li image-single" :class="{'IdCard': category == 'IdCard'}" v-show="current && type !== 'ad'"
                    :style="{width: `${width}px`, height: `${height}px`}">
                    <img :src="$media(current)" alt="" @error="replaceImage">
                    <Icon type="ios-close-circle" class="close" @click="deleteImage" v-if="!isReadonly"/>
                    <div class="single-replace" @click="addImage" v-if="!isReadonly">
                        替换
                    </div>
                </li>
                <li class="img-li image-single ad" v-show="current && type === 'ad'">
                    <img :src="$media(current)" alt="" @error="replaceImage">
                    <Icon type="ios-close-circle" class="close" @click="deleteImage" v-if="!isReadonly"/>
                    <div class="single-replace" @click="addImage" v-if="!isReadonly">
                        替换
                    </div>
                </li>
                <!--添加图片-->
                <li class="add" :class="{disabled: isReadonly}" v-if="!current" @click="addImage"
                    :style="{width: `${width}px`, height: `${height}px`}">
                    <div class="text-icon">
                        <span class="iconfont icon-tianjiatupian icon"></span>
                        <span>{{desc}}</span>
                    </div>
                </li>
            </ul>
        </template>
        <!--视频-->
        <ul class="video" v-if="type === 'video'">
            <!--添加视频-->
            <li class="add video-btn" :class="{disabled: isReadonly}" v-show="!video" @click="addVideo">
                <div class="text-icon">
                    <span class="iconfont icon-tianjiashipin icon"></span>
<!--                    <kdx-svg-icon type="icon-full-right" class="icon"></kdx-svg-icon>-->
                    <span>{{videoName}}</span>
                </div>
            </li>
            <li class="video video-btn" v-show="video">
                <video :src="$media(video, 'video')" @error="replaceImage($event,'video')">
                    您的浏览器不支持 video 标签。
                </video>
                <!--删除视频-->
                <Icon type="ios-close-circle" class="close" @click="deleteVideo"/>
                <!--遮罩-->
                <div class="shade" @click="addVideo">
                    替换
                </div>
            </li>
            <!--添加视频封面-->
            <li class="img-li video-image video-btn" v-show="current">
                <img :src="$media(current)" alt="" @error="replaceImage($event, 'video-cover')">
                <Icon type="ios-close-circle" class="close" @click="deleteImage"/>
                <div class="single-replace" @click="addImage">
                    替换
                </div>
            </li>
            <li class="add video-btn control" v-show="!current" @click="addImage">
                <div class="text-icon">
                    <span class="iconfont icon-tianjiatupian icon"></span>
                    <span>视频封面</span>
                </div>
            </li>
        </ul>
        <!--多规格表格-->
        <ul v-if="type === 'table'" class="image">
            <li class="img-li table-image" v-show="current">
                <img :src="$media(current)" alt="">
                <Icon type="ios-close-circle" class="close" @click="deleteImage"/>
                <!--遮罩-->
                <div class="shade" @click="addImage">
                    替换
                </div>
            </li>
            <!--添加图片-->
            <li class="add table" v-show="!current" @click="addImage">
                <div class="text-icon">
                    <span class="iconfont icon-tianjia icon"></span>
                </div>
            </li>
        </ul>
        <!--视频选择器-->
        <video-selector :weixinControl="weixinControl" ref="video_selector" v-if="type === 'video' && !isReadonly" :current="video"
                        @on-change="changeVideo"></video-selector>
        <!--图片选择器-->
        <image-selector :weixinControl="weixinControl" ref="image_selector" :current="current" :current-list="currentList"
                        :is_select_file="is_select_file" v-if="!isReadonly"
                        :multiple="multiple" :limit="limit" @on-change="ChangeImage"></image-selector>
    </div>
</template>

<script>
    // 图片展示主图、轮播图、视频+图片视频选择器
    import Sortable from 'sortablejs';
    import ImageSelector from './selector/ImageSelector';
    import VideoSelector from './selector/VideoSelector';

    export default {
        name: "kdxImageVideo",
        components: {ImageSelector, VideoSelector},
        props: {
            // 控制视频选择器与图片选择器，在微信公众号方面的展示情况。
            weixinControl:{
                type: Object,
                default: ()=>({}),
            },
            // 添加视频名字
            videoName:{
                type:String,
                default: '添加视频'
            },
            // 图片添加下面的名字
            desc: {
                type: String,
                default: '添加图片',
            },
            // 图片限制展示的数量
            limit: {
                type: Number,
                default: 1
            },
            // 单选
            current: {
                type: [String, Object],
                default: ''
            },
            // 多个图片地址
            currentList: {
                type: Array,
                default() {
                    return [];
                }
            },
            list: {
                type: Array,
                default() {
                    return [];
                }
            },
            // 视频地址
            video: {
                type: String
            },
            // 视频封面
            videoImage: {
                type: String
            },
            // 单个图片地址
            // 类型image/video
            type: {
                type: String,
                default: 'image',
                validator: val => ['image', 'video', 'table', 'ad'].includes(val)
            },
            // 是否多选
            multiple: {
                type: Boolean,
                default: false
            },
            category: {
                type: String,
                default: '',
            },
            is_select_file: { // 是否直接上传
                type: Boolean,
                default: false
            },
            // 是否可拖拽
            isDrag: {
                type: Boolean,
                default: false
            },
            // 图片的宽度
            width: {
                type: Number,
                default: 100
            },
            // 图片的高度
            height: {
                type: Number,
                default: 100
            },
            // 只读模式
            isReadonly: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                modal: {
                    image: false,
                    video: false
                }
            };
        },
        methods: {
            addImage() {
                if (this.is_select_file) {
                    this.$refs['image_selector'].selectFile()
                    return
                }
                if(this.$refs['image_selector']) {
                    this.$refs['image_selector'].setValue();
                }
            },
            addVideo() {
                if(this.$refs['video_selector']) {
                    this.$refs['video_selector'].setValue();
                }
            },
            // 删除图片 index图片索引
            deleteImage(index) {
                if (this.multiple) {
                    let cloneList = JSON.parse(JSON.stringify(this.currentList));
                    cloneList.splice(index, 1);
                    this.$emit('on-change', cloneList);
                } else {
                    this.$emit('on-change', '');
                }
            },
          // 删除视频
          deleteVideo() {
            this.$emit('on-video-change', '');
          },
            // 初始化拖动组件
            initSortable() {
                if (this.type === 'image') {
                    let el = this.$refs['sortableImg'];
                    Sortable.create(el, {
                        filter: '.add',
                        onEnd: this.sortableEnd
                    });
                }
            },
            // 轮播图拖动
            sortableEnd(e) {
                let cloneList = JSON.parse(JSON.stringify(this.currentList));
                let movedRow = cloneList[e.oldIndex];
                cloneList.splice(e.oldIndex, 1);
                cloneList.splice(e.newIndex, 0, movedRow);
                this.$emit('on-change', cloneList);
            },
            changeVideo(path,q) {
                this.$emit('on-video-change', path,q);
            },
            ChangeImage(option,q) {
                this.$emit('on-change', option,q);
            }
        },
        mounted() {
            this.isDrag && this.initSortable();
        }
    };
</script>

<style scoped lang="scss">
    .show-img {
        .slide-image {
            display: flex;
            flex-wrap: wrap;
            .slide-image-add {
                width: 100px;
                height: 100px;
                /*margin-left: 20px;*/
                border: 1px dashed $border-color;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                border-radius: 2px;
                margin-bottom: 20px;
                > .text-icon {
                    text-align: center;
                    line-height: normal;
                    .icon {
                        /*padding-bottom: 12px;*/
                        color: $brand-color;
                        font-size: 28px;
                        display: block;
                        line-height: inherit;
                        padding-bottom: 10px;
                    }
                    > span {
                        color: $text-zhushi;
                        font-size: 12px;
                        line-height: 16px;
                        display: inline-block;
                    }
                }
            }
        }
        ul {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: -20px;
            > li {
                margin-right: 20px;
                margin-bottom: 20px;
                /*&:last-child {*/
                    /*margin-right: 0;*/
                /*}*/
            }
            > .img-li {
                width: 100px;
                height: 100px;
                position: relative;
                border: 1px solid $border-color;
                background-color: $background-color;
                border-radius: 2px;
                /*overflow: hidden;*/
                line-height: 100px;
                text-align: center;
                &.img-move {
                    cursor: move;
                }
                &.IdCard {
                    width: 156px;
                    height: 100px;
                }
                &:hover {
                    > .close {
                        display: block;
                        color: $text-zhushi;
                    }
                    > .shade {
                        display: block;
                    }
                    > .single-replace {
                        display: block;
                    }
                }
                > img {
                    max-width: 100%;
                    max-height: 100%;
                }
                > .close {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    font-size: 20px;
                    cursor: pointer;
                    color: $text-zhushi;
                    display: none;
                    &:hover {
                        color: $text-second;
                    }
                }
                .shade {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    color: #ffffff;
                    cursor: pointer;
                    background-color: $shade-color;
                    display: none;
                }
                .single-replace {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 20px;
                    cursor: pointer;
                    background-color: rgba(0, 0, 0, 0.7);
                    text-align: center;
                    line-height: 20px;
                    color: #ffffff;
                    font-size: 12px;
                    display: none;
                }
            }
            .table-image {
                width: 40px;
                height: 40px;
                > img {
                    width: 100%;
                    height: 100%;
                }
            }
            > .image-single {
                cursor: inherit;
            }
            > .ad {
                width: 200px;
                height: 100px;
            }
            > .video-image {
                cursor: inherit;
                width: 180px;
                height: 100px;
                border: 1px solid $border-color;
                border-radius: 2px;
                text-align: center;
            }
            > .video,
            > .add {
                width: 100px;
                height: 100px;
                border: 1px dashed $border-color;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                border-radius: 2px;
                &.disabled {
                    background-color: #f7f7f7;
                    border: 1px solid var(--border-color)!important;
                    cursor: not-allowed;
                    span {
                        color: rgba(38, 43, 48, 0.6)!important;
                    }
                }
                > .text-icon {
                    text-align: center;
                    line-height: normal;
                    .icon {
                        /*padding-bottom: 12px;*/
                        color: $brand-color;
                        font-size: 28px;
                        display: block;
                        line-height: inherit;
                        padding-bottom: 10px;
                    }
                    > span {
                        color: $text-zhushi;
                        font-size: 12px;
                        line-height: 16px;
                        display: inline-block;
                    }
                }
            }
            >.video {
                position: relative;
                width: 180px;
                height: 100px;
                border: 1px solid $border-color;
                border-radius: 2px;
                > video {
                    width: 100%;
                    height: 100%;
                }
                &:hover {
                    > .shade {
                        display: block;
                    }
                    > .close {
                        display: block;
                        color: $text-zhushi;
                    }
                }
                .shade {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    color: #ffffff;
                    cursor: pointer;
                    background-color: $shade-color;
                    display: none;
                }
                > .close {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    font-size: 20px;
                    cursor: pointer;
                    color: $text-zhushi;
                    display: none;
                    &:hover {
                        color: $text-second;
                    }
                }
            }
            .video-btn {
                margin-bottom: 0;
            }
            > .table {
                width: 40px;
                height: 40px;
                > .shade {
                    font-size: 12px;
                }
            }
        }
    }
</style>
