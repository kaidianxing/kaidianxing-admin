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
    <div class='notice-swiper'>
        <Swipe vertical class='notice-container' :autoplay='speed*1000' :show-indicators='false' :key='speed'>
            <SwipeItem class='notice-item' style='width:100%;' v-for='(item,index) in list' :key='index'>
                <div class='tpl' :style='{color:componentData.style.color}'>
                    <div class="img-box">
                        <img class='_img' mode='widthFix' lazy-load :src="getImg(item.imgurl)" alt="">
                    </div>
                    <div class="body">
                        最新订单来自用户{{item.nickname}}
                    </div>
                    <div class="info">
                        {{getTime(item.time)}}
                    </div>
                </div>
            </SwipeItem>
        </Swipe>
    </div>
</template>

<script>
    import {
        Swipe,
        SwipeItem
    } from 'vant';
    export default {
        components: {
            Swipe,
            SwipeItem
        },
        props: {
            componentData: {
                type: Object,
                default: () => ({})
            },
            speed: {
                type: [Number, String],
                default: 2
            },
            list: {
                type: Array,
                default: () => [{
                    title: '新闻1'
                }]
            }
        },
        data() {
            return {}
        },
        methods: {
            getTime(time) {
                
                time=parseInt(time)||0
                if (time > 60) {
                    return Math.floor(time / 60) + '分前'
                } else {
                    return '刚刚'
                }
            },
            getImg(imgurl){
                if(imgurl) {
                    return this.$utils.media(imgurl)
                } else {
                    return this.$utils.staticImg('decorate/avatar_mobile.png')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .notice-swiper {
        display: flex;
        border-radius:px2rpx(2);
        .notice-container {
            flex: 1;
            display: flex;
            height: px2rpx(32);
            /deep/ .van-swipe__track {
                display: flex;
                flex: 1;
                height: 100%;
                width: 100%;
                flex-direction: column;
            }
        }
        .tpl {
            display: flex;
            flex-wrap: nowrap;
            box-sizing: border-box;
            padding: px2rpx(4);
            width: 100%;
            height: px2rpx(32);
        }
        .img-box {
            width: px2rpx(24);
            height: px2rpx(24);
            overflow: hidden;
            box-sizing: border-box;
            border: px2rpx(0.5) solid #fff;
            border-radius: 50%;
            ._img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        .body {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 0;
            flex: 1;
            font-size: px2rpx(12);
            line-height: px2rpx(12);
            display: flex;
            flex-direction: column;
            justify-content: center;
            box-sizing: border-box;
            padding: px2rpx(6);
        }
        .info {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-align: right;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            justify-content: center; 
            font-size: px2rpx(12);
            line-height: px2rpx(12);
            padding: px2rpx(6) px2rpx(10) px2rpx(6) px2rpx(6);
        }
      
    }
</style>