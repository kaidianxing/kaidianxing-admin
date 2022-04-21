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
    <div class='poster_nickname' v-if='currentModal.id=="poster_nickname"&&lazyLoad'>
         <i-form :label-width="100" ref='pictures' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="昵称：" style='margin-bottom:10px;'>
                    <Input placeholder="请输入昵称" v-model='currentModal.params.content' style="width: 160px;">
                    </Input>
                    <Alert style='margin-top:10px;'>提示：此数据只作为展示使用，真实数据以获取的商城会员昵称为准。</Alert>
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
                    <MyColorPicker v-model='currentModal.style.color' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="文字对齐：" style='margin-bottom:40px;'>
                    <MyButtonGroup v-model='currentModal.style.textalign' :items='textalign'></MyButtonGroup>
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
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_nickname',
        data() {
            return {
                id:'poster_nickname',
                fontweight: [{
                    label: '默认',
                    id: 400
                }, {
                    label: '加粗',
                    id: 700
                }],
                textalign:[{
                    label: '居左',
                    icon: 'iconfont icon-align-left',
                    id: "left"
                }, {
                    label: '水平居中',
                    icon: 'iconfont icon-align-center',
                    id: "center"
                }, {
                    label: '居右',
                    icon: 'iconfont icon-align-right',
                    id: "right"
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
