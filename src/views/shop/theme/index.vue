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
    <kdx-content-bar>
        <div class="content">
            <kdx-form-title>主题色设置</kdx-form-title>
            <Form
                :model="model"
                :rules="rules"
                :label-width="160"
                ref="form"
                @submit.native.prevent
            >
                <FormItem label="主题色选择"></FormItem>
               
            </Form>
        </div>
        <template #btn>
            <Button
                type="primary"
                class="btn"
                @click="preSubmit"
            >保存</Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    data() {
        return {
            model: {
                verify_is_open: '0',
                
            },
            rules: {
               
            }
        }
    },
    computed: {
       
    },
    methods: {
        preSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.submitData()
                }
            })
        },
        submitData() {
            this.$api.verifyApi.setVerifySet(this.model).then(res => {
                if (res.error === 0) {
                    this.$Message.success('保存成功')
                    this.getInfo()
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.content {
    background-color: #fff;
    padding: 30px 40px;
    min-height: 100%;
    margin: 0 auto 0;
    border-radius: 2px;

    .form-content {
        margin-top: 10px;
        padding: 30px 0;
        background: #f4f6f8;
        border-radius: 2px;
    }
}

.btn {
    width: 100px;
}

</style>
