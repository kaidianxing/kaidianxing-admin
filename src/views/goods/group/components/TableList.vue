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
    <div class="good-group-table-list">
        <Table ref="table" :columns="columns" :data="getTableData" @on-selection-change="selectChange"></Table>
        <div class="footer-action" v-if="getTableData.length > 0">
            <Checkbox v-model="isSelectAll" :disabled='noManagePerm' @on-change="checkboxChange"></Checkbox>
            <Button :disabled="isDisabled" @click="editStatus({type: 'multiple', status: 1})">启用</Button>
            <Button :disabled="isDisabled" @click="editStatus({type: 'multiple', status: 0})">禁用</Button>
            <Button :disabled="isDisabled" @click="handleDelete({type: 'multiple'})">删除</Button>
        </div>
        <div class="footer-page">
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
                        title: '商品分组名称',
                        key: 'name'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width: 100,
                        render: (h, params) => {
                            if (params.row[params.column.key] === '1') {
                                return (
                                    <kdx-status-text type={'success'}>启用</kdx-status-text>
                                );
                            } else if (params.row[params.column.key] === '0') {
                                return (
                                    <kdx-status-text type={'disabled'}>禁用</kdx-status-text>
                                );
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        render: (h, params) => {
                            let component;
                            if (params.row.status === '0') {
                                component = (
                                    <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.editStatus({type: 'single', row: params.row, status: 1});
                                    }}>启用</Button>
                                );
                            } else {
                                component = (
                                    <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.editStatus({type: 'single', row: params.row, status: 0});
                                    }}>禁用</Button>
                                );
                            }
                            return (
                                <div class="action">
                                    {
                                        component
                                    }
                                    <Button disabled={this.noManagePerm} type="text" onClick={()=>{this.toEdit(`/goods/group/edit`,params.row.id)}}>编辑</Button>
                                    <Button disabled={this.noManagePerm} type="text" onClick={() => {
                                        this.handleDelete({type: 'single', row: params.row});
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
            noManagePerm() { //管理权限
                return !this.$getPermMap('goods.group.manage')
            },
            isDisabled() {
                return this.selectRows.length === 0;
            },
            getTableData(){
                return this.data.map(item=>{
                    item._disabled=this.noManagePerm
                    return item
                })
            }
        },
        methods: {
            toEdit(path,id){
                this.$router.push({
                    path,
                    query: {
                        id
                    }
                })
            },
            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.data.length;
            },
            checkboxChange(status) {
                this.$refs['table'].selectAll(status);
            },
            // 修改状态 启用/禁用
            editStatus({type, status, row}) {
                let id;
                if (type === 'single') {
                    id = row.id;
                } else if (type === 'multiple') {
                    id = this.selectRows.map(item => item.id);
                }
                this.$api.goodsApi.editGoodGroupStatus({id: id, status: status})
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('商品组状态修改成功');
                            this.initFooterData();
                            this.$emit('on-refresh');
                        }
                    });
            },
            // 删除
            handleDelete({type, row}) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否删除该商品组？',
                    onOk: () => {
                        if (type === 'single') {
                            this.deleteGroup(row.id);
                        } else if (type === 'multiple') {
                            let idArr = this.selectRows.map(item => item.id);
                            this.deleteGroup(idArr);
                        }
                    }
                });
            },
            deleteGroup(idArr) {
                this.$api.goodsApi.deleteGoodGroup({id: idArr})
                    .then(res => {
                        if (res.error === 0) {
                            this.$Message.success('该商品组删除成功');
                            this.$emit('on-refresh');
                            this.initFooterData();
                        }
                    })
                    .catch();
            },
            // 重置页码
            reset(page) {
                this.$refs['page'].reset(page);
            },
            changePage(page) {
                this.$emit('on-page-change', page);
            },
            // 下方的按钮初始化
            initFooterData() {
                this.isSelectAll =  false;
                this.selectRows = [];
            }
        }
    };
</script>

<style scoped lang="scss">
    .good-group-table-list {
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
        .footer-action {
            padding: 16px 0;
            border-bottom: 1px solid $border-color;
            .ivu-checkbox-default {
                margin-right: 0;
                width: 40px;
                text-align: center;
                > span {
                    /*&:last-child {*/
                    /*    display: none;*/
                    /*}*/
                }
            }
            .ivu-btn-default {
                width: inherit;
                margin-left: 10px;
            }
        }
    }
</style>
