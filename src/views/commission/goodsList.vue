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
    <div class="good-list">
        <search-header
            ref="search_header"
            @on-search="handleSearch"
            @on-reset="resetSearch"
        ></search-header>
        <div class="table-list">
            <table-list
                ref="table_list"
                :loading="table.loading"
                :data="table.data"
                :total="table.total"
                @on-page-change="changePage"
                @on-refresh="refreshTable"
                @on-sort="handleSort"
            ></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from './goodsList/SearchHeader'
import TableList from './goodsList/TableList'
export default {
    name: 'index',
    inject:['returnToTop'],
    components: {
        SearchHeader,
        TableList,
    },
    data() {
        return {
            params: {},
            page: {},
            search: {},
            table: {
                data: [],
                total: 0,
                loading: false,
            },
            sort: {},
        }
    },
    created() {
        // 添加状态
        this.reset()
    },
    methods: {
        handleSearch(value) {
            this.search = {
                ...value,
                category_id: value.category_id === 'all' ? '' : value.category_id,
                status: value.status === 'all' ? '' : value.status,
                group_id: value.group_id === 'all' ? '' : value.group_id
            }
            this.refreshTable()
        },
        handleSort(sort) {
            this.sort = sort
            this.refreshTable()
        },
        reset() {
            this.$nextTick(() => {
                this.$refs['search_header']?.reset()
                this.$refs['table_list']?.reset()
                this.resetSearch()
            })
        },
        getList() {
            this.returnToTop();
            this.table.loading = true
            let params = {
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                ...this.search,
                ...this.sort,
            }
            this.$api.commissionApi
                .goodsList(params)
                .then((res) => {
                    if (res.error === 0) {
                        this.table.data = res.list
                        this.table.total = res.total
                        this.table.loading = false
                    }
                })
                .catch()
        },
        resetSearch() {
            this.search = {}
            this.refreshTable()
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            }
            this.$refs['table_list']?.reset()
            this.getList()
        },
        changePage(page) {
            this.page = page
            this.getList()
        },
    },
}
</script>

<style scoped lang="scss">
.good-list {
    background-color: $background-color;
    margin: 20px auto;
    .table-list {
        background-color: #ffffff;
        padding: 0 20px;
        border-radius: 2px;
    }
}
</style>
