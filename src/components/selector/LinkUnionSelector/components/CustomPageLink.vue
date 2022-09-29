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
    <div class="custom-page-selector">
        <div class="custom-page-selector-content">
            <div class="search">
                <Input v-model="search.keywords" placeholder="请输入" search enter-button="搜索" @on-search="handleSearch"
                       @on-enter="handleSearch" class="width-250"/>
            </div>
            <Table ref="table" :columns="columns" :data="data" v-loading="loading"></Table>
        </div>
        <div class="footer-page" v-show='total>10'>
            <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CustomPageLink",
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
                    keywords: ''
                },
                columns: [
                    {
                        title: '页面名称',
                        key: 'name'
                    },
                    {
                        title: '页面类型',
                        key: 'type',
                        render: (h, params) => {
                            if (params.row.type == '0') {
                                return (
                                    <div class="page-type">
                                        <span class="iconfont icon-shouye1"></span>
                                        <span class="page-name">自定义页面</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div>-</div>
                                );
                            }
                        }
                    },
                    {
                        title: '修改时间',
                        key: 'update_time',
                        render: (h, params) => {
                            if (params.row.update_time == '0000-00-00 00:00:00') {
                                return (
                                    <div>{params.row.create_time}</div>
                                );
                            } else {
                                return (
                                    <div>{params.row.update_time}</div>
                                );
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        render: (h, params) => {
                            return (
                                <div class="action">
                                    <Button class="default-primary"
                                            style={{display: params.row.checked ? 'none' : 'block'}}
                                            onClick={() => {
                                                this.setChecked(params.index, true);
                                            }}
                                    >选择</Button>
                                    <Button type="primary"
                                            style={{display: params.row.checked ? 'block' : 'none'}}
                                            onClick={() => {
                                                this.setChecked(params.index, false);
                                            }}
                                    >已选</Button>
                                </div>
                            );
                        }
                    }
                ],
                data: [],
                total: 0,
                page: {
                    pageSize: 10,
                    pageNumber: 1
                },
                loading: false
            };
        },
        methods: {
            handleSearch() {
                this.resetPage();
                this.getList();
            },
            resetSearch() {
                this.search.keywords = '';
            },
            resetPage() {
                this.page = {
                    pageSize: 10,
                    pageNumber: 1
                };
                this.$refs['page']?.reset();
            },
            // 选择、取消选择
            setChecked(index, isChecked) {
                this.data.forEach((item, i) => {
                    this.$set(this.data[i], 'checked', false);
                });
                this.$set(this.data[index], 'checked', isChecked);
                if (isChecked) {
                    this.$emit('on-change', {url: `/kdxCustom/index/index?pageId=${this.data[index].id}`, name: this.data[index].name});
                } else {
                    this.$emit('on-change', {});
                }
            },
            // 进行默认选中
            defaultChecked() {
                this.data.forEach((item, index) => {
                    console.log(this.current.url,item.url)
                    if (this.current && item.url == this.current.url) {
                        this.$set(this.data[index], 'checked', true);
                    } else {
                        this.$set(this.data[index], 'checked', false);
                    }
                });
            },
            // 页码改变
            handlePageChange(page) {
                this.page = page;
                this.getList();
                try{
                    document.querySelectorAll('.noAnimate .ivu-tabs-content')[0].scrollTop =0
                }catch(err){
                    console.log(err)
                }
            },
            getList() {
                this.loading = true;
                let params = Object.assign({
                    pageSize: this.page.pageSize,
                    page: this.page.pageNumber,
                    type: '0'
                }, this.search);
                this.$api.shopApi.getNewCustomList(params)
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            res.list.forEach(item => {
                                item.url =`/kdxCustom/index/index?pageId=${item.id}`
                            })
                            this.data = res.list || [];
                            this.total = res.total;
                            this.defaultChecked();
                        }
                    });
            }
        },
        created() {
            this.resetSearch();
            // 进行数据加载以及选中初始化
            this.resetPage();
            this.getList();
        }
    };
</script>

<style scoped lang="scss">
    .custom-page-selector {
        >.custom-page-selector-content {
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
                /*.ivu-table-cell {*/
                /*    padding: 10px 15px;*/
                /*}*/
                td {
                    // 页面类型
                    .page-type {
                        .iconfont {
                            border-radius: 100%;
                            color: #ffffff;
                            padding: 4px;
                        }
                        .iconfont.icon-shouye1 {
                            background-color: $brand-color;
                        }
                        .iconfont.icon-xiangqing {
                            background-color: $warning-color;
                        }
                        .iconfont.icon-huiyuanzhongxin1 {
                            background-color: $danger-color;
                        }
                        .page-name {
                            padding-left: 10px;
                            padding-right: 4px;
                            vertical-align: top;
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
        .custom-page-selector {
            > .custom-page-selector-content {
                /*max-height: calc(100vh - 110px - 80px - 45px - 75px - 60px);*/
            }
        }
    }
</style>
