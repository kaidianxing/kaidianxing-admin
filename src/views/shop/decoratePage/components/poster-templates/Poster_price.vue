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
    <div class='poster_price' :style='getStyle'>
        <span class='num'><i class="rmb">￥</i>{{componentData.params.content}}</span>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_price',
        computed: {
            getStyle() {
                if (this.$isPC) {
                    return {
                        width: '100%',
                        height: '100%',
                        fontSize: this.px2rpx(this.componentData.style.fontsize),
                        fontWeight: this.componentData.style.fontweight,
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
                    fontSize: this.px2rpx(this.componentData.style.fontsize),
                    fontWeight: this.componentData.style.fontweight,
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
    .poster_price {
        .rmb,
        .num {
            display: inline-block;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: bold;
            font-size: 18px;
            line-height: 25px;
            /* 主基调/brand/default */
            color: #FF3C29;
            vertical-align:bottom;
            font-size: inherit;
            font-weight: inherit;
            color: inherit;
            white-space: nowrap;
        }
        .rmb{
            display: inline-block;
            font-weight: 400;
            transform:scale(0.7) translate(10%,10%);
        }
    }
</style>