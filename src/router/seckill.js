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
        name: '秒杀抢购',
        component: Layout,
        path: '/seckill',
        perm: '',
        children: [
            {
                name: '秒杀抢购',
                path: '/seckill/activity/list',
                perm: '',
                component: () => import(/* webpackChunkName: "seckillChunk" */'@/views/seckill/activity/list.vue')
            },
            {
                name: '秒杀抢购',
                path: '/seckill/activity/index',
                perm: '',
                component: () =>
                    import(/* webpackChunkName: "seckillChunk" */'@/views/seckill/activity/index.vue'),
            },
            {
                name: '统计数据',
                path: '/seckill/activityData/index',
                perm: 'seckill.statistics.view',
                component: () =>
                    import(/* webpackChunkName: "seckillChunk" */'@/views/seckill/activityData/index.vue'),
            },
            {
                name: '秒杀设置',
                path: '/seckill/set/index',
                perm: '',
                component: () =>
                    import(/* webpackChunkName: "seckillChunk" */'@/views/seckill/set/index.vue'),
            }
        ]
    },
]
