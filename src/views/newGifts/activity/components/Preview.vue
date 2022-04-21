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
    <div class="left">
        <div class="preview-title">新人送礼预览</div>
        <div class="preview-box">
            <div class="mask"></div>
            <div class="coupon-box" :class="p_model.popup_type == '0'?'':'newBg'">
                <div class="activity-name" v-if="p_model.popup_type == '0'">新人专享</div>
                <div class="coupon-box-content" :class="p_model.popup_type == '0'?'':'newBg'">
                    <div class="top-bg" v-if="model.popup_type == '0'"></div>
                    <div class="scroll-box">
                        <ul
                            class="coupon-list"
                            v-if="
                                new Set(model.gifts).has('1') &&
                                    selector.data.length > 0
                            "
                        >
                            <li
                                class="item"
                                v-for="(item, index) in selector.data"
                                :key="index"
                            >
                                <div class="item-left">
                                    <span
                                        class="unit"
                                        v-if="item.coupon_sale_type === '1'"
                                    >
                                        ￥
                                    </span>
                                    <span class="price">
                                        {{ parseFloat(item.discount_price) }}
                                    </span>
                                    <span
                                        class="unit"
                                        v-if="item.coupon_sale_type === '2'"
                                    >
                                        折
                                    </span>
                                </div>
                                <div class="item-right">
                                    <div class="tit">
                                        {{ item.coupon_name }}
                                    </div>
                                    <div class="desc">
                                        {{ item.content }}
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div class="other" v-if="new Set(model.gifts).has('2')">
                            <div class="other-tit" :class="p_model.popup_type == '0'?'':'newBg'">
                                <div class="line" v-if="p_model.popup_type == '0'">
                                    <div
                                        class="line-item"
                                        v-for="index of 10"
                                        :key="index"
                                    ></div>
                                </div>
                                <div class="text" v-if="p_model.popup_type == '0'">积分奖励</div>
                                <div class="line" v-if="p_model.popup_type == '0'">
                                    <div
                                        class="line-item"
                                        v-for="index of 10"
                                        :key="index"
                                    ></div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="item-left">
                                    <span class="price">
                                        {{ preview_credit.number }}
                                    </span>
                                    <span class="unit">积分</span>
                                </div>
                                <div class="item-right">
                                    <div class="tit">
                                        {{ preview_credit.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="other" v-if="new Set(model.gifts).has('3')">
                            <div class="other-tit" :class="p_model.popup_type == '0'?'':'newBg'">
                                <div class="line" v-if="p_model.popup_type == '0'">
                                    <div
                                        class="line-item"
                                        v-for="index of 10"
                                        :key="index"
                                    ></div>
                                </div>
                                <div class="text" v-if="p_model.popup_type == '0'">余额奖励</div>
                                <div class="line" v-if="p_model.popup_type == '0'">
                                    <div
                                        class="line-item"
                                        v-for="index of 10"
                                        :key="index"
                                    ></div>
                                </div>
                            </div>
                            <div class="item">
                                <div class="item-left">
                                    <span class="unit">￥</span>
                                    <span class="price">
                                        {{ parseFloat(preview_balance.number) }}
                                    </span>
                                </div>
                                <div class="item-right">
                                    <div class="tit">
                                        {{ preview_balance.name }}
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
    props: ['p_model', 'p_preview_credit', 'p_preview_balance', 'p_selector'],
    data() {
        return {
            model: {
                title: '',
                activity_time: '1', // 必选占位符
                start_time: '',
                end_time: '',
                client_type: [],
                pick_type: '',
                gifts: ['1'],
                coupon_ids: '',
                credit: '',
                balance: '',
            },
            preview_credit: {
                name: '新人专享积分',
                number: '0',
            },
            preview_balance: {
                name: '新人赠送余额',
                number: '0.00',
            },
            selector: {
                value: false,
                data: [],
            },
        }
    },
    watch: {
        p_model: {
            handler(value) {
                this.model = {
                    ...this.model,
                    ...value,
                }
            },
            immediate: true,
            deep: true,
        },
        p_preview_credit: {
            handler(value) {
                this.preview_credit = {
                    ...this.preview_credit,
                    ...value,
                }
            },
            immediate: true,
            deep: true,
        },
        p_preview_balance: {
            handler(value) {
                this.preview_balance = {
                    ...this.preview_balance,
                    ...value,
                }
            },
            immediate: true,
            deep: true,
        },
        p_selector: {
            handler(value) {
                this.selector = {
                    ...this.selector,
                    ...value,
                }
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style scoped lang="scss">
.left {
    width: 380px;
    height: calc(100vh - 110px - 20px);
    padding-bottom: 20px;
    box-sizing: border-box;
    overflow-y: hidden;
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
        background: url('~@/assets/image/newGifts/preview-bg.png')
        no-repeat center;
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
            top: 64px;
            background: url('~@/assets/image/newGifts/coupon-bg.png') no-repeat center;
            background-size: cover;
            &.newBg{
                top: 98px;
                background: url('~@/assets/image/newGifts/newPeople-new-bg.png') no-repeat center;
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
                left: 50%;
                transform: translateX(-50%);
                width: 240px;
                border-radius: 4px;
                overflow: hidden;
                top: 214px;
                height: 240px;
                &.newBg{
                    top: 182px;
                    height: 244px;
                }
                .top-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 240px;
                    height: 10px;
                    z-index: 1;
                    background: url('~@/assets/image/newGifts/coupon-top-bg.png')
                        no-repeat center;
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
                }
                .item {
                    height: 68px;
                    border-radius: 4px;
                    display: flex;
                    overflow: hidden;
                    margin-bottom: 8px;
                    background: url('~@/assets/image/newGifts/coupon-bg1.png')
                        no-repeat center;
                    background-size: cover;
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
                        }
                        .price {
                            padding-left: 4px;
                            padding-right: 4px;
                            font-weight: bold;
                            font-size: 24px;
                            line-height: 68px;
                            color: #ff3c29;
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
                        }
                    }
                }
                .other {
                    .other-tit {
                        padding-bottom: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding-top: 16px;
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
                        }
                    }
                }
            }
        }
    }
}
</style>
