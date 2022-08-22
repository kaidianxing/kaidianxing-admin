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

/**
 * vuex的配置
 *
 */
import Layout from '@/views/layout/index.vue'

export default [
    {
        name: '设置',
        path: '/setting/shopSetting/baseSetting/index',
        perm: '',
        component: Layout,
        children: [
            {
                name: '地址物流',
                perm: 'sysset.express.view',
                path: '/setting/address/logistics',
                component: () => import('@/views/setting/address/logistics.vue')
            },
            {
                name: '地址配置',
                perm: 'sysset.address_set.view',
                path: '/setting/address/area',
                component: () => import('@/views/setting/address/area.vue')
            },
            {
                name: '退货地址',
                perm: 'sysset.refund_address.view',
                path: '/setting/address/refundAddress/list',
                component: () =>
                        import('@/views/setting/address/refundAddress/list.vue')
            },
            {
                name: '添加退货地址',
                perm: 'sysset.refund_address.manage',
                path: '/setting/address/refundAddress/:type',
                component: () =>
                        import('@/views/setting/address/refundAddress/index.vue')
            },
            {
                name: '支付证书验证',
                path: '/setting/tool/payLCE',
                perm: '',
                component: () => import('@/views/setting/tool/payLCE.vue')
            },
            {
                name: '七牛修复',
                path: '/setting/tool/qiNiu',
                perm: '',
                component: () => import('@/views/setting/tool/qiNiu.vue')
            },
            {
                name: '基础设置',
                perm: 'sysset.mall.basic.view',
                path: '/setting/shopSetting/baseSetting/index',
                component: () =>
                        import('@/views/setting/shopSetting/baseSetting/index.vue')
            },
            {
                name: '分享设置',
                path: '/setting/shopSetting/shareSetting/index',
                perm: 'sysset.mall.share.view',
                component: () =>
                        import('@/views/setting/shopSetting/shareSetting/index.vue')
            },
            {
                name: '公告管理',
                path: '/setting/shopSetting/announcementManagement/index',
                perm: 'sysset.mall.notice.view',
                component: () =>
                        import('@/views/setting/shopSetting/announcementManagement/index.vue')
            },
            {
                name: '联系我们',
                path: '/setting/shopSetting/contactUs/index',
                perm: '',
                component: () =>
                        import('@/views/setting/shopSetting/contactUs/index.vue')
            },
            {
                name: '添加公告',
                path: '/setting/shopSetting/announcementManagement/add',
                perm: 'sysset.mall.notice.manage',
                component: () =>
                        import('@/views/setting/shopSetting/announcementManagement/add.vue')
            },
            {
                name: '交易设置',
                path: '/setting/business/index',
                perm: 'sysset.trade.view',
                component: () => import('@/views/setting/business/index.vue')
            },
            {
                name: '维权设置',
                path: '/setting/safeguard/index',
                perm: 'sysset.refund.view',
                component: () => import('@/views/setting/safeguard/index.vue')
            },
            // {   // 已拆分成积分设置和余额设置
            //     name: '积分余额',
            //     path: '/setting/integral/index',
            //     perm: 'sysset.credit.view',
            //     component: () => import('@/views/setting/integral/index.vue')
            // },
            {
                name: '积分设置',
                path: '/setting/credit/index',
                // perm: 'sysset.credit.view',
                component: () => import('@/views/setting/credit/index.vue')
            },
            {
                name: '余额设置',
                path: '/setting/balance/index',
                // perm: 'sysset.credit.view',
                component: () => import('@/views/setting/balance/index.vue')
            },
            {
                name: '注册设置',
                component: () => import('@/views/setting/register/index.vue'),
                perm: 'channel.registry.view',
                path: '/setting/register',
            },
            {
                name: '支付方式',
                path: '/setting/paymentSettings/way/index',
                perm: 'sysset.pay-type_set.view',
                component: () => import('@/views/setting/paymentSettings/way/index.vue')
            },
            {
                name: '打款设置',
                path: '/setting/paymentSettings/payments/index',
                perm: 'sysset.pay_set.view',
                component: () =>
                        import('@/views/setting/paymentSettings/payments/index.vue')
            },
            {
                name: '支付模板设置',
                path: '/setting/paymentSettings/mould/list',
                perm: 'sysset.pay_template_set.view',
                component: () =>
                        import('@/views/setting/paymentSettings/mould/list.vue')
            },
            {
                name: '推广佣金设置',
                path: '/setting/extensionSetting/commission',
                perm: 'merchant_sysset.commission.view',
                component: () =>
                        import('@/views/setting/extensionSetting/index.vue')
            },
            {
                name: '添加模板',
                path: '/setting/paymentSettings/mould/:type',
                perm: 'sysset.pay_template_set.manage',
                component: () =>
                        import('@/views/setting/paymentSettings/mould/addMould.vue')
            },
            {
                name: '角色管理',
                path: '/setting/systemAuthority/roleManagement',
                perm: 'user.role.view',
                component: () =>
                        import('@/views/setting/systemAuthority/roleManagement/index.vue')
            },
            {
                name: '添加角色',
                path: '/setting/systemAuthority/roleManagement/add',
                perm: 'user.role.manage',
                component: () =>
                        import('@/views/setting/systemAuthority/roleManagement/add.vue')
            },
            {
                name: '操作员管理',
                path: '/setting/systemAuthority/operatorManagement',
                perm: 'user.index.view',
                component: () =>
                        import('@/views/setting/systemAuthority/operatorManagement/index.vue')
            },
            {
                name: '添加操作员',
                path: '/setting/systemAuthority/operatorManagement/add',
                perm: 'user.index.manage',
                component: () =>
                        import('@/views/setting/systemAuthority/operatorManagement/add.vue')
            },
            {
                name: '操作日志',
                path: '/setting/systemAuthority/operationLog',
                perm: 'sysset.log.view',
                component: () =>
                        import('@/views/setting/systemAuthority/operationLog/index.vue')
            },
            {
                name: '操作详情',
                path: '/setting/systemAuthority/operationLog/detail',
                perm: 'sysset.log.view',
                component: () =>
                        import('@/views/setting/systemAuthority/operationLog/detail.vue')
            },
            // {
            //     name: '应用安装',
            //     component: () => import('@/views/setting/system/app/index.vue'),
            //     perm: 'system.apps.index.view',
            //     path: '/setting/system/apps/install'
            // },
            {
                name: '数据管理',
                component: () => import('@/views/setting/system/tools/crontab.vue'),
                perm: 'system.tools.crontab.view',
                path: '/setting/system/tools/crontab'
            },
            {
                name: "附件设置",
                component: () => import('@/views/setting/system/attachment/index.vue'),
                perm: 'system.attachment.view',
                path: '/setting/system/attachment'
            },
            {
                name: '远程存储',
                component: () => import('@/views/setting/system/storage/index.vue'),
                perm: 'system.storage.view',
                path: '/setting/system/storage'
            },
            {
                name: '清除缓存',
                component: () => import('@/views/setting/system/tools/cache.vue'),
                perm: 'system.tools.cache.view',
                path: '/setting/system/tools/cache'
            },
            {
                name: '系统升级',
                component: () => import('@/views/setting/system/upgrade/index.vue'),
                perm: 'system.upgrade.view',
                path: "/setting/system/upgrade/index",
            },
        ]
    }
]
