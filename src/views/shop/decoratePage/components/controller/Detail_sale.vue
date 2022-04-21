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
    <div class="detail_sale" v-if='currentModal.id=="detail_sale"&&lazyLoad'>
        <i-form :label-width="100" ref='detail_sale' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot="label">内容样式</p>
                <form-item label="标题颜色：">
                    <MyColorPicker v-model="currentModal.style.titlecolor" default="#969696"></MyColorPicker>
                </form-item>
                <form-item label="内容文字：">
                    <MyColorPicker v-model="currentModal.style.textcolor" default="#212121"></MyColorPicker>
                </form-item>
                <form-item label="优惠券背景：">
                    <MyColorPicker v-model="currentModal.style.couponBackground" default="#FF3C29"></MyColorPicker>
                </form-item>
                <form-item label="活动：">
                    <div class="content">
                        <div class="custom-form-item" style="margin:0;">
                            <p class="label" style="width:100px;">标签颜色：</p>
                            <MyColorPicker
                                v-model="currentModal.style.activeTagColor"
                                default="#FF3C29"
                            ></MyColorPicker>
                        </div>
                        <div class="custom-form-item" style="margin:20px 0 0;">
                            <p class="label" style="width:100px;">高亮颜色：</p>
                            <MyColorPicker v-model="currentModal.style.numcolor" default="#ff3c29"></MyColorPicker>
                        </div>
                    </div>
                </form-item>
                <form-item label="服务：">
                    <div class="content">
                        <div class="custom-form-item" style="margin:0;">
                            <p class="label" style="width:100px;">标签样式：</p>
                            <MyButtonGroup
                                :items="labelstyle"
                                v-model="currentModal.params.label_style"
                            ></MyButtonGroup>
                        </div>
                        <div class="custom-form-item" style="margin:30px 0 0;">
                            <p class="label" style="width:100px;">标签颜色：</p>
                            <MyColorPicker
                                v-model="currentModal.style.servercolor"
                                default="#fff3f5"
                            ></MyColorPicker>
                        </div>
                        <div class="custom-form-item" style="margin:20px 0 0;">
                            <p class="label" style="width:100px;">文字颜色：</p>
                            <MyColorPicker
                                v-model="currentModal.style.serverTextColor"
                                default="#ff3c29"
                            ></MyColorPicker>
                        </div>
                    </div>
                </form-item>
                <form-item label="背景颜色：">
                    <MyColorPicker v-model="currentModal.style.background" default="#ffffff"></MyColorPicker>
                </form-item>
                <form-item label="上间距：">
                    <MyDraggableProgress
                        :min="0"
                        :max="50"
                        unit="px"
                        v-model="currentModal.style.margintop"
                    ></MyDraggableProgress>
                </form-item>
                <form-item label="下间距：">
                    <MyDraggableProgress
                        :min="0"
                        :max="50"
                        unit="px"
                        v-model="currentModal.style.marginbottom"
                    ></MyDraggableProgress>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
import mixin from './mixin.js'
export default {
    mixins: [mixin],
    name: 'detail_sale',
    data() {
        return {
            id:'detail_sale',
            labelstyle: [
                {
                    label: '圆角',
                    icon: 'iconfont icon-zujian-xiadantixing-yuanjiao',
                   
                    
                    id: '0'
                },
                {
                    label: '圆点',
                    icon: 'iconfont icon-dian',
                   
                    
                    id: '1'
                },
                {
                    label: '对号',
                    icon: 'iconfont icon-duihao',
                   
                    
                    id: '3'
                }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
@import './common.scss';

.content {
    background: #f4f6f8;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 34px 20px;
}
</style>