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
                <FormItem label="电子面单模板名称：" prop="name">
                    <i-input
                        placeholder="请输入"
                        class="width-340"
                        show-word-limit
                        maxlength="20"
                        v-model="model.name"
                    />
                </FormItem>
                <FormItem label="模板类型：" prop="type">
                    <RadioGroup v-model="model.type">
                        <Radio label="0">
                            快递鸟
                        </Radio>
                        <!-- <Radio label="1" :disabled="type !== 'add'">菜鸟</Radio> -->
                    </RadioGroup>
                </FormItem>
                <FormItem label="快递公司：" prop="express_company">
                    <Select
                        v-model="model.express_company"
                        filterable
                        class="width-340"
                        @on-change="changeExpressCompany"
                    >
                        <Option
                            v-for="item in expressList"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="面单类型：" prop="is_sub" v-if="
                        new Set(['SF', 'JD']).has(
                            model.express_company
                        )
                    ">
                    <RadioGroup v-model="model.is_sub" @on-change="changeIsSub">
                        <Radio label="0">常规单</Radio>
                        <Radio label="1">子母单</Radio>
                    </RadioGroup>
                    <kdx-hint-text>子母单一般用于一笔订单分包裹同时发货，仅支持单个订单打印</kdx-hint-text>
                </FormItem>
                <FormItem
                    label="电子面单客户账号："
                    prop="template_account"
                    v-if="
                        !new Set(['SF', 'YZBK', 'YZPY']).has(
                            model.express_company
                        )
                    "
                >
                    <i-input
                        placeholder="与快递网点申请"
                        class="width-340"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="120"
                        v-model="model.template_account"
                    />
                </FormItem>
                <FormItem
                    label="电子面单密码："
                    v-if="
                        !new Set(['SF', 'YZBK', 'YZPY']).has(
                            model.express_company
                        )
                    "
                    prop="template_password"
                >
                    <i-input
                        placeholder="与快递网点申请"
                        class="width-340"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="120"
                        v-model="model.template_password"
                    />
                </FormItem>
                <FormItem label="月结编码：" prop="monthly_code">
                    <i-input
                        placeholder="快递公司提供"
                        class="width-340"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="120"
                        v-model="model.monthly_code"
                    />
                </FormItem>
                <FormItem label="网点名称：" prop="branch_name">
                    <i-input
                        placeholder="快递公司提供"
                        class="width-340"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="120"
                        v-model="model.branch_name"
                    />
                </FormItem>
                <FormItem label="网点编码：" prop="branch_code">
                    <i-input
                        placeholder="快递公司提供"
                        class="width-340"
                        type="textarea"
                        :rows="1"
                        show-word-limit
                        maxlength="120"
                        v-model="model.branch_code"
                    />
                </FormItem>
                <FormItem label="模板样式：" prop="template_style">
                    <Select v-model="model.template_style" class="width-340">
                        <Option
                            v-for="item in tempStyleList"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="邮费支付方式：" prop="pay_type">
                    <Select v-model="model.pay_type" class="width-340">
                        <Option
                            v-for="item in payTypeList"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="快递员上门揽件：" prop="pick_type">
                    <RadioGroup v-model="model.is_notice">
                        <Radio label="0">是</Radio>
                        <Radio label="1">否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="自动修改发货状态：" prop="pick_type">
                    <RadioGroup v-model="model.auto_send">
                        <Radio label="1" :disabled="model.is_sub == 1">是</Radio>
                        <Radio label="0" :disabled="model.is_sub == 1">否</Radio>
                    </RadioGroup>
                    <kdx-hint-text v-if="model.is_sub == 1">子母单无法自动分配子母单号，不支持自动修改发货状态，请手动处理订单发货</kdx-hint-text>
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
                to="/eOrder/templateManagement/eOrder/index"
            >
                取消
            </Button>
            <Button class="default-long" :loading="loading" @click="handleTest">
                参数校验
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
                type: '0', // 0快递鸟 1菜鸟
                express_company: '',
                template_account: '',
                template_password: '',
                monthly_code: '',
                branch_name: '',
                branch_code: '',
                template_style: '',
                pay_type: '',
                is_notice: '0',
                auto_send: '1',
                is_sub: '0', // 面单类型
            },
            rule: {
                name: [
                    { required: true, message: '电子面单模板名称必填' },
                    { whitespace: true, message: '电子面单模板名称必填' },
                ],
                type: [{ required: true, message: '模板类型必选' }],
                express_company: [{ required: true, message: '快递公司必选' }],
                template_account: [
                    { required: true, message: '电子面单客户账号必填' },
                    { whitespace: true, message: '电子面单客户账号必填' },
                ],
                template_password: [
                    { required: true, message: '电子面单密码必填' },
                    { whitespace: true, message: '电子面单密码必填' },
                ],
                template_style: [{ required: true, message: '模板样式必选' }],
                pay_type: [{ required: true, message: '邮费支付方式必选' }],
            },
            loading: false,
            id: '', // 模板id
            type: '', // 类型  add/edit
            expressList: [], // 快递公司
            template_format: {}, // 所有模板样式
            tempStyleList: [], // 模板样式
            payTypeList: [
                {
                    value: '1',
                    label: '现付',
                },
                {
                    value: '2',
                    label: '到付',
                },
                {
                    value: '3',
                    label: '月结',
                },
            ],
        }
    },
    async created() {
        // 获取模板样式 获取快递公司列表
        await this.getExpressTempStyle()
        const { type } = this.$route.params
        this.type = type
        const { id } = this.$route.query
        this.id = id
        if (this.type === 'edit' && this.id) {
            this.getExpressTempDetail()
        }
    },
    methods: {
        // 获取模板样式 获取快递公司列表
        getExpressTempStyle() {
            return new Promise((resolve) => {
                this.$api.eOrderApi.getExpressTempStyle().then((res) => {
                    if (res.error == 0) {
                        this.expressList = Object.values(res.express).map(
                            (item) => {
                                return {
                                    value: item.key,
                                    label: item.name,
                                }
                            }
                        )
                        this.template_format = { ...res.template_format }
                    }
                    resolve()
                })
            })
        },
        // 获取电子面单模板详情
        getExpressTempDetail() {
            this.$api.eOrderApi
                .getExpressTempDetail({
                    id: this.id,
                })
                .then((res) => {
                    if (res.error == 0) {
                        this.model = {
                            ...this.model,
                            ...res.data,
                            type: res.data.type + '',
                            template_style:
                                res.data.template_style || 'default',
                            pay_type: res.data.pay_type + '',
                            is_notice: res.data.is_notice + '',
                            auto_send: res.data.auto_send + '',
                            is_sub: res.data.is_sub ? res.data.is_sub + '' : '0',
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
                        this.editExpressTemp()
                    } else {
                        // 新增
                        this.addExpressTemp()
                    }
                }
            })
        },
        // 参数校验 测试打印
        handleTest() {
            this.$refs['form'].validate().then((valid) => {
                if (valid) {
                    this.loading = true
                    // 测试打印
                    this.testPrint()
                }
            })
        },
        // 添加模板
        addExpressTemp() {
            let params = this.formatParams()
            this.$api.eOrderApi
                .addExpressTemp({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        this.$router.replace({
                            path:
                                '/eOrder/templateManagement/eOrder/index',
                        })
                    }
                })
        },
        // 编辑模板
        editExpressTemp() {
            let params = this.formatParams()
            params = {
                ...params,
                id: this.id,
            }
            this.$api.eOrderApi
                .editExpressTemp({ ...params })
                .then((res) => {
                    this.loading = false
                    if (res.error == 0) {
                        this.$Message.success('保存成功')
                        this.$router.replace({
                            path:
                                '/eOrder/templateManagement/eOrder/index',
                        })
                    }
                })
        },
        // 测试打印
        testPrint() {
            let params = this.formatParams('test')
            params = {
                ...params,
            }
            this.$api.eOrderApi.testPrint({ ...params }).then((res) => {
                this.loading = false
                if (res.error == 0) {
                    this.$Message.success('当前电子面单模版参数校验成功')
                }
            })
        },
        // 处理保存参数
        formatParams(testFlag) {
            let {
                name,
                type,
                express_company,
                template_account,
                template_password,
                monthly_code,
                branch_name,
                branch_code,
                template_style,
                pay_type,
                is_notice,
                auto_send,
                is_sub
            } = this.model
            let params = {
                type,
                express_company,
                template_account: new Set(['SF', 'YZBK', 'YZPY']).has(
                    express_company
                )
                    ? ''
                    : template_account,
                template_password: new Set(['SF', 'YZBK', 'YZPY']).has(
                    express_company
                )
                    ? ''
                    : template_password,
                monthly_code,
                branch_name,
                branch_code,
                template_style:
                    template_style === 'default' ? '' : template_style,
                pay_type,
                is_sub,
            }
            if (!testFlag) {
                // 保存参数
                params = {
                    ...params,
                    name,
                    is_notice,
                    auto_send,
                }
            }
            return params
        },
        changeExpressCompany() {
            this.model.template_style = ''
            if (!['SF', 'JD'].includes(this.model.express_company)) {
                this.model.is_sub = '0';
            }
        },
        changeIsSub(value) {
            if(1 === +value) {
                this.model.auto_send = '0';
            }
        }
    },
    watch: {
        'model.express_company': {
            handler(value) {
                if (value) {
                    this.tempStyleList = this.template_format[value] || []
                    this.tempStyleList.forEach((item) => {
                        if (!item.value) {
                            // 将 '' 替换为 default
                            item.value = 'default'
                        }
                    })
                } else {
                    this.tempStyleList = []
                }
            },
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
.refresh {
    padding-left: 20px;
    cursor: pointer;
    color: $brand-color;
    font-size: 12px;
}
.link {
    cursor: pointer;
    color: $brand-color;
    font-weight: bold;
}
</style>
