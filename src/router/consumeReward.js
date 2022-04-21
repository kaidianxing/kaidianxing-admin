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
// 消费奖励
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '消费奖励',
        component: Layout,
        path: '/rechargeReward',
        perm: '',
        children: [
            {
                name: '活动管理',
                path: '/consumeReward/activity/list',
                perm: 'consumeReward.manage',
                component: () =>
                    import( /* webpackChunkName: "consumeRewardChunk" */'@/views/consumeReward/activity/list.vue'),
            },
            {
                name: '消费奖励',
                path: '/consumeReward/activity/index',
                perm: 'consumeReward.manage',
                component: () =>
                    import( /* webpackChunkName: "consumeRewardChunk" */'@/views/consumeReward/activity/index.vue'),
            },
            {
                name: '领取记录',
                path: '/consumeReward/log/list',
                perm: 'consumeReward.manage',
                component: () =>
                    import( /* webpackChunkName: "consumeRewardChunk" */'@/views/consumeReward/log/list.vue'),
            },
        
        ]        
    },
]