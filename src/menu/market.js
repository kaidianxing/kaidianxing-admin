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
 *  title: '商品',左侧菜单中的名称
 *  name: '商品管理'
 *  path: '/goods',//点击后跳转的地址，没有则作为分组
 *  show: true,//是否在菜单中显示,不写默认true
 *  children:‘’//子菜单
 *  components: 文件路径
 * 需要添加其他参数随意添加
 */
export default {
    title: '营销',
    name: '营销',
    path: '/market/full-mail',
    icon: 'icon-zuocedaohang-yingxiao-',
    show: true,
    zIndex:60,
    perm:'',
    children: {
        fullMail: {
            title: '满额包邮',
            name: '满额包邮',
            path: '/market/full-mail',
            icon: "icon-kaidianxing-manebaoyou",
            perm:'sale.basic.free.view',
            show: true
        },
        coupon: {
            title: '优惠券',
            name: '优惠券',
            path: '/market/coupons/all-list',
            icon: "icon-kaidianxing-youhuiquan",
            perm:'',
            children: {
                couponsAll: {
                    title: '全部优惠券',
                    name: '全部优惠券',
                    path: '/market/coupons/all-list',
                    perm:'sale.coupon-list.view',
                    show: true,
                    children: {
                        addCoupons: {
                            title: '添加优惠券',
                            path: '/market/coupons/base/add',
                            perm:'',
                            showSubMenu:true,
                            showBackBtn:true,
                            show: false
                        },
                        editCoupons: {
                            title: '修改优惠券',
                            path: '/market/coupons/base/edit',
                            perm:'',
                            showSubMenu:true,
                            showBackBtn:true,
                            show: false
                        }
                    }
                },
                otherSetting: {
                    title: '其它设置',
                    name: '其它设置',
                    path: '/market/coupons/other-setting',
                    perm:'sale.coupon-set.view',
                    show: true
                }
            }
        },
        // otherTools: {
        //     title: '其他工具',
        //     name: '其他工具',
        //     path: '/market/other-tool'
        // }
    }
};
