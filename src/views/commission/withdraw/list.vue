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
    <div class="with-draw-list">
        <search-header ref="search" @on-search="handleSearch" @on-export="handleExport"
        ></search-header>
        <div class="content">
            <table-list
                ref="table"
                :data="table.data"
                :total="table.total"
                :loading="table.loading"
                @on-page-change="changePage"
                @on-refresh="refreshTable"
                @on-search="handleSearch"
            ></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from './components/list/SearchHeader'
import TableList from './components/list/TableList'
import {Export} from '@/helpers/export'
import {commissionApi} from "@/api/commission"
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
                pageCount: 1
            },
            query: {}
        }
    },
    computed: {
        getApiName() {
            let { status } = this.$route.params
            let apiObj = {
                waiting: 'getWaitCheckList',
                paying: 'getWaitRemitList',
                payed: 'getSuccessList',
                invalid: 'getInvalidList'
            }

            return apiObj[status]
        }
    },
    watch: {
        getApiName() {
            this.refreshTable()
            this.$refs.search?.reset()
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        changePage(page) {
            this.page = page
            this.getList()
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageCount: 1
            }
            this.getList()
        },
        handleSearch(search, type) {
            if (type == 'head') {
                this.query = search
            } else {
                search = { ...this.query, ...search }
            }
            this.search = search

            this.refreshTable()
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
            this.$api.commissionApi[this.getApiName](params).then(res => {
                this.table.loading = false
                if (res.error === 0) {
                    this.table.data = res.list || []
                    this.table.total = res.total
                }
            })
        },
        handleExport() {
            let params = Object.assign({ export: '1' }, this.search)
            let name = this.getApiName
            Export(commissionApi[name].api, params)
        },
    }
}
</script>

<style scoped lang="scss">
.with-draw-list {
    margin: 20px auto;
    .content {
        /*padding-bottom: 20px;*/
    }
}
</style>
