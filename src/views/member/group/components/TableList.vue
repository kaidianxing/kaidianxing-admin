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
        <Table ref="table" :columns="columns" :data="data" @on-selection-change="selectChange"></Table>
        <div class="footer-action" v-if="data.length>0">
            <Checkbox v-model="isSelectAll" :disabled="noManagePerm" @on-change="checkboxChange"></Checkbox>
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
                    type: "selection",
                    width: 40,
                    align: "center"
                },
                {
                    title: "标签组名称",
                    key: "group_name"
                },
                {
                    title: "标签组描述",
                    key: "description",
                    render: (h, params) => {
                        return (
                            <div>
                                {params.row.description
                                    ? params.row.description
                                    : "-"}
                            </div>
                        );
                    }
                },
                {
                    title: "会员数",
                    key: "member_count"
                },
                {
                    title: "操作",
                    key: "action",
                    width: 200,
                    render: (h, params) => {
                        return (
                            <div class="action">
                                <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.lookVipStatistics(params.row);
                                    }}
                                >会员统计</Button>
                                <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.handleEdit(params.row);
                                    }}
                                >编辑</Button>
                                <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.handleDelete(params.row.id);
                                    }}
                                >删除</Button>
                            </div>
                        );
                    }
                }
            ],
            selectRows: [], // 选中项
            isSelectAll: false
        };
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("member.group.manage");
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
            this.$refs["table"].selectAll(status);
        },
        // 重置页码
        reset(page) {
            this.$refs["page"]?.reset(page);
        },
        changePage(page) {
            this.$emit("on-page-change", page);
            this.initFooterData();
        },
        // 初始化下方的checkbox
        initFooterData() {
            this.isSelectAll = false;
            this.selectRows = [];
        },
        handleEdit(row) {
            this.$emit("on-edit", row);
        },
        // 删除
        handleDelete(id) {
            this.$Modal.confirm({
                title: "提示",
                content: "确认彻底删除此标签组？",
                onOk: () => {
                    this.$api.memberApi.deleteGroup({ id: id }).then(res => {
                        if (res.error == 0) {
                            this.$Message.success("删除成功");
                            this.$emit("getList");
                        }
                    });
                },
                onCancel: () => {}
            });
        },
        // 批量删除
        handleBatchDelete() {
            this.$Modal.confirm({
                title: "提示",
                content: "确认批量删除？",
                onOk: () => {
                    let ids = this.selectRows.map(item => item.id);
                    this.$api.memberApi.deleteGroup({ id: ids }).then(res => {
                        if (res.error == 0) {
                            this.$Message.success("删除成功");
                            this.$emit("getList");
                        }
                    });
                },
                onCancel: () => {}
            });
        },
        // 会员统计
        lookVipStatistics(row) {
            this.$router.push({
                path: "/member/list",
                query: {
                    group_id: row.id
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
    }
}
</style>
