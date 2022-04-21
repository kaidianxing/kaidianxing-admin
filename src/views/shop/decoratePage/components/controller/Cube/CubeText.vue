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
    <div
        class="cube-text"
        :class="{active: isActive}"
    >
        <div
            class="text"
            v-if="!imgurl"
        >
            <p v-if="showWord">{{`宽度${width}px`}}</p>
            <p v-else>{{`${width}x${height}`}}<span v-if="width>130">像素</span></p>
            <p v-if="width>130 && !showWord">或同等比例</p>
        </div>
        <img
            :src="$utils.media(imgurl)"
            class="cube-img"
            v-else
        />
    </div>
</template>
<script>
export default {
    props: {
        isActive: {
            type: Boolean,
            default: false
        },
        imgurl: {
            type: String,
            default: ''
        },
        width: {
            type: [String, Number],
            default: '375'
        },
        height: {
            type: [String, Number],
            default: '375'
        },
        showWord: {
            type: Boolean,
            default: false
        }
    }

}
</script>

<style lang="scss" scoped>
.cube-text {
    border-width: 1px 0 1px 1px;
    border-style: solid;
    border-color: #e9edef;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;

    &.cell_two {
        height: 200px;
    }

    &.cell_three {
        height: 133.33px;
    }

    &:last-child {
        border-right-width: 1px;
    }

    &.active {
        background: rgba(45, 140, 240, 0.2);
        border: 1px solid $brand-color;

        .text {
            color: $brand-color;
        }
    }

    .text {
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        color: #636669;
    }

    .cube-img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
}
</style>