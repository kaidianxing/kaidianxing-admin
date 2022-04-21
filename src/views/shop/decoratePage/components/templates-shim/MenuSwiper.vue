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
    <div class='menu-swiper' :style='{height:getHeight}'>
        <swiper :options="swiperOption">
            <swiper-slide :class="{
              'swiper-no-swiping': disbledslide
            }" v-for="(item,index) in list" :key='index'>
                <ul class='menu-box' :style='{color:item.style.color,height:`calc(${getHeight} - ${dots?"11px":"8px"})`,background:item.style.background,paddingBottom:dots?"7px":"4px"}' :class='[item.style.navstyle]'>
                    <li class='menu-item' :class='["col"+item.style.rownum]' v-for='(val,index) in item.items' :key='index' @click='clickItem(val,index)'>
                        <div class="img-box">
                            <img lazy-load class='menu-item-img' :src="getImgUrl(val.imgurl)" alt="" >
                        </div>
                        <p class='menu-item-name'>{{val.text}}</p>
                    </li>
                </ul>
                <button type="button" class="left ivu-carousel-arrow ivu-carousel-arrow-hover prev-btn"><i class="ivu-icon ivu-icon-ios-arrow-back"></i></button>
                <button type="button" class="right ivu-carousel-arrow ivu-carousel-arrow-hover next-btn"><i class="ivu-icon ivu-icon-ios-arrow-forward"></i></button>
            </swiper-slide>
        </swiper>
        <ul class='swiper-dots' v-if='dots'>
            <li class='dots' :key='index' v-for='(item,index) in list.length' :class='{active:index==value}'></li>
        </ul>
    </div>
</template>

<script>
    import {
        Swiper,
        SwiperSlide,
    } from 'vue-awesome-swiper'
    import 'swiper/css/swiper.css'
    export default {
        components: {
            Swiper,
            SwiperSlide,
        },
        props: {
            startLoadImg:{//是否可以加载图片，配合PC端懒加载图片
                type: Boolean,
                default:true
            },
            height: {
                type: [String],
                default: 'auto'
            },
            dots: {
                type: Boolean,
                default: false
            },
            imgMode: {
                type: String,
                default: "widthFix"
            },
            imgStyle: {
                type: Object,
                default: () => ({})
            },
            list: {
                type: Array,
                default: () => []
            },
            startIndex: {
                type: Number,
                default: 0
            },
            disbledslide: {
                type: Boolean,
                default: true
            }
        },
        computed: {
            getHeight() {
                if (this.dots && this.height) {
                    return (this.height.replace('px', '') * 1 + 15) + 'px'
                }
                return this.height
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
            let vm = this;
            return {
                key: '',
                value: 0,
                swiperOption: {
                    // spaceBetween: 4,
                    slidesPerView: 1,
                    loop: false,
                    autoplay: false,
                    noSwiping: this.disbledslide,
                    navigation: {
                        prevEl:'.prev-btn',
                        nextEl:'.next-btn',
                    },
                    on: {
                        //关键在这儿，通过点击事件拿到对应的元素，从而确定具体index
                        slideChangeTransitionEnd() {
                            let val= this.realIndex;
                            vm.value = val;
                            vm.$emit('change', val);
                        },
                    }
                },
            }
        },
        methods: {
            getImgUrl(imgurl) {
                if (imgurl) {
                    return this.$utils.media(imgurl)
                } else {
                    return this.$utils.staticImg('decorate/menu_radius.png')
                }
            },
            clickItem(item, index) {
                this.$emit('custom-event', {
                    target: 'menu/clickItem',
                    data: {
                        item,
                        index
                    }
                })
            },
            click(val) {
                this.$emit('click', val)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .swiper-img {
        text-align: center;
        width: 100%;
        display: block;
        height: px2rpx(142);
    }
    .menu-swiper {
        overflow: hidden;
        position: relative;

        &:hover {
            .ivu-carousel-arrow-hover {
                opacity: 1;
            }
        }
        .swiper-dots {
            display: flex;
            justify-content: center;
            position: absolute;
            bottom: 8px;
            height: 4px;
            left: 0;
            width: 100%;
            .dots {
                width: 9px;
                height: 4px;
                border-radius: 4px;
                background: #FFF3F5;
                margin: 0 3px;
                z-index: 1;
                &.active {
                    background: #FF3C29;
                }
            }
        }
        .menu-box {
            height: 100%;
            width: 100%;
            box-sizing: content-box;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            padding: px2rpx(4) 0;
            .menu-item {
                overflow: hidden;
                width: 33.33%;
                padding: px2rpx(8) 0;
                flex-shrink: 0;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                color: inherit;
                &.col4 {
                    width: 25%;
                }
                &.col5 {
                    width: 20%;
                }
                p {
                    color: inherit;
                    text-align: center;
                    line-height: px2rpx(17);
                    font-size: px2rpx(12);
                }
                .img-box {
                    width: px2rpx(44);
                    height: px2rpx(44);
                    overflow: hidden;
                    margin: 0 auto px2rpx(6);
                }
                .menu-item-img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .radius {
            .img-box {
                border-radius: px2rpx(6);
            }
        }
        .circle {
            .img-box {
                border-radius: 50%;
            }
        }
    }
</style>
