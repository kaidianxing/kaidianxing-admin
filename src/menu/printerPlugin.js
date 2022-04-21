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
    title: '打印小票',
    name: '打印小票',
    show: false,
    path: '/printer/manage/list',
    perm:'',

    children: {
        printerManage: {
            title: '打印机管理',
            name: '打印机管理',
            path: '/printer/manage/list',
            pluginName: 'printer',
            perm: 'notice.manage',

            children: {
                manageList: {
                    title: '打印机管理',
                    name: '打印机管理',
                    path: '/printer/manage/list',
                    pluginName: 'printer',
                    perm: 'notice.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:false,

                },
                manageAdd: {
                    title: '添加打印机',
                    name: '添加打印机',
                    path: '/printer/manage/add',
                    pluginName: 'printer',
                    perm: 'notice.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
                manageEdit: {
                    title: '编辑打印机',
                    name: '编辑打印机',
                    path: '/printer/manage/edit',
                    pluginName: 'printer',
                    perm: 'notice.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
            }
        },
        printerTemplate: {
            title: '模板管理',
            name: '模板管理',
            path: '/printer/template/list',
            pluginName: 'printer',
            perm:'notice.manage',
            children: {
                manageList: {
                    title: '模板管理',
                    name: '模板管理',
                    path: '/printer/template/list',
                    pluginName: 'printer',
                    perm: 'notice.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:false,
                },
                manageAdd: {
                    title: '添加模板',
                    name: '添加模板',
                    path: '/printer/template/add',
                    pluginName: 'printer',
                    perm: 'notice.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
                manageEdit: {
                    title: '编辑模板',
                    name: '编辑模板',
                    path: '/printer/template/edit',
                    pluginName: 'printer',
                    perm: 'notice.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
            }
        },
        printerTask: {
            title: '打印任务',
            name: '打印任务',
            path: '/printer/task/list',
            pluginName: 'printer',
            perm:'notice.manage',
            children: {
                manageList: {
                    title: '打印任务',
                    name: '打印任务',
                    path: '/printer/task/list',
                    pluginName: 'printer',
                    perm: 'notice.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:false,
                },
                manageAdd: {
                    title: '添加任务',
                    name: '添加任务',
                    path: '/printer/task/add',
                    pluginName: 'printer',
                    perm: 'notice.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
                manageEdit: {
                    title: '编辑任务',
                    name: '编辑任务',
                    path: '/printer/task/edit',
                    pluginName: 'printer',
                    perm: 'notice.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
            }
        },

    }
}