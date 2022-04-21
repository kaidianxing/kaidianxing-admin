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
    <kdx-modal-frame :value="value" title="打印机选择器" width="1000"
                 ok-text="保存" @on-ok="handleSave" @on-cancel="handleCancel">
        <div class="selector-link-discount-coupon">
            <div class="coupon-content" ref='scrollBox'>
                <div class="search">
                    <Input v-model="search.keyword" search enter-button="搜索" placeholder="请输入" @on-search="getList"
                           @on-enter="getList"  class="width-250"/>
                    <!--<span class="label">优惠券类型：</span>
                    <Select v-model="search.coupon_sale_type" @on-change="handleSearch" class="width-160">
                        <Option value="all">全部</Option>
                        <Option value="1">满减券</Option>
                        <Option value="2">折扣券</Option>
                    </Select>-->
                </div>
                <Table ref="table" :columns="columns" :data="data" v-loading="loading"></Table>
            </div>
            <div class="footer-page" v-show='total>10'>
                <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "PrinterSelector",
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
            },
            limit: {
                type: Number
            },
            pick_way: {
                type: [String,Number],
                default: ''
            }
        },
        data() {
            return {
                search: {
                    keyword: '',
                },
                columns: [
                    // {
                    //     title: '序号',
                    //     key: 'index',
                    // },
                    {
                        title: '打印机名称',
                        key: 'name',
                    },
                    {
                        title: '打印机品牌',
                        key: 'brand',
                    },
                    {
                        title: '打印机位置',
                        key: 'location',
                        render: (h, params) => {
                            return (
                                <div>{params.row.location||'-'}</div>
                            )
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
                loading: false,
                selectRows: [],
                selectRow: {}
            };
        },
        methods: {
            handleSearch() {
                this.resetPage();
                this.getList();
            },
            // 页码改变
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
                    if (this.limit && this.selectRows.length === this.limit && isChecked) {
                        this.$Message.error('已超出最大可选数量');
                        return;
                    }
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
                this.loading = true;
                let search = Object.assign({}, this.search);
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                }, search);
                console.log(params);
                this.$api.printerApi.printerList(params).then(res => {
                    this.loading = false;
                    if (res.error === 0) {
                        this.data = res.data.list;
                        this.total = res.data.total;
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
                    keyword: '',
                };
            }
        },
        watch: {
            value: {
                handler(val) {
                    // 当val为true时表示弹窗打开
                    if (val) {
                        if (this.multiple) {
                            this.selectRows = [...this.currentList] || [];
                        } else {
                            this.selectRow = this.current || {};
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
    .selector-link-discount-coupon {
        >.coupon-content {
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
                    // 优惠券类型
                    .coupons-type {
                        position: relative;
                        display: inline-block;
                        @include font-14-20;
                        padding: 5px 12px 5px 14px;
                        border-radius: 2px;
                        color: #ffffff;

                        > img {
                            position: absolute;
                            top: 0;
                            right: -2px;
                            bottom: 0;
                        }
                    }

                    // 折扣券
                    .coupons-type-blue {
                        background-color: $brand-color;
                    }

                    // 满减券
                    .coupons-type-yellow {
                        background-color: $warning-color;
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
        .selector-link-discount-coupon {
            > .coupon-content {
                max-height: calc(100vh - 110px - 80px - 75px);
            }
        }
    }
</style>