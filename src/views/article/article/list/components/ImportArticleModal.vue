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
        title="微信文章导入"
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
            <FormItem label="选择链接：" prop="link">
                <Input
                    v-model="model.link"
                    class="width-430"
                    placeholder="请输入"
                ></Input>
                <kdx-hint-text>请输入相应微信公众号文章链接，其他非文章链接不支持导入</kdx-hint-text>
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
                link: "",
                type: "0"
            },
            rules: {
                link: [{ required: true, message: "链接必填" }],
            },
        };
    },
    methods: {
        setValue() {
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
                    this.importArtcle();
                }
            });
        },
        // 导入链接
        importArtcle() {
            this.$api.articleApi.wxArticle({
                url: this.model.link
            }).then((res) => {
                if(res.error === 0) {
                    this.$router.push({
                        path: '/article/article/add',
                        query: {
                            data: res.data,
                            type: 0
                        },
                    })
                }
            }).finally(() => {
                this.setValue();
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
