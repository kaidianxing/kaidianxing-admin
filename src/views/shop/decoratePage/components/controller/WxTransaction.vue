/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class='wxTransaction' v-if='currentModal.id=="wxTransaction"&&lazyLoad'>
        <i-form :label-width="100" ref='wxTransaction' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>视频号设置</p>
                <form-item label="视频号ID：" prop="video_number_id" required >
                    <Input v-model="currentModal.params.video_number_id" type="text" placeholder="请输入视频号ID"></Input>
                    <kdx-hint-text>请登录<Button type="text" target="_blank" to="https://channels.weixin.qq.com/platform/login">视频号助手</Button>获取视频号ID，视频号与小程序必须同一认证主体
                    </kdx-hint-text>
                </form-item>
            </MyCollapse>
            <MyCollapse style="margin-bottom: 20px">
                <p class="form-title" slot='label'>组件样式</p>
                <form-item label="组件背景：">
                    <MyRadioGroup :items='bgstyle' v-model='currentModal.params.bgstyle'>
                        <form-item :label-width="80" v-if="currentModal.params.bgstyle == 'img'"
                                   label="背景图片：" style="margin-bottom:0;">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='image'
                                         v-model='currentModal.params.bgimg'></MyAddImgImg>
                            <hint-text style="margin-left: 40px;" class="hint-img-text">建议图片尺寸为750x140像素</hint-text>
                        </form-item>
                        <form-item v-else-if="currentModal.params.bgstyle == 'color'" label="背景颜色：" :label-width="80"
                                   style="margin-bottom:0;">
                            <MyColorPicker v-model='currentModal.style.bgcolor' default='#FF3C29'></MyColorPicker>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>内容样式</p>
                <form-item label="标题颜色：">
                    <MyColorPicker v-model='currentModal.style.titlecolor' default='#4D4D4D'></MyColorPicker>
                </form-item>
                <form-item label="状态文字：">
                    <div class="style-container">
                        <form-item label="文字颜色：" :label-width="110">
                            <MyColorPicker v-model='currentModal.style.statuscolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                        <form-item label="背景颜色：" :label-width="110">
                            <MyColorPicker v-model='currentModal.style.statusBgcolor' default='#FF3C29'></MyColorPicker>
                        </form-item>
                    </div>
                </form-item>
                <form-item label="预告时间：">
                    <MyColorPicker v-model='currentModal.style.advancecolor' default='#4D4D4D'></MyColorPicker>
                </form-item>
                <form-item label="按钮设置：">
                    <div class="style-container">
                        <form-item label="文字颜色：" :label-width="110">
                            <MyColorPicker v-model='currentModal.style.btncolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                        <form-item label="背景颜色：" :label-width="110">
                            <MyColorPicker v-model='currentModal.style.btnBgcolor' default='#FF3C29'></MyColorPicker>
                        </form-item>
                    </div>
                </form-item>
                <form-item label="上间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.margintop'></MyDraggableProgress>
                </form-item>
                <form-item label="下间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                </form-item>
                <form-item label="左右边距：">
                    <MyDraggableProgress
                        :min="0"
                        :max="50"
                        unit="px"
                        v-model="currentModal.style.marginleft"
                    ></MyDraggableProgress>
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
    name: 'WxTransaction',
    data() {
        return {
            id:'wxTransaction',
            bgstyle: [{
                id: 'transparent',
                label: '透明'
            },{
                id: 'color',
                label: '颜色',
            }, {
                id: 'img',
                label: '图片',
            }],
        }
    },
    computed: {},
    created() {}
}
</script>

<style lang="scss" scoped>
@import './common.scss';
.wxTransaction {
    /deep/ .radio-group {
        .content {
            padding: 20px;
        }
    }
    .bg-color {
        padding: 20px;
        .ivu-form-item {
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
    .input-reset {
        display: flex;
        flex-wrap: nowrap;
        margin-bottom: 20px;
        .label {
            min-width: 70px;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            color: #262B30;
            margin-right: 6px;
        }
    }
}
.style-container {
    border: 1px solid #E9EDEF;
    box-sizing: border-box;
    padding: 20px 20px 0 0;
    border-radius: 2px;
    background: #F4F6F8;

    /deep/ .ivu-form-item {
        margin-bottom: 20px;
    }

    .form-input-item {
        /deep/ .ivu-form-item-content {
            margin-left: 110px !important;
        }
    }
}
</style>
