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
export const marketApi = {
    //获取满额立减设置
    getFullfil: {
        method: 'get',
        api: 'manage/sale/basic/enough/'
    },
    //修改满额立减
    editFulfil: {
        method: 'post',
        api: 'manage/sale/basic/enough/edit'
    },
    //修改满额包邮设置
    editMailFree: {
        method: 'post',
        api: 'manage/sale/basic/enough-free/edit'
    },
    //获取满额包邮设置
    getMailFree: {
        method: 'get',
        api: 'manage/sale/basic/enough-free/'
    },
    //获取抵扣设置
    getDeduction: {
        method: 'get',
        api: 'manage/sale/basic/deduct'
    },
    //设置余额抵扣
    editDeduction: {
        method: 'post',
        api: 'manage/sale/basic/deduct/edit'
    },
    //获取全部优惠券
    getCouponAllList: {
        method: 'get',
        api: 'manage/sale/coupon-list'
    },
    // 获取优惠券详情
    getCoupon: {
        method: 'get',
        api: 'manage/sale/coupon-list/detail'
    },
    // 修改发放状态
    setSendState: {
        method: 'get',
        api: 'manage/sale/coupon-list/change-state'
    },
    // 添加优惠券
    addCoupon: {
        method: 'post',
        api: 'manage/sale/coupon-list/add'
    },
    // 修改优惠券
    editCoupon: {
        method: 'post',
        api: 'manage/sale/coupon-list/edit'
    },
    // 删除优惠券
    deleteCoupon: {
        method: 'get',
        api: 'manage/sale/coupon-list/delete'
    },
    // 获取新人发券
    getNewCoupon: {
        method: 'get',
        api: 'manage/sale/coupon/new-send/'
    },
    // 新增新人发券
    addNewCoupon: {
        method: 'post',
        api: 'manage/sale/coupon/new-send/update'
    },
    // 获取满额送券
    getFullSendList: {
        method: 'get',
        api: 'manage/sale/coupon/send-enough'
    },
    // 获取满额送券
    getFullSend: {
        method: 'get',
        api: 'manage/sale/coupon/send-enough/detail'
    },
    // 修改满额送券活动状态
    setFullSendActivityStatus: {
        method: 'post',
        api: 'manage/sale/coupon/send-enough/change-status'
    },
    // 新增满额送券
    addFullSend: {
        method: 'post',
        api: 'manage/sale/coupon/send-enough/add'
    },
    // 修改满额送券
    editFullSend: {
        method: 'post',
        api: 'manage/sale/coupon/send-enough/edit'
    },
    // 删除满额送券
    deleteFullSend: {
        method: 'post',
        api: 'manage/sale/coupon/send-enough/delete'
    },
    // 购物送券列表
    getShopSendList: {
        method: 'get',
        api: 'manage/sale/coupon/send-buy'
    },
    // 购物送券
    getShopSend: {
        method: 'get',
        api: 'manage/sale/coupon/send-buy/detail'
    },
    // 新增购物送券
    addShopSend: {
        method: 'post',
        api: 'manage/sale/coupon/send-buy/add'
    },
    // 修改购物送券
    editShopSend: {
        method: 'post',
        api: 'manage/sale/coupon/send-buy/edit'
    },
    // 购物送券活动状态
    setShopSendActivityStatus: {
        method: 'post',
        api: 'manage/sale/coupon/send-buy/change-status'
    },
    // 删除购物送券
    deleteShopSend: {
        method: 'post',
        api: 'manage/sale/coupon/send-buy/delete'
    },
    // 获取其他设置
    getOtherSetting: {
        method: 'get',
        api: 'manage/sale/coupon-set/get-info'
    },
    // 保存其他设置
    saveOtherSetting: {
        method: 'post',
        api: 'manage/sale/coupon-set/update'
    }
};
