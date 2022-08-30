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
    <div class="goods-preview">
        <div class="goods-preview-content">
            <div class="search">
                <Input
                        v-model="search.keyword"
                        search
                        enter-button="搜索"
                        placeholder="请输入"
                        @on-search="handleSearch"
                        @on-enter="handleSearch"
                        class="width-250"
                />
            </div>
            <Table
                    ref="table"
                    :columns="columns"
                    :data="table.data"
                    v-loading="table.loading"
            >
                <template slot-scope="{ row }" slot="goods">
                    <div class="goods">
                        <div class="image">
                            <img :src="getThumb(row)" alt=""/>
                        </div>
                        <div class="content">
                            <template v-if="row.goods_type != null">
                                    <span
                                            class="mark more"
                                            v-if="1 === +row.has_option"
                                    >多</span
                                    >
                                <span
                                        class="mark real"
                                        v-if="0 === +row.goods_type"
                                >实</span
                                >
                                <span
                                        class="mark virtual"
                                        v-else-if="1 === +row.goods_type"
                                >虚</span
                                >
                                <span class="mark card" v-else-if="2 === +row.goods_type">密</span>
                            </template>
                            <span class="mark coupon" v-else>券</span>
                            {{ row.title || row.coupon_name }}
                        </div>
                    </div>
                </template>
            </Table>
        </div>
        <div class="footer-page" v-show='table.total>10'>
            <kdx-page-component
                    ref="page"
                    :total="table.total"
                    @on-change="handlePageChange"
            ></kdx-page-component>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GoodsLink',
    props: {
        current: {
            type: [String, Object],
            default: () => {
            }
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: {
                keyword: '',
                group: ''
            },
            goodsGroup: [],
            columns: [
                {
                    title: '商品',
                    key: 'shop',
                    minWidth: 390,
                    slot: "goods",
                },
                {
                    title: "积分价",
                    slot: 'credit_price',
                    minWidth: 230,
                    render: (h, {row}) => {
                        // 多规格
                        let {credit_shop_credit, credit_shop_price, has_option} = row
                        if (has_option == '1') {
                            let min_credit = row.rules?.min?.credit_shop_credit
                            let min_price = row.rules?.min?.credit_shop_price
                            let max_credit = row.rules?.max?.credit_shop_credit
                            let max_price = row.rules?.max?.credit_shop_price

                            return (
                                    <div class="price">
                                        <span class="credit">{min_credit}积分</span>+
                                        <span class="credit_price">{min_price}元</span>
                                        <span>~</span>
                                        <span class="credit">{max_credit}积分</span>+
                                        <span class="">{max_price}元</span>
                                    </div>
                            )
                        } else {
                            return (
                                    <div class="price">
                                        <span class="credit">{credit_shop_credit}积分</span>+
                                        <span class="">{credit_shop_price}元</span>
                                    </div>
                            )
                        }
                    }
                },
                {
                    title: "库存",
                    key: "credit_shop_stock",
                    width: 60,
                    render: (h, params) => {
                        let data = parseInt(params.row[params.column.key]);
                        if (params.row.type == "3") {
                            return h("div", "-");
                        } else {
                            if (data || data === 0) {
                                if (data <= 999) {
                                    return h("div", data);
                                } else {
                                    return h("div", "999+");
                                }
                            } else {
                                return h("div", "-");
                            }
                        }
                    },
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 100,
                    render: (h, params) => {
                        return h(
                                'div',
                                {
                                    class: {
                                        action: true
                                    }
                                },
                                [
                                    h(
                                            'Button',
                                            {
                                                props: {
                                                    type: 'default'
                                                },
                                                style: {
                                                    display: params.row.checked
                                                            ? 'none'
                                                            : 'block'
                                                },
                                                on: {
                                                    click: () => {
                                                        this.setChecked(
                                                                params.index,
                                                                true
                                                        )
                                                    }
                                                }
                                            },
                                            '选择'
                                    ),
                                    h(
                                            'Button',
                                            {
                                                props: {
                                                    type: 'primary'
                                                },
                                                style: {
                                                    display: params.row.checked
                                                            ? 'block'
                                                            : 'none'
                                                },
                                                on: {
                                                    click: () => {
                                                        this.setChecked(
                                                                params.index,
                                                                false
                                                        )
                                                    }
                                                }
                                            },
                                            '已选'
                                    )
                                ]
                        )
                    }
                }
            ],
            page: {
                pageSize: 10,
                pageNumber: 1
            },
            table: {
                data: [],
                loading: false,
                total: 0
            }
        }
    },
    methods: {
        getThumb(row) {
            if (row.type == '1') {
                let path = row.coupon_sale_type == '2' ? 'discount.png' : 'full-reduction.png'
                return require('@/assets/image/coupons/' + path)
            }
            return this.$utils.media(row.thumb)
        },
        handleSearch() {
            this.resetPage()
            this.getList()
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            }
            this.$refs['page']?.reset()
        },
        // 页码改变
        handlePageChange(page) {
            this.page = page
            this.getList()
            try {
                document.querySelectorAll('.noAnimate .ivu-tabs-content')[0].scrollTop = 0
            } catch (err) {
                console.log(err)
            }
        },
        // 选择、取消选择
        setChecked(index, isChecked) {
            // 单选
            if (isChecked) {
                this.table.data.forEach((item, i) => {
                    this.$set(this.table.data[i], 'checked', false)
                })
                this.$set(this.table.data[index], 'checked', true)
                let obj = {
                    url: this.table.data[index]?.url,
                    name: this.table.data[index].type === '0' ?  this.table.data[index]?.title :  this.table.data[index]?.coupon_name
                }
                this.$emit('on-change', obj);
            } else {
                this.$set(this.table.data[index], 'checked', false)
                this.$emit('on-change', {});
            }
        },
        // 进行默认选中
        defaultChecked() {
            this.table.data?.forEach((item, index) => {
                if (this.current && item.url === this.current.url) {
                    this.$set(this.table.data[index], 'checked', true)
                } else {
                    this.$set(this.table.data[index], 'checked', false)
                }
            })
        },
        // 商品列表
        getList() {
            this.table.loading = true
            let params = Object.assign(
                    {
                        page: this.page.pageNumber,
                        pagesize: this.page.pageSize,
                        status: "1",
                    },
                    this.search
            )
            this.$api.creditShopApi
                    .getList(params)
                    .then(res => {
                        this.table.loading = false
                        if (res.error === 0) {
                            // 手机端积分商品详情链接
                            res.list?.length && res.list.forEach(item => {
                                item.url = `/kdxCreditShop/detail?id=${item.id}`;
                            })
                            this.table.data = res.list
                            this.table.total = res.total
                            this.defaultChecked()
                        }
                    })
                    .catch()
        },
        resetSearch() {
            this.search = {
                keyword: '',
                group: ''
            }
        }
    },
    created() {
        this.resetSearch()
        this.resetPage()
        this.getList()
    }
}
</script>

<style scoped lang="scss">
.goods-preview {
    > .goods-preview-content {
        /*max-height: calc(100vh - 110px - 160px - 45px - 75px - 45px);*/
        padding: 20px;
        overflow-y: auto;

        > .search {
            display: flex;
            padding-bottom: 20px;

            .label {
                display: inline-block;
                width: 100px;
                padding-top: 6px;
                text-align: right;
                color: $text-first;
                @include font-14-20;
            }
        }

        /deep/ .ivu-table {
            .goods {
                display: flex;
                align-items: center;

                .image {
                    width: 60px;
                    height: 60px;
                    border: 1px solid #e9edef;
                    box-sizing: border-box;
                    border-radius: 2px;
                    overflow: hidden;
                    flex-shrink: 0;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                .content {
                    padding-left: 10px;
                    @include font-14-20;
                    color: $text-first;
                    @include font-multiple-omit(2);

                    .mark {
                        padding: 1px 3px;
                        @include font-12-16;
                        border-radius: 2px;
                        margin-right: 5px;
                    }

                    .real {
                        background-color: $brand-light;
                        color: $brand-color;
                    }

                    .more {
                        background-color: $warning-light;
                        color: $warning-color;
                    }

                    .virtual {
                        color: #00c5c5;
                        background-color: #e6fff9;
                    }

                    .card {
                        color: $danger-color;
                        background-color: $danger-light;
                    }

                    .coupon {
                        color: $warning-color;
                        background-color: $warning-light;
                    }
                }
            }

            .price {
                @include font-14-20-bold;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                .credit {
                    color: $warning-color;
                }

                .credit_price {
                    color: $danger-color;
                }

                .icon {
                    display: none;
                    cursor: pointer;
                }

                &:hover {
                    > .icon {
                        display: inline-block;
                    }
                }
            }
        }
    }

    .footer-page {
        background-color: #ffffff;
        padding: 10px 0;
        display: flex;
        justify-content: center;
        border-top: 1px solid $border-color;
    }
}

@media only (max-width: 1550px) {
    .goods-preview {
        > .goods-preview-content {
            /*max-height: calc(100vh - 110px - 80px - 45px - 75px - 60px);*/
        }
    }
}
</style>
