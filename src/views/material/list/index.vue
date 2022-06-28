<template>
    <div class="activity-wrap">
        <search-header ref="search_header" @on-search="handleSearch"></search-header>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data">
                <template slot-scope="{ row }" slot="goods">
                    <div class="content-box">
                        <div class="image">
                            <img :src="$media(row.goods_thumb)" alt="" @error="replaceImage" />
                        </div>
                        <div class="content">
                            <div class="content-text" style="{display: -webkit-box}">
                                <span class="mark" v-if="row.goods_has_option == 1">多</span>
                                <span :class="getType(row).goodsName">
                                    {{ getType(row).goodsText }}
                                </span>
                                <span class="text">{{row.goods_title}}</span>
                            </div>
                            <p class="label">
                                <span v-for="(item, index) in row.goods_category" :key="index">{{ item.name }}</span>
                            </p>
                        </div>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="description">
                    <div class="text">
                        {{ row.description }}
                    </div>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <div class="btn-box">
                        <Button type="text" :disabled="noManagePerm" @click="handleEdit(row.id)">编辑</Button>
                        <Button type="text" :disabled="noManagePerm" @click="handleDelete(row.id)">删除</Button>
                    </div>
                </template>
            </Table>
            <div class="footer-page" v-show="data.length > 0">
                <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import searchHeader from './components/SearchHeader'
    import { formatDate } from '@/assets/helpers'
    export default {
        name: "list",
        components: {
            searchHeader
        },
        data() {
            return {
                loading: false,
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                },
                search: {
                    description: '',
                    title: '',
                    create_time: [],
                },
                data: [],
                total: 0,
                columns: [
                    {
                        title: '商品信息',
                        slot: 'goods',
                    },
                    {
                        title: '推广文案',
                        slot: 'description',
                    },
                    {
                        title: '添加时间',
                        key: 'create_time',
                        maxWidth: 400
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        minWidth: 10,
                        maxWidth: 120
                    },
                ],
            }
        },
        computed: {
            noManagePerm() {
                return !this.$getPermMap('material.index.manage')
            },
        },
        created() {
            this.getMaterialList()
        },
        methods: {
            getType(row) {
                let getType;
                switch (row.goods_type) {
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

                    default:
                        getType = {
                            goodsName: '',
                            goodsText: ''
                        }
                        break;
                }
                return getType
            },
            // 获取会员卡列表
            getMaterialList() {
                this.loading = true;
                let params = {
                    ...this.search,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                };
                params.create_time = params.create_time.map((item) => {
                    return formatDate(item, "yyyy-MM-dd hh:mm:ss")
                })
                this.$api.materialApi.getMaterialList(params).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.data = res.data.list;
                        this.total = res.data.total
                    }
                })
            },
            // 搜索
            handleSearch(value) {
                this.search = { ...this.search, ...value };
                this.refreshTable()
            },
            // 切换页码
            changePage(page) {
                this.page = page;
                this.getMaterialList()
            },
            // 删除
            handleDelete(id) {
                this.$Modal.confirm({
                    title: '提示',
                    content: `确定删除此素材？`,
                    onOk: () => {
                        this.delete(id)
                    },
                    onCancel: () => {},
                })
            },
            // 删除素材
            delete(id) {
                this.$api.materialApi.deleteMaterial({id}).then((res) => {
                    if (res.error === 0) {
                        this.refreshTable();
                        this.$Message.success('删除成功')
                    }
                })
            },
            // 编辑
            handleEdit(id) {
                this.$router.push({
                    path: '/material/edit',
                    query: {
                        id,
                    },
                })
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1,
                };
                this.$refs['page'].reset();
                this.getMaterialList()
            },
        },
    }
</script>

<style lang="scss" scoped>
    .activity-wrap {
        background-color: $background-color;
        margin: 20px auto;
        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            border-radius: 2px;
            position: relative;
        }
        .content-box {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            .image {
                width: 80px;
                height: 80px;
                margin-right: 10px;
                border: 1px solid $border-color;
                overflow: hidden;
                border-radius: 2px;
                box-sizing: border-box;
                flex-shrink: 0;
                &>img {
                    width: 100%;
                    height: 100%;
                }
            }
            .content {
                width: 0;
                flex: 1;
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
                        &.verifyCount {
                            background-color: #FEE3FF;
                            color: #FA00FF;
                        }
                    }
                    .text {
                        @include font-14-20;
                    }
                }
                .label {
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    >span {
                        border-radius: 2px;
                        background-color: $background-color;
                        @include font-12-16;
                        margin-right: 10px;
                        color: $text-second;
                        display: inline-block;
                        height: 20px;
                        line-height: 20px;
                        padding: 0 8px;
                    }
                }
            }
        }
        .text {
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
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
