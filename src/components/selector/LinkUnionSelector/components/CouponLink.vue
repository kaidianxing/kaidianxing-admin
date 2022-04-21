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
    <div class="selector-link-discount-coupon">
        <div class="coupon-content">
            <div class="search">
                <Input v-model="search.keyword" search enter-button="搜索" placeholder="请输入" @on-search="getCouponList"
                       @on-enter="getCouponList" class="width-250"/>
                <span class="label">优惠券类型：</span>
                <Select v-model="search.coupon_sale_type" @on-change="handleSearch" class="width-160">
                    <Option value="all">全部</Option>
                    <Option value="1">满减券</Option>
                    <Option value="2">折扣券</Option>
                </Select>
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
        name: "CouponLink",
        props: {
            value: {
                type: Boolean,
                default: false
            },
            current: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                search: {
                    keyword: '',
                    coupon_sale_type: ''
                },
                columns: [
                    {
                        title: '类型',
                        key: 'coupon_sale_type',
                        width: 80,
                        render: (h, params) => {
                            if (params.row.coupon_sale_type === '2') {
                                return (
                                    <div class="coupons-type coupons-type-blue">
                                        <span>折</span>
                                        <img class="coupons-img" src={require('@/assets/image/coupons/subtract-blue.png')}/>
                                    </div>
                                )
                            } else {
                                return (
                                    <div class="coupons-type coupons-type-yellow">
                                        <span>减</span>
                                        <img class="coupons-img" src={require('@/assets/image/coupons/subtract-yellow.png')}/>
                                    </div>
                                )
                            }
                        }
                    },
                    {
                        title: '名称',
                        key: 'coupon_name',
                    },
                    {
                        title: '优惠内容',
                        key: 'content',
                    },
                    {
                        title: '剩余数量',
                        key: 'surplus',
                        render: (h, params) => {
                            if (params.row.stock_type == '0') {
                                return (
                                    <div>不限制</div>
                                )
                            } else {
                                return (
                                    <div>{params.row[params.column.key]}</div>
                                )
                            }
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                        width: 200,
                        render: (h, params) => {
                            return (
                                <div style="word-break: normal">
                                    {params.row[params.column.key]}
                                </div>
                            )
                        }
                    },
                    {
                        title: ' ',
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
                loading: false
            };
        },
        methods: {
            handleSearch() {
                this.resetPage();
                this.getCouponList();
            },
            // 页码改变
            handlePageChange(page) {
                this.page = page;
                this.getCouponList();
                try{
                    document.querySelectorAll('.noAnimate .ivu-tabs-content')[0].scrollTop =0
                }catch(err){
                    console.log(err)
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
                // 单选
                if (isChecked) {
                    this.data.forEach((item, i) => {
                        this.$set(this.data[i], 'checked', false);
                    });
                    this.$set(this.data[index], 'checked', true);
                    this.$emit('on-change', {url: this.data[index].url, name: this.data[index].coupon_name});
                } else {
                    this.$set(this.data[index], 'checked', false);
                    this.$emit('on-change', {});
                }
            },
            // 进行默认选中
            defaultChecked() {
                this.data.forEach((item, index) => {
                    if (this.current && item.url === this.current.url) {
                        this.$set(this.data[index], 'checked', true);
                    } else {
                        this.$set(this.data[index], 'checked', false);
                    }
                });
            },
            getCouponList() {
                this.loading = true;
                let search = Object.assign({}, this.search);
                search.coupon_sale_type = search.coupon_sale_type === 'all' ? '' : search.coupon_sale_type;
                let params = Object.assign({
                    pagesize: this.page.pageSize,
                    page: this.page.pageNumber
                }, search);
                this.$api.marketApi.getCouponAllList(params)
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            res.list.forEach(item => {
                                item.url = `/kdxMember/coupon/detail/index?id=${item.id}`
                            })
                            this.data = res.list;
                            this.total = res.total;
                            this.defaultChecked();
                        }
                    });
            },
            resetSearch() {
                this.search = {
                    keyword: '',
                    coupon_sale_type: 'all'
                };
            }
        },
        created() {
            this.resetSearch();
            this.resetPage();
            this.getCouponList();
        }
    };
</script>

<style scoped lang="scss">
    .selector-link-discount-coupon {
        > .coupon-content {
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
                /*max-height: calc(100vh - 110px - 80px - 45px - 75px - 60px);*/
            }
        }
    }
</style>
