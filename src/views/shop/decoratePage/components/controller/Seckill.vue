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
    <div class='seckill' v-if='currentModal.id=="seckill"&&lazyLoad'>
        <i-form :label-width="110" ref='search' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>组件样式</p>
                <form-item label="组件样式：">
                    <MyButtonGroup :items='listType' @change="changStyle" v-model='currentModal.style.listtype'></MyButtonGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>添加秒杀商品</p>
                <!-- 选择商品的子模块 -->
                <form-item :label-width='0' prop='data' v-if="currentModal.params.activityGoodsType==='1'">
                  <SelectActivity activeType="seckill" />
                </form-item>
                <!-- 选择商品的子模块 -->
                <form-item :label-width='0' v-if="currentModal.params.activityGoodsType==='0'" prop='data'>
                    <!--<component :is='goodSelector' :current-info='currentModal' :key="currentModal._comIndex_"></component>-->
                    <good-selector type="seckill" :current-modal='currentModal'></good-selector>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>内容样式</p>

                <form-item label="组件背景：" v-if="currentModal.style.listtype == 'scroll'">
                    <MyRadioGroup :items='bgstyle' v-model='currentModal.params.bgstyle'>
                        <!--<template v-slot:example="{example}">
                                <kdx-hint-tooltip v-if="example.thumb" type="image" class="seckill-tip" :image="example.thumb" />
                        </template>-->
                        <form-item :label-width="80" v-if="currentModal.params.bgstyle == 'img'"
                                   label="背景图片：" style="margin-bottom:0;">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='image'
                                         v-model='currentModal.params.bgimg'
                                         @change='refreshCurrentModal'></MyAddImgImg>
                            <kdx-hint-text style="margin-left: 80px;padding-top:0px;" class="hint-img-text">建议图片尺寸为750x570像素。</kdx-hint-text>
                        </form-item>
                        <form-item v-else label="背景颜色：" :label-width="100" style="margin-bottom:0;">
                            <MyColorPicker v-model='currentModal.style.bgcolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                    </MyRadioGroup>
                </form-item>

                <form-item label="活动标题：">
                     <MyRadioGroup :items='showBtn' v-model='currentModal.params.showacttitle'></MyRadioGroup>
                </form-item>

                <form-item label="标题背景：" v-if="currentModal.params.showacttitle=='1'">
                    <MyRadioGroup :items='titlebg' v-model='currentModal.params.titlebg'>
                        <template v-slot:example="{example}">
                                <kdx-hint-tooltip v-if="example.thumb" type="image" class="seckill-tip" :image="example.thumb" />
                        </template>
                        <form-item :label-width="80" v-if="currentModal.params.titlebg == 'img'"
                                   label="背景图片：" style="margin-bottom:0;">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='image'
                                         v-model='currentModal.params.titlebgimg'
                                         @change='refreshCurrentModal'></MyAddImgImg>
                            <kdx-hint-text style="margin-left: 80px;padding-top:8px;" class="hint-img-text">建议图片尺寸为750x80像素。</kdx-hint-text>
                        </form-item>
                        <form-item v-else-if="currentModal.params.titlebg == 'color'" label="背景颜色：" :label-width="100" style="margin-bottom:0;">
                            <MyColorPicker v-model='currentModal.style.titlebgcolor' default='#ff3c29'></MyColorPicker>
                        </form-item>
                    </MyRadioGroup>
                </form-item>

               <!-- <form-item label="标题颜色：" v-if="currentModal.params.showacttitle=='1'">
                    <MyColorPicker v-model='currentModal.style.titlecolor' default='#ffffff'></MyColorPicker>
                </form-item>-->


                <form-item label="标题内容：" v-if="currentModal.params.showacttitle=='1'">
                    <MyRadioGroup :items='titleType' v-model='currentModal.params.titletype'>
                        <form-item :label-width="80" v-if="currentModal.params.titletype === 'img'"
                                   label="标题图片：" style="margin-bottom:0;">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='image'
                                         v-model='currentModal.params.titleimg'
                                         @change='changeTitleImg($event)'></MyAddImgImg>
                            <kdx-hint-text style="margin-left: 80px;padding-top: 0;" class="hint-img-text">建议图片尺寸为240x56像素。</kdx-hint-text>
                        </form-item>
                        <template v-else>
                            <form-item label="显示文字：" :label-width="80" class="mb-20">
                                <Input placeholder="如：限时秒杀" v-model='currentModal.params.titlename' :maxlength="5" show-word-limit style="width: 236px">
                                </Input>
                            </form-item>
                            <div class='custom-form-item' style='margin-bottom:10px;'>
                                <p class="label" style="width: 80px">图标：</p>
                                <MyAddImgImg v-model='currentModal.params.titleicon' type='icon'></MyAddImgImg>
                            </div>
                            <form-item label="标题大小：" :label-width="80" class="mb-20">
                                <MyDraggableProgress v-model='currentModal.style.titlesize' :step="2" :min='24' :max='48' unit='px'></MyDraggableProgress>
                            </form-item>
                            <form-item label="标题粗细：" :label-width="80" class="mb-20">
                                <MyRadioGroup :items='titleWeight'
                                              v-model='currentModal.params.titleweight'></MyRadioGroup>
                            </form-item>
                            <form-item label="文字颜色：" :label-width="80" class="mb-20">
                                <MyColorPicker v-model='currentModal.style.titlecolor'
                                               default='#212121'></MyColorPicker>
                            </form-item>
                            <form-item label="图标颜色：" :label-width="80" style="margin-bottom:0;">
                                <MyColorPicker v-model='currentModal.style.titleiconcolor'
                                               default='#ff6f29'></MyColorPicker>
                            </form-item>
                        </template>
                    </MyRadioGroup>
                </form-item>


                <form-item label="倒计时："  v-if="currentModal.params.showacttitle=='1'&&currentModal.params.activityGoodsType==='1'">
                    <div class="bg-color">
                        <form-item label="文字颜色：" :label-width="80" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.textcolor' default='#FFFFFF'></MyColorPicker>
                        </form-item>
                        <form-item label="数字颜色：" :label-width="80" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.numcolor' default='#ff3c29'></MyColorPicker>
                        </form-item>
                        <form-item label="背景颜色：" :label-width="80" class="mb-0">
                            <MyColorPicker v-model='currentModal.style.countbgcolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                    </div>
                </form-item>

                <form-item label="查看更多：" v-if="currentModal.params.showacttitle=='1'">
                    <MyRadioGroup :items='moreBtn' v-model='currentModal.params.showmore'>
                        <!-- <template v-slot:example="{example}">
                                <kdx-hint-tooltip v-if="example.thumb" type="image" class="seckill-tip" :image="example.thumb" />
                        </template>
                        <template v-slot:tip>
                             <kdx-hint-text>点击“查看更多”的页面链接为当前所选秒杀抢购的商品列表</kdx-hint-text>
                        </template>-->
                        <div class='input-reset' v-if='currentModal.params.showmore==1' style="margin-bottom: 0">
                            <span class='label'>文字颜色：</span>
                            <MyColorPicker v-model='currentModal.style.morecolor' default='#ffffff'></MyColorPicker>
                        </div>
                    </MyRadioGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>商品样式</p>
                <form-item label="商品背景：" v-if="currentModal.style.listtype == 'scroll'">
                    <MyColorPicker v-model='currentModal.style.goodsbgcolor' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="商品标题：">
                    <MyColorPicker v-model='currentModal.style.goodscolor' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="商品副标题：" v-if="currentModal.style.listtype == 'list'">
                    <MyColorPicker v-model='currentModal.style.subtitlecolor' default='#969696'></MyColorPicker>
                </form-item>

                <form-item label="倒计时："  v-if="currentModal.params.showacttitle=='1'&&currentModal.params.activityGoodsType==='0'">
                    <div class="bg-color">
                        <form-item label="文字颜色：" :label-width="80" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.textcolor' default='#FFFFFF'></MyColorPicker>
                        </form-item>
                        <form-item label="边框颜色：" :label-width="80" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.numcolor' default='#ff3c29'></MyColorPicker>
                        </form-item>
                        <form-item label="背景颜色：" :label-width="80" class="mb-0">
                            <MyColorPicker v-model='currentModal.style.countbgcolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                    </div>
                </form-item>

                <form-item label="价格标签：" v-if="currentModal.params.activityGoodsType!=='0'&&currentModal.params.listtype!=='list'">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showtag'>
                        <div  v-if='currentModal.params.showtag==1'>
                            <div class='input-reset mb-20'>
                                <span class='label'>显示文字：</span>
                                <MyInputWithReset :maxLength="4" placeholder='秒杀价' :emptySubmit="false" default="秒杀价"
                                                v-model='currentModal.params.tagtext'></MyInputWithReset>
                            </div>
                            <div class='input-reset mb-20'>
                                <span class='label'>文字颜色：</span>
                                <MyColorPicker v-model='currentModal.style.tagtextcolor'
                                        :default='isScroll?"#ffffff":"#ff3c29"'></MyColorPicker>
                            </div>
                            <div class='input-reset mb-0' v-if="currentModal.style.listtype=='scroll'">
                                <span class='label'>背景颜色：</span>
                                <MyColorPicker v-model='currentModal.style.tagbgcolor'
                                        default='#ff3c29'></MyColorPicker>
                            </div>
                            <div class='input-reset mb-0' v-if="currentModal.style.listtype=='list'">
                                <span class='label'>边框颜色：</span>
                                <MyColorPicker v-model='currentModal.style.tagbordercolor'
                                        default='#ff3c29'></MyColorPicker>
                            </div>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="秒杀价格：">
                    <MyColorPicker v-model='currentModal.style.seckillcolor' default='#ff3c29'></MyColorPicker>
                </form-item>

                <form-item label="商品原价：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showprice'>
                        <MyColorPicker v-model='currentModal.style.pricecolor'
                                       default='#969696'></MyColorPicker>
                    </MyRadioGroup>
                </form-item>

                <form-item label="商品销量：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showsales'>
                        <div class='input-reset mb-20' v-if='currentModal.params.showsales==1'>
                            <span class='label'>显示文字：</span>
                            <MyInputWithReset placeholder='销量' default="销量"
                                              v-model='currentModal.params.salestext'></MyInputWithReset>
                        </div>
                        <MyColorPicker v-model='currentModal.style.salescolor' v-if='currentModal.params.showsales==1'
                                       default='#969696'></MyColorPicker>
                    </MyRadioGroup>
                </form-item>

                <form-item label="购买按钮：" v-if="currentModal.style.listtype == 'list'">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showbtn'>
                        <div  v-if='currentModal.params.showbtn==1'>
                            <div class='input-reset mb-20'>
                                <span class='label'>显示文字：</span>
                                <MyInputWithReset placeholder='去购买' default="马上抢"
                                                v-model='currentModal.params.btntext'></MyInputWithReset>
                            </div>
                            <div class='input-reset mb-20'>
                                <span class='label'>文字颜色：</span>
                                <MyColorPicker v-model='currentModal.style.btntextcolor'
                                        default='#ffffff'></MyColorPicker>
                            </div>
                            <div class='input-reset'>
                                <span class='label'>按钮颜色：</span>
                                <MyColorPicker v-model='currentModal.style.btncolor'
                                        default='#ff3c29'></MyColorPicker>
                            </div>
                        </div>
                    </MyRadioGroup>
                </form-item>

                <form-item label="秒杀角标：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showbadge'>
                        <!-- 商品角标的子模块 -->
                        <div  v-if='currentModal.params.showbadge==1'>
                            <div class='input-reset mb-20'>
                                <span class='label'>显示文字：</span>
                                <MyInputWithReset placeholder='限时秒杀' default="限时秒杀"
                                                v-model='currentModal.params.badgetext'></MyInputWithReset>
                            </div>
                            <div class='input-reset mb-20'>
                                <span class='label'>文字颜色：</span>
                                <MyColorPicker v-model='currentModal.style.badgetextcolor'
                                        default='#ffffff'></MyColorPicker>
                            </div>
                            <div class='input-reset mb-20'>
                                <span class='label'>角标图标：</span>
                                 <MyAddImgImg style="display:inline-block;" size='mini' type='icon'
                                         v-model='currentModal.params.badgeicon'
                                         @change='refreshCurrentModal'></MyAddImgImg>
                            </div>
                            <div class='input-reset mb-20'>
                                <span class='label'>角标颜色：</span>
                                <MyColorPicker v-model='currentModal.style.badgecolor'
                                        default='#ffffff'></MyColorPicker>
                            </div>
                            <div class='input-reset'>
                                <span class='label'>背景颜色：</span>
                                <MyColorPicker v-model='currentModal.style.badgebgcolor'
                                        default='#ff3c29'></MyColorPicker>
                            </div>
                        </div>
                    </MyRadioGroup>
                </form-item>
            </MyCollapse>
               <div style="padding-top:20px;">
                    <form-item label="上间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px'
                                            v-model='currentModal.style.margintop'></MyDraggableProgress>
                    </form-item>
                    <form-item label="下间距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px'
                                            v-model='currentModal.style.marginbottom'></MyDraggableProgress>
                    </form-item>
                    <form-item label="左右边距：">
                        <MyDraggableProgress :min='0' :max='50' unit='px'
                                            v-model='currentModal.style.marginleft'></MyDraggableProgress>
                    </form-item>
                    <form-item label="上边角：">
                        <MyDraggableProgress :min='0' :max='50' unit='px'
                                            v-model='currentModal.style.topradius'></MyDraggableProgress>
                    </form-item>
                    <form-item label="下边角：">
                        <MyDraggableProgress :min='0' :max='50' unit='px'
                                            v-model='currentModal.style.bottomradius'></MyDraggableProgress>
                    </form-item> 
               </div>
        </i-form>
    </div>
</template>

<script>
    import mixin from './mixin.js';

    export default {
        mixins: [mixin],
        name: 'search',
        components: {
            SelectActivity: () => import('./activity/SelectActivity'),
            GoodSelector: () => import ("./activity/SelectGood.vue"),
        },
        data() {
            return {
                id: 'seckill',
                linkInfo: {
                    name: '',
                    url:' '
                },
                addGoodsType: [
                    {
                        label: '手动添加',
                        id: '0'
                    }
                ],
                bgstyle: [
                    {
                        id: 'color',
                        label: '背景颜色',
                        thumb: require('@/assets/image/example/seckill/bg_color.png')
                    }, {
                        id: 'img',
                        label: '背景图片',
                        thumb: require('@/assets/image/example/seckill/bg_img.png')
                    }
                ],
                titlebg: [{
                    id: 'color',
                    label: '颜色',
                    thumb: require('@/assets/image/example/seckill/title_color.png')
                }, {
                    id: 'img',
                    label: '图片',
                    thumb: require('@/assets/image/example/seckill/title_bg.png')
                }, {
                    id: 'transparent',
                    label: '透明'
                }],
                titleType: [
                    {
                        label: '文字+图标',
                        id: 'texticon'
                    },
                    {
                        label: '标题图片',
                        id: 'img'
                    }
                ],
                titleWeight: [
                    {
                        label: '常规体',
                        id: 'normal'
                    },
                    {
                        label: '加粗体',
                        id: 'bold'
                    }
                ],
                moreBtn: [
                    {
                        label: '显示',
                        id: '1',
                        thumb: require('@/assets/image/example/seckill/more.png')
                    }, {
                        label: '不显示',
                        id: '0'
                    }
                ],
                showBtn: [
                    {
                        label: '显示',
                        id: '1'
                    }, {
                        label: '不显示',
                        id: '0'
                    }
                ],
                activityGoodsType: [
                    {
                        label: '商户',
                        id: '0'
                    },
                    {
                        label: '平台',
                        id: '1'
                    }
                ],
            }
        },
        computed: {
            listType() {
                let list = [
                    {
                        label: '滑动',
                        icon: 'iconfont icon-zujian-shangpinyushou-biaotiyixiasan',
                        id: 'scroll'
                    },
                    {
                        label: '列表',
                        icon: 'iconfont icon-zujian-shangpinzu-shangpinliebiao',
                        id: 'list',
                    },
                ];
                return list;
            },
            isScroll(){
                return this.currentModal.style.listtype == 'scroll'
            },
        },
        methods: {
            changType(type) {
                console.log(type,'type>>>>>>');
                if (type === '0') {
                    this.currentModal.style.textcolor='#ff3c29'
                } else {
                    this.currentModal.style.textcolor='#ffffff'
                }
            },
            changStyle(e){
                if(e=='scroll') {
                    this.currentModal.style.tagtextcolor='#ffffff'
                    this.currentModal.style.morecolor='#ffffff'
                } else {
                    this.currentModal.style.tagtextcolor ='#ff3c29'
                    this.currentModal.style.morecolor='#969696'
                }
            },
            changeTitleImg(val) {
                if(val) {
                    this.$utils.getImgSize(this.$utils.media(val)).then(res=>{
                        this.currentModal.params.titleimgwidth = 60 / res.height * res.width
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './common.scss';
    .mb-20 {
        margin-bottom: 20px !important;
    }
    .seckill {
        /deep/ .radio-group {
            .content {
                padding: 20px;
            }
        }

        .seckill-tip {
            /deep/ .icon-shili {
                padding-left: 6px;
            } 
        }

        /deep/ .hint-text {
            .content {padding: 0;}
        }

        .input-reset {
            display: flex;
            flex-wrap: nowrap;
            margin-bottom: 0;

            .label {
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 14px;
                color: #262B30;
                margin-right: 6px;
            }
        }
        .bg-color {
            padding: 20px;
            .ivu-form-item {
                margin-bottom: 20px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
        /deep/ .ivu-form .ivu-form-item.marginB_10 {
            margin-bottom: 10px;
        }
    }

      .body {
            box-sizing: border-box;
            display: flex;
            /deep/ .ivu-input:not(:hover) {
                border-left-color: #fff;
            }
            /deep/ .ivu-input.ivu-input-disabled {
                color: #515a6e;
                background: #fff;
            }
            /deep/ .ivu-input-group-append {
                padding-left: 16px;
                padding-right: 16px;
                color: $brand-color;
                cursor: pointer;
                padding: 0;
            }
            .ivu-btn {
                .ivu-icon {
                    color: #515a6e!important;
                }

                &:hover {
                    border: 1px solid #2D8CF0;
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
</style>
