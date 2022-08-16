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
    <kdx-modal-frame title="关键词" :value="value" @on-cancel="cancelHandler">
        <div class="content">
            <Form ref="form" :model="model" :label-width="120" :rules="rules">
                <FormItem label="关键词：" class="mb-20" prop="keyword">
                    <Input v-model="model.keyword" class="width-340"></Input>
                </FormItem>
                <FormItem label="匹配规则：" class="mb-20">
                    <RadioGroup v-model="model.type">
                        <Radio label="2">模糊匹配</Radio>
                        <Radio label="1">精准匹配</Radio>
                    </RadioGroup>
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
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            model: {
                keyword: '',
                type: '2'
            },
            rules: {
                keyword: [{ required: true, message: '请填写关键词', trigger: 'blur' }]
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
                if (this.current.keyword) {
                    this.model = { ...this.model, ...this.current }
                } else {
                    this.model = { keyword: '', type: '2' }
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
            this.$emit('on-change', { ...this.model })
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