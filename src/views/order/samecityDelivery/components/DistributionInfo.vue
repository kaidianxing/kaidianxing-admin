/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="distribution-info">
        <div class="info-item" v-for="item in infoList" :key="item.id" :class="{checked: current === item.id}" @click="clickItem(item.id)">
            <div class="checkbox">
                <Checkbox :value="value.includes(item.id)" @on-change="changeChecked($event, item.id)"></Checkbox>
            </div>
            <div class="image">
                <img :src="item.image" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DistributionInfo",
        props: {
            value: {
                type: Array,
                default: () => []
            },
            infoList: {
                type: Array,
                default: () => []
            },
            current: {
                type: [Number, String],
                default: ''
            }
        },
        data() {
            return {};
        },
        computed: {

        },
        methods: {
            changeChecked(value, id) {
                let checked = [...this.value];
                if (value) {
                    checked.push(id);
                } else {
                    let index = checked.indexOf(id);
                    checked.splice(index, 1);
                }
                this.$emit('on-checked-change', checked);
            },
            clickItem(id) {
                if (this.current !== id) {
                    this.$emit('on-tab-change', id);
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .distribution-info {
        display: flex;
        align-items: center;

        .info-item {
            margin-right: 4px;
            padding: 14px 16px;
            border-radius: 2px 2px 0 0;
            background-color: $border-color;
            display: flex;
            align-items: center;
            cursor: pointer;

            &.checked {
                background-color: #FFFFFF;
            }

            .checkbox {
                line-height: 14px;
                .ivu-checkbox-wrapper {
                    margin-right: 10px;
                    line-height: 14px;
                }
            }

            .image {
                width: 76px;
                height: 20px;

                img {
                    max-width: 100%;
                    max-height: 100%;
                }
            }

        }
    }
</style>
