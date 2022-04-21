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
        name: '小程序直播',
        component: Layout,
        path: '/liver',
        perm: '',
        children: [
            // 小程序直播
            {
                name: '直播间管理',
                path: '/liver/manage/list',
                perm: 'broadcast.manage',
                component: () => import(/* webpackChunkName: "broadcastChunk" */ '@/views/liver/manage/list.vue')
            },
            {
                name: '创建直播间',
                path: '/liver/manage/list/create',
                perm: 'broadcast.manage',
                component: () => import(/* webpackChunkName: "broadcastChunk" */'@/views/liver/manage/create.vue')
            },
            {
                name: '商品库',
                path: '/liver/goods/list/:status',
                perm: 'broadcast.manage',
                component: () => import(/* webpackChunkName: "broadcastChunk" */ '@/views/liver/goods/list.vue')
            },
            {
                name: '销售分析',
                path: '/liver/analyse/sale',
                perm: 'broadcast.manage',
                component: () => import(/* webpackChunkName: "broadcastChunk" */ '@/views/liver/analyse/sale.vue')
            },
            {
                name: '商品销售分析', 
                path: '/liver/analyse/rank',
                perm: 'broadcast.manage',
                component: () => import(/* webpackChunkName: "broadcastChunk" */ '@/views/liver/analyse/rank.vue')
            },
            {
                name: '运营资源', 
                path: '/liver/action/operate',
                perm: 'broadcast.manage',
                component: () => import(/* webpackChunkName: "broadcastChunk" */ '@/views/liver/action/operate.vue')
            },
            {
                name: '详情', 
                path: '/liver/action/detail',
                perm: 'broadcast.manage',
                component: () => import(/* webpackChunkName: "broadcastChunk" */ '@/views/liver/action/detail.vue')
            }
        ] 
    },
]
