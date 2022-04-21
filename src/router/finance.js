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
/**
 * vue-router配置，
 * 最终会被展开合并进入./index.js
 */

/**
 * vuex的配置
 *
 */
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '财务',
        path: '/finance',
        perm: '',
        component: Layout,
        children: [
            {
                name: '充值记录',
                path: '/finance/rechargeRecord/index',
                perm: 'finance.recharge.view',
                component: () =>
                    import('@/views/finance/rechargeRecord/index.vue')
            },
            {
                name: '余额提现',
                path: '/finance/withdrawalApplication/index',
                perm: 'finance.withdraw.view',
                component: () =>
                    import('@/views/finance/withdrawalApplication/index.vue')
            },
            {
                name: '推广佣金提现',
                path: '/finance/extensionWithdrawal/index',
                perm: 'merchant_finance.commission.view',
                component: () =>
                    import('@/views/finance/extensionWithdrawals/index.vue')
            },
            
            {
                name: '积分明细',
                path: '/finance/pointsDetails/index',
                perm: 'finance.credit.view',
                component: () =>
                    import('@/views/finance/pointsDetails/index.vue')
            },
            {
                name: '余额明细',
                path: '/finance/balanceDetails/index',
                perm: 'finance.balance.view',
                component: () =>
                    import('@/views/finance/balanceDetails/index.vue')
            },
            {
                name: '红包明细',
                path: '/finance/redpacketDetails/index',
                perm: 'finance.red_package.view',
                component: () =>
                    import('@/views/finance/redpacketDetails/index.vue')
            },
            {
                name: '对账单',
                path: '/finance/bill/index',
                perm: '',
                component: () => import('@/views/finance/bill/index.vue')
            },
            {
                name: '退款记录',
                path: '/finance/refundRecord/index',
                perm: 'finance.refund_log.view',
                component: () =>
                    import('@/views/finance/refundRecord/index.vue')
            },
        ]
    }
]
