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
    <div class="shop-system-page" v-loading="loadStatus">
        <search-header @add-page="addPage" @on-change="handleSearch"></search-header>
        <div class="tab-content">
            <page-list
                ref="page_list"
                :data="table.data"
                :total="table.total"
                @on-preview="onPreview"
                @on-refresh="refreshTable"
                @on-page-change="changePage"
                @on-edit="editPage"
                :loading="table.loading"
            ></page-list>
        </div>
        <select-page-type ref="select_page_type" @on-change="changeSelectPage"></select-page-type>
        <select-page-temp
            ref="tempChoose"
            @on-close="tempClose"
            @on-choose="chooseAgain"
            @on-use="useTemp"
            @on-del="delTemp"
        ></select-page-temp>
        <Modal
            title="海报预览"
            v-model="preview"
            class="preview-poster-modal"
            :styles="{width:'700px'}"
            :mask-closable="false"
        >
            <img class="poster-phone" :src="$utils.staticImg('decorate/poster-phone.png')" alt />
            <img class="poster-img" :src="previewUrl" alt />
        </Modal>
        <slot></slot>
    </div>
</template>

<script>
    import SearchHeader from "./components/SearchHeader";
    import PageList from "./components/PageList";
    import SelectPageType from "./components/SelectPageType";
    import SelectPageTemp from "./components/SelectPageTemp";
    export default {
        name: "index",
        inject: ["returnToTop"],
        components: {
            SearchHeader,
            PageList,
            SelectPageType,
            SelectPageTemp
        },
        data() {
            return {
                tab: {
                    name: '0',
                    data: []
                },
                pageList: {
                    data: []
                },
                table: {
                    data: [],
                    loading: false,
                    total: 0
                },
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                goodsId: "",
                tempType: "10",
                loadStatus: false,
                fistLoad: true,
                preview: false,
                previewUrl: "",
                search: {
                    keyword: '',
                    type: ''
                }
            };
        },
        methods: {
            delTemp(item) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定删除该模板吗?',
                    onOk: () => {
                        console.log(item)
                    },
                    onCancel: () => {},
                })
            },
            onPreview(item) {
                this.preview = true;
                this.previewUrl = item.previewUrl;
            },
            editPage(row) {
                let path;
                if (row.type == "10") {
                    path = "/decorate/poster/goodposter";
                } else if (row.type == "20") {
                    path = "/decorate/poster/commissionposter";
                } else if (row.type == "30") {
                    path = "/decorate/poster/followposter";
                }
                this.$router.push({
                    path: path,
                    query: {
                        id: row.id,
                        type: "edit"
                    }
                });
            },
            handleSearch(search) {
                this.search = search;
                this.refreshTable();
            },
            clickTab() {
                this.refreshTable();
            },
            addPage() {
                this.$refs["select_page_type"].setValue();
            },
            changeSelectPage(type) {
                this.tempType = type;
                this.$refs.tempChoose.setValue(type);
            },
            tempChagne() {
                this.$refs.tempChoose.setValue(this.tempType);
            },
            tempClose() {
                this.$refs.tempChoose.setValue(this.tempType);
            },
            useTemp({id}) {
                let path;
                if (this.tempType == "10") {
                    path = "/decorate/poster/goodposter";
                } else if (this.tempType == "20") {
                    path = "/decorate/poster/commissionposter";
                } else if (this.tempType == "30") {
                    path = "/decorate/poster/followposter";
                }
                this.$router.push({
                    path,
                    query: {
                        id,
                        type: "add"
                    }
                });
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.$refs[`page_list`].reset();
                this.getList();
                this.getPageTotal();
            },
            getList() {
                this.returnToTop();
                this.fistLoad && (this.loadStatus = true);
                this.table.loading = true;
                let params = Object.assign({
                        pagesize: this.page.pageSize,
                        page: this.page.pageNumber
                    },
                    this.search
                );
                this.$api.posterApi.posterList(params)
                    .then(res => {
                        this.table.loading = false;
                        if (res.error === 0) {
                            this.table.data = res.data?.list || [];
                            this.table.total = res.data.total;
                        }
                    })
                    .finally(() => {
                        this.fistLoad = false;
                        this.loadStatus = false;
                    });
            },
            getPageTotal() {
                this.fistLoad && (this.loadStatus = true);
                this.$api.posterApi
                    .usingPosterList()
                    .then(res => {
                        if (res.error === 0) {
                            this.pageList.data = res.data.list;
                        }
                    })
                    .finally(() => {
                        this.fistLoad = false;
                        this.loadStatus = false;
                    });
            },
            getRanGoodsId() {
                this.$api.goodsApi.getGoodsRanId().then(res => {
                    if (res.error === 0) {
                        this.goodsId = res.goods_id;
                    }
                });
            },
            chooseAgain() {
                this.$refs.tempChoose.setValue(this.tempType);
                this.$refs["select_page_type"].setValue();
            }
        },
        mounted() {
            this.getList();
            this.getPageTotal();
        },
        beforeMount() {
            this.getRanGoodsId();
        }
    };
</script>

<style scoped lang="scss">
.shop-system-page {
    margin: 20px auto;
    background-color: $background-color;
    > .app-page {
        padding: 40px 40px 60px 40px;
        background-color: #ffffff;
        margin-bottom: 10px;
        border-radius: 2px;
    }
    > .tab-content {
        background-color: #ffffff;
        border-radius: 2px;
        .hint-alert-component {
            padding: 20px 20px 0 20px;
        }
        /deep/ .ivu-tabs-bar {
            margin-bottom: 0;
        }
        /deep/ .ivu-tabs-nav-scroll {
            padding: 0 20px;
            .ivu-tabs-tab {
                padding: 20px 20px 10px 20px;
            }
        }
    }
}
</style>
