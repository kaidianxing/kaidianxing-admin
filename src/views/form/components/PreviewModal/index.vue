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
    <kdx-modal-frame :value="value" title="表单预览" :footer-hide="true" @on-cancel="handleCancel">
        <div class="form-preview-modal">
            <div class="poster-header">
                <img class="poster-phone" :src="$utils.staticImg('decorate/poster-phone.png')" alt />
                <div class="form-preview-modal-content">
                    <div class="form-content">
                        <form-content :items="data" :type="type"></form-content>
                    </div>
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    import FormContent from "./FormContent";

    export default {
        name: "index",
        components: {
            FormContent
        },
        props: {
            data:{
                type: Array,
                default: () => []
            },
            type: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                value: false
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
            },
            handleCancel() {
                this.value = false;
            }
        }
    };
</script>

<style scoped lang="scss">
    .form-preview-modal {
        padding: 20px 0;
        .poster-header {
            width: 300px;
            display: block;
            margin: 0 auto;
            height: 100%;
            position: relative;
            > img {
                width: 100%;
            }
        }
        .form-preview-modal-content {
            /*transform: scale(0.8);*/
            /*-webkit-transform-origin: top;*/
            position: absolute;
            top: 79px;
            left: 0;
            right: 0;
            bottom: 85px;
            overflow: hidden;
            > .form-content {
                margin: 0 auto;
                width: 258px;
                background-color: #f3f3f3;
                height: 100%;
            }
        }
    }
</style>
