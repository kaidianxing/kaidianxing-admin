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
    <kdx-modal-frame
        :value="value"
        :title="item?'修改标签':'添加标签'"
        :width="520"
        @on-cancel="addModalClose"
        @on-ok="addModalOk"
    >
        <div class="add-modal">
            <Form :rules="rules" :label-width="120" :model="model" ref="form">
                <FormItem label="标签名称：" prop="name">
                    <Input
                        type="text"
                        v-model="model.name"
                        placeholder="请输入"
                        :disabled="disabled"
                    />
                </FormItem>
                <FormItem label="标签描述：" prop="content">
                    <Input
                        type="textarea"
                        v-model="model.content"
                        placeholder="请输入"
                    />
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        item: {
            type: Object,
            default: () =>{}
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            model: {
                name: "",
                content: "",
            },
            rules: {
                name: [{ required: true, message: "请输入标签名称" }],
            },
        };
    },
    watch: {
        item: {
            handler(val){
                if(val){
                    this.model= {name: val.name,content: val.content}
                } else {
                    this.$refs.form.resetFields()
                }
            }
        }
    },
    methods: {
        addModalOk() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$emit("on-submit", { ...this.model });
                    this.model = {
                        name: "",
                        content: "",
                    };
                    this.$refs.form.resetFields()
                }
            });
        },
        addModalClose() {
            this.$emit("input", false);
        },
    },
};
</script>

<style lang="scss" scoped>
.add-modal {
    padding: 40px 50px 30px 0px;

    /deep/ .ivu-form-item {
        margin-bottom: 30px !important;
    }
}
</style>
