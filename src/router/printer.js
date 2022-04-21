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
// 打印小票
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '打印小票',
        component: Layout,
        path: '/printer/manage/list',
        perm: '',
        children: [
            {
                name: '打印机管理',
                path: '/printer/manage/list',
                perm: 'printer.index.manage',
                component: () => import(/* webpackChunkName: "printerChunk" */ '@/views/printer/manage/list.vue')
            },
            {
                name: '添加打印机',
                path: '/printer/manage/:type',
                perm: 'printer.index.manage',
                component: () => import(/* webpackChunkName: "printerChunk" */ '@/views/printer/manage/index.vue')
            },
            {
                name: '模板管理',
                path: '/printer/template/list',
                perm: 'printer.template.manage',
                component: () => import(/* webpackChunkName: "printerChunk" */ '@/views/printer/template/list.vue')
            },
            {
                name: '添加模板',
                path: '/printer/template/:type',
                perm: 'printer.template.manage',
                component: () => import(/* webpackChunkName: "printerChunk" */ '@/views/printer/template/index.vue')
            },
            {
                name: '打印任务',
                path: '/printer/task/list',
                perm: 'printer.task.manage',
                component: () => import(/* webpackChunkName: "printerChunk" */ '@/views/printer/task/list.vue')
            },
            {
                name: '添加任务',
                path: '/printer/task/:type',
                perm: 'printer.task.manage',
                component: () => import(/* webpackChunkName: "printerChunk" */ '@/views/printer/task/index.vue')
            }
        ]
    },
]