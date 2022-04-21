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
/**
 * 重定向优先路由；
 * 从上往下的第一个有权限的路由为重定向路由
 */
const routes = [{
        module: 'home',
        path: [
            '/home/index/index',
        ]
    },
    {
        module: 'shop',
        path: [
            '/shop/list/system',
            '/shop/apply',
            '/shop/module/custom',
            '/shop/custom-menu',
            '/shop/setting/menu',
        ]
    },
    {
        module: 'goods',
        path: [
            '/goods/list/inSale',
            '/goods/list/soldOut',
            '/goods/list/inStock',
            '/goods/list/inRecycle',
            '/goods/classify',
            '/goods/classify/setting-level',
            '/goods/group',
            '/goods/label',
        ]
    }, {
        module: 'order',
        path: [
            '/order/list/send',
            '/order/list/payment',
            '/order/list/receive',
            '/order/list/achieve',
            '/order/list/close',
            '/order/list/all',
            '/order/list/refund',
            '/order/evaluate',
            '/order/batch-delivery',
            '/order/custom-export',
            '/order/ordinary-express',
        ]
    }, {
        module: 'vip',
        path: [
            '/member/list',
            '/member/grade/list',
            '/member/group',
            '/member/rankingList',
            '/member/setting',
        ]
    }, {
        module: 'market',
        path: [
            '/market/full-reduction',
            '/market/full-mail',
            '/market/deduction-setting',
            '/market/coupons/all-list',
            '/market/coupons/send/new',
            '/market/coupons/other-setting',
            '/market/other-tool',
        ]
    }, {
        module: 'finance',
        path: [
            '/finance/rechargeRecord/index',
            '/finance/withdrawalApplication/index',
            '/finance/pointsDetails/index',
            '/finance/balanceDetails/index',
            '/finance/order'
        ]
    }, {
        module: 'data',
        path: [
            '/member/transaction',
            '/member/goods',
            '/member/vip',
            '/member/consume',
        ]
    }, {
        module: 'channel',
        path: [
            '/channel/manage',
            '/channel/register',
        ]
    }, {
        module: 'plugins',
        path: [
            '/plugins/center/index',
        ]
    }, {
        module: 'setting',
        path: [
            '/setting/shopSetting/baseSetting/index',
            '/setting/shopSetting/shareSetting/index',
            '/setting/shopSetting/announcementManagement/index',
            '/setting/business/index',
            '/setting/safeguard/index',
            '/setting/integral/index',
            '/setting/paymentSettings/way/index',
            '/setting/paymentSettings/payments/index',
            '/setting/paymentSettings/mould/list',
            '/setting/address/logistics',
            '/setting/address/area',
            '/setting/address/refundAddress/list',
            '/setting/notice/index',
            '/setting/notice/tmessage/list',
            '/setting/notice/weixinTemplate/list',
            '/setting/sms/list',
            '/setting/sms/set',
            '/setting/sms/code',
            '/setting/tool/payLCE',
            '/setting/tool/qiNiu',
            '/setting/systemAuthority/roleManagement',
            '/setting/systemAuthority/operatorManagement',
            '/setting/systemAuthority/operationLog',
        ]
    }
]
let paths = []
let pathMap = {}
for (let val of routes) {
    paths = paths.concat(val.path)
    pathMap[val.module] = val.path;
}
export default path => {
    let tmp = path.split('/')[1];
    if (pathMap[tmp]) { 
        return  pathMap[tmp].concat(paths);//优先本模块内的页面
    }
    return paths;
}
