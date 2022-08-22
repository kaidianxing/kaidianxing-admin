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
    title: '设置',
    name: '设置',
    path: '/setting/shopSetting/baseSetting/index',
    show: true,
    icon: 'icon-zuocedaohang-yingxiao',
    zIndex: 110,
    perm: '',
    children: {
        shopSetting: {
            title: '商城设置',
            name: '商城设置',
            path: '/setting/shopSetting/baseSetting/index',
            icon: "icon-kaidianxing-shangchengshezhi",
            perm: '',
            children: {
                baseSetting: {
                    title: '基础设置',
                    name: '基础设置',
                    path: '/setting/shopSetting/baseSetting/index',
                    show: true,
                    perm: 'sysset.mall.basic.view',
                },
                shareSetting: {
                    title: '分享设置',
                    name: '分享设置',
                    path: '/setting/shopSetting/shareSetting/index',
                    show: true,
                    perm: 'sysset.mall.share.view',
                },
                announcementManagement: {
                    title: '公告管理',
                    name: '公告管理',
                    path: '/setting/shopSetting/announcementManagement/index',
                    show: true,
                    perm: 'sysset.mall.notice.view',
                    children: {
                        addAnnouncementManagement: {
                            title: '添加公告',
                            name: '添加公告',
                            path: '/setting/shopSetting/announcementManagement/add',
                            perm: 'sysset.mall.notice.manage',
                            show: false,
                            showSubMenu: true,
                            showBackBtn: true,
                        },
                    },
                },
                contactUs: {
                    title: '联系我们',
                    name: '联系我们',
                    path: '/setting/shopSetting/contactUs/index',
                    perm: '',
                    show: true,
                },
            },
        },
        business: {
            title: '交易设置',
            name: '交易设置',
            icon: "icon-kaidianxing-jiaoyishezhi-1",
            perm: 'sysset.trade.view',
            path: '/setting/business/index',
        },
        safeguard: {
            title: '维权设置',
            name: '维权设置',
            icon: "icon-kaidianxing-weiquanshezhi",
            perm: 'sysset.refund.view',
            path: '/setting/safeguard/index',
        },
        credit: {
            title: '积分设置',
            name: '积分设置',
            icon: "icon-kaidianxing-jifenmingxi",
            perm: 'sysset.credit.view',
            path: '/setting/credit/index',
        },
        balance: {
            title: '余额设置',
            name: '余额设置',
            icon: "icon-yueshezhi",
            perm: 'sysset.balance.view',
            path: '/setting/balance/index',
        },
        goodsData: {
            title: "注册设置",
            name: "注册设置",
            icon: "icon-kaidianxing-zhuceshezhi",
            path: "/setting/register",
            perm: "channel.registry.view",
        },
        defray: {
            title: '支付设置',
            name: '支付设置',
            path: '',
            icon: "icon-zhifushezhi",
            perm: '',
            children: {
                way: {
                    title: '支付方式',
                    name: '支付方式',
                    perm: 'sysset.pay-type_set.view',
                    path: '/setting/paymentSettings/way/index',
                    show: true,
                },
                payment: {
                    title: '打款设置',
                    name: '打款设置',
                    path: '/setting/paymentSettings/payments/index',
                    show: true,
                    perm: 'sysset.pay_set.view',
                },
                mould: {
                    title: '支付模板管理',
                    name: '支付模板管理',
                    path: '/setting/paymentSettings/mould/list',
                    show: true,
                    perm: 'sysset.pay_template_set.view',
                    children: {
                        addMould: {
                            title: '添加模板',
                            name: '添加模板',
                            path: '/setting/paymentSettings/mould/addMoulde',
                            show: false,
                            showSubMenu: true,
                            showBackBtn: true,
                            perm: 'sysset.pay_template_set.manage',
                        },
                        editMould: {
                            title: '修改模板',
                            name: '修改模板',
                            path: '/setting/paymentSettings/mould/editMoulde',
                            show: false,
                            showSubMenu: true,
                            showBackBtn: true,
                            perm: 'sysset.pay_template_set.manage',
                        },
                    }
                },
                extension: {
                    title: '推广佣金设置',
                    name: '推广佣金设置',
                    path: '/setting/extensionSetting/commission',
                    show: ($route, $store) => {
                        return 20 === +$store?.state?.account?.shop?.shopType
                    },
                    perm: 'merchant_sysset.commission.view',
                }
            },
        },
        address: {
            title: '地址物流',
            name: '地址物流',
            path: '/setting/address/logistics',
            icon: "icon-dizhiwuliu",
            perm: '',
            children: {
                logistics: {
                    title: '物流配置',
                    name: '物流配置',
                    path: '/setting/address/logistics',
                    show: true,
                    perm: 'sysset.express.view',
                },
                area: {
                    title: '地址设置',
                    name: '地址设置',
                    path: '/setting/address/area',
                    show: true,
                    perm: 'sysset.address_set.view',
                },
                refundAddress: {
                    title: '退货地址',
                    name: '退货地址',
                    path: '/setting/address/refundAddress/list',
                    show: ($route, $store) => {
                        return 20 !== +$store?.state?.account?.shop?.shopType
                    },
                    perm: 'sysset.refund_address.view',
                    children: {
                        addRefundAddress: {
                            title: '添加退货地址',
                            name: '添加退货地址',
                            path: '/setting/address/refundAddress/add',
                            show: false,
                            showSubMenu: true,
                            showBackBtn: true,
                            perm: 'sysset.refund_address.manage',
                        },
                        editRefundAddress: {
                            title: '编辑退货地址',
                            name: '编辑退货地址',
                            path: '/setting/address/refundAddress/edit',
                            show: false,
                            showSubMenu: true,
                            showBackBtn: true,
                            perm: 'sysset.express.refund_address.manage',
                        },
                    }
                }
            },
        },
        systemAuthority: {
            title: '系统权限',
            name: '系统权限',
            path: '/setting/systemAuthority/roleManagement',
            icon: "icon-xitongquanxian",
            perm: '',
            children: {
                roleManagement: {
                    title: '角色管理',
                    name: '角色管理',
                    path: '/setting/systemAuthority/roleManagement',
                    show: true,
                    perm: 'user.role.view',
                    children: {
                        roleManagementAdd: {
                            title: '添加角色',
                            name: '添加角色',
                            path: '/setting/systemAuthority/roleManagement/add',
                            show: false,
                            showSubMenu: true,
                            showBackBtn: true,
                            perm: 'user.role.manage',
                        },
                    },
                },
                operatorManagement: {
                    title: '操作员管理',
                    name: '操作员管理',
                    path: '/setting/systemAuthority/operatorManagement',
                    show: true,
                    perm: 'user.index.view',
                    children: {
                        operatorManagementAdd: {
                            title: '添加操作员',
                            name: '添加操作员',
                            path: '/setting/systemAuthority/operatorManagement/add',
                            show: false,
                            showSubMenu: true,
                            showBackBtn: true,
                            perm: 'user.index.manage',
                        },
                    },
                },
                operationLog: {
                    title: '操作日志',
                    name: '操作员管理',
                    path: '/setting/systemAuthority/operationLog',
                    show: true,
                    perm: 'sysset.log.view',
                    children: {
                        operationLogDetail: {
                            title: '操作详情',
                            name: '操作详情',
                            path: '/setting/systemAuthority/operationLog/detail',
                            show: false,
                            showSubMenu: true,
                            showBackBtn: true,
                            perm: 'sysset.log.view',
                        },
                    },
                },
            },
        },
        system: {
            title: "系统设置",
            name: "系统设置",
            path: "/setting/system/apps/install",
            icon: "icon-xitongshezhi",
            perm: "system.apps.index.view",
            children: {
                crontab: {
                    title: "数据管理",
                    name: "数据管理",
                    perm: "system.tools.crontab.view",
                    path: "/setting/system/tools/crontab",
                },
                accessorySetting: {
                    title: "附件设置",
                    name: "附件设置",
                    perm: "system.attachment.view",
                    path: "/setting/system/attachment",
                },
                remoteStorage: {
                    title: "远程存储",
                    name: "远程存储",
                    perm: "system.storage.view",
                    path: "/setting/system/storage",
                },
                maintain: {
                    title: "清除缓存",
                    name: "清除缓存",
                    perm: "system.tools.cache.view",
                    path: "/setting/system/tools/cache",
                },
                systemUpgrade: {
                    title: "系统升级",
                    name: "系统升级",
                    perm: "system.upgrade.view",
                    path: "/setting/system/upgrade/index",
                },
            }
        }
    },
}
