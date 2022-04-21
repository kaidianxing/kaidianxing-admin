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
    <kdx-modal-frame :value="value" title="店铺选择器" width="1000" ok-text="保存" @on-ok="handleSave" @on-cancel="handleCancel">
        <div class="store-selector">
            <div class="store-selector-content" ref='scrollBox'>
                <div class="search">
                    <Input v-model="search.keywords" search enter-button="搜索" placeholder="请输入" @on-search="handleSearch"
                           @on-enter="handleSearch" class="width-250"/>
                    <span class="label">页面类型：</span>
                    <Select v-model="search.type" @on-change="handleSearch" class="width-160">
                        <Option value="all">全部</Option>
                        <Option value="1">商城首页</Option>
                        <Option value="2">商品详情</Option>
                        <Option value="3">会员中心</Option>
                        <Option value="4">分销页面</Option>
                    </Select>
                </div>
                <Table ref="table" :columns="columns" :data="data" :height="430"></Table>
            </div>
            <div class="footer-page" v-show="total > 10">
                <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "StoreSelector",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            multiple: {
                type: Boolean,
                default: false
            },
            current: {
                type: [String, Object]
            },
            currentList: {
                type: Array
            }
        },
        data() {
            return {
                search: {
                    keywords: '',
                    type: ''
                },
                columns: [
                    {
                        title: '页面名称',
                        key: 'name',
                    },
                    {
                        title: '页面类型',
                        key: 'type',
                        render: (h, params) => {
                            let component,name='';
                            if (params.row.type == '1') {
                                component = (<span class="iconfont icon-shouye1"></span>);
                                name = '商城首页';
                            } else if (params.row.type == '2') {
                                component = (<span class="iconfont icon-xiangqing"></span>);
                                name = '商品详情'
                            } else if (params.row.type == '3') {
                                component = (<span class="iconfont icon-huiyuanzhongxin1"></span>);
                                name = '会员中心'
                            } else  if (params.row.type == '4') {
                                component = (<span class="iconfont icon-shouye1"></span>);
                                name = '分销中心';
                            }
                            return (
                                <div class="page-type">
                                    {component}
                                    <span class="page-name">{name}</span>
                                    <kdx-hint-tooltip type="qrCode" image={params.row.thumb} text={params.row.thumb}>
                                        <kdx-svg-icon type="icon-erweima"></kdx-svg-icon>
                                    </kdx-hint-tooltip>
                                </div>
                            );
                        }
                    },
                    {
                        title: '修改时间',
                        key: 'updated_at',
                    },
                    {
                        title: ' ',
                        key: 'action',
                        width: 100,
                        render: (h, params) => {
                            return h('div', {
                                class: {
                                    action: true
                                }
                            }, [
                                h('Button', {
                                    props: {
                                        type: 'default-primary'
                                    },
                                    style: {
                                        display: params.row.checked ? 'none' : 'block'
                                    },
                                    on: {
                                        click: () => {
                                            this.setChecked(params.index, true);
                                        }
                                    }
                                }, '选择'),
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    style: {
                                        display: params.row.checked ? 'block' : 'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.setChecked(params.index, false);
                                        }
                                    }
                                }, '已选')
                            ]);
                        }
                    }
                ],
                data: [],
                total: 100,
                page: {
                    pageSize: 10,
                    pageNumber: 1 // 页码
                },
                selectRows: [],
                selectRow: {}
            };
        },
        methods: {
            handleSearch() {
                this.resetPage();
                this.getList();
            },
            handlePageChange(page) {
              this.page = page;
              this.getList();
                try {
                    this.$refs.scrollBox.scrollTop=0
                }catch (e) {
                    console.log(e)
                }
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
                // 多选
                if (this.multiple) {
                    this.$set(this.data[index], 'checked', isChecked);
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
                    // 单选
                    if (isChecked) {
                        this.data.forEach((item, i) => {
                            this.$set(this.data[i], 'checked', false);
                        });
                        this.$set(this.data[index], 'checked', true);
                        this.selectRow = this.data[index];
                    } else {
                        this.$set(this.data[index], 'checked', false);
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
            getList() {
                let search = Object.assign({}, this.search);
                search.type = search.type === 'all' ? '' : search.type;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                }, search);
                this.$api.shopApi.getPageList(params)
                    .then(res => {
                        if (res.error === 0) {
                            this.data = res.list;
                            this.total = res.total;
                            this.defaultChecked();
                        }
                    });
            },
            handleSave() {
                if (this.multiple) {
                    this.$emit('on-change', this.selectRows);
                } else {
                    this.$emit('on-change', this.selectRow);
                }
                this.handleCancel();
            },
            handleCancel() {
                this.$emit('on-cancel');
            },
            resetSearch() {
                this.search = {
                    keywords: '',
                    type: 'all'
                };
            }
        },
        watch: {
            value: {
                handler(val) {
                    // 当val为true时表示弹窗打开
                    if (val) {
                        if (this.multiple) {
                            this.selectRows = [...this.currentList];
                        } else {
                            this.selectRow = this.current;
                        }
                        this.resetSearch();
                        this.resetPage();
                        this.getList();
                    }
                },
                immediate: true
            }
        },
        mounted() {
            this.resetSearch();
        }
    };
</script>

<style scoped lang="scss">
    .store-selector {
       >.store-selector-content {
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
                           padding-right: 5px;
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
        .store-selector {
            > .store-selector-content {
                max-height: calc(100vh - 110px - 80px - 75px);
            }
        }
    }
</style>
