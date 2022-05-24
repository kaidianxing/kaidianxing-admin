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