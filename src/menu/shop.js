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
    title: '店铺',
    name: '店铺管理',
    path: '/shop/list/system',
    show: true,
    icon: 'icon-zuocedaohang-dianpu',
    zIndex:20,
    perm:'',
    children: {
        pageList: {
            title: '商城装修',
            name: '商城装修',
            path: '/shop/list/system',
            perm: 'diypage.page.list.view',
            icon: 'icon-kaidianxing-shangchengzhuangxiu',
            children: {
                decorateIndex: {
                    title: '装修首页',
                    name: '装修首页',
                    path: '/shop/list/system',
                    perm: 'diypage.page.list.view',
                },
                menuManager: {
                    title: '菜单管理',
                    name: '',
                    path: '/shop/custom-menu',
                    perm: 'diypage.menu.view',
                    show: true,
                },
                themeManager: {
                    title: '主题色',
                    name: '',
                    path: '/shop/setting/theme',
                    perm: 'diypage.theme_color.view',
                    show: true,
                },
                decoratePageIndex: {
                    title: '装修首页',
                    name: '装修首页',
                    path: '/decorate/:page',
                    perm:'',
                    show:false
                },
                decoratePoster: {
                    title: '装修海报',
                    name: '装修海报',
                    path: '/decorate/poster/:page',
                    perm:'',
                    show:false
                },
                indexModule: {
                    title: '商城首页模板',
                    name: '商城首页模板',
                    path: '/shop/module/index',
                    perm:'',
                    show:false
                },
                detailModule: {
                    title: '商品详情模板',
                    name: '商品详情模板',
                    path: '/shop/module/detail',
                    perm:'',
                    show:false
                },
                vipModule: {
                    title: '会员中心模板',
                    name: '会员中心模板',
                    path: '/shop/module/vip',
                    perm:'',
                    show:false
                }
            }
        },
    }
};

