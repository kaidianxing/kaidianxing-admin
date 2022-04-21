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
    <kdx-modal-frame v-model="value" title="菜单选择器" :width="810" @on-ok="handleOk" @on-cancel="handleCancel">
        <div class="menu-selector">
            <div class="menu-selector-content" ref='scrollBox'>
                <div class="search">
                    <Input v-model="search.keywords" placeholder="请输入" search enter-button="搜索" @on-search="handleSearch"
                           class="width-250"/>
                </div>
                <Table ref="table" :columns="columns" :data="data" v-loading="loading"></Table>
            </div>
            <div class="footer-page" v-show="total > 10">
                <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "MenuSelector",
        props: {
            current: {
                type: [String, Object],
                default: () => {
                }
            },
            currentList: {
                type: Array,
                default: () => []
            },
            // 是否多选
            multiple: {
                type: Boolean,
                default: false
            },
            type: {
                type: [String, Number],
                default: ''
            }
        },
        data() {
            return {
                value: false,
                search: {
                    keywords: ''
                },
                columns: [
                    {
                        title: '菜单名称',
                        key: 'name',
                        render: (h, params) => {
                            return (
                                <div class="menu-name">
                                    <span>{params.row[params.column.key]}</span>
                                </div>
                            );
                        }
                    },
                    {
                        title: '修改时间',
                        key: 'updated_at',
                        width: 180,
                        render: (h, params) => {
                            if (params.row.updated_at == '0000-00-00 00:00:00') {
                                return (
                                    <div>{params.row.created_at}</div>
                                );
                            } else {
                                return (
                                    <div>{params.row.updated_at}</div>
                                );
                            }
                        }
                    },
                    {
                        title: '预览',
                        key: 'thumb',
                        width: 200,
                        render: (h, params) => {
                            return (
                                <div class="preview">
                                    <img src={this.$utils.media(params.row[params.column.key])} alt=""/>
                                </div>
                            );
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
                selectRow: {},
                selectRows: [],
                loading: false
            };
        },
        methods: {
            // 进行弹窗打开和关闭
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    if (this.multiple) {
                        this.selectRows = [...this.currentList];
                    } else {
                        this.selectRow = this.current;
                        this.search.keywords = '';
                        // 进行数据加载以及选中初始化
                        this.resetSearch();
                        this.resetPage();
                        this.getList();
                    }
                }
            },
            handleSearch() {
                this.resetPage();
                this.getList();
            },
            resetSearch() {
                this.search = {
                    keywords: ''
                };
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
                if (this.multiple) {
                    this.$set(this.data[index], 'checked', isChecked);
                    // 多选
                    if (this.selectRows.length === 0) {
                        this.selectRows.push(this.data[index]);
                    } else {
                        if (isChecked) {
                            this.selectRows.push(this.data[index]);
                        } else {
                          this.selectRows =this.selectRows.filter(item=> item.id!==this.data[index].id)
                        }
                    }
                } else {
                    this.data.forEach((item, i) => {
                        this.$set(this.data[i], 'checked', false);
                    });
                    this.$set(this.data[index], 'checked', isChecked);
                    if (isChecked) {
                        this.selectRow = this.data[index];
                    } else {
                        this.selectRow = {};
                    }
                }
            },
            // 进行默认选中
            defaultChecked() {
                if (this.multiple) {
                    this.data.forEach((item, index) => {
                        for (let current of this.selectRows) {
                            if (current.id === item.id) {
                                this.$set(this.data[index], 'checked', true);
                                break;
                            }
                        }
                    });
                } else {
                    this.data.forEach((item, index) => {
                        if (this.selectRow && item.id === this.selectRow.id) {
                            this.$set(this.data[index], 'checked', true);
                        } else {
                            this.$set(this.data[index], 'checked', false);
                        }
                    });
                }
            },
            // 页码改变
            handlePageChange(page) {
                this.page = page;
                try {
                    this.$refs.scrollBox.scrollTop=0
                }catch (e) {
                    console.log(e)
                }
                this.getList();
            },
            handleOk() {
                if (this.multiple) {
                    this.$emit('on-change', this.selectRows);
                } else {
                    this.$emit('on-change', this.selectRow);
                }
                this.setValue();
            },
            handleCancel() {
                this.setValue();
            },
            getList() {
                this.loading = true;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber,
                    type: this.type
                }, this.search);
                this.$api.shopApi.getNewMenuList(params)
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.data = res.list || [];
                            this.total = res.total;
                            this.defaultChecked();
                        }
                    });
            }
        }
    };
</script>

<style scoped lang="scss">
    .menu-selector {
        > .menu-selector-content {
            max-height: calc(100vh - 110px - 160px - 75px);
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
                    // 菜单名称
                    .menu-name {
                        > .default-label {
                            padding: 2px 8px;
                            margin-left: 4px;
                            color: $brand-color;
                            background-color: $brand-light;
                            @include font-12-16;
                        }
                    }
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
                            vertical-align: top;
                        }
                    }
                    // 预览
                    .preview {
                        width: 200px;
                        height: 20px;
                        border-radius: 2px;
                        > img {
                            width: 100%;
                            height: 100%;
                            border-radius: 2px;
                            /*margin-right: 10px;*/
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
        .menu-selector {
            > .menu-selector-content {
                max-height: calc(100vh - 110px - 80px - 75px);
            }
        }
    }
</style>
