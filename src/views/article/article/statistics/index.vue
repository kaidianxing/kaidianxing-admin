/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="statistics">
        <div class="statistics-header">
            <kdx-form-title >文章信息</kdx-form-title>
            <div class="artic-info">
                <div class="item item-title"><div class="title">文章名称：</div><div>{{info.title}}</div></div>
                <div class="item">发布时间：{{info.created_at}}</div>
                <div class="item">发布人：{{info.publisher}}</div>
            </div>
        </div>
        <div class="article-overview-box">
            <div class="overview-title">文章数据</div>
            <data-card :tmp-list="overview.tempList" :data="overview.data"></data-card>
        </div>
        <div class="table-content">
            <div class="tab">
                <ul>
                    <li v-for="item in tabList" :key="item.id" :class="{'tab-active': type === item.id}" @click="selectTab(item.id)">
                        <div class="name">{{ item.name }}</div>
                        <div class="line"></div>
                    </li>
                </ul>
            </div>
            <div class="table-list">
                <div v-show="type === '1'" v-loading="tabList[0].loading">
                    <Table :columns="goodsColumns" :data="tableData">
                        <template #price="{ row }">
                            <div>￥{{ row.price }}</div>
                        </template>
                    </Table>
                </div>
                <div v-show="type === '2'" v-loading="tabList[1].loading">
                    <Table :columns="couponColumns" :data="tableData">
                        <template #nickname="{ row }">
                            <div class="vip-message">
                                <div>{{ row.nickname }}</div>
                                <div>{{ row.mobile }}</div>
                            </div>
                        </template>
                        <template #status="{ row }">
                            <div class="use-status">
                                <span v-if="row.status == '0'" class="unused">未使用</span>
                                <span v-if="row.status == '1'" class="be-used">已使用</span>
                                <!-- <span v-if="row.status == '1'" class="be-expired">已过期</span> -->
                            </div>
                        </template>
                    </Table>
                    <div class="footer-page" v-if="total > pageSize">
                        <kdx-page-component
                            :current='page' 
                            :pageSize='pageSize' 
                            ref="page" 
                            :total="total"
                            @on-change="changePage"
                            @on-size="changeSize">
                        </kdx-page-component>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DataCard from "@/components/DataCard";
export default {
    components: {
        DataCard,
    },
    created() {
        this.id = this.$route.query?.id;
        this.getArticleStatistics();
        this.getArticleSellData();
    },
    data() {
        return {
            id: 0,
            info: {
                title: "",
                created_at: "",
                publisher: ""
            },
            overview: {
                tempList: [
                    {
                        key: 'share',
                        image: require('@/assets/image/article/share.png'),
                        title: '分享数',
                    },
                    {
                        key: 'visit',
                        image: require('@/assets/image/article/visit.png'),
                        title: '访问数',
                    },
                    {
                        key: 'proportion',
                        image: require('@/assets/image/article/proportion.png'),
                        title: '点赞数',
                    }
                ],
                data: {}
            },
            type: '1',
            tabList: [
                {
                    id: '1',
                    name: '商品',
                    loading: false,
                },
                {
                    id: '2',
                    name: '优惠券',
                    loading: false,
                },
            ],
            goodsColumns: [
                {
                    title: "商品名称",
                    key: "title",
                },
                {
                    title: "引导成交人数",
                    key: "member_count",
                },
                {
                    title: "引导成交金额",
                    key: "money",
                    renderHeader: () => {
                        return (
                            <div>
                                <span>引导成交金额</span>
                                <kdx-hint-tooltip
                                        maxWidth={700}
                                        width="640px"
                                        type="form"
                                        style="font-weight: normal">
                                    此金额不包含在购物车同时下单的其他商品金额
                                </kdx-hint-tooltip>
                            </div>
                        )
                    }
                },
            ],
            pageSize: 10,
            page: 1,
            total: 0,
            couponColumns: [
                {
                    title: "用户名称",
                    slot: "nickname",
                },
                {
                    title: "优惠券名称",
                    key: "coupon_title",
                },
                {
                    title: "使用状态",
                    slot: "status",
                },
                {
                    title: "领取时间",
                    key: "created_at",
                },
            ],
            tableData: [],
        };
    },
    methods: {
        getArticleStatistics() {
            this.$api.articleApi.getArticleStatistics({
                id: this.id
            }).then((res) => {
                if(res.error === 0) {
                    this.info = {
                        title: res.data.title,
                        created_at: res.data.created_at,
                        publisher: res.data.publisher
                    }
                    this.overview.data = {
                        share: res.data.share_number,
                        visit: res.data.read_number,
                        proportion: res.data.thumps_up_number,
                    }
                }
            })
        },
        getArticleSellData() {
            let params = {
                id: this.id,
                type: this.type
            }
            if(this.type === "2") {
                params.page = this.page;
                params.page_size = this.pageSize;
            }
            this.$api.articleApi.getArticleSellData(params).then((res) => {
                if(res.error === 0) {
                    this.tableData = res.list;
                    this.total = res.total;
                }
            })
        },
        selectTab(type) {
            this.type = type;
            this.getArticleSellData();
            if(type === "2" && this.$refs['page']) {
                this.$nextTick(() => {
                    this.resetPage();
                })
            }
        },
        changePage(page) {
            this.page = page;
            this.getArticleSellData();
        },
        changeSize(size) {
            this.page = 1;
            this.pageSize = size;
            this.getArticleList();
        },
        resetPage() {
            this.$refs['page'].reset();
        },
    },
};
</script>
<style lang='scss' scoped>
.statistics {
    display: flex;
    flex-direction: column;
    padding-top: 20px;
    padding-bottom: 20px;
}
.statistics-header {
    padding: 40px 40px 60px 40px;
    background-color: #ffffff;
    border-radius: 2px;
    margin-bottom: 10px;
    .artic-info {
        padding: 0 40px;
        display: flex;
        justify-content: space-between;
        .item {
            flex: 1;
            margin-right: 20px;
            &.item-title {
                display: flex;
                flex-wrap: nowrap;
                .title {
                    white-space: nowrap;
                }
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
.article-overview-box {
    padding: 30px 40px;
    border-radius: 2px;
    background-color: #ffffff;
    margin-bottom: 10px;
    .overview-title {
        margin-bottom: 10px;
        @include font-16-22-bold;
        color: $text-first;
    }
    /deep/.data-card > ul > li {
        width: 34%;
    }
}
.table-content {
    // min-height: calc(100% - 445px);
    flex: 1;
    border-radius: 2px;
    background-color: #ffffff;
    .tab {
        > ul {
            display: flex;
            align-items: center;
            padding-left: 30px;
            margin-bottom: 20px;
            border-bottom: 1px solid $border-color;
            > li {
                position: relative;
                padding: 12px 15px;
                @include font-18-25-bold;
                color: $text-first;
                cursor: pointer;
                &.tab-active {
                    color: $brand-color;
                    .line {
                        display: block;
                    }
                }
                .line {
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background-color: #2d8cf0;
                    display: none;
                }
            }
        }
    }
    .table-list {
        padding: 0 40px 20px 40px;
        .use-status {
            // 未使用
            .unused {
                color: $danger-color;
            }
            // 已使用
            .be-used {
                color: $success-color;
            }
            // 已过期
            .be-expired {
                color: $text-zhushi;
            }
        }
    }
}

/deep/ .ivu-table {
    .ivu-table-header tr th {
        background-color: #F4F6F8;
    }
}

/deep/ .footer-page {
    padding-bottom: 0;
}
</style>