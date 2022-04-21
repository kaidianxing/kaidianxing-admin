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
export const decorateApi = {
    createPage: {//创建页面
        method: 'post',
        api: 'manage/diypage/index/create'
    },
    updatePage: {//更新页面
        method: 'post',
        api: 'manage/diypage/index/save'
    },
    getTplAbout: {//根据模板获取对应的内容
        method: 'post',
        api: 'manage/diypage/index/get-by-tpl'
    },
    getTplDetail: {//获取模板详情
        method: 'get',
        api: 'manage/diypage/index/edit'
    },
    createDiyMenu: {//创建自定义菜单
        method: 'post',
        api: 'manage/diypage/diymenu/index/create'
    },
    updateDiyMenu: {//更新菜单
        method: 'post',
        api: 'manage/diypage/diymenu/index/save'
    },
    getDiyMenuDetail: {//获取单个详情
        method: 'get',
        api: 'manage/diypage/diymenu/index/edit'
    },
    getToTopDetail: {//获取返回顶部详情
        method: 'get',
        api: 'manage/diypage/other/back-to-up'
    },
    editToTop: {//保存返回顶部
        method: 'post',
        api: 'manage/diypage/other/back-to-up/save-back-to-up'
    },
    getFollowbox: {//获取关注条配置
        method: 'get',
        api: 'manage/diypage/other/follow-box'
    },
    saveFollowbox: {//保存登录条
        method: 'post',
        api: 'manage/diypage/other/follow-box/save-follow-box'
    },
    saveTpl: {
        method: 'post',
        api: 'manage/diypage/index/save-template'
    },
    getOtherStatus:{
        method: 'get',
        api: 'manage/diypage/index/get-other-status'
    },
    // 新版添加菜单
    createNewDiyMenu: {
        method: 'post',
        api: 'manage/diypage/menu/add'
    },
    // 新版更新菜单
    updateNewDiyMenu: {
        method: 'post',
        api: 'manage/diypage/menu/edit'
    },
    // 新版获取菜单详情
    getNewDiyMenuDetail: {
        method: 'get',
        api: 'manage/diypage/menu/edit'
    },
    getNewPageDetail: {//获取模板详情
        method: 'get',
        api: 'manage/diypage/page/list/edit'
    },
    createNewPage: {
        method: 'post',
        api: 'manage/diypage/page/list/add'
    },
    // 新版另存为模板
    saveNewTpl: {
        method: 'post',
        api: 'manage/diypage/template/add'
    },
    updateNewPage: {//更新页面
        method: 'post',
        api: 'manage/diypage/page/list/edit'
    },
    // 新版获取菜单内容
    getNewMenuContent: {
        method: 'get',
        api: 'manage/diypage/menu/get-content'
    },
    // 请求执行
    execute: {
        method: 'get',
        api: 'manage/utility/asyncTask/execute'
    },
};
