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

import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '营销',
        component: Layout,
        path: '/market/full-mail',
        perm: '',
        children: [
            {
                name: '满额包邮',
                path: '/market/full-mail',
                perm: 'sale.basic.free.view',
                component: () => import('@/views/market/fullMail/index.vue')
            },
            {
                name: '全部优惠券',
                path: '/market/coupons/all(.*)',
                perm: 'sale.coupon-list.view',
                component: () => import('@/views/market/couponsAll/index.vue')
            },
            {
                name: '添加优惠券',
                path: '/market/coupons/base/:type',
                perm: 'sale.coupon-list.manage',
                component: () => import('@/views/market/addCoupons/index.vue')
            },
            {
                name: '其他设置',
                path: '/market/coupons/other-setting',
                perm: 'sale.coupon-set.view',
                component: () => import('@/views/market/otherSetting/index.vue')
            },
        ]
    }
];
