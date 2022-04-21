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
    <div class="recharge-price">
        <div v-for="item in data" :key="item.id" class="recharge-price-item"
             :class="item.id === current ? 'checked' : ''" @click="handleClick(item)">
            <div class="title">
                {{item.title}}
            </div>
            <div class="price">
                ￥<span class="number number-font-family">{{item.price}}</span>
            </div>
            <div class="price-item line-hide bold">
                折合￥<span>{{item.priceItem}}</span>/{{item.unit}}
            </div>
            <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
        </div>
    </div>
</template>

<script>
    export default {
        name: "RechargePrice",
        props: {
            data: {
                type: Array,
                default: () => []
            },
            value: {
                type: [Number, String]
            }
        },
        data() {
            return {
                current: ''
            };
        },
        watch: {
            value: {
                handler(val) {
                    this.current = val;
                },
                immediate: true
            }
        },
        methods: {
            handleClick(data) {
                this.value = data.id;
                this.$emit('input', data.id);
                this.$emit('on-change', data);
            }
        }
    };
</script>

<style scoped lang="scss">
    .recharge-price {
        display: flex;
        align-items: center;

        .recharge-price-item {
            margin-right: 20px;
            width: 140px;
            height: 140px;
            border: 1px solid $border-color;
            border-radius: 2px;
            box-sizing: border-box;
            position: relative;
            cursor: pointer;
            overflow: hidden;

            > div {
                text-align: center;
            }

            .title {
                border-bottom: 1px solid $border-color;
                padding: 8px 0;
                @include font-14-20-bold;
                color: $text-first;
            }

            .price {
                color: $danger-color;
                padding: 15px 0;
                line-height: 36px;
                font-size: 18px;
                font-weight: bold;
                height: 66px;
                overflow-y: hidden;

                .number {
                    font-size: 30px;
                }
            }

            .price-item {
                padding: 10px 0;
                @include font-12-16;
                color: $brand-color;
                background-color: $brand-light;
            }

            > .icon {
                position: absolute;
                right: -1px;
                bottom: -1px;
                font-size: 24px;
                line-height: 24px;
                display: none;
            }
        }

        > .checked {
            border-color: $brand-color;

            > .icon {
                display: inline-block;
            }
        }
    }
</style>