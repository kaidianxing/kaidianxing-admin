
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
