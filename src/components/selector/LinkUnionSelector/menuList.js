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
 * @date 2021-09-10 13:49
 * @describe  链接选择器菜单列表  type属性 = 'Link' + 组件名称
 */
// default: LinkGoodsGroupLink,,LinkMerchants,'

const menuList = [
    {
        title: '商城',
        id: '1',
        menuItem: [
            {name: '商城页面', type: 'LinkStorePageLink'},
            {name: '自定义页面', type: 'LinkCustomPageLink'}
        ]
    },
    {
        title: '商品',
        id: '2',
        menuItem: [
            {name: '商品列表', type: 'LinkGoodsLink'},
            {name: '商品分类列表', type: 'LinkGoodsClassifyLink'},
        ]
    }, {
        title: '营销',
        id: '3',
        menuItem: [
            {name: '营销页面', type: 'LinkMarketingPage'},
            {name: '优惠券列表', type: 'LinkCouponLink'},
        ]
    }, {
        title: '应用',
        id: '4',
        menuItem: [
            {name: '应用插件页面', type: 'LinkApplicationPlug'},
            {name: '直播间选择器', type: 'LinkLiverLink'},
            {name: '视频号直播间', type: 'LinkVideoLiveLink'},
            {name: '视频号动态', type: 'LinkVideoRamLink'},
            {name: '积分商品', type: 'LinkCreditShopLink'},
            {name: '微信客服', type: 'LinkCustomerServiceLink'},
            {name: '专题文章', type: 'LinkArticleLink'},
        ]
    }, {
        title: '其他',
        id: '5',
        menuItem: [
            {name: '小程序跳转链接', type: 'LinkWxAppLink'},
            {name: '自定义链接', type: 'LinkCustomLink'},
        ]
    }


]
export default menuList
