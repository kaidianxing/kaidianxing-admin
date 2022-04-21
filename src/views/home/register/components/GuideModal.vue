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
    <kdx-modal-frame v-model="value" title="开放平台配置引导" :width="910" :isOk="false" cancelText="关闭"
                 @on-cancel="handleCancel">
        <div class="guide-modal">
            <p class="title">1. 登录微信开放平台( <a href="https://open.weixin.qq.com/" target="_blank">open.weixin.qq.com</a> )</p>
            <p class="title">2. 把公众号和小程序绑定到同一个开放平台帐号下</p>
            <p class="text">公众号绑定开放平台：管理中心 - 公众帐号 - 绑定公众号</p>
            <div class="image">
                <img src="@/assets/image/home/weixin1.png" alt="">
            </div>
            <p class="text">小程序绑定开放平台：管理中心 - 小程序 - 绑定小程序</p>
            <div class="image">
                <img src="@/assets/image/home/weixin2.png" alt="">
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "GuideModal",
        data() {
            return {
                value: false
            }
        },
        methods: {
            setValue() {
                this.value = !this.value;
            },
            handleCancel() {
                this.setValue();
            }
        }
    };
</script>

<style scoped lang="scss">
    .guide-modal {
        padding: 20px 0 0 40px;
        > .title {
            @include font-14-20-bold;
            color: $text-first;
            padding-bottom: 20px;
            a {
                color: $brand-color;
            }
        }
        > .text {
            @include font-12-16;
            color: $text-first;
            padding-left: 18px;
        }
        .image {
            width: 100%;
            height: 100%;
            padding: 10px 0 20px 0;
        }
    }
</style>
