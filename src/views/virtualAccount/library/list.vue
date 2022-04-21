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
    <div class="virtual-account-list">
        <kdx-header-bar type="little">
            <template #header>
                <Button type="primary" :disabled="noManagePerm" to="/virtualAccount/library/add">+创建卡密库</Button>
            </template>
            <Form ref="form" :model="search" :label-width="100" inline @submit.native.prevent>
                <FormItem label="卡密库名称：">
                    <Input type="text" v-model="search.keyword" placeholder="请输入卡密库名称" class="width-340" @on-enter="handleSearch"/>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="action">
                    <div>
                        <Button class="marginR-10" type="text" :disabled="noManagePerm" @click="handleClick(row.id, 'edit')">编辑</Button>
                        <Button class="marginR-10" type="text" :disabled="noDataManagePerm" @click="handleClick(row.id, 'addData')">添加数据</Button>
                        <Button class="marginR-10" type="text" :disabled="noDataViewPerm" @click="handleClick(row.id, 'viewData')">查看数据</Button>
                        <Button type="text" :disabled="noManagePerm" @click="handleDelete(row.id)">删除</Button>
                    </div>
                </template>
            </Table>
            <div class="footer-page">
                <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "list",
        components: {},
        props: {},
        data() {
            return {
                loading: false,
                total: 1,
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                },
                search: {
                    keyword: ''
                },
                data: [],
                columns: [
                    {
                        title: '卡密库名称',
                        key: 'name',
                    },
                    {
                        title: '总库存',
                        key: 'stock',
                    },
                    {
                        title: '剩余库存',
                        key: 'remaining_count',
                    },
                    {
                        title: '邮箱状态',
                        key: 'mailer',
                        render: (h, params) => {
                            return (
                                <div class={params.row.mailer === '0'?'danger-color':'success-color'}>{params.row.mailer==='0'?'已关闭':'已开启'}</div>
                            )
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 280,
                        slot: 'action'
                    }
                ]
            }
        },
        computed: {
            noManagePerm(){//无管理权限
                return !this.$getPermMap('virtualAccount.index.manage')
            },
            noDataViewPerm(){//无管理权限
                return !this.$getPermMap('virtualAccountData.index.view')
            },
            noDataManagePerm(){//无管理权限
                return !this.$getPermMap('virtualAccountData.index.manage')
            },
        },
        created() {
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                this.loading = true;
                let params = {
                    ...this.search,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                };
                this.$api.virtualAccountApi.virtualAccountList(params).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.data = res.list;
                        this.total = res.total
                    }
                })
            },
            handleSearch() {
                this.refreshTable()
            },
            handleReset() {
                this.search = {
                    keyword: ''
                };
                this.refreshTable()
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1,
                };
                this.$refs['page'].reset();
                this.getList()
            },
            handleClick(id, type) {
                let path = '/virtualAccount/library/edit';
                if (type === 'addData') {
                    path = '/virtualAccount/library/data/index'
                } else if (type === 'viewData') {
                    path = '/virtualAccount/library/data/list'
                }
                this.$router.push({
                    path,
                    query: {id}
                })
            },
            handleDelete(id) {
                // '<p class="danger-color">是否要删除该用户？如果删除该用户所有信息也将会被删除。删除后不可找回。</p>'
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否删除该卡密库',
                    onOk: () => {
                        this.$api.virtualAccountApi.virtualAccountDelete({id}).then((res) => {
                            if (res.error === 0) {
                                this.$Message.success('删除成功');
                                this.getList()
                            }
                        })
                    }
                })
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
        },
    }
</script>

<style lang="scss" scoped>
    .virtual-account-list {
        margin: 20px auto;
        background-color: $background-color;
        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            margin-top: 10px;
            border-radius: 2px;
            position: relative;
        }
    }
</style>