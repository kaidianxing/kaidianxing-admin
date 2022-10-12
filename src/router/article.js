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
// 文章营销
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '文章营销',
        component: Layout,
        path: '/article/article/list',
        perm: '',
        children: [
            {
                name: '专题文章',
                path: '/article/article/list',
                perm: "article.article.view",
                component: () => import('@/views/article/article/list/index.vue'),
            },
            {
                name: '文章统计',
                path: '/article/article/statistics',
                perm: "article.article.view",
                component: () =>
                    import('@/views/article/article/statistics/index.vue'),
            },
            {
                name: '新增文章',
                path: '/article/article/add',
                perm: "article.article.manage",
                component: () =>
                    import('@/views/article/article/add/index.vue'),
            },
            {
                name: '编辑文章',
                path: '/article/article/edit',
                perm: "article.article.view",
                component: () =>
                    import('@/views/article/article/add/index.vue'),
            },
            {
                name: '分组管理',
                path: '/article/group',
                perm: "article.group.view",
                component: () =>
                    import('@/views/article/group/index.vue'),
            },
            {
                name: '基础设置',
                path: '/article/settings',
                perm: "article.settings.view",
                component: () =>
                    import('@/views/article/settings/index.vue'),
            },
        ]
    }
]
