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
export const articleApi = {
    // 清除数据
    clearData: {
        method: "post",
        api: "manage/article/settings/clear-data"
    },
// 报名数据列表
    getActivityList: {
        method: "get",
        api: "manage/article/article/get-join-activity-list"
    },
// 文章列表
    getArticleList: {
        method: "get",
        api: "manage/article/article/list"
    },
// 获取微信文章内容
    wxArticle: {
        method: "post",
        api: "manage/article/article/import-wx-article"
    },
// 显示,隐藏文章
    changeHideArticle: {
        method: "post",
        api: "manage/article/article/change-status"
    },
    // 推广
    promoteArticle: {
        method: "get",
        api: "manage/article/article/promote"
    },
    // 下载文章图片
    downloadImageArticle: {
        method: 'get',
        api: 'manage/article/article/download-image'
    },
    // 置顶文章
    changeToppingArticle: {
        method: "post",
        api: "manage/article/article/change-top"
    },
    // 统计数据
    getArticleStatistics: {
        method: "get",
        api: "manage/article/article/statistics"
    },
    // 推广销售数据
    getArticleSellData: {
        method: "get",
        api: "manage/article/article/get-sell-data"
    },
    // 删除文章
    deleteArticle: {
        method: "post",
        api: "manage/article/article/delete"
    },
    // 保存文章
    saveArticle: {
        method: 'post',
        api: 'manage/article/article/save'
    },
    // 获取文章信息
    getArticleDetail: {
        method: 'get',
        api: 'manage/article/article/get'
    },
    // 检测文章标题唯一
    checkArticleTitle: {
        method: 'get',
        api: 'manage/article/article/check-title'
    },

    // 文章分组列表
    getGroupList: {
        method: 'get',
        api: 'manage/article/group/list'
    },
    // 添加文章分组
    saveArticleGroup: {
        method: 'post',
        api: 'manage/article/group/save'
    },
    // 显示隐藏文章分组
    changeHideArticleGroup: {
        method: 'post',
        api: 'manage/article/group/change-status'
    },
    // 删除文章分组
    deleteArticleGroup: {
        method: 'post',
        api: 'manage/article/group/delete'
    },

    // 获取配置
    getArticleSettings: {
        method: 'get',
        api: 'manage/article/settings/get'
    },
    // 设置配置
    setArticleSettings: {
        method: 'post',
        api: 'manage/article/settings/set'
    },

}
