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
    <div class="market-coupons-list">
        <Table ref="table" :columns="columns" :data="data" @on-sort-change="changeSort">
            <template slot-scope="{ row }" slot="remaining_amount">
                <div v-if="row.stock_type === '0'">不限制</div>
                <div v-else>{{ parseInt(row.stock) - parseInt(row.get_total) }}</div>
            </template>
        </Table>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TableList",
        props: {
            data: {
                type: Array,
                default: () => []
            },
            total: {
                type: Number,
                default: 0
            }
        },
        computed: {
            noManagePerm() { //管理权限
                return !this.$getPermMap('sale.coupon-list.manage')
            },
        },
        data() {
            return {
                columns: [
                    {
                        title: '序号',
                        key: 'sort',
                        width: 70
                    },
                    {
                        title: '优惠券类型',
                        key: 'coupon_sale_type',
                        minWidth: 110,
                        maxWidth: 120,
                        render: (h, params) => {
                            let component;
                            if (params.row.coupon_sale_type === '2') {
                                component = [
                                    h('span', '折扣券'),
                                    h('img', {
                                        attrs: {
                                            src: require('@/assets/image/coupons/subtract-blue.png')
                                        }
                                    })
                                ];
                            } else {
                                component = [
                                    h('span', '满减券'),
                                    h('img', {
                                        attrs: {
                                            src: require('@/assets/image/coupons/subtract-yellow.png')
                                        }
                                    })
                                ];
                            }
                            return h('div', {
                                class: {
                                    'coupons-type': true,
                                    'deduction': params.row.coupon_sale_type === '2',
                                    'full-reduction': params.row.coupon_sale_type === '1'
                                }
                            }, component);
                        }
                    },
                    {
                        title: '优惠券名称',
                        key: 'coupon_name',
                        minWidth: 100
                    },
                    {
                        title: '优惠内容',
                        key: 'content',
                        minWidth: 100
                    },
                    {
                        title: '发放总量',
                        key: 'stock',
                        minWidth: 100,
                        render: (h, params) => {
                            if (params.row.stock_type == '0') {
                                return (
                                    <div>不限制</div>
                                );
                            } else {
                                return (
                                    <div>{params.row[params.column.key]}</div>
                                );
                            }
                        }
                    },
                    {
                        title: '已领取',
                        key: 'get_total',
                        sortable: 'custom',
                        minWidth: 100,
                    },
                    {
                        title: '剩余数量',
                        slot: 'remaining_amount',
                        minWidth: 100,
                    },
                    {
                        title: '使用率',
                        key: 'use_num',
                        sortable: 'custom',
                        minWidth: 100,
                        render: (h, params) => {
                            let data = parseFloat(params.row[params.column.key]) * 100;
                            if (data || data === 0) {
                                return (
                                    <div>{data.toFixed(2)}%</div>
                                );
                            } else {
                                return (
                                    <div>0.00%</div>
                                );
                            }
                        }
                    },
                    {
                        title: '领取方式',
                        key: 'pick_way',
                        minWidth: 100,
                        maxWidth: 120,
                        render: (h, params) => {
                            return (
                                <div class="pickup-method">
                                    <span class="free"
                                          style={{display: params.row.pick_way == 1 ? 'inline-block' : 'none'}}>
                                        免费领取
                                    </span>
                                    <span class="pay"
                                          style={{display: params.row.pick_way == 2 ? 'inline-block' : 'none'}}>
                                        付费领取
                                    </span>
                                    <span class="link"
                                          style={{display: params.row.pick_way == 3 ? 'inline-block' : 'none'}}>
                                        链接领取
                                    </span>
                                    <span class="activity"
                                          style={{display: params.row.pick_way == 4 ? 'inline-block' : 'none'}}>
                                        活动领取
                                    </span>
                                </div>
                            );
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                        width: 120,
                        render: (h, params) => {
                            return (
                                <p style="word-break: normal">{params.row[params.column.key]}</p>
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        minWidth: 80,
                        maxWidth: 150,
                        render: (h, params) => {
                            let stateComponent;
                            if (params.row.state === '0') {
                                stateComponent = (
                                    <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.setSendState(1, params.row);
                                    }}>开始发放</Button>
                                );
                            } else if (params.row.state === '1') {
                                stateComponent = (
                                    <Button type="text" disabled={this.noManagePerm} onClick={() => {
                                        this.setSendState(0, params.row);
                                    }}>停止发放</Button>
                                );
                            }
                            let pickComponent;
                            if (params.row.pick_way === 3) {
                                pickComponent = (
                                    <kdx-hint-tooltip type="qrCode"
                                                  url    ={this.$utils.getPreviewUrl('couponLink', params.row.id)}
                                                  text="复制链接地址">
                                        <Button type="text" disabled={this.noManagePerm}>链接领取</Button>
                                    </kdx-hint-tooltip>
                                );
                            }
                            if (params.row.pick_way === 4) {
                                // 活动领取的券没有发放操作
                                stateComponent = ''
                            }
                            return (
                                <div class="action">
                                    {
                                        stateComponent
                                    }
                                    <Button type="text" disabled={this.noManagePerm} onClick={()=>{this.$router.push({path:`/market/coupons/base/edit`,query:{id:params.row.id}})}}>编辑</Button>
                                    {
                                        //    <kdx-hint-tooltip type="qrCode" url={params.row.image} text="复制优惠券链接">
                                        // <Button type="text">预览</Button>
                                        // </kdx-hint-tooltip>
                                    }
                                    {
                                        pickComponent
                                    }
                                </div>
                            );
                        }
                    }
                ]
            };
        },
        methods: {
            // 重置页码
            reset() {
                this.$refs['page'].reset();
            },
            changePage(page) {
                this.$emit('on-page-change', page);
            },
            // 修改状态
            setSendState(state, row) {
                let content, message;
                if (state) {
                    content = '是否开始发放？';
                    message = '开始发放成功';
                } else {
                    content = '是否停止发放？';
                    message = '停止发放成功';
                }
                let params = {
                    id: row.id,
                    state
                };
                this.$Modal.confirm({
                    title: '提示',
                    content,
                    onOk: () => {
                        this.$api.marketApi.setSendState(params)
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success(message);
                                    this.$emit('on-refresh');
                                }
                            });
                    }
                });
            },
            changeSort({key, order}) {
                if (order === 'normal') {
                    this.$emit('on-sort', {});
                } else {
                    this.$emit('on-sort', {sort: key, by: order});
                }
            },
            formatData(data) {
                if (parseInt(data) > 999) {
                    return '999+';
                } else {
                    return data;
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .market-coupons-list {
        /deep/ .ivu-table {
            td {
                @include font-14-20;
                // 优惠券类型
                .coupons-type {
                    position: relative;
                    padding: 5px 14px 5px 16px;
                    border-radius: 2px;
                    color: #ffffff;
                    display: inline-block;

                    > img {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        right: -2px;
                    }
                }

                .deduction {
                    background-color: $brand-color;
                }

                .full-reduction {
                    background-color: $warning-color;
                }

                // 免费领取
                .pickup-method {
                    > span {
                        padding: 2px 5px;
                        border-radius: 2px;
                    }

                    // 免费领取
                    > .free {
                        color: $success-color;
                        background-color: $success-light;
                    }

                    // 付费领取
                    .pay {
                        color: $danger-color;
                        background-color: $danger-light;
                    }

                    // 链接领取
                    .link {
                        color: $brand-color;
                        background-color: $brand-light;
                    }

                    // 活动领取
                    .activity {
                        color: $warning-color;
                        background-color: $warning-light;
                    }
                }

                .action {
                    margin-right: -8px;

                    .ivu-btn-text {
                        margin-right: 8px;
                    }
                }
            }
        }

        .footer-page {
            padding: 20px 0;
            display: flex;
            justify-content: center;
        }
    }
</style>
