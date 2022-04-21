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
// 购物奖励
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '购物奖励',
        component: Layout,
        path: '/shoppingReward',
        perm: '',
        children: [
            {
                name: '活动管理',
                path: '/shoppingReward/activity/index',
                perm: 'shoppingReward.manage',
                component: () =>
                    import(/* webpackChunkName: "shoppingRewardChunk" */ '@/views/shoppingReward/activity/index.vue'),
            },
            {
                name: '添加活动',
                path: '/shoppingReward/activity/:type',
                perm: 'shoppingReward.manage',
                component: () =>
                    import(/* webpackChunkName: "shoppingRewardChunk" */ '@/views/shoppingReward/activity/add.vue'),
            },
            {
                name: '领取记录',
                path: '/shoppingReward/log/index',
                perm: 'shoppingReward.manage',
                component: () =>
                    import(/* webpackChunkName: "shoppingRewardChunk" */ '@/views/shoppingReward/log/index.vue'),
            },
        ]
    },
]
