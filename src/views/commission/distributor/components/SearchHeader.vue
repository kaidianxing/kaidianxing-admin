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
                <Input type="text" v-model="model.keyword" placeholder="可搜索昵称/姓名/手机号/ID" class="width-340" @on-enter="handleSearch"/>
            </FormItem>
            <FormItem label="分销商等级：">
                <Select v-model="model.commission_level" placeholder="请选择" class="width-160">
                    <Option v-for="item in grade" :key="item.id" :value="item.id">{{item.name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="申请时间：">
                <DatePicker v-model="applyTime" type="datetimerange" placeholder="请选择"
                            format="yyyy-MM-dd HH:mm" @on-change="changeApply"
                            class="width-340"></DatePicker>
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
            grade: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                model: {
                    keyword: '',
                    commission_level: 'all',
                    apply_start_time: '',
                    apply_end_time: ''
                },
                optionData: {
                },
                applyTime: []
            };
        },
        methods: {
            changeApply(date) {
                this.model.apply_start_time = date[0];
                this.model.apply_end_time = date[1];
            },
            // 搜索
            handleSearch() {
                let model = Object.assign({}, this.model);
                model.commission_level = model.commission_level === 'all'? '' :model.commission_level;
                this.$emit('on-change', model);
            },
            handleReset() {
              this.reset();
              this.$emit('on-change', {});
            },
            reset() {
                this.model = {
                    keyword: '',
                    commission_level: 'all',
                    apply_start_time: '',
                    apply_end_time: ''
                };
               this.applyTime = [];
            },
            handleExport() {
                this.$emit('on-export');
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
