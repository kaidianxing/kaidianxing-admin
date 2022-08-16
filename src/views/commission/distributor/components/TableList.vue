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
    <div class="good-list-table-list">
        <Table ref="table" :columns="columns" :data="data" @on-sort-change="changeSort"></Table>
        <div class="footer-page">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TableList",
        components: {},
        props: {
            data: {
                type: Array,
                default: () => []
            },
            total: {
                type: [String, Number],
                default: 0
            }
        },
        computed:{
            noManagePerm() { //管理权限
                return !this.$getPermMap('commission.agent.manage')
            },
        },
        data() {
            return {
                columns: [
                    {
                        title: '会员',
                        key: 'shop',
                        minWidth: 150,
                        render: (h, params) => {
                            // 用户来源 10: h5;20: 微信公众号;21: 微信小程序;30:头条小程序;31:抖音小程序;5:支付宝小程序;
                            let component;
                            if (params.row.source == '20') {
                                // 公众号
                                component = (
                                    <span class="iconfont icon-weixin icon"></span>
                                );
                            } else if (params.row.source == '21') {
                                // 微信小程序
                                component = (
                                    <span class="iconfont icon-weixinxiaochengxu icon"></span>
                                );
                            }
                            else if (params.row.source == '30') {
                                // 头条小程序 字节跳动小程序
                                component = (
                                    <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2"></kdx-svg-icon>
                                );
                            }
                            else if (params.row.source == '32') {
                                // 头条小程序 字节跳动小程序
                                component = (
                                    <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban"></kdx-svg-icon>
                                );
                            }
                            else if (params.row.source == '31') {
                                // 抖音小程序 字节跳动小程序
                                component = (
                                    <kdx-svg-icon class="iconfont" type="icon-douyin"></kdx-svg-icon>
                                );
                            } 
                            // else if (params.row.source == '5') {
                            //     // 支付宝小程序
                            //     component = (
                            //         <span class="iconfont icon-zhifubaoxiaochengxu icon"></span>
                            //     );
                            // }
                            else if (params.row.source == '10') {
                                // h5
                                component = (
                                    <span class="iconfont icon-H icon"></span>
                                );
                            }  
                            else if (params.row.source == '70') {
                                // pc
                                component = (
                                    <span style="color:#12aa9c" class="iconfont icon-PCduan icon"></span>
                                );
                            }
                            // 百度小程序
                            // <span v-if="list.create_from === '0'" class="iconfont icon-baiduxiaochengxu icon"></span>
                            return (
                                <div class="vip">
                                    <div class="vip-image">
                                        <img src={this.$media(params.row.avatar)} onError={e => {
                                            this.replaceImage(e, 'avatar');
                                        }}/>
                                    </div>
                                    <div class="vip-content">
                                        <div class="vip-name line-hide" onClick={() => {this.routerPage('vip-detail',params.row.member_id)}}>
                                            {params.row.nickname}
                                        </div>
                                        <div class="vip-platform">
                                            {component}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    },
                    {
                        title: '分销商等级',
                        key: 'commission_level_name',
                        minWidth: 100,
                        render: (h, params) => {
                            if (params.row[params.column.key]) {
                                return (
                                    <div class="vip-grade">
                                       <div class="icon">
                                           <kdx-svg-icon type="icon-fenxiaoshang-bg"></kdx-svg-icon>
                                       </div>
                                        <div class="text">{params.row[params.column.key]}</div>
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
                        title: '累计佣金',
                        key: 'commission_total',
                        minWidth: 110,
                        sortable: 'custom',
                        render: (h, params) => {
                            return (
                                <div>￥{params.row[params.column.key]}</div>
                            );
                        }
                    },
                    {
                        title: '已提现佣金',
                        key: 'commission_pay',
                        minWidth: 110,
                        sortable: 'custom',
                        render: (h, params) => {
                            return (
                                <div>￥{[params.row[params.column.key]]}</div>
                            );
                        }
                    },
                    {
                        title: '成为分销商时间',
                        key: 'become_time',
                        width: 140
                    },
                    {
                        title: '上级',
                        key: 'agent_id',
                        minWidth: 120,
                        render: (h, params) => {
                            if (params.row.agent_id == '0') {
                                return (
                                    <div>总店</div>
                                )
                            } else {
                                return (
                                    <div class="superior" onClick={() => {this.routerPage('vip-detail-agent',params.row.agent_id)}}>
                                        {params.row?.agentMember?.nickname || '-'}
                                    </div>
                                )
                            }
                        }
                    },
                    {
                        title: '下线总数',
                        key: 'commission_child',
                        width: 100,
                        render: (h, params) => {
                            return (
                                <div class="commission-child" onClick={() => {this.routerPage('relation',params.row.member_id)}}>
                                    {params.row[params.column.key]}
                                </div>
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        render: (h, params) => {
                            return (
                                <div class="action">
                                    <Button disabled={this.noManagePerm} type="text" onClick={() => {
                                        this.routerPage('vip-detail',params.row.member_id)
                                    }}>详情</Button>
                                    <Button disabled={this.noManagePerm} type="text" onClick={() => {
                                        this.routerPage('agent-order',params.row.member_id)
                                    }}>分销订单</Button>
                                    <Button disabled={this.noManagePerm} type="text" onClick={() => {
                                        this.setStatus(params.row.member_id, '-2');
                                    }}>取消分销商资格</Button>
                                </div>
                            );
                        }
                    }
                ],
            };
        },
        methods: {
            setStatus(id, status) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否取消该分销商资格?',
                    onOk: () => {
                        this.$api.commissionApi.setToAuditStatus({member_id: id, status})
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('分销商取消操作成功');
                                    this.$emit('on-refresh')
                                }
                            });
                    }
                });
            },
            changePage(page) {
                this.$emit('on-page-change', page);
            },
            // 排序
            changeSort({key, order}) {
                if (order === 'normal') {
                    this.$emit('on-sort', {});
                } else {
                    this.$emit('on-sort', {sort: key, by: order});
                }
            },
            reset() {
                this.$refs['page'].reset();
            },
            // 跳转页面
            routerPage(type, id) {
                if (type === 'vip-detail') {
                    this.$utils.openNewWindowPage(`/member/detail`,{id: id});
                } else if (type === 'vip-detail-agent') {// 分销商
                    this.$utils.openNewWindowPage(`/member/detail`,{id: id});
                } else if (type === 'relation') {
                    this.$router.push({
                        path: `/commission/relation?id=${id}`
                    })
                } else if (type === 'agent-order') { // 分销订单
                    this.$utils.openNewWindowPage(`/commission/order/list`,{
                        member_id: id,
                        member_type: '1',
                    });
                    // this.$utils.openNewWindowPage(`/commission/order/list`,{keyword: id});
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .good-list-table-list {
        /deep/.ivu-table {
            td {
                // 会员
                .vip {
                    display: flex;
                    flex-wrap: nowrap;

                    > .vip-image {
                        width: 46px;
                        height: 46px;
                        border-radius: 100%;
                        border: 1px solid $border-color;
                        box-sizing: border-box;
                        overflow: hidden;
                        flex-shrink: 0;

                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    > .vip-content {
                        padding-left: 10px;
                        width: 0;
                        flex: 1;

                        > .vip-name {
                            padding-bottom: 10px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: $brand-color;
                            cursor: pointer;
                        }

                        > .vip-platform {
                            > .icon {
                                font-size: 18px;
                                margin-right: 10px;
                                vertical-align: middle;
                            }

                            .icon-weixin {
                                color: $success-color;
                            }
                            .icon-weixinxiaochengxu {
                                color: #677DE0;
                            }
                            .icon-toutiaoxiaochengxu {
                                color: #239BFF;
                            }

                            .icon-zhifubaoxiaochengxu {
                                color: #2094E7;
                            }

                            .icon-baiduxiaochengxu {
                                color: #306CFF;
                            }

                            .icon-H {
                                color: #FF6004;
                            }
                        }
                    }
                }

                // 分销商等级
                .vip-grade {
                    display: flex;
                    flex-wrap: nowrap;
                    .icon {
                        flex-shrink: 0;
                        .svg-icon {
                            font-size: 20px;
                            padding-right: 4px;
                            vertical-align: bottom;
                        }
                    }
                    .text {
                        width: 0;
                        flex: 1;
                    }
                }
                // 累计佣金
                .commission-total {
                    color: $brand-color;
                }
                // 已提现佣金
                .commission-pay {
                    color: $brand-color;
                }
                // 上级
                .superior {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: $brand-color;
                    cursor: pointer;
                }
                // 下线总数
                .commission-child {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: $brand-color;
                    cursor: pointer;
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
