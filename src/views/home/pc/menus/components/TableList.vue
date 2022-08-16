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
        },
        type: {
            type: String,
            default: '1'//1顶部菜单 2底部菜单
        },
    },
    data() {
        return {
            columns: [
                {
                    title: '排序',
                    key: 'sort_order',
                    width: 100
                },
                {
                    title: '菜单名称',
                    key: 'name'
                },
                {
                    title: '跳转链接',
                    key: 'url'
                },
                {
                    title: '创建时间',
                    key: 'created_at'
                },
                {
                    title: '状态',
                    key: 'status',
                    width: 100,
                    render: (h, params) => {
                        if (params.row.status == '0') {
                            return (
                                <kdx-status-text>禁用</kdx-status-text>
                            );
                        } else if (params.row.status == '1') {
                            return (
                                <kdx-status-text type={'success'}>启用</kdx-status-text>
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
                                    this.handleLabelGroupStatus(params.row, '1');
                                }}>启用</Button>
                            );
                        } else {
                            component = (
                                <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                    this.handleLabelGroupStatus(params.row, '0');
                                }}>禁用</Button>
                            );
                        }
                        return (
                            <div class="action">
                                {
                                    component
                                }
                                <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                    this.$router.push({path: `/home/pc/menus/add`, query: {id: params.row.id,type:this.type}})
                                }}>编辑</Button>
                                <Button type="text" disabled={this.noManagePerm || params.row.is_default == '1'}
                                        onClick={() => {
                                            this.handleDelete(params.row);
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
            })
        },
        noManagePerm() { //管理权限
            return !this.$getPermMap('pc.menus.manage')
        },
        isDisabled() {
            return this.selectRows.length === 0;
        },

        selectHasDefault() {
            return this.selectRows.some(row => row.is_default == '1')
        }
    },
    methods: {
        // 选中项发生变化
        selectChange(selection) {
            this.selectRows = selection;
            this.isSelectAll = this.selectRows.length === this.data.length;
        },
        checkboxChange(status) {
            this.$refs['table'].selectAll(status);
        },
        handleLabelGroupStatus(row, status) {
            this.$api.homeApi.changeStatus({id: row.id, status: status})
                .then(res => {
                    if (res.error === 0) {
                        this.$Message.success('状态修改成功');
                        this.$emit('on-refresh');
                    }
                });
        },

        // 删除
        handleDelete(row) {
            this.$Modal.confirm({
                title: '提示',
                content: '是否确认删除？',
                onOk: () => {
                    this.$api.homeApi.menuDelete({id: row.id})
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('删除成功');
                                this.$emit('on-refresh');
                            }
                        })
                        .catch();
                }
            });
        },
        deleteLabel(idArr) {
            this.$api.goodsApi.deleteLabelGroup({id: idArr})
                .then(res => {
                    if (res.error === 0) {
                        this.$Message.success('标签删除成功');
                        this.$emit('on-refresh');
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
            this.isSelectAll = false;
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
