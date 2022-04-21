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
    <div>
        <p class="title">分销信息</p>
        <div class="flex align-center info-list">
            <div class="info-label">分销等级：</div>
            <div class="flex align-center level">
                <img class="level-img" src="@/assets/image/commission/level-icon.png" />
                <span class="level-text">{{info.level_name}}</span>
            </div>
        </div>
        <div class="flex align-center info-list">
            <div class="info-label">一级比例：</div>
            <div class="info-desc">{{info.level_commission_1}}%</div>
        </div>
        <div class="flex align-center info-list" v-if="info.level_commission_2">
            <div class="info-label">二级比例：</div>
            <div class="info-desc">{{info.level_commission_2}}%</div>
        </div>
        <div class="flex align-center info-list"  v-if="info.level_commission_3">
            <div class="info-label">三级比例：</div>
            <div class="info-desc">{{info.level_commission_3}}%</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    @include font-16-22-bold;
    color: $text-first;
    padding: 0 0 20px 20px;
}

.info-list {
    margin-bottom: 24px;
    @include font-12-16;

    .info-label {
        width: 100px;
        text-align: right;
        color: #262b30;
    }

    .info-value {
        color: #262b30;

        &.bold {
            font-weight: bold;
        }
    }

    .level {
        border-radius: 2px;
        padding: 0 2px;
        /*min-width: 88px;*/
        height: 18px;
        background: linear-gradient(136.55deg, #ff6f29 0%, #fb7e0b 94.51%),
            #ff9900;
        border-radius: 2px;

        &-img {
            height: 20px;
            width: 20px;
        }

        &-text {
            @include font-12-16;
            color: #fff;
        }
    }
}
</style>
