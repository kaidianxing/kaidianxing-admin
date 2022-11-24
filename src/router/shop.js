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

import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '布局',
        path: '/shop',
        perm: '',
        component: Layout,
        children: [
            {
                name: '店铺列表',
                path: '/shop/list/:id',
                perm: 'diypage.page.list.view',
                component: () => import('@/views/shop/systemPage/index.vue')
            },
            {
                name: '模板管理',
                path: '/shop/module/:type',
                perm: '',
                component: () => import('@/views/shop/templateManager/index.vue')
            },
            {
                name: '菜单设置',
                path: '/shop/setting/menu',
                perm: '',
                component: () => import('@/views/shop/menuSetting/index.vue')
            },
            {
                name: '主题色',
                path: '/shop/setting/theme',
                perm: '',
                component: () => import('@/views/shop/themeSetting/index.vue')
            },
            {
                name: '素材库',
                path: '/shop/material/index',
                perm: '',
                component: () => import('@/views/shop/material/index.vue')
            },
            {
                name: '自定义菜单',
                path: '/shop/custom-menu',
                perm: '',
                component: () => import('@/views/shop/customMenu/index.vue')
            },
            {
                name: '主题色',
                path: '/shop/theme/index',
                perm: '',
                component: () => import('@/views/shop/theme/index.vue')
            },
            {
                name: '其他功能',
                path: '/shop/other-funcs/:id',
                perm: '',
                component: () => import('@/views/shop/otherFuncs/index.vue')
            },
            {
                name: '应用模板',
                path: '/shop/app-mould',
                perm: '',
                component: () => import('@/views/shop/appTemplatePage/index.vue')
            },
        ]
    },
    {
        name: '装修',
        path: '/decorate',
        perm:($route,$store)=>20 !== +$store?.state?.account?.shop?.shopType,
        component: () => import('@/views/layout/decorate.vue'),
        children: [
            {
                name: '装修页面',
                path: '/decorate/:page',
                perm: '',
                component: () => import('@/views/shop/decoratePage/page/index.vue')
            },
            {
                name: '装修海报',
                path: '/decorate/poster/:page',
                perm: '',
                component: () => import('@/views/shop/decoratePage/poster/index.vue')
            }
        ]
    }
];
