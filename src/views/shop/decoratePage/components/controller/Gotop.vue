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
    <div class='gotop' v-if='currentModal.id=="gotop"&&lazyLoad'>
        <i-form :label-width="100" ref='gotop' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <div>
                    <form-item label="展示类型：">
                        <MyRadioGroup :items='gotoptype' v-model='currentModal.params.gotoptype'>
                            <div v-if='currentModal.params.gotoptype=="0"'>
                                <div style='display:flex;margin-bottom:10px;'>
                                    <p class="label" style="margin-right:15px;text-align:right;width:90px;color:#262B30">图标：</p>
                                    <MyAddImgImg v-model='currentModal.params.iconclass' type='icon'></MyAddImgImg>
                                </div>

                                <form-item label="图标颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.iconcolor' default='#ffffff'></MyColorPicker>
                                </form-item>
                                <form-item label="背景颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.background' default='#000000'></MyColorPicker>
                                </form-item>
                                <form-item label="背景透明度：" style='margin-bottom:10px;'>
                                    <MyDraggableProgress :min='0' :max='1' unit='%' :ratio='100' v-model='currentModal.style.opacity'></MyDraggableProgress>
                                </form-item>
                            </div>
                            <div style='display:flex;margin-bottom:10px;' v-else>
                                <p class="label" style="margin-right:15px;text-align:right;width:90px;color:#262B30">图片：</p>
                                <MyAddImgImg size='mini' type='image' :value='currentModal.params.imgurl' @change='changeImg'></MyAddImgImg>
                            </div>
                            <kdx-hint-text class="img-hint-text" v-if='currentModal.params.gotoptype!=="0"'> 建议图片尺寸为100x100,比例为1:1</kdx-hint-text>
                            <form-item label="按钮大小：" style='margin-bottom:10px;'>
                                <MyDraggableProgress :min='30' :max='200' unit='px' v-model='currentModal.style.width'></MyDraggableProgress>
                            </form-item>
                        </MyRadioGroup>
                    </form-item>
                    <form-item label="按钮位置：">
                        <MyRadioGroup :items='iconposition' v-model='currentModal.params.iconposition'>
                            <form-item label="上下偏移：" style='margin-bottom:10px;'>
                                <MyDraggableProgress :min='0' :max='200' unit='px' v-model='currentModal.style.top'></MyDraggableProgress>
                            </form-item>
                            <form-item label="左右偏移：" style='margin-bottom:10px;'>
                                <MyDraggableProgress :min='0' :max='200' unit='px' v-model='currentModal.style.left'></MyDraggableProgress>
                            </form-item>
                            <form-item label="显示高度：" style='margin-bottom:10px;'>
                                <MyDraggableProgress :min='0' :max='300' unit='px' v-model='currentModal.params.gotopheight'></MyDraggableProgress>
                                <p class="tip" style='line-height:1.5;margin-left:100px;'>当浏览器滚动至此高度时显示返回顶部按钮(图标事件为跳转链接时始终显示)</p>
                            </form-item>
                        </MyRadioGroup>
                    </form-item>
                    <form-item label="图标事件：">
                        <MyRadioGroup :items='gotopclick' v-model='currentModal.params.gotopclick'>
                            <form-item label="选择链接：" style='margin-bottom:0;margin-top:10px;' v-if="currentModal.params.gotopclick == '1'">
                                <MySelectLink :value='{
                                    url: currentModal.params.linkurl,
                                    name: currentModal.params.linkurl_name,
                                    wxappid: currentModal.params.wxappid
                                }' @change='changeLink' ></MySelectLink>
                            </form-item>
                        </MyRadioGroup>
                    </form-item> 
                </div>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'gotop',
        data() {
            return {
                id:'gotop',
                gotopclick: [{
                    label: '返回顶部',
                    id: '0'
                }, {
                    label: '跳转链接',
                    id: '1'
                }],
                iconposition: [{
                    label: '左下',
                    id: 'left bottom',
                }, {
                    label: '右下',
                    id: 'right bottom',
                }],
                gotoptype: [{
                    label: '图标',
                    id: '0'
                }, {
                    label: '图片',
                    id: '1'
                }]
            }
        },
        methods: {
            changeImg(val) {
                this.currentModal.params.imgurl = val;
            },
            changeLink(val){
                this.currentModal.params.linkurl = val.url;
                this.currentModal.params.linkurl_name = val.name
                this.currentModal.params.wxappid = val.wxappid
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';

    /deep/ .radio-group>.content {
        padding: 20px 20px 10px 0;
    }

    .img-hint-text {
        margin:0 0 10px 100px;
        padding-top: 0;
    }
</style>