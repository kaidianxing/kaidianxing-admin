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
    <div class="preview-index">
        <div class="preview-title">消费奖励预览</div>
        <div class="preview-box">
            <div class="mask"></div>
            <div class="coupon-box" :class="popup_type == '0'?'':'newBg'">
                <div class="activity-name" v-if="popup_type == '0'">消费奖励</div>
                <div class="coupon-box-content" :class="popup_type == '0'?'':'newBg'">
                    <div class="top-bg" v-if="popup_type == '0'"></div>
                    <div class="scroll-box" :class="popup_type == '0'?'':'newBg'">
                        <ul class="coupon-list" v-if="new Set(reward).has('1') && selector.data.length > 0">
                            <li class="item" :class="popup_type == '0'?'':'newBg'"
                                v-for="(item, index) in selector.data" :key="index">
                                <div class="item-left">
                                    <span class="unit" :class="popup_type == '0'?'':'newBg'" v-if="item.coupon_sale_type === '1'">￥</span>
                                    <span class="price" :class="popup_type == '0'?'':'newBg'" v-if="item.coupon_sale_type === '1'">{{item.discount_price }}</span>
                                    <span class="price" :class="popup_type == '0'?'':'newBg'" v-if="item.coupon_sale_type === '2'">{{parseFloat(item.discount_price)}}</span>
                                    <span class="unit" :class="popup_type == '0'?'':'newBg'" v-if="item.coupon_sale_type === '2'">折</span>
                                </div>
                                <div class="item-right">
                                    <div class="tit" :class="popup_type == '0'?'':'newBg'">
                                        {{ item.coupon_name }}
                                    </div>
                                    <div class="desc" :class="popup_type == '0'?'':'newBg'">
                                        {{ item.content }}
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="other" v-if="new Set(reward).has('2')">
                            <div class="other-tit" :class="popup_type == '0'?'':'newBg'">
                                <div class="line" v-if="popup_type == '0'">
                                    <div class="line-item" v-for="index of 10" :key="index"></div>
                                </div>
                                <div class="text" v-if="popup_type == '0'">积分奖励</div>
                                <div class="line" v-if="popup_type == '0'">
                                    <div class="line-item" v-for="index of 10" :key="index"></div>
                                </div>
                            </div>
                            <div class="item" :class="popup_type == '0'?'':'newBg'">
                                <div class="item-left">
                                        <span class="price" :class="popup_type == '0'?'':'newBg'">
                                            {{ preview_credit.number }}
                                        </span>
                                    <span class="unit" :class="popup_type == '0'?'':'newBg'">积分</span>
                                </div>
                                <div class="item-right">
                                    <div class="tit" :class="popup_type == '0'?'':'newBg'">
                                        {{ preview_credit.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="other" v-if="new Set(reward).has('3')">
                            <div class="other-tit" :class="popup_type == '0'?'':'newBg'">
                                <div class="line" v-if="popup_type == '0'">
                                    <div class="line-item" v-for="index of 10" :key="index"></div>
                                </div>
                                <div class="text" v-if="popup_type == '0'">余额奖励</div>
                                <div class="line" v-if="popup_type == '0'">
                                    <div class="line-item" v-for="index of 10" :key="index"></div>
                                </div>
                            </div>
                            <div class="item" :class="popup_type == '0'?'defaultBg':'newBg'">
                                <div class="item-left">
                                    <span class="unit" :class="popup_type == '0'?'':'newBg'">￥</span>
                                    <span class="price" :class="popup_type == '0'?'':'newBg'">{{parseFloat(preview_balance.number)}}</span>
                                </div>
                                <div class="item-right">
                                    <div class="tit" :class="popup_type == '0'?'':'newBg'">
                                        {{ preview_balance.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="other" v-if="new Set(reward).has('4')">
                            <div class="other-tit" :class="popup_type == '0'?'':'newBg'">
                                <div class="line" v-if="popup_type == '0'">
                                    <div class="line-item" v-for="index of 10" :key="index"></div>
                                </div>
                                <div class="text" v-if="popup_type == '0'">红包奖励</div>
                                <div class="line" v-if="popup_type == '0'">
                                    <div class="line-item" v-for="index of 10" :key="index"></div>
                                </div>
                            </div>
                            <div class="item" :class="popup_type == '0'?'defaultBg':'newBg'">
                                <div class="item-left">
                                    <span class="unit" :class="popup_type == '0'?'':'newBg'">￥</span>
                                    <span class="price" :class="popup_type == '0'?'':'newBg'">{{parseFloat(preview_redpacket.number)}}</span>
                                </div>
                                <div class="item-right">
                                    <div class="tit" :class="popup_type == '0'?'':'newBg'">
                                        {{ preview_redpacket.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Preview",
        components: {},
        props: {
            popup_type:{
                type: String,
                default: ''
            },
            selector: {
                type: Object,
                default: () => {}
            },
            preview_credit: {
                type: Object,
                default: () => {}
            },
            preview_balance: {
                type: Object,
                default: () => {}
            },
            preview_redpacket: {
                type: Object,
                default: () => {}
            },
            reward: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {}
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {},
    }
</script>

<style lang="scss" scoped>
    .preview-index {
        width: 380px;
        height: calc(100vh - 110px - 20px);
        padding-bottom: 20px;
        box-sizing: border-box;
        overflow-y: scroll;
        background-color: #fff;
        flex-shrink: 0;
        margin-right: 20px;
        margin-top: 20px;
        .preview-title {
            padding: 40px 0;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            line-height: 22px;
        }
        .preview-box {
            transform: scale(0.8);
            transform-origin: top;
            width: 375px;
            height: 667px;
            margin: 0 auto;
            box-shadow: 0px 4px 8px rgba(133, 148, 162, 0.3);
            border-radius: 6px;
            background: url('~@/assets/image/newGifts/preview-bg.png') no-repeat center;
            background-size: cover;
            position: relative;
            .mask {
                position: absolute;
                top: 64px;
                left: 0;
                width: 100%;
                height: 603px;
                background-color: rgba(0, 0, 0, 0.6);
            }
            .coupon-box {
                position: relative;
                width: 375px;
                height: 512px;
                background-size: cover;
                top: 64px;
                background: url('~@/assets/image/newGifts/coupon-bg.png') no-repeat center;
                &.newBg {
                    top: 93px;
                    background: url('~@/assets/image/newGifts/consumption-new-bg.png') no-repeat center;
                }
                .activity-name {
                    position: absolute;
                    top: 160px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: #ffdd2a;
                    font-weight: 500;
                    font-size: 36px;
                    line-height: 50px;
                }
                .coupon-box-content {
                    position: absolute;
                    top: 214px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 240px;
                    //height: 240px;
                    border-radius: 4px;
                    overflow: hidden;
                    &.newBg{
                        top: 224px;
                        height: 168px;
                    }
                    .top-bg {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 240px;
                        height: 10px;
                        z-index: 1;
                        background: url('~@/assets/image/consumeReward/coupon-top-bg.png') no-repeat center;
                        background-size: cover;
                    }
                    .scroll-box {
                        width: 240px;
                        height: 240px;
                        border-radius: 4px;
                        overflow-y: auto;
                        &::-webkit-scrollbar {
                            display: none;
                        }
                        &.newBg {
                            height: 168px;
                        }
                    }
                    .item {
                        height: 68px;
                        border-radius: 4px;
                        display: flex;
                        overflow: hidden;
                        margin-bottom: 8px;
                        background: url('~@/assets/image/newGifts/coupon-bg1.png') no-repeat center;
                        background-size: cover;
                        &.newBg {
                            background: url('~@/assets/image/newGifts/coupon-bg2.png') no-repeat center;
                            background-size: cover;
                        }
                        &:last-child {
                            margin-bottom: 0;
                        }
                        .item-left {
                            display: flex;
                            justify-content: center;
                            width: 100px;
                            flex-shrink: 0;
                            .unit {
                                font-size: 12px;
                                line-height: 68px;
                                color: #ff3c29;
                                transform: translateY(3px);
                                &.newBg {
                                    color: #FFFFFF;
                                }
                            }
                            .price {
                                padding-left: 4px;
                                padding-right: 4px;
                                font-weight: bold;
                                font-size: 24px;
                                line-height: 68px;
                                color: #ff3c29;
                                &.newBg {
                                    color: #FFFFFF;
                                    font-size: 22px;
                                }
                            }
                        }
                        .item-right {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            padding-left: 14px;
                            .tit {
                                width: 110px;
                                font-size: 12px;
                                line-height: 17px;
                                color: #212121;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                &.newBg {
                                    color: #FFFFFF;
                                }
                            }
                            .desc {
                                width: 110px;
                                margin-top: 2px;
                                font-size: 12px;
                                line-height: 17px;
                                color: #969696;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                &.newBg {
                                    color: #FFFFFF;
                                }
                            }
                        }
                    }
                    .other {
                        .other-tit {
                            padding-top: 16px;
                            padding-bottom: 8px;
                            padding-top: 16px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            &.newBg{
                                padding-top: 0;
                            }
                            .line {
                                display: flex;
                                align-items: center;
                                .line-item {
                                    width: 4px;
                                    height: 2px;
                                    border-radius: 1px;
                                    background-color: #ffdd2a;
                                    margin-right: 4px;
                                    &:first-child {
                                        width: 3px;
                                    }
                                    &:last-child {
                                        margin-right: 0;
                                        width: 3px;
                                    }
                                }
                            }
                            .text {
                                padding-left: 10px;
                                padding-right: 10px;
                                font-weight: 500;
                                font-size: 14px;
                                line-height: 20px;
                                color: #ffdd2a;
                                &.newBg {
                                    color: #FFFFFF;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>