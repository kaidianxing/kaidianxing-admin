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
    <div class="manage-list">
        <kdx-hint-alert :show-icon="false">
            <div>提示：</div>
            <div>1. 提交审核/重新提交：支持当前列表中的商品添加并提交审核。调用额度：500次/一天。</div>
            <div>2. 撤回审核：可撤回直播商品的提审申请，消耗的提审次数不返还。调用额度：500次/一天。</div>
            <div>3. 删除商品：删除后直播间上架的该商品也将被同步删除，不可恢复。调用额度：1000次/一天。</div>
        </kdx-hint-alert>
        <search-header
            @on-search="handleSearch"
            @on-reset="resetSearch"
        ></search-header>
        <table-list
            :data="goods"
            ref="goods_list"
            :loading="table.loading"
            :total="table.total"
            @on-page-change="changePage"
            @on-refresh="refreshTable"
            @on-sort="handleSort"
        ></table-list>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from './components/list/SearchHeader'
import TableList from './components/list/TableList'

export default {
    components: {
        SearchHeader,
        TableList
    },
    data() {
        return {
            params: {},
            page: {
                pageSize: 10,
                pageNumber: 1,
            },
            search: {},
            table: {
                total: 0,
                loading: false,
            },
            sort: {},
            goods: []
        }
    },
    methods: {
        handleSearch(value) {
            this.search = {
                ...value,
                category_id: value.category_id === 'all' ? '' : value.category_id,
                group_id: value.group_id === 'all' ? '' : value.group_id,
                goods_type: value.goods_type ==='all'? '': value.goods_type
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
            this.table.loading = true
            let params = {
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                ...this.search,
                ...this.sort,
            }

            let keys = ['bro_goods_status', 'title',
                'category_id',
                'status',
                'group_id',
                'bro_goods_status']

            keys.forEach(v => {
                if (params[v] == 'all' || !params[v]) {
                    delete params[v]
                }
            })

            this.$api.liverApi
                .getGoodsStore(params)
                .then((res) => {
                    if (res.error === 0) {
                        this.goods = res.list
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
    }
}
</script>

<style lang="scss" scoped>
.manage-list {
    margin-top: 20px;

    /deep/ .ivu-alert {
        margin-bottom: 10px;
        line-height: 24px;
    }
}
</style>
