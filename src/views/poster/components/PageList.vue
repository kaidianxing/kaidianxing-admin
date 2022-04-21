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
    <div class="shop-page-list">
        <Table :columns="columns" :data="data" v-loading="loading"></Table>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
        </div>
    </div>
</template>

<script>

export default {
    name: "PageList",
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
        },
        goodsId: {
            type: String,
            default: "0"
        }
    },
    data() {
        return {
            columns: [
                {
                    title: "海报名称",
                    key: "name",
                    minWidth: 200,
                    render: (h, params) => {
                        return (
                            <div class="page-title">
                                <span class="title">
                                    {params.row[params.column.key]}
                                </span>
                                <span
                                    class="default"
                                    style={{
                                        display:
                                            params.row.is_default === "1"
                                                ? "inline-block"
                                                : "none"
                                    }}
                                >
                                    默认
                                </span>
                            </div>
                        );
                    }
                },
                {
                    title: "海报类型",
                    key: "type",
                    render: (h, params) => {
                        let iconTemp;
                        if (params.row.type == "10") {
                            iconTemp = (
                                <i class="iconfont icon-shangpinleixing-shitishangpin-line"></i>
                            );
                        } else if (params.row.type == "20") {
                            iconTemp = <i class="iconfont icon-fenxiao3"></i>;
                        } else if (params.row.type == "30") {
                            iconTemp = <i class="iconfont icon-guanzhu"></i>;
                        }

                        if (params.row.type_text) {
                            return (
                                <div
                                    class={`page-type poster${params.row.type}`}
                                >
                                    {iconTemp}
                                    <span class="page-name">
                                        {params.row.type_text}
                                    </span>
                                </div>
                            );
                        } else {
                            return <div>-</div>;
                        }
                    }
                },
                {
                    title: "关键词",
                    key: "keyword"
                },
                {
                    title: "扫码数",
                    key: "scans"
                },
                {
                    title: "关注数",
                    key: "follows"
                },
                {
                    title: "状态",
                    key: "status",
                    render: (h, params) => {
                        if (params.row[params.column.key] == "1") {
                            return <kdx-tag-label type="success">已启用</kdx-tag-label>
                        } else {
                            return (
                                <kdx-tag-label type="disabled">未启用</kdx-tag-label>
                            );
                        }
                    }
                },
                {
                    title: "操作",
                    key: "action",
                    minWidth: 80,
                    render: (h, params) => {
                        return (
                            <div class="action">
                                <Button
                                    type="text"
                                    on-click={() => {
                                        this.operate("check", params);
                                    }}
                                >
                                    查看
                                </Button>
                                <Button
                                    type="text"
                                    on-click={() => {
                                        this.operate("edit", params);
                                    }}
                                >
                                    编辑
                                </Button>
                                <Button
                                    type="text"
                                    on-click={() => {
                                        this.operate("use", params);
                                    }}
                                >
                                    {params.row.status==0?'启用':'禁用'}
                                </Button>
                                <Button
                                    type="text"
                                    on-click={() => {
                                        this.operate("del", params);
                                    }}
                                >
                                    删除
                                </Button>
                            </div>
                        );
                    }
                }
            ]
        };
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("diypage.page.list.manage");
        }
    },
    methods: {
        handlePageChange(page) {
            this.$emit("on-page-change", page);
        },
        editPage(row) {
            this.$emit("on-edit", row);
        },
        operate(type, params) {
            console.log(type, params);
            switch (type) {
                case "check":
                    this.$emit("on-preview", {
                        previewUrl: this.$utils.media(params.row.thumb)
                    });
                    break;
                case "edit":
                    this.$emit("on-edit", params.row);
                    break;
                case "use":
                    this.handleStatusChange(params.row);
                    break;
                case "del":
                    this.handleDelete(params.row);
                    break;
            }
        },
        handleStatusChange(item) {
            let status = item.status;
            let api = null;
            if (status == 0) {
                api = this.$api.posterApi.enablePoster;
            } else {
                api = this.$api.posterApi.forbiddenPoster;
            }
            api({ id: item.id }).then(res=>{
                if(res.error==0){
                    this.$Message.success('操作成功')
                    this.handleRefresh();
                }
            });
        },
        handleDelete(row) {
            this.$Modal.confirm({
                title: "提示",
                content: "确认彻底删除此页面？",
                onOk: () => {
                    this.$api.posterApi
                        .delPoster({ id: row.id })
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success("该海报删除成功");
                                this.handleRefresh();
                            }
                        });
                },
                onCancel: () => {}
            });
        },
        handleRefresh() {
            // 页面刷新
            this.$emit("on-refresh");
            this.reset();
        },
        // 重置页码
        reset() {
            this.$refs["page"].reset();
        },
        getPreviewUrl({ id, status, type }) {
            let params = {};
            if (status == 0) {
                params.previewId = id;
            } else if (type === "0") {
                params.pageId = id;
            }

            return this.$utils.addQueryParams(
                this.$store.state.setting.wap_url,
                params
            );
        }
    }
};
</script>

<style scoped lang="scss">
.shop-page-list {
    background-color: #ffffff;
    padding: 0 20px;
    /deep/ .ivu-table {
        td {
            @include font-14-20;
            word-break: normal;
            // 页面标题
            .page-title {
                > .default {
                    color: $brand-color;
                    background-color: $brand-light;
                    @include font-12-16;
                    padding: 2px 8px;
                    margin-left: 4px;
                }
            }
            // 页面类型
            .page-type {
                display: inline-block;
                border-radius: 2px;
                overflow: hidden;
                font-size: 12px;
                line-height: 22px;
                .iconfont {
                    border-radius: 100%;
                    color: inherit;
                    padding: 4px;
                }
                .iconfont.icon-shouye1 {
                    background-color: $brand-color;
                }
                .iconfont.icon-xiangqing {
                    background-color: $warning-color;
                }
                .iconfont.icon-huiyuanzhongxin1 {
                    background-color: $danger-color;
                }
                .page-name {
                    padding: 0 5px;
                    vertical-align: top;
                }
            }
            .poster10 {
                background: #f0faff;
                color: #197be1;
            }
            .poster20 {
                background: #fff9e6;
                color: #ff9900;
            }
            .poster30 {
                background: #edfff3;
                color: #19be6b;
            }
            // 状态
            .page-status {
                .use {
                    color: $success-color;
                }
            }
            .action {
                margin-right: -8px;
                .ivu-btn-text {
                    margin-right: 8px;
                }
            }
        }
    }
    .footer-page {
        padding: 20px 0;
        display: flex;
        justify-content: center;
    }
}
</style>
