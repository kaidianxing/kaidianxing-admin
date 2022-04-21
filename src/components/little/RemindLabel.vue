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
    <div class="remind-label">
        <span class="box">
            {{title}}
            <span></span>
        </span>
    </div>
</template>

<script>
    // 红色的推荐
    export default {
        name: "RemindLabel",
        props: {
            title: {
                type: String
            }
        }
    };
</script>

<style scoped lang="scss">
    .remind-label {
        display: inline-block;
        margin-left: 10px;
        .box {
            color: #ffffff;
            background-color: #FF1F2C;
            display: inline-block;
            position: relative;
            width: 32px;
            height: 18px;
            font-size: 12px;
            text-align: center;
            margin-left: 4px;
            border-radius: 2px;
            line-height: 18px;
            > span {
                position: absolute;
                top: 0;
                left: -3px;
                border-width: 3px;
                border-style: solid;
                border-color: #FF1F2C #FF1F2C transparent transparent;
                margin: 0;
            }
        }
    }
</style>
