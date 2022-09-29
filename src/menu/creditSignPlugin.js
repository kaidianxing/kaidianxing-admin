/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
export default {
    title: '积分商城',
    name: '积分商城',
    show: false,
    path: '/creditSign/manage/index',
    perm: 'creditSign.list.view',
    children: {
        creditSignManage: {
            title: '活动管理',
            name: '活动管理',
            path: '/creditSign/manage/index',
            pluginName: 'creditSign',
            perm: 'creditSign.list.view',
            children: {
                addManage: {
                    title: '添加活动',
                    name: '添加活动',
                    path: '/creditSign/manage/add',
                    perm: 'creditSign.list.view',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                }
            }
        },
        creditSignRecord: {
            title: '领取记录',
            name: '领取记录',
            path: '/creditSign/record/index',
            perm:'creditSign.list.view',
        },
        creditSignNotice: {
            title: '消息通知',
            name: '消息通知',
            path: '/creditSign/notice/list',
            perm:'creditSign.list.view',
            pluginName: 'creditSign',
            children: {
                noticeIndex: {
                    title: '消息通知',
                    name: '消息通知',
                    path: '/creditSign/notice/index',
                    perm: 'creditSign.list.manage',
                    show: false
                },
            }
        },
    }
}
