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
