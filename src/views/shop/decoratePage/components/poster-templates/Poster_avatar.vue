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
    <img class='poster_avatar' :src="getUrl" alt="" :style='getStyle' @error="loaded" @load="loaded">
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_avatar',
        computed: {
            getStyle() {
                if (this.$isPC) {
                    return {
                        width: '100%',
                        height: '100%',
                        borderRadius: !(this.componentData.params.borderradius*1) ? '50%' : 0,
                        border: `${this.componentData.params.bordershow==1?Math.round(this.componentData.style.borderwidth/2):0}px solid ${this.componentData.style.bordercolor}`
                    }
                }
                return {
                    width: this.px2rpx(this.componentData.style.width),
                    height: this.px2rpx(this.componentData.style.height),
                    position: 'absolute',
                    top: this.px2rpx(this.componentData.style.top),
                    left: this.px2rpx(this.componentData.style.left),
                    borderRadius: !(this.componentData.params.borderradius*1) ? '50%' : 0,
                    border: `${this.componentData.params.bordershow==1?this.px2rpx(this.componentData.style.borderwidth):0}rpx solid ${this.componentData.style.bordercolor}`
                }
            },
            getUrl() {
                if (this.componentData.params.imgurl) {
                    return this.$utils.media(this.componentData.params.imgurl)
                }
                if (this.componentData.params.borderradius == 1) {
                    return this.$utils.staticImg('decorate/avatar_square.png')
                } else {
                    return this.$utils.staticImg('decorate/avatar.png')
                }
            }
        },
        mounted() {
            this.$emit('custom-event', {
                target: 'poster_avatar/loading',
            })
        },
        methods: {
            loaded(){
                this.$emit('custom-event', {
                    target: 'poster_avatar/loaded',
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
</style>
