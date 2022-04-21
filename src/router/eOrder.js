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
// 快递助手
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '快递助手',
        component: Layout,
        path: '/eOrder/orderPrint/index',
        perm: '',
        children: [
            {
                name: '订单打印',
                path: '/eOrder/orderPrint/index',
                perm: 'expressHelper.order.manage',
                component: () =>
                    import(/* webpackChunkName: "expressHelperChunk" */'@/views/eOrder/orderPrint/index.vue'),
            },
            {
                name: '电子面单',
                path: '/eOrder/templateManagement/eOrder/index',
                perm: 'expressHelper.express_template.view',
                component: () =>
                    import(/* webpackChunkName: "expressHelperChunk" */'@/views/eOrder/templateManagement/eOrder/index.vue'),
            },
            {
                name: '添加模板',
                path: '/eOrder/templateManagement/eOrder/:type',
                perm: 'expressHelper.express_template.manage',
                component: () =>
                    import(/* webpackChunkName: "expressHelperChunk" */'@/views/eOrder/templateManagement/eOrder/add.vue'),
            },
            {
                name: '发货单',
                path: '/eOrder/templateManagement/invoice/index',
                perm: 'expressHelper.express_template.view',
                component: () =>
                    import(/* webpackChunkName: "expressHelperChunk" */'@/views/eOrder/templateManagement/invoice/index.vue'),
            },
            {
                name: '添加模板',
                path: '/eOrder/templateManagement/invoice/:type',
                perm: 'expressHelper.express_template.manage',
                component: () =>
                    import(/* webpackChunkName: "expressHelperChunk" */'@/views/eOrder/templateManagement/invoice/add/index.vue'),
            },
            {
                name: '发件人',
                path: '/eOrder/templateManagement/sender/index',
                perm: 'expressHelper.consigner_template.view',
                component: () =>
                    import(/* webpackChunkName: "expressHelperChunk" */'@/views/eOrder/templateManagement/sender/index.vue'),
            },
            {
                name: '添加模板',
                path: '/eOrder/templateManagement/sender/:type',
                perm: 'expressHelper.consigner_template.manage',
                component: () =>
                    import(/* webpackChunkName: "expressHelperChunk" */'@/views/eOrder/templateManagement/sender/add.vue'),
            },
            {
                name: '基础设置',
                path: '/eOrder/basicSetting/index',
                perm: 'expressHelper.view',
                component: () =>
                    import(/* webpackChunkName: "expressHelperChunk" */'@/views/eOrder/basicSetting/index.vue'),
            },
        ]
    },
]
