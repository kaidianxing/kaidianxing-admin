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
            :keyword="search.keyword"
            @on-search="handleSearch"
        ></search-header>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="nickname">
                    <div class="nickname">
                        <div class="avatar">
                            <img
                                :src="$media(row.avatar)"
                                alt=""
                                @error="replaceImage($event, 'avatar')"
                            />
                        </div>
                        <span class="text">{{ row.nickname }}</span>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="type_text">
                    <div>
                        <kdx-tag-label
                            :type="row.type === '1' ? 'info' : 'warning'"
                        >
                            {{ row.type_text }}
                        </kdx-tag-label>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="client_type">
                    <div class="client-type">
                        <span
                            class="iconfont icon"
                            :class="{
                                'icon-weixin': row.client_type === '20',
                                'icon-weixinxiaochengxu':
                                    row.client_type === '21',
                                'icon-H': row.client_type === '10',
                            }"
                            v-if="
                                new Set(['10', '20', '21']).has(row.client_type)
                            "
                        ></span>
                        <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="row.client_type === '30'"></kdx-svg-icon>
                        <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="row.client_type === '32'"></kdx-svg-icon>
                        <kdx-svg-icon class="iconfont" type="icon-douyin" v-else-if="row.client_type === '31'"></kdx-svg-icon>
                        <span class="text">{{ row.client_type_text }}</span>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="reward">
                    <div class="reward" v-if="row.reward">
                        <div
                            class="reward-coupon mb"
                            v-if="
                                row.reward.coupon_title &&
                                    row.reward.coupon_title.length
                            "
                        >
                            <div
                                class="reward-coupon-item mb"
                                v-for="(item, index) in row.reward.coupon_title"
                                :key="index"
                            >
                                {{ item }}
                            </div>
                        </div>
                        <div class="reward-credit mb" v-if="row.reward.credit">
                            积分：{{ row.reward.credit }}
                        </div>
                        <div
                            class="reward-balance mb"
                            v-if="row.reward.balance"
                        >
                            余额：￥{{ row.reward.balance }}
                        </div>
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
                activity_id: '',
                keyword: '',
                client_type: '',
                type: '',
                start_time: '',
                end_time: '',
            },
            columns: [
                {
                    title: '会员',
                    slot: 'nickname',
                },
                {
                    title: '活动名称',
                    key: 'title',
                },
                {
                    title: '充值类型',
                    slot: 'type_text',
                },
                {
                    title: '充值时间',
                    key: 'created_at',
                },
                {
                    title: '领取渠道',
                    slot: 'client_type',
                },
                {
                    title: '奖励内容',
                    slot: 'reward',
                    minWidth: 120,
                },
                {
                    title: '充值金额',
                    key: 'recharge_money',
                },
            ],
            data: [],
            total: 0,
        }
    },
    created() {
        const { id, title } = this.$route.query
        if (id && title) {
            this.search.activity_id = id
            this.search.keyword = title
        }
        this.getRechargeRewardLog()
    },
    methods: {
        // 获取充值奖励领取记录
        getRechargeRewardLog() {
            this.loading = true
            let params = {
                ...this.search,
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
            }
            this.$api.rechargeRewardApi
                .getRechargeRewardLog(params)
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
            // 清空活动id
            this.search.activity_id = ''
            this.search = { ...this.search, ...value }
            this.refreshTable()
        },
        // 切换页码
        changePage(page) {
            this.page = page
            this.getRechargeRewardLog()
        },
        refreshTable() {
            this.page = {
                pageSize: 10,
                pageNumber: 1,
            }
            this.$refs['page'].reset()
            this.getRechargeRewardLog()
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
        .nickname {
            display: flex;
            align-items: center;
            .avatar {
                padding-right: 10px;
                img {
                    border: 1px solid $border-color;
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                }
            }
        }
        .client-type {
            display: flex;
            align-items: center;
            .icon {
                font-size: 18px;
                margin-right: 10px;
                vertical-align: middle;
            }
            .icon-weixin {
                color: $success-color;
            }
            .icon-weixinxiaochengxu {
                color: #677de0;
            }
            .icon-toutiaoxiaochengxu {
                color: #239bff;
            }
            .icon-zhifubaoxiaochengxu {
                color: #2094e7;
            }
            .icon-baiduxiaochengxu {
                color: #306cff;
            }
            .icon-H {
                color: #ff6004;
            }
        }
        .reward .mb {
            margin-bottom: 4px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>
