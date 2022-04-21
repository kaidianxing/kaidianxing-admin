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
export default {
    title: '分销',
    name: '分销',
    show: false,
    path: '/commission/index',
    perm:'',
    children: {
        commissionOverview: {
            title: '分销概览',
            name: '分销概览',
            path: '/commission/index',
            perm:'commission.index.view'
        },
        commissionManagement: {
            title: '全部分销商',
            name: '全部分销商',
            path: '/commission/distributor',
            pluginName: 'commission',
            perm:'commission.agent.view',
            children: {
                relation: {
                    title: '分销关系',
                    name: '分销关系',
                    path: '/commission/relation',
                    pluginName: 'commission',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                    perm:'commission.agent.view',
                }
            }
        },
        commissionLevel: {
            title: '分销等级',
            name: '分销等级',
            path: '/commission/grade',
            pluginName: 'commission',
            perm:'commission.level.view',
            children: {
                addCommissionLevel: {
                    title: '添加等级',
                    name: '添加等级',
                    path: '/commission/grade/add',
                    pluginName: 'commission',
                    perm:'commission.level.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
                editCommissionLevel: {
                    title: '修改等级',
                    name: '修改等级',
                    path: '/commission/grade/edit',
                    pluginName: 'commission',
                    perm:'commission.level.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                }
            }
        },
        commissionGoods: {
            title: '分销商品',
            name: '分销商品',
            path: '/commission/goodsList',
            perm:'commission.goods.view',
        },
        commissionOrders: {
            title: '分销订单',
            name: '分销订单',
            path: '/commission/order/list',
            perm:'commission.order.view',
        },
        withDrawManagement: {
            title: '提现管理',
            name: '提现管理',
            path: '/commission/withdraw/list/waiting',
            perm:'commission.apply.view',
            children: {
                waiting: {
                    title: '待审核',
                    name: '待审核',
                    path: '/commission/withdraw/list/waiting',
                    perm:'commission.apply.view',
                },
    
                paying: {
                    title: '待打款',
                    name: '待打款',
                    path: '/commission/withdraw/list/paying',
                    perm:'commission.apply.view',
                },
    
                payed: {
                    title: '已打款',
                    name: '已打款',
                    path: '/commission/withdraw/list/payed',
                    perm:'commission.apply.view',
                },
    
                invalid: {
                    title: '无效',
                    name: '无效',
                    path: '/commission/withdraw/list/invalid',
                    perm:'commission.apply.view',
                },
            }
        },
        withDrawDetail: {
            title: '提现详情',
            name: '提现详情',
            path: '/commission/withdraw/detail',
            perm:'commission.apply.view',
            pluginName: 'commission',
            show: false,
            showSubMenu:true,
            showBackBtn:true,
        },
        commissionSettings: {
            title: '分销设置',
            name: '分销设置',
            path: '/commission/settings',
            perm:'commission.settings.commission.view',
            children: {
                setting: {
                    title: '分销设置',
                    name: '分销设置',
                    path: '/commission/settings',
                    perm:'commission.settings.commission.view',
                },
    
                settlement: {
                    title: '结算设置',
                    name: '结算设置',
                    path: '/commission/settlementSettings',
                    perm:'commission.settings.settlement.view',
                },
            }
        },
        baseSettings: {
            title: '基础设置',
            name: '基础设置',
            path: '/commission/otherSettings',
            perm:'',
            children: {
                others: {
                    title: '其它设置',
                    name: '其它设置',
                    path: '/commission/otherSettings',
                    perm:'commission.settings.other.view',
                },
                rank: {
                    title: '排行榜设置',
                    name: '排行榜设置',
                    path: '/commission/rankSettings',
                    perm:'commission.settings.rank.view',
                },
                // notice: {
                //     title: '通知设置',
                //     name: '通知设置',
                //     path: '/commission/noticeSettings',
                //     perm:'',
                // },
            }
        },
        commissionMessage: {
            title: '消息通知',
            name: '消息通知',
            path: '/commission/message/list',
            perm: 'commission.goods.view',
            children: {
                editMessage: {
                    title: '编辑通知信息 ',
                    name: '编辑通知信息 ',
                    path: '/commission/message/index',
                    perm: 'commission.settings.other.view',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                }
            }
        },
    }
}
