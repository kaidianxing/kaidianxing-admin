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
    <div class='poster_commission' :style='getStyle' v-if='$isPC||componentData.params.commission'>
        预计佣金 ￥{{componentData.params.commission}}
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_commission',
        methods:{
             colorRgb (color,opacity=1) {
                color = color.toLowerCase();
                var pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
                if (color && pattern.test(color)) {
                    if (color.length == 4) {
                        // 将三位转换为六位
                        color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
                    }
                    //处理六位的颜色值
                    var colorNew = [];
                    for (var i = 1; i < 7; i += 2) {
                        colorNew.push(parseInt("0x" + color.slice(i, i + 2)));
                    }
                    colorNew.push(opacity)
                    return "rgba(" + colorNew.join(",") + ")";
                }
                return color;
            }
        },
        computed: {
            getStyle() {
                if (this.$isPC) {
                    return {
                        background: this.colorRgb(this.componentData.style.bgcolor,this.componentData.style.opacity),
                        color: this.componentData.style.color,
                        lineHeight: this.px2rpx(this.componentData.style.height),
                        borderRadius: this.px2rpx(this.componentData.style.borderradius),
                        fontWeight: this.componentData.style.fontweight,
                        fontSize: this.px2rpx(this.componentData.style.fontsize),
                        width: this.px2rpx(this.componentData.style.width),
                        height: this.px2rpx(this.componentData.style.height),
                    }
                }
                return {
                    background: this.colorRgb(this.componentData.style.bgcolor,this.componentData.style.opacity),
                    color: this.componentData.style.color,
                    position: 'absolute',
                    lineHeight: this.px2rpx(this.componentData.style.height),
                    borderRadius: this.px2rpx(this.componentData.style.borderradius),
                    fontWeight: this.componentData.style.fontweight,
                    fontSize: this.px2rpx(this.componentData.style.fontsize),
                    width: this.px2rpx(this.componentData.style.width),
                    height: this.px2rpx(this.componentData.style.height),
                    top: this.px2rpx(this.componentData.style.top),
                    left: this.px2rpx(this.componentData.style.left),
                }
            },
            getUrl() {
                if (this.componentData.params.imgurl) {
                    return this.$utils.media(this.componentData.params.imgurl)
                }
                return this.$utils.staticImg('decorate/page_bg_img.png')
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .poster_commission {
        text-align: center;
        font-family: PingFang SC;
        font-style: normal;
        white-space: nowrap;
    }
</style>