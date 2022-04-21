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
    <div class="good-group">
        <kdx-header-bar type="little">
            <template #header>
                <Button type="primary" to="/goods/group/add" v-perm.disabled="'goods.group.manage'"
                    >+添加商品分组</Button
                >
            </template>
            <Form ref="form" :label-width="100" inline @submit.native.prevent>
                <FormItem label="商品组名称：">
                    <Input
                        type="text"
                        v-model="search.name"
                        placeholder="商品组名称"
                        class="width-340"
                        @on-enter="handleSearch"
                    />
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="table-list" v-loading="table.loading">
            <table-list
                ref='tableList'
                :data="table.data"
                :total="table.total"
                @on-refresh="getList"
                @on-page-change="changePage"
            ></table-list>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import TableList from './components/TableList'

export default {
    name: 'index',
    components: {
        TableList,
    },
    inject:['returnToTop'],
    data() {
        return {
            search: {
                name: '',
            },
            table: {
                data: [],
                loading: false,
                total: 0
            },
            page: {
                pageSize: 10,
                pageNumber: 1
            },
        }
    },
    methods: {
        handleSearch() {
            this.refreshTable()
        },
        handleReset() {
            this.search.name = ''
            this.refreshTable()
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            };
            this.$refs['tableList'].reset();
            this.getList();
        },
        changePage(page) {
            this.page = page;
            this.getList();
        },
        getList() {
            this.returnToTop();
            this.table.loading = true
            let params = Object.assign(
                {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                    pager: 1
                },
                this.search
            )
            this.$history.setData({
                page:this.page,
                search: this.search,
            })
            this.$api.goodsApi
                .goodGroupList(params)
                .then((res) => {
                    this.table.loading = false
                    if (res.error === 0) {
                        this.table.data = res.list
                        this.table.total = res.total;
                    }
                })
                .catch()
        },
    },
    mounted() {
        this.$history.setRoute(this.$route).getData(history=>{
            this.page=this.$utils.deepCopy(history.page)||this.page
            this.search=this.$utils.deepCopy(history.search)||this.search
            this.$refs.tableList.reset(this.page)
            this.getList()
        })
        
    },
}
</script>

<style scoped lang="scss">
.good-group {
    background-color: $background-color;
    margin:20px auto;
    .table-list {
        background-color: #ffffff;
        padding: 0 20px;
        position: relative;
    }
}
</style>
