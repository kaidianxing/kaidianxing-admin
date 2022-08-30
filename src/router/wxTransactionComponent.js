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
// 自定义交易组件
import Layout from '@/views/layout/index.vue'

export default [
    {
        name: '上传商品',
        component: Layout,
        path: '/wxTransactionComponent',
        perm: '',
        children: [
            {
                name: '上传商品',
                path: '/wxTransactionComponent/index',
                perm: 'wxTransactionComponent.index.view',
                component: () => import('@/views/wxTransactionComponent/index.vue')
            },
            {
                name: '类目管理',
                path: '/wxTransactionComponent/category-manage',
                perm: 'wxTransactionComponent.category.manage',
                component: () => import('@/views/wxTransactionComponent/categoryManage/index.vue')
            },
            {
                name: '配置参数',
                path: '/wxTransactionComponent/config-param',
                perm: '',
                component: () => import('@/views/wxTransactionComponent/configParam/index.vue')
            }
        ]
    }

];
