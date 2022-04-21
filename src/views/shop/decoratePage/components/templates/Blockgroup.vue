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
    <div class='blockgroup decorate' v-if='componentData&&componentData.id=="blockgroup"'>
        <ul class='menu-box' :style='{background:componentData.style.background}'>
            <li class='menu-item' :class='[componentData.params.sorttype,"col"+componentData.params.rownum]' v-for='(item,index) in componentData.data' :key='index' @click='clickItem(item)'>
                <i class='item-icon' :class='item.iconclass' :style='{color:item.iconcolor}'></i>
                <div class='body'>
                    <p class='title' :style="{color:item.textcolor}">{{item.text}}</p>
                    <p class="detail">
                        <span class='_span tip' :style="{color:componentData.style.tipcolor}">{{item.tipnum}}</span>
                        <span class='_span tip-unit' :style="{color:item.textcolor}">{{item.tiptext}}</span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'blockgroup',
        methods: {
            clickItem(item) {
                 this.$emit('custom-event', {
                    target: 'blockgroup/clickItem',
                    data: item
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .blockgroup.decorate {
        width: 100%;
        padding: 0 px2rpx(12);
        .menu-box {
            width: 100%;
            box-sizing: border-box;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            border-radius: px2rpx(6);
            overflow: hidden;
            .menu-item {
                overflow: hidden;
                padding: px2rpx(16) 0;
                flex-shrink: 0;
                box-sizing: border-box;
                display: flex;
                color: inherit;
                width: 50%;
                .item-icon {
                    width: px2rpx(44);
                    height: px2rpx(44);
                    font-size: px2rpx(44);
                    line-height: px2rpx(44);
                    text-align: center;
                    overflow: hidden;
                    margin: 0 auto px2rpx(6);
                }
                .body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    .title,
                    .detail {
                        color: #212121;
                        font-size: px2rpx(12);
                        line-height: px2rpx(17);
                    }
                    .tip {
                        color: #FF6F29;
                    }
                }
                &.row {
                    flex-direction: row;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    padding: px2rpx(16) 0 px2rpx(16) px2rpx(24);
                    .item-icon {
                        margin: auto px2rpx(12) auto 0;
                    }
                    .body {
                        .title,
                        .detail,
                        ._span {
                            text-align: left;
                        }
                    }
                }
                &.col {
                    flex-direction: column;
                    .body {
                        text-align: center;
                    }
                }
                &.col2 {
                    width: 50%;
                }
                &.col3 {
                    width: 33.3%;
                }
                .menu-item-img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .radius {
            .img-box {
                border-radius: rpx(20);
            }
        }
        .circle {
            .img-box {
                border-radius: 50%;
            }
        }
    }
</style>