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
    <div class='poster-push-setting' v-if='currentModal.id=="poster_pushsetting"&&lazyLoad'>
        <i-form :label-width="100" ref='poster_pushsetting' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="推送方式：" style='margin-bottom:10px;'>
                    <MyRadioGroup :items='type' v-model='currentModal.params.type'>
                    </MyRadioGroup>
                </form-item>
                <form-item label="推送封面：" style='margin-bottom:10px;' prop='thumb' required v-if='currentModal.params.type==1'>
                    <MyAddImgImg size='large' v-model='currentModal.params.thumb'></MyAddImgImg>
                    <Alert style='margin-top:10px;'>建议图片比例为2.35:1</Alert>
                </form-item>
                <form-item label="推送标题：" required prop='title'>
                    <Input placeholder="请输入标题" v-model='currentModal.params.title' style="width: 400px;"></Input>
                </form-item>
                <form-item label="推送描述：" required prop='content'>
                    <Input placeholder="请输入推送描述" type='textarea' v-model='currentModal.params.content' style="width: 400px;"></Input>
                </form-item>
                <form-item label="推送链接：" required prop='linkurl' v-if="currentModal.params.type==1">
                    <MySelectLink :value='{name:currentModal.params.linkurl_name||currentModal.params.linkurl,url:currentModal.params.linkurl}' @change='changeLink'></MySelectLink>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'poster_pushsetting',
        data() {
            return {
                id:'poster_pushsetting',
                type: [{
                    label: '图文推送',
                    id: 1
                }, {
                    label: '文字推送',
                    id: 2
                }],
                bordershow: [{
                    label: '开启',
                    id: 1
                }, {
                    label: '关闭',
                    id: 0
                }],
                imgscaletype: [{
                    label: '等比缩放',
                    id: 0
                }, {
                    label: '自定义宽高',
                    id: 1
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
                    icon: 'iconfont icon-duiqi-zuoduiqi',
                    id: "top"
                }, {
                    label: '垂直居中',
                    icon: 'iconfont icon-duiqi-juzhongduiqi',
                    id: "middle"
                }, {
                    label: '底对齐',
                    icon: 'iconfont icon-duiqi-youduiqi',
                    id: "bottom"
                }],
            }
        },
        methods: {
            changeLink(val) {
                this.currentModal.params.linkurl = val.url;
                this.currentModal.params.linkurl_name = val.name;
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>
