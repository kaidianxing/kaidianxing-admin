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
    <div class="invoice-table-list">
        <Table ref="table" :columns="columns" :data="getTableData" v-loading="loading" @on-selection-change="selectChange"></Table>
        <div class="footer-action" v-show="getTableData.length > 0">
            <Checkbox v-model="isSelectAll" :disabled='noManagePerm' @on-change="checkboxChange"></Checkbox>
            <Button :disabled="selectDisabled" @click="handleDelete('multiple')">批量删除</Button>
        </div>
        <div class="footer-page" v-show="getTableData.length > 0">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TableList",
        props: {
            data: {
                type: Array,
                default: () => []
            },
            total: {
                type: Number,
                default: 0
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center',
                    },
                    {
                        title: '模板名称',
                        key: 'name',
                    },
                    {
                        title: '快递公司',
                        key: 'express_name',
                    },
                    // {
                    //     title: '发件人模板',
                    //     key: 'price',
                    // },
                    {
                        title: '操作',
                        key: 'action',
                        width: 180,
                        render: (h, params) => {
                            let defaultComponent;
                            if (params.row.is_default == 1) {
                                defaultComponent = (
                                    <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.setDefault(params.row.id, '0');
                                    }}>取消默认</Button>
                                );
                            } else {
                                defaultComponent = (
                                    <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.setDefault(params.row.id, '1');
                                    }}>设为默认</Button>
                                );
                            }
                            return (
                                <div class="action">
                                    {defaultComponent}
                                    <Button type='text' disabled={this.noManagePerm} onClick={() => {
                                        this.handleEdit(params.row);
                                    }}>编辑</Button>
                                    <Button type='text' disabled={this.noManagePerm} onClick={() => {
                                        this.handleDelete('single', params.row);
                                    }}>删除</Button>
                                </div>
                            );
                        }
                    }
                ],
                selectRows: [], // 选中项
                isSelectAll: false,
            };
        },
        computed: {
            getTableData() {
                return this.data.map(item => {
                    item._disabled = this.noManagePerm;
                    return item;
                });
            },
            noManagePerm() {//无管理权限
                return !this.$getPermMap('goods.index.manage');
            },
            // 下方按钮是否可操作
            selectDisabled() {
                return this.selectRows.length === 0;
            }
        },
        methods: {
            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.data.length;
            },
            // 表格下方全选按钮
            checkboxChange(status) {
                this.data.forEach((item, index) => {
                    this.$set(this.data[index], '_checked', status);
                });
                if (status) {
                    this.selectRows = this.data;
                } else {
                    this.selectRows = [];
                }
            },
            handleEdit(row) {
                this.$router.push({
                    path: `/eOrder/templateManagement/invoice/edit?id=${row.id}`
                });
            },
            setDefault(id, status) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否确认修改默认状态',
                    onOk: () => {
                        this.$api.eOrderApi.setInvoiceDefault({id, is_default: status}).then(res => {
                            if (res.error === 0) {
                                this.$Message.success('发货单默认模板变更成功');
                                this.handleList();
                            }
                        })
                    }
                })
            },
            // 删除
            handleDelete(type, row) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除该模板',
                    onOk: () => {
                        let params = {}, isDefault = false;
                        if (type === 'single') {
                            params = {id: row.id};
                            isDefault = row.is_default == 1;
                        } else {
                            let id = this.selectRows.map(item => {
                                if (item.is_default == 1) {
                                    isDefault = true;
                                }
                                return item.id;
                            }).join(',');
                            params = {id};
                        }
                        this.deleteRow(params, isDefault);
                    }
                });
            },
            deleteRow(params, isDefault) {
                this.$api.eOrderApi.deleteInvoice(params).then(res => {
                    if (res.error === 0) {
                        this.$Message.success('发货单模板删除成功');
                        if (isDefault) {
                            setTimeout(() => {
                                this.$Message.success('发货单默认模板变更成功');
                            }, 2000)
                        }
                        this.handleRefresh();
                    }
                });
            },
            handleList() {
                // 重新请求数据
                this.$emit('on-list');
                this.initFooterData();
            },
            handleRefresh() {
                // 页面刷新
                this.$emit('on-refresh');
                this.initFooterData();
            },
            // 重置页码
            reset() {
                this.$refs['page'].reset();
            },
            changePage(page) {
                this.$emit('on-page-change', page);
                this.initFooterData();
            },
            // 初始化下方的checkbox
            initFooterData() {
                this.isSelectAll = false;
                this.selectRows = [];
            },
        }
    };
</script>

<style lang="scss" scoped>
    .invoice-table-list {
        /deep/ .ivu-table {
            td {
                .action {
                    margin-right: -8px;
                    .ivu-btn-text {
                        margin-right: 8px;
                    }
                }
            }
        }

        .footer-page {
            border-top: 1px solid $border-color;
        }
    }
</style>
