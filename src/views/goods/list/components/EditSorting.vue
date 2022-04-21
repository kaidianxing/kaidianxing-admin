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
    <!--价格、库存-->
    <kdx-modal-frame v-model="value" title="修改商品排序" :width="450" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <Form ref="form_info" :model="model" :rules="rules" :label-width="120" class="edit-information-modal">
            <FormItem label="排序：" prop="sort_by">
                <kdx-rr-input number :fixed="0" :max-value="9999" type="text" v-model="model.sort_by" placeholder="商品排序" class="width-250">
                </kdx-rr-input>
            </FormItem>
        </Form>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "EditSorting",
        props: {
            // 商品类型 0实体商品 1虚拟商品 2虚拟卡密
            model_type: {
                type: [Number, String]
            },
            sort_by: {
                type: [Number, String]
            },
            id: {
                type: [Number, String]
            },
            is_activity_goods: {
                type: Boolean
            },
            isExternal: { // 是否是外部使用，当外部使用时需要手动关闭弹窗
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                value: false,
                model: {
                    sort_by: ''
                },
                rules: {
                    sort_by: [{
                        required: true,
                        message: '排序必填'
                    }],
                }
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    this.model = {
                        sort_by: this.sort_by,
                    };
                }
            },
            handleCancel() {
                this.setValue();
            },
            handleOk() {
                // 调用接口
                this.$refs['form_info'].validate(valid => {
                    if (valid) {
                        let params = {
                            id: this.id,
                            field: 'sort_by',
                            value: this.model.sort_by
                        }
                        this.$api.goodsApi.editGoodAttribute(params)
                            .then(res => {
                                if (res.error === 0) {
                                    !this.isExternal && this.setValue();
                                    this.$emit('on-refresh');
                                }
                            });
                    }
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .edit-information-modal {
        padding-top: 40px;
    }
</style>
