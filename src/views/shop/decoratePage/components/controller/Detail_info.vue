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
    <div class="detail_info" v-if='currentModal.id=="detail_info"&&lazyLoad'>
        <i-form :label-width="120" ref='detail_info' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot="label">内容样式</p>
                <form-item label="标题颜色：">
                    <MyColorPicker v-model="currentModal.style.titlecolor" default="#212121"></MyColorPicker>
                </form-item>
                <form-item label="副标题颜色：">
                    <MyColorPicker v-model="currentModal.style.subtitlecolor" default="#565656">></MyColorPicker>
                </form-item>
                <form-item label="价格颜色：">
                    <MyColorPicker v-model="currentModal.style.pricecolor" default="#ff3c29">></MyColorPicker>
                </form-item>
                <form-item label="划价线颜色：">
                    <MyColorPicker v-model="currentModal.style.linepriceColor" default="#969696">></MyColorPicker>
                </form-item>
                <form-item label="运费颜色：">
                    <MyColorPicker v-model="currentModal.style.expresscolor" default="#565656">></MyColorPicker>
                </form-item>
                <form-item label="销量颜色：">
                    <MyColorPicker v-model="currentModal.style.sellcolor" default="#565656">></MyColorPicker>
                </form-item>
                <form-item label="库存颜色：">
                    <MyColorPicker v-model="currentModal.style.stockcolor" default="#565656">></MyColorPicker>
                </form-item>

                <!-- <form-item label="副色调颜色：">
                    <MyColorPicker v-model='currentModal.style.textcolor' default='#969696'>></MyColorPicker>
                </form-item>
                <form-item label="限时购颜色：">
                    <MyColorPicker v-model='currentModal.style.timecolor' default='#969696'>></MyColorPicker>
                </form-item>
                <form-item label="倒计时颜色：">
                    <MyColorPicker v-model='currentModal.style.timetextcolor' default='#969696'>></MyColorPicker>
                </form-item>-->
                <form-item label="背景颜色：">
                    <MyColorPicker v-model="currentModal.style.background" default="#ffffff">></MyColorPicker>
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
            <MyCollapse no-border>
                <p class="form-title" slot="label">内容</p>
                <form-item label="分享按钮：" class="share comsission-input">
                    <MyRadioGroup :items="hideshare" v-model="currentModal.params.hideshare">
                        <MyListNavigator
                            nolink
                            onelabel
                            type="icon"
                            label2="按钮文字："
                            :label-width="80"
                            :value="getParams"
                            :draggabled="false"
                            @change-icon="changeIcon"
                            @get-input="getInput"
                            v-if="currentModal.params.hideshare==1"
                        ></MyListNavigator>
                    </MyRadioGroup>
                </form-item>
                <form-item label="预计佣金：" class="share">
                    <MyRadioGroup :items="comsission" v-model="currentModal.params.hidecomsission">
                        <template v-if="currentModal.params.hidecomsission == 1">
                            <form-item
                                    class="comsission-input"
                                    :label-width="100"
                                    label="显示文字："
                            >
                                <Input v-model="currentModal.params.comsissiontitle" placeholder="显示文字" maxlength="5"></Input>
                            </form-item>
                            <form-item label="佣金背景色：" :label-width="100" class="comsission-input">
                                <MyColorPicker v-model="currentModal.style.commissionBackground" default="#FF5555">></MyColorPicker>
                            </form-item>
                            <form-item label="佣金颜色：" :label-width="100" class="comsission-input">
                                <MyColorPicker v-model="currentModal.style.commissionColor" default="#FFFFFF">></MyColorPicker>
                            </form-item>
                        </template>
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
    name: 'detail_info',
    data() {
        return {
            id:'detail_info',
            hideshare: [
                {
                    label: '显示',
                    id: '1'
                },
                {
                    label: '隐藏',
                    id: '0'
                }
            ],
            comsission: [
                {
                    label: '显示',
                    id: '1'
                },
                {
                    label: '隐藏',
                    id: '0'
                }
            ]
        }
    },
    computed: {
        getParams() {
            return {
                title: '',
                icon: this.currentModal.params.share_icon, //要显示的icon
                subTitle: this.currentModal.params.share,
                linkurl: this.currentModal.params.share_link,
                linkurl_name: this.currentModal.params.linkurl_name
            }
        }
    },
    methods: {
        changeIcon(val) {
            this.currentModal.params.share_icon = val
        },
        getInput(val) {
            this.currentModal.params.share = val
        }
    }
}
</script>

<style lang="scss" scoped>
@import './common.scss';
.detail_info {
    /deep/ .right-input {
        width: 277px;
    }


    .comsission-input {
        margin-bottom: 20px;
       /deep/ .ivu-form-item-content {
           margin-left: 100px !important;
       }

       /deep/ .ivu-form-item-label {
           padding-right: 0;
       }
    }
}
</style>
