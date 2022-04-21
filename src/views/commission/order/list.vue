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
    <div class='order-list'>
        <search-header
            ref="search"
            @on-search="handleSearch"
            :status="status"
            @on-export="handleExport"
        ></search-header>
        <div class="content" style='background:#fff;'>
            <table-list
                ref="table"
                :data="table.data"
                :total="table.total"
                :loading="table.loading"
                :status="status"
                @on-page-change="changePage"
                @on-refresh="refreshTable"
            ></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
// import qs from 'qs'
import {Export} from '@/helpers/export'
import SearchHeader from './components/SearchHeader'
import TableList from './components/TableList'
export default {
    inject:['returnToTop'],
    components: {
        SearchHeader,
        TableList
    },
    data() {
        return {
            table: {
                data: [],
                loading: false,
                total: 0
            },
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            status: ''
        }
    },
    methods: {
        changePage(page) {
            this.page = page
            this.getList()
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            }
            this.$refs['table']?.reset()
            this.getList()
        },
        handleSearch(search) {
            this.search = search
            this.refreshTable()
        },
        handleExport() {
            let params = Object.assign({ export: '1' }, this.search)
            // let data = qs.stringify(params)
            // window.open(
            //     `${window.config.base_url}${this.$api.commissionApi.orderList.api}&${data}`
            // )
            
            Export("manage/commission/order", params)
        },
        getList() {
            this.returnToTop();
            this.table.loading = true
            let params = Object.assign(
                {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                },
                this.search
            )
            this.$api.commissionApi.orderList(params).then(res => {
                this.table.loading = false
                if (res.error === 0) {
                    this.table.data = res.list || []
                    this.table.total = res.total
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .order-list{
        margin: 20px auto;
    }
</style>
