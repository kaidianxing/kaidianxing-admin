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
        fans: {
            title: "粉丝管理",
            name: "粉丝管理",
            path: "/home/wechat/fans/list",
            show: ($route) => showWechatAchievePath.includes($route?.path),
            zIndex: 0,
            perm: 'channel.wechat.view',
            children: {
                fansList: {
                    title: "粉丝列表",
                    name: "粉丝列表",
                    perm: 'channel.wechat.view',
                    path: "/home/wechat/fans/list",
                },
                fansLabel: {
                    title: "粉丝标签",
                    name: "粉丝列表",
                    perm: 'channel.wechat.view',
                    path: "/home/wechat/fans/label",
                },
            },
        },
        reply: {
            title: "自动回复",
            name: "自动回复",
            path: "/home/wechat/reply/follow/index",
            show: ($route) => showWechatAchievePath.includes($route?.path),
            zIndex: 1,
            perm: 'channel.wechat.view',
            children: {
                followReply: {
                    title: "关注回复",
                    name: "关注回复",
                    perm: 'channel.wechat.view',
                    path: "/home/wechat/reply/follow/index",
                },
                keywordReply: {
                    title: "关键词回复",
                    name: "关键词回复",
                    perm: 'channel.wechat.view',
                    path: "/home/wechat/reply/keyword/index",
                    children: {
                        keywordAdd: {
                            title: "添加关键词",
                            name: "添加关键词",
                            perm: 'channel.wechat.view',
                            path: "/home/wechat/reply/keyword/set",
                            show: false,
                            showSubMenu: true,
                            showBackBtn: false,
                        },
                    },
                },
            },
        },
        CustomMu: {
            title: "自定义菜单",
            name: "自定义菜单",
            path: "/home/public/lib/menu",
            zIndex: 2,
            perm: 'channel.wechat.view',
            show: ($route) => showWechatAchievePath.includes($route?.path),
            children: {
                publicNum: {
                    title: "自定义菜单",
                    name: "自定义菜单",
                    path: "/home/public/lib",
                    perm: 'channel.wechat.view',
                    show: false,
                    showSubMenu: true,
                    showBackBtn: false,
                },
            },
        },
        MaterialLibrary: {
            zIndex: 3,
            title: "素材管理",
            name: "素材管理",
            perm: 'channel.wechat.view',
            path: "",
            show: ($route) => showWechatAchievePath.includes($route?.path),
            children: {
                Img: {
                    title: "图片素材",
                    name: "图片素材",
                    path: "/home/lib/image",
                    perm: 'channel.wechat.view',
                    show: ($route) => showWechatAchievePath.includes($route?.path),
                },
                Video: {
                    title: "视频素材",
                    name: "视频素材",
                    path: "/home/lib/video",
                    perm: 'channel.wechat.view',
                    show: ($route) => showWechatAchievePath.includes($route?.path),
                },
                ImgText: {
                    title: "图文素材",
                    name: "图文素材",
                    path: "/home/lib/news",
                    perm: 'channel.wechat.view',
                    show: ($route) => showWechatAchievePath.includes($route?.path),
                },
            },
        },
        // ------------------ pc渠道---------------------
        goodsGroup: {
            title: "商品组管理",
            name: "商品组管理",
            path: "/home/pc/goods/list",
            show: ($route) => showPcAchievePath.includes($route?.path),
            zIndex: 0,
            children: {
                fansList: {
                    title: "添加",
                    name: "添加",
                    path: "/home/pc/goods/add",
                    // perm:'pc.goods-group.view',
                    show: false,
                    showSubMenu: true,
                    showBackBtn: true,
                },
            }
        },
        menusSetting: {
            title: "菜单管理",
            name: "菜单管理",
            path: "",
            show: ($route) => showPcAchievePath.includes($route?.path),
            zIndex: 0,
            children: {
                fansList: {
                    title: "顶部菜单",
                    name: "顶部菜单",
                    path: "/home/pc/menus/header",
                    // perm: "pc.menus.view",
                },
                fansLabel: {
                    title: "底部菜单",
                    name: "底部菜单",
                    path: "/home/pc/menus/footer",
                    // perm: "pc.menus.view",
                },
                add: {
                    title: "添加菜单",
                    name: "添加菜单",
                    path: "/home/pc/menus/add",
                    // perm: "pc.menus.view",
                    show:false,
                    showSubMenu:true,
                    showBackBtn:true,
                }
            },
        },
        serviceSetting: {
            title: "客服管理",
            name: "客服管理",
            path: "/home/pc/menus/serviceManaging",
            // perm: "pc.sysset.customer-service.view",
            show: ($route) => showPcAchievePath.includes($route?.path),
            zIndex: 0
        },
        copyrightSetting: {
            title: "版权设置",
            name: "版权设置",
            path: "/home/pc/copyright",
            // perm: "pc.sysset.copyright.view",
            show: ($route) => showPcAchievePath.includes($route?.path),
            zIndex: 0
        },
        baseSetting: {
            title: "基础设置",
            name: "基础设置",
            path: "/home/pc/baseSettings/settings",
            show: ($route) => showPcAchievePath.includes($route?.path),
            zIndex: 0,
            children: {
                fansList: {
                    title: "基础设置",
                    name: "基础设置",
                    // perm: "pc.sysset.basic.view",
                    path: "/home/pc/baseSettings/settings",
                },
                fansLabel: {
                    title: "首页广告",
                    name: "首页广告",
                    path: "/home/pc/baseSettings/advertising",
                    // perm:'pc.home-ads.view'
                },
            },
        },
    }
}

// 公众号配置完成后展示的路由
const showWechatAchievePath = [
    "/home/wechat/config/achieve",
    "/home/wechat/reply/follow/index",
    "/home/wechat/reply/keyword/index",
    "/home/wechat/reply/keyword/set",
    "/home/wechat/fans/list",
    "/home/wechat/fans/label",
    "/home/public/lib",
    "/home/lib/image",
    "/home/lib/voice",
    "/home/lib/video",
    "/home/lib/news",
    "/home/public/lib/menu",
];
const showPcAchievePath = [
    "/home/pc/goods/list",
    "/home/pc/goods/add",
    '/home/pc/menus/header',
    '/home/pc/menus/footer',
    '/home/pc/menus/add',
    '/home/pc/menus/serviceManaging',
    '/home/pc/copyright',
    '/home/pc/baseSettings/settings',
    '/home/pc/baseSettings/advertising'
]
