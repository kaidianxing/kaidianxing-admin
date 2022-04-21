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
    <div class="data-header-title">
        <div class="left">
            <span class="title">{{title}}</span>
            <span class="text" v-show="text">{{text}}</span>
            <kdx-hint-tooltip type="form" :max-width="maxWidth" v-if="$slots.tooltip">
                <slot name="tooltip"></slot>
            </kdx-hint-tooltip>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: "HeaderTitle",
    props: {
      title: {
        type: [String, Number]
      },
      text: {
        type: [String, Number]
      },
      maxWidth: {
        type: Number
      }
    }
  };
</script>

<style scoped lang="scss">
    .data-header-title {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;

        > .left {
            .title {
                @include font-16-22-bold;
                color: $text-first;
            }

            .text {
                @include font-12-16;
                color: $text-first;
                padding-left: 20px;
            }
        }
    }
</style>
