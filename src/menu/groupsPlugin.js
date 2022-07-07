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
    title: '多人拼团',
    name: '多人拼团',
    path: '/groups/activity/list',
    show: false,
    perm: '',
    children:{
        spellGroupActivity: {
            title: '拼团列表',
            name: '拼团列表',
            path: '/groups/activity/list',
            pluginName: 'groups',
            perm: 'groups.view',
            children: {
                basic: {
                    title: '拼团',
                    name: '拼团',
                    path: '/groups/activity/index',
                    pluginName: 'groups',
                    perm: 'groups.manage',
                    show: false,
                    showSubMenu:false,
                    showBackBtn:true,
                },
            },
        },
        spellGroupOrder: {
            title: '拼团订单',
            name: '拼团订单',
            path: '/groups/order/list',
            pluginName: 'groups',
            perm: '',
            children: {
                spellGroupOrderDetail: {
                    title: '团订单详情',
                    name: '团订单详情',
                    path: '/groups/order/detail',
                    pluginName: 'groups',
                    perm: '',
                    show: false,
                    showSubMenu:false,
                    showBackBtn:true,
                },
            }
        },
        spellGroupActivityData: {
            title: '活动数据',
            name: '活动数据',
            path: '/groups/activityData/index',
            pluginName: 'groups',
            perm: 'groups_statistics.manage'
        },
        spellGroupMessage: {
            title: '消息通知',
            name: '消息通知',
            path: '/groups/message/list',
            pluginName: 'groups',
            perm: 'groups_message.manage',
            children: {
                spellGroupMessageEdit: {
                    title: '编辑消息通知',
                    name: '编辑消息通知',
                    path: '/groups/message/index',
                    pluginName: 'groups',
                    perm: 'groups_message.manage',
                    show: false,
                },
            }
        },
        spellGroupSetting: {
            title: '拼团设置',
            name: '拼团设置',
            path: '/groups/set/index',
            pluginName: 'groups',
            perm: 'groups_setting.manage',
        }
    }
}
