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
    <div class="custom-form-list">
        <search-header ref="search" @on-change="handleSearch" @on-add="handleAdd"></search-header>
        <div class="content" v-loading="table.loading">
            <table-list ref="table" :data="table.data" :total="table.total" @on-page-change="changePage" @on-refresh="refreshTable" @on-preview="handlePreview"
                        @on-update-data="handleUpdateData"></table-list>
        </div>
        <preview-modal ref="preview_modal" :data="preview.data" :type="preview.type"></preview-modal>
        <slot></slot>
    </div>
</template>

<script>
    import SearchHeader from "./components/SearchHeader";
    import TableList from "./components/TableList";
    import PreviewModal from '../../components/PreviewModal/index';

    export default {
        name: "index",
        components: {SearchHeader, TableList, PreviewModal},
        inject:['returnToTop'],
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
                },
                preview: {
                    type: '',
                    data: []
                }
            };
        },
        methods: {
            handleSearch(search) {
                this.search = search;
                this.refreshTable();
                this.value = true;
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.getList();
                this.$refs['table']?.reset();
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            getList() {
                this.returnToTop();
                this.table.loading = true;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                }, this.search);
                this.$api.formApi.getSystemFormList(params)
                    .then(res => {
                        this.table.loading = false;
                        if (res.error === 0) {
                            this.table.data = res.data.list || [];
                            this.table.total = res.data.total || 0;
                        }
                    });
            },
            handleAdd() {
                this.$router.push({
                    path: '/systemForm/add'
                })
            },
            handlePreview(res) {
                this.preview.type = res.type;
                this.preview.data = res.data;
                this.$nextTick(() => {
                    this.$refs['preview_modal'].setValue();
                })
            },
            // 数据更新，更新表单收集的数据
            handleUpdateData(row) {
                this.table.loading = true;
                this.$api.formApi.updateSystemFormData({id: row.id}).then(res => {
                    if (res.error === 0) {
                        this.getList();
                        this.$refs['table'].initFooterData();
                    }
                })
            }
        },
        mounted() {
            this.refreshTable();
        }
    };
</script>

<style scoped lang="scss">
    .custom-form-list {
        background-color: $background-color;
        margin: 20px auto;
        .content {
            background-color: #ffffff;
            padding: 0 20px;
            position: relative;
        }
    }
</style>
