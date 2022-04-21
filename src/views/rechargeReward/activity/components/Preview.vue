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
        <div class="preview-title">充值奖励预览</div>
        <div class="preview-box">
            <div class="top-bg"></div>
            <div class="coupon-box">
                <div class="activity-name">
                    <div class="name">充值奖励</div>
                </div>
                <div v-for="(child, index) in rewardData" :key="index" class="levelCont">
                    <div
                        class="desc"
                        v-if="child.money">
                        {{ model.type === '0' ? '累计' : '单次' }}充值满
                        <span>
                            {{
                                child.money
                            }}元
                        </span>
                        享受以下奖励
                    </div>
                    <div class="coupon-box-content">
                        <div class="scroll-box">
                            <ul
                                class="coupon-list"
                                v-if="
                                new Set(child.reward).has('1') &&
                                    child.couponSelector.data.length > 0
                            "
                            >
                                <li
                                    class="item"
                                    v-for="(item, index) in child.couponSelector.data"
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
                            <div
                                class="other"
                                v-if="new Set(child.reward).has('2')"
                            >
                                <div class="item">
                                    <div class="item-left">
                                    <span class="price">
                                        {{ child.credit || 0}}
                                    </span>
                                        <span class="unit">积分</span>
                                    </div>
                                    <div class="item-right">
                                        <div class="tit">
                                            充值奖励积分
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="other"
                                v-if="new Set(child.reward).has('3')"
                            >
                                <div class="item">
                                    <div class="item-left">
                                        <span class="unit">￥</span>
                                        <span class="price">
                                        {{ parseFloat(child.balance) || 0 }}
                                    </span>
                                    </div>
                                    <div class="item-right">
                                        <div class="tit">
                                            充值奖励余额
                                        </div>
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
    props: {
        p_model: {
            type: Object,
            default: () => {}
        },
        rewardData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            model: {
                title: '',
                activity_time: '1', // 必选占位符
                start_time: '',
                end_time: '',
                client_type: ['20'],
                type: '0',
                type_0_money: '',
                type_1_money: '',
                reward: ['1'],
                coupon_ids: '',
                credit: '',
                balance: '',
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
        min-height: 667px;
        margin: 0 auto;
        box-shadow: 0px 4px 8px rgba(133, 148, 162, 0.3);
        border-radius: 6px;
        background-color: #f5f5f5;
        .top-bg {
            width: 375px;
            height: 288px;
            background: url('~@/assets/image/rechargeReward/rechargeReward-preview-bg.png')
            no-repeat left top;
        }
        .coupon-box {
            position: relative;
            margin: 8px 12px 0;
            height: 370px;
            background-color: #fff;
            border-radius: 6px;
            padding-left: 12px;
            padding-right: 12px;
            padding-bottom: 40px;
            overflow-y: auto;
            z-index: 1;
            &::-webkit-scrollbar {
                display: none;
            }
            .activity-name {
                padding-top: 8px;
                .name {
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 24px;
                    color: #212121;
                    padding-right: 10px;
                }
            }
            .levelCont {
                margin: 8px 0 16px;
            }
            .desc {
                font-size: 12px;
                line-height: 17px;
                color: #969696;
                display: flex;
                span {
                    color: #ff3c29;
                    font-weight: bold;
                    padding-left: 4px;
                    padding-right: 4px;
                }
            }
            .coupon-box-content {
                .item {
                    height: 68px;
                    border-radius: 4px;
                    display: flex;
                    overflow: hidden;
                    margin-top: 8px;
                    background: url('~@/assets/image/rechargeReward/coupon-bg.png')
                    no-repeat center;
                    background-size: cover;
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
                            width: 200px;
                            font-size: 12px;
                            line-height: 17px;
                            color: #212121;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .desc {
                            width: 200px;
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
                    margin-top: 8px;
                }
            }
        }
    }
}
</style>
