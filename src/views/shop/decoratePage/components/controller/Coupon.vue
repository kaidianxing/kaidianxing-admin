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
    <div class='coupon' v-if='currentModal.id=="coupon"&&lazyLoad'>
        <i-form :label-width="100" ref='coupon' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    组件样式
                </p>
                <form-item label="优惠券样式：" class="coupon-item">
                    <MyButtonGroup :items='couponstyle' v-model='currentModal.params.couponstyle'></MyButtonGroup>
                </form-item>
                <form-item label="显示类型：">
                    <MyButtonGroup :items='num_row' v-model='currentModal.params.num_row'></MyButtonGroup>
                </form-item>
                <form-item label="优惠券颜色：" v-if='currentModal.params.couponstyle>2'>
                    <ColorPicker :items='couponcolor' v-model="currentModal.params.couponcolor"></ColorPicker>
                </form-item>
            </MyCollapse>
            
            <MyCollapse>
                <p class="form-title" slot='label'>
                    内容
                </p>
                <form-item :label-width='0'>
                     <MyDragSortableItems class='drag-list' allowAllDel :list='currentModal.data' @end='dragEnd' @delItem='delItem'>
                        <template v-slot='{item}'>
                        <div class='bg-color'>
                            <i class="iconfont icon-move move-icon"></i>
                            <p class="coupon-img">
                                <img :src="$utils.staticImg('coupon/coupon2.png')" alt="" v-if='item.coupon_sale_type==2'>
                                <img :src="$utils.staticImg('coupon/coupon1.png')" alt="" v-else>
                            </p>
                            <div class="body">
                                <p class="name">{{item.name}}</p>
                                <p class="demon">使用条件：{{item.desc}}</p>
                            </div>
                        </div>
                     </template>
                    </MyDragSortableItems> 
                    <i-button class='brand-color' style='width:100%;background:rgba(0,0,0,0)' @click='addItem'>+添加优惠券</i-button>
                </form-item>
            </MyCollapse>
            <MyCollapse  no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                <!-- <form-item label="背景颜色：">
                    <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                </form-item> -->
                <form-item label="上间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.margintop'></MyDraggableProgress>
                </form-item>
                <form-item label="下间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                </form-item>
                <form-item label="左右间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginleft'></MyDraggableProgress>
                </form-item>
                <form-item label="上下间距：" v-if='currentModal.params.num_row<4'>
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbetween'></MyDraggableProgress>
                </form-item>
                 <form-item label="上边角：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.topradius'
                    ></MyDraggableProgress>
                </form-item>
                <form-item label="下边角：">
                    <MyDraggableProgress
                        :min='0'
                        :max='50'
                        unit='px'
                        v-model='currentModal.style.bottomradius'
                    ></MyDraggableProgress>
                </form-item>
            </MyCollapse>
        </i-form>
        <coupon-selector :value='showSelector' :current-list="[]"  multiple  @on-change='getCoupons' @on-cancel='cancel'></coupon-selector>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import CouponSelector from '@/components/selector/CouponSelector'
    import ColorPicker from './Coupon/ColorPicker'
    export default {
        components: {
            CouponSelector, 
            ColorPicker
        },
        mixins: [mixin],
        name: 'coupon',
        data() {
            return {
                id:'coupon',
                showSelector: false,
                couponstyle: [{
                    label: '样式1',
                    icon: 'iconfont icon-zujian-youhuiquan3',
                    id: '3'
                }, {
                    label: '样式2',
                    icon: 'iconfont icon-zujian-youhuiquan4',
                    id: '4'
                },{
                    label: '样式3',
                    icon: 'iconfont icon-zujian-youhuiquan1',
                    id: '1'
                }, {
                    label: '样式4',
                    icon: 'iconfont icon-zujian-youhuiquan',
                    id: '2'
                }],
                num_row: [{
                    label: '单列',
                    icon: 'iconfont icon-zujian-shangpinzu-danlieshangpin',
                    id: '1'
                },{
                    label: '双列',
                    icon: 'iconfont icon-zujian-shangpinzu-lieshangpin',
                    id: '2'
                }, {
                    label: '三列',
                    icon: 'iconfont icon-zujian-shangpinzu-lieshangpin1',
                    id: '3'
                }, {
                    label: '滑动',
                    icon: 'iconfont icon-zujian-shangpinzu-huadong',
                    id: '4'
                }],
                couponcolor:[{
                    color:'#FF3C29', 
                    name:'红色',
                    id:'red',
                    activeArrowColor:'#fff'
                },{
                    color:'#367BF5', 
                    name:'蓝色',
                    id:'blue',
                    activeArrowColor:'#fff'
                },{
                    color:'#09C15F', 
                    name:'绿色',
                    id:'green',
                    activeArrowColor:'#fff'
                },{
                    color:'#FF6F29', 
                    name:'橙色',
                    id:'orange',
                    activeArrowColor:'#fff'
                },{
                    color:'#212121', 
                    name:'黑色',
                    id:'black',
                    activeArrowColor:'#fff'
                },]
            }
        },
        watch: {
            currentModal:{
                immediate: true,
                handler() {
                    if(this.currentModal.id=="coupon"&&this.lazyLoad){
                        if(this.currentModal.params.couponcolor===undefined){
                            this.$set(this.currentModal.params,'couponcolor','red')
                        }
                        if(this.currentModal.style.marginbetween===undefined){
                            this.$set(this.currentModal.style,'marginbetween','16')
                        }
                    }
                }
            }
        },
        methods: {
            cancel(){
                this.showSelector = false;
            },
            getCoupons(list) {
                list.forEach(val=>{
                    this.currentModal.data.push({
                        name: val.coupon_name,
                        desc: val.content,
                        price: val.discount_price,
                        couponid: val.id,
                        id: val.id,
                        background: '#fd5454',
                        bordercolor: '#fd5454',
                        textcolor: '#ffffff',
                        couponcolor: '#55b5ff',
                        coupon_sale_type: val.coupon_sale_type,
                        enough: val.enough,
                        pick_type: val.pick_type,
                    })
                })
                if(this.currentModal.data.length){
                    this.checkError(null);
                }
                this.refreshCurrentModal();
                this.showSelector = false;
                this.$nextTick(() => {
                    this.$parent.$el.lastChild.scrollTop =this.$parent.$el.lastChild.scrollHeight 
                })
            },
            delItem(item) {
                for (let k in this.currentModal.data) {
                    if (this.currentModal.data[k] === item) {
                        this.currentModal.data.splice(k, 1);
                        break;
                    }
                }
            },
            dragEnd(list) {
                this.currentModal.data = list;
            },
            addItem() {
                this.showSelector = true;
            },
            getParams(data) {
                return {
                    'title': data.text,
                    'icon': data.iconclass, //要显示的icon 
                    'subTitle': data.remark,
                    'linkurl': data.linkurl,
                }
            },
            addImg(index, val) {
                this.currentModal.data[index].iconclass = val || '';
                this.refreshCurrentModal();
            },
            delImg(index) {
                this.currentModal.data[index].icon = '';
                this.refreshCurrentModal();
            },
            changeLink(index, val) {
                this.currentModal.data[index].linkurl = val;
            },
            selectLink(index) {
                console.log('selectLink', index)
            },
            getInput(index, type, val) {
                if (type == 'left') {
                    this.currentModal.data[index].text = val;
                } else {
                    this.currentModal.data[index].remark = val;
                }
                this.refreshCurrentModal();
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .bg-color {
        // padding: 10px;
        // margin-bottom: 10px;
        // border: 1px solid #E9EDEF;
        position: relative;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;

        .move-icon {
            margin-right: 10px;
            color: #b8b9bd;
            font-size: 24px;
        } 

        .close {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 18px;
            top: -6px;
            right: -9px;
            color: rgba(0, 0, 0, 0.3);
            display: none;
        }
        &:hover {
            .close {
                display: inline;
                cursor: pointer;
            }
        }
        .coupon-img {
            width: 70px;
            height: 30px;
            border-radius: 2px 0px 0px 2px;
            margin-right: 18px;
            flex-shrink: 0;
            text-align: center;
            line-height: 30px;
            color: #fff;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            position: relative;
            overflow: hidden;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }


    .coupon-item {
        margin-bottom: 48px;
    }
</style>