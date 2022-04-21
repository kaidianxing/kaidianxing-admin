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
    <div class="goods-preview">
        <div class="goods-preview-content">
             <div class="search">
                <Input
                    v-model="search.keywords"
                    search
                    enter-button="搜索"
                    placeholder="请输入"
                    @on-search="handleSearch"
                    @on-enter="handleSearch"
                    class="width-250"
                />
                <!--<span class="label">商品组：</span>-->
                <!--<Select v-model="search.group" class="width-160" @on-change="handleSearch">-->
                <!--<Option v-for="item in goodsGroup" :key="item.id" :value="item.id">{{item.name}}</Option>-->
                <!--</Select>-->
            </div>
            <Table
                ref="table"
                :columns="columns"
                :data="table.data"
                v-loading="table.loading"
            ></Table>
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
            default: () => {}
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: {
                keywords: '',
                group: ''
            },
            goodsGroup: [],
            columns: [
                {
                    title: '商品',
                    key: 'shop',
                    minWidth: 450,
                    render: (h, params) => {
                        let getType;
                        switch (params.row.type) {
                            case '0':
                                getType = {
                                    goodsText : '实'
                                }
                                break;

                            case '1':
                                getType = {
                                    goodsText : '虚'
                                }
                                break;

                            case '2':
                                getType = {
                                    goodsText: '密'
                                }
                                break;

                            case '3':
                                getType = {
                                    goodsText: '预'
                                }
                                break;
                        }
                        return h(
                            'div',
                            {
                                class: {
                                    'shop-box': true
                                }
                            },
                            [
                                // image
                                h(
                                    'div',
                                    {
                                        class: {
                                            image: true
                                        }
                                    },
                                    [
                                        h('img', {
                                            attrs: {
                                                src: this.$media(
                                                    params.row.thumb
                                                )
                                            },
                                            on: {
                                                error: e => {
                                                    this.replaceImage(e)
                                                }
                                            }
                                        })
                                    ]
                                ),
                                // 商品标题
                                h(
                                    'div',
                                    {
                                        class: {
                                            content: true
                                        }
                                    },
                                    [
                                        h(
                                            'div',
                                            {
                                                class: {
                                                    'content-text': true
                                                }
                                            },
                                            [
                                                // 多规格标志
                                                h(
                                                    'span',
                                                    {
                                                        class: {
                                                            mark: true
                                                        },
                                                        style: {
                                                            display:
                                                                params.row
                                                                    .has_option ===
                                                                '1'
                                                                    ? 'inline-block'
                                                                    : 'none'
                                                        }
                                                    },
                                                    '多'
                                                ),
                                                // 实体、虚拟商品标志
                                                h(
                                                    'span',
                                                    {
                                                        class: {
                                                            mark: true,
                                                            real: params.row.type === '0',
                                                            virtual: params.row.type === '1',
                                                            secret: params.row.type === '2',
                                                        }
                                                    },
                                                    getType.goodsText
                                                ),
                                                h(
                                                    'span',
                                                    {
                                                        class: {
                                                            text: true
                                                        }
                                                    },
                                                    params.row.title
                                                )
                                            ]
                                        )
                                    ]
                                )
                            ]
                        )
                    }
                },
                {
                    title: '价格',
                    key: 'price',
                    minWidth: 80,
                    render: (h, params) => {
                        return h(
                            'div',
                            {
                                class: {
                                    price: true
                                }
                            },
                            [h('span', `￥${params.row[params.column.key]}`)]
                        )
                    }
                },
                {
                    title: '库存',
                    key: 'stock',
                    width: 80,
                    render: (h, params) => {
                        let data = parseInt(params.row[params.column.key])
                        if (data || data === 0) {
                            if (data <= 999) {
                                return h('div', data)
                            } else {
                                return h('div', '999+')
                            }
                        } else {
                            return h('div', '-')
                        }
                    }
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
            try{
                document.querySelectorAll('.noAnimate .ivu-tabs-content')[0].scrollTop =0
            }catch(err){
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
                this.$emit('on-change', {url: this.table.data[index]?.url, name: this.table.data[index]?.title});
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
                    status: 5
                },
                this.search
            )
            this.$api.goodsApi
                .goodsList(params)
                .then(res => {
                    this.table.loading = false
                    if (res.error === 0) {
                        // 手机端商品详情链接
                        res.list?.length && res.list.forEach(item => {
                            item.url = `/kdxGoods/detail/index?goods_id=${item.id}`;
                        })
                        this.table.data = res.list
                        this.table.total = res.total
                        this.defaultChecked()
                    }
                })
                .catch()
        },
        // 获取商品组
        goodGroupList() {
            this.$api.goodsApi.goodGroupList({ pager: 0 }).then(res => {
                if (res.error === 0) {
                    this.goodsGroup = res.list
                } else {
                    this.$Message.error('商品组获取失败')
                }
            })
        },
        resetSearch() {
            this.search = {
                keywords: '',
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
    >.goods-preview-content {
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
            td {
                .shop-box {
                    display: flex;
                    flex-wrap: nowrap;
                    .image {
                        width: 60px;
                        height: 60px;
                        margin-right: 10px;
                        border-radius: 2px;
                        border: 1px solid $border-color;
                        box-sizing: border-box;
                        > img {
                            width: 100%;
                            height: 100%;
                            border-radius: 2px;
                        }
                    }
                    .content {
                        width: 100%;
                        flex: 1;
                        .content-text {
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            height: 50px;
                            padding: 10px 0;
                            .mark {
                                @include font-12-16;
                                color: #ed4014;
                                background-color: #ffefe6;
                                border-radius: 2px;
                                margin-right: 4px;
                                width: 18px;
                                height: 18px;
                                text-align: center;
                                line-height: 18px;
                                display: inline-block;
                                &:nth-last-child(2) {
                                    margin-right: 6px;
                                }
                                &.real {
                                    background-color: #F0FAFF;
                                    color: $brand-color;
                                }
                                &.virtual {
                                    background-color: #E6FFF9;
                                    color: #00C5C5;
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
                    }
                }
                .price {
                    color: $text-first;
                    @include font-14-20-bold;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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
