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
    <div class='goods' v-if='lazyLoad'>
        <i-form :label-width="115" ref='goods' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>
                    全局组件
                </p>
                <form-item label="商品类型：">
                    <MyRadioGroup :items='goodsType' v-model='currentModal.params.goodstype' @change="goodsTypeChange"></MyRadioGroup>
                </form-item>
                <form-item label="显示类型：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='showType' v-model='currentModal.params.goodsscroll' @change="handleChangeType"></MyButtonGroup>
                </form-item>
                <form-item label="列表类型：" style='margin-bottom:40px;'>
                    <MyButtonGroup :items='listType' v-model='currentModal.style.liststyle'></MyButtonGroup>
                </form-item>

            </MyCollapse>
             <MyCollapse>
                <p class="form-title" slot='label'>
                    添加商品
                </p>
                <!-- 普通商品 -->
               <template v-if="currentModal.params.goodstype == '0'">
                    <form-item label="选择商品：" style="margin-bottom: 10px;">
                    <MyRadioGroup :items='goodsList' v-model='currentModal.params.goodsdata'>
                        <MyRadioGroup :items='selectType' v-model='currentModal.params.goodsdata' v-if='addGoods' @change='getLabelField'></MyRadioGroup>
                    </MyRadioGroup>
                </form-item>
                <!-- 选择商品的子模块 -->
                <form-item :label-width='0' v-if='!addGoods' prop='data'>
                    <component :is='goodSelector' :key="currentModal._comIndex_" :current-modal='currentModal' @validateGoodsForm='validateGoodsForm'></component>
                </form-item>
               </template>

                <div v-if="showLimitAndSort">
                    <form-item label="显示数量：" class="mb-10">
                        <MyDraggableProgress :min='1' :max='50' unit='件' v-model='currentModal.params.goodsnum'></MyDraggableProgress>
                        <p class='tip'>最多可显示50件商品</p>
                    </form-item>
                    <form-item label="商品排序：" v-if="goodsShowSort">
                        <MyRadioGroup :items='sortItem' v-model='currentModal.params.goodssort' @change='getLabelField'></MyRadioGroup>
                    </form-item>
                </div>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot='label'>
                    内容样式
                </p>
                 <form-item label="组件背景：">
                    <MyRadioGroup :items='componentBg' v-model='currentModal.params.componentbg'>
                        <form-item label="背景颜色：" :label-width="100" style="margin-bottom:0;" v-if='currentModal.params.componentbg=="1"'>
                             <MyColorPicker v-model='currentModal.style.bgcolor' default='#FF3C29'></MyColorPicker>
                        </form-item>
                        <form-item label="背景图片："  :label-width="100"  style="margin-bottom:0;" v-if="currentModal.params.componentbg=='2'">
                            <MyAddImgImg style="display:inline-block;"  size='mini' type='image' v-model='currentModal.params.bgimg' @change='refreshCurrentModal'></MyAddImgImg>
                            <kdx-hint-text style="margin-left:40px;padding-top:8px;">建议图片尺寸为750px</kdx-hint-text>
                        </form-item>

                    </MyRadioGroup>
                </form-item>

                 <form-item label="商品组背景色：">
                    <MyColorPicker v-model='currentModal.style.background' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="商品标题：">
                     <MyColorPicker v-model='currentModal.style.titlecolor' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="商品售卖价：">
                    <MyRadioGroup :items='showSalePrice' v-model='currentModal.params.showprice'>
                        <MyColorPicker v-model='currentModal.style.pricecolor' v-if='currentModal.params.showprice==1' default='#FF3C29'></MyColorPicker>
                    </MyRadioGroup>
                </form-item>
                <form-item label="划线价格：">
                    <MyRadioGroup :items='showDelPrice' v-model='showProductPrice'>
                        <div class='input-reset' style='margin-bottom:20px' v-if='currentModal.params.showproductprice!="0"'>
                            <span class='label'>显示文字：</span>
                            <MyInputWithReset placeholder='如：原价' v-model='currentModal.params.productpricetext'></MyInputWithReset>
                        </div>
                        <MyColorPicker v-model='currentModal.style.productpricecolor' v-if='currentModal.params.showproductprice!="0"' default='#969696'></MyColorPicker>
                    </MyRadioGroup>
                </form-item>
                <form-item label="商品销量：" v-if='currentModal.style.liststyle!="block three"'>
                    <MyRadioGroup :items='showSales' v-model='currentModal.params.showsales'>
                        <div class='input-reset' v-if='currentModal.params.showsales==1'>
                            <span class='label'>显示文字：</span>
                            <MyInputWithReset placeholder='如：销量' v-model='currentModal.params.salestext'></MyInputWithReset>
                        </div>
                        <MyColorPicker v-model='currentModal.style.salescolor' v-if='currentModal.params.showsales==1' default='#969696'></MyColorPicker>
                    </MyRadioGroup>
                </form-item>
                <form-item label="佣金设置：" class="commision-set">
                    <MyRadioGroup :items='commisionSet' v-model="currentModal.params.commisionstyle" @change="commisionChange">
                        <div v-if="currentModal.params.commisionstyle !='-1'">
                            <form-item label="佣金文字："  :label-width="100">
                                <Input placeholder="请输入佣金文字" show-word-limit v-model='currentModal.params.commisiontext' :maxlength="5" />
                            </form-item>
                            <form-item label="背景颜色：" :label-width="100">
                                <MyColorPicker v-model='currentModal.style.commissionBackground' default='#FF5555'></MyColorPicker>
                            </form-item>
                            <form-item label="文字颜色：" :label-width="100">
                                <MyColorPicker v-model='currentModal.style.commissionColor' default='#FFFFFF'></MyColorPicker>
                            </form-item>
                            <form-item label="背景透明度：" :label-width="100">
                                <MyDraggableProgress :min='0' :max='100' unit='%' v-model='currentModal.style.commisionopcaity'></MyDraggableProgress>
                            </form-item>
                        </div>
                    </MyRadioGroup>
                </form-item>
                
                <form-item label="购买按钮：">
                    <MyRadioGroup :items='showBtn' v-model='showBtnStyle'>
                        <MyButtonGroup style='margin-bottom:40px;' :items='btnStyle' v-model='currentModal.style.buystyle' v-if='currentModal.style.buystyle'></MyButtonGroup>
                        <MyColorPicker v-model='currentModal.style.buybtncolor' v-if='currentModal.style.buystyle' default='#FF3C29'></MyColorPicker>
                    </MyRadioGroup>
                </form-item>
                <form-item label="商品角标：">
                    <MyRadioGroup :items='cornerMark' :key="currentModal.params.goodstype" v-model='currentModal.params.showicon'>
                        <!-- 商品角标的子模块 -->
                        <form-item :label-width='0' v-if='currentModal.params.showicon!="0"' style='margin-bottom:0;'>
                            <keep-alive>
                                <component :is='"ShowIcon"+currentModal.params.showicon' v-if='currentModal.params.showicon'></component>
                            </keep-alive>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
                <form-item label="上间距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.margintop'></MyDraggableProgress>
                </form-item>
                <form-item label="下边距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                </form-item>
                <form-item label="左右边距：">
                    <MyDraggableProgress :min='0' :max='50' unit='px' v-model='currentModal.style.marginleft'></MyDraggableProgress>
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
        name: 'goods',
        components: {
            GoodSelector0: () =>
                import ("./Goods/SelectGood1.vue"),
            GoodSelector1: () =>
                import ("./Goods/SelectGood2.vue"),
            GoodSelector2: () =>
                import ("./Goods/SelectGood3.vue"),
            ShowIcon1: () =>
                import ("./Goods/ShowIcon1.vue"),
            ShowIcon2: () =>
                import ("./Goods/ShowIcon2.vue")
        },
        computed: {
            goodSelector() {
                if (this.currentModal.params.goodsdata == 0 || this.currentModal.params.goodsdata == 1 || this.currentModal.params.goodsdata == 2) {
                    return "GoodSelector" + this.currentModal.params.goodsdata
                }
                return ''
            },
            addGoods() {
                return !this.goodsList.some(item => {
                    return this.currentModal.params.goodsdata && this.currentModal.params.goodsdata == item.id
                })
            },
            showProductPrice: {
                get() {
                    if (this.currentModal.params.showproductprice == '1') {
                        return '1'
                    } else {
                        return '0'
                    }
                },
                set(val) {
                    if (val == 1) {
                        this.currentModal.params.showproductprice = '1';
                        this.currentModal.params.productpriceline = '1'
                    } else {
                        this.currentModal.params.productpriceline = '0'
                        this.currentModal.params.showproductprice = val;
                    }
                }
            },
            listType() {
                let {goodsscroll, goodstype} = this.currentModal.params || {}
                let list = [{
                    label: '双列',
                    icon: 'iconfont icon-zujian-shangpinzu-lieshangpin',
                    id: 'block two'
                }, {
                    label: '三列',
                    icon: 'iconfont icon-zujian-shangpinzu-lieshangpin1',
                    id: 'block three',
                    hide: goodstype=='1'
                }, {
                    label: '列表',
                    icon: 'iconfont icon-zujian-shangpinzu-shangpinliebiao',
                    id: 'list',
                    hide: goodsscroll == '1'
                }, {
                    label: '单列',
                    icon: 'iconfont icon-zujian-shangpinzu-danlieshangpin',
                    id: 'block one'
                }, ]
                return list;
            },
            showType() {
                return [{
                    label: '普通',
                    icon: 'iconfont icon-zujian-shangpinzu-danlieshangpin',
                    id: '0'
                }, {
                    label: '左右滑动',
                    icon: 'iconfont icon-zujian-shangpinzu-huadong',
                    id: '1'
                }]
            },
            showBtnStyle: {
                get() {
                    if (this.currentModal.style.buystyle) {
                        return 'buybtn-1'
                    }
                    return ''
                },
                set(val) {
                    this.currentModal.style.buystyle = val
                }
            },
            goodsType(){
                let base = [{
                    label: '商城商品',
                    id: '0'
                }]
              
                return base
            },
            cornerMark(){
                let result = [{
                    label: '自定义',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    id: '2'
                }, {
                    label: '不显示',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    id: '0'
                }]

                if(this.currentModal.params.goodstype == '0') {
                    result.unshift({
                        label: '系统图标',
                        icon: 'ivu-icon ivu-icon-ios-contract',
                        id: '1'
                    })
                }
                return result
            },
            // 商品组显示排序
            goodsShowSort(){
                let {goodsdata,goodstype} = this.currentModal.params
                return (goodstype=='0' && goodsdata!=0)
            },
            // 显示排序和限制
            showLimitAndSort(){
                let {goodstype} = this.currentModal.params
                return this.goodsShowSort|| (goodstype==1)
            }
        },
        data() {
            return {
                id:'goods',
                componentBg: [{
                    id: '0',
                    label: '透明'
                }, {
                    id: '1',
                    label: '颜色'
                },
                {
                    id:'2',
                    label: '背景图片'
                }],
                showSales: [{
                    label: '显示',
                    id: '1'
                }, {
                    label: '不显示',
                    id: '0'
                }],
                showSalePrice: [{
                    label: '显示',
                    id: '1'
                }, {
                    label: '不显示',
                    id: '0'
                }],
                showDelPrice: [{
                    label: '显示默认',
                    id: '1'
                }, {
                    label: '不显示',
                    id: '0'
                }],
                showBtn: [{
                    label: '显示',
                    id: 'buybtn-1'
                }, {
                    label: '不显示',
                    id: ''
                }],
                btnStyle: [{
                    label: '样式1',
                    icon: 'iconfont-m- icon-m-buy3',
                    id: 'buybtn-4'
                }, {
                    label: '样式2',
                    icon: 'iconfont-m- icon-m-buy-jiagou2',
                    id: 'buybtn-1'
                }, {
                    label: '样式3',
                    icon: 'iconfont-m- icon-m-buy-jiagou1',
                    id: 'buybtn-2'
                }, {
                    label: '样式4',
                    icon: 'iconfont-m- icon-m-buy2',
                    id: 'buybtn-3'
                }, {
                    label: '样式5',
                    icon: 'iconfont-m- icon-m-buy',
                    id: 'buybtn-5'
                }, {
                    label: '样式6',
                    icon: 'iconfont-m- icon-m-buy1',
                    id: 'buybtn-6'
                }],
              
                goodsList: [{
                    label: '手动选择',
                    id: '0'
                }, {
                    label: '选择分类',
                    id: '1'
                }, {
                    label: '选择分组',
                    id: '2'
                }, {
                    label: '营销属性',
                    id: ''
                }],
                selectType: [{
                    label: '新品商品',
                    id: 'is_new', //3
                }, {
                    label: '热卖商品',
                    id: 'is_hot', //4
                }, {
                    label: '推荐商品',
                    id: 'is_recommand', //5
                }],
                sortItem: [{
                    label: '综合',
                    id: '0'
                }, {
                    label: '按销量',
                    id: '1'
                }, {
                    label: '价格降序',
                    id: '2'
                }, {
                    label: '价格升序',
                    id: '3'
                }],
                commisionSet: [{
                    label: '不显示',
                    id: '-1'
                }, {
                    id: '0',label:'样式一'
                },{
                    label: '样式二',
                    id:'1'
                }],
            }
        },
        methods: {
            goodsTypeChange(e){
                if(e == '1') {
                    this.currentModal.params.showicon = '0'
                }
                this.currentModal.data.splice(0)
            },
            creditTypeChange(){
                this.currentModal.data.splice(0)
            },
            handleChangeType(){
                let {goodsscroll, goodstype} = this.currentModal.params
                let liststyle = this.currentModal.style.liststyle
                if(
                    (goodsscroll == '1' && liststyle == 'list') || 
                    (goodstype == '1' && liststyle == 'block three')
                ){
                    this.currentModal.style.liststyle = 'block two'
                } 
                    
            },
            validateGoodsForm(){
                this.$nextTick(() => {
                    this.$refs.goods.validate().then(res=>{
                        if(res&&this.errorInfo===this.currentModal){
                            this.checkError(null);
                        }
                    })
                })
            },
            commisionChange(e){
                this.currentModal.params.commisiontext =e == '0'? '预计佣金': '赚'
            },
            getLabelField() {
                let sort = {
                    0: {
                        key: '',
                        by: 'desc'
                    },
                    1: {
                        key: 'sales',
                        by: 'desc'
                    },
                    2: {
                        key: 'price',
                        by: 'desc'
                    },
                    3: {
                        key: 'price',
                        by: 'asc'
                    }
                }
                if (isNaN(this.currentModal.params.goodsdata * 1)) { //按照营销属性查询
                    let params ={
                        pageCount: 1,
                        pagesize: 50,
                        status: 1,
                        label_field: this.currentModal.params.goodsdata,
                        sort: sort[this.currentModal.params.goodssort].key,
                        by: sort[this.currentModal.params.goodssort].by,
                    }
                    this.$api.goodsApi.goodsList(params)
                        .then(res => {
                            if (res.error === 0) {
                                this.currentModal.data = res.list.map(val => {
                                    return {
                                        thumb: val.thumb,
                                        price: val.price,
                                        productprice: val.original_price,
                                        sales: val.sales,
                                        title: val.title,
                                        sub_name: val.sub_name,
                                        gid: val.id,
                                        bargain: 0,
                                        credit: 0,
                                        ctype: 0,
                                        type: val.type
                                    }
                                })

                                this.refreshCurrentModal();
                            }
                        }).catch();
                }
            },
            adapterData(item){ // 转换数据
                let {id, thumb,sale,type: act_type} = item
                let result = {
                    id: id,
                    gid: id,
                    thumb,
                    act_type, 
                    sales: +sale,
                    bargain: 0,
                    credit: 0,
                    ctype: 0,
                    type: act_type
                }
                let {title,sub_name,has_option, price, goods_type:type} = item
                result = {
                    ...result, 
                    title,
                    sub_name,
                    has_option,
                    type,
                    productprice: price,
                }
                return result
            },
        },
        beforeMount() {
            if(this.currentModal.params.commisionStyle==null) {
                this.currentModal.params.commisionStyle = '0'
            }
            this.$store.dispatch('setting/getSysSetting')
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .mb-10 {
            margin-bottom: 10px!important;
        }
    .goods {

        
        /deep/ .radio-group {
            .content {
                padding: 20px;
            }
        }
        .input-reset {
            display: flex;
            flex-wrap: nowrap;
            margin-bottom: 10px;
            .label {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                color: #262B30;
                margin-right: 6px;
            }
        }
    }
    .hint {
        /deep/ .ivu-alert-message {
            color: #939799;
        }
    }
    /deep/ .select-link {
        width: 100%;
    }
    /deep/ .content .button-group {
        .ivu-radio-wrapper {
            min-width: 50px;
        }
    }

    .commision-set {
         /deep/ .radio-group {
            .content {
                padding: 20px 20px 20px 0;
            }
        }
        /deep/ .ivu-form-item {
            margin-bottom: 20px;

            &:last-child {
                margin-bottom: 0;
            }

            .ivu-form-item-content  {
                margin-left: 100px!important;
            }
        }
        
    }
</style>
