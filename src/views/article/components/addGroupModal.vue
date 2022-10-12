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
    <kdx-Modal-frame
        v-model="value"
        title="新增分组"
        :width="700"
        @on-cancel="handleClose"
        @on-ok="handleOk"
    >
        <Form
            ref="form"
            :model="model"
            :rules="rules"
            :label-width="120"
            class="import-form"
            @submit.native.prevent
        >
            <FormItem label="分组名称：" prop="name">
                <Input
                    v-model="model.name"
                    class="width-430"
                    maxlength="4"
                    show-word-limit
                    placeholder="请输入分组名称"
                ></Input>
            </FormItem>
        </Form>
    </kdx-Modal-frame>
</template>

<script>
export default {
    name: "ImportArticleModal",
    data() {
        return {
            value: false,
            model: {
                name: "",
            },
            rules: {
                name: [{ required: true, message: "分组名称必填" }],
            },
        };
    },
    methods: {
        setValue() {
            console.log(this.value)
            this.value = !this.value;
            if (this.value) {
                this.resetModel();
            }
        },
        handleClose() {
            this.resetModel();
            this.setValue();
        },
        handleOk() {
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    this.addGroup();
                }
            });
        },
        // 新增分组
        addGroup() {
            let data = JSON.stringify([
                {
                    name: this.model.name,
                    status: 1
                }
            ])
            this.$api.articleApi.saveArticleGroup({
                data,
            }).then((res) => {
                if(res.error === 0) {
                    this.$emit("success");
                    this.handleClose();
                }
            })
        },
        resetModel() {
            this.$refs.form.resetFields();
        },
    },
};
</script>

<style scoped lang="scss">
.import-form {
    padding: 30px 0;
}
</style>
