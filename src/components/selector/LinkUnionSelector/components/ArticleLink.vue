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
    <div class="article-link">
        <div class="article-link-content">
             <div class="search">
                <Input
                    v-model="search.title"
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
                <template #title="{ row }">
                    <div class="title">{{ row.title }}</div>
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
    name: 'ArticleLink',
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
                title: '',
            },
            columns: [
                {
                    title: '文章标题',
                    slot: 'title',
                    minWidth: 300,
                },
                {
                    title: '分组',
                    key: 'group_name',
                    minWidth: 150,
                },
                {
                    title: '发布时间',
                    key: 'create_time',
                    minWidth: 200,
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
                document.querySelectorAll('.article-link .article-link-content')[0].scrollTop =0
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
        // 获取文章列表
        getList() {
            this.table.loading = true;
            let params = {
                ...this.search,
                pagesize: this.page.pageSize,
                page: this.page.pageNumber,
            };
            this.$api.articleApi.getArticleList(params).then((res) => {
                if (res.error === 0) {
                    res.list.forEach((item) => {
                        item.url = `/pagesArticle/detail/index?id=${item.id}`
                    })
                    this.table.data = res.list
                    this.table.total = res.total
                    this.defaultChecked()
                }
            }).finally(() => {
                this.table.loading = false;
            })
        },
        resetSearch() {
            this.search = {
                title: ""
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
.article-link {
    height: 580px;
    position: relative;
    overflow-y: scroll;
    >.article-link-content {
        padding: 20px;
        overflow-y: auto;
        height: 520px;
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
        .title {
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 2;  
            -webkit-box-orient: vertical;
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
                                &.appoint {
                                    background-color: #E2E7FF;
                                    color: #4B66E3;
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
        position: absolute;
        width: 820px;
        height: 50px;
        z-index: 100;
        left: 0;
        bottom: 0;
        background-color: #ffffff;
        padding: 10px 0;
        display: flex;
        justify-content: center;
        border-top: 1px solid $border-color;
    }
}
@media only (max-width: 1550px) {
    .article-link {
        > .article-link-content {
            /*max-height: calc(100vh - 110px - 80px - 45px - 75px - 60px);*/
        }
    }
}
</style>
