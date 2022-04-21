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
                <Input type="text" v-model="model.keyword" placeholder="可搜索昵称/姓名/手机号" class="width-340" @on-enter="handleSearch"/>
            </FormItem>
            <FormItem label="用户来源：">
                <Select v-model="model.source" placeholder="全部" class="width-160">
                    <Option v-for="item in sourceList" :key="item.id" :value="item.id">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="用户等级：">
                <Select v-model="model.level_id" placeholder="全部" class="width-160">
                    <Option key="all" value="all">全部</Option>
                    <Option v-for="item in levels" :key="item.id" :value="item.id">{{item.level_name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="标签组：">
                <Select v-model="model.group_id" placeholder="全部" class="width-160">
                    <Option key="all" value="all">全部</Option>
                    <Option v-for="item in groups" :key="item.id" :value="item.id">{{item.group_name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="注册时间：">
                <DatePicker v-model="model.registerTime" type="datetimerange" placeholder="注册时间"
                            format="yyyy-MM-dd HH:mm"
                            class="width-340"></DatePicker>
            </FormItem>
            <FormItem label="黑名单：">
                <Select v-model="model.is_black" placeholder="all" class="width-160">
                    <Option key="all" value="all">全部</Option>
                    <Option v-for="item in optionData.blacklist" :key="item.id" :value="item.id">{{item.name}}</Option>
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
            groups: {
                type: Array,
                default: () => []
            },
            levels: {
                type: Array,
                default: () => []
            },
            group_id: {
                type: String,
                default: ''
            },
            level_id: {
                type: String,
                default: ''
            },
        },
        data() {
            return {
                model: {
                    keyword: '',
                    source: 'all',
                    level_id: 'all',
                    group_id: 'all',
                    is_black: 'all',
                    registerTime: []
                },
                optionData: {
                    blacklist: [
                        {
                            id: 1,
                            name: '是'
                        },
                        {
                            id: 0,
                            name: '否'
                        }
                    ]
                }
            };
        },
        computed: {
            sourceList() {
                let result = [
                    {
                        id: 'all',
                        name: '全部'
                    },
                    {
                        id: 20,
                        name: '微信公众号'
                    },
                    {
                        id: 10,
                        name: 'H5'
                    },
                    {
                        id: 21,
                        name: '微信小程序'
                    },
                    {
                        id: 30,
                        name: '抖音小程序'
                    },
                    // {
                    //     id: 5,
                    //     name: '支付宝小程序'
                    // }
                ];

                return result
            }
        },
        watch: {
            groups: {
                handler(newValue) {
                    if (newValue && this.group_id) {
                        this.model.group_id = this.group_id;
                    }
                }
            },
            levels: {
                handler(newValue) {
                    if (newValue && this.level_id) {
                        this.model.level_id = this.level_id;
                    }
                }
            },
        },
        methods: {
            // 搜索
            handleSearch() {
                delete this.model.export;
                this.$emit('on-search', this.model);
            },
            handleReset(model,page) {
                for(let k in model){
                    if(model[k]===''){
                        delete model[k];
                    }
                }
                this.model = {
                    keyword: '',
                    source: 'all',
                    level_id: 'all',
                    group_id: 'all',
                    is_black: 'all',
                    registerTime: [],
                    ...model
                }; 
                this.$emit('refreshTable', this.model,page);
                // 重置表单
                this.$refs['form'].resetFields();
                this.$nextTick(() => {
                    if(model){
                        this.model = {
                            keyword: '',
                            source: 'all',
                            level_id: 'all',
                            group_id: 'all',
                            is_black: 'all',
                            registerTime: [],
                            ...model
                        }; 
                    }
                })
            },
            handleExport() {
                // this.$Modal.confirm({
                //     title: "提示",
                //     content: "<p>您确认导出这个吗?</p>",
                //     onOk: () => {
                //         this.exportMember()
                //     },
                //     onCancel: () => {
                //     }
                // });
                this.$emit('on-export')
            },
            exportMember() {
                this.$emit('export')
            }
        }
    };
</script>

<style scoped lang="scss">

</style>
