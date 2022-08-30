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

export const creditShopApi = {
    // 获取积分商品列表
    getList: {
        method: 'get',
        api: 'manage/creditShop/list/index'
    },
    // 获取积分商品详情
    getCreditShopData: {
        method: 'get',
        api: 'manage/creditShop/list/detail'
    },
    // 添加积分商品
    addCreditShop: {
        method: 'post',
        api: 'manage/creditShop/list/add'
    },
    // 编辑积分商品
    editCreditShop: {
        method: 'post',
        api: 'manage/creditShop/list/edit'
    },
    // 删除商品
    deleteGood: {
        method:  'post',
        api: 'manage/creditShop/list/delete'
    },
    // 修改上下架状态
    changeStatus: {
        method: 'post',
        api: 'manage/creditShop/list/change-status'
    },
    // 获取设置
    getSetting: {
        method: 'get',
        api: 'manage/creditShop/setting/get'
    },
    // 修改设置
    setSetting: {
        method: 'post',
        api: 'manage/creditShop/setting/set'
    },
    // 营销概览
    getOverview: {
        method: "get",
        api: "manage/creditShop/statistics/index"
    },
    // 曝光量
    getExposure: {
        method: "get",
        api: "manage/creditShop/statistics/statistics"
    },
    // 销售额占比
    getChannelData: {
        method: "get",
        api: "manage/creditShop/statistics/channel"
    },
    // 商品排行
    getGoodsRank: {
        method: "get",
        api: "manage/creditShop/statistics/goods-rank"
    },
    // 会员排行
    getMemberRank: {
        method: "get",
        api: "manage/creditShop/statistics/member-rank"
    }
}