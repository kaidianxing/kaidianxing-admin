/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 

import Layout from '@/views/layout/index.vue'

export default [
    {    name: '拼团',
        component: Layout,
        path: '/groups/activity/list',
        perm: '',
        children: [
            {
                name: '拼团',
                path: '/groups/activity/list',
                perm: 'groups.view',
                component: () => import('@/views/groups/activity/list/index.vue')
            },
            {
                name: '拼团',
                path: '/groups/activity/index',
                perm: 'groups.manage',
                component: () =>
                        import('@/views/groups/activity/index/index.vue'),
            },
            {
                name: '团订单',
                path: '/groups/order/list',
                perm: '',
                component: () =>
                        import('@/views/groups/order/list/index.vue'),
            },
            {
                name: '团订单详情',
                path: '/groups/order/detail',
                perm: '',
                component: () =>
                        import('@/views/groups/order/detail/index.vue'),
            },
            {
                name: '消息通知',
                path: '/groups/message/list',
                perm: 'groups_message.manage',
                component: () =>
                        import('@/views/groups/message/list.vue'),
            },
            {
                name: '编辑消息通知',
                path: '/groups/message/index',
                perm: 'groups_message.manage',
                component: () =>
                        import('@/views/groups/message/index.vue'),
            },
            {
                name: '拼团设置',
                path: '/groups/set/index',
                perm: 'groups_setting.manage',
                component: () =>
                        import('@/views/groups/set/index'),
            },
            {
                name: '统计数据',
                path: '/groups/activityData/index',
                perm: 'groups_statistics.manage',
                component: () =>
                        import('@/views/groups/activityData/index'),
            }
        ]
    }

]
