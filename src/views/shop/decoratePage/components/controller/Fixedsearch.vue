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
    <div class='fixedsearch' v-if='currentModal.id=="fixedsearch"&&lazyLoad'>
        <i-form :label-width="100" ref='fixedsearch' :model="currentModal" :rules="validator">
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <div>
                    <form-item label="搜索框：">
                        <div class="style-container">
                            <form-item label="提示文字：" class="search-input-item">
                                <Input placeholder="请输入提示文字" :maxlength="20" show-word-limit v-model='currentModal.params.placeholder' style="width: 100%" />
                            </form-item>
                            <form-item label="文字对齐：" :label-width="100" style="margin-bottom:30px;">
                                <MyButtonGroup :items='textAlign' v-model='currentModal.params.textalign'></MyButtonGroup>
                            </form-item>
                             <form-item label="背景颜色：">
                                <MyColorPicker v-model='currentModal.style.searchbackground' default='#f6f6f6'></MyColorPicker>
                            </form-item>
                            <form-item label="图标颜色：">
                                <MyColorPicker v-model='currentModal.style.searchiconcolor' default='#B6B6B6'></MyColorPicker>
                            </form-item>
                             <form-item label="文字颜色：">
                                <MyColorPicker v-model='currentModal.style.searchtextcolor' default='#c2c2c2'></MyColorPicker>
                            </form-item>
                             <form-item label="圆角："  :label-width="100">
                                <MyDraggableProgress v-model='currentModal.style.borderradius' :min='0' :max='50' unit='px'></MyDraggableProgress>
                            </form-item>

                        </div>
                    </form-item>
                </div>

                <form-item label="左侧图标：">
                    <MyRadioGroup :items='iconStyle' v-model='currentModal.params.leftnav'>
                        <MyAddImg tip='建议图片高度为100px，宽度不超过300px' :item='getLeft' v-if='currentModal.params.leftnav=="2"' @change-img='changeImg("left",$event)' @change-link='changeLink("leftimg",$event)'></MyAddImg>
                        <div v-if='currentModal.params.leftnav=="1"'>
                            <i-form :label-width='100'>
                                <div class='custom-form-item' style='margin-bottom:10px;'>
                                    <p class="label">图标：</p>
                                    <MyAddImgImg v-model='currentModal.params.leftnavicon' type='icon'></MyAddImgImg>
                                </div>
                                <form-item label="图标颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.leftnavcolor' default='#B6B6B6'></MyColorPicker>
                                </form-item>
                                <form-item label="链接：" style='margin-bottom:0;'>
                                    <MySelectLink :value='{
                                        name: currentModal.params.lefticonlink_name,
                                        url: currentModal.params.lefticonlink,
                                        wxappid: currentModal.params.lefticon_wxappid
                                    }' @change='changeLink("lefticon",$event)'></MySelectLink>
                                </form-item>
                            </i-form>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="右侧图标：">
                    <MyRadioGroup :items='rightIcon' v-model='currentModal.params.rightnav'>
                        <div v-if='currentModal.params.rightnav=="1"'>
                            <i-form :label-width='100'>
                                <div class='custom-form-item' style='margin-bottom:10px;'>
                                    <p class="label">图标：</p>
                                    <MyAddImgImg v-model='currentModal.params.rightnavicon' type='icon'></MyAddImgImg>
                                </div>
                                <form-item label="图标颜色：" style='margin-bottom:10px;'>
                                    <MyColorPicker v-model='currentModal.style.rightnavcolor' default='#B6B6B6'></MyColorPicker>
                                </form-item>
                                <!-- <form-item label="点击事件：" style='margin-bottom:10px;'>
                                            <MyRadioGroup :items='rightnavclick' v-model='currentModal.params.rightnavclick'></MyRadioGroup>
                                        </form-item> -->
                                <form-item label="链接：" style='margin-bottom:0;' v-if='currentModal.params.rightnavclick==0'>
                                    <MySelectLink :value='{
                                        name: currentModal.params.righticonlink_name,
                                        url: currentModal.params.righticonlink,
                                        wxappid: currentModal.params.righticon_wxappid
                                    }' @change='changeLink("righticon",$event)'></MySelectLink>
                                </form-item>
                            </i-form>
                        </div>
                    </MyRadioGroup>
                </form-item>
                  <form-item label="组件背景：">
                        <MyRadioGroup :items='bgstyle' v-model='currentModal.params.bgstyle'>
                            <form-item v-if="currentModal.params.bgstyle =='color'" label="背景颜色：" :label-width="100" class="mb-0">
                                <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                            </form-item>
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
        name: 'fixedsearch',
        computed: {
            getLeft() {
                return {
                    url: this.currentModal.params.imgurl_left,
                    link: this.currentModal.params.leftimglink,
                    link_name: this.currentModal.params.leftimglink_name,
                    wxappid: this.currentModal.params.leftimg_wxappid
                }
            },
            getRight() {
                return {
                    url: this.currentModal.params.imgurl_right,
                    link: this.currentModal.params.rightimglink,
                    wxappid: this.currentModal.params.rightimg_wxappid
                }
            }
        },
        data() {
            return {
                id:'fixedsearch',
                rightnavclick: [{
                    label: '跳转链接',
                    id: '0'
                }, {
                    label: '提交搜索',
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
                iconStyle: [{
                    label: '不显示',
                    id: '0'
                }, {
                    label: '图标',
                    id: '1'
                }, {
                    label: '图片',
                    id: '2'
                }],
                rightIcon: [{
                    label: '不显示',
                    id: '0'
                }, {
                    label: '图标',
                    id: '1'
                }],
                 bgstyle: [{
                    id: 'transparent',
                    label: '透明'
                },{
                    id: 'color',
                    label: '颜色'
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
            }
        },
        methods: {
            changeLink(type, val) {
                if (type == 'lefticon') {
                    this.currentModal.params.lefticonlink = val.url
                    this.currentModal.params.lefticonlink_name = val.name
                    this.currentModal.params.lefticon_wxappid = val.wxappid
                } else if (type == 'leftimg') {
                    this.currentModal.params.leftimglink = val.url
                    this.currentModal.params.leftimglink_name = val.name
                    this.currentModal.params.leftimg_wxappid = val.wxappid
                } else if (type == 'righticon') {
                    this.currentModal.params.righticonlink = val.url
                    this.currentModal.params.righticonlink_name = val.name
                    this.currentModal.params.righticon_wxappid = val.wxappid
                }
            },
            changeImg(type, val) {
                if (type == 'left') {
                    if(val) {
                        this.$utils.getImgSize(this.$utils.media(val)).then(res=>{
                            this.currentModal.params.leftwidth = 60 / res.height * res.width
                        })
                    } 
                    this.currentModal.params.imgurl_left = val
                } else if (type == 'right') {
                    this.currentModal.params.imgurl_right = val
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .fixedsearch {
        .label-box {
            display: flex;
            flex-wrap: nowrap;
            margin-top: 24px;
            .label {
                margin-right: 10px;
            }
        }
        /deep/ .select-good {
            .select-item {
                margin-bottom: 0;
            }
        }
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

        .mb-0 {
            margin-bottom: 0;
        }
    }
</style>