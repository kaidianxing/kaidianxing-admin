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
        <Form ref="form" :model="model" :label-width="100" inline>
            <FormItem label="关键词：">
                <Input type="text" v-model="model.keyword" placeholder="可搜索昵称/姓名/手机号/ID" class="width-340"/>
            </FormItem>
            <FormItem label="分销层级：">
                <Select v-model="model.level" placeholder="请选择" class="width-160">
                    <template v-for="item in optionData.level">
                        <Option v-if="isLevel(item)" :key="item.id"
                                :value="item.id">{{item.name}}
                        </Option>
                    </template>
                </Select>
            </FormItem>
            <FormItem label="分销商等级：">
                <Select v-model="model.agent_level" placeholder="请选择" class="width-160">
                    <Option v-for="item in grade" :key="item.id" :value="item.id">{{item.name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="是否为分销商：">
                <Select v-model="model.is_agent" placeholder="请选择" class="width-160">
                    <Option v-for="item in optionData.is_agent" :key="item.id" :value="item.id">{{item.name}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="成为时间：">
                <DatePicker v-model="becomeTime" type="datetimerange" placeholder="请选择"
                            format="yyyy-MM-dd HH:mm" @on-change="changeBecome"
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
        props: {
            grade: {
                type: Array,
                default: () => []
            },
            level: {
                type: [Number, String],
                default: 3
            }
        },
        data() {
            return {
                model: {
                    keyword: '',
                    level: 'all',
                    agent_level: 'all',
                    is_agent: 'all',
                    become_start_time: '',
                    become_end_time: ''
                },
                optionData: {
                    level: [
                        {
                            id: 'all',
                            name: '全部'
                        },
                        {
                            id: 1,
                            name: '一级下线'
                        },
                        {
                            id: 2,
                            name: '二级下线'
                        },
                    ],
                    is_agent: [
                        {
                            id: 'all',
                            name: '全部'
                        },
                        {
                            id: '0',
                            name: '普通用户'
                        },
                        {
                            id: '1',
                            name: '分销商'
                        }
                    ]
                },
                becomeTime: []
            };
        },
        methods: {
            changeBecome(date) {
                this.model.become_start_time = date[0];
                this.model.become_end_time = date[1];
            },
            // 搜索
            handleSearch() {
                let model = Object.assign({}, this.model);
                model.level = model.level === 'all' ? '' : model.level;
                model.is_agent = model.is_agent === 'all' ? '' : model.is_agent;
                model.agent_level = model.agent_level === 'all' ? '' : model.agent_level;
                this.$emit('on-change', model);
            },
            handleReset() {
                this.reset();
                this.$emit('on-change', {});
            },
            // 导出
            handleExport() {
                this.$emit('on-export')
            },
            reset() {
                this.model = {
                    keyword: '',
                    level: 'all',
                    agent_level: 'all',
                    is_agent: 'all',
                    become_start_time: '',
                    become_end_time: ''
                };
                this.becomeTime = [];
            },
            isLevel(item) {
                if (item.id === 2) {
                    return parseInt(this.level) >= 2;
                } else if (item.id === 3) {
                    return this.level == 3;
                } else {
                    return true;
                }
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
