/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class='groups' v-if='currentModal.id=="groups"&&lazyLoad'>
        <i-form :label-width="110" ref='search' :model="currentModal" :rules="validator">
            <MyCollapse>
                <p class="form-title" slot='label'>组件样式</p>
                <form-item label="组件样式：">
                    <MyButtonGroup :items='listType' @change="changStyle"
                                   v-model='currentModal.params.listtype'></MyButtonGroup>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <!--<p class="form-title" slot='label'>添加拼团商品</p>
                &lt;!&ndash; 选择商品的子模块 &ndash;&gt;
                <form-item :label-width='10' prop='data'>
                    <SelectActivity activeType="groups"/>
                </form-item>-->


                <p class="form-title" slot='label'>添加拼团商品</p>
                <form-item :class="{marginB_10:currentModal.params.activityGoodsType==0}" label="商品来源：" v-if="isMultiMerchants">
                    <MyRadioGroup :items='activityGoodsType' v-model='currentModal.params.activityGoodsType' @change="changType"></MyRadioGroup>
                </form-item>
                <!-- 选择平台活动 -->
                <form-item :label-width='0' prop='data' v-if="currentModal.params.activityGoodsType==='1'">
                    <SelectActivity activeType="groups" />
                </form-item>
                <!-- 选择商户活动 -->
                <form-item :label-width='0' v-if="currentModal.params.activityGoodsType==='0'" prop='data'>
                    <good-selector type="groups" :current-modal='currentModal'></good-selector>
                </form-item>

            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>内容样式</p>
                <form-item label="组件背景：" v-if="currentModal.params.listtype == 'scroll'">
                    <MyRadioGroup :items='bgstyle' v-model='currentModal.params.bgstyle'>
                        <form-item :label-width="80" v-if="currentModal.params.bgstyle == 'img'"
                                   label="背景图片：" style="margin-bottom:0;">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='image'
                                         v-model='currentModal.params.bgimg'
                                         @change='refreshCurrentModal'></MyAddImgImg>
                            <kdx-hint-text style="margin-left: 80px;padding-top: 0;" class="hint-img-text">建议图片尺寸为750x570像素。</kdx-hint-text>
                        </form-item>
                        <form-item v-else label="背景颜色：" :label-width="80" style="margin-bottom:0;">
                            <MyColorPicker v-model='currentModal.style.bgcolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
                <form-item label="组件背景：" v-else-if="currentModal.params.listtype == 'blocktwo'">
                    <MyColorPicker v-model='currentModal.style.bgcolor' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="活动标题：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showacttitle'></MyRadioGroup>
                </form-item>

                <form-item label="标题背景：" v-if="currentModal.params.showacttitle=='1'">
                    <MyRadioGroup :items='titlebg' v-model='currentModal.params.titlebg'>
                        <form-item :label-width="80" v-if="currentModal.params.titlebg == 'img'"
                                   label="背景图片：" style="margin-bottom:0;">
                            <MyAddImgImg style="display:inline-block;" size='mini' type='image'
                                         v-model='currentModal.params.titlebgimg'></MyAddImgImg>
                            <kdx-hint-text style="margin-left: 80px;padding-top: 0;" class="hint-img-text">建议图片尺寸为750x80像素。</kdx-hint-text>
                        </form-item>
                        <form-item v-else-if="currentModal.params.titlebg == 'color'" label="背景颜色：" :label-width="80"
                                   style="margin-bottom:0;">
                            <MyColorPicker v-model='currentModal.style.titlebgcolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                    </MyRadioGroup>
                </form-item>
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
                                <Input placeholder="如：多人拼团" v-model='currentModal.params.titlename' :maxlength="5" show-word-limit style="width: 236px">
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
                <form-item label="倒计时：" v-if="currentModal.params.showacttitle=='1'&&currentModal.params.activityGoodsType==='1'">
                    <div class="bg-color">
                        <form-item label="文字颜色：" :label-width="80" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.textcolor' default='#212121'></MyColorPicker>
                        </form-item>
                        <form-item label="数字颜色：" :label-width="80" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.numcolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                        <form-item label="背景颜色：" :label-width="80" class="mb-0">
                            <MyColorPicker v-model='currentModal.style.countbgcolor' default='#ff6f29'></MyColorPicker>
                        </form-item>
                    </div>
                </form-item>
                <form-item label="查看更多：" v-if="currentModal.params.showacttitle=='1'">
                    <div class="item-bg">
                        <div class='input-reset' style="margin-bottom: 0">
                            <span class='label'>文字颜色：</span>
                            <MyColorPicker v-model='currentModal.style.morecolor' default='#969696'></MyColorPicker>
                        </div>
                    </div>
                    <kdx-hint-text>点击“查看更多”的页面链接为当前所选拼团活动的商品列表
                        <kdx-hint-tooltip type="image" class="seckill-tip" :image="moreBtn.example.thumb"/>
                    </kdx-hint-text>
                </form-item>
            </MyCollapse>
            <MyCollapse>
                <p class="form-title" slot='label'>商品样式</p>
                <form-item label="商品背景：" v-if="currentModal.params.listtype === 'scroll'">
                    <MyColorPicker v-model='currentModal.style.goodsbgcolor' default='#ffffff'></MyColorPicker>
                </form-item>
                <form-item label="商品背景：" v-else-if="currentModal.params.listtype === 'blocktwo'">
                    <MyColorPicker v-model='currentModal.style.goodsbgcolor' default='#fff2ec'></MyColorPicker>
                </form-item>
                <form-item label="商品标题：">
                    <MyColorPicker v-model='currentModal.style.goodscolor' default='#212121'></MyColorPicker>
                </form-item>
                <form-item label="商品副标题：" v-if="currentModal.params.listtype === 'list'">
                    <MyColorPicker v-model='currentModal.style.subtitlecolor' default='#969696'></MyColorPicker>
                </form-item>
                <form-item label="倒计时：" v-if="currentModal.params.showacttitle=='1'&&currentModal.params.activityGoodsType==='0'">
                    <div class="bg-color">
                        <form-item label="文字颜色：" :label-width="80" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.textcolor' default='#212121'></MyColorPicker>
                        </form-item>
                        <form-item label="数字颜色：" :label-width="80" class="mb-20">
                            <MyColorPicker v-model='currentModal.style.numcolor' default='#ff6f29'></MyColorPicker>
                        </form-item>
                        <form-item label="背景颜色：" :label-width="80" class="mb-0">
                            <MyColorPicker v-model='currentModal.style.countbgcolor' default='#ffffff'></MyColorPicker>
                        </form-item>
                    </div>
                </form-item>
                <form-item label="拼团价格：">
                    <div class="item-bg">
                        <div class='input-reset mb-20'>
                            <span class='label'>显示文字：</span>
                            <MyInputWithReset :maxLength="3" placeholder='拼团价' :emptySubmit="false" default="拼团价"
                                              v-model='currentModal.params.pricegrouptext'></MyInputWithReset>
                        </div>
                        <div class='input-reset'>
                            <MyColorPicker v-model='currentModal.style.pricegroupcolor'
                                           default='#ff3c29'></MyColorPicker>
                        </div>
                    </div>
                </form-item>
                <form-item label="商品原价：">
                    <MyRadioGroup :items='showPrice' v-model='currentModal.params.showprice'>
                        <div v-if='currentModal.params.showprice==1'>
                            <div class='input-reset mb-20'>
                                <span class='label'>显示文字：</span>
                                <MyInputWithReset :maxLength="3" placeholder='单买价' :emptySubmit="false" default="单买价"
                                                  v-model='currentModal.params.pricetext'></MyInputWithReset>
                            </div>
                            <div class='input-reset mb-20'>
                                <MyColorPicker v-model='currentModal.style.pricecolor'
                                               default='#969696'></MyColorPicker>
                            </div>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="商品销量：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showsales'></MyRadioGroup>
                </form-item>
                <form-item label="拼团角标：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showbadge'>
                        <!-- 商品角标的子模块 -->
                        <div v-if='currentModal.params.showbadge==1'>
                            <div class='input-reset mb-20'>
                                <span class='label'>显示文字：</span>
                                <MyInputWithReset :maxLength='8     ' placeholder='多人拼团' default="多人拼团"
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
                                <MyColorPicker v-model='currentModal.style.badgeiconcolor'
                                               default='#ffffff'></MyColorPicker>
                            </div>
                            <div class='input-reset'>
                                <span class='label'>背景颜色：</span>
                                <MyColorPicker v-model='currentModal.style.badgebgcolor'
                                               default='#ff6f29'></MyColorPicker>
                            </div>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="购买按钮：">
                    <MyRadioGroup :items='showBtn' v-model='currentModal.params.showbtn'>
                        <template v-if="currentModal.params.showbtn == 1">
                            <form-item label="按钮样式：" :label-width="80" class="mb-20" v-if='currentModal.params.listtype !== "scroll"'>
                                <MyButtonGroup :items='btnStyle'
                                               v-model='currentModal.params.btnstyle'></MyButtonGroup>
                            </form-item>
                            <template v-if="currentModal.params.btnstyle == 0">
                                <form-item label="显示文字：" :label-width="80" class="mb-20">
                                    <MyInputWithReset placeholder='马上拼' default="马上拼"
                                                      v-model='currentModal.params.btntext'></MyInputWithReset>
                                </form-item>
                                <form-item label="文字颜色：" :label-width="80" class="mb-20">
                                    <MyColorPicker v-model='currentModal.style.btntextcolor'
                                                   default='#ffffff'></MyColorPicker>
                                </form-item>
                            </template>
                            <form-item label="按钮颜色：" :label-width="80" style="margin-bottom: 0">
                                <MyColorPicker v-model='currentModal.style.btncolor'
                                               default='#ff6f29'></MyColorPicker>
                            </form-item>
                        </template>
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
    name: 'groups',
    components: {
        SelectActivity: () => import('./activity/SelectActivity'),
        GoodSelector: () => import ("./activity/SelectGood.vue")
    },
    data() {
        return {
            id: 'Groups',
            moreBtn: {
                example: {
                    thumb: require('@/assets/image/example/groups/activity_list.png')
                }
            },
            linkInfo: {
                name: '',
                url: ' '
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
                }, {
                    id: 'img',
                    label: '背景图片',
                }
            ],
            titlebg: [{
                id: 'color',
                label: '背景颜色',
            }, {
                id: 'img',
                label: '背景图片',
            }, {
                id: 'transparent',
                label: '背景透明'
            }],
            showBtn: [
                {
                    label: '显示',
                    id: '1'
                }, {
                    label: '不显示',
                    id: '0'
                }
            ],
            listType: [
                {
                    label: '滑动',
                    icon: 'iconfont icon-zujian-shangpinzu-huadong',
                    id: 'scroll',
                },
                {
                    label: '双列',
                    icon: 'iconfont icon-zujian-shangpinzu-lieshangpin',
                    id: 'blocktwo'
                },
                {
                    label: '列表',
                    icon: 'iconfont icon-zujian-shangpinzu-shangpinliebiao',
                    id: 'list',
                },
            ],
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
            showPrice: [
                {
                    label: '显示',
                    id: '1'
                }, {
                    label: '不显示',
                    id: '0'
                }
            ],
            btnStyle: [
                {
                    icon: 'iconfont icon-zujian-anniuchang',
                    id: '0',
                },
                {
                    icon: 'iconfont icon-yingyong-pintuan',
                    id: '1'
                },
            ],
            activityGoodsType: [
                {
                    label: '选择平台活动',
                    id: '1'
                },
                {
                    label: '选择商户活动',
                    id: '0'
                }
            ],
        };
    },
    computed: {
        isMultiMerchants(){
            return this.$store.state.config.shop_type==20;//是否多商户平台
        },
        isScroll() {
            return this.currentModal.style.listtype == 'scroll';
        }
    },
    methods: {
        changType(type) {
            if (type === '0') {
                this.currentModal.style.textcolor='#ff6f29'
                this.currentModal.style.numcolor='#ff6f29'
                this.currentModal.style.countbgcolor='#ffffff'
            } else {
                this.currentModal.style.textcolor='#212121'
                this.currentModal.style.numcolor='#ffffff'
                this.currentModal.style.countbgcolor='#ff6f29'
            }
        },
        changStyle(e) {
            console.log(e);
            if (e == 'scroll') {
                this.currentModal.style.goodsbgcolor = '#ffffff';
            } else {
                this.currentModal.style.goodsbgcolor = '#fff2ec';
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
};
</script>

<style lang="scss" scoped>
@import './common.scss';

.mb-20 {
    margin-bottom: 20px !important;
}

.groups {
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

    /deep/ .kdx-hint-text {
        .content {
            padding: 0;
        }
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

    .item-bg {
        background-color: $background-color;
        padding: 20px;
        border-radius: 2px;
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
            color: #515a6e !important;
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
