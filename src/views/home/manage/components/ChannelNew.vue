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
    <div class="channel-manage-new">
        <Row>
            <i-col span="8" v-for="(item, index) in data" :key="index">
                <div class="channel-item-box">
                    <div class="channel-item">
                        <div class="item-icon">
                            <span :class="['iconfont', getIcon(item.status)]"></span>
                        </div>
                        <div class="item-info">
                            <div class="item-name">
                                <span>{{item.name}}</span>
                                <!--未授权-->
                                <span class="no-auth">未授权</span>
                            </div>
                            <div class="item-dec">
                                <div class="text line-hide">
                                    {{item.text}}
                                </div>
                                <div class="btn">
                                    <Button type="text" @click="goBuy(item)">
                                        立即购买
                                        <span class="iconfont icon-line-right"></span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--渠道背景图片-->
                    <div class="channel-bg-icon">
                        <span :class="['iconfont', getBgIcon(item.status)]"></span>
                    </div>
                </div>
            </i-col>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "ChannelNew",
        props: {
            data: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            goBuy(item) {
                this.$emit('on-buy', item)
            },
            getIcon(status) {
                if (status == 1) { // 支付宝
                    return 'icon-qudao-zhifubaoxiaochengxu';
                } else if (status == 2) { // 百度
                    return 'icon-qudao-baiduxiaochengxu';
                }
            },
            getBgIcon(status) {
                if (status == 1) { // 支付宝
                    return 'icon-alipay';
                } else if (status == 2) { // 百度
                    return 'icon-baidu';
                }
            },
        }
    };
</script>

<style scoped lang="scss">
    .channel-manage-new {
        margin-left: -10px;
        margin-right: -10px;

        .ivu-col {
            padding: 0 10px;
            margin-top: 20px;
        }
        .channel-item-box {
            height: 120px;
            width: 100%;
            position: relative;
            border: 1px solid $border-color;
            border-radius: 2px;
            background-color: $brand-hover;
            overflow: hidden;
            .channel-item {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 30px 20px;
                display: flex;
                align-items: center;
                z-index: 1;
                .item-icon {
                    flex-shrink: 0;
                    .iconfont {
                        font-size: 56px;
                        &.icon-qudao-zhifubaoxiaochengxu {
                            color: #1396DB;
                        }
                        &.icon-qudao-baiduxiaochengxu {
                            color: #306CFF;
                        }
                    }
                }
                .item-info {
                    padding-left: 20px;
                     flex: 1;
                    .item-name {
                        font-size: 24px;
                        line-height: 30px;
                        font-weight: bold;
                        color: $text-first;
                        .no-auth {
                            margin-left: 8px;
                            padding: 2px 10px 2px 8px;
                            color: #ffffff;
                            @include font-12-16;
                            background: linear-gradient(89.27deg, #FF1F2C 28.12%, #FF701F 99.79%);
                            border-radius: 10px 10px 10px 0;
                        }
                    }
                    .item-dec {
                        padding-top: 10px;
                        display: flex;
                        align-content: space-between;
                        .text {
                            @include font-14-20;
                            color: $text-second;
                            flex: 1;
                        }
                        .btn {
                            flex-shrink: 0;
                            .ivu-btn {
                                font-weight: bold;
                                .iconfont {
                                    color: $brand-color;
                                    font-weight: bold;
                                    font-size: 12px;
                                }
                            }
                        }
                    }
                }
            }
            // 渠道背景图片
            .channel-bg-icon {
                position: absolute;
                top: -75px;
                right: -75px;
                z-index: 0;
                line-height: initial;
                .iconfont {
                    font-size: 234px;
                    opacity: 0.05;
                    &.icon-alipay {
                        color: #00A0EE;
                    }
                    &.icon-baidu {
                        color: #306CFF;
                    }
                }
            }
        }
    }
</style>
