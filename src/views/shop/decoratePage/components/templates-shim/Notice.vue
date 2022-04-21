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
               <span class='info' :style='{color:item.color}'>{{item.title}}</span>
            </SwipeItem>
        </Swipe>
    </div>
</template>

<script>
    import {
        Swipe,
        SwipeItem
    } from 'vant';
    import {
        px2rpx
    } from '@/assets/jsTools/environment'
    export default {
        components: {
            Swipe,
            SwipeItem
        },
        props: {
            speed: {
                type: [Number,String],
                default: 2
            },
            list: {
                type: Array,
                default: () => [{
                    title: '新闻1'
                }]
            }
        },
        watch: {
            list: {
                immediate: true,
                handler() {
                    console.log(this.list,'oooooooo')
                }
            }
        },
        data() {
            return {}
        },
        methods: {
            px2rpx
        }
    }
</script>

<style lang="scss" scoped>
    .notice-swiper {
        display: flex;
        .notice-container {
            flex: 1;
            display: flex;
            /deep/ .van-swipe__track {
                display: flex;
                flex: 1;
                height: 100%;
                width: 100%;
                flex-direction: column;
            }

            .info {
                font-size: px2rpx(12);
                line-height: px2rpx(12);
            }
        }
    }
</style>