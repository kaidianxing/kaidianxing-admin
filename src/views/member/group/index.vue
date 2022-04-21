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
    <div class="vip-group">
        <kdx-header-bar type="little">
            <template #header>
                <div class="flex space-between">
                    <Button type="primary" :disabled="noManagePerm" @click="addLabelGroup">+添加标签组</Button>
                    <div class="flex">
                        <Form ref="form" :model="model" :label-width="100" inline @submit.native.prevent>
                            <FormItem label="标签组名称：">
                                <Input type="text" v-model="model.keyword" placeholder="关键词查询" class="width-160" @on-enter="handleSearch" />
                            </FormItem>
                            <!--<FormItem label="标签组状态：">
                                <Select v-model="model.status" class="width-160">
                                    <Option v-for="item in optionData.status" :key="item.value" :value="item.value">
                                        {{item.name}}
                                    </Option>
                                </Select>
                            </FormItem>-->
                        </Form>
                        <div class="btn">
                            <Button class="mL-20" type="primary" @click="handleSearch">搜索</Button>
                            <Button class="mL-20" type="text" @click="handleReset">重置</Button>
                        </div>
                    </div>
                </div>
            </template>
        </kdx-header-bar>
        <div class="table-list" v-loading="loading">
            <table-list ref='tableList' :data="list" :total="total" @on-edit="handleEdit" @getList="getList" @on-page-change="changePage"></table-list>
        </div>
        <!--添加标签组-->
        <kdx-modal-frame v-model="group.modal" :title="modalTitle" @on-cancel="handleCancel" @on-ok="handleOk">
            <Form v-if="group.modal" ref="form" :model="group.model" :rules="rules" :label-width="120">
                <FormItem label="标签名称：" prop="group_name" style="margin-top: 20px;">
                    <Input type="text" v-model="group.model.group_name" placeholder="标签名称" class="width-340"/>
                </FormItem>
                <FormItem label="标签描述：">
                    <Input type="textarea" v-model="group.model.description" placeholder="标签描述" class="width-340" :autosize="{minRows: 6}"/>
                </FormItem>
            </Form>
        </kdx-modal-frame>
        <slot></slot>
    </div>
</template>

<script>
    import TableList from "./components/TableList";

    export default {
        name: "index",
        inject:['returnToTop'],
        components: {
            TableList
        },
        data() {
            return {
                list: [],
                model: {
                    // status: '',
                    keyword: ''
                },
                modalTitle: '添加标签组',
                total: 0,
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                optionData: {
                    status: [
                        {
                            value: '',
                            name: '全部'
                        },
                        {
                            value: '1',
                            name: '启用'
                        },
                        {
                            value: '0',
                            name: '禁用'
                        }
                    ]
                },
                group: {
                    modal: false,
                    model: {
                        group_name: '',
                        description: ''
                    }
                },
                rules: {
                    group_name: [
                        {
                            required: true, message: '请填写标签名称', trigger: 'blur'
                        }
                    ]
                },
                loading: false
            };
        },
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('member.group.manage')
            },
        },
        created() {
        },
        mounted() {
            this.$history.setRoute(this.$route).getData(history=>{
                this.model=history.model||{
                    keyword: ''
                }
                this.page=history.page||{
                    pageSize: 10,
                    pageNumber: 1
                }
                this.$refs.tableList.reset(this.page)
            })
            this.getList()
        },
        methods: {
            getList() {
                this.returnToTop();
                this.loading = true;
                let obj = {
                    keyword: this.model.keyword,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                };
                this.$history.setData({
                    model:this.model,
                    page:this.page
                })
                this.$api.memberApi.getGroupList(obj).then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        this.list = res.list;
                        this.total = res.total
                    }
                })
            },
            handleSearch() {
                this.list = [];
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.getList();
            },
            // 重置
            handleReset() {
                this.model.keyword = '';
                this.getList()
            },
            addLabelGroup() {
                this.group.modal = true;
                this.modalTitle = '添加标签组';
                this.group.model =  {
                    group_name: '',
                    description: ''
                }
            },
            handleCancel() {
                this.group.modal = false;
            },
            handleOk() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.$api.memberApi[this.group.model.id?'editGroup':'addGroup']({...this.group.model}).then(res => {
                            if (res.error == 0) {
                                this.getList();
                                this.$Message.success('保存成功')
                            }
                            this.group.modal = false;
                            this.modalTitle = '添加标签组';
                            this.group.model =  {
                                group_name: '',
                                description: ''
                            }
                        })
                    }
                });
            },
            // 编辑
            handleEdit(row) {
                this.group.model = JSON.parse(JSON.stringify({
                    group_name: row.group_name,
                    description: row.description,
                    id: row.id
                }));
                this.modalTitle = '编辑标签组';
                this.group.modal = true;
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
        }
    };
</script>

<style scoped lang="scss">
    .vip-group {
        background-color: $background-color;
        margin: 20px auto;
        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            border-radius: 2px;
            position: relative;
        }
        .header-bar {
            .ivu-form .ivu-form-item {
                margin-bottom: 0;
            }
        }
    }
</style>
