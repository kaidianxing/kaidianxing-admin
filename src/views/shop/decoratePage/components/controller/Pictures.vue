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
    <div class='pictures' v-if='currentModal.id=="pictures"&&lazyLoad'>
        <i-form :label-width="100" ref='pictures' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <form-item label="显示类型：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='showType' v-model='currentModal.params.showtype'></MyButtonGroup>
                </form-item>
                <form-item label="每行数量：">
                    <MyRadioGroup :items='rownum' v-model='currentModal.params.rownum'></MyRadioGroup>
                </form-item>
            </MyCollapse>

            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item :label-width="0">
                    <MyDragSortableItems class='drag-list' :list='currentModal.data' @end='dragEnd' @delItem='delItem'>
                        <template v-slot='{item}'>
                            <MyListNavigator :tip="currentModal.params.rownum==1?'建议图片尺寸：600x300，高度跟随第一张图片的高度变化':'建议图片尺寸：400x400，高度跟随第一张图片的高度变化'" label1='上标题：' label2='下标题：' type='image' :value='getParams(item)' @change-icon='changeImg(item,$event)' @change-link='changeLink(item,$event)' @get-input='(type,val)=>{getInput(item,type,val)}' :textLength="currentModal.params.rownum==3?7:(currentModal.params.rownum==4?5:10)"></MyListNavigator>
                        </template>
                    </MyDragSortableItems>
                    <i-button class='brand-color' style='width:100%;background:rgba(0,0,0,0)' v-if="currentModal.data.length<11" @click='addItem'>+添加({{currentModal.data.length}}/10)</i-button>
                </form-item>
            <Alert>注意：如果上标题、下标题为空则不显示</Alert>

            </MyCollapse>
            <MyCollapse  no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <form-item label="上标题对齐：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='align' v-model='currentModal.style.titlealign'></MyButtonGroup>
                </form-item>
                <form-item label="下标题对齐：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='align' v-model='currentModal.style.textalign'></MyButtonGroup>
                </form-item>
                <form-item label="上标题颜色：">
                    <MyColorPicker v-model='currentModal.style.titlecolor' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="下标题颜色：">
                    <MyColorPicker v-model='currentModal.style.textcolor' default='#565656'></MyColorPicker>
                </form-item>
                <form-item label="背景颜色：">
                    <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="上间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.paddingtop'></MyDraggableProgress>
                </form-item>
                <form-item label="下边距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.paddingbottom'></MyDraggableProgress>
                </form-item>
                <form-item label="左右边距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.paddingleft'></MyDraggableProgress>
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
    // 滚动图片的宽度
    const scrollImg = {
        1: 600,
        2: 308,
        3: 200,
        4: 152
    }
    export default {
        mixins: [mixin],
        name: 'pictures',
        data() {
            return {
                id:'pictures',
                align: [{
                    label: '居左',
                    icon: 'iconfont icon-duiqi-zuoduiqi',
                    id: "left"
                }, {
                    label: '居中',
                    icon: 'iconfont icon-duiqi-juzhongduiqi',
                    id: "center"
                }, {
                    label: '居右',
                    icon: 'iconfont icon-duiqi-youduiqi',
                    id: "right"
                }],
                rownum: [{
                    label: '1个',
                    id: '1'
                }, {
                    label: '2个',
                    id: '2'
                }, {
                    label: '3个',
                    id: '3'
                }, {
                    label: '4个',
                    id: '4'
                }],
                showType: [{
                    label: '普通',
                    icon: 'iconfont icon-zujian-shangpinzu-danlieshangpin',
                    id: '0'
                }, {
                    label: '左右滑动',
                    icon: 'iconfont icon-zujian-shangpinzu-huadong',
                    id: '1'
                }],
            }
        },
        watch: {
            getWatchParams: { 
                handler(){
                   this.getImgHeight()
                },
                immediate: true
            },
        },
        computed: {
            getDefaultImg(){
                return this.currentModal.params.rownum == 1?this.$utils.staticImg('decorate/banner.png'): this.$utils.staticImg('decorate/goods_col2.png')
            },
            getBoxWidth(){
                return this.currentModal.params.showtype == '0'?this.getNormalWidth: this.getScrollWidth
            },
            getNormalWidth(){
                let rownum = this.currentModal.params.rownum;
                return (750 -( rownum-1) * 2 * 8 - (this.currentModal.style.paddingleft * 2)) / rownum
            },
            getScrollWidth(){
                return scrollImg[this.currentModal.params.rownum]
            },
            getWatchParams(){
                return {
                    data: this.currentModal.data,
                    paddingleft: this.currentModal.style.paddingleft,
                    rownum: this.currentModal.params.rownum,
                    showtype: this.currentModal.params.showtype
                }
            }
        },
        methods: {
            getImgHeight(){
                let item = this.currentModal.data[0]
                let imgurl = item?.imgurl? this.$utils.media(item?.imgurl) :this.getDefaultImg;
                this.$utils.getImgSize(imgurl).then(img=> {
                    let imgheight = this.getBoxWidth * img.height  / img.width;
                    this.currentModal.params.imgheight = imgheight
                })
            },
            dragEnd(list) {
                this.currentModal.data = list;
            },
            delItem(item, index) {
                this.currentModal.data.splice(index, 1)
            },
            addItem() {
                this.currentModal.data.push({
                    title: '这是上标题',
                    text: '这是下标题',
                    imgurl:'',
                    linkurl: '',
                    linkurl_name: '',
                    wxappid: '',
                })
            },
            getParams(data) {
                return {
                    'title': data.title,
                    'icon': data.imgurl, //要显示的icon
                    'subTitle': data.text,
                    'linkurl': data.linkurl,
                    'linkurl_name': data.linkurl_name,
                    'wxappid': data.wxappid
                }
            },
            changeImg(item, val) {
                item.imgurl = val || '';
                this.getImgHeight()
            },
            changeLink(item, val) {
                item.wxappid = val.wxappid
                item.linkurl = val.url;
                item.linkurl_name = val.name
            },
            getInput(item, type, val) {
                if (type == 'left') {
                    item.title = val;
                } else {
                    item.text = val;
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';

   /deep/ .ivu-form-item .ivu-form-item .ivu-form-item-content {
       margin-left: 70px!important;
   }
</style>
