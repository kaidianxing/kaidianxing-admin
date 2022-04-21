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
    <div class='icongroup' :style="{
            padding:`${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`
        }"  v-if='componentData&&componentData.id=="icongroup"'>
        <ul class='bg' :style='{
            background:componentData.style.background,
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`,
        }'>
            <li class='icon-item' :style='{width:`${100/componentData.params.rownum}%`}' v-for='(item,index) in componentData.data' :key='index' @click='clickItem(item,index)'>
                <div class="icon-box">
                    <i class='custom-icon' :class="item.iconclass?item.iconclass:'iconfont-m- icon-m-xingxingshixin'" :style="{color:componentData.style.iconcolor}"></i>
                    <!-- 暂未开放 -->
                    <span class="badge" v-if='item[item.linkurl]>0' :style="{background:componentData.style.dotcolor}">{{item[item.linkurl]}}</span>
                </div>
                <p class="title" :style="{color:componentData.style.textcolor}">
                    {{item.text}}
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'icongroup',
        methods: {
            clickItem(item) {
                this.$emit('custom-event', {
                    target: 'icongroup/clickItem',
                    data: item
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .icongroup {
        padding: px2rpx(8) px2rpx(12) 0;
    }
    .bg {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        border-radius: px2rpx(6);
        .icon-item {
            display: flex;
            flex-direction: column;
            height: px2rpx(85);
        }
        .icon-box {
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            position: relative;
            padding: px2rpx(16) 0 px2rpx(8);
            .custom-icon {
                font-size: px2rpx(28);
                height: px2rpx(28);
                line-height: px2rpx(28);
                display: flex;
                flex-direction: column;
                &:before {
                    width: px2rpx(28);
                    height: px2rpx(28);
                }
            }
            .badge {
                box-sizing: border-box;
                display: flex;
                justify-content: center;
                flex-direction: column;
                position: absolute;
                min-width: px2rpx(12);
                height: px2rpx(12);
                line-height: px2rpx(12);
                font-size: px2rpx(8);
                padding: 0 px2rpx(3);
                right: 0;
                top: px2rpx(12);
                background: red;
                border-radius: px2rpx(11);
                text-align: center;
                color: #fff;
                transform: translate(30%, 0);
                font-weight: bold;
            }
        }
        .title {
            text-align: center;
            margin: 0 auto;
            font-size: px2rpx(12);
            line-height: px2rpx(17);
        }
    }
</style>