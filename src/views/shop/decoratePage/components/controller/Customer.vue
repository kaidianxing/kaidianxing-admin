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
    <div class='customer' v-if='currentModal.id=="customer"&&lazyLoad'>
        <i-form :label-width="110" ref='customer' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>全局组件</p>
                <form-item label="显示类型：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='showType' v-model='currentModal.style.showType' @change="changShowType"></MyButtonGroup>
                </form-item>
                <form-item label="显示样式：" v-if="currentModal.style.showType === '0'" style='margin-bottom:48px;'>
                    <MyButtonGroup :items='styleType' v-model='currentModal.style.styleType' @change="changType"></MyButtonGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>添加客服</p>
                <form-item label="选择客服：">
                    <MyRadioGroup v-if="customerList.length" :items='customerList' v-model="currentModal.params.customer" key="index" @change="chooseCustomer">
                         <div v-if='currentModal.params.customer=="wechat"'>
                            <WxCustomerService  :currentUrl="currentModal.params" @on-change="selectCustomerLink"></WxCustomerService>
                        </div>
                    </MyRadioGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>内容样式</p>
                <form-item label="客服内容：" v-if="currentModal.style.showType === '0'">
                    <MyRadioGroup :items='customerType' v-model='currentModal.params.customerType'>
                        <div v-if='currentModal.params.customerType=="0"'>
                            <div style='display:flex;margin-bottom:10px;'>
                                <p class="label" style="margin-right:10px;text-align:right;width:100px;color:#262B30">图标：</p>
                                <MyAddImgImg v-model='currentModal.params.iconclass' type='icon'></MyAddImgImg>
                            </div>
                            <form-item label="图标颜色：" style='margin-bottom:0;'>
                                <MyColorPicker v-model='currentModal.style.iconcolor' :default='iconColorDef'></MyColorPicker>
                            </form-item>
                        </div>
                        <div style='display:flex;margin-bottom:10px;' v-else>
                            <p class="label" style="margin-right:15px;text-align:right;width:90px;color:#262B30">图片：</p>
                            <MyAddImgImg size='mini' type='image' :value='currentModal.params.imgurl' @change='changeImg'></MyAddImgImg>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="图片：" v-if="currentModal.style.showType === '1'">
                    <MyAddImgImg size='mini' v-model='currentModal.params.img'></MyAddImgImg>
                    <p class='tip'>建议图片尺寸为比例1:1的正方形。</p>
                </form-item>
                <form-item label="显示文字：" v-if="currentModal.style.showType === '0'">
                    <Input placeholder="如：咨询客服" v-model='currentModal.params.titlename' :maxlength="4" show-word-limit style="width: 236px"></Input>
                </form-item>
                <form-item label="文字颜色：" v-if="currentModal.style.showType === '0'">
                    <MyColorPicker v-model='currentModal.style.titlecolor' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="背景颜色：" v-if="currentModal.style.showType === '0'">
                    <MyColorPicker v-model='currentModal.style.bgcolor' :default='bgColorDef'></MyColorPicker>
                </form-item>
                <form-item label="边框颜色：" v-if="currentModal.style.showType === '0'&&currentModal.style.styleType==='one'">
                    <MyColorPicker v-model='currentModal.style.bordercolor' default='#0267ff'></MyColorPicker>
                </form-item>
                <form-item label="背景透明度：" v-if="currentModal.style.showType === '0'&&currentModal.style.styleType!=='one'" style='margin-bottom:10px;'>
                    <MyDraggableProgress v-model='currentModal.opacity' :min='0' :max='1' :ratio='100' unit='%' style='margin-right:100px;'></MyDraggableProgress>
                </form-item>
                <form-item label="按钮宽度：">
                    <MyDraggableProgress :min='widthMin' :max='widthMax' unit='px' v-model='currentModal.style.width' style='margin-right:100px;'></MyDraggableProgress>
                </form-item>
                <form-item label="按钮位置：">
                    <MyRadioGroup :items='position' v-model='currentModal.position' @change='changePosition'>
                        <form-item label="上下偏移：" style='margin-bottom:10px;'>
                            <MyDraggableProgress :min='0' :max='450' unit='px' v-model='currentModal.style.offset_up_down'></MyDraggableProgress>
                        </form-item>
                        <form-item label="左右偏移：" style='margin-bottom:0;' v-if="currentModal.style.styleType!=='three'">
                            <MyDraggableProgress :min='0' :max='150' unit='px' v-model='currentModal.style.offset_left_right'></MyDraggableProgress>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    import {scrollTo} from '@/store/decorate/utils.js'
    import {mapActions} from "vuex";

    const SERVICEMAP = {
        'renxinyun': 'rr',
        'wx_service': 'wx',
        'customer_service': 'tx',
        'wechat_customer_service': 'wechat'
    };

    export default {
        mixins: [mixin],
        name: "Customer",
        props: {},
        components: {
            WxCustomerService: () => import ("./WxCustomerServices.vue"),
        },
        data() {
            return {
                customerType: [
                    {
                        label: '图标',
                        id: '0'
                    }, {
                        label: '图片',
                        id: '1'
                    }
                ],
                position: [{
                    label: '左上',
                    id: 'left top',
                }, {
                    label: '右上',
                    id: 'right top',
                }, {
                    label: '左下',
                    id: 'left bottom',
                }, {
                    label: '右下',
                    id: 'right bottom',
                }],
                customer_service: null,
                customerList: [],
                customerChannelList: [
                    {
                        label: "原生客服",
                        id: "0"
                    },
                ]
            }
        },
        computed: {
            styleType() {
                return [{
                    label: '样式一',
                    icon: 'iconfont icon-kefuyangshiyi',
                    id: 'one'
                }, {
                    label: '样式二',
                    icon: 'iconfont icon-kefuyangshier',
                    id: 'two'
                }, {
                    label: '样式三',
                    icon: 'iconfont icon-kefuyangshisan',
                    id: 'three',
                }];
            },
            showType() {
                return [{
                    label: '图文',
                    icon: 'iconfont icon-zujian-tubiaowenzi',
                    id: '0'
                }, {
                    label: '图',
                    icon: 'iconfont icon-zujian-tupian',
                    id: '1'
                }]
            },
            widthMin() {
                return this.currentModal.style.styleType === 'three'?30:this.currentModal.style.styleType === 'two'?100:90
            },
            widthMax() {
                return this.currentModal.style.styleType === 'three'?100:this.currentModal.style.styleType === 'two'?300:200
            },
            iconColorDef() {
                return this.currentModal.style.styleType === 'one'?'#0267FF':'#ffffff'
            },
            bgColorDef() {
                return this.currentModal.style.styleType === 'one'?'#0267FF':'#000000'
            }
        },
        watch: {},
        created() {
            this.getCustomerLink()
        },
        mounted() {
        },
        methods: {
            ...mapActions('decorate', ['scrollTo']),
            getCustomerLink() {
                this.$api.shopApi.getLinkList().then(res => {
                    if (res.error === 0) {
                      if (res.service?.renxinyun) {
                            res.service.renxinyun = res.service?.renxinyun?.[0]?.links?.[0];
                        }
                        this.customerList = [];

                        for (let key in res.service) {
                            this.customerList.push({
                                id: SERVICEMAP[key],
                                label: res.service[key].name
                            })
                        }
                        this.customer_service = res?.service?.customer_service?.url || null;
                    }
                });
            },
            changShowType() {
                this.currentModal.style.styleType = 'one'
                this.currentModal.style.width='104'
            },
            changType(type) {
                if (type === 'one') {
                    this.currentModal.style.iconcolor='#0267FF';
                    this.currentModal.style.bgcolor='#0267FF';
                    this.currentModal.style.offset_left_right='24';
                    this.currentModal.style.width='104'
                } else {
                    if (type === 'three') {
                        this.currentModal.style.width='54'
                    } else {
                        this.currentModal.style.width='190'
                    }
                    this.currentModal.style.iconcolor='#ffffff';
                    this.currentModal.style.bgcolor='#000000';
                    this.currentModal.style.offset_left_right='0'
                }
            },
            changeImg(val) {
                this.currentModal.params.imgurl = val;
            },
            changePosition(e) {
                if (e.indexOf('top') > -1) {//位于顶部时滚动至顶部
                    scrollTo(0)
                } else { //位于底部时滚动至底7部
                    let scrollTo = document.getElementsByClassName('scroll-body')[0];
                    scrollTo(scrollTo.getBoundingClientRect().height)
                }
            },
            chooseCustomer(val) {
                console.log(val,'currentModal.params.customer>>>>');
                if (val === 'wx') {
                    this.currentModal.params.link_url='wx_service';
                } else if(val == 'wechat') {
                    this.currentModal.params.link_url='wechatCustomerService';
                }
            },
            selectCustomerLink(val) {
                if(val.link) {
                    this.currentModal.params.link_url=val.link;
                    this.currentModal.params.customerName = val.name
                }else {
                    this.currentModal.params.link_url="";
                    this.currentModal.params.customerName = ""
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
</style>