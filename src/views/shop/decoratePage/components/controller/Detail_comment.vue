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
    <div class='detail_comment' v-if='currentModal.id=="detail_comment"&&lazyLoad'>
        <i-form :label-width="120" ref='detail_comment' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>组件样式</p>
                <form-item label="组件类型：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='showType' v-model='currentModal.params.showtype'></MyButtonGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="标题背景：">
                    <MyColorPicker v-model='currentModal.style.titlebgcolor' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="标题颜色：">
                    <MyColorPicker v-model='currentModal.style.titlecolor' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="评价条数：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showcommentnum'>
                        <div class='input-reset' v-if='currentModal.params.showcommentnum==1' style="margin-bottom: 0">
                            <span class='label'>文字颜色：</span>
                            <MyColorPicker v-model='currentModal.style.commentnumcolor' default='#212121'></MyColorPicker>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="查看更多：" v-if="currentModal.params.showtype === '0'">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showmore'>
                        <div class='input-reset' v-if='currentModal.params.showmore==="1"'>
                            <span class='label'>显示文字：</span>
                            <MyInputWithReset placeholder='如：查看更多' :emptySubmit="false" default="查看更多" v-model='currentModal.params.moretext'></MyInputWithReset>
                        </div>
                        <div class='input-reset' v-if='currentModal.params.showmore==1' style="margin-bottom: 0">
                            <span class='label'>文字颜色：</span>
                            <MyColorPicker v-model='currentModal.style.morecolor' default='#969696'></MyColorPicker>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="评价图标：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showarrow'>
                        <div class='input-reset' v-if='currentModal.params.showarrow==="1"'>
                            <span class='label'>图标：</span>
                            <MyAddImgImg style="display:inline-block;" size='mini' type='icon' v-model='currentModal.params.arrowicon'></MyAddImgImg>
                        </div>
                        <div class='input-reset' v-if='currentModal.params.showarrow==1' style="margin-bottom: 0">
                            <span class='label'>图标颜色：</span>
                            <MyColorPicker v-model='currentModal.style.arrowcolor' default='#969696'></MyColorPicker>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="标题分隔线：">
                    <MyColorPicker v-model='currentModal.style.titledividercolor' default='#e6e7eb'></MyColorPicker>
                </form-item>
                <form-item label="用户名颜色：">
                    <MyColorPicker v-model='currentModal.style.usercolor' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="会员等级：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showlevel'>
                        <div class='input-reset' v-if='currentModal.params.showlevel==1'>
                            <span class='label'>文字颜色：</span>
                            <MyColorPicker v-model='currentModal.style.levelcolor' default='#f2dcac'></MyColorPicker>
                        </div>
                        <div class='input-reset' v-if='currentModal.params.showlevel==1' style="margin-bottom: 0">
                            <span class='label'>背景颜色：</span>
                            <MyColorPicker v-model='currentModal.style.levelbgcolor' default='#31312d'></MyColorPicker>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="评价等级：" v-if="currentModal.params.showtype === '0'">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showstar'>
                        <div class='input-reset' v-if='currentModal.params.showstar==1'>
                            <span class='label'>主要颜色：</span>
                            <MyColorPicker v-model='currentModal.style.starcolor' default='#ff3c29'></MyColorPicker>
                        </div>
                        <div class='input-reset' v-if='currentModal.params.showstar==1' style="margin-bottom: 0">
                            <span class='label'>辅助颜色：</span>
                            <MyColorPicker v-model='currentModal.style.nostarcolor' default='#e6e7eb'></MyColorPicker>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="内容颜色：">
                    <MyColorPicker v-model='currentModal.style.commentcolor' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="商品规格：" v-if="currentModal.params.showtype === '0'">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showspec'>
                        <div class='input-reset' v-if='currentModal.params.showspec==1' style="margin-bottom: 0">
                            <span class='label'>文字颜色：</span>
                            <MyColorPicker v-model='currentModal.style.speccolor' default='#969696'></MyColorPicker>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="评价时间：" v-if="currentModal.params.showtype === '0'">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showtime'>
                        <div class='input-reset' v-if='currentModal.params.showtime==1' style="margin-bottom: 0">
                            <span class='label'>文字颜色：</span>
                            <MyColorPicker v-model='currentModal.style.timecolor' default='#969696'></MyColorPicker>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="评价图片：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showimg'></MyRadioGroup>
                </form-item>

                <form-item label="分隔线颜色：" v-if="currentModal.params.showtype === '0'">
                    <MyColorPicker v-model='currentModal.style.dividercolor' default='#e6e7eb'></MyColorPicker>
                </form-item>

                <form-item label="更多评论：" v-if="currentModal.params.showtype === '1'">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showall'>
                        <div class='input-reset' v-if='currentModal.params.showall==="1"'>
                            <span class='label'>显示文字：</span>
                            <MyInputWithReset placeholder='如：更多评论' :emptySubmit="false" default="更多评论" v-model='currentModal.params.alltext'></MyInputWithReset>
                        </div>
                        <div class='input-reset' v-if='currentModal.params.showall==1' style="margin-bottom: 0">
                            <span class='label'>文字颜色：</span>
                            <MyColorPicker v-model='currentModal.style.allcolor' default='#969696'></MyColorPicker>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="评价背景：" v-if="currentModal.params.showtype === '1'">
                    <MyColorPicker v-model='currentModal.style.commentbgcolor' default='#f5f5f5'></MyColorPicker>
                </form-item>
                <form-item label="描边颜色：" v-if="currentModal.params.showtype === '1'">
                    <MyColorPicker v-model='currentModal.style.bordercolor' default='#e6e7eb'></MyColorPicker>
                </form-item>

                <form-item label="组件背景：">
                    <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                </form-item>

                <form-item label="内部间距：" v-if="currentModal.params.showtype === '1'">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.betweenmargin'></MyDraggableProgress>
                </form-item>

                <form-item label="上间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.margintop'></MyDraggableProgress>
                </form-item>
                <form-item label="下间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    const defaultData = {
        params: {
            total: 10, //总评价数
            praise: 10, //好评条数
            showtype: '1', // 0 普通 1 滑动
            showcommentnum: '1', // 评价条数
            showmore: '0', // 查看更多
            moretext: '查看更多',
            showarrow: '1',
            arrowicon: 'iconfont-def icon-def-jiantou-you1',
            showlevel: '1',
            showstar: '1',
            showspec: '1',
            showtime: '1',
            showimg: '1',
            showall: '1',
            alltext: '更多评论',
        },
        style: {
            titlebgcolor: '#ffffff',
            titlecolor: '#212121',
            commentnumcolor: '#212121',
            morecolor: '#969696',
            arrowcolor: '#969696',
            titledividercolor: '#e6e7eb',
            usercolor: '#212121',
            levelcolor: '#f2dcac',
            levelbgcolor: '#31312d',
            starcolor: '#FF3C29',
            nostarcolor: '#e6e7eb',
            commentcolor: '#212121',
            speccolor: '#969696',
            timecolor: '#969696',
            dividercolor: '#e6e7eb',
            background: "#ffffff",
            margintop: 8,
            marginbottom: 8,
            allcolor: "#969696",
            commentbgcolor: "#f5f5f5",
            bordercolor: "#e6e7eb",
            betweenmargin: 24,
        }
    };
    export default {
        mixins: [mixin],
        name: 'detail_comment',
        data() {
            return {
                id:'detail_comment',
                showBtn: [{
                    label: '显示',
                    id: '1'
                }, {
                    label: '不显示',
                    id: '0'
                }],
                showType: [{
                    label: '普通',
                    icon: 'iconfont icon-zujian-shangpinzu-danlieshangpin',
                    id: '0'
                }, {
                    label: '左右滑动',
                    icon: 'iconfont icon-zujian-shangpinzu-huadong',
                    id: '1'
                }]
            }
        },
        computed: {},
        created() {
            if (this.currentModal.params.showtype) { return }
            this.currentModal.style = {
                ...defaultData.style,
                ...this.currentModal.style
            };
            this.currentModal.params = {
                ...defaultData.params,
                ...this.currentModal.params
            };
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .detail_comment {
        /deep/ .radio-group {
            .content {
                padding: 20px;
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
</style>