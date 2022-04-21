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
 * vue-router配置，
 * 最终会被展开合并进入./index.js
 */
import Layout from '@/views/layout/index.vue'
export default [{
    name: '订单',
    component: Layout,
    path: '/order/list/:id',
    perm: '',
    children: [
        {
            name: '订单列表',
            path: '/order/list/:id',
            perm: ({path})=>{
                if(path=='/order/list/refund'){
                    return 'order.refund.view'
                }else{
                    return 'order.op.view'
                }
            },
            meta:{
                timestamp:true
            },
            component: () =>
                import ('@/views/order/list/index.vue')
        },
        {
            name: '订单详情',
            path: '/order/detail/:type',
            perm: 'order.op.view',
            component: () =>
                import ('@/views/order/detail/index.vue')
        },
        {
            name: '维权详情',
            path: '/order/refund-detail',
            perm: 'order.refund.view',
            component: () =>
                import ('@/views/order/refundDetail/refund/index.vue')
        },
        {
            name: '维权详情',
            path: '/order/exchange-goods-detail',
            perm: 'order.refund.view',
            component: () =>
                import ('@/views/order/refundDetail/ExchangeGoods/index.vue')
        },
        {
            name: '维权详情',
            path: '/order/returns-refunds-detail',
            perm: 'order.refund.view',
            component: () =>
                import ('@/views/order/refundDetail/ReturnsRefunds/index.vue')
        },
        {
            name: "评价管理",
            path: '/order/evaluate',
            perm: 'order.comment.view',
            meta:{
                timestamp:true
            },
            component: () =>
                import ('@/views/order/evaluate/index.vue')
        },
        {
            name: '评价审核',
            path: '/order/evaluate/audit',
            perm: 'order.comment.view',
            component: () =>
                import ('@/views/order/evaluate/audit/index.vue')
        },
        {
            name: '普通快递',
            path: '/order/ordinary-express',
            perm: 'order.dispatch.view',
            meta:{
                timestamp:true
            },
            component: () =>
              import ('@/views/order/ordinaryExpress/index.vue')
        },
        {
            name: '新建配送方式',
            path: '/order/ordinary-express/:id',
            perm: 'order.dispatch.manage',
            component: () =>
                import ('@/views/order/ordinaryExpress/add/index.vue')
        },
        {
            name: '改价记录',
            path: '/order/change-price-record',
            perm: 'order.op.view',
            component: () =>
                import('@/views/order/changePriceRecord/index.vue')
        }
    ]
}];
