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
    <div class="form-pictures">
        <div class="templates-item">
            <div class="image-add">
                <div class="add">
                    <span class="iconfont-m- icon-m-jiahao"></span>
                </div>
                <div class="add-text">
                    添加图片
                </div>
                <input type="file" style="display: none">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FormPictures"
    };
</script>

<style scoped lang="scss">
    .form-pictures {
        .image-add {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: px2rpx(60);
            height: px2rpx(60);
            border: 1px dashed #E6E7EB;
            border-radius: px2rpx(2);
            color: #969696;
            cursor: pointer;
            .add {
                font-size: px2rpx(20);
            }
            .add-text {
                font-size: px2rpx(10);
                line-height: px2rpx(14);
                padding-top: px2rpx(10);
            }
        }
    }
</style>
