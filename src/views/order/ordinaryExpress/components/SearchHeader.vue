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
            <Button :disabled="noManagePerm" type="primary" to="/order/ordinary-express/add"
                >+添加快递模版</Button
            >
        </template>
        <Form :label-width="100" :model="model" inline @submit.native.prevent>
            <FormItem label="关键词：">
                <Input
                        type="text"
                        v-model="model.keyword"
                        @on-enter="handleSearch"
                        placeholder="模板名称"
                        class="width-340"
                />
            </FormItem>
            <FormItem label="状态：">
                <Select v-model="model.state" class="width-160">
                    <Option
                        v-for="item in optionData.status"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.name }}</Option
                    >
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
    name: 'SearchHeader',
    data() {
        return {
            model: {
                state: 'all',
                keyword: '',
            },
            optionData: {
                // 状态
                status: [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: '1',
                        name: '启用',
                    },
                    {
                        id: '0',
                        name: '禁用',
                    },
                ],
            },
        }
    },
    computed: {
      noManagePerm(){
        return !this.$getPermMap("order.dispatch.manage");
      }
    },
    methods: {
        // 搜索
        handleSearch() {
            let model = Object.assign({}, this.model)
            model.state = model.state === 'all' ? '' : model.state
            this.$emit('on-search', model)
        },
        handleReset() {
            this.$emit('on-search', {})
            this.reset()
        },
        reset(model) {
            this.model = {
                state: model?.state || 'all',
                keyword: model?.keyword || '',
            }
        },
    },
}
</script>
