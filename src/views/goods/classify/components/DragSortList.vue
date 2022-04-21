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
    <div class="grag-sort-list">
        <div ref="draggle">
            <div v-for="item in value" :key="item.id">
                <div class='drag-item'>
                    <slot :data='item'></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Sortable from 'sortablejs';
    export default {
        components: {},
        props: {
            value: {
                type: Array,
                default: () => []
            }
        },
        watch: {
            value: {
                immediate: true,
                handler() {
                    if (this.value.length) {
                        this.initSortable()
                    }
                }
            }
        },
        methods: {
            // 初始化拖动功能
            initSortable() {
                this.$nextTick(() => {
                    let el = this.$refs['draggle'];
                    new Sortable(el, {
                        handle: '.icon',
                        dataIdAttr: 'one',
                        onEnd: this.endSortable,
                        animation: 150,
                        ghostClass: 'blue-background-class'
                    });
                })
            },
            endSortable(e) {
                let moveRow = this.value[e.oldIndex];
                this.value.splice(e.oldIndex, 1);
                this.value.splice(e.newIndex, 0, moveRow);
                this.value.forEach((item, index) => {
                    item.sort_by = index
                })
                this.$emit('input', this.value)
            },
        }
    };
</script>

<style scoped lang="scss">
    .grag-sort-list {
        width: 100%;
        .content {
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
        }
    }
</style>
