/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class='wxTransaction'
         :style="{ padding:`${px2rpx(componentData.style.margintop)}  ${px2rpx(componentData.style.marginleft)}  ${px2rpx(componentData.style.marginbottom)} `}"
         v-if='componentData&&componentData.id=="wxTransaction"'>
        <div style="overflow: hidden;background-size: cover;" :style="{
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
             background: getContentBackground}">
            <div class="container space-between align-center">
                <div class="flex-column">
                    <div class="flex">
                        <div class="status flex align-center" :style="{color: componentData.style.statuscolor,background: componentData.style.statusBgcolor}">

                            <span
                                class="iconfont icon-a-Ellipse366"
                                :style="{color: componentData.style.statuscolor}"
                                v-if="$isPC"
                            ></span>
                            <span
                                class="iconfont-m- icon-m-a-Ellipse366"
                                :style="{color: componentData.style.statuscolor}"
                                v-else
                            ></span>直播中
                        </div>
                        <div class="title" :style="{color: componentData.style.titlecolor}">后朴旗舰店视频号直播</div>
                    </div>
                    <div class="time" :style="{color: componentData.style.advancecolor}">5月1日 20:00:00 开播</div>
                </div>
                <div class="btn" :style="{color: componentData.style.btncolor,background: componentData.style.btnBgcolor}">观看直播</div>
            </div>
        </div>
    </div>
</template>

<script>
import mixin from './mixin.js'
export default {
    mixins: [mixin],
    name: 'wxTransaction',
    data() {
        return {

        }
    },
    computed: {
        getContentBackground() {
            let bgStyle = this.componentData.params.bgstyle;
            if (bgStyle === 'color') {
                return this.componentData.style.bgcolor;
            }
            if (bgStyle === 'img' && this.componentData.params.bgimg) {
                return `url(${this.$utils.media(this.componentData.params.bgimg)}`;
            } else {
                return '';
            }
        },
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
@import './decorate.scss';
@import '../templates-shim/followbar.scss';
.wxTransaction {
    width: 100%;
    .container {
        height: px2rpx(68);
        padding: px2rpx(12) px2rpx(16);
        display: flex;
    }
    .status {
        height: px2rpx(20);
        font-size: px2rpx(10);
        padding: px2rpx(2) px2rpx(6);
        border-radius: px2rpx(4);
        margin-right: px2rpx(8);
        .iconfont {
            font-size: px2rpx(4);
            transform: scale(0.6);
        }
        .iconfont-m- {
            font-size: px2rpx(6);
            margin-right: px2rpx(2);
        }
    }
    .title {
        font-size: px2rpx(14);
        line-height: px2rpx(20);
        font-weight: 600;
    }
    .time {
        margin-top: px2rpx(7);
        font-size: px2rpx(12);
        line-height: px2rpx(17);
    }
    .btn {
        font-size: px2rpx(12);
        font-weight: 600;
        width: px2rpx(76);
        height: px2rpx(28);
        line-height: px2rpx(28);
        border-radius: px2rpx(14);
        text-align: center;
    }
}
</style>