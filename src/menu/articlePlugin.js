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
    title: '文章营销',
    name: '文章营销',
    show: false,
    path: '/article/article/list',
    perm:'',
    children: {
        article: {
            title: '专题文章',
            name: '专题文章',
            path: '/article/article/list',
            pluginName: 'article',
            perm: "article.article.view"
        },
        articleAdd: {
            title: '新增文章',
            name: '新增文章',
            path: '/article/article/add',
            pluginName: 'article',
            showSubMenu: false,
            showBackBtn: true,
            show: false,
            perm: "article.article.manage"
        },
        articleEdit: {
            title: '编辑文章',
            name: '编辑文章',
            path: '/article/article/edit',
            pluginName: 'article',
            showSubMenu: false,
            showBackBtn: true,
            show: false,
            perm: "article.article.view"
        },
        articleStatistics: {
            title: '文章统计',
            name: '文章统计',
            path: '/article/article/statistics',
            pluginName: 'article',
            showSubMenu: false,
            showBackBtn: true,
            show: false,
            perm: "article.article.view"
        },
        articleGroup: {
            title: '文章分组',
            name: '文章分组',
            path: '/article/group',
            pluginName: 'article',
            perm: "article.group.view"
        },
        articleSettings: {
            title: '基础设置',
            name: '基础设置',
            path: '/article/settings',
            pluginName: 'article',
            perm: "article.settings.view",
        },
        articleActivity: {
            title: '报名数据',
            name: '报名数据',
            path: '/article/activity',
            pluginName: 'article',
            perm: "article.article.view",
            show: false,
        },
    }
}
