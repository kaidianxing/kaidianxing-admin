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
    <kdx-modal-frame :value="value" title="修改权重值" @on-cancel="handleCancel" @on-ok="handleOk">
        <div class="content">
            <Form ref="form" :model="model" :label-width="140">
                <FormItem label="权重：">
                    <kdx-rr-input v-model="model.sort" number :fixed="0" class="width-250"></kdx-rr-input>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "UpdateSort",
        components: {},
        props: {
            value: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                model: {
                    sort: ''
                }
            }
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            handleCancel() {
                this.$emit('input', false)
            },
            handleOk() {
                if (this.model.sort) {
                    this.$emit('changeSort', this.model.sort)
                }
                this.handleCancel();
            }
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        padding: 20px 0 60px;
    }
</style>