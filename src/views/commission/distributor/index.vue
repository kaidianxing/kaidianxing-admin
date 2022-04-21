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
    <div class="plugins-commission-distributor">
        <search-header ref="search_header" :grade="grade" @on-change="handleSearch"
                        @on-export="handleExport"></search-header>
        <div class="table-list" v-loading="table.loading">
            <table-list ref="table_list" :data="table.data"
                        :total="table.total" @on-page-change="changePage" @on-refresh="refreshTable"
                        @on-sort="handleSort"></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import SearchHeader from "./components/SearchHeader";
    import TableList from "./components/TableList";
    import {Export} from '@/helpers/export'

    export default {
        name: "index",
        inject:['returnToTop'],
        components: {
            SearchHeader,
            TableList
        },
        data() {
            return {
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                search: {},
                grade: [],
                table: {
                    data: [],
                    total: 0,
                    loading: false
                },
                sort: {}
            };
        },
        methods: {
            handleSearch(search) {
                this.search = search;
                this.refreshTable();
            },
            handleSort(sort) {
                this.sort = sort;
                this.refreshTable();
            },
            getList() {
                this.returnToTop();
                this.table.loading = true;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                }, this.search, this.sort);
                this.$api.commissionApi.getDistributorList(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.table.data = res.list;
                            this.table.total = res.total;
                            this.table.loading = false;
                        }
                    }).catch();
            },
            // 获取分销商等级列表
            getAgentGradeList() {
                this.$api.commissionApi.getAgentGradeAllList()
                    .then(res => {
                        if (res.error === 0) {
                            if (res?.list?.length) {
                                res.list.unshift({
                                    id: 'all',
                                    name: '全部'
                                });
                            } else {
                                res.list = [
                                    {
                                        id: 'all',
                                        name: '全部'
                                    }
                                ];
                            }
                            this.grade = res.list;
                        }
                    })
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.$refs['table_list'].reset();
                this.getList();
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            handleExport() {
                let params = Object.assign({status: this.status, export: '1'}, this.search);
                
                Export("manage/commission/agent", params)
            }
        },
        mounted() {
            this.getAgentGradeList();
            this.getList();
        }
    };
</script>

<style scoped lang="scss">
    .plugins-commission-distributor {
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
