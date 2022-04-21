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
    <kdx-content-bar>
        <div class="shop-home-template">
            <search-header @on-change="handleSearch"></search-header>
            <div class="shop-home-template-content">
                <div class="shop-home-template-box">
                    <kdx-form-title v-show="type !== 'custom'">{{moduleTitle}}</kdx-form-title>
                    <page-template-list :data="data" :type="type" :loading="loading" :page-now="page.pageNumber" :page-count="pageCount"
                                        @on-using="handleUsing"></page-template-list>
                </div>
                <!--页码-->
                <div class="footer-page" v-show="total > 10">
                    <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
                </div>
            </div>
        </div>
    </kdx-content-bar>
</template>

<script>
    import SearchHeader from "./components/SearchHeader";
    import PageTemplateList from "../components/PageTemplateList";

    export default {
        name: "index",
        components: {
            SearchHeader,
            PageTemplateList
        },
        data() {
            return {
                total: 0,
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                type: '',
                data: [],
                status: '1',
                loading: false,
                pageCount: 1
            };
        },
        computed: {
            moduleTitle() {
                let title;
                switch (this.type) {
                    case 'index':
                        title = '首页模板';
                        break;
                    case 'detail':
                        title = '商品详情模板';
                        break;
                    case 'vip':
                        title = '会员中心模板';
                        break;
                    case 'commission':
                        title = '分销模板';
                        break;
                }
                return title;
            }
        },
        watch: {
            '$route.path': {
                handler() {
                    // type shop 商城装修，using 应用装修，custom: 自定义页面
                    this.type = this.$route.params.type;
                    let status = {
                        index: '1',
                        detail: '2',
                        vip: '3',
                        commission: '4',
                        custom: '5' // 自定义页面
                    };
                    this.status = status[this.type];
                    if (this.type === 'custom') {
                        this.getPageList();
                    } else {
                        // 获取模板列表
                        this.getTemplateList();
                    }
                },
                immediate: true
            }
        },
        methods: {
            handleSearch(search) {
                this.search = search;
                this.refreshTable();
            },
            changePage(page) {
                this.page = page;
                this.loadDataType();
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.$refs['page']?.reset();
                this.loadDataType();
            },
            loadDataType() {
                if (this.type === 'custom') {
                    this.getPageList();
                } else {
                    // 获取模板列表
                    this.getTemplateList();
                }
            },
            getTemplateList() {
                this.loading = true;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                    type: this.status
                }, this.search);
                this.$api.shopApi.getTemplateList(params)
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.data = res.list;
                            this.total = res.total;
                            this.pageCount = res.pageCount;
                        }
                    });
            },
            getPageList() {
                this.loading = true;
                let params = Object.assign({
                    pageSize: this.page.pageSize,
                    pageCount: this.page.pageNumber,
                    type: '5'
                }, this.search);
                this.$api.shopApi.getPageList(params)
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.data = res.list || [];
                            this.total = res.total;
                            this.pageCount = res.pageCount;
                        }
                    });
            },
            handleUsing(row) {
                let path;
                if (this.type == 'index') {
                    path = '/decorate/index';
                } else if (this.type == 'detail') {
                    path = '/decorate/goods-detail';
                } else if (this.type == 'vip') {
                    path = '/decorate/vip-center';
                } else if (this.type === 'custom') {
                    path = '/decorate/custom';
                } else {
                    path = '/decorate/distribution';
                }
                this.$router.push({
                    path: path,
                    query: {
                        id: row.id,
                        type: 'add'
                    }
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .shop-home-template {
        background-color: $background-color;
        margin: 20px auto;
        .shop-home-template-content {
            background-color: #ffffff;
            padding: 40px 20px 40px 40px;
            box-sizing: border-box;
            border-radius: 2px;
            .shop-home-template-box {
                min-height: calc(100vh - 325px);
            }
            > .footer-page {
                padding-top: 20px;
                border-top: 1px solid $border-color;
                text-align: center;
            }
        }
    }
</style>
