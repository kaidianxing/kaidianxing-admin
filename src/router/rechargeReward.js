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
// 充值奖励
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '充值奖励',
        component: Layout,
        path: '/rechargeReward',
        perm: '',
        children: [
            {
                name: '活动管理',
                path: '/rechargeReward/activity/index',
                perm: 'rechargeReward.manage',
                component: () =>
                    import(/* webpackChunkName: "rechargeRewardChunk" */'@/views/rechargeReward/activity/index.vue'),
            },
            {
                name: '添加活动',
                path: '/rechargeReward/activity/:type',
                perm: 'rechargeReward.manage',
                component: () =>
                    import(/* webpackChunkName: "rechargeRewardChunk" */'@/views/rechargeReward/activity/add.vue'),
            },
            {
                name: '领取记录',
                path: '/rechargeReward/log/index',
                perm: 'rechargeReward.manage',
                component: () =>
                    import(/* webpackChunkName: "rechargeRewardChunk" */'@/views/rechargeReward/log/index.vue'),
            },
        ]
    },
]
