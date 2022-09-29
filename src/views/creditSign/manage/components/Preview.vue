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
    <div class="preview-index">
        <div class="preview-bg">
            <img src="@/assets/image/creditSign/preview-1.png" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        name: "Preview",
        components: {},
        props: {
        },
        data() {
            return {
            }
        },
        watch: {

        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
        },
    };
</script>

<style lang="scss" scoped>
    .preview-index {
        width: 381px;
        padding-top: 40px;
        // height: calc(100vh - 56px - 20px);
        padding-bottom: 20px;
        box-sizing: border-box;
        overflow-y: scroll;
        background-color: #fff;
        flex-shrink: 0;
        margin-right: 20px;
        margin-top: 20px;
        .preview-bg {
            position: relative;
            width: 375px;
            /*height: 667px;*/
            margin: 0 auto;
            /*box-shadow: 0 4px 8px rgba(133, 148, 162, 0.3);*/
            border-radius: 6px;
            transform: scale(0.8);
            transform-origin: top;
        }
    }
</style>