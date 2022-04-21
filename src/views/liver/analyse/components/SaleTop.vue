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
    <div class="leaderboard-comp">
        <div class="leaderboard-item goods">
            <div class="item-header">
                <div class="left">
                    <span class="iconfont icon-shopping-bag"></span>
                    商品销售TOP排行榜
                </div>

            </div>
            <div class="table">
                <div class="theader">
                    <ul>
                        <li>排行</li>
                        <li>商品</li>
                        <li>销售数量</li>
                    </ul>
                </div>
                <div class="tbody">
                    <div
                        v-if="goodsList.length <= 0"
                        class="no-data"
                    >
                        暂无数据
                    </div>
                    <template v-else>
                        <ul
                            class="tr"
                            v-for="(item, index) in goodsList"
                            :key="index"
                        >
                            <li>
                                <kdx-svg-icon
                                    type="icon-paihang-jinpai"
                                    v-if="index === 0"
                                />
                                <kdx-svg-icon
                                    type="icon-paihang-yinpai"
                                    v-else-if="index === 1"
                                />
                                <kdx-svg-icon
                                    type="icon-paihang-tongpai"
                                    v-else-if="index === 2"
                                />
                                <div
                                    class="text"
                                    v-else
                                >{{ index + 1 }}</div>
                            </li>
                            <li>
                                <div class="left">
                                    <img
                                        :src="$media(item.thumb)"
                                        alt=""
                                        @error="replaceImage"
                                    />
                                </div>
                                <div class="right">
                                    <span
                                        class="tag"
                                        v-if="item.has_option === '1'"
                                    >
                                        多
                                    </span>
                                    {{ item.title }}
                                </div>
                            </li>
                            <li>
                                <span> {{ item.total }} </span>件
                            </li>
                        </ul>
                    </template>
                </div>
            </div>
        </div>
        <div class="leaderboard-item user">
            <div class="item-header">
                <div class="left">
                    <span class="iconfont icon-database"></span>
                    用户购买力TOP排行榜
                </div>
            </div>
            <div class="table">
                <div class="theader">
                    <ul>
                        <li>排行</li>
                        <li>用户</li>
                        <li>消费额</li>
                    </ul>
                </div>
                <div class="tbody">
                    <div
                        v-if="moneyList.length <= 0"
                        class="no-data"
                    >
                        暂无数据
                    </div>
                    <template v-else>
                        <ul
                            class="tr"
                            v-for="(item, index) in moneyList"
                            :key="index"
                        >
                            <li>
                                <kdx-svg-icon
                                    type="icon-paihang-jinpai"
                                    v-if="index === 0"
                                />
                                <kdx-svg-icon
                                    type="icon-paihang-yinpai"
                                    v-else-if="index === 1"
                                />
                                <kdx-svg-icon
                                    type="icon-paihang-tongpai"
                                    v-else-if="index === 2"
                                />
                                <div
                                    class="text"
                                    v-else
                                >{{ index + 1 }}</div>
                            </li>
                            <li>
                                <div class="left">
                                    <img
                                        :src="item.avatar || require('@/assets/image/replace/avatar.png')"
                                        alt=""
                                        @error="replaceImage($event, 'avatar')"
                                    />
                                </div>
                                <div class="right">
                                    <div
                                        class="name line-hide"
                                    >{{ item.nickname || '-' }}</div>
                                    <div class="icon">
                                        <span
                                            class="iconfont icon-H"
                                            v-if="item.source === '2'"
                                        ></span>
                                        <span
                                            class="iconfont icon-weixin"
                                            v-if="item.source === '1'"
                                        ></span>
                                        <span
                                            class="iconfont icon-weixinxiaochengxu"
                                            v-if="item.source === '3'"
                                        ></span>
                                        <span
                                            class="iconfont icon-zhifubaoxiaochengxu"
                                            v-if="item.source === '5'"
                                        ></span>
                                        <span
                                            class="iconfont icon-douyin"
                                            v-if="item.source === '4'"
                                        ></span>
                                    </div>
                                </div>
                            </li>
                            <li>￥<span>{{ item.pay_price }}</span></li>
                        </ul>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        goodsList: {
            type: Array,
            default: () => []
        },
        moneyList: {
            type: Array,
            default: () => []
        },
    },

}
</script>

<style scoped lang="scss">
.leaderboard-comp {
    display: flex;
    .leaderboard-item {
        flex: 1;
        background-color: #fff;
        border-radius: 2px;
        margin-right: 10px;
        padding-left: 20px;
        padding-right: 20px;
        width: 50%;
        &:last-child {
            margin-right: 0;
        }
        .item-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 20px;
            padding-bottom: 10px;
            .left {
                font-weight: bold;
                font-size: 14px;
                line-height: 20px;
                color: #262b30;
                display: flex;
                align-items: center;
                .iconfont {
                    margin-right: 6px;
                }
                .icon-shopping-bag {
                    color: $brand-color;
                }
                .icon-database {
                    color: #ff9900;
                }
            }
            .right {
                display: flex;
                align-items: center;
                font-size: 12px;
                line-height: 16px;
                color: $brand-color;
                cursor: pointer;
            }
        }
        .table {
            .tbody {
                ul {
                    &:hover {
                        background-color: $brand-hover;
                    }
                }
                .no-data {
                    padding: 10px;
                    text-align: center;
                }
            }
            ul {
                display: flex;
                align-items: center;
                li:nth-child(1) {
                    /*padding-left: 20px;*/
                    width: 65px;
                    flex-shrink: 0;
                    text-align: center;
                }
                li:nth-child(2) {
                    flex: 1;
                }
                li:nth-child(3) {
                    padding-right: 20px;
                    flex-shrink: 0;
                }
            }
            .theader {
                ul {
                    height: 40px;
                    font-weight: bold;
                    font-size: 14px;
                    line-height: 20px;
                    color: #262b30;
                }
            }
            .tbody {
                ul {
                    padding-top: 10px;
                    padding-bottom: 10px;
                    border-top: 1px solid #e9edef;
                    li:nth-child(1) {
                        text-align: center;
                        .text {
                            font-weight: bold;
                            font-size: 18px;
                            line-height: 25px;
                            color: #939799;
                            padding-left: 5px;
                        }
                        .svg-icon {
                            font-size: 28px;
                        }
                    }
                    li:nth-child(2) {
                        display: flex;
                        align-items: center;
                        flex: 1;
                        .left {
                            flex-shrink: 0;
                            width: 48px;
                            height: 48px;
                            border: 1px solid #e9edef;
                            box-sizing: border-box;
                            border-radius: 2px;
                            overflow: hidden;
                            img {
                                max-width: 100%;
                                max-height: 100%;
                            }
                        }
                        .right {
                            padding-left: 10px;
                            /*width: 330px;*/
                            word-break: break-all;
                            font-size: 14px;
                            line-height: 20px;
                            color: #262b30;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            .tag {
                                padding: 1px 3px;
                                background: #ffefe6;
                                border-radius: 2px;
                                font-size: 12px;
                                line-height: 16px;
                                color: #ed4014;
                            }
                        }
                    }
                    li:nth-child(3) {
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        line-height: 20px;
                        color: #262b30;
                        flex: 1;
                        justify-content: flex-end;
                        span {
                            font-weight: bold;
                            font-size: 18px;
                            line-height: 25px;
                            color: #636669;
                            margin-right: 8px;
                        }
                    }
                }
            }
        }
        &.user {
            .table {
                .tbody {
                    ul {
                        ul {
                            &:hover {
                                background-color: $brand-hover;
                            }
                        }
                        li:nth-child(2) {
                            .left {
                                width: 48px;
                                height: 48px;
                                border-radius: 50%;
                                border: 1px solid $border-color;
                                box-sizing: border-box;
                                overflow: hidden;
                                img {
                                    max-width: 100%;
                                    max-height: 100%;
                                    border-radius: 50%;
                                }
                            }
                            .right {
                                .name {
                                    color: #262B30 ;
                                    cursor: pointer;
                                }
                                .icon {
                                    margin-top: 4px;
                                    .iconfont {
                                        font-size: 20px;
                                        &.icon-H {
                                            color: #ff6004;
                                        }
                                        &.icon-weixin {
                                            color: #1bb723;
                                        }
                                        &.icon-weixinxiaochengxu {
                                            color: #677de0;
                                        }
                                        &.icon-zhifubaoxiaochengxu {
                                            color: #2094e7;
                                        }
                                        &.icon-douyin {
                                            color: #1f0a1c;
                                        }
                                    }
                                }
                            }
                        }
                        li:nth-child(3) {
                            font-weight: bold;
                            font-size: 14px;
                            line-height: 20px;
                            color: #636669;
                            span {
                                font-size: 18px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
