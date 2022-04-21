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
    <div class="flex page-temp blank-temp">
        <i class="iconfont icon-tianjiakongbaimoban create-icon"></i>
        <span class="blank-desc">使用空白模板</span>
    </div>
</template>

<style lang="scss" scoped>
.page-temp {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #e9edef;
    border-radius: 4px;
    width: 225px;
    // height: 365px;
    background-color: #fafdff;
    cursor: pointer;
    // &.blank-temp {
    //     height: 347px;
    // }

     &:hover {
        box-shadow: 0px 1px 14px rgba(133, 148, 162, 0.2);
        transform: translateY(-5px);
        transition: all 0.3s linear;
    }

    .create-icon {
        font-size: 86px;
        color: #939799;
    }

    .blank-desc {
        @include font-14-20;
        margin-top: 20px;
        color: #939799;
    }
}
</style>