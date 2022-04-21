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
        <template #header >
            <Button type="primary"  @click="toAdd">+添加评价</Button>
        </template>
        <Form
            ref="form"
            :model="model"
            :label-width="100"
            inline
            @submit.native.prevent
        >
            <FormItem label="关键词：">
                <Input
                    type="text"
                    v-model="model.keyword"
                    placeholder="商品名称/订单编号"
                    class="width-340"
                    @on-enter="handleSearch"
                />
            </FormItem>

            <FormItem label="审核状态：">
                <Select v-model="model.status" class="width-160">
                    <Option
                        v-for="item in optionData.status"
                        :key="item.id"
                        :value="item.id"
                        >{{ item.name }}</Option
                    >
                </Select>
            </FormItem>
            <!--            <FormItem label="状态：">-->
            <!--                <Select v-model="model.reply_status" class="width-160">-->
            <!--                    <Option v-for="item in optionData.status" :key="item.id" :value="item.id">{{item.name}}</Option>-->
            <!--                </Select>-->
            <!--            </FormItem>-->
            <!--            <FormItem label="类型：">-->
            <!--                <Select v-model="model.type" class="width-160">-->
            <!--                    <Option v-for="item in optionData.type" :key="item.id" :value="item.id">{{item.name}}</Option>-->
            <!--                </Select>-->
            <!--            </FormItem>-->
            <FormItem label="评价时间：">
                <DatePicker
                    v-model="createTime"
                    type="datetimerange"
                    placeholder="评价时间"
                    class="width-340"
                    @on-change="changeTime"
                ></DatePicker>
            </FormItem>
            <FormItem label="评价来源：">
                <Select v-model="model.type" placeholder="全部" class="width-160">
                    <Option key="all" value="all">全部</Option>
                    <Option v-for="item in optionData.sourceList" :key="item.key" :value="item.key">{{item.value}}</Option>
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
                keyword: '',
                // reply_status: '',
                status: 'all',
                // type: '',
                start_time: '',
                end_time: '',
                type: 'all',
            },
            createTime: '',
            optionData: {
                // 审核状态
                status: [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: '0',
                        name: '审核中',
                    },
                    {
                        id: '1',
                        name: '通过',
                    },
                    {
                        id: '-1',
                        name: '拒绝',
                    },
                ],
                // 类型
                type: [
                    {
                        id: '0',
                        name: '虚拟评论',
                    },
                    {
                        id: '1',
                        name: '真实评论',
                    },
                ],
                sourceList: [],
            },
        }
    },
    created() {
        this.getSource()
    },
    methods: {
        getSource() {
            this.$api.orderApi.getCommentType().then(res => {
                this.optionData.sourceList = res.data
            })
        },
        toAdd() {
            this.$utils.openNewWindowPage('/commentHelper/comment/list')
        },
        // 搜索
        handleSearch() {
            let model = Object.assign({}, this.model)
            model.status = model.status === 'all' ? '' : model.status
            model.type = model.type === 'all' ? '' : model.type
            this.$emit('on-change', model)
        },
        handleReset() {
            this.$emit('on-change', {})
            // 重置表单
            this.resetModel()
        },
        changeTime(date) {
            this.model.start_time = date[0]
            this.model.end_time = date[1]
        },
        resetModel(model) {
            this.model = {
                keyword: '',
                // reply_status: '',
                // type: '',
                start_time: '',
                end_time: '',
                type: 'all',
                merchant: '',
                ...model,
                status:model?.status?model?.status:(model?.status==0?'0':'all')
            }
            this.createTime = ''
            if(this.model.start_time||this.model.end_time){
                this.createTime =[this.model.start_time,this.model.end_time]
            }
            
        },
    },
}
</script>

<style scoped lang="scss">
</style>
