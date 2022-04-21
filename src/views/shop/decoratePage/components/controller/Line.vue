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
    <div class='line' v-if='currentModal.id=="line"&&lazyLoad'>
        <i-form :label-width="100" ref='line' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <form-item label="线条样式：">
                    <MyButtonGroup :items='lineStyle' v-model='currentModal.style.linestyle' @input='getLineType'></MyButtonGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="线条颜色：">
                    <MyColorPicker v-model='currentModal.style.bordercolor' default='#e6e7eb'></MyColorPicker>
                </form-item>
                <form-item label="线条高度：">
                    <MyDraggableProgress :min='1' :max='20' unit='px' v-model='currentModal.style.height' @input='getLineHeight'></MyDraggableProgress>
                </form-item>
                <form-item label="上下间距：">
                    <MyDraggableProgress :min='1' :max='30' unit='px' v-model='currentModal.style.padding'></MyDraggableProgress>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    let tmp = 2;
    export default {
        mixins: [mixin],
        name: 'line',
        data() {
            return {
                id:'line',
                lineStyle: [{
                    label: '实线',
                    icon: 'iconfont icon-xian-shixian',
                   
                    
                    id: 'solid'
                }, {
                    label: '双实线',
                    icon: 'iconfont icon-xian-shuangshixian',
                   
                    
                    id: 'double'
                }, {
                    label: '虚线1',
                    icon: 'iconfont icon-xian-xuxian',
                   
                    
                    id: 'dashed'
                }, {
                    label: '虚线2',
                    icon: 'iconfont icon-xian-xuxian1',
                   
                    
                    id: 'dotted'
                }],
            }
        },
        methods: {
            getLineType(val) {
                if (val == 'double') {
                    this.currentModal.style.height = Math.max(6, this.currentModal.style.height)
                } else {
                    this.currentModal.style.height = tmp;
                }
            },
            getLineHeight(val) {
                tmp = val
            }
        },
        mounted() {
            tmp = this.currentModal.style.height
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>