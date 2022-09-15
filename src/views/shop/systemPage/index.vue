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
    <div class="shop-system-page" v-loading="loadStatus">

        <search-header @add-page="addPage" @on-change="handleSearch"></search-header>
        <div class="tab-content">
            <Tabs v-model="tab.name" :animated="false" @on-click="clickTab">
                <TabPane
                    v-for="item in tab.data"
                    :label="`${item.name}(${item.total})`"
                    :name="item.type!=null?item.type.toString():item.type"
                    :key="item.type"
                >
                    <page-list
                        :ref="`page_list_${item.type}`"
                        :data="table.data"
                        :total="table.total"
                        :goods-id="goodsId"
                        @on-refresh="refreshTable"
                        @on-page-change="changePage"
                        @on-edit="editPage"
                        :loading="table.loading"
                        v-show='item.type*1==tab.name*1'
                    ></page-list>
                </TabPane>
            </Tabs>
        </div>
        <select-page-type ref="select_page_type" @on-change="changeSelectPage"></select-page-type>
        <slot></slot>
    </div>
</template>

<script>
import PageList from '../components/PageList'
import SelectPageType from '../components/SelectPageType'
export default {
    name: 'index',
    inject:['returnToTop'],
    components: {
        SearchHeader:()=>import('./components/SearchHeader'),
        PageList,
        SelectPageType,
    },
    data() {
        return {
            tab: {
                name: null,
                data: []
            },
            pageList: {
                data: []
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
            goodsId: '',
            tempType: '10',
            loadStatus: false,
            firstLoadNum: 1,
        }
    },
    methods: {
        editPage(row) {
            let path
            if (row.type == '10') {
                path = '/decorate/index'
            } else if (row.type == '11') {
                path = '/decorate/goods-detail'
            } else if (row.type == '12') {
                path = '/decorate/vip-center'
            } else {
                path = '/decorate/custom'
            }
            this.$router.push({
                path: path,
                query: {
                    id: row.id,
                    type: 'edit'
                }
            })
        },
        handleSearch(search) {
            this.search = search
            this.refreshTable()
        },
        clickTab() {
            this.refreshTable()
        },
        addPage() {
            this.$refs['select_page_type'].setValue()
        },
        changeSelectPage(type) {
            this.tempType = type
            let path
            let id
            if (this.tempType == '11') {
                path = '/decorate/goods-detail'
                id = 2
            } else if (this.tempType == '12') {
                path = '/decorate/vip-center'
                id = 3
            }else if(this.tempType == '10') {
                path = '/decorate/index'
                id = 1
            } else {
                path = '/decorate/custom'
                id = ''
            }
            this.$router.push({
                path,
                query: {
                    id,
                    type: 'add'
                }
            })
        },
        changePage(page) {
            this.page = page
            this.getList()
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            }
            this.$refs[`page_list_${this.tab.name}`][0]?.reset()
            this.getList()
            this.getPageTotal()
        },
        getList() {
            // this.returnToTop();
            this.firstLoadNum === 1 && (this.loadStatus = true)
            this.table.loading = true
            let params = Object.assign(
                {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                },
                this.search
            )

            let apiName = 'getNewPageList'
            if (this.tab.name === '0') {
                apiName = 'getNewCustomList'
            } else {
                params.type = this.tab.name
            }
            this.$api.shopApi[apiName](params).then(res => {
                this.table.loading = false
                if (res.error === 0) {
                    this.table.data = res.list || []
                    this.table.total = res.total
                }
            }).finally(()=>{
                this.setFirstLoad();
            })
        },
        getPageTotal() {
            this.firstLoadNum === 1 && (this.loadStatus = true)
            this.$api.shopApi.getNewPageTotal().then(res => {
                let { error, page_type, used_page } = res
                if (error === 0) {
                    this.tab.data = page_type
                    this.pageList.data = used_page
                }
            }).finally(()=>{
                this.setFirstLoad();
            })
        },
        getRanGoodsId() {
            this.$api.goodsApi.getGoodsRanId().then(res => {
                if (res.error === 0) {
                    this.goodsId = res.goods_id
                }
            })
        },
        setFirstLoad() {
            this.firstLoadNum += 1;
            if (this.firstLoadNum === 3) {
                this.loadStatus = false;
            }
        }
    },
    mounted() {
        this.getList()
        this.getPageTotal()
    },
    beforeMount() {
        this.getRanGoodsId()
    }
}
</script>

<style scoped lang="scss">
.shop-system-page {
    margin: 20px auto;
    background-color: $background-color;
    > .app-page {
        padding: 40px 40px 60px 40px;
        background-color: #ffffff;
        margin-bottom: 10px;
        border-radius: 2px;
    }
    > .tab-content {
        background-color: #ffffff;
        border-radius: 2px;
        .hint-alert-component {
            padding: 20px 20px 0 20px;
        }
        /deep/ .ivu-tabs-bar {
            margin-bottom: 0;
        }
        /deep/ .ivu-tabs-nav-scroll {
            padding: 0 20px;
            .ivu-tabs-tab {
                padding: 20px 20px 10px 20px;
            }
        }
    }
}
</style>
