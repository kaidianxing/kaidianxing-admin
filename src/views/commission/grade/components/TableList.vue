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
        <kdx-hint-alert :show-icon="false">提示：没有设置等级的分销商将按默认等级计算佣金，商品指定了佣金金额就按商铺你的佣金金额计算，不受等级影响</kdx-hint-alert>
        <Table ref="table" :columns="columns" :data="data" v-loading="loading"></Table>
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
            loading: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: '等级权重',
                        key: 'level',
                        width: 100,
                        render: (h, params) => {
                            if (params.row.is_default == '1') {
                                return (
                                    <div>默认</div>
                                );
                            } else {
                                let data = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十',];
                                return (
                                    <div>{data[parseInt(params.row.level) - 1]}级</div>
                                );
                            }
                        }
                    },
                    {
                        title: '等级名称',
                        key: 'name',
                    },
                    {
                        title: '一级佣金比例',
                        key: 'commission_1',
                        render: (h, params) => {
                            return (
                                <div>{this.formatRate(params.row[params.column.key])}</div>
                            );
                        }
                    },
                    {
                        title: '二级佣金比例',
                        key: 'commission_2',
                        render: (h, params) => {
                            return (
                                <div>{this.formatRate(params.row[params.column.key])}</div>
                            );
                        }
                    },
                    {
                        title: '升级条件',
                        key: 'condition_text',
                        render: (h, params) => {
                            if (params.row[params.column.key]) {
                                return (
                                    <Tooltip placement="top" theme="light"
                                             max-width={700}>
                                        <div class="condition">
                                            {params.row[params.column.key]}
                                        </div>
                                        <div slot="content">
                                            <div class="condition">
                                                {params.row[params.column.key]}
                                            </div>
                                        </div>
                                    </Tooltip>)
                            } else {
                                return (
                                    <div>-</div>
                                );
                            }
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width: 100,
                        render: (h, params) => {
                            if (params.row.status == '1') {
                                return (
                                    <kdx-status-text type="success">已启用</kdx-status-text>
                                );
                            } else if (params.row.status == '0') {
                                return (
                                    <kdx-status-text type="disabled">已禁用</kdx-status-text>
                                );
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 120,
                        render: (h, params) => {
                            let component;
                            if (params.row.is_default != '1') {
                                if (params.row.status === '0') {
                                    component = (
                                        <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                            this.setStatus({row: params.row, status: 1});
                                        }}>启用</Button>
                                    );
                                } else {
                                    component = (
                                        <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                            this.setStatus({row: params.row, status: 0});
                                        }}>禁用</Button>
                                    );
                                }
                            }
                            return (
                                <div class="action">
                                    <Button type="text" disabled={this.noManagePerm} onClick={() => {this.$router.push({path:'/commission/grade/edit',query:{id:params.row.id}})}}
                                        >编辑</Button>
                                    {
                                        component
                                    }
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
                return !this.$getPermMap('commission.level.manage')
            },
            isDisabled() {
                return this.selectRows.length === 0;
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
            // 修改状态 启用/禁用
            setStatus({status, row}) {
                let content = '';
                if (status === 1) {
                    content = '启用该分销等级后将会产生佣金';
                } else if (status === 0) {
                    content = '禁用该分销等级后将不产生佣金';
                }
                this.$Modal.confirm({
                    title: '提示',
                    content,
                    onOk: () => {
                        this.$api.commissionApi.setAgentGradeStatus({id: row.id, status: status})
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('分销商等级状态修改成功');
                                    this.initFooterData();
                                    this.$emit('on-refresh');
                                }
                            });
                    }
                })
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
            // 下方的按钮初始化
            initFooterData() {
                this.isSelectAll = false;
                this.selectRows = [];
            },
            formatRate(data) {
                if (data) {
                    return `${data}%`;
                } else {
                    return '-';
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .good-group-table-list {
        .hint-alert-component {
            padding-bottom: 10px;
        }
        /deep/ .ivu-table {
            td {
                .condition {
                    height: 40px;
                    overflow: hidden;
                    @include font-multiple-omit(2);
                }
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
