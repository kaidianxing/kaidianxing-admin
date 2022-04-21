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
    <div class="activity-wrap">
        <search-header
            ref="search_header"
            @on-search="handleSearch"
        ></search-header>
        <div class="table-list">
           <table-list ref="table_list" :data="table.data" :total="table.total"  :loading="table.loading" @on-page-change="changePage" @on-refresh="refreshTable" @on-list="getList"></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from './components/SearchHeader'
import TableList from './components/TableList'

export default {
    components: {
        SearchHeader,
        TableList,
    },
    data() {
        return {
            loading: false,
            page: {
                pageSize: 10,
                pageNumber: 1,
            },
            search: {},
            table: {
                data: [],
                total: 0,
                loading: false
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 获取模板列表
        getList() {
            this.table.loading = true
            let params = {
                ...this.search,
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
            }
            this.$api.eOrderApi.getInvoiceList(params).then((res) => {
                this.table.loading = false
                if (res.error === 0) {
                    this.table.data = res.list
                    this.table.total = res.total
                }
            })
        },
        // 搜索
        handleSearch(search) {
            this.search = search
            this.refreshTable()
        },
        changePage(page) {
          this.page = page;
          this.getList();
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            }
            this.$refs['table_list'].reset()
            this.getList()
        },
    },
}
</script>

<style scoped lang="scss">
.activity-wrap {
    background-color: $background-color;
    margin: 20px auto;
    .table-list {
        background-color: #ffffff;
        padding: 0 20px;
        border-radius: 2px;
        position: relative;
    }
}
</style>
