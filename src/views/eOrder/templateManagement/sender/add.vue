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
            <Form ref="form" :model="model" :label-width="160" :rules="rule">
                <kdx-form-title>模板设置</kdx-form-title>
                <FormItem label="发件人模板名称：" prop="name">
                    <i-input
                        placeholder="请输入"
                        class="width-340"
                        show-word-limit
                        maxlength="20"
                        v-model="model.name"
                    />
                </FormItem>
                <FormItem label="发件人公司：" prop="consigner_company">
                    <i-input
                        placeholder="请输入"
                        class="width-340"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="120"
                        v-model="model.consigner_company"
                    />
                </FormItem>
                <FormItem label="发件人名称：" prop="consigner_name">
                    <i-input
                        placeholder="请输入"
                        class="width-340"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="120"
                        v-model="model.consigner_name"
                    />
                </FormItem>
                <FormItem label="发件人手机号：" prop="consigner_mobile">
                    <i-input
                        placeholder="请输入"
                        class="width-340"
                        v-model="model.consigner_mobile"
                    />
                </FormItem>
                <FormItem label="发件人城市：" prop="consigner_addr">
                    <Cascader
                        class="width-340"
                        :data="addressList"
                        v-model="model.consigner_addr"
                    ></Cascader>
                </FormItem>
                <FormItem label="详细地址：" prop="consigner_address">
                    <i-input
                        placeholder="请输入"
                        class="width-340"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="120"
                        v-model="model.consigner_address"
                    />
                </FormItem>
                <FormItem label="邮编：" prop="postcode">
                    <i-input
                        placeholder="请输入"
                        class="width-340"
                        type="number"
                        show-word-limit
                        maxlength="10"
                        v-model="model.postcode"
                    />
                </FormItem>
            </Form>
        </div>
        <template #btn>
            <Button
                class="primary-long"
                type="primary"
                :loading="loading"
                @click="handleSave"
            >
                保存
            </Button>
            <Button
                class="default-long"
                to="/eOrder/templateManagement/sender/index"
            >
                取消
            </Button>
        </template>
    </kdx-content-bar>
</template>

<script>
export default {
    data() {
        return {
            model: {
                name: '',
                consigner_company: '',
                consigner_name: '',
                consigner_mobile: '',
                consigner_province: '',
                consigner_city: '',
                consigner_area: '',
                consigner_addr: [],
                consigner_address: '',
                postcode: '',
            },
            rule: {
                name: [
                    { required: true, message: '模板名称必填' },
                    { whitespace: true, message: '模板名称必填' },
                ],
                consigner_name: [
                    { required: true, message: '发件人名称必填' },
                    { whitespace: true, message: '发件人名称必填' },
                ],
                consigner_mobile: [
                    { required: true, message: '发件人手机必填' },
                    { whitespace: true, message: '发件人手机必填' },
                    {
                        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
                        message: '手机号格式不正确',
                    },
                ],
                consigner_addr: [{ required: true, message: '发件人城市必选' }],
                consigner_address: [
                    { required: true, message: '详细地址必填' },
                    { whitespace: true, message: '详细地址必填' },
                ],
                postcode: [{ max: 10, message: '邮编长度不能大于10位' }],
            },
            loading: false,
            id: '', // 模板id
            type: '', // 类型  add/edit
        }
    },
    computed: {
        addressList() {
            return this.$store.state.config?.address || []
        },
    },
    created() {
        // 获取省市区
        this.$store.dispatch('config/getAddress')
        let { id } = this.$route.query
        let { type } = this.$route.params
        this.id = id
        this.type = type
        if (this.type === 'edit' && this.id) {
            this.getSenderTempDetail()
        }
    },
    methods: {
        // 获取发件人模板详情
        getSenderTempDetail() {
            this.$api.eOrderApi
                .getSenderTempDetail({
                    id: this.id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        this.model = {
                            ...this.model,
                            ...res.data,
                            consigner_addr: [
                                res.data.consigner_province,
                                res.data.consigner_city,
                                res.data.consigner_area,
                            ],
                        }
                    }
                })
        },
        handleSave() {
            this.$refs['form'].validate().then((valid) => {
                if (valid) {
                    this.loading = true
                    if (this.type === 'edit') {
                        // 编辑
                        this.editSenderTemp()
                    } else {
                        // 新增
                        this.addSenderTemp()
                    }
                }
            })
        },
        // 添加模板
        addSenderTemp() {
            let params = this.formatParams()
            this.$api.eOrderApi
                .addSenderTemp({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        this.$router.replace({
                            path:
                                '/eOrder/templateManagement/sender/index',
                        })
                    }
                })
        },
        // 编辑模板
        editSenderTemp() {
            let params = this.formatParams()
            params = {
                ...params,
                id: this.id,
            }
            this.$api.eOrderApi
                .editSenderTemp({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        this.$router.replace({
                            path:
                                '/eOrder/templateManagement/sender/index',
                        })
                    }
                })
        },
        // 处理保存参数
        formatParams() {
            let {
                name,
                consigner_company,
                consigner_name,
                consigner_mobile,
                consigner_addr,
                consigner_address,
                postcode,
            } = this.model
            let params = {
                name,
                consigner_company,
                consigner_name,
                consigner_mobile,
                consigner_address,
                postcode,
            }
            params['consigner_province'] = consigner_addr[0]
            params['consigner_city'] = consigner_addr[1]
            params['consigner_area'] = consigner_addr[2]
            if (!postcode) {
                // 不填默认 000000
                params['postcode'] = '000000'
            }
            return params
        },
    },
}
</script>

<style scoped lang="scss">
.content {
    padding: 40px;
    background: #fff;
    min-height: 100%;
}
.link {
    cursor: pointer;
    text-decoration: underline;
    color: $brand-color;
}
</style>
