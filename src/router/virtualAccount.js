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
/***
 * 虚拟卡密
 * */// 分销
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '卡密库',
        component: Layout,
        path: '/virtualAccount',
        perm: '',
        children: [
            {
                name: '卡密库',
                path: '/virtualAccount/library/list',
                perm: 'virtualAccount.index.view',
                component: () =>
                        import(/* webpackChunkName: "virtualAccountChunk" */'@/views/virtualAccount/library/list.vue'),
            },
            {
                name: '创建卡密库',
                path: '/virtualAccount/library/:type',
                perm: 'virtualAccount.index.manage',
                component: () =>
                        import(/* webpackChunkName: "virtualAccountChunk" */'@/views/virtualAccount/library/index.vue'),
            },
            {
                name: '添加卡密数据',
                path: '/virtualAccount/library/data/index',
                perm: 'virtualAccountData.index.manage',
                component: () =>
                        import(/* webpackChunkName: "virtualAccountChunk" */'@/views/virtualAccount/library/data/index.vue'),
            },
            {
                name: '查看卡密数据',
                path: '/virtualAccount/library/data/list',
                perm: 'virtualAccountData.index.view',
                component: () =>
                        import(/* webpackChunkName: "virtualAccountChunk" */'@/views/virtualAccount/library/data/list.vue'),
            },
            {
                name: '设置',
                path: '/virtualAccount/set/index',
                perm: 'virtualAccount.setting.view',
                component: () =>
                        import(/* webpackChunkName: "virtualAccountChunk" */'@/views/virtualAccount/set/index.vue'),
            },
            {
                name: '回收站',
                path: '/virtualAccount/recycle/index',
                perm: 'virtualAccount.recycleBin.view',
                component: () =>
                        import(/* webpackChunkName: "virtualAccountChunk" */'@/views/virtualAccount/recycle/index.vue'),
            }
        ],
    },
]
