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
    <kdx-modal-frame :value="value" title="编辑卡密" @on-cancel="handleCancel" @on-ok="handleOk">
        <div class="content">
            <Form ref="form" :model="model" :rules="rules" :label-width="140">
                <FormItem :label="item + '：'" v-for="(item, index) in editData.tableHeader" :key="index">
                    <Input v-model="model[`value${index+1}`]" class="width-250"/>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "UpdateKeyData",
        components: {},
        props: {
            value: {
                type: Boolean,
                default: false
            },
            editData: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                model: {
                    // value1: ''
                },
                rules: {

                }
            }
        },
        computed: {},
        watch: {
            editData: {
                handler(value) {
                    this.model = {...value.obj}
                }
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            handleCancel() {
                this.$emit('input', false)
            },
            handleOk() {
                if (this.isObjectValueEqual(this.model,this.editData.obj)) {
                    this.handleCancel();
                    return
                }
                let params = {
                    id: this.editData.id,
                    virtual_account_id: this.editData.virtual_account_id,
                    data: JSON.stringify(this.model)
                };
                this.$api.virtualAccountApi.updateVirData(params).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('修改成功');
                        this.$emit('getList')
                    }
                });
                this.handleCancel();
            },
            isObjectValueEqual(data1, data2) {
                let arr1 = Object.values(data1),
                    arr2 = Object.values(data2);
                if (arr1.length !== arr2.length) {
                    return false
                }
                for (let i = 0; i < arr1.length; i++) {
                    if (arr1[i] !== arr2[i]) {
                        return false;
                    }
                }
                return true
            },
        },
    }
</script>

<style lang="scss" scoped>
    .content {
        padding: 20px 0 60px;
    }
</style>