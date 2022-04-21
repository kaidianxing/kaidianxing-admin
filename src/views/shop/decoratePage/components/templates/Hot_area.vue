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
        class="hot_area"
        :style='{
            padding: `${px2rpx(componentData.style.margintop)} ${px2rpx(componentData.style.marginleft)} ${px2rpx(componentData.style.marginbottom)}`
        }'
        v-if='componentData&&componentData.id=="hot_area"'
    >
        <div class="container">
            <img
                :src="$utils.media(componentData.params.imgurl) || $utils.staticImg('decorate/goods_col1.png')"
                :style="{
                    borderRadius: `${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.topradius)} ${px2rpx(componentData.style.bottomradius)} ${px2rpx(componentData.style.bottomradius)}`
                }"
                class="hot_area_img"
                mode="widthFix"
            />
            <div
                class="hot_item"
                v-for="(item,index) in componentData.data"
                :style="{
                    left:getPoint(item).left,
                    top:   getPoint(item).top,
                    width: getPoint(item).width,
                    height:getPoint(item).height,
                    zIndex:getPoint(item).zIndex,
                }"
                :key="index"
                @click="clickItem(item)"
            ></div>
        </div>
    </div>
</template>

<script>
import mixin from './mixin.js'
export default {
    mixins: [mixin],
    methods: {
        getPoint(item) {
            return {
                left: item.x + '%',
                top: item.y + '%',
                width: item.w + '%',
                height: item.h + '%',
                zIndex: !this.$isPC ? 9999 : -1
            }
        },
        clickItem(item) {
            this.$emit('custom-event', {
                target: 'hot_area/clickItem',
                data: item
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.hot_area {
    .container {
        position: relative;
        .hot_item {
            position: absolute;
            left: 0;
            right: 0;
        }
    }

    &_img {
        display: block;
        width: 100%;
        border-radius: px2rpx(6);
    }
}
</style>