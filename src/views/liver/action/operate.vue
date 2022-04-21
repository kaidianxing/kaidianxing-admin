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
    <div class="operate">
        <!-- 直播间信息 -->
        <liver-info :info="roomInfo"></liver-info>
        <!-- 运营操作 -->
        <operate-handler
            @on-open="openSelector"
            :total="table.total"
            @on-search="handleSearch"
            @on-reset="resetSearch"
        > </operate-handler>
        <!-- 商品列表 -->
        <opreate-goods
            :data="goodsList"
            ref="goods_list"
            :loading="table.loading"
            :total="table.total"
            @on-change-page="changePage"
            @on-refresh="refreshTable"
            @on-sort="handleSort"
        ></opreate-goods>
        <goods-selector
            isStore
            @on-change="goodsChange"
            @on-cancel="cancelHandler"
            :current-list="selectGoods"
            v-model="showModal"
            multiple
        ></goods-selector>
        <slot></slot>

        <!-- 商品货架 -->
        <!-- <goods-modal title="用微信扫码预览商品货架" :imgurl="codeImg" v-model="showGoods"></goods-modal> -->
    </div>
</template>

<script>
import LiverInfo from './components/LiverInfo'
import OperateHandler from './components/operate/OperateHandler'
import OpreateGoods from './components//operate/OperateGoods.vue'
import GoodsSelector from '@/components/selector/GoodsSelector'
// import GoodsModal from '../manage/components/modal/GoodsModal'

export default {
    components: {
        LiverInfo,
        OperateHandler,
        OpreateGoods,
        GoodsSelector,
        // GoodsModal
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
            room_id: '',
            roomInfo: {},
            goodsList: [],
            showModal: false,
            selectGoods: [],
            codeImg: '',
            showGoods: false,
            checkGoodsId: {

            }
        }
    },
    mounted() {
        this.room_id = this.$route.query.id
        this.getList()
    },
    methods: {
        openSelector() {
            this.showModal = true
        },
        cancelHandler() {
            this.showModal = false
        },
        goodsChange(e) {
            let surplusNum = 200 - this.table.total;
            let num = e.length <= surplusNum ? e.length : surplusNum;
            let selectGoods = [];

            //  过滤已添加到库中的商品
            for (let i = 0; i < num; i++) {
                if (!this.checkGoodsId[e[i].broadcast_goods_id]) {
                    selectGoods.push({
                        goods_id: e[i].goods_id,
                        broadcast_goods_id: e[i].broadcast_goods_id
                    })
                }
            }

            if (selectGoods.length) {
                this.importGoods(selectGoods)
            }
        },
        importGoods(selectGoods) {
            let params = {
                room_id: this.room_id,
                broadcast_room_id: this.roomInfo.broadcast_room_id,
                goods: selectGoods
            }
            this.$api.liverApi.addLiverGoods(params).then(res => {
                if (res.error === 0) {
                    this.reset()
                    this.showModal = false
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
            this.$nextTick(() => {
                this.$refs['goods_list']?.reset()
                this.resetSearch()
            })
        },
        getList() {
            this.table.loading = true
            let params = {
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                ...this.search,
                ...this.sort,
                room_id: this.room_id
            }
            this.$api.liverApi
                .getLiverGoods(params)
                .then((res) => {
                    if (res.error === 0) {
                        this.checkGoodsId = {}
                        res.list.forEach(v => {
                            this.checkGoodsId[v.broadcast_goods_id] = true
                        })
                        this.roomInfo = res.room
                        this.goodsList = res.list
                        this.selectGoods = res.list
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
        }
    }

}
</script>

<style lang="scss" scoped>
.operate {
    margin-top: 20px;
    height: 200px;
}
</style>