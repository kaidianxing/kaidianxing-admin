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
    title: '评价助手',
    name: '评价助手',
    show: false,
    path: '/commentHelper/comment/list',
    perm:'',
    children: {
        commentList: {
            title: '商品评价库',
            name: '商品评价库',
            path: '/commentHelper/comment/list',
            pluginName: 'commentHelper',
            perm: 'commentHelper.index.view',
            children: {
                commentSingleList: {
                    title: '评价列表',
                    name: '评价列表',
                    path: '/commentHelper/comment/single/list',
                    pluginName: 'commentHelper',
                    perm: 'commentHelper.index.view',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
                commentSingleAdd: {
                    title: '创建评价',
                    name: '创建评价',
                    path: '/commentHelper/comment/single/index',
                    pluginName: 'commentHelper',
                    perm: 'commentHelper.index.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
                commentSingleEdit: {
                    title: '编辑评价',
                    name: '编辑评价',
                    path: '/commentHelper/comment/single/edit',
                    pluginName: 'commentHelper',
                    perm: 'commentHelper.index.view',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
            }
        },
        commentSet: {
            title: '基础设置',
            name: '基础设置',
            path: '/commentHelper/set/index',
            pluginName: 'commentHelper',
            perm: 'commentHelper.setting.manage',
        },
    }
}