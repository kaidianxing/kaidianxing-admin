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
    <div class='detail_swipe' v-if='currentModal.id=="detail_swipe"&&lazyLoad'>
        <i-form :label-width="100" ref='detail_swipe' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    轮播点设置
                </p>
                <div>
                    <form-item label="样式：">
                        <MyButtonGroup :items='pointStyle' v-model='currentModal.style.dotstyle'></MyButtonGroup>
                    </form-item>
                    <form-item label="位置：">
                        <MyButtonGroup :items='position' v-model='currentModal.style.dotalign'></MyButtonGroup>
                    </form-item>
                    <form-item label="选中颜色：">
                        <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                    </form-item>
                    <!-- <form-item label="上下间距：">
                            <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.bottom'></MyDraggableProgress>
                        </form-item>
                        <form-item label="左右间距：">
                            <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.leftright'></MyDraggableProgress>
                        </form-item>
                        <form-item label="透明度：">
                            <MyDraggableProgress v-model='currentModal.style.opacity' :min='0' :max='1' :ratio='100' unit='%'></MyDraggableProgress>
                        </form-item> -->
                </div>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'detail_swipe',
        data() {
            return {
                id:'detail_swipe',
                pointStyle: [{
                    label: '圆角',
                    icon: 'iconfont icon-zujian-lunbodian-yuanjiaojuxing',
                    
                    id: 'rectangle'
                }, {
                    label: '圆形',
                    icon: 'iconfont icon-zujian-lunbodian-yuanxing',
                    
                    id: 'round'
                }, {
                    label: '数字',
                    icon: 'iconfont icon-zujian-lunbodian-shuzi',
                    
                    id: 'number'
                }],
                position: [{
                    label: '居左',
                    icon: 'iconfont icon-duiqi-zuoduiqi',
                    
                    id: 'left'
                }, {
                    label: '居中',
                    icon: 'iconfont icon-duiqi-juzhongduiqi',
                    
                    id: 'center'
                }, {
                    label: '居右',
                    icon: 'iconfont icon-duiqi-youduiqi',
                    
                    id: 'right'
                }],
            }
        },
        computed: {
            getImgs() {
                return this.currentModal.data.map(item => {
                    return {
                        url: item.imgurl,
                        link: item.linkurl
                    }
                })
            }
        },
        methods: {
            delItem(index) {
                this.currentModal.data.splice(index, 1)
                this.refreshCurrentModal();
            },
            changeLink(index, val) {
                console.log('changeLink', index, val)
            },
            selectLink(index) {
                console.log('selectLink', index)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    /deep/ .body {
        width: 100%;
        .select-link {
            width: 100%;
            .input.ivu-input-wrapper {
                width: 100%;
            }
        }
    }
</style>