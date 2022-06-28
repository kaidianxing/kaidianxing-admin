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
// 一键发圈
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '一键发圈',
        component: Layout,
        path: '/material/list',
        perm: '',
        children: [
            {
                name: '素材管理',
                path: '/material/list',
                perm: "material.index.view",
                component: () =>
                        import('@/views/material/list/index.vue'),
            },
            {
                name: '添加素材',
                path: '/material/add',
                perm: "material.index.view",
                meta: {
                    type: 'add'
                },
                component: () =>
                        import('@/views/material/add/index.vue'),
            },
            {
                name: '编辑素材',
                path: '/material/edit',
                perm: "material.index.view",
                meta: {
                    type: 'edit'
                },
                component: () =>
                        import('@/views/material/add/index.vue'),
            },
            {
                name: '基础设置',
                path: '/material/settings',
                perm: "material.setting.view",
                component: () =>
                        import('@/views/material/settings/index.vue'),
            },
        ]
    }
    ]
