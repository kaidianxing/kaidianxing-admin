/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
export default {
    title: '一键发圈',
    name: '一键发圈',
    show: false,
    path: '/material/list',
    perm: '',
    children: {
        material: {
            title: '素材管理',
            name: '素材管理',
            path: '/material/list',
            pluginName: 'material',
            perm: "material.index.view"
        },
        materialAdd: {
            title: '添加素材',
            name: '添加素材',
            path: '/material/add',
            pluginName: 'material',
            showSubMenu: false,
            showBackBtn: true,
            show: false,
            perm: "material.index.view"
        },
        materialEdit: {
            title: '编辑素材',
            name: '编辑素材',
            path: '/material/edit',
            pluginName: 'material',
            showSubMenu: false,
            showBackBtn: true,
            show: false,
            perm: "material.index.view"
        },
        materialSettings: {
            title: '基础设置',
            name: '基础设置',
            path: '/material/settings',
            pluginName: 'material',
            perm: "material.setting.view",
        },
    }
}
