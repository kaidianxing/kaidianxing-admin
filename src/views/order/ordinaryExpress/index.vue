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
    <div class="ordinary-express">
        <delivery-type type="ordinaryExpress" />
        <search-header ref="search_header" @on-search="handleSearch"></search-header>
        <div class="table-list" v-loading="table.loading">
            <table-list
                ref="table"
                :data="table.data"
                :total="table.total"
                @on-page-change="changePage"
                @on-refresh="refreshTable"
            ></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from "./components/SearchHeader";
import TableList from "./components/TableList";
import DeliveryType from "../components/DeliveryType";
export default {
    name: "index",
    inject:['returnToTop'],
    components: {
        SearchHeader,
        TableList,
        DeliveryType
    },
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
            }
        };
    },
    methods: {
        handleSearch(search) {
            this.search = search;
            this.refreshTable();
        },
        // 获取list
        getList() {
            this.returnToTop();
            this.table.loading = true;
            let params = Object.assign(
                {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                },
                this.search,
                this.sort
            );
            this.$history.setData({
                page: this.page,
                search: this.search
            })
            this.$api.orderApi.getExpressStyleList(params).then(res => {
                this.table.loading = false;
                if (res.error === 0) {
                    this.table.data = res.list;
                    this.table.total = res.total;
                }
            });
        },
        refreshTable(page) {
            if (!page) {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
            }
            this.$refs["table"]?.reset(page);
            this.getList();
        },
        changePage(page) {
            this.page = page;
            this.getList();
        }
    },
    mounted() {
        this.$history.setRoute(this.$route).getData(history => {
            let {page, search} = history;
            this.search = search || {};
            this.page = page;
            this.refreshTable(page)
            this.$nextTick(() => {
                this.$refs['search_header'].reset(this.search);
            })
        })
    }
};
</script>

<style scoped lang="scss">
.ordinary-express {
    background-color: $background-color;
    margin: 20px auto;
    .table-list {
        background-color: #ffffff;
        padding: 0 20px;
        border-radius: 2px;
    }
}
</style>
