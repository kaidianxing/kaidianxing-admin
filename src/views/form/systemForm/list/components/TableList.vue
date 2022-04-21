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
    <div class="order-evaluate-list">
        <Table ref="table" :columns="columns" :data="data" @on-selection-change="selectChange"></Table>
        <div class="footer-action" v-show="data.length">
            <Checkbox v-model="isSelectAll" @on-change="checkboxChange"></Checkbox>
            <Button :disabled="selectDisabled" @click="handleDelete({type: 'multiple'})">批量删除</Button>
        </div>
        <div class="footer-page" v-show="total > 10">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
    </div>
</template>

<script>
    import {Export} from '@/helpers/export'
    export default {
        props: {
            data: {
                type: Array,
                default: () => []
            },
            total: {
                type: Number,
                default: 0
            }
        },
        computed: {
            // 下方按钮是否可操作
            selectDisabled() {
                return this.selectRows.length === 0;
            }
        },
        data() {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '表单模板ID',
                        key: 'id'
                    },
                    {
                        title: '表单名称',
                        key: 'name'
                    },
                    {
                        title: '表单类型',
                        key: 'type',
                        render: () => {
                            return (
                                <kdx-tag-label type="info">下单信息</kdx-tag-label>
                            )
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'created_at'
                    },
                    {
                        title: '已收集数据(条)',
                        key: 'count'
                    },
                    {
                        title: '启用状态',
                        key: 'status',
                        render: (h, params) => {
                            if (params.row[params.column.key] == 0) {
                                return (
                                    <kdx-status-text type="disabled">未启用</kdx-status-text>
                                )
                            } else if (params.row[params.column.key] == 1) {
                                return (
                                    <kdx-status-text type="success">已启用</kdx-status-text>
                                )
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        minWidth: 80,
                        maxWidth: 250,
                        render: (h, params) => {
                            let status;
                            if (params.row.status == 0) {
                                status = (
                                    <Button type="text" onClick={() => {
                                        this.setStatus({row: params.row, status: 1});
                                    }}>启用</Button>
                                )
                            } else {
                                status = (
                                    <Button type="text"  onClick={() => {
                                        this.setStatus({row: params.row, status: 0});
                                    }}>禁用</Button>
                                )
                            }
                            return (<div class='action-btn'>
                                {status}
                                <Button type="text" onClick={()=>{this.handleEdit(params.row)}}>编辑</Button>
                                <Button type='text' onClick={()=>{this.handleDelete({type: 'single', id: params.row.id});}}>删除</Button>
                                <Button type="text" onClick={()=>{this.handlePreview(params.row)}}>预览</Button>
                                <Button type="text" onClick={()=>{this.routeDetail(params.row)}}>查看</Button>
                                <Button type='text' onClick={()=>{this.handleExport(params.row)}}>导出</Button>
                                <Button type='text' onClick={()=>{this.handleUpdateData(params.row)}}>更新数据</Button>
                            </div>)
                        }
                    }
                ],
                selectRows: [],
                isSelectAll: false,
            };
        },
        methods: {
            // 重置页码
            reset() {
                this.$refs['page'].reset();
                this.selectRows = [];
                this.isSelectAll = false;
            },
            changePage(page) {
                this.$emit('on-page-change', page);
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
            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.data.length;
            },
            // 删除
            handleDelete({type, id}) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '删除表单后往期数据将无法导出,确认删除这个表单吗？',
                    onOk: () => {
                        let params = {};
                        if (type === 'multiple') {
                            params = {ids: this.selectRows.map(item => item.id).join(',')};
                        } else {
                            params = {id};
                        }
                        this.deleteComment(params);
                    },
                    onCancel: () => {
                    }
                });
            },
            deleteComment(params) {
                this.$api.formApi.deleteSystemForm(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('系统表单删除成功');
                            this.$emit('on-refresh');
                        }
                    });
            },
            setStatus({row, status}) {
                if (status == 0) {
                    // 启用
                    this.$Modal.confirm({
                        title: '提示',
                        content: '确认禁用这个表单吗？',
                        onOk: () => {
                            this.$api.formApi.setSystemDisabled({id: row.id}).then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('该表单禁用操作成功');
                                    this.$emit('on-refresh');
                                }
                            })
                        }
                    })
                } else {
                    // 禁用
                    this.$Modal.confirm({
                        title: '提示',
                        content: '确认启用这个表单吗？',
                        onOk: () => {
                            this.$api.formApi.setSystemActive({id: row.id}).then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('该表单启用操作成功');
                                    this.$emit('on-refresh');
                                }
                            })
                        }
                    })
                }
            },
            handleExport(row) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否确认导出?',
                    onOk: () => {
                        
                        Export('manage/form/list/download', {id: row.id, type: row.type})
                    }
                })
            },
            handlePreview(data) {
                let type = {
                    '1': 'order',
                    '2': 'commission',
                    '3': 'vip',
                    '4': 'goods',
                };
                this.$emit('on-preview', {type: type[data.type.toString()], data: data.content ? JSON.parse(data.content) :''});
            },
            handleEdit(row) {
                let type = {
                    1: 'order',
                    2: 'commission',
                    3: 'vip',
                    4: 'goods'
                }
                this.$router.push({
                    path: `/systemForm/edit?id=${row.id}&type`,
                    query: {
                        id: row.id,
                        type: type[row.type]
                    }
                })
            },
            routeDetail(row) {
                let paths = {
                    1: '/systemForm/detail/order',
                    2: '/systemForm/detail/commission',
                    3: '/systemForm/detail/vip',
                    4: '/systemForm/detail/goods'
                }
                this.$router.push({
                    path: paths[row.type],
                    query: {
                        id: row.id
                    }
                })
            },
            handleUpdateData(row) {
                this.$emit('on-update-data', row);
            },
            // 初始化下方的checkbox
            initFooterData() {
                this.isSelectAll = false;
                this.selectRows = [];
            },
        }
    };
</script>

<style scoped lang="scss">
    .order-evaluate-list {
        /deep/ .ivu-table {
            td {
                // 操作
                .action-btn {
                    > .ivu-btn {
                        margin-right: 8px;
                    }
                }
            }
        }

        .footer-action {
            padding: 16px 0;

            .ivu-checkbox-default {
                margin-right: 0;
                width: 40px;
                text-align: center;
            }

            .ivu-btn-default {
                width: inherit;
                margin-left: 10px;
            }
        }
        .footer-page {
            border-top: 1px solid $border-color;
        }
    }
</style>
