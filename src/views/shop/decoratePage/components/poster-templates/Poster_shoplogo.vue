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
    <img :src="getUrl" alt="" ref='img' :style='getStyle' class='poster_shoplogo logo-img' @error='loadError' @load='loadSuccess'>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_shoplogo',
        data() {
            return {}
        },
        computed: {
            getStyle() {
                if (this.$isPC) {
                    return {
                        width: '100%',
                        height: '100%',
                    }
                } else {
                    let size={
                        width: this.px2rpx(this.componentData.style.width),
                        top: this.px2rpx(this.componentData.style.top),
                        left: this.px2rpx(this.componentData.style.left),
                    }
                    if(this.componentData.params.imgscaletype == 1){//自定义尺寸
                        size.height = this.px2rpx(this.componentData.style.height)
                    }
                    return size
                }
            },
            getUrl() {
                if (this.componentData.params.imgurl) {
                    return this.$utils.media(this.componentData.params.imgurl)
                }
                return this.$utils.staticImg('decorate/logo_default.png')
            }
        },
        methods: {
            loadSuccess() {
                if (this.$isPC) {
                    let img = this.$refs.img
                    if (this.componentData.params.imgscaletype == 0&&img.naturalWidth) {
                        this.componentData.params.imgscaletype =1;
                        this.$nextTick(() => {
                            this.componentData.style.width=this.componentData.style.width*1
                            this.componentData.style.height = this.componentData.style.width / img.naturalWidth * img.naturalHeight
                            this.$nextTick(() => {
                                this.componentData.params.imgscaletype=0
                            })
                        })
                    }
                }
                console.log('loadSuccess shoplogo')
                this.$emit('custom-event', {
                    target: 'poster_shoplogo/loaded',
                }) 
            },
            loadError() {
                console.log('loadError shoplogo')
                if (this.$isPC) {
                    this.componentData.params.imgurl = this.$utils.staticImg('decorate/logo_default.png')
                }
                this.$emit('custom-event', {
                    target: 'poster_shoplogo/loaded',
                }) 
            }
        },
        mounted() {
            if (this.$isPC) {
                this.$api.settingApi.getBaseSetting({}).then(res => {
                    if (res.error == 0) {
                        this.componentData.params.imgurl = res.logo
                    }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .poster_shoplogo {
        position: absolute;
    }
</style>