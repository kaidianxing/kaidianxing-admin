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
    <div class="printer-manage-list">
        <kdx-header-bar type="little">
            <template #header>
                <Button type="primary" @click="handleAdd">+添加打印机</Button>
            </template>
            <Form ref="form" :model="searchData" :label-width="100" inline @submit.native.prevent>
                <FormItem label="打印机名称：">
                    <Input class="width-340" type="text" v-model="searchData.keywords" placeholder="请输入" @on-enter="handleSearch"/>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="table-list">
            <Table ref="table" :columns="columns" :data="list"></Table>
            <div class="footer-page">
                <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "list",
        components: {},
        props: {},
        data() {
            return {
                total: 0,
                list: [],
                searchData: {
                    keywords: '',
                },
                page: {
                    pageSize: 10,
                    pageNumber: 1 // 页码
                },
                columns: [
                    {
                        title: '打印机名称',
                        key: 'name',
                    },
                    {
                        title: '打印机品牌',
                        key: 'brand',
                    },
                    {
                        title: '使用位置',
                        key: 'location',
                        render: (h, params) => {
                            return (
                                <div>{params.row.location||'-'}</div>
                            )
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        render: (h, params) => {
                            return (
                                <div>{params.row.status == 1 ? (
                                    <span class="success-color">已启用</span>
                                ) : (
                                    <span class="danger-color">未启用</span>
                                )}</div>
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return (
                                <div>
                                    <Button type="text" onClick={() => {this.handleStatus(params.row)}}>{params.row.status == 1 ?'禁用':'启用'}</Button>
                                    <Button class="marginL-10 marginR-10" type="text" onClick={() => {this.handleEdit(params.row.id)}}>编辑</Button>
                                    <Button type="text" onClick={() => {this.handleDelete(params.row.id)}}>删除</Button>
                                    <Button class="marginL-10" type="text" onClick={() => {this.handleCancelPrinter(params.row.id)}}>取消任务</Button>
                                </div>
                            )
                        }
                    },
                ],
            }
        },
        computed: {},
        created() {
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                this.loading = true;
                let obj = {
                    keyword: this.searchData.keywords,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                };
                this.$api.printerApi.printerList(obj).then(res => {
                    this.loading = false;
                    if (res.error == 0) {
                        this.list = res.data.list;
                        this.total = res.data.total
                    }
                })
            },
            handleAdd() {
                this.$router.push({
                    path: '/printer/manage/add'
                });
            },
            handleSearch() {
                this.list = [];
                this.page = 1;
                this.getList();
            },
            handleReset() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1,
                };
                this.searchData = {
                    keywords: '',
                }
                this.$refs['page'].reset();
                this.getList()
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            handleStatus(data) {
                if (data.status == 1) {
                    this.$api.printerApi.printerForbidden({id: data.id, is_check: 1}).then(res => {
                        if (res.error == 0) {
                            this.$Modal.confirm({
                                title: '提示',
                                content: res?.message || '确认禁用该打印机',
                                onOk: () => {
                                    this.$api.printerApi.printerForbidden({id: data.id, is_check: 0}).then(res => {
                                        if (res.error == 0) {
                                            this.$Message.success('修改成功');
                                            this.getList()
                                        }
                                    })
                                },
                                onCancel: () => {

                                }
                            });
                        }
                    })
                } else {
                    this.$api.printerApi.printerActive({id: data.id}).then(res => {
                        if (res.error == 0) {
                            this.$Message.success('修改成功');
                            this.getList()
                        }
                    })
                }
            },
            handleEdit(id) {
                this.$router.push({
                    path: '/printer/manage/edit',
                    query: {id}
                });
            },
            handleDelete(id) {
                this.$api.printerApi.deletePrinter({id: id, is_check: 1}).then(res => {
                    if (res.error == 0) {
                        this.$Modal.confirm({
                            title: '提示',
                            content: res?.message || '确认删除该打印机',
                            onOk: () => {
                                this.$api.printerApi.deletePrinter({id: id, is_check: 0}).then(res => {
                                    if (res.error == 0) {
                                        this.$Message.success('删除成功');
                                        this.getList()
                                    }
                                })
                            },
                            onCancel: () => {

                            }
                        });
                    }
                })
            },
            handleCancelPrinter(id) {
                this.$api.printerApi.cancelPrinter({id: id}).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('取消成功');
                        this.getList()
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .printer-manage-list {
        margin-top: 20px;
        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            border-radius: 2px;
            position: relative;
        }
    }
</style>
