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
    <div class="multi-select">
        <!--单选-->
        <RadioGroup v-model="type" @input="handleInput">
            <Radio :label="item.id" border v-for="item in data" :key="item.id" :disabled="item.disabled || disabled">
                <div class="tit">{{item.name}}</div>
                <div class="desc">普通的商品</div>
                <kdx-svg-icon type="icon-yes1" class="icon"></kdx-svg-icon>
            </Radio>
        </RadioGroup>
    </div>
</template>

<script>
// 多选
export default {
    name: 'MultiSelect',
    props: {
        value: {
            type: [Number, String],
            required: true,
        },
        data: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            type: '',
        }
    },
    watch: {
        value: {
            handler(value) {
                this.type = value
            },
            immediate: true,
        },
    },
    methods: {
        handleInput(val) {
            this.$emit('input', val);
            this.$emit('on-change', val);
        },
    }
}
</script>

<style scoped lang="scss">
.multi-select {
    /deep/ .ivu-radio {
        display: none;
    }
    /deep/ .ivu-radio-group {
        display: flex;
        align-items: center;
    }
    .ivu-radio-group-item {
        position: relative;
        box-sizing: border-box;
        padding-left: 0;
        padding-right: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 120px;
        height: 60px;
        font-size: 14px;
        line-height: 20px;
        border-radius: 2px;
        margin-right: 10px;
        &:last-child {
            margin-right: 0;
        }
        .tit {
            font-size: 14px;
            line-height: 20px;
            font-weight: bold;
            color: #262b30;
        }
        .desc {
            font-size: 12px;
            line-height: 16px;
            color: #636669;
            margin-top: 2px;
        }
        .icon {
            position: absolute;
            font-size: 24px;
            bottom: -2px;
            right: 0;
            color: $brand-color;
            display: none;
        }
    }
    .ivu-radio-wrapper-disabled {
        background-color: $background-color;
    }
    .ivu-radio-wrapper-checked {
        border-width: 2px;
        .tit {
            color: $brand-color;
        }
        .icon {
            display: inline-block;
        }
        &.ivu-radio-wrapper-disabled {
            border-color: $brand-color;
        }
    }
}
</style>
