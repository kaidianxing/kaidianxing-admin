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
    title: '新人送礼',
    name: '新人送礼',
    show: false,
    path: '/newGifts/activity/index',
    perm:'',
    children: {
        newGifts: {
            title: '活动管理',
            name: '活动管理',
            path: '/newGifts/activity/index',
            pluginName: 'newGifts',
            perm: 'newGifts.manage',
            children: {
                add: {
                    title: '添加活动',
                    name: '添加活动',
                    path: '/newGifts/activity/add',
                    pluginName: 'newGifts',
                    perm: 'newGifts.manage',
                    showSubMenu:true,
                    showBackBtn:true,
                    show: false,
                },
                edit: {
                    title: '编辑活动',
                    name: '编辑活动',
                    path: '/newGifts/activity/edit',
                    pluginName: 'newGifts',
                    perm: 'newGifts.manage',
                    showSubMenu:true,
                    showBackBtn:true,
                    show: false,
                },
                view: {
                    title: '查看活动',
                    name: '查看活动',
                    path: '/newGifts/activity/view',
                    pluginName: 'newGifts',
                    perm: 'newGifts.manage',
                    showSubMenu:true,
                    showBackBtn:true,
                    show: false,
                },
            },
        },
        newGiftsLog: {
            title: '领取记录',
            name: '领取记录',
            path: '/newGifts/log/index',
            pluginName: 'newGifts',
            perm: 'newGifts.manage',
        },
    }
}

