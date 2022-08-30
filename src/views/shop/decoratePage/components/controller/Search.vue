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
    <div class='search' v-if='currentModal.id=="search"&&lazyLoad'>
        <i-form :label-width="110" ref='search' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <div>
                    <form-item label="搜索框：">
                        <div class="style-container">
                            <form-item label="提示文字：" :label-width="100" class="search-input-item">
                                <Input placeholder="请输入提示文字" show-word-limit v-model='currentModal.params.placeholder' :maxlength="20" />
                            </form-item>
                            <form-item label="文字对齐：" :label-width="100" style="margin-bottom:30px;">
                                <MyButtonGroup :items='textAlign' v-model='currentModal.style.textalign'></MyButtonGroup>
                            </form-item>
                             <form-item label="背景颜色：" :label-width="100">
                                <MyColorPicker v-model='currentModal.style.inputbackground' default='#ffffff'></MyColorPicker>
                            </form-item>
                            <form-item label="图标颜色：" :label-width="100">
                                <MyColorPicker v-model='currentModal.style.iconcolor' default='#b6b6b6'></MyColorPicker>
                            </form-item>
                            <form-item label="文字颜色：" :label-width="100">
                                <MyColorPicker v-model='currentModal.style.color' default='#c2c2c2'></MyColorPicker>
                            </form-item>
                           <form-item label="圆角："  :label-width="100">
                                <MyDraggableProgress v-model='currentModal.style.borderradius' :min='0' :max='50' unit='px'></MyDraggableProgress>
                            </form-item>
                        </div>
                    </form-item>
                    <form-item label="组件背景：">
                        <MyRadioGroup :items='bgstyle' v-model='currentModal.params.bgstyle'>
                            <form-item v-if="currentModal.params.bgstyle =='color'" label="背景颜色：" :label-width="100" class="mb-0">
                                <MyColorPicker v-model='currentModal.style.bgcolor' default='#ff3c29'></MyColorPicker>
                            </form-item>
                        </MyRadioGroup>
                    </form-item>
                  
                    <form-item label="上间距：">
                        <MyDraggableProgress v-model='currentModal.style.paddingtop' :min='0' :max='50' unit='px'></MyDraggableProgress>
                    </form-item>
                    <form-item label="下边距：">
                        <MyDraggableProgress v-model='currentModal.style.paddingbottom' :min='0' :max='50' unit='px'></MyDraggableProgress>
                    </form-item>
                    <form-item label="左右间距：">
                        <MyDraggableProgress v-model='currentModal.style.paddingleft' :min='0' :max='50' unit='px'></MyDraggableProgress>
                    </form-item>
                </div>
            </MyCollapse>
<!--            <MyCollapse no-border>-->
<!--                <p class="form-title" slot='label'>-->
<!--                    图标样式-->
<!--                </p>-->
<!--                <form-item label="右侧图标：">-->
<!--                    <MyRadioGroup :items='rightIcon' v-model='currentModal.params.rightnav'>-->
<!--                        <div v-if='currentModal.params.rightnav=="1"'>-->
<!--                            <i-form :label-width='100'>-->
<!--                                <div class='custom-form-item' style='margin-bottom:10px;'>-->
<!--                                    <p class="label">图标：</p>-->
<!--                                    <MyAddImgImg v-model='currentModal.params.rightnavicon' type='icon'></MyAddImgImg>-->
<!--                                </div>-->
<!--                                <form-item label="图标颜色：" style='margin-bottom:10px;'>-->
<!--                                    <MyColorPicker v-model='currentModal.style.rightnavcolor' default='#212121'></MyColorPicker>-->
<!--                                </form-item>-->
<!--                                &lt;!&ndash; <form-item label="点击事件：" style='margin-bottom:10px;'>-->
<!--                                            <MyRadioGroup :items='rightnavclick' v-model='currentModal.params.rightnavclick'></MyRadioGroup>-->
<!--                                        </form-item> &ndash;&gt;-->
<!--                                <form-item label="链接：" style='margin-bottom:0;' v-if='currentModal.params.rightnavclick==0'>-->
<!--                                    <MySelectLink :value='{-->
<!--                                        name: currentModal.params.righticonlink_name,-->
<!--                                        url: currentModal.params.righticonlink-->
<!--                                    }' @change='changeLink("righticon",$event)'></MySelectLink>-->
<!--                                </form-item>-->
<!--                            </i-form>-->
<!--                        </div>-->
<!--                    </MyRadioGroup>-->
<!--                </form-item>-->
<!--            </MyCollapse>-->
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'search',
        data() {
            return {
                id:'search',
                searchTypes: [{
                    label: '商城商品',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    id: '0'
                }, {
                    label: '积分商城商品',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    id: '1'
                }],
                searchStyles: [{
                    label: '直角',
                    icon: 'iconfont icon-zujian-sousuo-zhijiao',
                    id: 'radius'
                }, {
                    label: '圆角',
                    icon: 'iconfont icon-zujian-sousuo-yuanjiao',
                    id: 'round'
                }],
                textAlign: [{
                    label: '居左',
                    icon: 'iconfont icon-duiqi-zuoduiqi',
                    id: 'left'
                }, {
                    label: '居中',
                    icon: 'iconfont icon-duiqi-juzhongduiqi',
                    id: 'center'
                }],
                bgstyle: [{
                    id: '',
                    label: '透明'
                },{
                    id: 'color',
                    label: '颜色'
                }],
                showstyle: [{
                    id: '0',
                    label: '不显示'
                },{
                    id: '1',
                    label: '当前定位'
                },{
                    id: '2',
                    label: '城市定位'
                }],
                locationicon: [{
                    id: '0',
                    label: '不显示'
                },{
                    id: '1',
                    label: '显示'
                }]
                // iconStyle: [{
                //     label: '不显示',
                //     id: '0'
                // }, {
                //     label: '图标',
                //     id: '1'
                // }, {
                //     label: '图片',
                //     id: '2'
                // }],
                // rightIcon: [{
                //     label: '不显示',
                //     id: '0'
                // }, {
                //     label: '图标',
                //     id: '1'
                // }]
            }
        },
        // methods: {
        //     changeLink(type, val) {
        //         if (type == 'lefticon') {
        //             this.currentModal.params.lefticonlink = val.url
        //             this.currentModal.params.lefticonlink_name = val.name
        //         } else if (type == 'leftimg') {
        //             this.currentModal.params.leftimglink = val.url
        //             this.currentModal.params.leftimglink_name = val.name
        //         } else if (type == 'righticon') {
        //             this.currentModal.params.righticonlink = val.url
        //             this.currentModal.params.righticonlink_name = val.name
        //         }
        //     },
        // }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    /deep/ .collapse.ivu-collapse:nth-child(2) {
        border-top: 1px solid #e9edef;
    }
    .form-title.marginT-30 {
        margin-top: 30px
    }
    .style-container {
        border: 1px solid #E9EDEF;
        box-sizing: border-box;
        padding: 20px 10px 0 0;
        border-radius: 2px;
        background: #F4F6F8;

        /deep/ .ivu-form-item {
            margin-bottom: 20px;
        }

        .search-input-item {
            /deep/ .ivu-form-item-content {
                margin-left: 100px!important;
            }
        }
    }
    /deep/ .collapse.ivu-collapse.ivu-collapse-simple:nth-child(2) {
        border-top: 1px solid #e8eaec;
    }

    .mb-0 {
        margin-bottom: 0;
    }
</style>
