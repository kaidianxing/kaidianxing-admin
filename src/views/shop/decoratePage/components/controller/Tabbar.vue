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
    <div class='tabbar' v-if='lazyLoad'>
        <i-form
            ref="tabbar"
            :label-width="120"
            :model="currentModal"
            :rules="validator"
        >
            <MyCollapse>
                <p
                    class="form-title"
                    slot='label'
                >
                    标签页设置
                </p>
                <div class="tab-title">
                    <form-item
                        label=""
                        :label-width='0'
                    >
                        <MyDragSortableCell
                            :list='currentModal.data'
                            @end='dragEnd'
                            :delabled="currentModal.data && currentModal.data.length>1"
                            @delItem="delItem"
                            :current="currentModal.params.current"
                            @on-current="changeCurrent"
                        >
                            <template v-slot='{item}'>
                                <div style='display:flex;'>
                                    <span class="tab-title tab-title-label">标签标题：</span>
                                    <Input
                                        placeholder="请输入标题"
                                        show-word-limit
                                        :maxlength="10" 
                                        v-model="item.title"
                                        style="width: 326px;margin:10px 0"
                                    />
                                </div>
                                
                            </template>
                        </MyDragSortableCell>
                        <i-button
                            class="add-btn"
                            @click='addItem'
                            v-if="currentModal.data && currentModal.data.length<20   "
                        >+添加选项（{{currentModal.data.length}}/20）</i-button>
                    </form-item>
                </div>
            </MyCollapse>
            <MyCollapse>
                <p
                    class="form-title"
                    slot='label'
                >
                    选项设置
                </p>
                <div>
                    <form-item label="选择商品：">
                        <MyRadioGroup
                            :items='goodsList'
                            v-model='goodsInfo.params.goodsdata'
                            :key="currentModal.params.current"
                        >
                            <MyRadioGroup
                                :items='selectType'
                                v-model='goodsInfo.params.goodsdata'
                                v-if='addGoods'
                                @change='getLabelField'
                            ></MyRadioGroup>
                        </MyRadioGroup>
                    </form-item>
                    <!-- 选择商品的子模块 -->
                    <form-item
                        :label-width='0'
                        v-if='!addGoods'
                        prop='data'
                    >
                        <component
                            :is='goodSelector'
                            :current-info='goodsInfo'
                            :key="currentModal.params.current"
                        ></component>
                    </form-item>
                    <div v-if='goodsInfo.params.goodsdata!="0"'>
                        <form-item
                            label="显示数量："
                            style='margin-bottom:10px;'
                        >
                            <MyDraggableProgress
                                :min='1'
                                :max='50'
                                unit='件'
                                v-model='goodsInfo.params.goodsnum'
                            ></MyDraggableProgress>
                            <p class='tip'>最多可显示50件商品</p>
                        </form-item>
                        <form-item label="商品排序：">
                            <MyRadioGroup
                                :items='sortItem'
                                v-model='goodsInfo.params.goodssort'
                                @change='getLabelField'
                                :key="currentModal.params.current"
                            ></MyRadioGroup>
                        </form-item>
                    </div>
                </div>
            </MyCollapse>
            <MyCollapse>
                <p
                    class="form-title"
                    slot='label'
                >
                    商品样式
                </p>
                <div>
                    <form-item
                        label="列表类型："
                        style='margin-bottom:40px;'
                    >
                        <MyButtonGroup
                            :items='listType'
                            v-model='goodsInfo.style.liststyle'
                        ></MyButtonGroup>
                    </form-item>
                    <form-item label="背景颜色：">
                        <MyColorPicker
                            v-model='goodsInfo.style.background'
                            default='#ffffff'
                        ></MyColorPicker>
                    </form-item>
                    <form-item label="商品标题：">
                        <MyColorPicker
                            v-model='goodsInfo.style.titlecolor'
                            default='#212121'
                        ></MyColorPicker>
                    </form-item>
                    <form-item label="商品售卖价：">
                        <MyRadioGroup
                            :items='showSalePrice'
                            v-model='goodsInfo.params.showprice'
                        >
                            <MyColorPicker
                                v-model='goodsInfo.style.pricecolor'
                                v-if='goodsInfo.params.showprice==1'
                                default='#FF3C29'
                            ></MyColorPicker>
                        </MyRadioGroup>
                    </form-item>
                    <form-item label="划线价格：">
                        <MyRadioGroup
                            :items='showDelPrice'
                            v-model='showProductPrice'
                        >
                            <div
                                class='input-reset'
                                v-if='goodsInfo.params.showproductprice!="0"'
                            >
                                <span class='label'>显示文字：</span>
                                <MyInputWithReset
                                    placeholder='如：原价'
                                    v-model='goodsInfo.params.productpricetext'
                                ></MyInputWithReset>
                            </div>
                            <MyColorPicker
                                v-model='goodsInfo.style.productpricecolor'
                                v-if='goodsInfo.params.showproductprice!="0"'
                                default='#969696'
                            ></MyColorPicker>
                        </MyRadioGroup>
                    </form-item>
                    <form-item label="商品销量：">
                        <MyRadioGroup
                            :items='showSales'
                            v-model='goodsInfo.params.showsales'
                        >
                            <div
                                class='input-reset'
                                v-if='goodsInfo.params.showsales==1'
                            >
                                <span class='label'>显示文字：</span>
                                <MyInputWithReset
                                    placeholder='如：销量'
                                    v-model='goodsInfo.params.salestext'
                                ></MyInputWithReset>
                            </div>
                            <MyColorPicker
                                v-model='goodsInfo.style.salescolor'
                                v-if='goodsInfo.params.showsales==1'
                                default='#969696'
                            ></MyColorPicker>
                        </MyRadioGroup>
                    </form-item>
                    <form-item label="购买按钮：">
                        <MyRadioGroup
                            :items='showBtn'
                            v-model='showBtnStyle'
                        >
                            <MyButtonGroup
                                style='margin-bottom:40px;'
                                :items='btnStyle'
                                v-model='goodsInfo.style.buystyle'
                                v-if='goodsInfo.style.buystyle'
                            ></MyButtonGroup>
                            <MyColorPicker
                                v-model='goodsInfo.style.buybtncolor'
                                v-if='goodsInfo.style.buystyle'
                                default='#FF3C29'
                            ></MyColorPicker>
                        </MyRadioGroup>
                    </form-item>
                    <form-item label="商品角标：">
                        <MyRadioGroup
                            :items='cornerMark'
                            v-model='goodsInfo.params.showicon'
                        >
                            <!-- 商品角标的子模块 -->
                            <form-item
                                :label-width='0'
                                v-if='goodsInfo.params.showicon!="0"'
                                style='margin-bottom:0;'
                            >
                                <keep-alive>
                                    <component
                                        :key="currentModal.params.current + goodsInfo.params.showicon"
                                        :is='"ShowIcon"+goodsInfo.params.showicon'
                                        :current-info='goodsInfo'
                                        v-if='goodsInfo.params.showicon'
                                    ></component>
                                </keep-alive>
                            </form-item>
                        </MyRadioGroup>
                    </form-item>
                </div>
            </MyCollapse>
            <MyCollapse no-border>
                <p
                    class="form-title"
                    slot='label'
                >
                    标签页样式
                </p>

                <div>
                    <form-item label="背景颜色：">
                        <MyColorPicker
                            v-model='currentModal.style.background'
                            default='#ffffff'
                        ></MyColorPicker>
                    </form-item>
                    <form-item label="激活背景：">
                        <MyColorPicker
                            v-model='currentModal.style.activebgcolor'
                            default='#ffffff'
                        ></MyColorPicker>
                    </form-item>
                    <form-item label="文字颜色：">
                        <MyColorPicker
                            v-model='currentModal.style.textcolor'
                            default='#212121'
                        ></MyColorPicker>
                    </form-item>
                    <form-item label="激活文字：">
                        <MyColorPicker
                            v-model='currentModal.style.activecolor'
                            default='#ff3c29'
                        ></MyColorPicker>
                    </form-item>
                    <form-item label="内部间距：">
                        <MyDraggableProgress
                            :min='0'
                            :max='50'
                            unit='px'
                            v-model='currentModal.style.margininside'
                        ></MyDraggableProgress>
                    </form-item>
                    <form-item label="上间距：">
                        <MyDraggableProgress
                            :min='0'
                            :max='50'
                            unit='px'
                            v-model='currentModal.style.margintop'
                        ></MyDraggableProgress>
                    </form-item>
                    <form-item label="下间距：">
                        <MyDraggableProgress
                            :min='0'
                            :max='50'
                            unit='px'
                            v-model='currentModal.style.marginbottom'
                        ></MyDraggableProgress>
                    </form-item>
                    <form-item label="左右间距：">
                        <MyDraggableProgress
                            :min='0'
                            :max='50'
                            unit='px'
                            v-model='currentModal.style.marginleft'
                        ></MyDraggableProgress>
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
                </div>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
import { goods } from '@/store/decorate/allItems'
import mixin from './mixin.js'
export default {
    mixins: [mixin],
    name: 'tabbar',
    components: {
        GoodSelector0: () =>
            import("./Goods/SelectGood1.vue"),
        GoodSelector1: () =>
            import("./Goods/SelectGood2.vue"),
        GoodSelector2: () =>
            import("./Goods/SelectGood3.vue"),
        ShowIcon1: () =>
            import("./Goods/ShowIcon1.vue"),
        ShowIcon2: () =>
            import("./Goods/ShowIcon2.vue")
    },
    data() {
        return {
            id:'tabbar',
            radiusStyle: [{
                id: '0',
                label: '直角'
            }, {
                id: '1',
                label: '圆角'
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
            showSales: [{
                label: '显示',
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
                icon: 'iconfont-m- icon-m-buy4',
                id: 'buybtn-1'
            }, {
                label: '样式3',
                icon: 'iconfont-m- icon-m-buy6',
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
            cornerMark: [{
                label: '系统图标',
                icon: 'ivu-icon ivu-icon-ios-contract',
                id: '1'
            }, {
                label: '自定义',
                icon: 'ivu-icon ivu-icon-ios-contract',
                id: '2'
            }, {
                label: '不显示',
                icon: 'ivu-icon ivu-icon-ios-contract',
                id: '0'
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
        }
    },
    computed: {
        goodsInfo() {
            // 兼容切换组件的错误
            if(!this.currentModal?.data ||  !this.currentModal?.data[this.currentModal.params.current]?.goods) {
                return goods
            }
            return this.currentModal?.data[this.currentModal.params.current]?.goods
        },
        goodSelector() {
            if (this.goodsInfo.params.goodsdata == 0 || this.goodsInfo.params.goodsdata == 1 || this.goodsInfo.params.goodsdata == 2) {
                return "GoodSelector" + this.goodsInfo.params.goodsdata
            }
            return ''
        },
        addGoods() {
            return !this.goodsList.some(item => {
                return this.goodsInfo.params.goodsdata && this.goodsInfo.params.goodsdata == item.id
            })
        },
        showProductPrice: {
            get() {
                if (this.goodsInfo.params.showproductprice == '1') {
                    if (this.goodsInfo.params.productpriceline == '1') {
                        return '-'
                    } else {
                        return '1'
                    }
                } else {
                    if (this.goodsInfo.params.productpriceline == '1') {
                        return '-'
                    } else {
                        return '0'
                    }
                }
            },
            set(val) {
                if (val == '-') {
                    this.goodsInfo.params.showproductprice = '1';
                    this.goodsInfo.params.productpriceline = '1'
                } else {
                    this.goodsInfo.params.productpriceline = '0'
                    this.goodsInfo.params.showproductprice = val;
                }
            }
        },
        listType() {
            let list = [{
                label: '双列',
                icon: 'iconfont icon-zujian-shangpinzu-lieshangpin',
                id: 'block'
            }, {
                label: '三列',
                icon: 'iconfont icon-zujian-shangpinzu-lieshangpin1',
                id: 'block three'
            }, {
                label: '列表',
                icon: 'iconfont icon-zujian-shangpinzu-shangpinliebiao',
                id: 'list',
            }, {
                label: '单列',
                icon: 'iconfont icon-zujian-shangpinzu-danlieshangpin',
                id: 'block one'
            },]
            return list;
        },
        showBtnStyle: {
            get() {
                if (this.goodsInfo.style.buystyle) {
                    return 'buybtn-1'
                }
                return ''
            },
            set(val) {
                this.goodsInfo.style.buystyle = val
            }
        }
    },
    methods: {
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
            
            if (isNaN(this.goodsInfo.params.goodsdata * 1)) { //按照营销属性查询
                let params = {
                    pageCount: 1,
                    pagesize: this.goodsInfo.params.goodsnum,
                    status: 1,
                    label_field: this.goodsInfo.params.goodsdata,
                    sort: sort[this.goodsInfo.params.goodssort].key,
                    by: sort[this.goodsInfo.params.goodssort].by,
                }
                this.$api.goodsApi.goodsList(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.goodsInfo.data = res.list.map(val => {
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
                                    ctype: 0
                                }
                            })

                            this.refreshCurrentModal();
                        }
                    }).catch();
            }
        },
        dragEnd(e) {
            let currentItem = this.currentModal.data[this.currentModal.params.current]
            for (let i = 0; i < e.length; i++) {
                if (currentItem == e[i]) {
                    this.currentModal.params.current = i
                }
            }

            this.currentModal.data = e;
            this.refreshCurrentModal();
        },
        delItem(item) {
            for (let i = 0; i < this.currentModal.data.length; i++) {
                if (item === this.currentModal.data[i]) {
                    let current = this.currentModal.params.current
                     if((current> 0 && current< this.currentModal.data.length -1 && i<= current)) {
                      this.changeCurrent(current -1 )
                     } else if(current == this.currentModal.data.length -1) {
                         this.changeCurrent(current - 1)
                     }

                    this.currentModal.data.splice(i, 1);
                    break;
                }
            }
            this.refreshCurrentModal();
        },
        addItem() {
            this.currentModal.data.push({
                title: '标签' + (this.currentModal.data.length + 1),
                goods: {...JSON.parse(JSON.stringify(goods))}
            });
        },
        changeCurrent(index) {
            this.currentModal.params.current = index
        }
    },
}
</script>

<style lang="scss" scoped>
@import "./common.scss";

.tab-title {
    flex-shrink: 0;
    padding-right: 5px;
    @include font-14-20;
    color: #000;
}
.tab-title-label{
    display: flex;
    flex-direction: column;
    justify-content: center;
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
        color: #262b30;
        margin-right: 6px;
    }
}
/deep/ .drag-sortable-items{
    position: relative;
}
.add-btn {
    width:100%;
    color:$brand-color;
    margin-top: -1px;
    height: 52px;
    position: relative;
    &:hover {
        z-index: 100;
    }
}

/deep/ .ivu-radio-group-item:last-child {
    margin-right: 0;
}
</style>