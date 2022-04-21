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
// 评价助手
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '评价助手',
        component: Layout,
        path: '/commentHelper/comment/list',
        perm: '',
        children: [
            {
                name: '商品评价库',
                path: '/commentHelper/comment/list',
                perm: 'commentHelper.index.view',
                component: () =>
                    import( /* webpackChunkName: "commentHelperChunk" */ '@/views/commentHelper/comment/list.vue'),
            },
            {
                name: '评价列表',
                path: '/commentHelper/comment/single/list',
                perm: 'commentHelper.index.view',
                component: () =>
                    import( /* webpackChunkName: "commentHelperChunk" */ '@/views/commentHelper/comment/single/list.vue'),
            },
            {
                name: '创建评价',
                path: '/commentHelper/comment/single/index',
                perm: 'commentHelper.index.manage',
                component: () =>
                    import( /* webpackChunkName: "commentHelperChunk" */ '@/views/commentHelper/comment/single/index.vue'),
            },
            {
                name: '编辑评价',
                path: '/commentHelper/comment/single/edit',
                perm: 'commentHelper.index.view',
                component: () =>
                    import( /* webpackChunkName: "commentHelperChunk" */ '@/views/commentHelper/comment/single/edit.vue'),
            },
            {
                name: '基础设置',
                path: '/commentHelper/set/index',
                perm: 'commentHelper.setting.manage',
                component: () =>
                    import( /* webpackChunkName: "commentHelperChunk" */ '@/views/commentHelper/set/index.vue'),
            },
        ]    
    },
]
