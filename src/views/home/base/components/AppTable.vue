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
    <div class="app-table">
        <Table :columns="columns" :data="appList" border></Table>
        <Button class="brand" @click="addWxapp">+添加小程序</Button>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            appList: [],
            columns: [
                {
                    title: "序号",
                    type: "index",
                    width: 60,
                    align: "center",
                },
                {
                    title: "小程序名称",
                    key: "name",
                    render: (h, params) => {
                        return h(
                            "div",
                            {
                                class: {
                                    "edit-table-input": true,
                                },
                            },
                            [
                                h("Input", {
                                    props: {
                                        value: params.row[params.column.key],
                                        placeholder: "请输入小程序名称",
                                        maxlength: 10,
                                    },
                                    style: {
                                        width: "100%",
                                    },
                                    on: {
                                        // 'on-change': val => {
                                        //     params.row[params.column.key] = val;
                                        // },
                                        input: (val) => {
                                            params.row[params.column.key] = val;
                                            this.setTableInput(
                                                params.index,
                                                params.column.key,
                                                val
                                            );
                                        },
                                    },
                                }),
                            ]
                        );
                    },
                },
                {
                    title: "参数值",
                    renderHeader: () => {
                        return (
                            <div class="required-content">
                                <span>小程序AppID</span>
                                <kdx-hint-tooltip
                                    maxWidth="700"
                                    width="640px"
                                    type="image"
                                    image={require("@/assets/image/example/wxapp_link.png")}
                                ></kdx-hint-tooltip>
                            </div>
                        );
                    },
                    key: "appid",
                    render: (h, params) => {
                        return h("div", [
                            h("Input", {
                                props: {
                                    // type: 'textarea',
                                    value: params.row[params.column.key],
                                    placeholder: "请输入AppID",
                                    maxlength: 200,
                                },
                                style: {
                                    width: "100%",
                                },
                                on: {
                                    input: (val) => {
                                        params.row[params.column.key] = val;
                                        this.setTableInput(
                                            params.index,
                                            params.column.key,
                                            val
                                        );
                                    },
                                },
                            }),
                        ]);
                    },
                },
                {
                    title: "添加时间",
                    key: "created_at",
                },
                {
                    title: "操作",
                    key: "action",
                    align: "center",
                    width: 80,
                    render: (h, params) => {
                        return h("div", [
                            h(
                                "Button",
                                {
                                    props: {
                                        type: "text",
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index);
                                        },
                                    },
                                },
                                "删除"
                            ),
                        ]);
                    },
                },
            ],
        };
    },
    watch: {
        list: {
            handler(val) {
                this.appList = [...val];
            },
            immediate: true,
        },
    },
    methods: {
        addWxapp() {
            this.appList.push({ appid: "", name: "" });
        },
        // table中表格中数据变化时设置
        setTableInput(index, key, value) {
            this.appList[index][key] = value;
            this.appList = [...this.appList];
        },
        remove(index) {
            this.$Modal.confirm({
                title: "提示",
                content: "确认删除?",
                onOk: () => {
                    this.appList.splice(index, 1);
                },
                onCancel: () => {},
            });
        },
        validate() {
            if (this.appList.some((v) => !v.appid || !v.name)) {
                return false;
            }
            return this.appList;
        },
    },
};
</script>

<style lang="scss" scoped>
.app-table {
    max-width: 938px;

    .brand {
        border-top: 0;
        display: block;
        width: 100%;
        line-height: 52px;
        height: 52px;
        padding: 0;
    }
}
/deep/ .ivu-table {
    th,
    td {
        border-right: none;
        border-color: $border-color;
        height: 52px;
    }
    .ivu-table-header {
        thead tr th {
            background-color: $background-color;
        }
        .ivu-table-cell {
            padding: 16px 0;
        }
    }

    .tooltip-icon {
        display: flex;
        align-items: center;
        font-weight: normal;
        color: #636669;
    }
    .ivu-table-body {
        .ivu-table-cell {
            padding: 10px 10px 10px 0;
            .edit-table-input {
                padding-right: 10px;
            }
        }
    }
}
</style>
