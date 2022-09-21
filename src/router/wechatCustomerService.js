
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
// 消费奖励
import Layout from '@/views/layout/index.vue'
export default [
    {
        name: '企业管理',
        component: Layout,
        path: '/wechatCustomerService',
        perm: '',
        children: [
            {
                name: '企业管理',
                path: '/wechatCustomerService/manage/company/index',
                perm: 'wechatCustomerService.company.view',
                component: () =>
                    import('@/views/wechatCustomerService/manage/company/index.vue'),
            },
            {
                name: '客服管理',
                path: '/wechatCustomerService/manage/service/index',
                perm: 'wechatCustomerService.customer-service.view',
                component: () =>
                    import('@/views/wechatCustomerService/manage/service/index.vue'),
            },
        ] 
    },
]
