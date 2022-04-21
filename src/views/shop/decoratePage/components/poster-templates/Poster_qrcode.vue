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
    <div class='poster_qrcode' :style="getStyle">
        <div class="background" :style="{background:componentData.style.bgcolor,opacity:componentData.style.bgopacity}" v-if='$isPC'></div>
        <i class='iconfont icon-haibao-erweimaneirong' v-if='$isPC'></i>
        <GetQrcode :getStyle='componentData.style' :value='componentData.params.imgurl' @getPoster='getPoster' v-else></GetQrcode>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import GetQrcode from '../templates-shim/GetQrcode'
    export default {
        mixins: [mixin],
        name: 'poster_qrcode',
        components: {
            GetQrcode
        },
        computed: {
            getStyle() {
                if (this.$isPC) {
                    return {
                        width: '100%',
                        height: '100%',
                        fontSize: this.px2rpx(this.componentData.style.width * 0.9),
                        lineHeight: this.px2rpx(this.componentData.style.width * 0.9),
                        color: this.componentData.style.color,
                        border: `${this.componentData.params.bordershow==1?Math.round(this.componentData.style.borderwidth/2):0}px solid ${this.componentData.style.bordercolor}`,
                        borderRadius: this.px2rpx(!(this.componentData.params.borderradius * 1) ? 12 : 0),
                        overflow: 'hidden'
                    }
                }
                return {
                    width: this.px2rpx(this.componentData.style.width),
                    height: this.px2rpx(this.componentData.style.width),
                    position: 'absolute',
                    top: this.px2rpx(this.componentData.style.top),
                    left: this.px2rpx(this.componentData.style.left),
                    border: `${this.componentData.params.bordershow==1?this.px2rpx(this.componentData.style.borderwidth):0} solid ${this.componentData.style.bordercolor}`,
                    borderRadius: this.px2rpx(!(this.componentData.params.borderradius * 1) ? 12 : 0),
                }
            },
        },
        mounted() {
            this.$emit('custom-event', {
                target: 'poster_qrcode/loading',
            }) 
        },
        methods: {
            getPoster(status) {
                this.$emit('custom-event', {
                    target: 'poster_qrcode/loaded',
                    data: {
                        status
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .poster_qrcode {
        display: flex;
        position: relative;
        box-sizing: border-box;
        overflow: hidden;
        .background {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        .qrcode {
            width: 100%;
            height: 100%;
        }
        i {
            text-align: center;
            margin: auto;
            display: block;
            font-size: inherit;
            line-height: inherit;
            color: inherit;
            position: relative;
            z-index: 1;
        }
        /deep/ canvas {
            width: 100%;
            height: 100%;
        }
    }
</style>