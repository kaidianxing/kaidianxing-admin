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
    <div class="market-coupons-all">
        <goods-info ref="goods_info" :data="goods.data" :loading="goods.loading"
                    @on-date-change="changeDate"></goods-info>
        <div class="table-list" v-loading="table.loading">
            <table-list ref="table_list" :data="table.data" :total="table.total"
                        @on-page-change="changePage" @on-refresh="refreshTable" @on-sort="handleSort"
                        @on-table-date-change="changeTableDate"></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import GoodsInfo from "./components/GoodsInfo";
    import TableList from "./components/TableList";
    import {formatDate} from '@/assets/helpers';

    export default {
        name: "index",
        components: {GoodsInfo, TableList},
        data() {
            return {
                goods: {
                    data: {},
                    loading: false,
                    date: formatDate(new Date(new Date() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
                },
                table: {
                    data: [],
                    total: 0,
                    loading: false,
                    date: {
                        start_time: formatDate(new Date(new Date() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
                        end_time: formatDate(new Date(new Date() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
                    }
                },
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                sort: {}
            };
        },
        methods: {
            changeDate(date) {
                this.goods.date = date;
                this.getGoods();
            },
            // 商品排行榜日期
            changeTableDate(date) {
                this.table.date.start_time = date[0];
                this.table.date.end_time = date[1];
                this.refreshTable();
            },
            handleSort(sort) {
                this.sort = sort;
                this.refreshTable();
            },
            // 获取list
            getList() {
                this.table.loading = true;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                }, this.sort, this.table.date);
                this.$api.homeApi.getStatisticsGoodsRank(params)
                    .then(res => {
                        this.table.loading = false;
                        if (res.error === 0) {
                            this.table.data = res.list;
                            this.table.total = res.total;
                        }
                    });
            },
            // 获取商品信息
            getGoods() {
                this.goods.loading = true;
                this.$api.homeApi.getGoodsInfo({goods_date: this.goods.date})
                    .then(res => {
                        this.goods.loading = false;
                        if (res.error === 0) {
                            this.goods.data = res;
                        }
                    });
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.$refs['table_list']?.reset();
                this.getList();
            },
            changePage(page) {
                this.page = page;
                this.getList();
            }
        },
        mounted() {
            this.getGoods();
            this.refreshTable();
        }
    };
</script>

<style scoped lang="scss">
    .market-coupons-all {
        background-color: $background-color;
        margin: 20px auto;
        .table-list {
            background-color: #ffffff;
            border-radius: 2px;
            position: relative;
        }
    }
</style>
