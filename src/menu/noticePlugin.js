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
    title: '消息通知',
    name: '消息通知',
    show: false,
    path: '/notice/buyer/basic',
    perm:'',
    children: {
        noticeBuyer: {
            title: '买家通知',
            name: '买家通知',
            path: '/notice/buyer/basic',
            pluginName: 'notice',
            perm:'notice.manage',
            children: {
                basic: {
                    title: '基础通知',
                    name: '基础通知',
                    path: '/notice/buyer/basic',
                    pluginName: 'notice',
                    perm:'notice.manage',
                    children: {
                        basisEdit: {
                            title: '编辑通知信息',
                            name: '编辑通知信息',
                            path: '/notice/buyer/basic/index',
                            pluginName: 'notice',
                            perm:'notice.manage',
                            showSubMenu:true,
                            showBackBtn:true,
                            show: false,
                        }
                    }
                },
                sale: {
                    title: '营销通知',
                    name: '营销通知',
                    path: '/notice/buyer/sale',
                    pluginName: 'notice',
                    perm:'notice.manage',
                    children: {
                        basisEdit: {
                            title: '编辑通知信息',
                            name: '编辑通知信息',
                            path: '/notice/buyer/sale/index',
                            pluginName: 'notice',
                            perm:'notice.manage',
                            showSubMenu:true,
                            showBackBtn:true,
                            show: false,
                        }
                    }
                },
                verify_code: {
                    title: '验证码',
                    name: '验证码',
                    path: '/notice/buyer/verify_code',
                    pluginName: 'notice',
                    perm:'notice.manage',
                    children: {
                        basisEdit: {
                            title: '编辑通知信息',
                            name: '编辑通知信息',
                            path: '/notice/buyer/verify_code/index',
                            pluginName: 'notice',
                            perm:'notice.manage',
                            showSubMenu:true,
                            showBackBtn:true,
                            show: false,
                        }
                    }
                },
            }
        },
        noticeSeller: {
            title: '卖家通知',
            name: '卖家通知',
            path: '/notice/seller/list',
            pluginName: 'notice',
            perm:'notice.manage',
            children: {
                basisEdit: {
                    title: '编辑通知信息',
                    name: '编辑通知信息',
                    path: '/notice/seller/seller_notice/index',
                    pluginName: 'notice',
                    perm:'notice.manage',
                    showSubMenu:true,
                    showBackBtn:true,
                    show: false,
                }
            }
        },
        noticeTemplate: {
            title: '模板设置',
            name: '模板设置',
            path: '/notice/wxappTemplate/lis',
            pluginName: 'notice',
            perm:'notice.manage',
            children: {
                wxappList: {
                    title: '微信模板',
                    name: '微信模板',
                    path: '/notice/wxappTemplate/list',
                    pluginName: 'notice',
                    perm:'notice.manage',
                    children: {
                        wxappEdit: {
                            title: '编辑微信模板',
                            name: '编辑微信模板',
                            path: '/notice/wxappTemplate/index',
                            pluginName: 'notice',
                            show: false,
                            showSubMenu:true,
                            showBackBtn:true,
                            perm:'notice.manage',
                        },
                    }
                },
                smsList: {
                    title: '短信模板',
                    name: '短信模板',
                    path: '/notice/smsTemplate/list',
                    pluginName: 'notice',
                    perm:'notice.manage',
                    children: {
                        smsAdd: {
                            title: '添加短信模板',
                            name: '添加短信模板',
                            path: '/notice/smsTemplate/add',
                            pluginName: 'notice',
                            perm:'notice.manage',
                            show: false,
                            showSubMenu:true,
                            showBackBtn:true,
                        },
                        smsEdit: {
                            title: '编辑短信模板',
                            name: '编辑短信模板',
                            path: '/notice/smsTemplate/edit',
                            pluginName: 'notice',
                            perm:'notice.manage',
                            show: false,
                            showSubMenu:true,
                            showBackBtn:true,
                        },
                    }
                }
            }
        },
        noticeEmail: {
            title: '邮箱设置',
            name: '邮箱设置',
            path: '/notice/email/index',
            pluginName: 'notice',
            perm:'notice.manage',
        },
        smsSettings: {
            title: '短信设置',
            name: '短信设置',
            path: '/notice/smsSttings',
            pluginName: 'notice',
            perm:'notice.manage',
        },
    }
}
