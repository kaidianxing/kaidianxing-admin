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
    <kdx-header-bar type="little">
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
                <Select v-model="model.express_code" class="width-160">
                    <Option
                        v-for="item in expressList"
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
                express_code: 'all',
            },
            expressList: [], // 快递公司
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
            !this.expressList?.length && this.$api.settingApi.getExpressList().then((res) => {
                if (res.error == 0) {
                    this.expressList = res.list.map((item) => {
                        return {
                            value: item.code,
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
                    '/eOrder/templateManagement/invoice/add',
                query: {},
            })
        },
        // 搜索
        handleSearch() {
            let params = {
                ...this.model,
            }
            params.express_code = params.express_code === 'all'  ? '' : params.express_code
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
                express_code: 'all',
            }
        },
    },
}
</script>
<style lang="scss" scoped></style>
