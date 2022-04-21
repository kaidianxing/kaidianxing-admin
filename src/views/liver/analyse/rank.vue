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
    <div
        class="rank"
        v-loading="loading"
    >
        <div class="rank-container">
            <Table
                ref="table"
                :columns="columns"
                :data="salelist"
                @on-sort-change="changeSort"
            ></Table>
            <div class="footer-page">
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
export default {
    data() {
        return {
            loading: false,
            total: 10,
            columns: [
                {
                    type: 'index',
                    minWidth: 60,
                    width: 60,
                    title: '序号'
                },
                {
                    title: '商品信息',
                    key: 'shop',
                    minWidth: 260,
                    render: (h, params) => {
                        let label = params.row.label || [];
                        const labelComponent = label.map(item => h('span', {}, item.name));
                        let getType;
                        switch (params.row.type) {
                            case '0':
                                getType = {
                                    goodsName : 'mark real',
                                    goodsText : '实'
                                }
                                break;

                            case '1':
                                getType = {
                                    goodsName : 'mark virtual',
                                    goodsText : '虚'
                                }
                                break;

                            case '2':
                                getType = {
                                    goodsName: 'mark secret',
                                    goodsText: '密'
                                }
                                break;
                        }
                        return (
                            <div class="content-box">
                                {/* image */}
                                <div class="image">
                                    <img src={this.$media(params.row.thumb)} alt="" onError={e => { this.replaceImage(e) }} />
                                </div>
                                {/*商品标题 */}
                                <div class="content">
                                    <div class="content-text">
                                        {/*1多规格0单规格*/}
                                        <span class="mark" style={{ display: params.row.has_option === '1' ? 'inline-block' : 'none' }}>多</span>
                                        <span class={getType.goodsName}>
                                            { getType.goodsText}
                                        </span>
                                        <span class="text">{params.row.title}</span>
                                    </div>
                                    <p class="label">{labelComponent}</p>
                                </div>
                            </div>
                        );
                    }
                },
                {
                    title: '销售房间数',
                    key: 'room_quantity',
                    sortable: 'custom',
                    minWidth: 80,
                    render: (h, params) => {
                        return <div>{params.row.room_quantity || 0}</div>
                    }
                },
                {
                    title: '总浏览量',
                    key: 'pv_count',
                    sortable: 'custom',
                    minWidth: 80,
                    render: (h, params) => {
                        return <div>{params.row.pv_count || 0}</div>
                    }
                },
                {
                    title: '总销量',
                    key: 'sales',
                    sortable: 'custom',
                    minWidth: 80,
                    render: (h, params) => {
                        return <div>{params.row.sales || 0}</div>
                    }
                },
                {
                    title: '销售转化率',
                    key: 'conversion_rate',
                    minWidth: 80,
                    render: (h, params) => {
                        const rate = params.row.conversion_rate !== null ? params.row.conversion_rate + '%' : '-';
                        return <div>{rate}</div>
                    }
                },
            ],
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            salelist: []
        };
    },
    mounted() {
        this.getList()
    },
    methods: {
        getList() {
            this.loading = true
            let params = {
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
                ...this.sort,
            }
            this.$api.liverApi
                .sellSummary(params)
                .then((res) => {
                    if (res.error === 0) {
                        this.salelist = res.list
                        this.total = res.total
                        this.loading = false
                    }
                })
                .catch()
        },
        // 重置页码
        reset() {
            this.$refs['page'].reset();
        },
        changePage(page) {
            this.page = page
            this.getList()
        },
        // 排序
        changeSort({ key, order }) {
            if (order === 'normal') {
                this.sort = {};
            } else {
                this.sort = { sort: key, by: order }
            }
            this.getList()
        }
    }
};
</script>

<style lang="scss" scoped>
.rank {
    position: relative;
    margin-top: 20px;

    &-container {
        padding: 0 20px;
        background-color: #fff;
        border-radius: px2rpx(2);
    }

    /deep/ .ivu-table {
        box-sizing: border-box;
        min-width: 1200px;
        padding-bottom: 40px;
        td {
            .content-box {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                .image {
                    width: 100px;
                    height: 80px;
                    margin-right: 10px;
                    border: 1px solid $border-color;
                    overflow: hidden;
                    border-radius: 2px;
                    box-sizing: border-box;
                    flex-shrink: 0;
                    & > img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .content {
                    width: 100%;
                    .content-text {
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        height: 60px;
                        .text {
                            @include font-14-20;
                        }

                        .mark {
                            @include font-12-16;
                            color: #ed4014;
                            background-color: #ffefe6;
                            border-radius: 2px;
                            margin-right: 4px;
                            width: 18px;
                            height: 18px;
                            display: inline-block;
                            text-align: center;
                            line-height: 18px;
                            &:nth-last-child(2) {
                                margin-right: 6px;
                            }
                            &.real {
                                background-color: #f0faff;
                                color: $brand-color;
                            }
                            &.virtual {
                                background-color: #e6fff9;
                                color: #00c5c5;
                            }
                            &.secret {
                                background-color: #FFCDD0;
                                color: #FF000F;
                            }
                        }
                    }
                }
            }
        }
    }
}
.rank{
    background: #fff;
}
</style>

