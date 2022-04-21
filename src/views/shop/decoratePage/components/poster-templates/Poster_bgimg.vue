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
    <div class='poster_bgimg' :style='getStyle'>
        <img alt="" :src="getUrl" class='bg_img poster-img' v-if='componentData.params.bgtype==1' @error="loaded" @load="loaded">
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_bgimg',
        computed: {
            getStyle() {
                if (this.$isPC) {
                    return {
                        width: '100%',
                        height: '100%',
                        background: this.componentData.style.bgcolor,
                        zIndex: 0,
                    }
                }
                return {
                    width: this.px2rpx(750),
                    height: this.px2rpx(1334),
                    background: this.componentData.style.bgcolor,
                    zIndex: 0,
                }
            },
            getUrl() {
                if (this.componentData.params.imgurl) {
                    return this.$utils.media(this.componentData.params.imgurl)
                }
                return this.$utils.staticImg('decorate/page_bg_img.png')
            }
        },
        methods: {
            loaded(){
                this.$emit('custom-event', {
                    target: 'poster_bgimg/loaded',
                }) 
            }
        },
        mounted() {
            if(this.componentData.params.bgtype==1){
                this.$emit('custom-event', {
                    target: 'poster_bgimg/loading',
                }) 
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .poster_bgimg {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        .bg_img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
</style>