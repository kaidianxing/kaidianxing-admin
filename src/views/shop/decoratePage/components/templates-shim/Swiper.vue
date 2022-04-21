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
            <CarouselItem v-for="(item,index) in list" :key='index'>
                <slot :data='item' :item='item'><img :mode='imgMode' :src="item" alt="" :style="imgStyle" class="swiper-img" @click='click(index)'></slot>
            </CarouselItem>
        </Carousel>
    </div>
</template>

<script>
    export default {
        props: {
            startLoadImg:{//是否可以加载图片，配合PC端懒加载图片
                type: Boolean,
                default:true
            },
            imgMode:{
                type: String,
                default: "widthFix"
            },
            imgStyle: {
                type: Object,
                default: ()=>({})
            },
            list: {
                type: Array,
                default: () => []
            },
            startIndex: {
                type: Number,
                default: 0
            },
            setting: {
                type: Object,
                default: () => ({
                    autoplay: true,
                    autoplaySpeed: 3000,
                })
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
                key: '',
                value: 0,
            }
        },
        methods: {
            change(old, val) {
                this.$emit('change', val)
            },
            click(val) {
                this.$emit('click', val)
            }
        }
    }
</script>

<style lang="scss">
    .swiper-img {
        text-align: center;
        width: 100%;
        display: block;
        height: px2rpx(142);
    }
</style>