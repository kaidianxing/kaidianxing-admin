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
    <div class="order-list" ref="content">
        <search-header
            ref="search"
            @on-search="handleSearch"
            :status="status"
            @on-export="handleExport"
        ></search-header>
        <div v-loading="!tableShow">
            <div class="content" v-show="tableShow">
                <order-list
                    ref="table"
                    :checkWidth="checkWidth"
                    :current='page.pageNumber'
                    :pageSize='page.pageSize'
                    :data="table.data"
                    :total="table.total"
                    :loading="table.loading"
                    :status="status"
                    @on-page-change="changePage"
                    @on-refresh="getList"
                    @on-edit="editCommision"
                ></order-list>
            </div>
        </div>

        <commission-edit :orderId="id" :orderNo="orderNo" :memberId="member_id" :visible.sync="visible"
                         @on-success="getList"></commission-edit>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from './components/SearchHeader'
import OrderList from './components/OrderList'
import CommissionEdit from '../components/CommissionEdit'
// import qs from 'qs'
import {orderApi} from '@/api/order'
import {Export} from '@/helpers/export'
import {formatDate} from '@/assets/helpers';

export default {
    name: 'index',
    data() {
        return {
            tableShow: false,
            checkWidth: 0,//窗口宽度
            table: {
                data: [],
                loading: false,
                total: 0
            },
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            search: {},
            isExport: '0',
            status: '',
            timeInterval: '',
            id: '',
            member_id: '',
            visible: false,
            orderNo: ''
        }
    },
    inject: ['returnToTop'],
    components: {SearchHeader, OrderList, CommissionEdit},
    watch: {
        '$route.path': {
            handler() {
                if (this.$route.path.indexOf('/order/list/') == 0) {
                    this.status = this.$route.params.id
                    let search = this.$route.query || {}
                    this.$history.setRoute(this.$route).getData(history => {
                        this.page = this.$utils.deepCopy(history.page) || {
                            pageSize: 10,
                            pageNumber: 1
                        }
                        this.search = this.$utils.deepCopy(history.search) || {}
                        let reset = this.$utils.deepCopy(this.search)
                        for (let k in reset) {
                            if (!reset[k]) {
                                delete reset[k]
                            }
                        }
                        setTimeout(() => {
                            this.$nextTick(() => {
                                this.resetSearch({...reset, ...search})
                                this.refreshTable(history.page)
                            })
                        })
                    })
                }

            },
            immediate: true
        }
    },
    methods: {
        handleSearch(search) {
            this.search = search
            this.refreshTable()
        },
        resetSearch(search) {
            this.search = Object.assign({}, search)
            this.$nextTick(() => {
                this.$refs['search'].reset(search)
            })
        },
        changePage(page) {
            this.page = page
            this.getList()
        },
        refreshTable(page) {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
                ...page
            }
            this.getList()
            this.$nextTick(() => {
                this.$refs['table'].reset(page)
            })
        },
        getListName() {
            let name
            switch (this.$route.path) {
                case '/order/list/all':
                    name = 'getAllList'
                    break
                case '/order/list/send':
                    name = 'getSendList'
                    break
                case '/order/list/payment':
                    name = 'getPaymentList'
                    break
                case '/order/list/receive':
                    name = 'getReceiveList'
                    break
                case '/order/list/achieve':
                    name = 'getAchieveList'
                    break
                case '/order/list/close':
                    name = 'getCloseList'
                    break
                case '/order/list/refund':
                    name = 'getRefundList'
                    break
            }
            return name
        },
        getList() {
            this.returnToTop();
            this.table.loading = true
            let checkWidth = 0
            checkWidth = this.$refs["content"]?.offsetWidth - 40 - 1
            if (!checkWidth) {
                setTimeout(() => {
                    this.getList()
                }, 30)
                return
            }
            this.checkWidth = checkWidth
            if (this.search?.time?.length) {
                this.search.time = this.search.time.map(date => {
                    if (typeof date == 'string') {
                        return date
                    } else {
                        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
                    }
                })
            }
            this.$history.setData({
                search: this.$utils.deepCopy(this.search),
                page: this.page
            })
            let params = Object.assign(
                {
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                },
                this.search
            )
            let funName = this.getListName();
            this.$api.orderApi[funName](params).then(res => {
                if (res.error === 0) {
                    this.table.data = res.list || []
                    this.table.total = res.total
                    if (funName === 'getPaymentList' || funName === 'getAllList') {
                        this.countDownPayment()
                    }
                    this.table.loading = false
                    this.tableShow = true
                }
            })
        },
        handleExport() {
            let params = {export: '1', ...this.search}
            // let data = qs.stringify(params)
            let name = this.getListName()
            // window.open(
            //     `${window.config.base_url}${orderApi[name].api}&${data}`
            // )

            Export(orderApi[name].api, params);
        },
        // 待付款倒计时
        countDownPayment() {
            if (this.status === 'payment' || this.status === 'all') {
                this.timeInterval = setInterval(() => {
                    if (this.table.data?.length) {
                        this.table.data = this.table.data.map(item => {
                            // item.auto_close_time =
                            //     item.auto_close_time * 1000 - 1000
                            item.count_down_time = '剩余支付' + countTime(item.auto_close_time)
                            return item
                        })
                    }
                }, 1000)
            }
        },
        editCommision({id, member_id, order_no}) {
            this.orderNo = order_no
            this.id = id
            this.member_id = member_id
            this.visible = true
        }
    },
    beforeDestroy() {
        clearInterval(this.timeInterval)
    },
    mounted() {


    }
}

// 倒计时计算
function countTime(time) {
    time = time * 1000 - new Date().getTime()
    if (time <= 0 && time >= -10) {
        clearInterval(this.timeInterval)
        this.refreshTable()
        return
    }
    let day = parseInt(time / (60 * 60 * 24 * 1000)) || '00',
        hours = parseInt((time / (60 * 60 * 1000)) % 24) || '00',
        minutes = parseInt((time / (60 * 1000)) % 60) || '00',
        seconds = parseInt((time / 1000) % 60) || '00'
    let timeData = `${day}天${hours}小时${minutes}分钟${seconds}秒`
    return timeData
}
</script>

<style scoped lang="scss">
.order-list {
    margin: 20px auto;
    background-color: $background-color;

    .content {
        background-color: #ffffff;
        border-radius: 2px;
        /*margin-bottom: 20px;*/
    }
}
</style>
