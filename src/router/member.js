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
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '会员',
        path: '/member',
        component: Layout,
        redirect: '/member/list',
        perm: 'member.list.view',
        children: [
            {
                name: '会员列表',//左侧菜单中名称
                path: '/member/list', //路由规则
                perm: 'member.list.view',
                meta:{
                    timestamp:true
                },
                component: () => import('../views/member/list/index.vue'),//路由懒加载
            },
            {
                name: '会员等级',
                path: '/member/grade/list',
                perm: 'member.level.view',
                meta:{
                    timestamp:true
                },
                component: () => import('../views/member/grade/list.vue')
            },
            {
                name: '添加会员等级',
                path: '/member/grade/:type',
                perm: 'member.level.manage',
                component: () => import('../views/member/grade/index.vue')
            },
            {
                name: '标签组',
                path: '/member/group/list',
                perm: '',
                meta:{
                    timestamp:true
                },
                component: () => import('../views/member/group/index.vue')
            },

            {
                name: '会员统计',
                component: () => import('@/views/member/member/index.vue'),
                perm: 'statistics.member.view',
                path: '/member/vip'
            },
            {
                name: '消费排行',
                component: () => import('@/views/member/consume/index.vue'),
                perm: 'statistics.member.view',
                path: '/member/consume'
            },
            {
                name: '设置',
                path: '/member/setting',
                perm: 'member.level_upgrade.view',
                component: () => import('../views/member/setting/index.vue')
            },
            {
                name: '会员详情',
                path: '/member/detail',
                perm: 'member.list.view',
                component: () => import('../views/member/detail/index.vue')
            },
        ]
    }
];
