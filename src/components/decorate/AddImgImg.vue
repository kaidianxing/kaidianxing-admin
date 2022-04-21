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
    <div class='add-img-img' :class='[type=="icon"?"mini":size]' @mouseenter='mouseenter'>
        <div class="img-img-box" @click='addImg'>
            <img :src="$utils.media(imgurl)" alt="" ref='img' @load='success' v-if='imgurl&&type=="image"'>
            <i class='sel-icon' :class="[imgurl]" v-else-if='imgurl&&type=="icon"'></i>
            <div class="video" v-else-if='type=="video"&&imgurl'>
                <video :src="$utils.media(imgurl, 'video')"></video>
            </div>
            <i class='icon' :class='[getIcon]' v-else></i>
            <span v-if='!imgurl&&size!=="mini"&&type!="icon"'>{{tip}}</span>
            <transition name="fade">
                <span class='replace' v-if='imgurl'><i>替换</i></span>
            </transition>
        </div>
        <i class=' close ivu-icon ivu-icon-md-close-circle' @click.stop='delImg' v-if='imgurl'></i>
        <!--图片选择器-->
        <image-selector ref="image_selector" :current="imgurl" :multiple="false" @on-change="changeImage" v-if='loadSelector&&type=="image"'></image-selector>
        <!-- 图标选择器 -->
        <icon-selector ref='iconSelector' @on-change='getIconClass' v-else-if='loadSelector&&type=="icon"'></icon-selector>
        <!--视频选择器-->
        <video-selector ref="video_selector" :current="value" @on-change="changeVideo" v-else-if='loadSelector&&type=="video"'></video-selector>
    </div>
</template>

<script>
    export default {
        components: {
            ImageSelector: () =>
                import ('@/components/selector/ImageSelector'),
            IconSelector: () =>
                import ('../selector/IconSelector'),
            VideoSelector: () =>
                import ('@/components/selector/VideoSelector')
        },
        props: {
            type: {
                type: String,
                default: 'image', //选择器类型，image图片，icon图标 video视频
            },
            value: {
                type: [String,Object],
                default: ''
            },
            icon: {
                type: String,
                default: ''
            },
            size: {
                type: String,
                default: ''
            },
            tip: {
                type: String,
                default: '添加图片'
            }
        },
        watch: {
            value: {
                immediate: true,
                handler() {
                    console.log(this.value,'上次的值是多少值')
                    if(typeof this.value === 'object') {
                        this.imgurl = this.value?.path
                    }else {
                        this.imgurl = this.value
                    }
                }
            }
        },
        computed: {
            getIcon() {
                if (this.icon) {
                    return this.icon
                }
                return this.size != 'large' ? "ivu-icon ivu-icon-md-add" : "ivu-icon ivu-icon-ios-add"
            }
        },
        data() {
            return {
                show: false,
                imgurl: '',
                loadSelector: false,
            }
        },
        methods: {
            mouseenter() {
                this.loadSelector = true
            },
            success() {
                this.$nextTick(() => {
                    let img = this.$refs.img;
                    if (img) {
                        this.$emit('getImgInfo', {
                            naturalWidth: img.naturalWidth,
                            naturalHeight: img.naturalHeight,
                            width: img.width,
                            height: img.height
                        })
                    }
                })
            },
            changeVideo(val) {
                this.$emit('change', val);
                this.$emit('input', val);
            },
            getIconClass(val) {
                this.$emit('change', val);
                this.$emit('input', val);
            },
            delImg() {
                this.imgurl = '';
                this.$emit('change', '');
                this.$emit('input', '')
            },
            changeImage(val) {
                this.imgurl = val;
                this.$emit('change', val);
                this.$emit('input', val)
            },
            addImg() {
                // 打开图片选择器弹窗
                if (this.type == 'image') {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            if (this.$refs['image_selector']) {
                                this.$refs['image_selector'].setValue();
                            } else {
                                this.addImg()
                            }
                        }, 50)
                    });
                } else if (this.type === 'video') {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            if (this.$refs.video_selector) {
                                this.$refs.video_selector.setValue()
                            } else {
                                this.addImg()
                            }
                        }, 50)
                    });
                } else {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            if (this.$refs.iconSelector) {
                                this.$refs.iconSelector.setValue()
                            }else{
                                this.addImg()
                            }
                            this.$emit('click')
                        }, 50)
                    });
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .add-img-img {
        width: 60px;
        height: 60px;
        background: #FFFFFF;
        border-radius: 2px;
        box-sizing: border-box;
        position: relative;
        &:hover {
            .close {
                display: inline;
            }
        }
        .img-img-box {
            width: 60px;
            height: 60px;
            overflow: hidden;
            box-sizing: border-box;
            border-radius: 2px;
            border: 1px solid #E9EDEF;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            cursor: pointer;
            span {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                margin: 3px auto 0;
                text-align: center;
                color: #B8B9BD;
                display: inline-block;
                i {
                    display: inline-block;
                    font-style: normal;
                    transform: scale(.75);
                    letter-spacing: 2px;
                }
            }
            .replace {
                font-size: 12px;
                position: absolute;
                height: 20px;
                left: 1px;
                right: 1px;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                line-height: 20px;
                text-align: center;
                display: none;
                margin: 0;
            }
            img,
            .sel-icon,
            .video,
            video {
                width: 100%;
                height: 100%;
                line-height: 38px;
                font-size: 38px;
                display: block;
                margin: auto;
                text-align: center;
                cursor: pointer;
            }
            .sel-icon {
                font-size: 24px;
            }
            .icon {
                font-size: 22px;
                color: $brand-color;
                margin: 0 auto;
            }
            &:hover {
                .replace {
                    display: block;
                }
            }
        }
    }
    .mini {
        width: 39px;
        height: 39px;
        background: #FFFFFF;
        box-sizing: border-box;
        position: relative;
        .img-img-box {
            width: 100%;
            height: 100%;
            overflow: hidden;
            box-sizing: border-box;
            border-radius: 2px;
            border: 1px solid #E9EDEF;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            cursor: pointer;
            span {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                margin: 9px auto 6px;
                text-align: center;
                color: #B8B9BD;
            }
            .replace {
                position: absolute;
                height: 20px;
                left: 1px;
                right: 1px;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                line-height: 20px;
                margin: 0;
                text-align: center;
            }
            img {
                width: 100%;
                height: 100%;
                cursor: pointer;
            }
            .icon {
                font-size: 14px;
                color: $brand-color;
                margin: 0 auto;
            }
        }
    }
    .close {
        position: absolute;
        font-size: 18px;
        top: -6px;
        right: -9px;
        color: rgba(0, 0, 0, 0.3);
        display: none;
        cursor: pointer;
    }
    .large {
        width: 100px;
        height: 100px;
        background: #FFFFFF;
        box-sizing: border-box;
        position: relative;
        .img-img-box {
            width: 100%;
            height: 100%;
            overflow: hidden;
            box-sizing: border-box;
            border-radius: 2px;
            border: 1px dashed #E9EDEF;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            cursor: pointer;
            span {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                margin: 9px auto 6px;
                text-align: center;
                color: #B8B9BD;
            }
            .replace {
                position: absolute;
                height: 20px;
                left: 1px;
                right: 1px;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                color: #fff;
                line-height: 20px;
                text-align: center;
            }
            img {
                width: 100%;
                height: 100%;
            }
            .icon {
                font-size: 48px;
                color: $brand-color;
                margin: 0 auto;
            }
        }
    }
</style>
