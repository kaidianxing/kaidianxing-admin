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
        v-model="value"
        title="批量分类"
        :width="450"
        @on-cancel="handleCancel"
        @on-ok="handleOk"
    >
        <Form
            ref="form_classify"
            :model="model"
            :rules="rules"
            :label-width="120"
            class="batch-classify-modal"
        >
            <FormItem
                label="添加方式："
                prop="method"
                class="r-form-item-checkbox"
            >
                <RadioGroup v-model="model.method">
                    <Radio label="0">
                        保留原有分类
                    </Radio>
                    <Radio label="1">
                        替换原有分类
                    </Radio>
                </RadioGroup>
                <kdx-hint-alert
                    v-show="model.method === '1'"
                    type="error"
                    class="width-250"
                >
                    替换原有分类请谨慎操作！
                </kdx-hint-alert>
            </FormItem>
            <FormItem label="选择商品分类：" prop="category_id">
                <tree-select
                    transfer
                    class="width-250"
                    v-model="model.category_id"
                    :data="category"
                    :multiple="true"
                    :showCheckbox="true"
                    @change-data="changeData"
                ></tree-select>
            </FormItem>
        </Form>
    </kdx-modal-frame>
</template>

<script>
import { dealClassifyList } from '@/assets/helpers'
import TreeSelect from '@/components/tree-select/index'
export default {
    name: 'BatchClassify',
    components: { TreeSelect },
    props: {
        currentList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            value: false,
            model: {
                method: '0',
                category_id: []
            },
            category: [],
            rules: {
                method: [{ required: true, message: '添加方式必填' }],
                category_id: [{ required: true, message: '商品分类必选' }]
            }
        }
    },
    methods: {
        setValue() {
            this.value = !this.value
            if (this.value) {
                this.resetModel();
                this.getCategory()
            }
        },
        handleCancel() {
            this.setValue()
        },
        handleOk() {
            this.$refs['form_classify'].validate(valid => {
                if (valid) {
                    let goods_id = this.currentList.map(item => item.id)
                    let params = Object.assign({ goods_id }, this.model)
                    this.$api.goodsApi.setBatchClassify(params).then(res => {
                        if (res.error === 0) {
                            this.$Message.success('商品分类设置成功');
                            // 调用接口
                            this.setValue()
                            this.$emit('on-refresh')
                        }
                    })
                }
            })
        },
        // 商品分类
        getCategory() {
            this.$api.goodsApi.goodClassifyList().then(res => {
                if (res.error === 0) {
                    this.category = dealClassifyList(res.list)
                }
            })
        },
        changeData(list) {
            // 处理select多选取消选中问题
            function deep(arr = []) {
                if (Array.isArray(arr)) {
                    arr.forEach(item => {
                        if (item.children && item.children.length > 0) {
                            item.indeterminate = item.children.some(subItem => {
                                return subItem.checked === true
                            })
                            deep(item.children)
                        }
                    })
                }
            }
            deep(list)
            this.category = list
        },
        resetModel() {
            this.model = {
                method: '0',
                category_id: []
            }
            this.$refs['form_classify'].resetFields();
        }
    }
}
</script>

<style scoped lang="scss">
.batch-classify-modal {
    padding: 40px 0;
    .ivu-form-item {
        margin-bottom: 20px;
    }
    .hint-alert-component {
        padding-top: 10px;
    }
}
</style>
