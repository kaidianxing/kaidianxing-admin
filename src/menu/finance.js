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
    title: '财务',
    name: '财务',
    path: '/finance/rechargeRecord/index',
    show: true,
    icon: 'icon-zuocedaohang-caiwu',
    zIndex: 70,
    perm:'',
    children: {
        rechargeRecord: {
            title: '充值记录',
            name: '充值记录',
            icon: "icon-kaidianxing-chongzhijilu",
            perm:'finance.recharge.view',
            path: '/finance/rechargeRecord/index'
        },
        withdrawalApplication: {
            title: '提现申请',
            name: '提现申请',
            icon: "icon-kaidianxing-tixianshenqing",
            perm:'finance.withdraw.view',
            path: '/finance/withdrawalApplication/index',
            show: true,
        },
        pointsDetails: {
            title: '积分明细',
            name: '积分明细',
            icon: "icon-kaidianxing-jifenmingxi",
            perm:'finance.credit.view',
            path: '/finance/pointsDetails/index'
        },
        balanceDetails: {
            title: '余额明细',
            name: '余额明细',
            icon: "icon-kaidianxing-yuemingxi",
            perm:'finance.balance.view',
            path: '/finance/balanceDetails/index'
        },
        redpacketDetails: {
            title: '红包明细',
            name: '红包明细',
            icon: "icon-kaidianxing-hongbaomingxi-1",
            perm:'finance.red_package.view',
            path: '/finance/redpacketDetails/index'
        },
        refundRecord: {
            title: '退款记录',
            name: '退款记录',
            icon: "icon-kaidianxing-tuikuanjilu",
            perm: 'finance.refund_log.view',
            path: '/finance/refundRecord/index'
        },
    }
}
