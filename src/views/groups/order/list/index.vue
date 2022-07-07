<template>
    <div class="spell-group-order-list">
        <search-header @on-search="handleSearch"></search-header>
        <div class="table-list" v-loading="loading">
            <div class="table-list-content" v-if="list.length > 0">
                <list-item v-for="item in list" :key="item.id" :data="item" @on-click="clickItem"></list-item>
            </div>
            <div class="table-no-list" v-if="list.length === 0">
                暂无数据
            </div>
            <div class="footer-page" v-show="list.length > 0">
                <kdx-page-component ref="page" :total="total" :showSizer="false" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from './components/SearchHeader'
import ListItem from "./components/ListItem";

export default {
    name: "index",
    components: {
        SearchHeader,
        ListItem
    },
    data() {
        return {
            search: {},
            page: {
                pageSize: 12,
                pageNumber: 1,
            },
            total: 20,
            list: [],
            loading: false,
        };
    },
    created() {
      this.getList();
    },
    mounted() {
      this.$refs['page'].reset(this.page);
    },
    methods: {

        handleSearch(search) {
            this.search = search;
            this.initPage();
        },
        getList() {
            this.loading = true;
            let params = Object.assign({pagesize: this.page.pageSize, page: this.page.pageNumber}, this.search);
            this.$api.groupsApi.getGroupsOrderList(params).then(res => {
                if (res.error === 0) {
                    this.list = res.list;
                    this.total = res.total;
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        changePage(page) {
            this.page = page;
            this.getList();
        },
        initPage() {
            this.page = {
                pageSize: 12,
                pageNumber: 1
            }
            this.$refs['page']?.reset(this.page);
            this.getList();
        },
        clickItem(id) {
            this.$router.push({
                path: '/groups/order/detail',
                query: {
                    id
                }
            })
        }
    }
};
</script>

<style lang="scss" scoped>
.spell-group-order-list {
    position: relative;
    margin: 20px auto;
    .table-list {
        position: relative;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 2px;
        .table-list-content {
            display: flex;
            flex-wrap: wrap;
            margin-right: -20px;
        }
    }
    .table-no-list {
        height: 100px;
        text-align: center;
        line-height: 100px;
    }
    .order-list-item-box {
        width: 25%;
    }
}
@media  screen and (max-width: 1920px) {
    .spell-group-order-list {
        .order-list-item-box {
            width: 33.3%;
        }
    }
}
@media  screen and (max-width: 1500px) {
    .spell-group-order-list {
        .order-list-item-box {
            width: 50%;
        }
    }
}
</style>
