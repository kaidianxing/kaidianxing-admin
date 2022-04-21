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
        title="修改物流信息"
        :width="700"
        :loading="loading"
        @on-cancel="handleCancel"
        @on-ok="handleOk"
    >
        <div class="order-list-edit-express">
            <template v-if="isMultiple">
                <kdx-hint-alert :show-icon="false" type="info" class="marginB-10"
                    >选择需要修改物流信息的包裹</kdx-hint-alert>
                <div class="table-list">
                    <select-table-list
                        :data="data.packages"
                        @on-change="selectChange"
                    ></select-table-list>
                </div>
            </template>
            <Form ref="form" :model="model" :rules="rules" :label-width="120" @submit.native.prevent>
                <FormItem label="收货人姓名：" class="r-form-item-text">
                    {{ data.buyer_name }}
                </FormItem>
                <FormItem label="联系方式：" class="r-form-item-text">
                    {{ data.buyer_mobile }}
                </FormItem>
                <FormItem label="收货地址：" class="r-form-item-text">
                    {{ data.address }}
                </FormItem>
                <FormItem label="选择快递公司：" prop="express_id">
                    <select-express
                        :value.sync="model.express_id"
                        :option-data="data.express"
                        class="width-340"
                    ></select-express>
                </FormItem>
                <FormItem label="自定义名称：" prop="express_name" v-if="model.express_id==96">
                    <Input v-model="model.express_name" class="width-340" placeholder="请输入" maxlength="6" show-word-limit @on-enter="handleOk"/>
                    <kdx-hint-text>其他快递不支持物流查询，不支持打印电子面单</kdx-hint-text>
                </FormItem>
                <FormItem label="快递单号：" prop="express_sn">
                    <Input
                        v-model="model.express_sn"
                        class="width-340"
                        placeholder="请输入"
                        @on-enter="handleOk"/>
                </FormItem>
            </Form>
        </div>
    </kdx-modal-frame>
</template>

<script>
import SelectTableList from '../SelectTableList'
import SelectExpress from '../SelectExpress'

export default {
    name: 'index',
    components: { SelectTableList, SelectExpress },
    props: {
        id: {
            type: [Number, String],
            required: true
        },
        packageId: {
            type: [Number, String]
        }
    },
    data() {
        return {
            model: {
                package_id: '',
                express_id: '',
                express_sn: '',
                no_express: '0',
                express_name: '其他快递',
            },
            value: false,
            data: {},
            isMultiple: false,
            message: '',
            loading: false,
            rules: {
                express_id: [
                    {required: true, message: '快递公司必选'}
                ],
                express_sn: [
                    {required: true, message: '快递单号必填'}
                ],
                express_name: [
                    {required: true, message: '自定义名称必填'}
                ],
            }
        }
    },
    methods: {
        setValue() {
            this.value = !this.value
            if (this.value) {
                this.resetModel()
                this.getData()
            }
        },
        handleCancel() {
            this.setValue()
        },
        handleOk() {
            if (this.message) {
                this.$Message.error(this.message)
                return
            }
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let params = Object.assign({}, this.model)
                    if (!this.isMultiple) {
                        params.package_id = this.data.packages[0].id
                    } else {
                        params.package_id = this.model.goodsId
                        if (!params.package_id) {
                            this.$Message.error('请选择正确的包裹')
                            return
                        }
                    }
                    delete params.goodsId
                    if(this.model.express_id!=96) {
                        delete params.express_name
                    }
                    this.$api.orderApi
                        .editExpress({ package_data: [params] })
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('物流信息修改成功')
                                this.setValue()
                                this.$emit('on-refresh')
                            }
                        })
                }
            })
        },
        selectChange(index, row) {
            this.model.goodsId = row.id
            // 单选
            this.data.packages.forEach((item, i) => {
                if (item.checked) {
                    this.$set(this.data.packages[i], 'checked', false)
                }
            })
            this.$set(this.data.packages[index], 'checked', true)
        },
        getData() {
            this.loading = true
            this.$api.orderApi
                .getSendPackage({
                    order_id: this.id,
                    package_id: this.packageId
                })
                .then(res => {
                    this.loading = false
                    if (res.error === 0) {
                        this.message = ''
                        if (res.packages && res.packages.length > 0) {
                            this.isMultiple = true
                            // 默认选中第一项
                            res.packages[0].checked = true
                            this.model.goodsId = res.packages[0].id;
                        }
                        this.data = {
                            ...res
                        }
                    } else {
                        this.message = res.message
                    }
                })
        },
        resetModel() {
            this.$refs['form'].resetFields();
            this.model = {
                package_id: '',
                express_id: '',
                express_sn: '',
                no_express: '0',
                express_name:'其他快递',
            }
        }
    }
}
</script>

<style scoped lang="scss">
.order-list-edit-express {
    padding: 20px;
    .table-list {
        padding-bottom: 20px;
    }
}
</style>
