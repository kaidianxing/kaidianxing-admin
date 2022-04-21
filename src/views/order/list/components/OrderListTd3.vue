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
    <td :rowspan="list.refund_type | getRowNum(list.order_goods.length)">
        <div class="shop-status refund-status">
            <!--维权状态：refund_status: 0仅退货1：退货退款2换货-->
            <template v-if="hasRefund(list, goods)">-</template>
            <template v-else>
                <kdx-status-text :type="goods.refund_status >= 0 && goods.refund_status < 10 ? 'danger' : 'success'" style="display: block">
                    {{ goods.refund_status_text }}
                </kdx-status-text>
                <div class="refund-status-box" v-if="status === 'refund'">
                    <span class="refund-status-text" v-if="goods.refund_type_text">{{ goods.refund_type_text }}</span>
                </div>
                <template v-if="list.is_refund == '1'">
                    <Button
                        type="text"
                        :to="getPath(list, goods)"
                    >
                        维权详情
                    </Button>
                </template>
            </template>
        </div>
    </td>
</template>

<script>
    export default {
        props: {
            list: {
                type: Object,
                default: () => ({})
            },
            goods: {
                type: Object,
                default: () => ({})
            },
            status: {
                type: String,
                default:''
            }
        },
        filters: {
            getRowNum(type, len) {
                if (type === '2') return 1
                return len
            },
        },
        methods: {
            // 表格是否显示维权
            hasRefund(list, goods) {
                return (
                    list.is_refund == '0' ||
                    (list.is_refund === '1' &&
                        list.refund_type === '2' &&
                        goods.is_single_refund === '0')
                )
            },
            getPath({ refund_type, id, is_refund }, goods) {
                let path = '/order/'
                if (goods.refund_type === '1') {
                    path += 'refund-detail'
                } else if (goods.refund_type === '2') {
                    path += 'returns-refunds-detail'
                } else if (goods.refund_type === '3') {
                    path += 'exchange-goods-detail'
                } else {
                    return ''
                }

                path += `?id=${id}&is_refund=${is_refund}`

                if (refund_type === '2') {
                    path += `&ids=${goods.id}`
                }

                return path
            },
        }
    }
</script>

<style lang="scss" scoped>
    // 商品信息
    .shop {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        >.shop-image {
            width: 80px;
            height: 80px;
            margin-right: 10px;
            box-sizing: border-box;
            border: 1px solid $border-color;
            border-radius: 2px;
            flex-shrink: 0;
            overflow: hidden;
            >img {
                width: 100%;
                height: 100%;
            }
        }
        >.shop-information {
            flex: 1;
            width: 0;
            >.title {
                display: -webkit-box;
                word-break: break-all;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                height: 60px;
                .mark {
                    @include font-12-16;
                    border-radius: 2px;
                    width: 18px;
                    height: 18px;
                    text-align: center;
                    line-height: 18px;
                    display: inline-block;
                    &.real {
                        background-color: #f0faff;
                        color: $brand-color;
                    }
                    &.virtual {
                        background-color: #e6fff9;
                        color: #00c5c5;
                    }
                }
            }
            >.shop-label {
                margin-bottom: -10px;
                /deep/ .tag-label {
                    margin-bottom: 10px;
                    &:first-child {
                        margin-right: 10px;
                    }
                    .label-warning {
                        span {
                            color: $warning-color;
                        }
                        .iconfont {
                            padding-right: 2px;
                            vertical-align: bottom;
                        }
                    }
                }
            }
        }
    }
</style>