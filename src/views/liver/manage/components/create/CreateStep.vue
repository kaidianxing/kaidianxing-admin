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
    <div class="create-step">
        <Steps
            :current="step"
            :status="'wait'"
        >
            <Step title="直播形式"></Step>
            <Step title="基本信息 "></Step>
            <Step title="样式配置"></Step>
        </Steps>
    </div>
</template>

<script>
export default {
    props: {
        step: {
            type: Number,
            default: 0
        }
    },
    computed: {
        getCurrent() {
            return 0
        },
        getStatus() {
            return 'finish'
        }
    },
    data() {
        return {}
    },
}
</script>
<style lang="scss" scoped>
.create-step {
    padding: 34px 130px 35px;
    background: #fafaff;
    border-radius: 4px;
    border: 1px solid $border-color;

    /deep/ .ivu-steps {
        &-title,
        &-head {
            background: none;
        }

        &-tail {
            padding: 0 20px 0 120px;
        }

        &-title,
        &-main {
            display: inline-block;
            vertical-align: middle;
        }

        &-title {
            font-size: 14px;
            font-weight: bold;
            line-height: 20px;
            color: #262b30;
        }
    }
}
</style>