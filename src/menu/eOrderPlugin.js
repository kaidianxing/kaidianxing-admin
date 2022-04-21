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
export default {
    title: '快递助手',
    name: '快递助手',
    show: false,
    path: '/eOrder/orderPrint/index',
    perm:'',
    children: {
        orderPrint_eOrder: {
            title: '订单打印',
            name: '订单打印',
            path: '/eOrder/orderPrint/index',
            pluginName: 'expressHelper',
            perm: 'expressHelper.order.manage',
        },
        templateManagement_eOrder: {
            title: '模板管理',
            name: '模板管理',
            path: '/eOrder/templateManagement/index',
            pluginName: 'expressHelper',
            perm: '',
            children: {
                list_eOrder: {
                    title: '电子面单',
                    name: '电子面单',
                    path:
                        '/eOrder/templateManagement/eOrder/index',
                    pluginName: 'expressHelper',
                    perm: 'expressHelper.express_template.view',
                    show: true,
                    children: {
                        add_eOrder: {
                            title: '添加模板',
                            name: '添加模板',
                            path: '/eOrder/templateManagement/eOrder/add',
                            pluginName: 'expressHelper',
                            perm: 'expressHelper.express_template.manage',
                            show: false,
                            showSubMenu:true,
                            showBackBtn:true,
                        },
                        edit_eOrder: {
                            title: '编辑模板',
                            name: '编辑模板',
                            path:
                                '/eOrder/templateManagement/eOrder/edit',
                            pluginName: 'expressHelper',
                            perm: 'expressHelper.express_template.manage',
                            show: false,
                            showSubMenu:true,
                            showBackBtn:true,
                        },
                    },
                },
                list_invoice: {
                    title: '发货单',
                    name: '发货单',
                    path:
                        '/eOrder/templateManagement/invoice/index',
                    pluginName: 'expressHelper',
                    perm: 'expressHelper.express_template.view',
                    show: true,
                    children: {
                        add_eOrder: {
                            title: '添加模板',
                            name: '添加模板',
                            path:
                                '/eOrder/templateManagement/invoice/add',
                            pluginName: 'expressHelper',
                            perm: 'expressHelper.express_template.manage',
                            show: false,
                            showSubMenu:true,
                            showBackBtn:true,
                        },
                        edit_eOrder: {
                            title: '编辑模板',
                            name: '编辑模板',
                            path:
                                '/eOrder/templateManagement/invoice/edit',
                            pluginName: 'expressHelper',
                            perm: 'expressHelper.express_template.manage',
                            show: false,
                            showSubMenu: true,
                            showBackBtn: true,
                        },
                    },
                },
                list_sender: {
                    title: '发件人',
                    name: '发件人',
                    path:
                        '/eOrder/templateManagement/sender/index',
                    pluginName: 'expressHelper',
                    perm: 'expressHelper.consigner_template.view',
                    show: true,
                    children: {
                        add_sender: {
                            title: '添加模板',
                            name: '添加模板',
                            path:'/eOrder/templateManagement/sender/add',
                            pluginName: 'expressHelper',
                            perm: 'expressHelper.consigner_template.manage',
                            show: false,
                            showSubMenu:true,
                            showBackBtn:true,
                        },
                        edit_sender: {
                            title: '编辑模板',
                            name: '编辑模板',
                            path:
                                '/eOrder/templateManagement/sender/edit',
                            pluginName: 'expressHelper',
                            perm: 'expressHelper.consigner_template.manage',
                            show: false,
                            showSubMenu:true,
                            showBackBtn:true,
                        },
                    },
                },
            },
        },
        basicSetting_eOrder: {
            title: '基础设置',
            name: '基础设置',
            path: '/eOrder/basicSetting/index',
            pluginName: 'expressHelper',
            perm: 'expressHelper.view',
        },
    }
}
