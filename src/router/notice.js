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
// 消息通知
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '消息通知',
        component: Layout,
        path: '/notice',
        perm: '',
        children: [
            {
                name: '编辑通知信息',
                path: '/notice/buyer/:type/index',
                perm: 'notice.manage',
                component: () => import(/* webpackChunkName: "noticeChunk" */ '@/views/notice/buyer/index.vue')
            },
            {
                name: '基础通知',
                path: '/notice/buyer/:type',
                perm: 'notice.manage',
                component: () => import(/* webpackChunkName: "noticeChunk" */ '@/views/notice/buyer/list.vue')
            },
            {
                name: '卖家通知',
                path: '/notice/seller/list',
                perm: 'notice.manage',
                component: () => import(/* webpackChunkName: "noticeChunk" */ '@/views/notice/seller/list.vue')
            },
            {
                name: '编辑通知信息',
                path: '/notice/seller/seller_notice/index',
                perm: 'notice.manage',
                component: () => import(/* webpackChunkName: "noticeChunk" */ '@/views/notice/seller/index.vue')
            },
            {
                name: '微信模板',
                path: '/notice/wxappTemplate/list',
                perm: 'notice.manage',
                component: () => import(/* webpackChunkName: "noticeChunk" */ '@/views/notice/wxappTemplate/list.vue')
            },
            {
                name: '编辑微信模板',
                path: '/notice/wxappTemplate/index',
                perm: 'notice.manage',
                component: () => import(/* webpackChunkName: "noticeChunk" */ '@/views/notice/wxappTemplate/index.vue')
            },
            {
                name: '短信模板',
                path: '/notice/smsTemplate/list',
                perm: 'notice.manage',
                component: () => import(/* webpackChunkName: "noticeChunk" */ '@/views/notice/smsTemplate/list.vue')
            },
            {
                name: '短信模板',
                path: '/notice/smsTemplate/:type',
                perm: 'notice.manage',
                component: () => import(/* webpackChunkName: "noticeChunk" */ '@/views/notice/smsTemplate/index.vue')
            },
            {
                name: '邮箱设置',
                path: '/notice/email/index',
                perm: 'notice.manage',
                component: () => import(/* webpackChunkName: "noticeChunk" */ '@/views/notice/email/index.vue')
            },
            {
                name: '短信设置',
                path: '/notice/smsSttings',
                perm: 'notice.manage',
                component: () => import(/* webpackChunkName: "noticeChunk" */ '@/views/notice/smsTemplate/smsSttings.vue')
            }
        ]
    },
]
