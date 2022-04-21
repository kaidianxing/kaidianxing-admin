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
    <kdx-modal-frame :value="value" title="商品备注" :isOk="false" @on-cancel="handleCancel">
        <div class="content">
            <div class="remark-content" v-html="data"></div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "FastImport",
        components: {},
        props: {
            value: {
                type: Boolean,
                default: false
            },
            content: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                data: ''
            }
        },
        computed: {},
        watch: {
            content() {
                this.handleContent()
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            handleCancel() {
                this.$emit('input', false)
            },
            handleContent() {
                let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-|%|#)+)/g;
                this.data = this.content.replace(reg, "<a href='$1$2' target='_blank'>$1$2</a>")
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        padding: 10px 20px 60px;
        .remark-content {
            line-height: 24px;
            white-space: pre-wrap;
            word-break: break-all;
        }
    }
</style>