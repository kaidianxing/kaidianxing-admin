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
    <div class="fans-label" v-loading="loading">
        <kdx-hint-alert style="margin: 10px 0"
            >提示：自定义菜单只能有一个菜单生效。</kdx-hint-alert
        >
        <kdx-header-bar type="little">
            <template #header>
                <div class="header-btn">
                    <Button type="primary" :disabled="noManagePerm" @click="to">+新建菜单</Button>
                </div>
            </template>
        </kdx-header-bar>
        <div class="t-wp">
            <Table :columns="columns" :data="data"></Table>

            <kdx-page-component
                style="text-align: center; margin-top: 20px"
                ref="page"
                :total="total"
                :pageSize="page.pagesize"
                @on-change="handlePageChange"
            ></kdx-page-component>
        </div>
    </div>
</template>
<script>
export default {
    created() {
        this.getList();
    },
    data() {
        return {
            page: {
                pagesize: 10,
                page: 1,
            },
            total: 0,
            loading: false,
            columns: [
                {
                    title: "菜单名称",
                    key: "name",
                },
                {
                    title: "显示对象",
                    key: "name",
                    render: () => {
                        return <div>全部粉丝</div>;
                    },
                },
                {
                    title: "是否启用",
                    key: "status",
                    render: (h, params) => {
                        return (
                            <div>
                                {1 == params.row.status ? "已启用" : "已禁用"}
                            </div>
                        );
                    },
                },
                {
                    title: "操作",
                    key: "action",
                    render: (h, params) => {
                        return (
                            <div class="opts">
                                <Button
                                    class="btn"
                                    disabled={ this.noManagePerm }
                                    type="text"
                                    onClick={() =>
                                        this.opt(
                                            params.row.status,
                                            params.row.id
                                        )
                                    }
                                >
                                    {1 == params.row.status ? "禁用" : "启用"}
                                </Button>
                                <Button class="btn" disabled={ this.noManagePerm } type="text" onClick={() => this.edit(params.row.id)}>
                                    编辑
                                </Button>
                                <Button class="btn" disabled={ this.noManagePerm } type="text" onClick={() => this.del(params.row.id)}>
                                    删除
                                </Button>
                            </div>
                        );
                    },
                },
            ],
            data: [],
        };
    },
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap("channel.wechat.manage");
        },
    },
    methods: {
        opt(status, id) {
            let alt = 1 == status ? "禁用" : "启用";

            this.$Modal.confirm({
                title: "提示",
                content: `确认${alt}吗?`,
                onOk: () => {
                    this.$api.homeApi
                        .disableMenu({
                            menu_id: id,
                            status: 1 == status ? "0" : "1",
                        })
                        .then((r) => {
                            if (0 == r.error) {
                                this.resetPage();
                                this.$Message.success(`${alt}成功`);
                            }
                        });
                },
            });
        },
        del(id) {
            this.$Modal.confirm({
                title: "提示",
                content: "确认删除吗?",
                onOk: () => {
                    this.$api.homeApi
                        .deleteMenu({
                            id,
                        })
                        .then((r) => {
                            if (0 == r.error) {
                                this.resetPage();
                                this.$Message.success(`删除成功`);
                            }
                        });
                },
            });
        },
        edit(id) {
            this.$router.push({
                path: "/home/public/lib",
                query: {
                    id,
                },
            });
        },
        resetPage() {
            this.page = {
                pagesize: 10,
                page: 1,
            };
            this.$refs["page"]?.reset();
            this.getList();
        },
        handlePageChange(page) {
            this.page.pagesize = page.pageSize;
            this.page.page = page.pageNumber;

            this.getList();
        },
        getList() {
            this.$api.homeApi
                .customMenuList({
                    ...this.page,
                })
                .then((r) => {
                    this.total = r.total;
                    this.data = r.list;
                });
        },

        to() {
            this.$router.push({
                path: "/home/public/lib",
            });
        },
    },
};
</script>
<style scoped lang="scss">
/deep/.opts {
    display: flex;
    color: $brand-color;
    div {
        margin-right: 10px;
        cursor: pointer;
    }
}
.t-wp {
    background: #fff;
    padding: 0 20px 20px 20px;
}
/deep/.btn {
    margin-right: 20px;
    &:last-child {
        margin-right: 0;
    }
}
</style>
