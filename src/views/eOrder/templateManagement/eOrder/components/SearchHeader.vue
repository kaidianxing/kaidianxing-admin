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
    <kdx-header-bar>
        <template #header>
            <Button type="primary" :disabled="noManagePerm" @click="addTemp">
                +添加模板
            </Button>
        </template>
        <Form
            ref="form"
            :model="model"
            :label-width="100"
            inline
            @submit.native.prevent
        >
            <FormItem label="模板名称：">
                <i-input
                    type="text"
                    v-model="model.name"
                    placeholder="模板名称"
                    @on-enter="handleSearch"
                    class="width-340"
                />
            </FormItem>
            <FormItem label="快递公司：">
                <Select v-model="model.express_company" class="width-160">
                    <Option
                        v-for="item in expressList"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="模板类型：">
                <Select v-model="model.type" class="width-160">
                    <Option
                        v-for="item in typeist"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </Option>
                </Select>
            </FormItem>
            <div class="ivu-form-item-btn">
                <Button type="primary" @click="handleSearch">搜索</Button>
                <Button type="text" @click="handleReset">重置</Button>
            </div>
        </Form>
    </kdx-header-bar>
</template>

<script>
export default {
    data() {
        return {
            model: {
                name: '',
                express_company: 'all',
                type: 'all',
            },
            expressList: [], // 快递公司
            typeist: [
                {
                    value: 'all',
                    label: '全部',
                },
                {
                    value: '1',
                    label: '快递鸟',
                },
                // {
                //     value: '0',
                //     label: '菜鸟',
                // },
            ],
        }
    },
    computed: {
        noManagePerm() {
            // 管理权限
            return !this.$getPermMap('expressHelper.express_template.manage')
        },
    },
    created() {
        this.getExpressList()
    },
    methods: {
        // 获取快递公司列表
        getExpressList() {
            this.$api.settingApi.getExpressList().then((res) => {
                if (res.error == 0) {
                    this.expressList = res.list.map((item) => {
                        return {
                            value: item.key,
                            label: item.name,
                        }
                    })
                    this.expressList.unshift({
                        value: 'all',
                        label: '全部',
                    })
                }
            })
        },
        // 添加模板
        addTemp() {
            this.$router.push({
                path:
                    '/eOrder/templateManagement/eOrder/add',
                query: {},
            })
        },
        // 搜索
        handleSearch() {
            let params = {
                ...this.model,
            }
            if (this.model.express_company === 'all') {
                params = {
                    ...params,
                    express_company: '',
                }
            }
            if (this.model.type === 'all') {
                params = {
                    ...params,
                    type: '',
                }
            }
            this.$emit('on-search', params)
        },
        // 重置
        handleReset() {
            this.reset()
            this.handleSearch()
        },
        reset() {
            this.model = {
                name: '',
                express_company: 'all',
                type: 'all',
            }
        },
    },
}
</script>
<style lang="scss" scoped></style>
