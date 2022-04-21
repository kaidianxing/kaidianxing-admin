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
import $store from '@/store'
/**
 * vuex的配置
 *
 */
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '运营',
        path: '/',
        redirect: '/home/index/index',
    },
    {
        name: '运营',
        path: '/home',
        perm: '',
        component: Layout,
        children: [
            {
                name: '运营',
                path: '/home/index/index',
                perm: '',
                show:false,
                component: () => import('@/views/home/index/index.vue'),
            },
            {
                name: '交易分析',
                component: () => import('@/views/home/transaction/index.vue'),
                perm: 'statistics.trade.view',
                path: '/home/transaction'
            },
            {
                name: '商品数据',
                component: () => import('@/views/home/goods/index.vue'),
                perm: 'statistics.goods.view',
                path: '/home/goods'
            },
            {
                name: '渠道管理',
                component: () => import('@/views/home/manage/index.vue'),
                perm: () => ["channel.wap.view", "channel.wechat.view", "channel.wxapp.manage", "channel.byteDance.manage"].some(item =>
                        $store.state.config.user?.perms?.indexOf(item) > -1
                ),
                path: '/home/manage',
            },

            // {
            //     name: '自定义菜单',
            //     component: () => import('@/views/home/public/lib/index.vue'),
            //     perm: "",
            //     path: '/home/public/lib',
            // },
            // {
            //     name: "自定义菜单",
            //     component: () => import('@/views/home/public/lib/menu.vue'),
            //     perm: "",
            //     path: "/home/public/lib/menu",
            // },
            // {
            //     name: "素材",
            //     component: () => import('@/views/home/public/lib/source.vue'),
            //     perm: "",
            //     path: "/home/lib/:type",
            // },
            {
                name: '公众号配置',
                component: () => import('@/views/home/wechat/config/index.vue'),
                // perm: 'channel.registry.view',
                path: '/home/wechat/config/achieve',
            },
            {
                name: '公众号配置',
                component: () => import('@/views/home/wechat/config/index.vue'),
                // perm: 'channel.registry.view',
                path: '/home/wechat/config/not',
            },
            {
                name: '公众号设置',
                component: () => import('@/views/home/wechat/config/settings/index.vue'),
                // perm: 'channel.registry.view',
                path: '/home/wechat/config/settings',
            },


        ],
    },
    {
        name: '商城已关闭',
        path: '/close',
        perm: '',
        component: ()=> import('@/views/home/index/close.vue')
    }
]
