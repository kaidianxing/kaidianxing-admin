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
    <div class='followbar' v-if='currentModal.id=="followbar"&&lazyLoad'>
        <i-form :label-width="100" ref='followbar' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <form-item label="头像形状：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='iconstyle' v-model='currentModal.params.iconstyle'></MyButtonGroup>
                </form-item>
                 <form-item label="显示类型：" style='margin-bottom:40px;'>
                    <MyRadioGroup :items='showtypes' v-model='currentModal.params.showtype'></MyRadioGroup>
                    <kdx-hint-text v-if="currentModal.params.showtype == '1'">用户关注后自动隐藏，小程序、H5渠道用户需要在公众号渠道绑定过微信/手机账号，否则无法判断账号的关注状态</kdx-hint-text>
                    <kdx-hint-text v-if="currentModal.params.showtype == '2'">用户在登录状态下关闭关注条后，关注条隐藏7天</kdx-hint-text>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="文字颜色：">
                    <MyColorPicker v-model='currentModal.style.textcolor' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="关闭按钮：">
                    <MyColorPicker v-model='currentModal.style.highlight' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="背景颜色：">
                    <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <div>
                    <form-item label="图片设置：" style='margin-bottom:25px;'>
                        <MyRadioGroup :items='icontype' v-model='currentModal.params.icontype' @change="iconChange">
                            <kdx-hint-text slot="tip" v-if='currentModal.params.icontype==3'>提示：图标请选择正方形</kdx-hint-text>
                            <div style='display:flex;' v-if='currentModal.params.icontype==3'>
                                <p class="label" style="margin-right:15px;color:#262B30;width:70px;text-align:right;">图片：</p>
                                <MyAddImgImg size='mini' type='image' :value='currentModal.params.imgurl_icon' @change='changeImg'></MyAddImgImg>
                            </div>
                        </MyRadioGroup>
                        <p class="tip" v-if='currentModal.params.icontype==1'>提示：如果分享人为空则使用商城logo</p>
                    </form-item>
                    <!-- <form-item label="默认文字：" style='margin-bottom:25px;'>
                        <Input v-model="currentModal.params.defaulttext" placeholder="例：欢迎访问[商城名称]，点击关注我们哦~" />
                        <p class="tip">无分享人时显示，可用变量[商城名称]</p>
                    </form-item> -->
                    <form-item label="分享文字：" style='margin-bottom:25px;'>
                        <Input v-model="currentModal.params.sharetext" placeholder="例：欢迎访问商城，点击关注我们哦~" />
                        <!-- <p class="tip">提示：如果分享人为空则使用商城名称</p> -->
                    </form-item>
                    <form-item label="按钮设置：">
                        <div class="bg-color" style='padding:10px 0;'>
                            <div style='display:flex;margin-bottom:10px;margin-top:10px;'>
                                <p class="label" style="margin-right:10px;color:#262B30;width:90px;text-align:right;">按钮图标：</p>
                                <MyAddImgImg v-model='currentModal.params.btnicon' type='icon'></MyAddImgImg>
                            </div>
                            <div style='display:flex;margin-bottom:10px;padding-right:64px;color:rgb(38, 43, 48);'>
                                <p class="label" style="margin-right:10px;width:130px;text-align:right;">按钮文字：</p>
                                <Input v-model='currentModal.params.btntext'></Input>
                            </div>
                            <form-item label="文字颜色：" style='margin-bottom:10px;'>
                                <MyColorPicker v-model='currentModal.style.btncolor' default='#ffffff'></MyColorPicker>
                            </form-item>
                            <form-item label="背景颜色：" style='margin-bottom:10px;'>
                                <MyColorPicker v-model='currentModal.style.btnbgcolor' default='#ff3c29'></MyColorPicker>
                            </form-item>
                        </div>
                    </form-item>
                    <form-item label="按钮事件：">
                        <MyRadioGroup :items='btnclick' v-model='currentModal.params.btnclick'>
                            <div v-if='currentModal.params.btnclick=="0"' style="margin-top:10px;">
                                <div style='display:flex;'>
                                    <p class="label" style="margin-right:10px;width:85px;">点击链接：</p>
                                    <MySelectLink :value='{
                                        url:currentModal.params.linkurl,
                                        name: currentModal.params.linkurl_name,
                                        wxappid: currentModal.params.wxappid
                                    }' @change='changeLink' style='flex:1;margin-right:10px;'></MySelectLink>
                                </div>
                            </div>
                            <div v-else style="margin-top:10px;">
                                <div style='display:flex;margin-bottom:10px;'>
                                    <p class="label" style="margin-right:10px;width:100px;">二维码图片：</p>
                                     <MyAddImgImg size='mini' type='image' :value='currentModal.params.qrcodeurl' @change='changeQr'></MyAddImgImg>
                                </div>
                            </div>
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
        name: 'followbar',
        data() {
            return {
                id:'followbar',
                btnclick: [{
                    label: '跳转链接',
                    id: '0'
                }, {
                    label: '弹出二维码',
                    id: '1'
                }],
                showtypes: [{id: '0',label:'始终显示'},{id: '1',label:'关注后隐藏'},{id:'2',label:'用户关闭后隐藏7天'}],
                btnlinktype: [{
                    label: '读取系统设置',
                    id: '0'
                }, {
                    label: '自定义',
                    id: '1'
                }],
                iconstyle: [{
                    label: '圆角',
                    icon: 'iconfont icon-zujian-huiyuanxinxi-yuanjiao',
                   
                    
                    id: 'radius'
                }, {
                    label: '圆形',
                    icon: 'iconfont icon-zujian-huiyuanxinxi-yuanxing',
                   
                    
                    id: 'circle'
                }],
                icontype: [
                //     {
                //     label: '分享人头像',
                //     id: '1'
                // }, 
                {
                    label: '商城logo',
                    id: '2'
                }, 
                {
                    label: '自定义',
                    id: '3'
                }],
                logo:''
            }
        },
        created(){
            if(this.currentModal.params.icontype =='2') {
                this.getSetting()
            }
        },
        methods: {
            changeImg(val) {
                this.currentModal.params.imgurl_icon = val;
            },
            changeLink(val) {
                this.currentModal.params.linkurl = val.url;
                this.currentModal.params.linkurl_name = val.name;
                this.currentModal.params.wxappid = val.wxappid
            },
            changeQr(val){
                 this.currentModal.params.qrcodeurl = val;
            },
            iconChange(e){
                if(e=='2') {
                    this.getSetting()
                }
            },
            getSetting(){
                if(this.logo) {
                    this.currentModal.params.imgurl_logo = this.logo
                    return
                }
                this.$api.settingApi.getBaseSetting().then(res=>{
                    if(res.error ===0) {
                        this.currentModal.params.imgurl_logo = res.logo
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .page-link {
        color:$brand-color;
    }

    .tip-text {
        line-height:16px;
        margin-bottom: 10px;
    }
</style>