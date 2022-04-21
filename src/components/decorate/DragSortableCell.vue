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
    <div
        class='drag-sortable-items'
        ref='sortItem'
    >
        <draggable
            :move="checkMove"
            v-model="newList"
            :options="{draggable:'.drag-sort-item',filter:'input',preventOnFilter:false}"
            @end='drag'
        >
            <transition-group
                name="flip-list"
                tag="ul"
            >
                <div
                    class='drag-sort-item'
                    @click.stop.prevent="clickItem(index)"
                    :class='{onlyone:list.length==1, on: current == index}'
                    v-for="(item,index) in list"
                    :key='item._sortId||index'
                >
                <i class="border border-left"></i>
                <i class="border border-right"></i>
                    <div class="flex tab-container">
                        <div class="flex align-center">
                            <div class="move-box">
                                <i
                                    v-show="!noDragList.includes(index)"
                                    class="iconfont icon-move"
                                ></i>
                            </div>
                            <slot
                                :item='item'
                                :index='index'
                            ></slot>
                        </div>
                        <i
                            v-if="delabled|| ( noDelList.length&&!noDelList.includes(index))"
                            class="iconfont icon-huiyuan-shanchu"
                            @click.stop='delItem(item,index)'
                        ></i>
                    </div>
                </div>
            </transition-group>
        </draggable>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
    components: {
        draggable
    },
    props: {
        list: {
            type: Array,
            default: () => [{}]
        },
        delabled: {
            type: Boolean,
            default: true
        },
        current: {
            type: Number,
            default: 0
        },
        noDragList: {
            type: Array,
            default: () => []
        },
        noDelList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            newList: [],
            key: new Date().getTime()
        }
    },
    watch: {
        list: {
            immediate: true,
            handler() {
                this.newList = this.list.map(item => {
                    if (typeof item == 'object' && !item._sortId) {
                        item._sortId = new Date().getTime() + '_' + Math.random()
                    }
                    return item;
                })
            }
        }
    },
    methods: {
        checkMove(e) {
            if (this.noDragList.includes(e.draggedContext.index) || this.noDragList.includes(e.relatedContext.index)) {
                return false
            }
        },
        delItem(item, index) {
            this.$emit('delItem', item, index)
        },
        drag() {
            this.$emit('end', this.newList);
        },
        clickItem(index) {
            this.$emit('on-current', index)
        }
    }
}
</script>

<style lang="scss" scoped>
.drag-sortable-items {

    width: 100%;

   &>div:last-child {
        .drag-sort-item:last-child {
            border-bottom: 1px solid #e9edef;;
        }
    }
    /* global/bg */
    .drag-sort-item {
        position: relative;
        width: 100%;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        background: #fff;
        border-radius: 2px;
        box-sizing: border-box;
        border: 1px solid #e9edef;
        border-bottom: 0;
        min-height: 38px;
        padding: 0 10px 0 0;
        &::before,&::after{
            content:'';
            position: absolute;
            height: 0;
            left:-1px;
            right:-1px;
            z-index: 99;
        }
        &::before{
            top: -1px;
            border-top: 1px solid  #e9edef;
        }
        &::after{
            border-bottom: 1px solid  #e9edef;
            bottom: -1px;
        }
        .border{
            position: absolute;
            width: 0;
            top: -1px;
            bottom: -1px;
        }
        .border-left{
            border-left: 1px solid  #e9edef;
            left: -1px;
        }
        .border-right{
            right: -1px;
            border-right: 1px solid  #e9edef;
        }
        &:last-child {
            border-bottom: 0;
            .move-box {
                height: 100%;
                min-height: 36px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            &::after{
                bottom:-1px!important;
            }
        }

        &:hover:not(.on) { 
            &::before{
                border-top: 1px dashed  $brand-color;
            }
            &::after{
                border-bottom: 1px dashed $brand-color;
                bottom: 0;
            } 
            .border-left{
                border-left: 1px dashed $brand-color;
            }
            .border-right{
                border-right: 1px dashed  $brand-color;
            }
            .tab-container .icon-huiyuan-shanchu {
                display: block;
            }
            .icon-huiyuan-shanchu {
                display: flex!important;
                flex-direction: column;
                justify-content: center;
            }
        }

        &.on {
            .border,&::after,&::before{
                border-color:$brand-color;
            }
            &::after{
                bottom: 0;
            }
            .tab-container .icon-huiyuan-shanchu {
                display: block;
            }
            .icon-huiyuan-shanchu {
                display: flex!important;
                flex-direction: column;
                justify-content: center;
            }
            .move-box {
                height: 100%;
                min-height: 35px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
        }

        .tab-container {
            justify-content: space-between;
            .move-box {
                border-right: 1px solid #e9edef;
                margin-right: 10px;
                width: 40px;
                min-height: 35px;
                background: #f4f6f8;
                text-align: center;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .icon-move {
                    color: #b8b9bd;
                    font-size: 24px;
                }
            }

            .icon-huiyuan-shanchu {
                color: #ff3c29;
                font-size: 14px;
                display: none;
            }
        }
    }

    .flip-list-move {
            transition: transform .4s;
        }
}
</style>