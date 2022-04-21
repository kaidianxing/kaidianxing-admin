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
    <div class="vip-list">
        <search-header :levels="level" @on-search="handleSearch" @on-export="handleExport"
        ></search-header>
        <div class="table-list" v-loading="table.loading">
            <table-list ref="table_list" :data="table.data" :total="table.total"
                       :page="page" @on-change-page="changePage" @on-sort="handleSort"></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import SearchHeader from "./components/SearchHeader";
    import TableList from "./components/TableList";
    // import qs from 'qs';
    import { Export } from '@/helpers/export';
    import {memberApi} from '@/api/member'

    export default {
        name: "index",
        inject:['returnToTop'],
        components: {
            SearchHeader,
            TableList
        },
        data() {
            return {
                table: {
                    data: [],
                    loading: false
                },
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                search: {},
                sort: {},
                level: []
            };
        },
        methods: {
            getList() {
                this.returnToTop();
                this.table.loading = true;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                }, this.search, this.sort);
                this.$api.memberApi.getConsumeList(params)
                    .then(res => {
                        this.table.loading = false;
                        if (res.error === 0) {
                            this.table.data = res.list;
                            this.table.total = res.total;
                        }
                    });
            },
            // 获取会员等级
            getLevelList() {
                this.$api.memberApi.getLevelList({is_all: 1})
                    .then(res => {
                        if (res.error === 0) {
                            this.level = [{id: 'all', level_name: '全部'}, ...res.list] || [];
                        }
                    });
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            handleSort(sort) {
                this.sort = sort
                this.refreshTable()
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.$refs['table_list']?.reset();
                this.getList();
            },
            handleSearch(search) {
                this.search = search;
                this.refreshTable();
            },
            handleExport() {
                let params = Object.assign({export: '1'}, this.search);
                // let data = qs.stringify(params);
                // window.open(`${window.config.base_url}${dataApi.getConsumeList.api}&${data}`);

                Export(memberApi.getConsumeList.api, params);
            }
        },
        mounted() {
            this.getList();
            this.getLevelList();
        }
    };
</script>

<style scoped lang="scss">
    .vip-list {
        background-color: $background-color;
        margin-top: 20px;
        margin-bottom: 20px;

        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            border-radius: 2px;
            position: relative;
        }
    }
</style>
