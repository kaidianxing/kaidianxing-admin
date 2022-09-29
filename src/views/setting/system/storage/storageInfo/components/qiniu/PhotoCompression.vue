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
    <kdx-modal-frame v-model="value" title="自定义图片压缩" :width="700" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <Form ref="form" :model="model" :rules="rules" :label-width="120" class="order-edit-receive-goods">
            <FormItem label="图片压缩代码：" prop="buyer_name">
                <Input v-model="model.buyer_name" maxlength="100" show-word-limit class="width-430" placeholder="请输入"></Input>
                <kdx-hint-text>默认图片样式代码为：imageMogr2/auto-orient/thumbnail/750x/format/jpg/blur/1x0/quality/75|imageslim
                </kdx-hint-text>
            </FormItem>
        </Form>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "PhotoCompression",
        data() {
            return {
                value: false
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
            },
            handleOk() {

            },
            handleCancel() {
                this.setValue();
            }
        }
    };
</script>

<style scoped>

</style>
