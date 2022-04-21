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
export const shopApi = {
    // 页面列表
    getPageList: {
        method: 'get',
        api: 'manage/diypage/index/index'
    },
    // 删除页面
    deletePage: {
        method: 'post',
        api: 'manage/diypage/page/list/delete'
    },
    // 获取页面设置页面
    getUsingPage: {
        method: 'get',
        api: 'manage/diypage/index/get-default'
    },
    // 获取页面数量
    getPageTotal: {
        method: 'get',
        api: 'manage/diypage/index/get-total'
    },
    // 页面替换
    replacePage: {
        method: 'post',
        api: 'manage/diypage/index/replace'
    },
    // 获取模板列表
    getTemplateList: {
        method: 'get',
        api: 'manage/diypage/template'
    },
    // 菜单列表
    getMenuList: {
        method: 'get',
        api: 'manage/diypage/diymenu/index/index'
    },
    // 删除菜单
    deleteMenu: {
        method: 'post',
        api: 'manage/diypage/diymenu/index/delete'
    },
    replaceMenu: {
        method: 'post',
        api: 'manage/diypage/diymenu/index/replace'
    },
    // 链接选择器
    getLinkList: {
        method: 'get',
        api: 'manage/utility/link'
    },
    // 新版菜单列表
    getNewMenuList: {
        method: 'get',
        api: 'manage/diypage/menu/list'
    },
   
    // 新版删除菜单
    deleteNewMenu: {
        method: 'post',
        api: 'manage/diypage/menu/delete'
    },
    // 菜单应用
    menuApply: {
        method: 'post',
        api: 'manage/diypage/menu/change-status'
    },
    // 新版页面列表
    getNewPageList: {
        method: 'get',
        api: 'manage/diypage/page/list/get-shop'
    },
    // 新版自定义页面列表
    getNewCustomList: {
        api: 'manage/diypage/page/list/get-diy',
        method: 'get'
    },
    getNewPageTotal: {
        method: 'get',
        api: 'manage/diypage/page/shop/list-view'
    },
    getTempContent: {
        method: 'get',
        api: 'manage/diypage/template/get'
    },
    getApplyPage: {
        method: 'get',
        api: 'manage/diypage/page/list/get-app'
    },
    // 获取小程序跳转
    getAppToList: {
        method: 'get',
        api: 'manage/utility/link/get-navigate-list'
    },
    setTheme: { // 设置主题色
        method: 'post',
        api: 'manage/diypage/theme-color/set'
    },
    getTheme: { // 获取主题色
        method: 'get',
        api: 'manage/diypage/theme-color/get'
    }
};

