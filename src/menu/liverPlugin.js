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
    title: '小程序直播',
    name: '小程序直播',
    show: false,
    path: '/liver/manage/list',
    perm:'',
    children: {
        livermanage: {
            title: '直播间管理',
            name: '直播间管理',
            path: '/liver/manage/list',
            perm: 'broadcast.manage',
            zIndex: 1,
            children: {
                liveCreate: {
                    title: '创建直播间',
                    name: '创建直播间',
                    path: '/liver/manage/list/create',
                    perm: 'broadcast.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                }
            }
        },
        livergoods: {
            title: '商品库',
            name: '商品库',
            path: '/liver/goods/list/all',
            perm: 'broadcast.manage',
            zIndex: 2,
            children: {
                waiting: {
                    title: '全部商品',
                    name: '全部商品',
                    path: '/liver/goods/list/all',
                    perm: 'broadcast.manage',
                },
                // applying: {
                //     title: '审核中',
                //     name: '审核中',
                //     path: '/liver/goods/list/applying',
                //     perm: 'broadcast.manage',
                // },
                applySuc: {
                    title: '审核成功',
                    name: '审核成功',
                    path: '/liver/goods/list/applySuc',
                    perm: 'broadcast.manage',
                },
                // applyFail: {
                //     title: '审核失败',
                //     name: '审核失败',
                //     path: '/liver/goods/list/applyFail',
                //     perm: 'broadcast.manage',
                // },
            }
        },
        liverincome: {
            title: '统计分析',
            name: '统计分析',
            path: '/liver/analyse/sale',
            perm: 'broadcast.manage',
            zIndex: 3,
            children: {
                saleAnalyse: {
                    title: '销售分析',
                    name: '销售分析',
                    path: '/liver/analyse/sale',
                    perm: 'broadcast.manage'
                },
                saleRank: {
                    title: '商品销售分析',
                    name: '商品销售分析',
                    path: '/liver/analyse/rank',
                    perm: 'broadcast.manage'
                }
            }
        },
        operateIndex: {
            title: '运营资源',
            name: '运营资源',
            path: '/liver/action/operate',
            perm: 'broadcast.manage',
            zIndex: 4,
            show: false,
            showSubMenu:true,
            showBackBtn:true,

        },
        liverDetail: {
            title: '详情',
            name: '详情',
            path: '/liver/action/detail',
            perm: 'broadcast.manage',
            zIndex: 5,
            show: false,
            showSubMenu:true,
            showBackBtn:true,

        },
    }
}
