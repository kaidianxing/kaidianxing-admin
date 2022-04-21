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
        <div class="footer-action">
            <Checkbox v-model="isSelectAll" :disabled="noManagePerm"  @on-change="checkboxChange"></Checkbox>
            <!--            <Button :disabled="isDisabled" @click="handleUsing('more')">启用</Button>-->
            <!--            <Button :disabled="isDisabled" @click="handleDisabled('more')">禁用</Button>-->
            <Button :disabled="isDisabled||noManagePerm" @click="handleBatchDelete">删除</Button>
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
                type: [String, Number],
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
                        title: '等级',
                        key: 'level',
                        render: (h, params) => {
                            if (params.row.is_default == '1') {
                                return (
                                    <div>默认</div>
                                );
                            } else {
                                return (
                                    <div>{params.row.level}</div>
                                );
                            }
                        }
                    },
                    {
                        title: '等级名称',
                        key: 'level_name'
                    },
                    {
                        title: '升级条件',
                        key: 'update_text'
                    },
                    {
                        title: '可享折扣权益',
                        key: 'discount',
                        render: (h, params) => {
                            return (
                                <div>{params.row.is_discount == 0 ? '无' : Number(params.row.discount) + '折'}</div>
                            );
                        }
                    },
                    {
                        title: '会员数量',
                        key: 'member_count'
                    },
                    {
                        title: '状态',
                        key: 'state',
                        render: (h, params) => {
                            return (
                                <div>{params.row.state == 1 ? (
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
                        width: 200,
                        render: (h, params) => {
                            if (params.row.is_default == '1') {
                                return (
                                    <div class="action">
                                        <Button type="text" onClick={() => {
                                            this.lookVipStatistics(params.row);
                                        }}>会员统计</Button>
                                        <Button type="text" disabled={this.noManagePerm}  onClick={()=>{this.$router.push({path:`/member/grade/edit`,query:{id:params.row.id}})}}>编辑</Button>
                                    </div>
                                );
                            } else {
                                let status;
                                if (params.row.state == 0) {
                                    status = (
                                        <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                            this.handleUsing(params.row);
                                        }}>启用</Button>
                                    );
                                } else {
                                    status = (
                                        <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                            this.handleUsing(params.row);
                                        }}>禁用</Button>
                                    );
                                }
                                return (
                                    <div class="action">
                                        {status}
                                        <Button type="text" onClick={() => {
                                            this.lookVipStatistics(params.row);
                                        }}>会员统计</Button>
                                        <Button type="text" disabled={this.noManagePerm} onClick={()=>{this.$router.push({path:`/member/grade/edit`,query:{id:params.row.id}})}}>编辑</Button>
                                        <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                            this.handleDelete(params.row.id);
                                        }}>删除</Button>
                                    </div>
                                );
                            }
                        }
                    }
                ],
                selectRows: [], // 选中项
                isSelectAll: false,
            };
        },
        computed: {
            getTableData(){
                return this.data.map(item=>{
                    item._disabled=this.noManagePerm;
                    return item;
                })
            },
            noManagePerm() { //管理权限
                return !this.$getPermMap('member.level.manage')
            },
            isDisabled() {
                return this.selectRows.length === 0;
            }
        },
        methods: {
            reset(page){
                this.$refs.page.reset(page);
            },
            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.data.length;
            },
            checkboxChange(status) {
                this.$refs['table'].selectAll(status);
            },
            // 启用
            handleUsing(data) {
                let state = 0;
                if (data.state == 1) {
                    state = 0;
                } else {
                    state = 1;
                }
                this.$api.memberApi.setLevelState({state: state, id: data.id}).then(res => {
                    if (res.error == 0) {
                        this.$Message.success('修改成功');
                        this.$emit('getList');
                    }
                });
            },
            // 删除
            handleDelete(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除？',
                    onOk: () => {
                        this.$api.memberApi.deleteLevel({id: id}).then(res => {
                            if (res.error == 0) {
                                this.$Message.success('删除成功');
                                this.$emit('getList');
                            }
                        });
                    },
                    onCancel: () => {
                    }
                });
            },
            // 会员统计
            lookVipStatistics(row) {
                this.$router.push({
                    path: '/member/list',
                    query: {
                        level_id: row.id
                    }
                });
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
            // 批量删除
            handleBatchDelete() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认批量删除？',
                    onOk: () => {
                        let ids = this.selectRows.map(item => item.id);
                        this.$api.memberApi.deleteLevel({id: ids}).then(res => {
                            if (res.error == 0) {
                                this.$Message.success('删除成功');
                                this.$emit('getList');
                            }
                        });
                    },
                    onCancel: () => {
                    }
                });
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

            .total {
                float: right;
                @include font-14-20;
                line-height: 35px;
            }
        }
    }
</style>
