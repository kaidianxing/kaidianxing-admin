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
        <Form ref="form" :model="model" :label-width="100" inline @submit.native.prevent>
            <FormItem label="关键词：">
                <Input type="text" v-model="model.keyword" @on-enter="handleSearch" placeholder="昵称/姓名/手机号" class="width-340"/>
            </FormItem>
            <FormItem label="会员等级：">
                <Select v-model="model.level_id" placeholder="请选择" class="width-160">
                    <Option v-for="item in levels" :key="item.id" :value="item.id">{{item.level_name}}</Option>
                </Select>
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
        name: "SearchHeader",
        components: {},
        props: {
            levels: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
                model: {
                    keyword: '',
                    level_id: 'all'
                }
            };
        },
        methods: {
            // 搜索
            handleSearch() {
                let model = Object.assign({}, this.model);
                model.level_id = model.level_id === 'all' ? '' : model.level_id;
                this.$emit('on-search', model);
            },
            setModel(model) {
                this.model = Object.assign(this.model, model);
            },
            handleReset() {
                this.model = {
                    level_id: '',
                    keyword: ''
                };
                this.$emit('on-search', {});
                // 重置表单
                this.resetModel();
            },
            handleExport() {
                this.$emit('on-export');
            },
            resetModel() {
                this.model = {
                    level_id: 'all',
                    keyword: ''
                };
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
