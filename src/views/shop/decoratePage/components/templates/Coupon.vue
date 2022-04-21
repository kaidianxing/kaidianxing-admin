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
    <div class='coupon' v-if='componentData&&componentData.id=="coupon"&&getList.length' :style="{
        padding: `${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`
    }">
        <div class='coupon-list' :class="$isPC?'':'noScrollBar'">
            <ul class="item-list" :class="getClass+' '+($isPC?'':'noScrollBar')+ (' coupon-list-'+componentData.params.couponstyle)">
                <li class='item' :style="itemStyle+hasNoMargin(index)" :class="getClass" v-for='(item,index) in getList' :key='index'>
                    <div class="coupon" :style="{
                                                borderRadius: `${topBorderRadius} ${topBorderRadius} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                                            }" v-if="componentData.params.couponstyle<3" @click='receiveCoupon(item)'>
                        <p class="bg bg1" :style="coupon1Style" v-if='componentData.params.couponstyle==1'></p>
                        <p class="bg bg2" v-else>
                            <i class="border1" :style="{
                                    borderRadius: `${topBorderRadius} ${topBorderRadius} 0 0`
                                }"></i>
                            <i class="border2" :style="{
                                    borderRadius: `${topBorder2Radius} ${topBorder2Radius} 0 0`
                                }"></i>
                            <img class='bottom' :src="$utils.staticImg('coupon/bottom.png')" alt="">
                        </p>
                        <p class="name" :style='(componentData.params.couponstyle==2?"color:#ff3c29;":"")+"font-size:"+item.fontSize'><span class='rmb' v-if='item.coupon_sale_type!=2'>￥</span>{{getCouponPrice(item,'')}}<i class='price-unit' v-if='item.coupon_sale_type==2'>折</i></p>
                        <p class="demon" :style='componentData.params.couponstyle==2?"color:#ff3c29;":""'>满￥{{getCouponPrice(item.enough)}}可用</p>
                        <p class="btn" :class='{isIos:isIos}' v-if='componentData.params.couponstyle==1' @click='receiveCoupon(item)'>立即领取</p>
                        <p class="btn btn2" :class='{isIos:isIos}' v-else>立即领取</p>
                    </div>
                    <div class="coupon3" :class="(componentData.params.couponcolor||'red')+' '+getClass" :style='coupon3Style' v-if='componentData.params.couponstyle==3' @click='receiveCoupon(item)'>
                        <div class="left-part">
                            <div class="top">
                                <span class='rmb' v-if='item.coupon_sale_type!=2'>￥</span><span class='num' :style='"font-size:"+item.fontSize'>{{getCouponPrice(item,'')}}</span><i class='price-unit' v-if='item.coupon_sale_type==2'>折</i>
                            </div>
                            <div class="mid">满{{getCouponPrice(item.enough)}}可用</div>
                        </div>
                        <div class="right-part" v-if='getClass!="three"'>
                            <p class='text'>领取</p>
                        </div>
                    </div>
                    <div class="coupon4" :class="(componentData.params.couponcolor||'red')+' '+getClass" :style='coupon4Style' v-if='componentData.params.couponstyle==4' @click='receiveCoupon(item)'>
                        <div class="leftPart">
                            <p class="price">
                                <span class='num' :style='"font-size:"+item.fontSize'><i class='rmb' v-if='item.coupon_sale_type!=2'>￥</i>{{getCouponPrice(item,'')}}<i class='price-unit' v-if='item.coupon_sale_type==2'>折</i></span>
                            </p>
                            <p class="tip">满{{getCouponPrice(item.enough)}}可用</p>
                        </div>
                        <div class="rightPart">
                            <p class='title'>优惠券</p>
                            <div class="btn-box">
                                <p class="btn">点击领取</p>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    const couponBg = {
        red: '#FFF3F5',
        green: '#D5F9E6',
        blue: '#E6EFFF',
        orange: '#FFE2D4',
        black: '#212121',
    }
    const COUPON_NUM_MAX_LEN = { //优惠券价格长度最大值
        1: {
            1:21,
            2:9,
            3:6,
            4:8,
        },
        2: {
            1:21,
            2:9,
            3:6,
            4:8,
        },
        3: {
            1:9,
            2:6,
            3:5,
            4:6,
        },
        4: {
            1:9,
            2:6,
            3:4,
            4:5,
        },
    }
    export default {
        mixins: [mixin],
        name: 'coupon',
        computed: {
            topBorderRadius(){
                return this.px2rpx(this.componentData.style.topradius)
            },
            topBorder2Radius(){
                let r=Math.max(1,this.componentData.style.topradius-6)
                return this.px2rpx(r)
            },
            itemStyle(){
                if(this.getClass=='scroll'){
                    return 'margin-top:0;'
                }

                return `margin-top:${this.px2rpx(this.componentData.style.marginbetween,1,16)};`;
            },
            coupon1Style() {
                return `background-image: radial-gradient(circle at ${this.px2rpx(10)} ${this.px2rpx(46)} ,transparent 0%, transparent ${this.px2rpx(10)},#EAD3AC ${this.px2rpx(10)}, #EAD3AC 100%);`
            },
            coupon3Style() {
                const bgPos = {
                    1: -154,
                    2: -74,
                    3: -70,
                    4: -74
                }
                let x = bgPos[this.componentData.params.num_row]
                return `
                        background-image: radial-gradient(circle at ${this.px2rpx(10)} ${this.px2rpx(46)} ,transparent 0%, transparent ${this.px2rpx(10)},${couponBg[this.componentData.params.couponcolor||'red']} ${this.px2rpx(10)}, ${couponBg[this.componentData.params.couponcolor||'red']} 100%);
                        background-position: ${this.px2rpx(x)} -${this.px2rpx(46)};
                        background-size: 100%  ${this.px2rpx(162)};
                        border-radius: ${this.topBorderRadius} ${this.topBorderRadius} ${this.px2rpx(this.componentData.style.bottomradius)} ${this.px2rpx(this.componentData.style.bottomradius)};
                        `
            },
            coupon4Style() {
                return `
                background-image:url(${this.$utils.staticImg('decorate/coupon/'+this.componentData.params.couponcolor+'.png')});
                border-radius: ${this.topBorderRadius} ${this.topBorderRadius} ${this.px2rpx(this.componentData.style.bottomradius)} ${this.px2rpx(this.componentData.style.bottomradius)};
                `
            },
            isIos() {
                return /ios/i.test(this.$utils.getSystemInfoSync ?.().system)
            },
            getList() {
                let list = this.componentData.data.length ? this.componentData.data : []
                if(this.$isPC){
                    list = this.componentData.data.length ? this.componentData.data : [{
                        name: "优惠券名称",
                        desc: "满100元可用",
                        price: "10",
                        enough: 100,
                        couponid: "",
                        background: '#fd5454',
                        bordercolor: '#fd5454',
                        textcolor: '#ffffff',
                        couponcolor: '#55b5ff',
                        coupon_sale_type: 1
                    }, {
                        name: "优惠券名称",
                        desc: "满100元可用",
                        price: "9",
                        enough: 100,
                        couponid: "",
                        background: '#fd5454',
                        bordercolor: '#fd5454',
                        textcolor: '#ffffff',
                        couponcolor: '#55b5ff',
                        coupon_sale_type: 2
                    }]
                }
                let baseFontSize=48;
                if(this.componentData.params.couponstyle==3){
                    baseFontSize=56;
                }
                let maxLen=COUPON_NUM_MAX_LEN[this.componentData.params.couponstyle][this.componentData.params.num_row];
                list = list.map(item => {
                    return {
                        ...item,
                        fontSize: this.getFontSize(item.price,maxLen,baseFontSize)
                    }
                })
                return list
            },
            getClass() {
                let num_row = this.componentData.params.num_row
                if (num_row == 1) {
                    return 'one'
                } else if (num_row == 2) {
                    return 'two'
                } else if (num_row == 3) {
                    return 'three'
                } else if (num_row == 4) {
                    return 'scroll'
                }
                return 'one'
            }
        },
        methods: {
            hasNoMargin(index){
                if(this.componentData.params.num_row<4){
                    return index<this.componentData.params.num_row?'margin-top:0;':''
                }
                return ''
            },
            /**
             * price //当前价格
             * maxWidth//最大宽度，容纳的正常尺寸数字个数
             */
            getFontSize(price, maxLen = 1,fontSize=48) {
                price = price + '';
                let len = price.length || 1;
                if (price.indexOf('.') > -1) {
                    len = len - 0.5; //小数点算半个数字
                }
                if(this.componentData.params.num_row!=4){
                    if(this.componentData.style.marginleft>20&&this.componentData.style.marginleft<40){
                        len=len+1;
                    }else if(this.componentData.style.marginleft>=40&&this.componentData.style.marginleft<60){
                        len=len+2;
                    }else if(this.componentData.style.marginleft>=60){
                        len=len+3;
                    }
                }
                return this.px2rpx(Math.floor(Math.min(maxLen / len, 1)*fontSize))
            },
            getCouponPrice(item, unit = '￥') {
                let price = '';
                if (typeof item == 'object') {
                    price = item.price + '';
                } else {
                    price = item + '';
                }
                if (/\.00$/.test(price)) {
                    price = price.split('.')[0];
                }
                if (typeof item == 'object' && item.coupon_sale_type == 1) {
                    return unit + price
                }
                return price + ''
            },
            receiveCoupon(item) {
                this.$emit('custom-event', {
                    target: 'coupon/receiveCoupon',
                    data: item
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .coupon {
        box-sizing: border-box;
        border-radius: px2rpx(6);
        overflow: hidden;
        .noScrollBar::-webkit-scrollbar {
            display: none;
        }
        .coupon-list {
            overflow-x: auto;
            .item-list {
                display: flex;
                flex-wrap: wrap;
                margin-left: px2rpx(-8);
                &.two,
                &.three {
                    overflow: auto;
                    justify-content: space-between;
                }
                &.three {
                    justify-content: flex-start;
                }
                &.one {
                    flex-wrap: wrap;
                }
                &.scroll {
                    flex-wrap: nowrap;
                    overflow-x: auto;
                    overflow-y: hidden;
                    -webkit-overflow-scrolling:touch;
                    width: fit-content;
                    margin-left: 0;
                    .item:first-child {
                        padding-left: 0;
                    }
                    .item:last-child{
                        margin-right: 0;
                    }
                }
                &.coupon-list-3{
                    min-width: 100%;
                }
                .item {
                    flex-shrink: 0;
                    box-sizing: border-box;
                    overflow: hidden;
                    &.two {
                        box-sizing: border-box;
                        width: 50%;
                        padding-left: px2rpx(8);
                        margin-top: px2rpx(8);
                        &:nth-child(-n+2) {
                            margin-top: 0;
                        }
                    }
                    &.three {
                        box-sizing: border-box;
                        width: 33.33%;
                        padding-left: px2rpx(8);
                        margin-top: px2rpx(8);
                    }
                    &.one {
                        width: 100%;
                        padding-left: px2rpx(8);
                        margin-top: px2rpx(8);
                        &:nth-child(-n+1) {
                            margin-top: 0;
                        }
                    }
                    &.scroll {
                        width: px2rpx(153);
                        box-sizing: border-box;
                        padding-left: px2rpx(8);
                    }
                }
            }
            .coupon {
                width: 100%;
                height: px2rpx(103);
                position: relative;
                overflow: hidden;
                .bg1,
                .bg2 {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    background: #EAD3AC;
                    border-radius: px2rpx(2);
                    &:after {
                        content: "";
                        top: px2rpx(66);
                        left: px2rpx(6);
                        right: px2rpx(6);
                        height: 0;
                        border-bottom: 1px dashed rgba(255, 255, 255, 0.87);
                        position: absolute;
                    }
                    .round {
                        position: absolute;
                        width: px2rpx(8);
                        height: px2rpx(8);
                        top: px2rpx(63);
                        margin: 0;
                        &.left-round {
                            left: px2rpx(-4);
                        }
                        &.right-round {
                            right: px2rpx(-4);
                        }
                    }
                }
                .bg1 {
                    background: rgba(0, 0, 0, 0);
                    background-position: px2rpx(-5) px2rpx(44);
                    background-size: 100% 100%;
                }
                .bg2 {
                    padding: px2rpx(2);
                    overflow: hidden;
                    .border1 {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border: px2rpx(2) solid #E42311;
                        border-radius: px2rpx(6);
                        background: #fff;
                        display: block;
                    }
                    .border2 {
                        position: absolute;
                        top: px2rpx(4);
                        left: px2rpx(4);
                        bottom: px2rpx(4);
                        right: px2rpx(4);
                        border: px2rpx(0.5) solid $uni-border-color;
                        border-radius: px2rpx(2);
                        box-sizing: border-box;
                    }
                    .bottom {
                        position: absolute;
                        z-index: 10;
                        width: 100%;
                        height: px2rpx(37);
                        left: 0;
                        bottom: 0;
                    }
                }
                .name,
                .demon {
                    position: absolute;
                    top: px2rpx(13);
                    text-align: center;
                    left: 0;
                    right: 0;
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: bold;
                    font-size: px2rpx(24);
                    text-align: center;
                    line-height: px2rpx(24);
                    color: #A2731E;
                }
                .rmb{
                    font-size: px2rpx(12);
                }
                .price-unit {
                    font-style: normal;
                    font-size: px2rpx(12);
                    font-weight: bold;
                    display: inline-block;
                    transform: translate(0, -1px);
                }
                .demon {
                    font-weight: normal;
                    font-size: px2rpx(12);
                    line-height: px2rpx(12);
                    color: #A2731E;
                    top: px2rpx(45);
                }
                .btn {
                    position: absolute;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    color: #fff;
                    left: 50%;
                    transform: translate(-50%, 0);
                    margin: auto;
                    bottom: px2rpx(11);
                    font-size: px2rpx(14);
                    line-height: px2rpx(12);
                    color: #442D01;
                    z-index: 10;
                    white-space: nowrap;
                }
                .btn2 {
                    height: 26px;
                    bottom: px2rpx(10px);
                    background: #EFBF16;
                    border-radius: px2rpx(2);
                    left: 50%;
                    transform: translate(-50%, 0);
                    padding: px2rpx(5) px2rpx(14) px2rpx(7);
                    color: #fff;
                    white-space: nowrap;
                    margin: 0 auto;
                    &.isIos {
                        padding: px2rpx(6) px2rpx(14) px2rpx(6);
                    }
                }
                .round {
                    width: rpx(28);
                    height: rpx(28);
                    background: #fff;
                    border-radius: 50%;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    margin: auto;
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: normal;
                }
                .left-round {
                    left: rpx(-14);
                }
                .right-round {
                    right: rpx(-14);
                }
            }
            .coupon3 {
                width: 100%;
                height: px2rpx(81);
                border-radius: px2rpx(8); // background: #FEEDE5;
                position: relative;
                display: flex;
                flex-wrap: nowrap;
                .price-unit {
                    font-style: normal;
                    font-size: px2rpx(12);
                    line-height: px2rpx(39);
                    font-weight: bold;
                    display: inline-block;
                    transform: translate(0, 10%);
                    color: #FF3C29;
                    box-sizing: border-box;
                }
                .left-part {
                    display: flex;
                    flex-direction: column;
                    width: 0;
                    flex:1;
                    box-sizing: border-box;
                    justify-content: center;
                    padding: 0 0 0 0;
                    .top {
                        display: flex;
                        justify-content: center;
                        .rmb {
                            font-weight: 600;
                            font-size: px2rpx(12);
                            line-height: 1;
                            color: #FF3C29;
                            transform: translate(0, 10%);
                        }
                        .num {
                            font-weight: bold;
                            font-size: px2rpx(28);
                            line-height: px2rpx(39);
                            color: #FF3C29;
                        }
                    }
                    .mid,
                    .bot {
                        font-size: px2rpx(10);
                        line-height: px2rpx(14);
                        margin: px2rpx(2) 0;
                        color: #FF3C29;
                        text-align: center;
                    }
                }
                .right-part {
                    flex-shrink: 0;
                    flex-grow: 0;
                    width: px2rpx(40);
                    height: px2rpx(58);
                    font-size: px2rpx(12);
                    margin: auto 0;
                    color: #FF3C29;
                    writing-mode: vertical-lr;
                    text-align: center;
                    vertical-align: middle;
                    /*从左向右 从右向左是 writing-mode: vertical-rl;*/
                    writing-mode: tb-lr;
                    /*IE浏览器的从左向右 从右向左是 writing-mode: tb-rl；*/
                    border-left: px2rpx(1) dashed #FF3C29;
                    display: flex;
                    .text {
                        margin: auto;
                        letter-spacing: px2rpx(2);
                        padding-top:px2rpx(3);
                    }
                }
                &.red {
                    .left-part {
                        .top {
                            .rmb,
                            .num,.price-unit {
                                color: #FF3C29;
                            }
                        }
                        .mid,
                        .bot {
                            color: #FF3C29;
                        }
                    }
                    .right-part {
                        color: #FF3C29;
                        border-color: #FF3C29;
                    }
                }
                &.orange {
                    .left-part {
                        .top {
                            .rmb,
                            .num,.price-unit {
                                color: #FF6F29;
                            }
                        }
                        .mid,
                        .bot {
                            color: #FF6F29;
                        }
                    }
                    .right-part {
                        color: #FF6F29;
                        border-color: #FF6F29;
                    }
                }
                &.blue {
                    .left-part {
                        .top {
                            .rmb,
                            .num,.price-unit {
                                color: #367BF5;
                            }
                        }
                        .mid,
                        .bot {
                            color: #367BF5;
                        }
                    }
                    .right-part {
                        color: #367BF5;
                        border-color: #367BF5;
                    }
                }
                &.green {
                    .left-part {
                        .top {
                            .rmb,
                            .num,.price-unit {
                                color: #09C15F;
                            }
                        }
                        .mid,
                        .bot {
                            color: #09C15F;
                        }
                    }
                    .right-part {
                        color: #09C15F;
                        border-color: #09C15F;
                    }
                }
                &.black {
                    .left-part {
                        .top {
                            .rmb,
                            .num,.price-unit {
                                color: #fff;
                            }
                        }
                        .mid,
                        .bot {
                            color: #fff;
                        }
                    }
                    .right-part {
                        color: #fff;
                        border-color: #fff;
                    }
                }
                &.one {
                    overflow: hidden;
                    .price-unit{
                        line-height: px2rpx(81);
                        transform: translate(0, 5%);
                    }
                    .left-part {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        justify-content: center;
                        .top,
                        .mid {
                            display: flex;
                            justify-content: center;
                        }
                        .rmb {
                            margin: auto 0;
                            height: px2rpx(81);
                            transform: translate(0, 5%);
                        }
                        .rmb,
                        .num {
                            display: flex;
                            justify-content: center;
                            line-height: px2rpx(81);
                        }
                        .mid {
                            flex-direction: column;
                            margin-left: px2rpx(8);
                        }
                    }
                    .right-part{
                        writing-mode: horizontal-tb;
                        width: px2rpx(72);
                    }
                }
                &.two {
                    .price-unit{
                        transform: translate(0, 10%);
                    }
                    .left-part {
                        width: px2rpx(140);
                        .rmb {
                            margin: auto 0;
                            line-height: px2rpx(39);
                        }
                    }
                    .right-part{
                        width: px2rpx(32);
                    }
                }
                &.three {
                    .price-unit{
                        transform: translate(0, 3%);
                    }
                    .left-part {
                        padding: 0 px2rpx(12);
                        .top {
                            display: flex;
                            justify-content: center;
                            .rmb {
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                transform: translate(0, 3%);
                            }
                        }
                        .mid {
                            text-align: center;
                        }
                    }
                }
                &.scroll {
                    .left-part {
                        width: px2rpx(113);
                        .rmb {
                            margin: auto 0 ;
                            line-height: px2rpx(39);
                        }
                    }
                    .right-part{
                        width: px2rpx(32);
                    }
                }
            }
            .coupon4 {
                width: 100%;
                height: px2rpx(50);
                display: flex;
                flex-wrap: nowrap;
                padding-left: px2rpx(2);
                background-repeat: no-repeat;
                background-size: contain;
                overflow: hidden;
                border-radius: px2rpx(2);
                .price-unit {
                    font-style: normal;
                    font-size: px2rpx(12);
                    font-weight: bold;
                    display: inline-block;
                }
                .leftPart {
                    width: 0;
                    flex-grow: 1;
                    height: 100%;
                    background: #09C15F;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    .price {
                        font-family: PingFang SC;
                        font-style: normal;
                        display: flex;
                        justify-content: center;
                        .rmb {
                            color: #fff;
                            font-size: px2rpx(12);
                            transform: scale(0.83) translate(0,5%);
                            display: inline-block;
                            height: px2rpx(12);
                            line-height: 1;
                            font-style: normal;
                        }
                        .num {
                            color: #fff;
                            font-weight: 600;
                            font-size: px2rpx(24);
                            line-height: px2rpx(28);
                        }
                    }
                    .tip {
                        color: #fff;
                        font-size: px2rpx(12);
                        line-height: px2rpx(13);
                        transform: scale(0.75);
                        display: inline-block;
                        text-align: center;
                    }
                }
                .rightPart {
                    width: 0;
                    flex-shrink: 0;
                    flex-grow: 0;
                    height: 100%;
                    background: #D5F9E6;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    .title {
                        font-size: px2rpx(12);
                        line-height: px2rpx(17);
                        transform: scale(0.83);
                        display: inline-block;
                        margin: 0 auto;
                        text-align: center;
                    }
                    .btn-box {
                        width: 100%;
                        height: px2rpx(12);
                        position: relative;
                        margin-top: px2rpx(5);
                    }
                    .btn {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        flex: 1;
                        height: px2rpx(21);
                        white-space: nowrap;
                        line-height: px2rpx(21);
                        background: #09C15F;
                        border-radius: px2rpx(21);
                        font-size: px2rpx(12);
                        color: #fff;
                        text-align: center;
                        padding: 0 px2rpx(7);
                        margin: 0 auto;
                        transform: translate(-50%, -50%) scale(0.58);
                    }
                }
                &.red {
                    .leftPart {
                        background: #FF3C29;
                    }
                    .rightPart {
                        background: #FFF3F5;
                        .title {
                            color: #FF3C29;
                        }
                        .btn {
                            background: #FF3C29
                        }
                    }
                }
                &.orange {
                    .leftPart {
                        background: #FF6F29;
                    }
                    .rightPart {
                        background: #FFE2D4;
                        .title {
                            color: #FF6F29;
                        }
                        .btn {
                            background: #FF6F29;
                        }
                    }
                }
                &.blue {
                    .leftPart {
                        background: #367BF5;
                    }
                    .rightPart {
                        background: #E6EFFF;
                        .title {
                            color: #367BF5;
                        }
                        .btn {
                            background: #367BF5;
                        }
                    }
                }
                &.green {
                    .leftPart {
                        background: #09C15F;
                    }
                    .rightPart {
                        background: #D5F9E6;
                        .title {
                            color: #09C15F;
                        }
                        .btn {
                            background: #09C15F;
                        }
                    }
                }
                &.black {
                    .leftPart {
                        background: #212121;
                    }
                    .rightPart {
                        background: #fff;
                        .title {
                            color: #212121;
                        }
                        .btn {
                            background: #212121;
                        }
                    }
                }
                &.one {
                    .leftPart {
                        display: flex;
                        flex-direction: row;
                        .price {
                            display: flex;
                            margin-left: px2rpx(12);
                            .num {
                                display: flex;
                                justify-content: center;
                                line-height: px2rpx(50);
                            }
                            .rmb {
                                margin: auto 0;
                                transform: translate(0, 21%);
                            }
                        }
                        .tip {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            margin-left: px2rpx(8);
                        }
                    }
                    .rightPart {
                        width: px2rpx(120);
                        .title {
                            font-size: px2rpx(12);
                            transform: scale(1);
                        }
                        .btn-box {
                            width: 100%;
                            height: px2rpx(14);
                            position: relative;
                            margin-top: px2rpx(5);
                        }
                        .btn {
                            height: px2rpx(24);
                            line-height: px2rpx(24);
                            border-radius: px2rpx(24);
                            padding: 0 px2rpx(20);
                        }
                    }
                }
                &.two {
                    .leftPart {
                        .price {
                            .rmb {
                                margin: auto 0;
                            }
                        }
                    }
                    .rightPart {
                        width: px2rpx(68);
                    }
                }
                &.three {
                    .leftPart {
                        .price {
                            .rmb {
                                margin: auto 0;
                            }
                        }
                    }
                    .rightPart {
                        width: px2rpx(44);
                    }
                }
                &.scroll {
                    .leftPart {
                        .price {
                            .rmb {
                                margin: auto 0;
                            }
                        }
                    }
                    .rightPart {
                        width: px2rpx(55);
                    }
                }
            }
        }
    }
</style>