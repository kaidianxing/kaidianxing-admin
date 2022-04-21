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
    <div class="order-evaluate">
        <search-header ref="search" @on-change="handleSearch" ></search-header>
        <div class="content" v-loading="table.loading">
            <evaluate-list ref="table" :data="table.data" :total="table.total"  @on-page-change="changePage" @on-refresh="refreshTable"></evaluate-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import SearchHeader from "./components/SearchHeader";
    import EvaluateList from "./components/EvaluateList";

    export default {
        name: "index",
        components: {SearchHeader, EvaluateList},
        inject:['returnToTop'],
        data() {
            return {
                search: {},
                table: {
                    data: [],
                    total: 0,
                    loading: false
                },
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
            };
        },
        methods: {
            handleSearch(search) {
                this.search = search;
                this.refreshTable();
            },
            refreshTable(page) {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1,
                    ...page
                };
                this.getList();
                this.$refs['table']?.reset(this.page);
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            getList() {
                this.returnToTop();
                this.$history.setData({
                    search:this.search,
                    page:this.page
                })
                this.table.loading = true;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                }, this.search);

                this.$api.orderApi.getCommentList(params)
                    .then(res => {
                        this.table.loading = false;
                        if (res.error === 0) {
                            this.table.data = res.list || [];
                            this.table.total = res.total || 0;
                        }
                    });
            },
        },
        mounted() {
            this.$history.setRoute(this.$route).getData(history=>{
                this.search=history.search||{}
                this.page=this.$utils.deepCopy(history.page)||{
                    pageSize: 10,
                    pageNumber: 1
                }
                this.$nextTick(()=>{
                    this.$refs.search.resetModel(this.search)
                    this.refreshTable(this.page);
                })
            })
        }
    };
</script>

<style scoped lang="scss">
    .order-evaluate {
        background-color: $background-color;
        margin: 20px auto;
        .content {
            background-color: #ffffff;
            padding: 0 20px;
            position: relative;
        }
    }
</style>
