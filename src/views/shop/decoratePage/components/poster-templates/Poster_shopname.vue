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
    <div class='poster_shopname' :style='getStyle'>
        <div class='text' ref='poster_shopname' :style='getTextHeight'>
            {{componentData.params.content||'店铺名称'}}
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_shopname',
        computed: {
            getStyle() {
                if (this.$isPC) {
                    return {
                        width: '100%',
                        height: '100%',
                        fontSize: this.px2rpx(this.componentData.style.fontsize),
                        fontWeight: this.componentData.style.fontweight,
                        color: this.componentData.style.color,
                        lineHeight: this.componentData.style.lineheight,
                        textAlign: this.componentData.style.textalign || 'center',
                        '-webkit-line-clamp': this.overlow
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
                    lineHeight: this.componentData.style.lineheight,
                    textAlign: this.componentData.style.textalign || 'center',
                    '-webkit-line-clamp': this.overlow,
                    overflow: 'visible',
                }
            },
            overlow() {
                let rownum = Math.round(this.componentData.style.height / (this.componentData.style.fontsize * this.componentData.style.lineheight || 1.1))
                rownum = Math.max(rownum, 1);
                return rownum
            },
            getTextHeight() {
                if (this.$isPC) {
                    return {
                        ...this.getStyle,
                        height: this.px2rpx(this.overlow * (this.componentData.style.fontsize * this.componentData.style.lineheight || 1.1)),
                        // display: '-webkit-box',
                        top: 0,
                        left: 0
                    }
                }
                return {
                    ...this.getStyle,
                    height: 'unset',
                    display: 'inline-block',
                    top: 0,
                    left: 0
                }
            }
        },
        methods: {},
        mounted() {
            if (this.$isPC) {
                this.$api.settingApi.getBaseSetting({}).then(res => {
                    if (res.error == 0) {
                        this.componentData.params.content = res.name
                    }
                });
            } else {
                //#ifdef H5
                if (window.$clamp) {
                    this.$nextTick(() => {
                        console.log('this.$refs.poster_shopname',this.$refs.poster_shopname)
                        window.$clamp(this.$refs.poster_shopname, {
                            clamp: this.overlow,
                            useNativeClamp: false,
                        });
                    })
                }
                //#endif
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .text {
        word-break: break-all;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        /* 文字信息/21 */
        color: #212121;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
    }
</style>
