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
    <div class='menu' v-if='componentData&&componentData.id=="menu"' :style="{
        padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`,
    }">
        <div class="menu-box" :style="{
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
        }"
    >
            <MySwiper :startLoadImg='startLoadImg' :key="componentData.style.marginleft" :list='getList' :height='getSwiperHeight' :dots='showDots' @clickItem='clickItem'></MySwiper>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import MySwiper from '../templates-shim/MenuSwiper.vue'
    export default {
        mixins: [mixin],
        components: {
            MySwiper
        },
        name: 'mymenu',
        computed: {
            showDots() {
                if (this.componentData.data ?.length) {
                    return this.componentData.data.length / this.componentData.style.rownum / this.componentData.style.pagenum > 1
                } else {
                    return 0
                }
            },
            getSwiperHeight() {
                if (this.componentData.style ?.pagenum == 1) {
                    return this.px2rpx(173)
                } else {
                    if (this.componentData.data ?.length > this.componentData.style.rownum) {
                        return this.px2rpx(346)
                    }
                }
                return this.px2rpx(173)
            },
            getList() {
                if (this.componentData.data) {
                    return this.$utils.arrGroup(this.componentData.data, this.componentData.style ?.rownum * this.componentData.style ?.pagenum).map(items => {
                        return {
                            style: this.componentData.style,
                            items
                        }
                    })
                }else{
                    return []
                }
            }
        },
        methods: {
            clickItem(item) {
                this.$emit('custom-event', {
                    target: 'menu/clickItem',
                    data: {
                        item
                    }
                })
            },
            getImgUrl(imgurl) {
                if (imgurl) {
                    return this.$utils.media(imgurl)
                } else {
                    return this.$utils.staticImg('decorate/menu_radius.png')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .menu {
        width: 100%;
        padding: px2rpx(8) px2rpx(12) 0;

        &-box {
            border-radius: px2rpx(6);
            overflow: hidden;
        }
    }
</style>