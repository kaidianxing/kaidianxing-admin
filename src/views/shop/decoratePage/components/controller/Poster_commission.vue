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
    <div class='poster_commission' v-if='currentModal.id=="poster_commission"&&lazyLoad'>
        <i-form :label-width="100" ref='pictures' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="预计佣金：" style='margin-bottom:10px;'>
                    <span style="line-height:38px">￥0.00</span>
                    <Alert style='margin-top:10px;'>提示：此数据只作为展示使用，真实数据以获取的分销预计佣金为准。</Alert>
                </form-item>
                <form-item label="字体大小：">
                    <Input placeholder="请输入字号" v-model='currentModal.style.fontsize' style="width: 160px;">
                    <span slot="append">px</span>
                    </Input>
                </form-item>
                <form-item label="字体粗细：" style='margin-bottom:20px;'>
                    <MyRadioGroup :items='fontweight' v-model='currentModal.style.fontweight'>
                    </MyRadioGroup>
                </form-item>
                <form-item label="字体颜色：" style='margin-top:10px;'>
                    <MyColorPicker v-model='currentModal.style.color' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="背景颜色：" style='margin-top:10px;'>
                    <div class='bg' style='background:#F4F6F8;border-radius: 2px;padding:20px 20px 20px 0'>
                        <form-item label="颜色：" style='margin-top:0;margin-bottom:30px;'>
                            <MyColorPicker v-model='currentModal.style.bgcolor' default='#FF3C29'></MyColorPicker>
                        </form-item>
                        <form-item label="透明度：" style='margin-bottom:0;'>
                            <MyDraggableProgress v-model='currentModal.style.opacity' :min='0' :max='1' :ratio='100' unit='%'></MyDraggableProgress>
                        </form-item>
                    </div>
                </form-item>
                <form-item label="元素宽度：">
                    <Input placeholder="请输入尺寸" v-model='currentModal.style.width' style="width: 160px;">
                    <span slot="append">px</span>
                    </Input>
                </form-item>
                <form-item label="元素高度：">
                    <Input placeholder="请输入尺寸" v-model='currentModal.style.height' style="width: 160px;">
                    <span slot="append">px</span>
                    </Input>
                </form-item>
                <form-item label="圆角大小：" style='margin-top:10px;'>
                    <MyDraggableProgress v-model='currentModal.style.borderradius' :min='0' :max='50' unit='px'></MyDraggableProgress>
                </form-item>
                <form-item label="居中方式：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='align' lazy @change='toCenter'></MyButtonGroup>
                </form-item>
                <form-item label="对齐方式：" style='margin-bottom:40px;'>
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
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_commission',
        data() {
            return {
                id: 'poster_commission',
                fontweight: [{
                    label: '默认',
                    id: 400
                }, {
                    label: '加粗',
                    id: 700
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
                    this.currentModal.style.top = 1334 - this.currentModal.style.height;
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>
