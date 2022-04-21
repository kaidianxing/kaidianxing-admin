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
        <kdx-header-bar>
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
            <Table ref="table" :columns="columns" :data="data" @on-selection-change="selectChange">
                <template slot-scope="{ row }" slot="action">
                    <div>
                        <Button class="marginR-10" type="text" :disabled="noViewPerm" @click="toData(row.id)">查看数据</Button>
                        <Button class="marginR-10" type="text" :disabled="noManagePerm" @click="handleRecover('0', row.id)">恢复</Button>
                        <Button type="text" :disabled="noManagePerm" @click="handleDelete('0', row.id)">彻底删除</Button>
                    </div>
                </template>
            </Table>
            <div class="footer-action" v-if="data.length > 0">
                <Checkbox v-model="isSelectAll" @on-change="checkboxChange"></Checkbox>
                <Button :disabled="selectDisabled || noManagePerm" @click="handleRecover('1')">恢复</Button>
                <Button :disabled="selectDisabled || noManagePerm" @click="handleDelete('1')">彻底删除</Button>
            </div>
            <div class="footer-page">
                <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "index",
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
                isSelectAll: false,
                selectRows: [], // 选中项

                data: [],
                columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '卡密库名称',
                        key: 'name',
                    },
                    {
                        title: '总库存',
                        key: 'stock',
                    },
                    {
                        title: '已售',
                        key: 'sell_count',
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                    },
                    {
                        title: '删除时间',
                        key: 'updated_at',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        slot: 'action'
                    }
                ]
            }
        },
        computed: {
            // 下方按钮是否可操作
            selectDisabled() {
                return this.selectRows.length === 0;
            },
            noViewPerm() {
                return !this.$getPermMap('virtualAccountData.index.view')
            },
            noManagePerm() {
                return !this.$getPermMap('virtualAccount.recycleBin.manage')
            }
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
                this.$api.virtualAccountApi.recycleList(params).then((res) => {
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

            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.data.length;
            },
            // 表格下方全选按钮
            checkboxChange(status) {
                this.$refs['table'].selectAll(status);
                this.data.forEach((item, index) => {
                    this.$set(this.data[index], '_checked', status);
                });
                if (status) {
                    this.selectRows = this.data;
                } else {
                    this.selectRows = [];
                }
            },
            // 初始化下方的checkbox
            initFooterData() {
                this.isSelectAll = false;
                this.selectRows = [];
            },
            changePage(page) {
                this.page = page;
                this.getList();
                this.initFooterData()
            },

            toData(id) {
                this.$router.push({
                    path: '/virtualAccount/library/data/list',
                    query: {id}
                })
            },
            handleRecover(is_batch, id) {
                // is_batch 是否批量
                if (is_batch === '1') {
                    id = this.selectRows.map(item => item.id)
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否恢复卡密库',
                    onOk: () => {
                        this.$api.virtualAccountApi.recycleBinRecover({id}).then((res) => {
                            if (res.error === 0) {
                                this.$Message.success('恢复成功');
                                this.selectRows = [];
                                this.isSelectAll = false;
                                this.getList()
                            }
                        })
                    }
                })
            },
            handleDelete(is_batch, id) {
                // is_batch 是否批量
                if (is_batch === '1') {
                    id = this.selectRows.map(item => item.id)
                }
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否彻底删除卡密库',
                    onOk: () => {
                        this.$api.virtualAccountApi.recycleBinDelete({id}).then((res) => {
                            if (res.error === 0) {
                                this.$Message.success('删除成功');
                                this.selectRows = [];
                                this.isSelectAll = false;
                                this.getList()
                            }
                        })
                    }
                })
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