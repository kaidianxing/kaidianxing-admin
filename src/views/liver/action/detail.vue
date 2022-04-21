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
    <div class="action-detail">
        <!-- 直播间信息 -->
        <liver-info :info="roomInfo"></liver-info>
        <!-- 直播间收益概览 -->
        <detail-income :info="incomeInfo"></detail-income>
        <!-- 商品列表 -->
        <detail-table
            :data="table.data"
            :loading="table.loading"
            :total="table.total"
            @on-change-page="changePage"
            @on-refresh="refreshTable"
            @on-sort="handleSort"
            ref="table_list"
        ></detail-table>
        <slot></slot>
    </div>
</template>

<script>
import LiverInfo from './components/LiverInfo'
import DetailIncome from './components/detail/DetailIncome.vue'
import DetailTable from './components/detail/DetailTable'
export default {
    components: {
        LiverInfo,
        DetailTable,
        DetailIncome
    },
    data() {
        return {
            room_id: '',
            roomInfo: {},
            incomeInfo: {},
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            sort: {

            },
            table: {
                total: 10,
                data: [],
                loading: false
            }
        }
    },
    mounted() {
        this.room_id = this.$route.query.id
        this.getList()
        this.getDetail()
    },
    methods: {
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
                .liverDetailGoods(params)
                .then((res) => {
                    if (res.error === 0) {
                        this.table.data = res.list
                        this.table.total = res.total
                        this.table.loading = false
                    }
                })
                .catch()
        },
        getDetail() {
            this.$api.liverApi.getLiverDetail({
                room_id: this.room_id
            }).then(res => {
                if (res.error === 0) {
                    this.roomInfo = res.room


                    // 处理数据格式
                    let keys = ['order_member_count', 'order_pay_price', 'order_pay_count']
                    keys.forEach(key => {
                        res.statistic[key] = this.$utils.formatNumberData(res.statistic[key])
                    })

                    res.statistic.order_pay_price = '¥' +  res.statistic.order_pay_price


                   let pay_percent = res.statistic.pay_percent

                    if (pay_percent == undefined) {
                        pay_percent = 0
                    }

                    res.statistic.pay_percent = parseFloat(pay_percent) + '%';

                    this.incomeInfo = res.statistic
                }
            })
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
        handleSort(sort) {
            this.sort = sort
            this.refreshTable()
        },
    }
}
</script>

<style lang="scss" scoped>
.action-detail {
    margin-top: 20px;
}
</style>