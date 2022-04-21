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
   <div class="tabbar" :style='{padding:`${px2rpx(insideStyle.margintop)} 0 ${px2rpx(insideStyle.marginbottom)}`}' v-if='componentData&&componentData.id=="tabbar"'>
        <div :style="{
             padding: `0 ${px2rpx(insideStyle.marginleft)}`,
             'margin-bottom': `${px2rpx(insideStyle.margininside)}`
         }">
       <div class="radius-box" :style="{
           borderRadius: `${px2rpx(insideStyle.topradius)} ${px2rpx(insideStyle.topradius)} ${px2rpx(insideStyle.bottomradius)} ${px2rpx(insideStyle.bottomradius)}`
       }" :class='$isPC?"":"isNotPC"'>

           <ul class='tabbar-list' :class="{
            'vertical-show': insideStyle.showtype=='2',
            }"
            :style="{background:insideStyle.background}"
            >
                <li 
                    v-for='(item,index) in componentData.data'
                    :key='index'
                    class='tabbar-item'
                    :class='{active:isActive(index)}'
                    :style="{
                        color:isActive(index)?insideStyle.activecolor:insideStyle.textcolor,
                        background: isActive(index)?insideStyle.activebgcolor: ''
                    }"
                    :data-key='index' 
                    @click='clickItem(item,index)'>
                    <span class='_span'>{{item.title}} <i class='after' :style="{background:isActive(index)?insideStyle.activecolor:insideStyle.textcolor}"></i></span>
                </li>
            </ul>
        </div>
        </div>
        <Goods v-if="componentData.data[activeIndex]" :start-load-img='startLoadImg' :componentData="componentData.data[activeIndex].goods" @custom-event="eventHandler"></Goods>
   </div>
</template>

<script>
    import Goods from './Goods'
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        components: {
            Goods
        },
        name: 'tabbar',
        data() {
            return {
                activeIndex: 0
            }
        },
        computed: {
            insideStyle(){
                return this.componentData.style
            }
        },
        mounted(){
            // #ifdef H5
            if(this.$isPC) {
                this.$watch('componentData',function(newItem){
                    this.activeIndex =  newItem.params.current
                },{immediate: true, deep: true})
            }
            // #endif
        },
        methods: {
            clickItem(item, index) {
                if(!this.$isPC && this.activeIndex != index) {
                    this.activeIndex = index
                    this.$emit('custom-event', {
                        target: 'tabbar/clickItem',
                        data: {
                            value: item,
                            key: index,
                            data: this.componentData
                        }
                    })
                }
               
            },
            eventHandler(e){
                this.$emit('custom-event',e)
                if(!this.$isPC) {
                    let eventHandler = require('../templates-shim/index').default
                    eventHandler.call(this, e)
                }
            },
            isActive(i){
                return this.activeIndex == i
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .tabbar {
        .isNotPC::-webkit-scrollbar {
            display: none;
        }
        .tabbar-list {
            display: flex;
            flex-wrap: nowrap;
            align-self: center;
            justify-content:center;
            position: relative;
            overflow: auto hidden;
            white-space: nowrap;
            line-height: px2rpx(40);
            background: #fff;
            width: fit-content;
            min-width: 100%;
            .tabbar-item {
                color: #666666;
                font-size: px2rpx(14);
                padding: 0 px2rpx(16);
                min-width: px2rpx(75);
                flex-shrink: 0;
                flex-grow: 0;
                height: px2rpx(40);
                line-height: px2rpx(40);
                box-sizing: border-box;
                text-align: center;
                border: 0;
                border-bottom: rpx(6) solid transparent;
                border-radius: 0;
                text-align: center;
                position: relative;
                cursor: pointer;
                flex-shrink: 0;
                &.active {
                    color: #ef4f4f;
                    font-weight: bold;
                    ._span {
                        display: inline-block;
                        position: relative;
                        .after {
                            position: absolute;
                            left: 50%;
                            bottom: 0;
                            transform: translate(-50%,0);
                            width: px2rpx(28);
                            height: px2rpx(2);
                            background: #ef4f4f;
                            border-radius: px2rpx(6);
                        }
                    }
                }
            }
        }
        .vertical-show {
            flex-wrap: wrap;
            height: fit-content;
            .tabbar-item {
                width: 25%;
            }
        }

        .radius-box {
            border-radius: px2rpx(6);
            overflow-x: auto;
            overflow-y: hidden;;
        }

        .top-radius {
            border-top-left-radius: px2rpx(6);
            border-top-right-radius: px2rpx(6);
        }

        .bottom-radius {
            border-bottom-left-radius: px2rpx(6);
            border-bottom-right-radius: px2rpx(6);
        }
    }
</style>