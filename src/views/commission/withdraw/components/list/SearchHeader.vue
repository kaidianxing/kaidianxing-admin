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
        <Form ref="form" :model="query" :label-width="100" inline @submit.native.prevent>
            <FormItem label="关键词：" prop="keywords">
                <Input
                    class="width-340"
                    type="text"
                    v-model="query.keywords"
                    placeholder="支持用户昵称，手机号"
                    @on-enter="handleSearch"
                />
            </FormItem>

            <FormItem label="分销商等级：" prop="level_id">
                <Select class="width-340" placeholder="请选择" v-model="query.level_id">
                    <Option
                        v-for="level in levelList"
                        :key="level.id"
                        :label="level.name"
                        :value="level.id"
                    ></Option>
                </Select>
            </FormItem>

            <FormItem label="提现方式：" prop="type">
                <Select class="width-340" placeholder="请选择" v-model="query.type">
                    <Option
                        v-for="type in typeList"
                        :key="type.type"
                        :label="type.message"
                        :value="type.type"
                    ></Option>
                </Select>
            </FormItem>

            <FormItem label="申请时间：" prop="apply_time">
                <DatePicker
                    v-model="query.apply_time"
                    type="datetimerange"
                    placeholder="申请时间"
                    class="width-340"
                    @on-change="changeDate"
                ></DatePicker>
            </FormItem>

            <div class="ivu-form-item-btn">
                <Button type="primary" @click="handleSearch">搜索</Button>
                <Button type="text" @click="handleReset">重置</Button>
                <Button type="text" @click="handleExport">导出</Button>
            </div>
        </Form>
    </kdx-header-bar>
</template>


<script>
export default {
    name: 'SearchHeader',
    data() {
        return {
            query: {
                keywords: '',
                level_id: 'all',
                type: 'all',
                apply_time: []
            },
            levelList: [
                {
                    id: 'all',
                    name: '全部'
                }
            ],
            typeList: [
                {
                    type: 'all',
                    message: '全部'
                }
            ]
        }
    },
    methods: {
        getLevelList() {
            this.$api.commissionApi.getLevelList().then(res => {
                if (res.error === 0) {
                    let { level_list, type_list } = res
                    this.levelList = [...this.levelList, ...level_list]
                    this.typeList = [...this.typeList, ...type_list]
                }
            })
        },
        changeDate(e) {
            this.query.apply_time = e
        },
        // 搜索
        handleSearch() {
            let search = Object.assign({}, this.query)
            Object.keys(search).forEach(k => {
                if (
                    search[k] == '' ||
                    search[k] == 'all' ||
                    (k == 'apply_time' && !search[k][0])
                ) {
                    delete search[k]
                }
            })
            this.$emit('on-search', search, 'head')
        },
        handleReset() {
            this.$emit('on-search', {}, 'head')
            // 重置表单
            this.reset()
        },

        reset() {
            this.$refs.form.resetFields()
        },
        handleExport() {
            this.$emit('on-export')
        },
    },
    mounted() {
        this.getLevelList()
        this.reset()
    }
}
</script>
