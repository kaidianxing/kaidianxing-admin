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
    <div class='poster_shoplogo' v-if='currentModal.id=="poster_shoplogo"&&lazyLoad'>
        <i-form :label-width="100" ref='pictures' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="选择图片：" style='margin-bottom:10px;'>
                    <img :src="$utils.media(currentModal.params.imgurl)" alt="" style='width:100px;height:100px;border: 1px solid #E9EDEF;box-sizing: border-box;border-radius: 2px;'>
                    <Alert style='margin-top:10px;'>提示：此数据只作为展示使用，真实数据以获取的商城数据为准。</Alert>
                </form-item>
                <form-item label="图片缩放：" style='margin-bottom:30px;'>
                    <MyRadioGroup :items='imgscaletype' v-model='currentModal.params.imgscaletype'>
                        <form-item :label="currentModal.params.imgscaletype==0?'元素大小：':'元素宽度：'" style='margin-bottom:10px;margin-top:10px;'>
                            <Input placeholder="请输入尺寸" v-model='currentModal.style.width' @on-change="changeWidth" style="width: 160px;">
                            <span slot="append">px</span>
                            </Input>
                        </form-item>
                        <form-item label="元素高度：" style='margin-bottom:10px;margin-top:30px;' v-if='currentModal.params.imgscaletype==1'>
                            <Input placeholder="请输入尺寸" v-model='currentModal.style.height' style="width: 160px;">
                            <span slot="append">px</span>
                            </Input>
                        </form-item>
                    </MyRadioGroup>
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
        name: 'poster_shoplogo',
        data() {
            return {
                id: 'poster_shoplogo',
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
                imgscaletype: [{
                    label: '等比缩放',
                    id: 0
                }, {
                    label: '自定义宽高',
                    id: 1
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
            changeWidth(val) {
                if (this.currentModal.params.imgscaletype == 0) {
                    let value = val.target.value;
                    this.currentModal.style.height = value * 1;
                }
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
                    this.currentModal.style.top = 1334 - this.currentModal.style.height;
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>
