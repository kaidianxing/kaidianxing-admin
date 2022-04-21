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
    <td>
        <div class="shop">
            <div class="shop-image">
                <div v-if="goods.thumb === ''">
                    <div class="shop-item" v-if="goods.ext_field.coupon_sale_type == '1'">
                        <img :src="require('@/assets/image/coupons/full-reduction.png')" alt @error="replaceImage">
                    </div>
                    <div class="shop-item" v-else-if="goods.ext_field.coupon_sale_type == '2'">
                        <img :src="require('@/assets/image/coupons/discount.png')" alt @error="replaceImage">
                    </div>
                </div>
                <!--  -->
                <div class="shop-item" v-else>
                    <img :src="$media(goods.thumb)" alt @error="replaceImage"/>
                </div>
            </div>
            <div class="shop-information">
                <div class="title">
                    <span class="mark" :class="getType.goodsName">
                            {{ getType.goodsText }}
                        </span> {{ goods.title }}
                </div>
                <div class="shop-label">
                    <kdx-tag-label type="warning" size="small"
                               v-if="goods.plugin_identification && goods.plugin_identification.is_commission == '1'">
                        <div>
                            <span class="iconfont icon-fenxiao"></span>
                            <span>
                                分销商品
                            </span>
                        </div>
                    </kdx-tag-label>
                    <kdx-tag-label v-if="goods.option_title" type="info" size="small">
                        {{ goods.option_title }}
                    </kdx-tag-label>
                </div>
            </div>
        </div>
    </td>
</template>

<script>
export default {
    props: {
        goods: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        getType() {
            // type: 0实体 1虚拟 2卡密 4优惠券
            let type;
            switch (this.goods.type) {
                case '0':
                    type = {
                        goodsName: 'real',
                        goodsText: '实'
                    }
                    break;

                case '1':
                    type = {
                        goodsName: 'virtual',
                        goodsText: '虚'
                    }
                    break;

                case '2':
                    type = {
                        goodsName: 'secret',
                        goodsText: '密'
                    }
                    break;
            }
            return type;
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

    > .shop-image {
        width: 80px;
        height: 80px;
        margin-right: 10px;
        box-sizing: border-box;
        border: 1px solid $border-color;
        border-radius: 2px;
        flex-shrink: 0;
        overflow: hidden;

        .shop-item {
            width: 80px;
            height: 80px;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    > .shop-information {
        flex: 1;
        width: 0;

        > .title {
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

                &.secret {
                    background-color: #FFCDD0;
                    color: #FF000F;
                }
            }
        }

        > .shop-label {
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