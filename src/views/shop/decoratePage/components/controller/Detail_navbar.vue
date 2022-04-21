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
    <div class="detail_navbar" v-if='currentModal.id=="detail_navbar"&&lazyLoad'>
        <i-form :label-width="120" ref='detail_navbar' :model="currentModal" :rules="validator">
            <MyCollapse>
                
                <p class="form-title" slot="label">内容样式</p>
                <form-item label="图标颜色：">
                    <MyColorPicker v-model="currentModal.style.iconcolor" default="#969696"></MyColorPicker>
                </form-item>
                <form-item label="文字颜色：">
                    <MyColorPicker v-model="currentModal.style.textcolor" default="#969696"></MyColorPicker>
                </form-item>
                <form-item label="角标颜色：">
                    <MyColorPicker v-model="currentModal.style.dotcolor" default="#ff3c29"></MyColorPicker>
                </form-item>
                <form-item label="左按钮颜色：">
                    <MyColorPicker v-model="currentModal.style.cartcolor" default="#212121"></MyColorPicker>
                </form-item>
                <form-item label="右按钮颜色：">
                    <MyColorPicker v-model="currentModal.style.buycolor" default="#ff3c29"></MyColorPicker>
                </form-item>
                <form-item label="分隔线颜色：">
                    <MyColorPicker v-model='currentModal.style.dividercolor' default='#e6e7eb'></MyColorPicker>
                </form-item> 
                <form-item label="背景颜色：">
                    <MyColorPicker v-model="currentModal.style.background" default="#ffffff"></MyColorPicker>
                </form-item>
            </MyCollapse>
            <MyCollapse no-border>
                <p class="form-title" slot="label">内容</p>
                <form-item label="左侧图标：" class="content-icon">
                    <MyRadioGroup :items="hidelike" v-model="currentModal.params.hidelike">
                        <div v-if="currentModal.params.hidelike==-3">
                            <MyListNavigator
                                :label-width="70"
                                :draggabled="false"
                                onelabel
                                type="icon"
                                label2="按钮文字："
                                :value="getParams(0)"
                                @change-icon="changeIcon(0,$event)"
                                @change-link="changeLink(0,$event)"
                                @get-input="getInput(0,$event)"
                                :tabName="tabName"
                            ></MyListNavigator>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="中间图标：" class="content-icon">
                    <MyRadioGroup :items="hideshop" v-model="currentModal.params.hideshop">
                        <div v-if="currentModal.params.hideshop==-3">
                            <MyListNavigator
                                onelabel
                                :label-width="70"
                                :draggabled="false"
                                type="icon"
                                label2="按钮文字："
                                :value="getParams(1)"
                                @change-icon="changeIcon(1,$event)"
                                @change-link="changeLink(1,$event)"
                                @get-input="getInput(1,$event)"
                                :tabName="tabName"
                            ></MyListNavigator>
                        </div>
                    </MyRadioGroup>
                </form-item>
                <form-item label="右侧图标：" class="content-icon">
                    <MyRadioGroup :items="hidecart" v-model="currentModal.params.hidecart">
                        <div v-if="currentModal.params.hidecart==-3">
                            <MyListNavigator
                                onelabel
                                :label-width="70"
                                :draggabled="false"
                                type="icon"
                                label2="按钮文字："
                                :value="getParams(2)"
                                @change-icon="changeIcon(2,$event)"
                                @change-link="changeLink(2,$event)"
                                @get-input="getInput(2,$event)"
                                :tabName="tabName"
                            ></MyListNavigator>
                        </div>
                    </MyRadioGroup>
                    <kdx-hint-alert v-if="rCustomerPerm">提示：当前客服仅客服系统支持，由相应商家的客服进行接待</kdx-hint-alert>
                </form-item>

               <!-- <form-item label="客服图标：" class="content-icon alt-sp-wp">
                    <MyRadioGroup :disabled="notSelectFlgName=='hidecustomer'" :items="hidecustomer" v-model="currentModal.params.hidecustomer">
                        <div v-if="currentModal.params.hidecustomer==-3">
                            <MyListNavigator
                                onelabel
                                :label-width="70"
                                :draggabled="false"
                                type="icon"
                                label2="按钮文字："

                                :value="getParams(3)"
                                @change-icon="changeIcon(3,$event)"
                                @change-link="changeLink(3,$event)"
                                @get-input="getInput(3,$event)"
                                :tabName="tabName"
                            >

                            </MyListNavigator>
                        </div>
                        
                        <kdx-hint-alert>由客服系统提供客服服务</kdx-hint-alert>
                        
                    </MyRadioGroup>
                </form-item>-->

                <form-item label="购物车按钮：" style="margin-bottom:10px;">
                    <MyRadioGroup
                        class="cart-radio"
                        :items="hidecartbtn"
                        v-model="currentModal.params.hidecartbtn"
                    >
                        <kdx-hint-alert v-if="currentModal.params.hidecartbtn == 0">提示：此设置仅针对于可加入购物车的商品</kdx-hint-alert>
                    </MyRadioGroup>
                </form-item>
                <form-item label="购买文字：" style="margin-bottom:10px;">
                     <Input v-model="currentModal.params.textbuy" :maxlength="4" show-word-limit></Input>
                </form-item>

                <Alert style="margin-left:120px">
                    <h4>小贴士：</h4>建议左侧图标命名为3个字以内，若以4个字命名，请注意添加的图标数量不要超过2个，避免影响页面正常显示。购买按钮最多输入4个字
                </Alert>

                <form-item prop="customerlink" label="客服按钮：" style='margin-bottom:0;'>
                    <MyRadioGroup :items='customerChannelList' v-model="currentModal.params.customerChannel" key="index" @change="chooseCustomerChannel"></MyRadioGroup>
                    <kdx-hint-text>买家将通过所选渠道发起会话</kdx-hint-text>
                </form-item>
            </MyCollapse>
        </i-form>
    </div>
</template>

<script>
import mixin from './mixin.js'
export default {
    mixins: [mixin],
    name: 'detail_navbar',
    provide() {
            return {
                chooseTab: 'store,goods,liver,coupon,customLink,goodsClassify,wx_service,wxapplink'
            };
        },
    data() {
        return {
            id:'detail_navbar',
            hidecustomer:[
                {
                    label: '隐藏',
                    id: '1'
                },
                {
                    label: '收藏',
                    id: '-1'
                },
                {
                    label: '店铺',
                    id: '-2'
                },
                {
                    label: '购物车',
                    id: '0'
                },
                {
                    label: '客服',
                    id: '-4',
                },
                {
                    label: '自定义',
                    id: '-3'
                }
            ],
            hidecartbtn: [
                {
                    label: '显示',
                    id: 0
                },
                {
                    label: '隐藏',
                    id: 1
                }
            ],
            customerChannelList: [
                {
                    label: "原生客服",
                    id: "0"
                },
            ],
            rCustomerPerm: false,
            tabName: 'store,goods,liver,coupon,customLink,goodsClassify,wx_service,wxapplink'
        }
    },
    watch:{
        // "currentModal.params":{
        //     deep: true,
        //     immediate: true,
        //     // handler(){
        //     //     // 4 类选项
        //     //     const QUEUE = ['hidelike', 'hideshop', 'hidecart'];
        //     //     // 没有选中的个数
        //     //     let flg = 0;
        //     //     // 对象
        //     //     const OBJ = this.currentModal.params;
        //     //     // 临时表示用来存储过程中的标示为如果满足条件给notSelectFlgName
        //     //     let tmp = "";
        //     //     // 初始化没有选中的名字将来这一项全部要disabled
        //     //     this.notSelectFlgName = "";
        //     //     // 找出没有选中的
        //     //     QUEUE.forEach(item => {
        //     //         if(1 == OBJ[item]){
        //     //             flg++;
        //     //             tmp = item;
        //     //         }
        //     //     });
        //     //
        //     //     if(1 == flg){
        //     //         this.notSelectFlgName = tmp;
        //     //     }
        //     // }
        // }
    },
    computed: {
        hidelike() {
            let res = [
                {
                    label: '隐藏',
                    id: '1'
                },
                {
                    label: '收藏',
                    id: '0'
                },
                {
                    label: '店铺',
                    id: '-1'
                },
                {
                    label: '购物车',
                    id: '-2'
                },
                {
                    label: '自定义',
                    id: '-3'
                }
            ]
            if(this.rCustomerPerm) {
                res = [
                    {
                        label: '隐藏',
                        id: '1'
                    },
                    {
                        label: '收藏',
                        id: '0'
                    },
                    {
                        label: '店铺',
                        id: '-1'
                    },
                    {
                        label: '购物车',
                        id: '-2'
                    },
                    {
                        label: '客服',
                        id: '-4',
                    },
                    {
                        label: '自定义',
                        id: '-3'
                    }
                ];
            }
            return res
        },
        hideshop() {
            let res = [
                {
                    label: '隐藏',
                    id: '1'
                },
                {
                    label: '收藏',
                    id: '-1'
                },
                {
                    label: '店铺',
                    id: '0'
                },
                {
                    label: '购物车',
                    id: '-2'
                },
                {
                    label: '客服',
                    id: '-4'
                },
                {
                    label: '自定义',
                    id: '-3'
                }

            ]
            if(this.rCustomerPerm) {
                res = [
                    {
                        label: '隐藏',
                        id: '1'
                    },
                    {
                        label: '收藏',
                        id: '-1'
                    },
                    {
                        label: '店铺',
                        id: '0'
                    },
                    {
                        label: '购物车',
                        id: '-2'
                    },
                    {
                        label: '客服',
                        id: '-4'
                    },
                    {
                        label: '自定义',
                        id: '-3'
                    }
                ]
            }
            return res
        },
        hidecart() {
            let res = [
                {
                    label: '隐藏',
                    id: '1'
                },
                {
                    label: '收藏',
                    id: '-1'
                },
                {
                    label: '店铺',
                    id: '-2'
                },
                {
                    label: '购物车',
                    id: '0'
                },
                {
                    label: '客服',
                    id: '-4'
                },
                {
                    label: '自定义',
                    id: '-3'
                }

            ]
            if(this.rCustomerPerm) {
                res = [
                    {
                        label: '隐藏',
                        id: '1'
                    },
                    {
                        label: '收藏',
                        id: '-1'
                    },
                    {
                        label: '店铺',
                        id: '-2'
                    },
                    {
                        label: '购物车',
                        id: '0'
                    },
                    {
                        label: '客服',
                        id: '-4'
                    },
                    {
                        label: '自定义',
                        id: '-3'
                    }
                ]
            }
            return res
        },
        currentCustomer() {
            return {
                customerName: this.currentModal.params.customerWeixinName,
                link_url: this.currentModal.params.customerWeixinLink
            }
        }
    },
    methods: {

        getParams(idx) {
            if (idx == 0) {
                return {
                    title: '',
                    icon: this.currentModal.params.likeiconclass, //要显示的icon
                    subTitle: this.currentModal.params.liketext,
                    linkurl: this.currentModal.params.likelink,
                    linkurl_name: this.currentModal.params.likelink_name,
                    wxappid: this.currentModal.params.like_wxappid
                }
            } else if (idx == 1) {
                return {
                    title: '',
                    icon: this.currentModal.params.shopiconclass, //要显示的icon
                    subTitle: this.currentModal.params.shoptext,
                    linkurl: this.currentModal.params.shoplink,
                    linkurl_name: this.currentModal.params.shoplink_name,
                    wxappid: this.currentModal.params.shop_wxappid

                }
            } else if (idx == 2) {
                return {
                    title: '',
                    icon: this.currentModal.params.carticonclass, //要显示的icon
                    subTitle: this.currentModal.params.carttext,
                    linkurl: this.currentModal.params.cartlink,
                    linkurl_name: this.currentModal.params.cartlink_name,
                    wxappid: this.currentModal.params.cart_wxappid
                }
            }
        },
        changeIcon(idx, val) {
            if (idx == 0) {
                this.currentModal.params.likeiconclass = val
            } else if (idx == 1) {
                this.currentModal.params.shopiconclass = val
            } else if (idx == 2) {
                this.currentModal.params.carticonclass = val
            }
        },
        changeLink(idx, val) {
            if (idx == 0) {
                this.currentModal.params.likelink = val.url
                this.currentModal.params.likelink_name = val.name
                this.currentModal.params.like_wxappid = val.wxappid
            } else if (idx == 1) {
                this.currentModal.params.shoplink = val.url
                this.currentModal.params.shoplink_name  = val.name
                this.currentModal.params.shop_wxappid = val.wxappid
            } else if (idx == 2) {
                this.currentModal.params.cartlink = val.url
                this.currentModal.params.cartlink_name = val.name
                this.currentModal.params.cart_wxappid = val.wxappid
            }
        },
        getInput(idx, val) {
            if (idx == 0) {
                this.currentModal.params.liketext = val
            } else if (idx == 1) {
                this.currentModal.params.shoptext = val
            } else if (idx == 2) {
                this.currentModal.params.carttext = val
            }
        },
        selectCustomerLink(val) {
            if(val.link) {
                this.currentModal.params.customerWeixinLink = val.link
                this.currentModal.params.customerWeixinName = val.username
                this.currentModal.params.customerlink = val.link
            }else {
                this.currentModal.params.customerWeixinLink = ""
                this.currentModal.params.customerWeixinName = ""
                this.currentModal.params.customerlink = ""
            }
        },
        chooseCustomerChannel(val) {
            console.log(val,'currentModal.params.customerChannel>>>>');
            if (val === '0') {
                this.currentModal.params.customerlink = 'wx_service'
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import './common.scss';
.content-icon {
    /deep/ .right-input {
        width: 257px;
    }
}

.cart-radio {
    /deep/ .content {
        margin-top: 0;
        padding: 0;
        background-color: #fff;
        .custom-form-item {
            margin-top: 10px;
            padding: 10px;
            background-color: #F4F6F8;
        }
    }

    
}
/deep/.alt-sp-wp{
    .content{
        padding: 0;
    }
}
</style>