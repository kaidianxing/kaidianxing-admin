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
    <div class="table">
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
        </div>
        <Table ref="table" :columns="columns" :data="table.data" :loading="table.loading">
            <template slot-scope="{ row }" slot="date">
                <div class="time">起：{{ row.start_time }}</div>
                <div class="time">止：{{ row.end_time }}</div>
            </template>
        </Table>
        <div class="footer-page">
            <kdx-page-component
                    ref="page"
                    :total="table.total"
                    limit-default
                    @on-change="handlePageChange"
            ></kdx-page-component>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => [],
        },
        goodsParams: {
            type: Object,
            default: ()=> {}
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            search: {
                keywords: "",
            },
              page: {
                pageSize: 10,
                pageNumber: 1
            },
            selectRows: [],
            selectRow: {},
            table: {
                data: [],
                loading: false,
                total: 0
            }
        };
    },
    computed:{
        columns(){
            let columns = [
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
                            // 多规格
                            if (params.row.has_option === '1') {
                                return (
                                    <div class="price">
                                        <span>￥{params.row.min_price} ~ ￥{params.row.max_price}</span>
                                    </div>
                                );
                            }
                            return (
                                <div class="price">
                                    <span>￥{params.row[params.column.key]}</span>
                                </div>
                            );
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
                            return (
                                <div class="action">
                                    <Button class="default-primary"
                                            style={{ display: params.row.checked ? 'none' : 'block' }}
                                            onClick={() => {
                                                this.setChecked(params.index, true);
                                            }}
                                    >选择</Button>
                                    <Button type="primary"
                                            style={{ display: params.row.checked ? 'block' : 'none' }}
                                            onClick={() => {
                                                this.setChecked(params.index, false);
                                            }}
                                    >已选</Button>
                                </div>
                            );
                        }
                    }
                ];
            return columns
        }
    },
    mounted(){
        if(this.multiple) {
            this.selectRows = this.list
        }
        this.getGoods()
    },
    methods: {
          // 商品列表
        getGoods() {
            this.table.loading = true
            let params = Object.assign(
                {
                    page: this.page.pageNumber,
                    pagesize: this.page.pageSize,
                    status: 5,
                    ...this.goodsParams
                },
                this.search
            );
            this.$api.goodsApi
                .goodsList(params)
                .then(res => {
                    this.table.loading = false
                    if (res.error === 0) {
                        this.table.data = res.list
                        this.table.total = res.total
                        this.defaultChecked()
                    }
                })
                .catch()
        },
        resetPage() {
            this.page = {
                pageSize: 10,
                pageNumber: 1
            }
            this.$refs['page']?.reset()
        },
         handleSearch() {
            this.resetPage()
            this.getGoods()
        },
         // 页码改变
        handlePageChange(page) {
            this.page = page
            this.getGoods()
        },
         // 选择、取消选择
        setChecked(index, isChecked) {
            if (this.multiple) {
                if (this.limit && this.selectRows.length === this.limit && isChecked) {
                    this.$Message.error('已超出最大可选数量');
                    return;
                }
                this.$set(this.table.data[index], 'checked', isChecked)
                if (this.selectRows.length === 0) {
                    this.selectRows.push(this.table.data[index])
                } else {
                    if (isChecked) {
                        this.selectRows.push(this.table.data[index])
                    } else {
                        let selectIndex = -1
                        this.selectRows.forEach((item, newIndex) => {
                            if (item.id === this.table.data[index].id) {
                                selectIndex = newIndex
                            }
                        })
                        this.selectRows.splice(selectIndex, 1)
                    }
                }
            } else {
                // 单选
                if (isChecked) {
                    this.table.data.forEach((item, i) => {
                        this.$set(this.table.data[i], 'checked', false)
                    })
                    this.$set(this.table.data[index], 'checked', true)
                    this.selectRow = this.table.data[index]
                } else {
                    this.$set(this.table.data[index], 'checked', false)
                    this.selectRow = {}
                }
            }
        },
        // 进行默认选中
        defaultChecked() {
            if (this.multiple) {
                this.table.data.forEach((item, index) => {
                    for (let current of this.list) {
                        if (current.id === item.id) {
                            this.$set(this.table.data[index], 'checked', true)
                            break
                        }
                    }
                })
            } else {
                this.table.data?.forEach((item, index) => {
                    if (this.selectRow && item.id === this.selectRow.id) {
                        this.$set(this.table.data[index], 'checked', true)
                    } else {
                        this.$set(this.table.data[index], 'checked', false)
                    }
                })
            }
        },
        handleSave(){
             if (this.multiple) {
                this.$emit('on-change', this.selectRows)
            } else {
                this.$emit('on-change', this.selectRow)
            }
        }
        
    },
};
</script>

<style lang="scss" scoped>
.search {
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
                        display: inline-block;
                        &:nth-last-child(2) {
                            margin-right: 6px;
                        }
                        &.real {
                            background-color: #f0faff;
                            color: #2d8cf0;
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
            }
        }
        .price {
            color: $text-first;
            @include font-14-20-bold;
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

/deep/ .page-component {
    margin-top: 20px;
    text-align: center;
}
.footer-page {
    background-color: #ffffff;
    padding: 10px 0 0;
    display: flex;
    justify-content: center;
    border-top: 1px solid $border-color;
}
</style>
