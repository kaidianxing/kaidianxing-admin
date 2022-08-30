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
// 秒杀抢购
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '统计数据',
        component: Layout,
        path: '/creditShop',
        perm: '',
        children: [
            {
                name: '统计数据',
                path: '/creditShop/statistics/index',
                perm: '',
                component: () =>
                        import(/* webpackChunkName: "creditShopChunk" */'@/views/creditShop/statistics/index.vue'),
            },
            {
                name: '积分商品',
                path: '/creditShop/goods/list',
                perm: 'creditShop.list.view',
                component: () =>
                        import(/* webpackChunkName: "creditShopChunk" */'@/views/creditShop/goods/list.vue'),
            },
            {
                name: '添加积分商品',
                path: '/creditShop/goods/index',
                perm: 'creditShop.list.manage',
                component: () =>
                        import(/* webpackChunkName: "creditShopChunk" */'@/views/creditShop/goods/index.vue'),
            },
            {
                name: '基础设置',
                path: '/creditShop/setting/index',
                perm: 'creditShop.setting.manage',
                component: () =>
                        import(/* webpackChunkName: "creditShopChunk" */'@/views/creditShop/setting/index.vue'),
            },
        ]
    },
]
