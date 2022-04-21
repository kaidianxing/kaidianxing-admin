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
    <div class="custom-form-list">
        <search-header ref="search" :type="type" @on-change="handleSearch"></search-header>
        <div class="content" v-loading="table.loading">
            <table-list ref="table" :type="type" :data="table.data" :total="table.total"
                           @on-page-change="changePage" @on-refresh="refreshTable"></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import SearchHeader from "./components/SearchHeader";
    import TableList from "./components/TableList";

    export default {
        name: "index",
        components: {SearchHeader, TableList},
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
                id: 0,
                type: ''
            };
        },
        methods: {
            handleSearch(search) {
                this.search = search;
                this.refreshTable();
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.getList();
                this.$refs['table']?.reset();
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            getList() {
                this.returnToTop();
                this.table.loading = true;
                let typeOption = {
                    order: '1',
                    vip: '3',
                    commission: '2',
                    goods: '4',
                }
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                    id: this.id,
                    type: typeOption[this.type]
                }, this.search);
                this.$api.formApi.getSystemFormDetail(params)
                    .then(res => {
                        this.table.loading = false;
                        if (res.error === 0) {
                            this.table.data = res.data.list || [];
                            this.table.total = res.data.total || 0;
                        }
                    });
            },
        },
        created() {
            this.id = this.$route.query.id || 0;
            this.type = this.$route.params.type || '';
            this.refreshTable();
        }
    };
</script>

<style scoped lang="scss">
    .custom-form-list {
        background-color: $background-color;
        margin: 20px auto;
        .content {
            background-color: #ffffff;
            padding: 0 20px;
            position: relative;
        }
    }
</style>
