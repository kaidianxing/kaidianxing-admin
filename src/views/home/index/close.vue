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
    <div class="close">
        <img
            :src="require('@/assets/image/home/close.png')"
            class="close-img"
            alt=""
        />
        <div class="close-title">站点无法访问，请联系管理员</div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.close {
    padding-top: 229px;
    text-align: center;
    height: 100vh;
    background: #fff;
    .close-img {
        width: 350px;
        height: 343px;
    }

    .close-title {
        margin-top: 50px;
        font-weight: bold;
        font-size: 36px;
        text-align: center;
        line-height: 50px;
        color: #939799;
    }
}
</style>
