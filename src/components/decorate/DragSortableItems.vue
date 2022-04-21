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
    <div class='drag-sortable-items' ref='sortItem'>
        <draggable v-model="newList" :options="{draggable:'.drag-sort-item',filter:'input',preventOnFilter:false}" @end='drag' v-if='lazyLoad'>
            <transition-group name="flip-list" tag="ul">
                <div class='drag-sort-item' :class='{onlyone:list.length==1&&!allowAllDel}' v-for="(item,index) in list" :key='item._sortId||index'>
                    <slot :item='item' :index='index'></slot>
                    <span v-if="delabled" class="del-item ivu-icon ivu-icon-md-close-circle" @click='delItem(item,index)'></span>
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
            allowAllDel: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                lazyLoad: false,
                newList: [],
                key: new Date().getTime()
            }
        },
        mounted() {
            this.toggle(true)
        },
        beforeDestroy() {
            this.toggle(false)
        },
        actived() {
            this.toggle(true)
        },
        deactivated() {
            this.toggle(false)
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
            toggle(bool){
                setTimeout(() => {
                    this.$nextTick(() => {
                        this.lazyLoad=bool
                    })
                }, 100)
            },
            delItem(item, index) {
                this.$emit('delItem', item, index)
            },
            drag() {
                this.$emit('end', this.newList);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .drag-sortable-items {
        width: 100%;
        /* global/bg */
        .drag-sort-item {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            background: #F4F6F8;
            border-radius: 2px;
            box-sizing: border-box;
            border: 1px solid #E9EDEF;
            margin-bottom: 10px;
            padding: 10px 10px;
            .del-item {
                position: absolute;
                right: 0;
                top: 0;
                font-size: 18px;
                top: -6px;
                right: -9px;
                color: rgba(0, 0, 0, 0.3);
                display: none;
            }
            &:not(.onlyone):hover {
                .del-item {
                    display: inline;
                    cursor: pointer;
                }
            }
        }
        .flip-list-move {
            transition: transform .4s;
        }
    }
</style>