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
            <Button type="primary" :disabled="noManagePerm" @click="addPage">+新建页面</Button>
        </template>
        <Form
            ref="form"
            :model="model"
            :label-width="100"
            inline
            @submit.native.prevent
        >
            <FormItem label="页面名称：">
                <Input
                    type="text"
                    v-model="model.keywords"
                    placeholder="页面名称"
                    class="width-340"
                    @on-enter="handleSearch"
                />
            </FormItem>
            <!--<FormItem label="页面类型：">-->
            <!--<Select v-model="model.type" class="width-160">-->
            <!--<Option v-for="item in optionData.type" :key="item.id" :value="item.id">{{item.name}}</Option>-->
            <!--</Select>-->
            <!--</FormItem>-->
            <FormItem label="应用状态：">
                <Select
                    v-model="model.status"
                    class="width-160"
                    @on-change="changeStatus"
                >
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
                keywords: '',
                status: ' ',
            },
            optionData: {
                // 优惠券类型
                type: [
                    {
                        id: '1',
                        name: '全部',
                    },
                    {
                        id: '2',
                        name: '折扣券',
                    },
                    {
                        id: '3',
                        name: '满减券',
                    },
                ],
                // 应用状态
                status: [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: '1',
                        name: '应用中',
                    },
                    {
                        id: '0',
                        name: '未应用',
                    },
                ],
            },
        }
    },
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('diypage.page.list.manage')
        },
    },
    methods: {
        changeStatus() {},
        // 搜索
        handleSearch() {
            let model = Object.assign({}, this.model)
            model.status = model.status === 'all' ? '' : model.status
            this.$emit('on-change', model)
        },
        handleReset() {
            this.$emit('on-change', {})
            this.reset()
        },
        reset() {
            this.model = {
                keywords: '',
                status: 'all',
            }
        },
        // 新建页面
        addPage() {
            this.$emit('add-page')
        },
    },
    mounted() {
        this.reset()
    },
}
</script>
