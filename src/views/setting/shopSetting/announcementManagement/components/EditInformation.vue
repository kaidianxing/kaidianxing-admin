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
    <kdx-modal-frame v-model="value" title="修改商品信息" :width="450" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <Form ref="form_info" :model="model" :rules="rules" :label-width="120" class="edit-information-modal">
            <FormItem label="价格：" prop="price">
                <kdx-rr-input number :fixed="2" :max-value="9999999.99" type="text" v-model="model.price" placeholder="商品价格" class="width-250">
                <span slot="append">元</span>
                </Input>
            </FormItem>
            <FormItem label="库存：" prop="stock">
                <Input type="text" v-model="model.stock" number :fixed="0" :max-value="999999999" placeholder="商品库存" class="width-250">
                <span slot="append">件</span>
                </Input>
            </FormItem>
        </Form>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "EditInformation",
        props: {
            price: {
                type: [Number, String]
            },
            stock: {
                type: [Number, String]
            },
            id: {
                type: [Number, String]
            }
        },
        data() {
            return {
                value: false,
                model: {
                    price: '',
                    stock: ''
                },
                rules: {
                    price: [{
                        required: true,
                        message: '价格必填'
                    }],
                    stock: [{
                        required: true,
                        message: '库存必填'
                    }],
                }
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    this.model = {
                        price: this.price,
                        stock: this.stock
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
                        let params = Object.assign({goods_id: this.id}, this.model);
                        this.$api.goodsApi.editInformation(params)
                            .then(res => {
                                if (res.error === 0) {
                                    this.setValue();
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
