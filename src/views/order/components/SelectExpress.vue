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
    <div class="select-express">
        <Select v-model="express" filterable @on-change="handleChange">
            <Option v-for="item in optionData" :value="item.id" :key="item.id">{{ item.name }}
            </Option>
        </Select>
        <div class="express-tag">
            <span v-for="item in common" :key="item.id" :class="{checked: item.id === express}"
                  @click="handleChange(item.id)">
                {{item.name}}
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SelectExpress",
        props: {
            value: {
                type: [String, Number],
                required: true
            },
            optionData: {
                type: Array,
                default: () => [],
                required: true
            }
        },
        data() {
            return {
                express: '',
                common: [
                    {
                        id: "1",
                        name: "顺丰",
                    },
                    {
                        id: '2',
                        name: '申通'
                    },
                    {
                        id: '3',
                        name: '韵达'
                    },
                    {
                        id: '5',
                        name: '圆通'
                    },
                    {
                        id: '6',
                        name: '中通'
                    }
                ]
            };
        },
        watch: {
            value: {
                handler() {
                    this.express = this.value;
                },
                immediate: true
            }
        },
        methods: {
            handleChange(value) {
                if (value !== this.express) {
                    this.express = value;
                }
                this.$emit("update:value", value);
            }
        }
    };
</script>

<style scoped lang="scss">
    .select-express {
        width: 100%;

        > .express-tag {
            margin-top: 10px;

            > span {
                @include font-14-20;
                color: $text-second;
                padding: 1px 7px;
                border: 1px solid $border-color;
                border-radius: 2px;
                margin-right: 10px;
                cursor: pointer;
                display: inline-block;

                &:last-child {
                    margin-right: 0;
                }
            }

            > .checked {
                background-color: $brand-color;
                border-color: $brand-color;
                color: #ffffff;
            }
        }
    }
</style>
