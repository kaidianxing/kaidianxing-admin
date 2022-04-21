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
    <div class='merchantinfo' :class='["merchantinfo"+componentData.params.styletype]' v-if='componentData&&componentData.id=="merchantinfo"'>
        <div class='bg-img-box'>
            <img class='bg-img' :src="getBgImg" alt="" v-if='startLoadImg'>
        </div>
        <div class="merchantinfo-head">
            <img mode='widthFix' lazy-load class='merch-thumb' :src="$utils.media(componentData.params.logo||defaultImg)" alt="">
            <div class='content'>
                <p class="title">
                    <span class='name'>{{componentData.params.name}}</span>
                    <i class="icon icon-m-share1 iconfont-m-" @click='onShare'></i>
                    <!-- <span class="focus" @click='onFocus'>+关注</span> -->
                </p>
                <div class="labels">
                    <span :class='label.type' :key='index' v-for="(label,index) in componentData.params.labels">{{label.name}}</span>
                </div>
                <p class="subtitle">{{componentData.params.description}}</p>
            </div>
        </div>
        <div class="merchantinfo-data">
            <div class='goods col'>
                <p class="num">{{componentData.params.goods_num||0}}</p>
                <p class="name">商品</p>
            </div>
            <div class='focus col'>
                <p class="num">{{componentData.params.sales_count||0}}</p>
                <p class="name">销量</p>
            </div>
            <div class='visit col'>
                <p class="num">{{componentData.params.pv_count||0}}</p>
                <p class="name">访问</p>
            </div>
        </div>
    </div>
</template>

<script>
    import mixin from './mixin.js'
    export default {
        mixins: [mixin],
        name: 'merchantinfo',
        computed: {
            getBgImg() {
                if(this.componentData.params.bgimg){
                    return this.$utils.media(this.componentData.params.bgimg)
                }
                return this.$utils.staticImg('decorate/merchant-info-bgimg.png');
            },
            defaultImg() {
                return this.$utils.staticImg('decorate/merchant_logo_default.png');
            },
        },
        methods: {
            onShare(){
                this.$emit('custom-event', {
                    target: 'merchantinfo/onShare',
                    data:this.componentData
                })
            },
            onFocus(){
                this.$emit('custom-event', {
                    target: 'merchantinfo/onFocus',
                    data:{}
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import './decorate.scss';
    .merchantinfo {
        width: 100%;
        padding: px2rpx(72) px2rpx(12) 0;
        overflow: hidden;
        margin: 0 auto;
        position: relative;
        .bg-img-box {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
            width: 100%;
            height: px2rpx(130);
            &::after {
                content: "";
                background: #000;
                position: absolute;
                background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
            }
            .bg-img {
                width: 100%;
                height: 100%;
            }
        }
        .merchantinfo-head {
            display: flex;
            width: 100%;
            flex-wrap: nowrap;
            padding: px2rpx(12);
            box-sizing: border-box;
            flex-wrap: nowrap;
            position: relative;
            background: #fff;
            border-radius: px2rpx(6) px2rpx(6) 0 0;
            .merch-thumb {
                width: px2rpx(64);
                height: px2rpx(64)!important;
                border-radius: px2rpx(6);
                margin: auto px2rpx(8) auto 0;
            }
            .content {
                width: 0;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: px2rpx(64);
                margin: auto 0;
                width: 0;
                flex: 1;
                .title {
                    display: flex;
                    flex-wrap: nowrap;
                    .name {
                        font-size: px2rpx(14);
                        line-height: px2rpx(20);
                        font-family: PingFang SC;
                        font-style: normal;
                        font-weight: 600;
                        color: #212121;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        margin: auto 0;
                        width: 0;
                        flex: 1;
                    }
                    .icon {
                        width: px2rpx(20);
                        height: px2rpx(20);
                        font-size: px2rpx(20);
                        line-height: px2rpx(20);
                        color: #212121;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        text-align: center;
                        margin: auto px2rpx(8);
                    }
                    .focus {
                        margin: auto 0;
                        width: px2rpx(54);
                        height: px2rpx(20);
                        background: #FF3C29;
                        border-radius: px2rpx(20);
                        font-weight: 500;
                        font-size: px2rpx(12);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        text-align: center;
                        color: #fff;
                    }
                }
                .labels {
                    display: flex;
                    flex-wrap: nowrap;
                    .self,
                    .auth {
                        padding:0 px2rpx(4);
                        height: px2rpx(20);
                        background: linear-gradient(132.57deg, #FF3C29 0%, #FF6F29 94.38%);
                        border-radius: px2rpx(3);
                        font-size: px2rpx(12);
                        transform: scale(0.75);
                        margin-left:px2rpx(-4);
                        text-align: center;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        color: #fff;
                        font-weight: 400;
                    }
                    .auth {
                        background: linear-gradient(107.12deg, #58A5FF 0.9%, #1A66FF 99.34%);
                    }
                }
                .subtitle {
                    font-size: px2rpx(12);
                    line-height: px2rpx(17);
                    min-height: px2rpx(17);
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: normal;
                    color: #969696;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .distance {
                height: px2rpx(48);
                flex: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .btn {
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: normal;
                    color: #FF3C29;
                    font-size: px2rpx(14);
                    padding: 0 px2rpx(11);
                    height: px2rpx(24);
                    border: px2rpx(0.5) solid #FF3C29;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    border-radius: px2rpx(14);
                    margin: auto 0;
                    white-space: nowrap;
                }
                .enter-icon-btn {
                    font-size: px2rpx(14);
                    text-align: right;
                    display: flex;
                    flex-wrap: nowrap;
                    white-space: nowrap;
                    margin-left: px2rpx(4);
                }
                .enter-btn-text,
                .enter-btn-icon {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    font-size: px2rpx(14);
                    height: px2rpx(14);
                    line-height: px2rpx(14);
                    color: #FF3C29;
                    margin: auto 0;
                }
                .enter-btn-icon {
                    transform: scale(0.8);
                    margin-left: px2rpx(4);
                }
            }
        }
        .merchantinfo-data {
            width: 100%;
            height: px2rpx(56);
            display: flex;
            flex-wrap: nowrap;
            position: relative;
            background: #fff;
            border-radius: 0 0 px2rpx(6) px2rpx(6);
            .col {
                width: 0;
                flex: 1;
                color: #212121;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .num {
                    font-size: px2rpx(14);
                    line-height: px2rpx(20);
                    text-align: center;
                }
                .name {
                    font-size: px2rpx(12);
                    line-height: px2rpx(17);
                    text-align: center;
                }
            }
            .focus {
                position: relative;
                &::before,
                &::after {
                    position: absolute;
                    content: '';
                    width: 0;
                    height: px2rpx(16);
                    top: 50%;
                    transform: translate(0, -50%) scaleX(0.5);
                }
                &::before {
                    z-index: 1;
                    border-right: px2rpx(0.5) solid #E6E7EB;
                    left: 0;
                }
                &::after {
                    border-left: px2rpx(0.5) solid #E6E7EB;
                    right: 0;
                }
            }
        }
        &.merchantinfo1 {
            padding: 0;
            .bg-img-box {
                &::after {
                    background: rgba(0,0,0,0);
                }
                .bg-img {
                    width: 100%;
                    // filter:blur(5px);
                }
            }
            .merchantinfo-head {
                background: rgba(0, 0, 0, 0);
                margin: px2rpx(17) 0 px2rpx(25);
                .title {
                    display: flex;
                    flex-wrap: nowrap;
                    .name {
                        color: #fff;
                    }
                    .icon {
                        color: #fff;
                    }
                }
                .subtitle {
                    color: #fff;
                    min-height: px2rpx(17);
                }
            }
        }
    }
</style>