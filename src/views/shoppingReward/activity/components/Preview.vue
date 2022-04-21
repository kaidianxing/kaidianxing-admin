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
        <div class="preview-title">购物奖励预览</div>
        <div class="preview-box">
            <div class="mask"></div>
            <div class="coupon-box" :class="p_model.popup_type == '0'?'':'newBg'">
                <div class="activity-name" v-if="p_model.popup_type == '0'">购物奖励</div>
                <div class="coupon-box-content" :class="p_model.popup_type == '0'?'':'newBg'">
                    <div class="top-bg" v-if="model.popup_type == '0'"></div>
                    <div class="scroll-box" :class="model.popup_type == '0'?'':'newBg'">
                        <ul
                            class="coupon-list"
                            v-if="
                                new Set(model.reward).has('1') &&
                                    selector.data.length > 0
                            "
                        >
                            <li
                                class="item" :class="model.popup_type == '0'?'':'newBg'"
                                v-for="(item, index) in selector.data"
                                :key="index"
                            >
                                <div class="item-left">
                                    <span
                                        class="unit"
                                        :class="model.popup_type == '0'?'':'newBg'"
                                        v-if="item.coupon_sale_type === '1'"
                                    >
                                        ￥
                                    </span>
                                    <span class="price" :class="model.popup_type == '0'?'':'newBg'">
                                        {{ parseFloat(item.discount_price) }}
                                    </span>
                                    <span
                                        class="unit"
                                        :class="model.popup_type == '0'?'':'newBg'"
                                        v-if="item.coupon_sale_type === '2'"
                                    >
                                        折
                                    </span>
                                </div>
                                <div class="item-right">
                                    <div class="tit" :class="model.popup_type == '0'?'':'newBg'">
                                        {{ item.coupon_name }}
                                    </div>
                                    <div class="desc" :class="model.popup_type == '0'?'':'newBg'">
                                        {{ item.content }}
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div
                            class="other"
                            v-if="new Set(model.reward).has('2')"
                        >
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
                            <div class="item" :class="model.popup_type == '0'?'':'newBg'">
                                <div class="item-left">
                                    <span class="price" :class="model.popup_type == '0'?'':'newBg'">
                                        {{ preview_credit.number }}
                                    </span>
                                    <span class="unit" :class="model.popup_type == '0'?'':'newBg'">积分</span>
                                </div>
                                <div class="item-right">
                                    <div class="tit" :class="model.popup_type == '0'?'':'newBg'">
                                        {{ preview_credit.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="other"
                            v-if="new Set(model.reward).has('3')"
                        >
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
                            <div class="item" :class="model.popup_type == '0'?'':'newBg'">
                                <div class="item-left">
                                    <span class="unit" :class="model.popup_type == '0'?'':'newBg'">￥</span>
                                    <span class="price" :class="model.popup_type == '0'?'':'newBg'">
                                        {{ parseFloat(preview_balance.number) }}
                                    </span>
                                </div>
                                <div class="item-right">
                                    <div class="tit" :class="model.popup_type == '0'?'':'newBg'">
                                        {{ preview_balance.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="other"
                            v-if="new Set(model.reward).has('4')"
                        >
                            <div class="other-tit" :class="p_model.popup_type == '0'?'':'newBg'">
                                <div class="line" v-if="model.popup_type == '0'">
                                    <div
                                        class="line-item"
                                        v-for="index of 10"
                                        :key="index"
                                    ></div>
                                </div>
                                <div class="text" v-if="model.popup_type == '0'">红包奖励</div>
                                <div class="line" v-if="model.popup_type == '0'">
                                    <div
                                        class="line-item"
                                        v-for="index of 10"
                                        :key="index"
                                    ></div>
                                </div>
                            </div>
                            <div class="item" :class="model.popup_type == '0'?'':'newBg'">
                                <div class="item-left">
                                    <span class="unit" :class="model.popup_type == '0'?'':'newBg'">￥</span>
                                    <span class="price" :class="model.popup_type == '0'?'':'newBg'">
                                        {{ parseFloat(preview_redpacket.number) }}
                                    </span>
                                </div>
                                <div class="item-right">
                                    <div class="tit" :class="model.popup_type == '0'?'':'newBg'">
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
    props: ['p_model', 'p_preview_credit', 'p_preview_balance', 'p_selector','p_preview_redpacket'],
    data() {
        return {
            model: {
                title: '',
                activity_time: '1', // 必选占位符
                start_time: '',
                end_time: '',
                client_type: [],
                goods_type: '0',
                goods_id: [], // 选中商品id
                goods_cata_id: [], // 选中商品组id
                member_type: '0',
                member_info_id: [], // 选中会员信息id
                member_level_id: [], // 选中会员等级id
                member_group_id: [], // 选中会员标签id
                send_type: '',
                reward: ['1'],
                coupon_ids: '',
                credit: '',
                balance: '',
                pick_times_type: '0',
                pick_times_limit: '',
                pick_times_limit_1: '',
                pick_times_limit_2: '',
                redpacket: '', // 单个红包金额
                redpacket_time: '', // 红包有效时间
            },
            selector: {
                value: false,
                data: [],
            },
            preview_credit: {
                name: '购物奖励积分',
                number: '0',
            },
            preview_balance: {
                name: '购物奖励余额',
                number: '0.00',
            },
            preview_redpacket: {
                name: '购物奖励红包',
                number: '0.00',
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
        p_preview_redpacket: {
            handler(value) {
                this.preview_redpacket = {
                    ...this.preview_redpacket,
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
            top: 64px;
            width: 375px;
            height: 512px;
            background: url('~@/assets/image/newGifts/coupon-bg.png') no-repeat center;
            background-size: cover;
          &.newBg {
            background: url('~@/assets/image/newGifts/shopping-new-bg.png') no-repeat center;
            top: 108px;
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
                height: 240px;
                border-radius: 4px;
                overflow: hidden;
                &.newBg{
                    top: 204px;
                    height: 200px;
                    width: 220px;
                }
                .top-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 240px;
                    height: 10px;
                    z-index: 1;
                    background: url('data:image/png;base64,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')
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
                    &.newBg {
                        height: 200px;
                        width: 220px;
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
