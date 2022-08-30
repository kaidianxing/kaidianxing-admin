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
    <div class="type-list">
        <kdx-hint-tooltip>
            <template #header>
                <div class="type-item" :class="{'checked': value == '0', 'disabled': isDisabled}" @click="clickItem(0)">
                    <span class="iconfont icon-yingyong-pintuan-putong"></span>
                    <span class="text">普通拼团</span>
                    <svg-icon type="icon-yes1" class="checked-icon"></svg-icon>
                </div>
            </template>
            <div class="text">
                <p>用户下单开团后，邀请好友</p>
                <p>拼团，以优惠价格购买，提</p>
                <p>升店铺转化</p>
            </div>
        </kdx-hint-tooltip>
        <kdx-hint-tooltip v-if="isLadder">
            <template #header>
                <div class="type-item" :class="{'checked-ladder': value == '1', 'disabled': isDisabled}" @click="clickItem(1)">
                    <span class="iconfont icon-yingyong-pintuan-jieti"></span>
                    <span class="text">阶梯拼团</span>
                    <svg-icon type="icon-yes2" class="checked-icon"></svg-icon>
                </div>
            </template>
            <div class="text">
                <p>人数越多价格越低，用低价</p>
                <p>刺激用户发起拉人更多的拼</p>
                <p>团，高效裂变</p>
            </div>
        </kdx-hint-tooltip>
    </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
    name: "TypeList",
    props: {
        value: {
            type: [Number, String],
            default: 0
        },
        items: {
            type: Array,
            default: () => []
        },
        isDisabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState('config', {
            serviceFunction: state => state.serviceFunction
        }),
        isLadder() {
            return this.serviceFunction?.ladder_group;
        }
    },
    methods: {
        clickItem(val) {
            if (!this.isDisabled && val !== this.value) {
                this.$emit('input', val);
                this.$emit('on-change', val);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.type-list {
    display: flex;
    .type-item {
        position: relative;
        margin-right: 10px;
        border: 1px solid $border-color;
        border-radius: 2px;
        background-color: #ffffff;
        padding: 10px;
        width: 116px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        color: $text-first;
        cursor: pointer;
        .iconfont {
            font-size: 24px;
            padding-right: 2px;
        }
        .text {
            font-size: 14px;
            line-height: 20px;
            font-weight: bold;
        }
        .checked-icon {
            position: absolute;
            right: -1px;
            bottom: -5px;
            font-size: 24px;
            display: none;
        }
        &.checked {
            background-color: $brand-light;
            color: $brand-color;
            border: 2px solid $brand-color;
            .iconfont {
                color: $brand-color;
            }
            .checked-icon {
                color: $brand-color;
                display: inline-block;
            }
        }
        &.checked-ladder {
            background-color: $warning-light;
            color: $warning-color;
            border: 2px solid $warning-color;
            .iconfont {
                color: $warning-color;
            }
            .checked-icon {
                color: $warning-color;
                display: inline-block;
            }
        }
        &.disabled {
            cursor:not-allowed;
        }
    }
}
</style>
