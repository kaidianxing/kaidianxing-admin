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
    <div class='poster_exptime'  :style='getStyle'>
        {{getContent}}
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_exptime',
        computed: {
            getContent() {
                return this.componentData.params.content||'2000-01-01'
            },
            getStyle() {
                if (this.$isPC) {
                    return {
                        width: '100%',
                        height: '100%',
                        fontSize:this.px2rpx(this.componentData.style.fontsize),
                        fontWeight:this.componentData.style.fontweight,
                        color: this.componentData.style.color,
                        lineHeight:this.componentData.style.lineheight,
                        textAlign: this.componentData.style.textalign||'left'
                    }
                }
                return {
                    width: this.px2rpx(this.componentData.style.width),
                    height: this.px2rpx(this.componentData.style.height),
                    position: 'absolute',
                    top: this.px2rpx(this.componentData.style.top),
                    left: this.px2rpx(this.componentData.style.left),
                    fontSize:this.px2rpx(this.componentData.style.fontsize),
                    fontWeight:this.componentData.style.fontweight,
                    color: this.componentData.style.color,
                    lineHeight:this.componentData.style.lineheight,
                    textAlign: this.componentData.style.textalign||'left'
                }
            },
        },
        methods: {
           
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .poster_exptime{
        white-space: nowrap;
    }
</style>