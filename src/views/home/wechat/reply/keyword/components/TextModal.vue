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
    <kdx-modal-frame title="文字回复" :value="value" @on-cancel="cancelHandler">
        <div class="content">
            <Form ref="form" :model="model" :label-width="120" :rules="rules">
                <FormItem label="文字回复：" class="mb-20" prop="content">
                    <Input v-model="model.content" class="width-340"></Input>
                </FormItem>
            </Form>
        </div>
        <template v-slot:footer>
            <div>
                <Button class="default-long" @click="cancelHandler"
                    >取消</Button
                >
                <Button class="primary-long" @click="validate">确认</Button>
            </div>
        </template>
    </kdx-modal-frame>
</template>

<script>
export default {
    props: {
        current: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            model: {
                content: '',
            },
            rules: {
                content: [{ required: true, message: '请填写文字回复', trigger: 'blur' }]
            },
            value: false
        }
    },
    methods: {
        setValue() {
            this.value = !this.value;
            if (this.value) {
                this.init()
            }
        },
        init() {
            this.$nextTick(() => {
                if (this.current) {
                    this.model.content = this.current
                } else {
                    this.model = { content: '' }
                }
            })
        },
        cancelHandler() {
            this.setValue()
        },
        validate() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.saveHandler()
                }
            })
        },
        saveHandler() {
            this.$emit('on-change', this.model.content)
            this.$refs.form.resetFields()
            this.cancelHandler()
        }
    }
}
</script>

<style lang="scss" scoped>
.content {
    padding: 20px 20px 0 20px;

    .mb-20 {
        margin-bottom: 20px;
    }
}
</style>