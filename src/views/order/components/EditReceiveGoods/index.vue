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
        title="修改收货信息"
        :width="700"
        :loading="loading"
        @on-cancel="handleCancel"
        @on-ok="handleOk"
    >
        <Form
            ref="form"
            :model="model"
            :rules="rules"
            :label-width="120"
            class="order-edit-receive-goods"
            @submit.native.prevent
        >
            <FormItem label="收货人：" prop="buyer_name">
                <Input
                    v-model="model.buyer_name"
                    show-word-limit
                    maxlength="30"
                    class="width-430"
                    placeholder="请输入"
                ></Input>
            </FormItem>
            <FormItem label="手机号码：" prop="buyer_mobile">
                <Input
                    v-model="model.buyer_mobile"
                    class="width-430"
                    placeholder="请输入"
                ></Input>
            </FormItem>
            <FormItem label="所属地区：" prop="area">
                <Cascader
                    :data="address.data"
                    v-model="model.area"
                    class="width-430"
                ></Cascader>
            </FormItem>
            <FormItem label="详细地址：" prop="address_detail">
                <Input
                    v-model="model.address_detail"
                    show-word-limit
                    maxlength="100"
                    class="width-430"
                    placeholder="请输入"
                    @on-enter="handleOk"
                />
            </FormItem>
        </Form>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: 'index',
    props: {
        id: {
            type: [String, Number],
        },
        dispatch_type: {
            type: [String, Number],
        },
    },
    data() {
        return {
            value: false,
            cacheArea: [], // 缓存地址
            model: {
                buyer_name: '',
                buyer_mobile: '',
                area: [],
                address_detail: '',
                area_code: '',
            },
            rules: {
                buyer_name: [{ required: true, message: '收货人必填' }],
                buyer_mobile: [
                    { required: true, message: '手机号码必填' },
                    {
                        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                        message: '手机号错误',
                    },
                ],
                area: [
                    { required: true, type: 'array', message: '所属地区必填' },
                ],
                address_detail: [{ required: true, message: '详细地址必填' }],
            },
            address: {
                data: [],
                list: [],
            },
            loading: false
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
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.editTackGoodsAddress()
                }
            })
        },
        async getData() {
            await this.$store.dispatch('config/getAddress')
            this.loading = true;
            this.$api.orderApi
                .getTackGoodsAddress({ order_id: this.id })
                .then((res) => {
                    if (res.error === 0) {
                        this.cacheArea = [
                            res.address_state,
                            res.address_city,
                            res.address_area,
                        ]
                        this.model = {
                            buyer_name: res.buyer_name,
                            buyer_mobile: res.buyer_mobile,
                            area: [
                                res.address_state,
                                res.address_city,
                                res.address_area,
                            ],
                            address: res.address,
                            address_detail: res.address_detail,
                        }
                        this.$nextTick(() => {
                            this.address.data = this.$store.state.config.address
                        })
                    }
                    this.loading = false;
                })
        },
        // 修改收货地址
        editTackGoodsAddress() {
            this.getAreaCode(this.address.data)
            let params = Object.assign({}, this.model, {
                province: this.model.area[0] || '',
                city: this.model.area[1] || '',
                area: this.model.area[2] || '',
                order_id: this.id,
            })
            this.$api.orderApi.editTackGoodsAddress(params).then((res) => {
                if (res.error === 0) {
                    this.$Message.success('收货地址修改成功')
                    this.setValue()
                    this.$emit('on-refresh')
                }
            })
        },
        getAreaCode(data, index = 0) {
            index++
            for (let item of data) {
                if (this.model.area.indexOf(item.name) > -1) {
                    if (index === this.model.area.length - 1) {
                        this.model.area_code = item.id
                        break
                    }
                    if (item.children?.length) {
                        this.getAreaCode(item.children, index)
                    }
                }
            }
        },
        resetModel() {
            this.model = {
                buyer_name: '',
                buyer_mobile: '',
                area: [],
                address_detail: '',
                area_code: '',
            }
        },
    },
}
</script>

<style scoped lang="scss">
.order-edit-receive-goods {
    padding: 30px 0;
}
</style>
