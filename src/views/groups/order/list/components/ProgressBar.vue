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
    <div class="progress-bar">
        <div class="progress-bg">
            <div class="progress" :style="{width: `${progress}%`}" :class="{'success': progress === 100}"></div>
        </div>
        <div class="num" :class="{'success': progress === 100}">
            <span class="current">{{ current }}</span> / <span class="total">{{total}}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "ProgressBar",
    props: {
        current: {
            type: [Number, String],
            default: 0
        },
        total: {
            type: [Number, String],
            default: 1
        }
    },
    computed: {
        progress() {
          return  parseInt((this.current / this.total) *100)
      }
    },
};
</script>

<style lang="scss" scoped>
.progress-bar {
    display: flex;
    align-items: center;
    .progress-bg {
        background-color: $border-color;
        width: 120px;
        height: 4px;
        border-radius: 4px;
        .progress {
            border-radius: 4px;
            width: 20%;
            height: 100%;
            background: linear-gradient(105.61deg, #29BFFF 0%, #0B88FB 94.51%);
            &.success {
                background: #43DBA3;
            }
        }
    }
    .num {
        padding-left: 10px;
        font-size: 12px;
        line-height: 16px;
        font-weight: bold;
        color: $text-first;
        .current {
            color: $brand-color;
        }
        &.success {
            color: $success-color;
            .current {
                color: $success-color;
            }
        }
    }
}
</style>