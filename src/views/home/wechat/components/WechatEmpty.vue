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
    <!--微信公众号类型错误-->
    <div class="wechat-empty">
        <div class="empty-img">
            <img src="@/assets/image/channel/wechat-no-type.png" alt="">
            <div class="text">
                您的公众号类型为未认证服务号，暂不支持本功能
            </div>
        </div>
    </div>
</template>

<script>
export default {
name: "WechatEmpty"
}
</script>

<style scoped lang="scss">
.wechat-empty {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    .empty-img {
        text-align: center;
        margin: auto;
        img {
            width: 160px;
            height: 160px;
        }
    }
    .text {
        margin-top: 10px;
    }
}
</style>
