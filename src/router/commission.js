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
// 分销
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '分销',
        component: Layout,
        path: '/commission',
        perm: '',
        children: [
            {
                name: '分销订单',
                path: '/commission/order/list',
                perm: 'commission.order.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/order/list.vue')
            },
            {
                name: '分销概览',
                path: '/commission/index',
                perm: 'commission.index.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/overview/index.vue')
            },
            {
                name: '分销设置',
                path: '/commission/settings',
                perm: 'commission.settings.commission.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/settings.vue')
            },
            {
                name: '提现管理',
                path: '/commission/withdraw/list/:status',
                perm: 'commission.apply.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/withdraw/list.vue')
            },
            {
                name: '提现详情',
                path: '/commission/withdraw/detail',
                perm: 'commission.apply.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/withdraw/detail.vue')
            },
            {
                name: '结算设置',
                path: '/commission/settlementSettings',
                perm: 'commission.settings.settlement.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/settlementSettings.vue')
            },
            {
                name: '其他设置',
                path: '/commission/otherSettings',
                perm: 'commission.settings.other.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/otherSettings.vue')
            },
            {
                name: '排行榜设置',
                path: '/commission/rankSettings',
                perm: 'commission.settings.rank.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/rankSettings.vue')
            },
            {
                name: '通知设置',
                path: '/commission/noticeSettings',
                perm: '',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/noticeSettings.vue')
            },
            {
                name: '分销商品',
                path: '/commission/goodsList',
                perm: 'commission.goods.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/goodsList.vue')
            },
            {
                name: '全部分销商',
                path: '/commission/distributor',
                perm: 'commission.agent.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/distributor/index.vue')
            },
            {
                name: '分销关系',
                path: '/commission/relation',
                perm: '',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/relation/index.vue')
            },
            {
                name: '分销等级',
                path: '/commission/grade',
                perm: 'commission.level.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/grade/index.vue')
            },
            {
                name: '新增等级',
                path: '/commission/grade/:type',
                perm: 'commission.level.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/grade/add/index.vue')
            },
            {
                name: '消息通知',
                path: '/commission/message/list',
                perm: 'commission.level.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/message/list.vue')
            },
            {
                name: '编辑通知信息 ',
                path: '/commission/message/index',
                perm: 'commission.level.view',
                component: () => import(/* webpackChunkName: "commissionChunk" */ '@/views/commission/message/index.vue')
            }
        ],
    },
]