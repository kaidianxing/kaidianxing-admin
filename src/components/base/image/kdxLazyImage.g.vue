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
    <div class='lazy-load-image'>
        <img class='img preload-img' :src="getLoadingSrc" :mode="mode" :fade-show='fadeShow'></img>
        <img class='img succ-img' :style='{opacity:loading?0:1,position:loading?"absolute":"relative"}' :src="getSrc" :mode="mode" :lazy-load="lazyLoad" :fade-show='fadeShow' :webp='webp' @error='error' @load='load'></img>
    </div>
</template>

<script>
    export default {
        name:'kdx-lazy-image',
        props: {
            src: {
                type: String,
                default: ''
            },
            preSrc: {
                type: String,
                default: ''
            },
            errSrc: {
                type: String,
                default: ''
            },
            mode: {
                type: String,
                default: 'scaleToFill'
            },
            lazyLoad: {
                type: Boolean,
                default: true
            },
            fadeShow: {
                type: Boolean,
                default: true
            },
            showMenuByLongpress: {
                type: Boolean,
                default: false
            },
            webp: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                loading: true,
                failed: false,
                defaultErrorSrc: '',
                defaultLoadingSrc: ''
            }
        },
        computed: {
            getErrSrc() {
                if (this.errSrc) {
                    return this.errSrc
                }
                return ''
            },
            getLoadingSrc() {
                if (this.preSrc) {
                    return this.preSrc
                }
                if (this.$store.state.setting.systemSetting ?.basic ?.loading) {
                    return this.$store.state.setting.cacheLoadingImg || this.$utils.media(this.$store.state.setting.systemSetting.basic.loading)
                }else{
                    return ''
                }
            },
            getDefaultSrc() {
                if (this.src) {
                    return this.src
                }
                return ''
            },
            getSrc() {
                let src = '';
                if (this.failed && this.getErrSrc) { //加载失败
                    src = this.getErrSrc
                } else if (this.loading && this.getLoadingSrc) { //正在加载
                    src = this.getLoadingSrc
                } else { //最后展示的图
                    src = this.getDefaultSrc
                }
                return src
            }
        },
        methods: {
            error(e) {
                this.failed = true
                this.$emit("error", e)
            },
            load(e) {
                this.loading = false
                this.$emit("load", e)
            }
        }
    }
</script>

<style lang="scss" scoped>
    image,
    img {
        will-change: transform
    }
    .lazy-load-image {
        width:300px;
        height:225px;
        display: inline-block;
        position: relative;
        overflow: hidden;
        font-size: 0;
        line-height: 0;
        .img {
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }
        .preload-img {
            position: relative;
            z-index: 1;
        }
        .succ-img {
            z-index: 0;
        }
    }
</style>