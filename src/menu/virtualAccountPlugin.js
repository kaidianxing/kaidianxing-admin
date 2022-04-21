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
    title: '卡密库',
    name: '卡密库',
    show: false,
    path: '/virtualAccount/library/list',
    perm:'',
    children: {
        virtualAccount: {
            title: '卡密库',
            name: '卡密库',
            path: '/virtualAccount/library/list',
            pluginName: 'virtualAccount',
            perm: ($router, $store) => {
                if (20 === +$store.state?.account?.shop?.shopType) {
                    return false;
                } else {
                    return  ['virtualAccount.index.view'].some(item => $store.state.config.user?.perms?.indexOf(item) > -1)
                }
            },
            children: {
                virtualAccountAdd: {
                    title: '创建卡密库',
                    name: '创建卡密库',
                    path: '/virtualAccount/library/add',
                    pluginName: 'virtualAccount',
                    perm: 'virtualAccount.index.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
                virtualAccountEdit: {
                    title: '编辑卡密库',
                    name: '编辑卡密库',
                    path: '/virtualAccount/library/edit',
                    pluginName: 'virtualAccount',
                    perm: 'virtualAccount.index.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
                virtualAccountDataAdd: {
                    title: '添加卡密数据',
                    name: '添加卡密数据',
                    path: '/virtualAccount/library/data/index',
                    pluginName: 'virtualAccount',
                    perm: 'virtualAccountData.index.manage',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
                virtualAccountDataView: {
                    title: '查看卡密数据',
                    name: '查看卡密数据',
                    path: '/virtualAccount/library/data/list',
                    pluginName: 'virtualAccount',
                    perm: 'virtualAccountData.index.view',
                    show: false,
                    showSubMenu:true,
                    showBackBtn:true,
                },
            }
        },
        virtualAccountSet: {
            title: '设置',
            name: '设置',
            path: '/virtualAccount/set/index',
            pluginName: 'virtualAccount',
            perm: 'virtualAccount.setting.view',
        },
        virtualAccountRecycle: {
            title: '回收站',
            name: '回收站',
            path: '/virtualAccount/recycle/index',
            pluginName: 'virtualAccount',
            perm: 'virtualAccount.recycleBin.view',
        },
    }
}
