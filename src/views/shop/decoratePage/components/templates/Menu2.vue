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
    <div class='menu2' :style='{padding:`${px2rpx(componentData.style.margintop || 16)} ${px2rpx(componentData.style.marginleft || 24)} ${px2rpx(componentData.style.marginbottom || 0)}`}' v-if='componentData&&componentData.id=="menu2"'>
        <div class="bg" :style='{
            color:componentData.style.textcolor,background:componentData.style.background,
            borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
        }'>
            <ul class='menu-box'>
                <li class='menu-item' :style='{
                    "border-right-color": componentData.style.dividercolor 
                }' :class='["col"+componentData.data.length]' v-for='(item,index) in componentData.data' :key='index' @click='clickItem(item,index)'>
                    <p class='_p'><i class='pre-icon' :class='item.iconclass' :style='{color:componentData.style.iconcolor}' v-if='item.iconclass'></i>{{item.text}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'menu2',
        methods: {
            clickItem(item, index) {
                this.$emit('custom-event', {
                    target: 'menu2/clickItem',
                    data: {
                        item,
                        index
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .menu2 {
        padding: 0 px2rpx(12);
        width: 100%;
        margin: auto;
    }
    .bg {
        width: 100%;
        height: px2rpx(40);
        display: flex;
        color: inherit;
        border-radius: px2rpx(6);
        overflow: hidden;
        .menu-box {
            margin: auto;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-wrap: nowrap;
            justify-content: center;
            color: inherit;
            background: inherit;
            .menu-item {
                width: 0;
                flex: 1;
                text-align: center;
                line-height: px2rpx(22);
                height: px2rpx(22);
                display: flex;
                background: inherit;
                border-right: 1px solid #eee;
                color: inherit;
                background: inherit;
                &:last-child {
                    border: none;
                }
                ._p {
                    margin: auto;
                    background: inherit;
                    color: inherit;
                    background: inherit;
                    font-size: px2rpx(14);
                    display: flex;
                    .pre-icon {
                        font-size: px2rpx(18);
                        margin: auto rpx(5) auto 0;
                    }
                }
            }
        }
    }
</style>