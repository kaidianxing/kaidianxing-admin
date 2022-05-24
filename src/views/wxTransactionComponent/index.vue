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
        <search-header  @on-search="handleSearch" @on-action="handleAction"></search-header>
        <table-list ref="table" :data="tableData" :page-size="page.pageSize" :current="page.pageNumber"
                    :total="total" :loading="loading"  @on-page-change="changePage"
                    @on-refresh="handleRefresh" @on-detail="handleDetail"></table-list>
        <add-goods ref="add_goods" @on-refresh="handleRefresh"></add-goods>
        <hint-modal ref="hint_modal" @on-add-goods="handleAction('add')"></hint-modal>
        <goods-detail ref="goods_detail" :id="goods.id"></goods-detail>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from './components/SearchHeader';
import TableList from './components/TableList';
import AddGoods from './components/AddGoods';
import HintModal from "./components/HintModal";
import GoodsDetail from "./components/GoodsDetail";

export default {
    name: "index",
    components: {
        SearchHeader,
        TableList,
        AddGoods,
        HintModal,
        GoodsDetail
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
            goods: {
                id: ''
            }
        };
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
            this.$api.wxTransactionComponentApi.getList(params).then(res => {
                if (res.error === 0) {
                    this.tableData = res.data.list;
                    this.total = res.data.total;
                    if (!res.data.list?.length) {
                        let hintModel = localStorage.getItem('transactionComponent');
                        if (!hintModel) {
                            this.$nextTick(() => {
                                this.$refs['hint_modal'].setValue();
                            });
                        }
                    }
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
            switch (type) {
                case 'explain':
                    this.$refs['hint_modal'].setValue();
                    break;
                case 'add':
                    this.$refs['add_goods'].setValue();
                    break;
                case 'refresh':
                    this.syncRefresh();
                    break;
            }
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            };
            this.$refs['table']?.reset();
        },
        // 同步商品，按照页码进行
        syncRefresh(page = 1) {
            this.loading = true;
            this.$api.wxTransactionComponentApi.syncRefresh({
                page
            }).then(res => {
                if (res.error === 0) {
                    let {total_num = 10} = res.data;
                    if (total_num > page * 10) {
                        // pageSize += 1;
                        this.syncRefresh(page + 1)
                    } else {
                        this.loading = false;
                        this.handleRefresh();
                    }
                }
            })
        },
        handleDetail(id) {
            console.log('edit')
            this.goods.id = id;
            this.$nextTick(() => {
                this.$refs['goods_detail'].setValue();
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
