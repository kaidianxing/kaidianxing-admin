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
export const wxTransactionComponentApi = {
    // 获取列表
    getList: {
        method: 'get',
        api: 'manage/wxTransactionComponent/index/index'
    },
    // 获取分类类目
    getCategory: {
        method: 'get',
        api: 'manage/wxTransactionComponent/index/get-cat'
    },
    // 添加商品
    addGoods: {
        method: 'post',
        api: 'manage/wxTransactionComponent/index/add'
    },
    // 同步刷新
    syncRefresh: {
        method: 'get',
        api: 'manage/wxTransactionComponent/index/get-status'
    },
    // 提交审核
    submitAudit: {
        method: 'post',
        api: 'manage/wxTransactionComponent/index/update-goods'
    },
    // 上下架
    updateStatus: {
        method: 'post',
        api: 'manage/wxTransactionComponent/index/update-status'
    },
    // 撤回审核
    recallAudit: {
        method: 'post',
        api: 'manage/wxTransactionComponent/index/reset-audit'
    },
    // 删除商品
    deleteGoods: {
        method: 'post',
        api: 'manage/wxTransactionComponent/index/delete'
    },
    // 免审核更新
    updateExemption: {
        method: 'post',
        api: 'manage/wxTransactionComponent/index/exemption-update'
    },
    // 获取其类目列表
    getCategoryList: {
        method: 'get',
        api: 'manage/wxTransactionComponent/wx-audit-category/index'
    },
    // 添加类目审核
    addCategoryAudit: {
        method: 'post',
        api: 'manage/wxTransactionComponent/wx-audit-category/add'
    },
    // 获取类目审核详情
    getCategoryAuditDetail: {
        method: 'post',
        api: 'manage/wxTransactionComponent/wx-audit-category/edit'
    },
    // 删除类目审核
    deleteCategoryAudit: {
        method: 'post',
        api: 'manage/wxTransactionComponent/wx-audit-category/delete'
    },
    // 同步更新审核状态
    updateCategoryAuditStatus: {
        method: 'get',
        api: 'manage/wxTransactionComponent/wx-audit-category/get-status'
    },
    // 获取审核商品详情
    getAuditGoodsDetail: {
        method: 'post',
        api: 'manage/wxTransactionComponent/index/edit'
    },
    // 获取配置参数
    getConfigParam: {
        method: 'get',
        api: 'manage/wxTransactionComponent/settings/get-url'
    },
    // 获取定向设置
    getDevelopment: {
        method: 'get',
        api: 'manage/wxTransactionComponent/settings/development-get'
    },
    // 保存定向设置
    saveDevelopment: {
        method: 'post',
        api: 'manage/wxTransactionComponent/settings/development-set'
    },
}
