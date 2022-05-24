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
    <div class="wx-transaction">

        <kdx-header-bar type="little">
            <template #header>
                <div class="header-btn">
                    <Button type="primary" class="marginR-10" :disabled="noManagePerm" @click="handleAction('add')">+新增类目</Button>
                    <Button class="primary-border" :disabled="noManagePerm " @click="handleAction('refresh') ">同步刷新</Button>
                </div>
            </template>
        </kdx-header-bar>
        <table-list ref="table" :data="tableData" :page-size="page.pageSize" :current="page.pageNumber"
                    :total="total" :loading="loading"  @on-page-change="changePage" @on-refresh="handleRefresh"
                    @on-edit="handleEdit"></table-list>
        <add-category ref="add_category" :id="categoryId" @on-refresh="handleRefresh"></add-category>
        <slot></slot>
    </div>
</template>

<script>
import TableList from './components/TableList';
import AddCategory from "./components/AddCategory";

export default {
    name: "index",
    components: {
        TableList,
        AddCategory
    },
    data() {
        return {
            search: {},
            tableData: [],
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            total: 0,
            loading: false,

            categoryId: ''
        };
    },
    computed: {
        noManagePerm(){//无管理权限
            return !this.$getPermMap('wxTransactionComponent.category.manage')
        },
    },
    created() {
        this.handleRefresh();
    },
    methods: {
        handleSearch(search) {
            this.search = search;
            this.handleRefresh();
        },
        changePage(page) {
          this.page = page;
          this.getData();
        },
        getData() {
            this.loading = true;
            let params = {
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                ...this.search
            };
            this.$api.wxTransactionComponentApi.getCategoryList(params).then(res => {
                if (res.error === 0) {
                    this.tableData = res.data.list;
                    this.total = res.data.total;
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        handleRefresh() {
            this.resetPage();
            this.getData();
        },
        handleAction(type) {
            if (!this.noManagePerm) {
                switch (type) {
                    case 'add':
                        this.categoryId = '';
                        this.$refs['add_category'].setValue();
                        break;
                    case 'refresh':
                        this.syncRefresh();
                        break;
                }
            }
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            };
            this.$refs['table']?.reset();
        },
        syncRefresh() {
            this.loading = true;
            let params = {
                page_size: this.page.pageSize,
                page: this.page.pageNumber,
            }
            this.$api.wxTransactionComponentApi.updateCategoryAuditStatus(params).then(res => {
                if (res.error === 0) {
                    this.getData();
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        handleEdit(id) {
            this.categoryId = id;
            this.$nextTick(() => {
                this.$refs['add_category'].setValue();
            })
        }
    }
};
</script>

<style scoped lang="scss">
.wx-transaction {
    margin: 20px auto;
}
</style>
