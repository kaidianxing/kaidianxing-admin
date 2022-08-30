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
    title: '积分商城',
    name: '积分商城',
    show: false,
    path: '/creditShop/statistics/index',
    perm:'',
    children: {
        statistics: {
            title: '统计数据',
            name: '统计数据',
            path: '/creditShop/statistics/index',
            pluginName: 'creditShop',
            perm: '',
        },
        creditShop: {
            title: '积分商品',
            name: '积分商品',
            path: '/creditShop/goods/list',
            pluginName: 'creditShop',
            perm: 'creditShop.list.view',
            children: {
                addCreditShop: {
                    title: '添加积分商品',
                    name: '添加积分商品',
                    path: '/creditShop/goods/index',
                    pluginName: 'creditShop',
                    perm: 'creditShop.list.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                }
            }
        },
        setting: {
            title: '基础设置',
            name: '基础设置',
            path: '/creditShop/setting/index',
            pluginName: 'creditShop',
            perm: 'creditShop.setting.manage',
        },
    }
}
