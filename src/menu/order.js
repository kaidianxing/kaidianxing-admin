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
    title: '订单',
    name: '订单',
    path: '/order/list/send',
    show: true,
    icon: 'icon-zuocedaohang-dingdan',
    perm:'',
    zIndex:40,
    children: {
        management: {
            title: '订单管理',
            name: '订单管理',
            path: '/order/list/send', //默认第一个
            icon: "icon-kaidianxing-dingdanguanli",
            show: true,
            perm:'order.op.view',
            children: {
                waitSend: {
                    title: '待发货',
                    name: '待发货',
                    path: '/order/list/send',
                    show: true,
                    perm:'',
                    children: {
                        orderDetail: {
                            title: '详情',
                            name: '详情',
                            perm:'',
                            showSubMenu:true,
                            showBackBtn:true,
                            path: '/order/detail/send',
                            backPath:'/order/list/send',
                        },
                    }
                },
                waitPayment: {
                    title: '待付款',
                    name: '待付款',
                    path: '/order/list/payment',
                    show: true,
                    perm:'',
                    children: {
                        orderDetail: {
                            title: '详情',
                            name: '详情',
                            perm:'',
                            showSubMenu:true,
                            showBackBtn:true,
                            path: '/order/detail/payment'
                        },
                        changePrice: {
                            title: '改价',
                            name: '改价记录',
                            perm:'',
                            path: '/order/change-price-record'
                        },
                    }
                },
                waitReceiving: {
                    title: '待收货',
                    name: '待收货',
                    path: '/order/list/receive',
                    show: true,
                    perm:'',
                    children: {
                        orderDetail: {
                            title: '详情',
                            name: '详情',
                            perm:'',
                            showSubMenu:true,
                            showBackBtn:true,
                            path: '/order/detail/receive'
                        }
                    }
                },
                achieve: {
                    title: '已完成',
                    name: '已完成',
                    path: '/order/list/achieve',
                    show: true,
                    perm:'',
                    children: {
                        orderDetail: {
                            title: '详情',
                            name: '详情',
                            perm:'',
                            showSubMenu:true,
                            showBackBtn:true,
                            path: '/order/detail/achieve'
                        }
                    }
                },
                close: {
                    title: '已关闭',
                    name: '已关闭',
                    path: '/order/list/close',
                    show: true,
                    perm:'',
                    children: {
                        orderDetail: {
                            title: '详情',
                            name: '详情',
                            perm:'',
                            showSubMenu:true,
                            showBackBtn:true,
                            path: '/order/detail/close',
                            backPath:'/order/list/close',
                        }
                    }
                },
                all: {
                    title: '全部订单',
                    name: '全部订单',
                    perm:'',
                    path: '/order/list/all',
                    show: true
                },
            }
        },
        handleOrders: {
            title: '订单处理',
            path: '/order/list/refund',
            show: true,
            icon: "icon-kaidianxing-dingdanchuli",
            perm:'order.op.view',
            children: {
                safeguard: {
                    title: '维权订单',
                    path: '/order/list/refund',
                    show: true,
                    perm:'order.refund.view',
                    children: {
                        refund: {
                            title: '仅退款',
                            perm:'order.refund.view',
                            path: '/order/refund-detail',
                            backPath:'/order/list/refund',
                        },
                        exchangeGoods: {
                            title: '换货',
                            perm:'order.refund.view',
                            path: '/order/exchange-goods-detail',
                            backPath:'/order/list/refund',
                        },
                        returnsRefunds: {
                            title: '退货退款',
                            perm:'order.refund.view',
                            path: '/order/returns-refunds-detail',
                            backPath:'/order/list/refund',
                        }
                    }
                },
                evaluate: {
                    title: '评价管理',
                    path: '/order/evaluate',
                    show: true,
                    perm:'order.comment.view',
                    children: {
                        evaluateAudit: {
                            title: '评价审核',
                            perm:'order.comment.view',
                            path: '/order/evaluate/audit',
                        }
                    }
                },
            }
        },
        distributionMode: {
            title: '配送方式',
            path: '/order/ordinary-express',
            show: true,
            icon: "icon-kaidianxing-peisongfangshi",
            perm:'order.dispatch.view',
            children: {
                ordinaryExpress: {
                    title: '普通快递',
                    path: '/order/ordinary-express',
                    show: ($route, $store) => 20 !== +$store?.state?.account?.shop?.shopType,
                    perm:'',
                    children: {
                        ordinaryExpressAdd: {
                            title: '新增配送方式',
                            perm:'',
                            path: '/order/ordinary-express/add'
                        },
                        ordinaryExpressEdit: {
                            title: '修改配送方式',
                            perm:'',
                            path: '/order/ordinary-express/edit'
                        }
                    }
                },
                samecityDelivery: {
                    title: '同城配送',
                    path: '/order/same-city-delivery',
                    perm:'',
                },
            }
        },
        // settingBusiness: {
        //     title: '交易设置',
        //     name: '交易设置',
        //     path:'/order/business/setting',
        //     redirect:'/setting/business/index',
        //     icon: "icon-kaidianxing-jiaoyishezhi-1",
        //     perm:'sysset.trade.view',
        // }
    }
};
