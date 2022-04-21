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
// 表单
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '系统表单',
        component: Layout,
        path: '/systemForm/list',
        perm: '',
        children: [
            {
                name: '新增系统表单',
                path: '/systemForm/add',
                perm: '',
                component: () =>
                    import(/* webpackChunkName: "systemFormChunk" */ '@/views/form/systemForm/index.vue'),
            },
            {
                name: '编辑系统表单',
                path: '/systemForm/edit',
                perm: '',
                component: () =>
                    import(/* webpackChunkName: "systemFormChunk" */ '@/views/form/systemForm/index.vue'),
            },
            {
                name: '表单列表',
                path: '/systemForm/list',
                perm: '',
                component: () => import(/* webpackChunkName: "systemFormChunk" */ '@/views/form/systemForm/list/index.vue')
            },
            {
                name: '表单详情',
                path: '/systemForm/detail/:type',
                perm: '',
                component: () => import(/* webpackChunkName: "systemFormChunk" */ '@/views/form/systemForm/detail/index.vue')
            }
        ]
    },
]
