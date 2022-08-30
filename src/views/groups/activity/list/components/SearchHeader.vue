/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <kdx-header-bar>
        <template #header>
            <Button type="primary" @click="addActivity" :disabled="!activity_status || noManagePerm">+添加活动</Button>
        </template>
        <Form ref="form" :model="model" :label-width="100" inline @submit.native.prevent>
            <FormItem label="活动名称：">
                <i-input type="text" v-model="model.keyword" placeholder="活动名称" @on-enter="handleSearch" class="width-340"/>
            </FormItem>
            <FormItem label="活动状态：">
                <Select v-model="model.status" class="width-160">
                    <Option v-for="item in statusList" :key="item.value" :value="item.value">
                        {{ item.label }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="活动时间：">
                <DatePicker v-model="date" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="活动时间" @on-change="changeDate" class="width-340"></DatePicker>
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
        props: {
            activity_status: {
              type: [String, Number]
            }
        },
        data() {
            return {
                model: {
                    keyword: '',
                    status: 'all',
                    start_time: '',
                    end_time: '',
                },
                date: [],
                statusList: [
                    {
                        value: 'all',
                        label: '全部',
                    },
                    {
                        value: '1',
                        label: '进行中',
                    },
                    {
                        value: '0',
                        label: '未开始',
                    },
                    {
                        value: '-1',
                        label: '停止',
                    },
                    {
                        value: '-2',
                        label: '手动停止',
                    },
                ],
            }
        },
        computed: {
            noManagePerm(){//无管理权限
                return !this.$getPermMap('groups.manage')
            },
        },
        methods: {
            // 添加活动
            addActivity() {
                this.$router.push({
                    path: '/groups/activity/index',
                    query: {
                        type: 'add',
                    },
                })
            },
            changeDate(date) {
                this.model.start_time = date[0];
                this.model.end_time = date[1]
            },
            // 搜索
            handleSearch() {
                let params = {
                    ...this.model,
                    status: this.model.status === 'all'?'':this.model.status,
                };
                this.$emit('on-search', params)
            },
            // 重置
            handleReset() {
                this.reset();
                this.handleSearch()
            },
            reset() {
                this.model = {
                    keyword: '',
                    status: 'all',
                    start_time: '',
                    end_time: '',
                };
                this.date = []
            },
        },
    }
</script>
<style lang="scss" scoped></style>
