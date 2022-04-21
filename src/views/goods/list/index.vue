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
    <div class="good-list">
        <slot name="header"></slot>
        <search-header ref="search_header" @showAddGoodsModal="showAddGoodsModal" @on-search="handleSearch" @on-reset="resetSearch" @on-export="handleExport"></search-header>
        <div class="table-list" ref="goods_box" v-loading="table.loading">
            <table-list ref="table_list" :current='page.pageNumber' :pageSize='page.pageSize' :status="status" :data="table.data" :total="table.total" @on-page-change="changePage" @on-refresh="refreshTable" @on-list="getList" @on-sort="handleSort"></table-list>
        </div>
        <kdx-modal-frame title="添加商品-选择商品类型" v-model="showModal" :footerHide="true" @on-cancel="showModal = false">
            <div class="modal-frame-content">
                <ul>
                    <li @click="addGoods('0')" class="isHover">
                        <div class="icon iconfont icon-shangpinleixing-shitishangpin-line"></div>
                        <div class="name">实体商品</div>
                        <div class="desc">物流发货</div>
                    </li>
                    <li @click="addGoods('1')" class="isHover">
                        <div class="icon iconfont icon-shangpinleixing-xuniwupin-line"></div>
                        <div class="name">虚拟商品</div>
                        <div class="desc">无需物流</div>
                    </li>
                    <li @click="addGoods('2')" >
                        <div class="icon iconfont icon-xunikami"></div>
                        <div class="name">虚拟卡密</div>
                        <div class="desc">自动发卡 无需物流</div>

                    </li>
                </ul>
            </div>
        </kdx-modal-frame>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from './components/SearchHeader'
import TableList from './components/TableList'
import {Export} from '@/helpers/export'
import {formatDate} from '@/assets/helpers';
// import qs from 'qs'
export default {
    name: 'index',
    components: {
        SearchHeader,
        TableList,
    },
    data() {
        return {
            status: '1',
            params: {},
            page: {},
            search: {},
            table: {
                data: [],
                total: 0,
                loading: false
            },
            sort: {},
            showModal: false,
        }
    },
    watch: {
        '$route.path': {
            handler() {
                let status = {
                    inSale: 1, //出售中,上架
                    soldOut: 2, //售罄
                    inStock: 3, //下架
                    inRecycle: 4, //回收站
                    // inAll: 6, // 不带条件查询所有的内容
                }

                this.status = status[this.$route.params.id]
                if(20 === +this.$store.state?.account?.shop?.shopType){
                    this.status = "";
                }
                this.$history.setRoute(this.$route).getData(history=>{
                    // 添加状态
                    this.page=history?.page||{};
                    this.status=history?.status||this.status;
                    this.search= history?.search||{};
                    this.sort=history?.sort||{};
                    let params = Object.assign({
                        status: this.status,
                    },this.search,this.sort,{
                        pagesize: this.page.pageSize||10,
                        page: this.page.pageNumber||1,
                    });
                    let query = {
                        ...this.$route.query,
                        type: Number(this.$route.query?.type) || 'all'
                    };
                    this.$nextTick(()=>{
                        this.reset({...params,...query})
                    })
                });//页面信息历史记录
            },
            immediate: true
        }
    },
    inject:['returnToTop'],
    methods: {
        // 添加商品
        showAddGoodsModal() {
            this.showModal = true // 显示弹窗
        },

        // 添加商品
        addGoods(type) {
            this.$router.push({
                path: '/goods/add',
                query: {
                    type,
                },
            });
            this.showModal = false // 隐藏弹窗
        },
        handleSearch(value) {
            this.search = value
            this.refreshTable()
        },
        handleSort(sort) {
            this.sort = sort
            this.refreshTable()
        },
        reset(data) {
            this.$nextTick(() => {
                this.$refs['search_header'].reset(data);
                this.$refs['table_list'].reset()
                this.resetSearch(data)
            })
        },
        getList() {
            this.returnToTop();
            this.table.loading = true
            let params = Object.assign({
                    status: this.status
                },
                this.search,
                this.sort,
                {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                }
            )
            if(this.search?.audit_created_at?.length){
                this.search.audit_created_at=this.search.audit_created_at.map(date=>{
                    if(typeof date=='string'){
                        return date
                    }else{
                        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
                    }
                })
            }
            if(this.search?.audit_time?.length){
                this.search.audit_time=this.search.audit_time.map(date=>{
                    if(typeof date=='string'){
                        return date
                    }else{
                        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
                    }
                })
            }
            if(this.search?.created_at?.length){
                this.search.created_at=this.search.created_at.map(date=>{
                    if(typeof date=='string'){
                        return date
                    }else{
                        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
                    }
                })
            }
            this.$history.setData({
                page:this.page,
                status:this.status,
                search:this.search,
                sort:this.sort,
            })
            this.$api.goodsApi
                .goodsList(params)
                .then(res => {
                    this.table.loading = false
                    if (res.error === 0) {
                        this.table.data = res.list
                        this.table.total = res.total
                    }
                })
                .catch()
        },
        resetSearch(data) {
            // this.search = data?.search || {};
            this.search = {...data};
            let page={}
            if(data.pagesize){
                page={
                    pageSize:data.pagesize,
                    pageNumber:data.page
                }
            }
            this.refreshTable(page)
        },
        refreshTable(page) {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
                ...page
            }
            this.$refs['table_list'].reset(this.page)
            this.getList()
        },
        changePage(page) {
            this.page = page
            this.getList()
        },
        handleExport() {
            let params = Object.assign({
                    status: this.status,
                    export: '1'
                },
                this.search
            )
            // let data = qs.stringify(params)
            // window.open(
            //     `${window.config.base_url}/goods/index/list&${data}`
            // )

            Export('manage/goods/index/list', params);
        },
        // 前往续费
        goMoney() {
            this.$router.push({
                path: '/plugins/center/index'
            })
        },
    },

}
</script>

<style scoped lang="scss">
.good-list {
    background-color: $background-color;
    margin: 20px auto;
    .table-list {
        background-color: #ffffff;
        padding: 0 20px;
        border-radius: 2px;
        position: relative;
    }
}
.modal-frame-content {
    padding-top: 90px;
    height: 380px;
    box-sizing: border-box;
    ul {
        display: flex;
        align-items: center;
        justify-content: center;
        li {
            border: 1px solid #E9EDEF;
            border-radius: 2px;
            width: 150px;
            padding-top: 24px;
            padding-bottom: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-right: 20px;
            position: relative;
            &:last-child {
                margin-right: 0;
            }
            .iconfont {
                font-size: 32px;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                color: #939799;
            }
            .name {
                font-weight: bold;
                font-size: 16px;
                line-height: 22px;
                color: #636669;
                margin-top: 14px;
            }
            .desc {
                font-size: 14px;
                line-height: 20px;
                color: #636669;
                margin-top: 6px;
            }
            &.isHover:hover {
                border: 1px solid $brand-color;
                .iconfont {
                    color: $brand-color;
                }
                .name {
                    color: $brand-color;
                }
            }
            &.noHover {
                border: 1px solid #E9EDEF;
                .iconfont,
                .name,
                .desc{
                    color: #B8B9BD;
                }
            }
            .permModel {
                display: none;
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 20px;
                background: #F4F6F8;

                p {
                    font-size: 12px;
                    color: #939799;
                    line-height: 20px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    .iconfont {
                        font-size: 12px;
                        color: #939799;
                        line-height: 20px;
                    }
                    &:hover {
                        color: #2D8CF0;
                        .iconfont:hover{
                            color: #2D8CF0;
                        }
                    }
                }
            }
        }
    }
}
</style>
