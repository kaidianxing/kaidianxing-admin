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
        <draggable v-model="newList" :options="{draggable:'.drag-sort-item',filter:'input',preventOnFilter:false}" @end='drag'>
            <transition-group name="flip-list" tag="ul">
                <li class='btn drag-sort-item' v-for="(item,index) in newList"  :key='item._sortId||index'>
                    <component :is='item.type' :model='item' @on-delete='delItem(item,index)'></component>
                </li>
            </transition-group>
        </draggable>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import draggable from 'vuedraggable'
    import components from './allControllers.js'
    export default {
        components: {
            ...components,
            draggable
        },
        computed: {
            ...mapState('form', {
                items: state => state.formItems
            })
        },
        watch: {
            items: {
                immediate: true,
                handler() {
                    this.newList = this.items.map(item => {
                        if (typeof item == 'object' && !item._sortId) {
                            item._sortId = new Date().getTime() + '_' + Math.random()
                        }
                        return item;
                    })
                }
            }
        },
        data() {
            return {
                newList: [],
            }
        },
        methods: {
            ...mapMutations('form',['setFormItems','delFormItem']),
            delItem(item, index) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除？',
                    onOk: () => {
                        this.delFormItem(index)
                    }
                });
            },
            drag() {
                this.setFormItems(this.newList)
            }
        }
    }
</script>

<style lang="scss" scoped>
.drag-sort-item{
    margin-bottom: 12px;;
}
</style>
