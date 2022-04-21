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
    <div class='poster_avatar' v-if='currentModal.id=="poster_avatar"&&lazyLoad'>
        <i-form :label-width="100" ref='pictures' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="头像：" style='margin-bottom:10px;'>
                    <MyAddImgImg size='large' v-model='currentModal.params.imgurl'></MyAddImgImg>
                    <Alert style='margin-top:10px;'>提示：此数据只作为展示使用，真实数据以获取的商城数据为准。</Alert>
                </form-item>
                <form-item label="元素大小：">
                    <Input placeholder="请输入尺寸" v-model='currentModal.style.width' @on-change='changeWidth' style="width: 160px;">
                    <span slot="append">px</span>
                    </Input>
                </form-item>
                <form-item label="水平对齐：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='align' lazy @change='toCenter'></MyButtonGroup>
                </form-item>
                <form-item label="垂直对齐：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='verticalalign' lazy @change='toMiddle'></MyButtonGroup>
                </form-item>
                <form-item label="距画布顶部：">
                    <Input placeholder="请输入尺寸" v-model='currentModal.style.top' style="width: 160px;">
                    <span slot="append">px</span>
                    </Input>
                </form-item>
                <form-item label="距画布左侧：">
                    <Input placeholder="请输入尺寸" v-model='currentModal.style.left' style="width: 160px;">
                    <span slot="append">px</span>
                    </Input>
                </form-item>
                <form-item label="形状：" style='margin-bottom:20px;'>
                    <MyRadioGroup :items='borderradius' v-model='currentModal.params.borderradius'>
                    </MyRadioGroup>
                </form-item>
                <form-item label="边框：" style='margin-bottom:30px;'>
                    <MyRadioGroup :items='bordershow' v-model='currentModal.params.bordershow'>
                        <form-item label="边框颜色：" style='margin-top:10px;' v-if="currentModal.params.bordershow == 1">
                            <MyColorPicker v-model='currentModal.style.bordercolor' default='#e6e7eb'></MyColorPicker>
                        </form-item>
                        <form-item label="边框宽度：" style='margin-bottom:10px;' v-if="currentModal.params.bordershow == 1">
                            <MyDraggableProgress :min='1' :max='5' unit='px' v-model='currentModal.style.borderwidth'></MyDraggableProgress>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_avatar',
        data() {
            return {
                id:'poster_avatar',
                borderradius: [{
                    label: '圆形',
                    id: 0
                }, {
                    label: '方形',
                    id: 1
                }],
                bordershow: [{
                    label: '开启',
                    id: 1
                }, {
                    label: '关闭',
                    id: 0
                }],
                align: [{
                    label: '居左',
                    icon: 'iconfont icon-duiqi-zuoduiqi',
                    id: "left"
                }, {
                    label: '水平居中',
                    icon: 'iconfont icon-duiqi-juzhongduiqi',
                    id: "center"
                }, {
                    label: '居右',
                    icon: 'iconfont icon-duiqi-youduiqi',
                    id: "right"
                }],
                verticalalign: [{
                    label: '顶对齐',
                    icon: 'iconfont icon-duiqi-shangduiqi',
                    id: "top"
                }, {
                    label: '垂直居中',
                    icon: 'iconfont icon-duiqi-chuizhiduiqi',
                    id: "middle"
                }, {
                    label: '底对齐',
                    icon: 'iconfont icon-duiqi-xiaduiqi',
                    id: "bottom"
                }],
            }
        },
        methods: {
            changeWidth(val){
               this.currentModal.style.height= val.target.value
            },
            toCenter(val) {
                if (val == 'left') {
                    this.currentModal.style.left = 0
                } else if (val == 'center') {
                    this.currentModal.style.left = 375 - this.currentModal.style.width / 2;
                } else {
                    this.currentModal.style.left = 750 - this.currentModal.style.width;
                }
            },
            toMiddle(val) {
                if (val == 'top') {
                    this.currentModal.style.top = 0;
                } else if (val == 'middle') {
                    this.currentModal.style.top = 667 - this.currentModal.style.height / 2;
                } else {
                    this.currentModal.style.top = 667 - this.currentModal.style.height;
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>
