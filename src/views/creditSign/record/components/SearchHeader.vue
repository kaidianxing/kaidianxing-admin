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
        <Form ref="form" :model="model" :label-width="100" inline @submit.native.prevent>
            <FormItem label="会员昵称：">
                <i-input type="text" v-model="model.nickname" placeholder="请输入会员昵称" @on-enter="handleSearch" class="width-340"/>
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
                    nickname: '',
                }
            }
        },
        computed: {
        },
        created() {
            // this.getAgentGradeAllList()
        },
        methods: {
            // 添加活动
            addActivity() {
                this.$router.push({
                    path: '/performanceAward/activity/index',
                    query: {
                        type: 'add',
                    },
                })
            },
            // 搜索
            handleSearch() {
                let params = {
                    ...this.model,
                };
                this.$emit('on-search', params)
            },
            // 重置
            handleReset() {
                this.model = {
                    nickname: '',
                };
                this.handleSearch()
            },
            reset(search) {
                Object.assign(this.model, search);
            },
        },
    }
</script>
<style lang="scss" scoped></style>
