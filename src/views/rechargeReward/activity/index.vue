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
    <div class="activity-wrap">
        <search-header
            ref="search_header"
            @on-search="handleSearch"
        ></search-header>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="type">
                    <div>
                        <kdx-tag-label
                            :type="row.type === '1' ? 'info' : 'warning'"
                        >
                            {{ row.type === '0' ? '累计充值' : '单次充值' }}
                        </kdx-tag-label>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="date">
                    <div class="time">
                        <span>起：</span><span>{{ row.start_time }}</span>
                    </div>
                    <div class="time">
                        <span>止：</span><span>{{ row.end_time }}</span>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="send_count">
                    <Button type="text" @click="jumpLog(row)">
                        {{ row.send_count }}
                    </Button>
                </template>
                <template slot-scope="{ row }" slot="status">
                    <kdx-status-text type="success" v-if="row.status === '1'">
                        进行中
                    </kdx-status-text>
                    <kdx-status-text type="danger" v-if="row.status === '-1'">
                        停止
                    </kdx-status-text>
                    <kdx-status-text type="danger" v-if="row.status === '-2'">
                        手动停止
                    </kdx-status-text>
                    <kdx-status-text type="warning" v-if="row.status === '0'">
                        未开始
                    </kdx-status-text>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <div class="btn-box">
                        <Button type="text" @click="handleView(row.id)">
                            查看
                        </Button>
                        <Button
                            type="text"
                            v-if="row.status !== '-1' && row.status !== '-2'"
                            @click="handleEdit(row.id)"
                        >
                            编辑
                        </Button>
                        <Button
                            type="text"
                            v-if="row.status === '1'"
                            @click="handleStop(row.id)"
                        >
                            停止
                        </Button>
                        <Button type="text" @click="handleDelete(row.id)">
                            删除
                        </Button>
                    </div>
                </template>
            </Table>
            <div class="footer-page" v-show="data.length > 0">
                <kdx-page-component
                    ref="page"
                    :total="total"
                    @on-change="changePage"
                ></kdx-page-component>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import SearchHeader from './components/SearchHeader'
export default {
    components: {
        SearchHeader,
    },
    data() {
        return {
            loading: false,
            page: {
                pageSize: 10,
                pageNumber: 1,
            },
            search: {
                keyword: '',
                status: '',
                type: '',
                start_time: '',
                end_time: '',
            },
            columns: [
                {
                    title: '活动名称',
                    key: 'title',
                },
                {
                    title: '充值类型',
                    slot: 'type',
                },
                {
                    title: '活动时间',
                    slot: 'date',
                },
                {
                    title: '停止时间',
                    key: 'stop_time',
                },
                {
                    title: '充值人数',
                    slot: 'send_count',
                    width: 160,
                },
                {
                    title: '活动状态',
                    slot: 'status',
                    width: 160,
                },
                {
                    title: '操作',
                    slot: 'action',
                },
            ],
            data: [],
            total: 0,
        }
    },
    created() {
        this.getRechargeRewardList()
    },
    methods: {
        // 获取活动列表
        getRechargeRewardList() {
            this.loading = true
            let params = {
                ...this.search,
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
            }
            this.$api.rechargeRewardApi
                .getRechargeRewardList(params)
                .then((res) => {
                    this.loading = false
                    if (res.error === 0) {
                        this.data = res.list
                        this.total = res.total
                    }
                })
        },
        // 搜索
        handleSearch(value) {
            this.search = { ...this.search, ...value }
            this.refreshTable()
        },
        // 切换页码
        changePage(page) {
            this.page = page
            this.getRechargeRewardList()
        },
        // 查看
        jumpLog(data) {
            this.$router.push({
                path: '/rechargeReward/log/index',
                query: {
                    id: data.id,
                    title: data.title,
                },
            })
        },
        handleView(id) {
            this.$router.push({
                path: '/rechargeReward/activity/view',
                query: {
                    id,
                },
            })
        },
        // 编辑
        handleEdit(id) {
            this.$router.push({
                path: '/rechargeReward/activity/edit',
                query: {
                    id,
                },
            })
        },
        // 停止
        handleStop(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确认要停该活动吗？停止后不可重新开启',
                onOk: () => {
                    this.stopRechargeReward(id)
                },
                onCancel: () => {},
            })
        },
        // 停止活动
        stopRechargeReward(id) {
            this.$api.rechargeRewardApi
                .stopRechargeReward({
                    id,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.refreshTable()
                        this.$Message.success('操作成功')
                    }
                })
        },
        // 删除
        handleDelete(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '确定要删除该活动？',
                onOk: () => {
                    this.deleteRechargeReward(id)
                },
                onCancel: () => {},
            })
        },
        // 删除活动
        deleteRechargeReward(id) {
            this.$api.rechargeRewardApi
                .deleteRechargeReward({
                    id,
                })
                .then((res) => {
                    if (res.error === 0) {
                        this.refreshTable()
                        this.$Message.success('删除成功')
                    }
                })
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            }
            this.$refs['page'].reset()
            this.getRechargeRewardList()
        },
    },
}
</script>

<style scoped lang="scss">
.activity-wrap {
    background-color: $background-color;
    margin: 20px auto;
    .table-list {
        background-color: #ffffff;
        padding: 0 20px;
        border-radius: 2px;
        position: relative;
        .time {
            display: flex;
        }
    }
    .btn-box {
        button {
            margin-right: 10px;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
