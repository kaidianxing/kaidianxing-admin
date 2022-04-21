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
    <div class="manage-list">
        <kdx-hint-alert :show-icon="false">
            <div>直播运营操作说明：</div>
            <div>1. 点击同步直播间，可获取小程序直播房间列表信息（获取额度：100000次/一天（与获取回放接口共用次数），请合理分配和获取次数）</div>
            <div>2. 可通过店铺装修组件来DIY自己独特的直播列表页 <span
                    class="link"
                    @click="goDecorate"
                >前往查看</span></div>
        </kdx-hint-alert>
        <search-header
            ref="search_header"
            @on-search="handleSearch"
            @on-reset="resetSearch"
            @on-sync="syncLiver"
        ></search-header>
        <table-list
            :data="livelist"
            ref="table_list"
            :loading="table.loading"
            :total="table.total"
            @on-page-change="changePage"
            @on-refresh="refreshTable"
            @on-sort="handleSort"
            @on-codeImg="handlerCode"
        ></table-list>
        <!-- 同步状态弹窗 -->
        <sync-modal
            v-model="showSyncModal"
            :loading="syncLoading"
            :step="syncStep"
            @on-ok="handleOk"
            @on-refresh="handleRefresh"
        ></sync-modal>
        <!-- 商品货架 -->
        <goods-modal
            :modal-title="getModalInfo.modalTitle"
            :title="getModalInfo.title"
            :subtitle="getModalInfo.subtitle"
            :download="getModalInfo.download"
            :imgurl="codeImg"
            v-model="show"
            @on-cancel="closeModal"
        ></goods-modal>
        <slot></slot>
    </div>
</template>

<script>
import SyncModal from './components/list/SyncModal'
import SearchHeader from './components/list/SearchHeader'
import TableList from './components/list/TableList'
import GoodsModal from './components/modal/GoodsModal'
export default {
    components: {
        SearchHeader,
        TableList,
        SyncModal,
        GoodsModal
    },
    data() {
        return {
            params: {},
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            search: {},
            table: {
                total: 0,
                loading: false,
            },
            sort: {},
            livelist: [],
            syncLoading: false,
            syncStep: 0,
            showSyncModal: false,
            show: false,
            codeImg: '',
            codeType: '0',
            checkLiver: {
                name: '',
                id: ''
            }
        }
    },
    computed: {
        getModalInfo() {
            if (this.codeType == '0') {
                return {
                    modalTitle: '小程序推流入口',
                    title: '主播可通过微信扫以下小程序码或搜一搜“小程序直播”进入主播小程序进行推流',
                    subtitle: '（小程序码7天内有效）',
                }
            } else {
                return {
                    modalTitle: '分享直播间',
                    title: this.checkLiver?.title,
                    subtitle: '分享直播间（小直播间30天内有效）',
                    download: true,
                }
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        handleOk() {
            this.showSyncModal = false
            this.reset()
        },
        handleRefresh() {
            this.syncLiver()
        },
        syncLiver() {
            this.syncLoading = true
            this.showSyncModal = true
            this.syncStep = 0
            this.$api.liverApi.syncLiver().then(res => {
                if (res.error === 0) {
                    this.syncLoading = false
                    this.syncStep = 1
                } else {
                    this.syncLoading = false
                    this.syncStep = -1
                }
            })
        },
        handleSearch(value) {
            this.search = {
                ...value,
                category_id: value.category_id === 'all' ? '' : value.category_id,
                status: value.status === 'all' ? '' : value.status,
                group_id: value.group_id === 'all' ? '' : value.group_id
            }
            this.refreshTable()
        },
        handleSort(sort) {
            this.sort = sort
            this.refreshTable()
        },
        reset() {
                this.$refs['search_header']?.reset()
                this.$refs['table_list']?.reset()
                this.resetSearch()
        },
        getList() {
            this.table.loading = true
            let params = {
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                ...this.search,
                ...this.sort,
            }
            this.$api.liverApi
                .getLiverList(params)
                .then((res) => {
                    if (res.error === 0) {
                        this.livelist = res.list
                        this.table.total = res.total
                        this.table.loading = false
                    }
                })
                .catch()
        },
        resetSearch() {
            this.search = {}
            this.refreshTable()
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            }
            this.$refs['table_list']?.reset()
            this.getList()
        },
        changePage(page) {
            this.page = page
            this.getList()
        },
        goDecorate() {
            this.$utils.openNewWindowPage('/shop/list/system')
        },
        handlerCode({ type, room_id,broadcast_room_id, title }) {
            this.codeType = type;
            this.checkLiver = {
                room_id,
                title
            }
            if (type == '0') {
                this.codeImg = require('@/assets/image/liver/start_code.png')
                this.show = true
            } else {
                this.$api.liverApi.getCodeImg({ room_id,broadcast_room_id }).then(res => {
                    if (res.error == 0) {
                        this.codeImg = res.url
                        this.show = true
                    }
                })
            }
        },
        closeModal() {
            this.show = false
        }
    }
}
</script>

<style lang="scss" scoped>
.manage-list {
    margin-top: 20px;

    /deep/ .ivu-alert {
        margin-bottom: 10px;
        line-height: 24px;
    }
}
.link {
    color: $brand-color;
    cursor: pointer;
}
</style>
