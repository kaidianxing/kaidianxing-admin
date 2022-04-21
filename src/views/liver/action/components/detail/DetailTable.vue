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
        v-loading="loading"
        class="detail-table"
    >
        <Table
            ref="table"
            :columns="columns"
            :data="data"
            @on-sort-change="changeSort"
        ></Table>
        <div
            class="footer-page"
            v-show="data.length > 10"
        >
            <kdx-page-component
                ref="page"
                :total="total"
                @on-change="changePage"
            ></kdx-page-component>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => []
        },
        total: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            columns: [{
                title: '商品信息',
                key: 'shop',
                minWidth: 260,
                render: (h, params) => {
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

                            <div class="content-text">
                                <span class="mark" style={{ display: params.row.has_option === '1' ? 'inline-block' : 'none' }}>多</span>
                                <span class={getType.goodsName}>
                                    { getType.goodsText}
                                </span>
                                <span class="text">{params.row.title}</span></div>
                        </div>
                    );
                }
            },
            {
                title: '价格',
                key: 'price',
                render: (h, params) => {
                    return (
                        <div class="price">
                            <span>￥{params.row.price}</span>
                        </div>
                    );
                }
            },

            {
                title: '销量',
                key: 'sales',
                sortable: 'custom ',
            }, {
                title: '付款总人数',
                key: 'member_count',
                sortable: 'custom ',
            }]
        }
    },
    methods: {
        changeSort({ key, order }) {
            if (order === 'normal') {
                this.$emit('on-sort', {});
            } else {
                this.$emit('on-sort', { sort: key, by: order });
            }
        },
        changePage(page) {
            this.$emit('on-change-page', page);
        },
        reset() {
            this.$refs['page'].reset();
        },
    }
}
</script>


<style lang="scss" scoped>
.detail-table {
    margin-top: 10px;
    padding: 0 20px;
    background-color: #fff;
    border-radius: 2px;

    /deep/ .ivu-table-row {
        td {
            border-right: none;
        }
    }
    /deep/ thead {
        border-bottom: 1px solid #e9edef;
    }

    /deep/ .ivu-table {
        min-width: 1200px;

        .content-box {
            display: flex;
            align-items: center;

            .content-text {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                height: 60px;
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
                .text {
                    @include font-14-20;
                }
            }

            .image {
                width: 60px;
                height: 60px;
                margin-right: 10px;
                flex-shrink: 0;
                border: 1px solid $border-color;
                border-radius: 2px;
                overflow: hidden;

                > img {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>