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
    title: '系统表单',
    name: '系统表单',
    show: false,
    path: '/systemForm/list',
    perm:'',
    children: {
        system_form: {
            title: '系统表单',
            name: '系统表单',
            path: '/systemForm/list',
            pluginName: 'systemForm',
            perm: '',
            show: ($route)=> $route?.path === '/systemForm/list' || $route?.path === '/systemForm/detail/order' ,
            children: {
                system_form_order: {
                    title: '表单详情',
                    name: '表单详情',
                    path: '/systemForm/detail/:type',
                    perm: '',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
            }
        },
        system_form_add: {
            title: '添加表单',
            name: '添加表单',
            path: '/systemForm/add',
            show: false,
            showSubMenu: false,
            showBackBtn:true,
            backPath: '/systemForm/list'
        },
        system_form_edit: {
            title: '编辑表单',
            name: '编辑表单',
            path: '/systemForm/edit',
            show: false,
            showSubMenu: false,
            showBackBtn:true,
            backPath: '/systemForm/list'
        }
    }
}

