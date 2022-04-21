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
    <div class='swiper'>
        <Carousel v-model="value" :autoplay="setting.autoplay" :autoplay-speed="setting.autoplaySpeed" dots="none" @on-change='change' :loop='setting.loop' :key='key'>
            <CarouselItem v-for="(data,index) in list" :key='index'>
                <div class='content-box'>
                    <div class='img-box' v-if='data.img'>
                        <img :src="$utils.media(data.img)" alt="">
                    </div>
                    <div class='detail_video' @click='clickBtn' v-else>
                        <my-video class='myvideo' :src='$utils.media(data.video)' @pause="pause" @stop='stop'></my-video>
                        <p class="modal" v-if='playing!=1'>
                            <img class='poster' :src="$utils.media(data.video_thumb)" alt="" v-if='(playing==0||playing==3)&&data.video_thumb'>
                            <img mode='widthFix' lazy-load class='pause' :src="$utils.staticImg('decorate/video.png')" alt="" v-if='playing==2'>
                        </p>
                    </div>
                </div>
            </CarouselItem>
        </Carousel>
    </div>
</template>

<script>
    import MyVideo from './MyVideo.vue'
    import bus from './bus'
    export default {
        components: {
            MyVideo
        },
        props: {
            list: {
                type: Array,
                default: () => []
            },
            startIndex: {
                type: Number,
                default: 0
            },
        },
        watch: {
            list: {
                immediate: true,
                deep: true,
                handler() {
                    this.key = Math.random();
                    this.value = this.startIndex
                }
            }
        },
        data() {
            return {
                playing: 0, //0没开始 1正在播放 2暂停 3结束
                video: null,
                setting: {
                    autoplay: false,
                    loop: true
                },
                $myvideo: null,
                key: '',
                value: 0,
            }
        },
        methods: {
             stop() {
                this.playing = 3;
            },
            pause() {
                this.playing = 2;
            },
            clickBtn() {
                bus.$emit('toggleVideo')
                this.playing = 1;
                this.$emit('custom-event', {
                    target: 'video/clickBtn',
                });
            },
            change(old, val) {
                this.$emit('change', val)
            },
            click(val) {
                this.$emit('click', val)
            }
        }
    }
</script>

<style lang="scss" scoped>
.img-box {
    height: 100%;

    img {
        object-fit: contain; 
        object-position: center;
        background: #000;
    }
}
    .swiper-img {
        text-align: center;
        width: 100%;
        display: block;
        height: px2rpx(142);
    }
     .detail_swipe.decorate,
    .detail_swipe.decorate .content-box {
        position: relative;
        width: px2rpx(375);
        height: px2rpx(375);
        margin: 0 auto;
        overflow: hidden;
        swiper {
            width: 100%;
            height: px2rpx(375)!important;
            view,
            swiper,
            swiper-item,
            image {
                width: 100%!important;
                height: 100%!important;
                display: block;
            }
        }
        .swiper {
            width: 100%;
            height: px2rpx(375)!important;
            view,
            swiper,
            swiper-item,
            img {
                width: 100%!important;
                height: 100%!important;
            }
        }
        .dots {
            position: absolute;
            display: flex;
            bottom: px2rpx(16);
            box-sizing: border-box;
            padding: 0 0;
            left: 0;
            right: 0;
            padding:0 px2rpx(24);
            justify-content: center!important;
            text-align: center;
            .dot {
                width: px2rpx(6);
                height: px2rpx(6);
                background: $uni-text-color;
                margin: auto px2rpx(3);
                opacity: 0.34;
                border-radius: 50%;
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            .dot-img {
                width: px2rpx(12);
                height: px2rpx(12);
                font-size: px2rpx(12);
                line-height: px2rpx(12);
                text-align: center;
                margin: auto;
            }
            .dot.active {
                opacity: 1;
            }
            &.round {
                .dot.video {
                    width: px2rpx(12);
                    height: px2rpx(12);
                    background: rgba(0, 0, 0, 0) !important;
                    color: #c4c4c4;
                    opacity: 1;
                    transform: scale(.9);
                }
                .dot.video.active {
                    background: #c4c4c4!important;
                    color: #212121;
                    opacity: 1;
                }
            }
            &.rectangle {
                .dot {
                    width: px2rpx(10);
                    height: px2rpx(4);
                    border-radius: px2rpx(2);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
            }
        }
        .detail_video {
            width: px2rpx(375);
            height: px2rpx(375);
            display: flex;
            position: relative;
            &.ratio-0 {
                height: rpx(345);
            } // 4:3
            &.ratio-1 {
                height: rpx(459);
            } // 1:1
            &.ratio-2 {
                height: rpx(612);
            }
            .myvideo {
                width: 100%;
                height: 100%;
            }
            .modal {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                flex-direction: column;
                z-index: 10;
                .poster {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                }
                .pause {
                    display: block;
                    width: rpx(120);
                    margin: auto;
                    position: relative;
                    z-index: 100;
                }
            }
        }
        .number {
            position: absolute;
            display: flex;
            bottom: px2rpx(16);
            box-sizing: border-box;
            justify-content: center;
            color: #fff;
            background: rgba(0, 0, 0, 0.54);
            border-radius: px2rpx(22);
            flex-direction: column;
            text-align: center;
            width: fit-content;
            min-width: 60rpx;
            font-size: px2rpx(9);
            line-height: px2rpx(9);
            padding: px2rpx(3) px2rpx(5);
            left: 50%;
            transform: translate(-50%, 0);
            &.left {
                left: px2rpx(24);
                transform: translate(0, 0);
            }
            &.right {
                left: auto;
                right: px2rpx(24);
                transform: translate(0, 0);
            }
        }
    }
</style>
