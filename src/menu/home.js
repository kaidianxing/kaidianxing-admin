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
    title: '运营',
    name: '运营',
    path: '/home/index/index',
    show: true,
    icon: 'icon-zuocedaohang-shouye1',
    perm: '',
    zIndex: 10,
    children: {
        home: {
            title: '运营',
            name: '运营',
            path: '/home/index/index',
            icon: "icon-zuocedaohang-shouye1",
            perm:'',
            show: ($route) =>
                    $route?.path === "/home/manage" ||
                    $route?.path === "/home/index/index" ||
                    $route?.path === "/home/transaction" ||
                    $route?.path === "/home/goods",
        },
        goodList: {
            title: '交易统计',
            name: '交易统计',
            path: '/home/transaction',
            icon: "icon-kaidianxing-jiaoyifenxi",
            perm:'statistics.trade.view',
            show: ($route) =>
                    $route?.path === "/home/manage" ||
                    $route?.path === "/home/index/index" ||
                    $route?.path === "/home/transaction" ||
                    $route?.path === "/home/goods",
        },
        goodsData: {
            title: '商品统计',
            name: '商品统计',
            path: '/home/goods',
            icon: "icon-kaidianxing-shangpinshuju",
            perm:'statistics.goods.view',
            show: ($route) =>
                    $route?.path === "/home/manage" ||
                    $route?.path === "/home/index/index" ||
                    $route?.path === "/home/transaction" ||
                    $route?.path === "/home/goods",
        },
        close: {
            title: '商城已关闭',
            name: '商城已关闭',
            show: false,
            perm: '',
            path: '/close'
        },
        channelManage: {
            title: "访问渠道",
            name: "访问渠道",
            path: "/home/manage",
            icon: "icon-kaidianxing-qudaoguanli",
            // h5/微信公众号/头条小程序
            perm: ($router, $store) =>
                    [
                        "channel.wap.view",
                        "channel.wechat.view",
                        "channel.wxapp.manage",
                        "channel.byteDance.manage",
                    ].some((item) => $store.state.config.user?.perms?.indexOf(item) > -1),
            show: ($route) =>
                    $route?.path === "/home/manage" ||
                    $route?.path === "/home/index/index" ||
                    $route?.path === "/home/transaction" ||
                    $route?.path === "/home/goods",

        },

        baseConfig_wx: {
            title: "基本配置",
            name: "基本配置",
            path: "/home/config/wx",
            perm: "channel.wxapp.manage",
            show: ($route) => $route?.path === "/home/config/wx",
            showBackBtn: true,
            backPath: "/home/manage",
        },
        baseConfig_tt: {
            title: "基本配置",
            name: "基本配置",
            path: "/home/config/tt",
            perm: "channel.byteDance.manage",
            show: ($route) =>  $route?.path === "/home/config/tt",
            showBackBtn: true,
            backPath: "/home/manage",
        },
        baseConfig_douyin: {
            title: "基本配置",
            name: "基本配置",
            path: "/home/config/douyin",
            perm: "channel.byteDance.manage",
            show: ($route) =>  $route?.path === "/home/config/douyin",
            showBackBtn: true,
            backPath: "/home/manage",
        },
        // 公众号基本配置
        baseConfig_wechat_not: {
            title: "公众号设置",
            name: "公众号设置",
            path: "/home/wechat/config/not",
            zIndex: 4,
            show: ($route) => $route?.path === "/home/wechat/config/not",
            isBack: true,
            backPath: "/home/manage",
            children: {
                wechat_settings: {
                    title: "公众号配置",
                    name: "公众号配置",
                    path: "/home/wechat/config/settings",
                    show: false,
                    showSubMenu: false,
                    showBackBtn: true,
                },
            },
        },
        // 公众号基本配置
        baseConfig_wechat_achieve: {
            title: "公众号设置",
            name: "公众号设置",
            path: "/home/wechat/config/achieve",
            zIndex: 4,
            show: ($route) => showWechatAchievePath.includes($route?.path),
            isBack: true,
            backPath: "/home/manage",
            children: {
                wechat_settings: {
                    title: "公众号配置",
                    name: "公众号配置",
                    path: "/home/wechat/config/settings",
                    show: false,
                    showSubMenu: false,
                    showBackBtn: true,
                },
            },
        },

    }
}

// 公众号配置完成后展示的路由
const showWechatAchievePath = [
    "/home/wechat/config/achieve",
    "/home/public/lib",
    "/home/lib/image",
    "/home/lib/voice",
    "/home/lib/video",
    "/home/lib/news",
    "/home/public/lib/menu",
];
