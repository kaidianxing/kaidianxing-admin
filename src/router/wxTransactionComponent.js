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
