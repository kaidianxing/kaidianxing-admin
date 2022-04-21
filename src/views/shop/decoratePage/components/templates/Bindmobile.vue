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

    <div class='bindmobile' :style='{padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`}' v-if='componentData&&componentData.id=="bindmobile"&&componentData.params.show!==false'>
        <div class="container" :style='{
            background:componentData.style.background,color:componentData.style.textcolor,
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
        }'>
            <div class="main">
                <p class="title" :style='{color:componentData.style.titlecolor}'>
                    <i class='custom-icon' :class="[componentData.params.iconclass]" :style='{color:componentData.style.iconcolor}'></i>{{componentData.params.title}}
                </p>
            </div>
            <div class="btn" @click='clickBtn' v-if='!componentData.params.mobile' :style="{background:componentData.style.btnbackground,color:componentData.style.btntextcolor}">{{componentData.params.btntext}}</div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'bindmobile',
        methods: {
            clickBtn() {
                this.$emit('custom-event', {
                    target: 'bindmobile/clickBtn',
                    data: this.componentData
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .bindmobile {
        .container {
            margin: 0 auto;
            display: flex;
            flex-wrap: nowrap;
            box-sizing: border-box;
            padding: px2rpx(10) rpx(12);
            border-radius: px2rpx(6);
            .main {
                flex: 1;
                .title {
                    font-size: px2rpx(12);
                    line-height: px2rpx(14);
                    padding: px2rpx(7) 0 px2rpx(6);
                    display: flex;
                    .custom-icon {
                        font-size: px2rpx(14);
                        width: px2rpx(14);
                        height: px2rpx(14);
                        line-height: px2rpx(14);
                        text-align: center;
                        margin: auto rpx(4) auto 0;
                    }
                }
            }
            .btn {
                min-width: px2rpx(78);
                height: px2rpx(27);
                padding: px2rpx(8);
                border-radius: px2rpx(27);
                background: linear-gradient(159.36deg, $uni-color-primary 0%, #FF6F29 94.38%);
                color: #fff;
                font-size: px2rpx(12);
                line-height: px2rpx(12);
                text-align: center;
                margin: auto 0;
            }
            .text{
                font-size: px2rpx(12);
                line-height: px2rpx(18);
            }
        }
    }
</style>