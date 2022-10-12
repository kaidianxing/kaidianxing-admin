/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="article-wrap">
        <search-header
            ref="search_header"
            :isPermPlugins="noManagePerm"
            @on-search="handleSearch"
        ></search-header>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="title">
                    <div class="title">
                        <span class="title-top" v-if="row.is_top === '1'">置顶</span>
                        {{ row.title }}
                    </div>
                </template>
                <template slot-scope="{ row }" slot="type">
                    <div class="type-item" v-if="row.type == 1">活动报名</div>
                    <div class="type-item article" v-else>图文视频</div>
                </template>
                <template slot-scope="{ row }" slot="status">
                    <kdx-status-text type="success" v-if="row.status === '1'">
                        显示
                    </kdx-status-text>
                    <kdx-status-text type="danger" v-if="row.status === '0'">
                        隐藏
                    </kdx-status-text>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <div class="btn-box">
                        <Button type="text" :disabled="noViewPerm" @click="goPage('statistics', row.id)">
                            数据
                        </Button>
                        <Button type="text" :disabled="noManagePerm" @click="goPage('edit', row.id)">
                            编辑
                        </Button>
                        <Button type="text" :disabled="noManagePerm" @click="handleExtend(row.id)">
                            推广
                        </Button>
                        <Button type="text" :disabled="noManagePerm" @click="handleHide(row.id, row.status)">
                            {{ row.status === "0" ? "显示" : "隐藏" }}
                        </Button>
                        <Button type="text" :disabled="noManagePerm" @click="handleTopping(row.id, row.is_top)">
                            {{ row.is_top === "1" ? "取消置顶" : "置顶" }}
                        </Button>
                        <Button type="text" :disabled="noManagePerm" @click="handleDelete(row.id)">
                            删除
                        </Button>
                    </div>
                </template>
            </Table>
            <div class="footer-page" v-show="data.length > 0">
                <kdx-page-component
                    ref="page"
                    :total="total"
                    @on-change="changePage"
                    @on-size="changeSize"
                ></kdx-page-component>
            </div>
            <article-extend ref="extend" :id="id"></article-extend>
        </div>
    </div>
</template>

<script>
import SearchHeader from "./components/SearchHeader";
import ArticleExtend from "./components/ArticleExtend";
export default {
    components: {
        SearchHeader,
        ArticleExtend
    },
    data() {
        return {
            loading: false,
            id: 0,
            page: {
                pageSize: 10,
                pageNumber: 1,
            },
            search: {
                title: "",
                status: "",
                group_id: [],
                start_time: "",
                end_time: "",
            },
            columns: [
                {
                    title: "排序",
                    key: "display_order",
                    width: 70
                },
                {
                    title: "文章标题",
                    slot: "title",
                    maxWidth: 400,
                    minWidth: 220
                },
                {
                    title: "阅读数",
                    key: "read_number_real",
                    maxWidth: 200,
                    minWidth: 85
                },
                {
                    title: "点赞数",
                    key: "thumps_up_number_real",
                    maxWidth: 200,
                    minWidth: 85
                },
                {
                    title: "转发数",
                    key: "share_number_real",
                    maxWidth: 200,
                    minWidth: 85
                },
                {
                    title: "分组",
                    key: "group_name",
                    minWidth: 85
                },
                {
                    title: "发布人",
                    key: "publisher",
                    minWidth: 85
                },
                {
                    title: "发布时间",
                    key: "created_at",
                    minWidth: 170
                },
                {
                    title: "状态",
                    slot: "status",
                    maxWidth: 70,
                    minWidth: 60
                },
                {
                    title: "操作",
                    slot: "action",
                    maxWidth: 280,
                    minWidth: 140
                },
            ],
            data: [],
            total: 0,
        };
    },
    created() {
        this.getArticleList();
    },
    computed: {
        noManagePerm() {
            return !this.$getPermMap('article.article.manage');
        },
        noViewPerm() {
            return !this.$getPermMap('article.article.view');
        }
    },
    methods: {
        // 获取文章列表
        getArticleList() {
            this.loading = true;
            let params = {
                ...this.search,
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
            };
            if(!params.group_id.length) {
                delete params.group_id
            }
            this.$api.articleApi.getArticleList(params).then((res) => {
                if (res.error === 0) {
                    this.data = res.list
                    this.total = res.total
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        // 搜索
        handleSearch(value) {
            this.search = { ...this.search, ...value };
            this.refreshTable();
        },
        // 切换页码
        changePage(page) {
            this.page = page;
            this.getArticleList();
        },
        changeSize(size) {
            this.page = 1;
            this.pageSize = size;
            this.getArticleList();
        },
        // 跳转编辑，统计
        goPage(type, id) {
            let path = "/article/article/statistics";
            if(type === "edit") {
                path = "/article/article/edit"
            }
            this.$router.push({
                path,
                query: {
                    id,
                },
            });
        },
        // 隐藏
        handleHide(id, status) {
            let content = "确认显示该篇文章吗？";
            if(status == "1") {
                content = "确认隐藏该篇文章吗？"
            }
            this.$Modal.confirm({
                title: "提示",
                content,
                onOk: () => {
                    this.changeStatus(id, status);
                },
                onCancel: () => {},
            });
        },
        // 改变文章状态
        changeStatus(id, currentStatus) {
            let status = Number(!Number(currentStatus))
            this.$api.articleApi.changeHideArticle({
                id, 
                status
            }).then((res) => {
                if(res.error === 0) {
                    this.getArticleList();
                }
            })
        },
        // 推广
        handleExtend(id) {
            this.id = id;
            this.$nextTick(() => {
                this.$refs.extend.setValue()
            });
        },
        // 置顶
        handleTopping(id, currentIsTop) {
            let is_top = Number(!Number(currentIsTop))
            this.$api.articleApi.changeToppingArticle({
                id,
                is_top,
            })
            .then((res) => {
                if (res.error === 0) {
                    this.refreshTable();
                    this.$Message.success("操作成功");
                }
            });
        },
        // 删除
        handleDelete(id) {
            this.$Modal.confirm({
                title: "提示",
                content: "确认删除该篇文章吗？",
                onOk: () => {
                    this.deleteArticle(id);
                },
                onCancel: () => {},
            });
        },
        // 删除文章
        deleteArticle(id) {
            this.$api.articleApi.deleteArticle({
                id,
            })
            .then((res) => {
                if (res.error === 0) {
                    this.refreshTable();
                    this.$Message.success("操作成功");
                }
            });
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            };
            this.$refs["page"].reset();
            this.getArticleList();
        },
    },
};
</script>
<style lang='scss' scoped>
.article-wrap {
    background-color: $background-color;
    margin: 20px auto;
    min-width: 1131px;
    .table-list {
        background-color: #ffffff;
        padding: 0 20px;
        border-radius: 2px;
        position: relative;
        .title {
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            .title-top {
                display: inline-block;
                padding: 0 7px;
                background: #FFF1F2;
                border: 1px solid #FF1F2C;
                border-radius: 2px;
                box-sizing: border-box;
                color: #FF1F2C;
                line-height: 18px;
                font-size: 12px;
            }
        }
        .time {
            display: flex;
        }
    }
    .type-item {
        width: fit-content;
        white-space: nowrap;
        color: #FF1F2C;
        background: #FFF1F2;
        font-size: 12px;
        line-height: 20px;
        padding: 0 8px;
        &.article {
            color: #197BE1;
            background: #F0FAFF;
        }
    }
    .btn-box {
        button {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>