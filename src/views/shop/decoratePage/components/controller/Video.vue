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
    <div class='video' v-if='currentModal.id=="video"&&lazyLoad'>
        <i-form :label-width="100" ref='video' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot="label">
                    组件样式
                </p>
                <form-item label="视频尺寸：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='ratio' v-model='currentModal.style.ratio'></MyButtonGroup>
                </form-item>
            </MyCollapse>
             <MyCollapse>
                <p class="form-title" slot="label">
                    内容
                </p>
                <form-item label="封面：">
                    <MyAddImgImg size='large' v-model='currentModal.params.poster'></MyAddImgImg>
                    <p class='tip'>建议图片大小为800x{{imgSize[currentModal.style.ratio]}}，上传{{getCurrentSize}}尺寸的图片</p>
                </form-item>
               <!-- <form-item label="视频：">
                    <MyAddImgImg size='large' type='video' icon='ivu-icon ivu-icon-ios-play' tip='添加视频' v-model="currentModal.params.videourl"></MyAddImgImg>
                </form-item>-->

                 <form-item label="视频链接：">

                     <MyVideoLink v-model='currentModal.params.videourl'></MyVideoLink>

                 </form-item>

            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot="label">
                    内容样式
                </p>
                <form-item label="上间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.margintop'></MyDraggableProgress>
                </form-item>
                <form-item label="下边距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                </form-item>
                <form-item label="左右边距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginleft'></MyDraggableProgress>
                </form-item>
                <form-item label="上边角：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.topradius'></MyDraggableProgress>
                </form-item>
                <form-item label="下边角：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.bottomradius'></MyDraggableProgress>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'video',
        data() {
            return {
                id:'video',
                imgSize:{
                    0:'450',
                    1:'600',
                    2:'800'
                },
                ratio: [{
                    label: '16:9',
                    icon: 'iconfont icon-zujian-shipinzu-_',
                    id: '0'
                }, {
                    label: '1:1',
                    icon: 'iconfont icon-zujian-shipinzu_1',
                    id: '2'
                }, {
                    label: '4:3',
                    icon: 'iconfont icon-zujian-shipinzu_',
                    id: '1'
                }],
            }
        },
        computed: {
            getCurrentSize() {
                let ratio = this.currentModal.style.ratio;
                return this.ratio.filter(item => item.id === ratio) ?.[0] ?.label || this.ratio[0].label
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>