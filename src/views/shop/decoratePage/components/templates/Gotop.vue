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
    <div class='gotop isfixed' :class='[componentData.params.iconposition]' :style="{bottom: getBottom,width:px2rpx(componentData.style.width),borderRadius:componentData.params.gotoptype=='0'?'50%':'0',background:componentData.params.gotoptype=='0'?componentData.style.background:'',opacity:componentData.params.gotoptype==1?1:componentData.style.opacity,margin:getMargin}" @click='clickGoTop' v-if='(componentData&&componentData.id=="gotop"&&componentData.show)||$isPC'>
        <img mode='widthFix' lazy-load :src="$utils.media(componentData.params.imgurl)" alt="" class='img' v-if='componentData.params.gotoptype==1'>
        <i :class='[componentData.params.iconclass]' class='iconfont-icon' :style="{fontSize:px2rpx(componentData.style.width/1.5),lineHeight:px2rpx(componentData.style.width),color:componentData.style.iconcolor}" v-else></i>
    </div>
</template>

<script>
    import mixin from './mixin.js'

    export default {
        mixins: [mixin],
        name: 'blockgroup',
        computed: {
            getMargin(){
                return `${this.px2rpx(this.componentData.style.top*1+100)} ${this.px2rpx(this.componentData.style.left*1+30)}`
            },
            getBottom() {
                 if(!this.$isPC && this.componentData.params.iconposition.indexOf('bottom')>-1) {
                    return  this.$store.state.areaBottom + 'px'
                }  else {
                    return 0
                }
            }
        },
        methods: {
            clickGoTop() {
                this.$emit('custom-event', {
                    target: 'gotop/clickGoTop',
                    data: this.componentData,
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .gotop {
        position: absolute;
        bottom: rpx(10);
        display: flex;
        flex-direction: column;
        text-align: center;
        z-index: 99999;
        border-radius: px2rpx(6);
        &.top {
            top: 0;
        }
        &.bottom {
            bottom: 0;
        }
        &.left {
            left: 0;
        }
        &.right {
            right: 0;
        }
        .iconfont-icon {
            width: 100%;
            text-align: center;
            margin: auto;
            display: block;
            height: 100%;
        }
        .img {
            width: 100%;
            height: auto;
            display: block;
            margin: auto;
        }
    }
</style>