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

/**
 * vuex的配置
 *
 */
// {
//     name: 'layout',//左侧菜单中名称
//     path: '/layout', //路由规则
//     components: () => import('../views/Home.vue'),//路由懒加载
//     meta: {//路由元数据

//     },
//     children: [//子路由
//         // {
//         //     name: '待发货',
//         //     expand: true,//是否可以展开
//         //     path: '/test', //路由匹配规则，/开头为绝对路径(/test)，否则为相对父路径的路径('test')=>(/goods/test)
//         //     meta: {//路由元数据
//         //     },
//         //     components: () => import('../views/Test.vue'),
//         //     beforeEnter: (to, from, next) => {//可以不加
//         //         next();
//         //     }
//         // }
//     ]
// }
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '商品',
        path: '/goods',
        component: Layout,
        perm: '',
        children: [
            {
                name: '商品列表',
                perm: 'goods.index.view',
                path: '/goods/list/:id',//此处加（.*）是为了解决面包屑对于同一path的查找深度最浅的问题
                component: () => import('@/views/goods/list/index.vue'),
                meta:{
                    timestamp:true
                }
            },
            {
                name: '添加商品',
                perm: 'goods.index.manage',

                path: '/goods/add',
                component: () => import('@/views/goods/add/index.vue')
            },
            {
                name: '商品分类',
                path: '/goods/classify',
                perm: 'goods.category.view',
                component: () => import('@/views/goods/classify/index.vue')
            },
            {
                name: '广告设置',
                path: '/goods/classify/setting-ad',
                perm: 'goods.category.manage',
                component: () => import('@/views/goods/classify/settingAd/index.vue')
            },
            {
                name: '设置分类层级',
                path: '/goods/classify/setting-level',
                perm: 'goods.category.manage',
                component: () => import('@/views/goods/classify/settingLevel/index.vue')
            },
            {
                name: '商品组',
                path: '/goods/group',
                perm: '',
                component: () => import('@/views/goods/group/index.vue'),
                meta:{
                    timestamp:true
                }
            },
            {
                name: '添加商品组',
                path: '/goods/group/:id',
                perm: 'goods.group.manage',
                component: () => import('@/views/goods/group/add/index.vue')
            },
            {
                name: '标签管理',
                path: '/goods/label',
                perm: 'goods.label_group.view',
                component: () => import('@/views/goods/label/index.vue'),
                meta:{
                    timestamp:true
                }
            },
            {
                name: '添加标签组',
                path: '/goods/label/:id',
                perm: 'goods.label_group.manage',
                component: () => import('@/views/goods/label/add/index.vue')
            }
        ]
    }
];
