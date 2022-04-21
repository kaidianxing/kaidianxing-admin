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
        <Table ref="table" :columns="columns" :data="data" @on-selection-change="selectChange"
               @on-select-all="selectAll"  @on-sort-change="changeSort"></Table>
        <div class="footer-action">
            <Checkbox v-model="isSelectAll" @on-change="checkboxChange"></Checkbox>
            <Button :disabled="selectDisabled" @click="setStatus({type: 'start',status: '1'})">批量开启</Button>
            <Button :disabled="selectDisabled" @click="setStatus({type: 'close',status: '0'})">批量关闭</Button>
        </div>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
    </div>
</template>

<script>
    import mixin from "@/views/market/mixins";
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
        mixins: [mixin],
        data() {
            return {
                columns: [
                    {
                        type: 'selection',
                        width: 40,
                        align: 'center'
                    },
                    {
                        title: '优惠券名称',
                        key: 'coupon_name',
                        minWidth: 150,
                        render: (h, params) => {
                            let component;
                            if (params.row.coupon_sale_type === '2') {
                                component = [
                                    h('span', '折'),
                                    h('img', {
                                        attrs: {
                                            src: require('@/assets/image/coupons/subtract-blue.png')
                                        }
                                    })
                                ];
                            } else {
                                component = [
                                    h('span', '减'),
                                    h('img', {
                                        attrs: {
                                            src: require('@/assets/image/coupons/subtract-yellow.png')
                                        }
                                    })
                                ];
                            }
                            return h('div', {
                                class: {
                                    'coupons-name': true
                                }
                            }, [
                                h('div', {
                                    class: {
                                        'coupons-type': true,
                                        'deduction': params.row.coupon_sale_type === '2',
                                        'full-reduction': params.row.coupon_sale_type === '1'
                                    }
                                }, component),
                                h('div', {
                                    class: {
                                        'coupons-name-content': true
                                    }
                                }, [
                                    h('p', {
                                        class: {
                                            'name': true
                                        }
                                    }, params.row[params.column.key]),
                                    h('p', {
                                        class: {
                                            'content': true
                                        }
                                    }, this.getCouponContent(params.row))
                                ])
                            ]);
                        }
                    },
                    {
                        title: '领取数(张/人)',
                        key: 'send_total',
                        minWidth: 80
                    },
                    {
                        title: '已领取',
                        key: 'get_count',
                        sortable: 'custom',
                        minWidth: 100,
                    },
                    {
                        title: '满足条件',
                        key: 'enough_price',
                        minWidth: 100,
                        render: (h, params) => {
                            return (
                                <div>
                                    {`订单金额满￥${params.row.enough_price}`}
                                </div>
                            )
                        }
                    },
                    {
                        title: '使用率',
                        key: 'use_num',
                        minWidth: 80,
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
                        title: '活动使用时间',
                        key: 'usageRate',
                        width: 160,
                        render: (h, params) => {
                            return (
                                <div class="activity-time">
                                    <div class="activity-box">
                                        <div class="name">
                                            起：
                                        </div>
                                        <div class="time">
                                            {params.row.start_time || ''}
                                        </div>
                                    </div>
                                    <div class="activity-box">
                                        <div class="name">
                                            止：
                                        </div>
                                        <div class="time">
                                            {params.row.end_time || ''}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    },
                    {
                        title: '发送条件',
                        key: 'send_point',
                        minWidth: 100,
                        render: (h, params) => {
                            if (params.row[params.column.key] === '0') {
                                return (
                                    <div>订单完成后</div>
                                );
                            } else if (params.row[params.column.key] === '1') {
                                return (
                                    <div>订单付款后</div>
                                );
                            }
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        minWidth: 100,
                        maxWidth: 200,
                        render: (h, params) => {
                            let stateComponent;
                            if (params.row.status === '0') {
                                stateComponent = (
                                    <Button type="text" onClick={() => {
                                        this.setStatus({type: 'start', status: '1', id: params.row.id});
                                    }}>开启活动</Button>
                                );
                            } else if (params.row.status === '1') {
                                stateComponent = (
                                    <Button type="text" onClick={() => {
                                        this.setStatus({type: 'close', status: '0', id: params.row.id});
                                    }}>停止活动</Button>
                                );
                            }
                            return (
                                <div class="action">
                                    {
                                        stateComponent
                                    }
                                    <Button type="text"
                                            to={`/market/coupons/send/full/edit?id=${params.row.id}`}>编辑</Button>
                                    <Button type="text" onClick={() => this.handleDelete(params.row) }>删除</Button>
                                </div>
                            );
                        }
                    }
                ],
                selectRows: [], // 选中项
                isSelectAll: false,
            };
        },
        computed: {
            // 下方按钮是否可操作
            selectDisabled() {
                return this.selectRows.length === 0;
            }
        },
        methods: {
            changePage(page) {
                this.$emit('on-page-change', page);
                this.initFooterData();
            },
            // 选中项发生变化
            selectChange(selection) {
                this.selectRows = selection;
                this.isSelectAll = this.selectRows.length === this.data.length;
            },
            selectAll(selection, status) {
                console.log('all', selection, status);
            },
            // 表格下方全选按钮
            checkboxChange(status) {
                this.$refs['table'].selectAll(status);
                this.data.forEach((item, index) => {
                    this.$set(this.data[index], '_checked', status);
                });
                if (status) {
                    this.selectRows = this.data;
                } else {
                    this.selectRows = [];
                }
            },
            // 改变活动状态
            setStatus({type, status, id}) {
                let content, ids;
                if (type === 'start') {
                    content = '确认开始活动？';
                } else if (type === 'close') {
                    content = '确认停止活动?';
                }
                if (id) {
                    ids = id;
                } else {
                    ids = this.selectRows.map(item => item.id);
                }
                this.setActivityStatus(ids, status, content);
            },
            setActivityStatus(ids, status, content) {
                this.$Modal.confirm({
                    title: '提示',
                    content,
                    onOk: () => {
                        this.$api.marketApi.setFullSendActivityStatus({id: ids, status})
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('活动状态修改成功');
                                    this.refreshTable();
                                }
                            });
                    },
                    onCancel: () => {
                    }
                });
            },
            handleDelete(row) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除该满额送券活动吗?',
                    onOk: () => {
                        this.$api.marketApi.deleteFullSend({id: [row.id]})
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('满额送券删除成功');
                                    this.refreshTable();
                                    this.$refs['page']?.reset();
                                }
                            });
                    },
                    onCancel: () => {
                    }
                });
            },
            refreshTable() {
                this.$emit('on-refresh');
                this.initFooterData();
            },
            // 初始化下方的checkbox
            initFooterData() {
                this.isSelectAll = false;
                this.selectRows = [];
            },
          changeSort({key, order}) {
            if (order === 'normal') {
              this.$emit('on-sort', {});
            } else {
              this.$emit('on-sort', {sort: key, by: order});
            }
          },
        }
    };
</script>

<style scoped lang="scss">
    .market-coupons-list {
        /deep/ .ivu-table {
            td {
                @include font-14-20;
                // 优惠券名称
                .coupons-name {
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;

                    > .coupons-type {
                        position: relative;
                        padding: 5px 14px 5px 16px;
                        border-radius: 2px;
                        color: #ffffff;
                        display: inline-block;
                        flex-shrink: 0;

                        > img {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            right: -2px;
                        }
                    }

                    > .deduction {
                        background-color: $brand-color;
                    }

                    > .full-reduction {
                        background-color: $warning-color;
                    }

                    > .coupons-name-content {
                        @include font-14-20;
                        color: $text-first;
                        padding-left: 10px;
                       overflow: hidden;

                        > .content,
                        > .name {
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        > .content {
                            color: $text-third;
                            font-size: 12px;
                        }
                    }

                }
                // 活动时间
                .activity-time {
                    .activity-box {
                        display: flex;
                        /*flex-wrap: nowrap;*/
                        line-height: 20px;
                        >.name {
                            flex-shrink: 0;
                        }
                        >.time {
                            flex: 1;
                            width: 0;
                            word-break: normal;
                        }
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

        .footer-action {
            padding: 16px 0;

            .ivu-checkbox-default {
                margin-right: 0;
                width: 40px;
                text-align: center;

                > span {
                    /*&:last-child {*/
                    /*    display: none;*/
                    /*}*/
                }
            }

            .ivu-btn-default {
                width: inherit;
                margin-left: 10px;
            }
        }

        .footer-page {
            padding: 20px 0;
            display: flex;
            justify-content: center;
        }
    }
</style>
