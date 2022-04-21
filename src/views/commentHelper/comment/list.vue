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
    <div class="virtual-account-list">
        <kdx-header-bar type="little">
            <template #header>
                <Button type="primary" :disabled="noManagePerm" @click="singleShow=true">+选择商品创建评价</Button>
            </template>
            <Form ref="form" :model="search" :label-width="100" inline @submit.native.prevent>
                <FormItem label="商品名称：">
                    <Input type="text" v-model="search.keyword" placeholder="请输入关键词" class="width-340" @on-enter="handleSearch"/>
                </FormItem>
                <div class="ivu-form-item-btn">
                    <Button type="primary" @click="handleSearch">搜索</Button>
                    <Button type="text" @click="handleReset">重置</Button>
                </div>
            </Form>
        </kdx-header-bar>
        <div class="table-list" v-loading="loading">
            <Table ref="table" :columns="columns" :data="data">
                <template #goods="{row}">
                    <div class="goods">
                        <div class="image">
                            <img :src="$utils.media(row.thumb)" alt="">
                        </div>
                        <div class="content">
                            <span class="mark more" v-if="1 === +row.has_option">多</span>
                            <span class="mark real" v-if="0 === +row.type">实</span>
                            <span class="mark virtual" v-else-if="1 === +row.type">虚</span>
                            <span class="mark card" v-else>密</span>
                            {{ row.title }}
                        </div>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <div>
                        <Button class="marginR-10" type="text" :disabled="noManagePerm" @click="handleClick(row.id, 'addData', 'manual')">手动创建</Button>
                        <Button class="marginR-10" type="text" :disabled="noManagePerm" @click="handleClick(row.id, 'addData', 'API')">API抓取</Button>
                        <Button type="text" :disabled="noViewPerm" @click="handleClick(row.id, 'viewData')">查看评价</Button>
                    </div>
                </template>
            </Table>
            <div class="footer-page">
                <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
            </div>
        </div>
        <slot></slot>

        <goods-selector v-model="singleShow" :status="-1" :current="getSingData" @on-cancel="cancelSelector" @on-change="changeSelector"></goods-selector>
    </div>
</template>

<script>

    import GoodsSelector from '@/components/selector/GoodsSelector';

    export default {
        name: "list",
        components: {
            GoodsSelector
        },
        props: {},
        data() {
            return {
                loading: false,
                singleShow: false,
                getSingData: {}, // 商品
                total: 1,
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                },
                search: {
                    keyword: ''
                },
                data: [],
                columns: [
                    {
                        title: '商品',
                        key: 'title',
                        slot: 'goods',
                        minWidth: 260,
                    },
                    {
                        title: '商品状态',
                        key: 'status',
                        minWidth: 50,
                        render: (h, params) => {
                            // 上架状态 1上架 2售罄 5上架和售罄 3下架4回收站
                            let status;
                            switch (+params.row.status) {
                                case 1:
                                    status = {
                                        color: 'success-color',
                                        text: '出售中'
                                    };
                                    break;
                                case 2:
                                    status = {
                                        color: 'danger-color',
                                        text: '已售罄'
                                    };
                                    break;
                                case 3:
                                    status = {
                                        color: 'warning-color',
                                        text: '仓库中'
                                    };
                                    break;
                                case 4:
                                    status = {
                                        color: 'disabled-color',
                                        text: '回收站'
                                    };
                                    break;
                            }
                            return (
                                <div class={status.color}>{status.text}</div>
                            )
                        }
                    },
                    {
                        title: '总评价数量',
                        key: 'comment_total',
                        minWidth: 50,
                    },
                    {
                        title: '手动创建评价数量',
                        key: 'manual_comment_total',
                        minWidth: 70,
                        render: (h, params) => {
                            return (
                                <div class='brand-color pointer' onClick={() => { this.handleClick(params.row.id, 'viewData', 'manual') }}>{params.row.manual_comment_total}</div>
                            )
                        }
                    },
                    {
                        title: '抓取评价数量',
                        minWidth: 60,
                        key: 'grab_comment_total',
                        render: (h, params) => {
                            return (
                                <div class='brand-color pointer' onClick={() => { this.handleClick(params.row.id, 'viewData', 'API') }}>{params.row.grab_comment_total}</div>
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 220,
                        slot: 'action'
                    }
                ]
            }
        },
        computed: {
            noManagePerm(){ //无管理权限
                return !this.$getPermMap('commentHelper.index.manage')
            },
            noViewPerm(){ //无查看权限
                return !this.$getPermMap('commentHelper.index.view')
            },
        },
        created() {
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                this.loading = true;
                let params = {
                    ...this.search,
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                };
                this.$api.commentHelperApi.getCommentList(params).then((res) => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.data = res.list;
                        this.total = res.total
                    }
                })
            },
            handleSearch() {
                this.refreshTable()
            },
            handleReset() {
                this.search = {
                    keyword: ''
                };
                this.refreshTable()
            },
            refreshTable() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1,
                };
                this.$refs['page'].reset();
                this.getList()
            },
            handleClick(id, type, other) {
                let path;
                switch (type) {
                    case 'addData':
                        path = '/commentHelper/comment/single/index';
                        break
                    case 'viewData':
                        path = '/commentHelper/comment/single/list';
                        break
                }
                let query = {
                    goodId: id
                };
                if (other){query.type = other}
                this.$router.push({
                    path,
                    query
                })
            },
            changePage(page) {
                this.page = page;
                this.getList();
            },
            cancelSelector() {
                this.singleShow = false
            },
            changeSelector(goods) {
                if (!goods.id) {
                    this.$Message.error('请选择商品');
                    return
                }
                this.handleClick(goods.id, 'addData');
            }
        },
    }
</script>

<style lang="scss" scoped>
    .virtual-account-list {
        margin: 20px auto;
        background-color: $background-color;
        .table-list {
            background-color: #ffffff;
            padding: 0 20px;
            margin-top: 10px;
            border-radius: 2px;
            position: relative;
            .goods {
                display: flex;
                align-items: center;

                .image {
                    width: 60px;
                    height: 60px;
                    border: 1px solid #E9EDEF;
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
                        color: #00C5C5;
                        background-color: #E6FFF9;
                    }

                    .card {
                        color: $danger-color;
                        background-color: $danger-light;
                    }
                }
            }
        }
    }
</style>