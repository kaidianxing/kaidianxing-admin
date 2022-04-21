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
 * @Description:快递助手
 * @author Gao
 * @date 2021/12/16
 */
export const eOrderApi = {
    // 快递模板添加
    addExpressTemp: {
        method: 'post',
        api: 'manage/expressHelper/express-template/add',
    },
    // 快递模板编辑
    editExpressTemp: {
        method: 'post',
        api: 'manage/expressHelper/express-template/edit',
    },
    // 快递模板获取详情
    getExpressTempDetail: {
        method: 'get',
        api: 'manage/expressHelper/express-template/edit',
    },
    // 快递模板获取详情(获取模板样式)
    getExpressTempStyle: {
        method: 'get',
        api: 'manage/expressHelper/express-template/add',
    },
    // 快递模板列表
    getExpressTempList: {
        method: 'get',
        api: 'manage/expressHelper/express-template/list',
    },
    // 电子面单模板列表(简单列表)（打印时调用）
    getEOrderTempSimpleList: {
        method: 'get',
        api: 'manage/expressHelper/express-template/simple-list',
    },
    // 发件人模板列表(简单列表)(打印时调用)
    getSenderTempSimpleList: {
        method: 'get',
        api: 'manage/expressHelper/consigner-template/simple-list',
    },
    // 快递模板删除
    deleteExpressTemp: {
        method: 'post',
        api: 'manage/expressHelper/express-template/delete',
    },
    // 快递模板切换默认
    switchExpressTempDefault: {
        method: 'post',
        api: 'manage/expressHelper/express-template/switch',
    },
    // 发件人模板列表
    getSenderTempList: {
        method: 'get',
        api: 'manage/expressHelper/consigner-template/list',
    },
    // 删除发件人模板
    deleteSenderTemp: {
        method: 'post',
        api: 'manage/expressHelper/consigner-template/delete',
    },
    // 切换发件人模板默认
    switchSenderTempDefault: {
        method: 'post',
        api: 'manage/expressHelper/consigner-template/switch',
    },
    // 添加发件人模板
    addSenderTemp: {
        method: 'post',
        api: 'manage/expressHelper/consigner-template/add',
    },
    // 编辑发件人模板
    editSenderTemp: {
        method: 'post',
        api: 'manage/expressHelper/consigner-template/edit',
    },
    // 获取发件人模板详情
    getSenderTempDetail: {
        method: 'get',
        api: 'manage/expressHelper/consigner-template/edit',
    },
    // 设置基础设置
    setBasicSetting: {
        method: 'post',
        api: 'manage/expressHelper/index/set',
    },
    // 获取基础设置
    getBasicSetting: {
        method: 'get',
        api: 'manage/expressHelper/index/get',
    },
    // 获取订单列表
    getOrderList: {
        method: 'get',
        api: 'manage/expressHelper/order/list',
    },
    // 订单打印
    orderPrint: {
        method: 'post',
        api: 'manage/expressHelper/print',
    },
    // 订单打印回调
    printCallback: {
        method: 'post',
        api: 'manage/expressHelper/print/callback',
    },
    // 发货单打印回调
    printSendCallback: {
        method: 'post',
        api: 'manage/expressHelper/print/bill-print-callback'
    },
    // 测试打印
    testPrint: {
        method: 'post',
        api: 'manage/expressHelper/express-template/test-print',
    },
    // 发货单列表
    getInvoiceList: {
        method: 'get',
        api: 'manage/expressHelper/send-bill-template/list'
    },
    // 删除发货单
    deleteInvoice: {
        method: 'post',
        api: 'manage/expressHelper/send-bill-template/delete'
    },
    // 获取发货模板详情
    getInvoice: {
        method: 'get',
        api: 'manage/expressHelper/send-bill-template/edit'
    },
    // 添加发货模板
    addInvoice: {
        method: 'post',
        api: 'manage/expressHelper/send-bill-template/add'
    },
    // 修改发货模板
    editInvoice: {
        method: 'post',
        api: 'manage/expressHelper/send-bill-template/edit'
    },
    // 获取发货模板checkedlist
    getInvoiceCheckedList: {
        method: 'get',
        api: 'manage/expressHelper/send-bill-template/get-content-list'
    },
    // 设置发货模板默认
    setInvoiceDefault: {
        method: 'post',
        api: 'manage/expressHelper/send-bill-template/switch'
    },
    // 获取发货单模板列表不分页 select使用
    getInvoiceTemplateList: {
        method: 'get',
        api: 'manage/expressHelper/send-bill-template/simple-list'
    },
    // 获取模板信息
    getInvoiceTemplate: {
        method: 'get',
        api: 'manage/expressHelper/send-bill-print/get-template-data'
    },
    // 发货单打印
    invoicePrint: {
        method: 'post',
        api: 'manage/expressHelper/send-bill-print/index'
    },
    // 检测订单打印前的校验，是否可正常打印
    validOrderPrint: {
        method: 'post',
        api: 'manage/expressHelper/print/check-sub'
    },

}