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
export const orderApi = {
    // 全部订单
    getAllList: {
        method: 'get',
        api: 'manage/order/list/index'
    },
    // 待发货
    getSendList: {
        method: 'get',
        api: 'manage/order/list/send'
    },
    // 待付款
    getPaymentList: {
        method: 'get',
        api: 'manage/order/list/pay'
    },
    // 待收货
    getReceiveList: {
        method: 'get',
        api: 'manage/order/list/pick'
    },
    // 已完成
    getAchieveList: {
        method: 'get',
        api: 'manage/order/list/success'
    },
    // 已关闭
    getCloseList: {
        method: 'get',
        api: 'manage/order/list/close'
    },
    // 订单类型
    getOrderType: {
        method: 'get',
        api: 'manage/order/list/activity-type'
    },
    // 商品类型
    getGoodsType: {
        method: 'get',
        api: 'manage/order/list/goods-type'
    },
    // 维权列表
    getRefundList: {
        method: 'get',
        api: 'manage/order/list/refund'
    },
    // 订单详情
    getOrderDetail: {
        method: 'get',
        api: 'manage/order/detail/index'
    },
    // 修改佣金信息查询
    getCommisionInfo: {
        method: 'get',
        api: 'manage/commission/order/get-commission'
    },
    // 修改佣金
    editCommisionInfo: {
        method: 'post',
        api: 'manage/commission/order/change-commission'
    },
    // 获取商品发货信息
    getSendGoods: {
        method: 'get',
        api: 'manage/order/op/send-package'
    },
    // 订单发货
    setSendGoods: {
        method: 'post',
        api: 'manage/order/op/send-package'
    },
    // 订单批量发货
    setMultipleSendGoods: {
        method: 'post',
        api: 'manage/order/op/batch-send'
    },
    // 获取订单物流信息
    getReceiveGoods: {
        method: 'get',
        api: 'manage/order/op/change-send'
    },
    // 修改物流信息
    editExpress: {
        method: 'post',
        api: 'manage/order/op/change-send'
    },
    // 退款
    refundOrder: {
        method: 'post',
        api: 'manage/order/op/close-and-refund'
    },
    // 获取收货信息
    getTackGoodsAddress: {
        method: 'get',
        api: 'manage/order/op/edit-address'
    },
    // 修改收货地址
    editTackGoodsAddress: {
        method: 'post',
        api: 'manage/order/op/edit-address'
    },
    // 确认支付
    setPayment: {
        method: 'post',
        api: 'manage/order/op/pay'
    },
    // 获取物流信息
    getExpress: {
        method: 'get',
        api: 'manage/order/op/get-express'
    },
    // 获取改价信息
    getChangePrice: {
        method: 'get',
        api: 'manage/order/op/change-price-detail'
    },
    // 修改改价
    setChangePrice: {
        method: 'post',
        api: 'manage/order/op/change-price'
    },
    // 关闭订单
    closeOrder: {
        method: 'post',
        api: 'manage/order/op/close'
    },
    // 确认收货
    setFinishOrder: {
        method: 'post',
        api: 'manage/order/op/finish'
    },
    // 取消发货
    setCancelSendGoods: {
        method: 'post',
        api: 'manage/order/op/cancel-send'
    },
    // 获取已发货包裹
    getSendPackage: {
        method: 'get',
        api: 'manage/order/op/get-package'
    },
    // 自定义导出
    getCustomExport: {
        method: 'get',
        api: 'manage/order/diy-export/index'
    },
    // 订单改价记录
    getChangePriceRecord: {
        method: 'get',
        api: 'manage/order/op/change-price-log'
    },
    // 驳回申请
    refundRejectOrder: {
        method: 'post',
        api: 'manage/order/refund/reject'
    },
    // 手动退款
    manualRefund: {
        method: 'post',
        api: 'manage/order/refund/manual'
    },
    // 自动退款
    autoRefund: {
        method: 'post',
        api: 'manage/order/refund/refund-accept'
    },
    // 退货退款通过申请
    agreeReturn: {
        method: 'post',
        api: 'manage/order/refund/return-accept'
    },
    // 换货商家发出货物
    exchangeSend: {
        method: 'post',
        api: 'manage/order/refund/exchange-send'
    },
    exchangeClose: {
        method: 'post',
        api: 'manage/order/refund/exchange-close'
    },
    // 开发票
    changeInvoiceStatus: {
        method: 'post',
        api: 'manage/order/op/change-invoice-status'
    },
    // 获取下载批量发货模板
    downloadBatchSendTemplate: {
        method: 'get',
        api: 'manage/order/batch-send/download-template'
    },
    // 导入批量发货
    uploadBatchSend: {
        method: 'post',
        api: 'manage/order/batch-send/index'
    },
    // 获取评论列表
    getCommentList: {
        method: 'get',
        api: 'manage/order/comment/list'
    },
    // 获取评论详情
    getCommentData: {
        method: 'get',
        api: 'manage/order/comment/detail'
    },
    // 审核评论
    checkComment: {
        method: 'get',
        api: 'manage/order/comment/audit'
    },
    deleteComment: {
        method: 'post',
        api: 'manage/order/comment/delete'
    },
    // 回复评论
    replayComment: {
        method: 'post',
        api: 'manage/order/comment/reply'
    },
    // 获取评价方式
    getCommentType: {
        method: 'get',
        api: 'manage/order/comment/get-type'
    },
    // 查询快递信息
    queryExpress: {
        method: 'get',
        api: 'manage/order/refund/query-express'
    },
    // 新增配送方式
    addExpressStyle: {
        method: 'post',
        api: 'manage/order/dispatch/add'
    },
    // 修改配送方式
    editExpressStyle: {
        method: 'post',
        api: 'manage/order/dispatch/edit'
    },
   // 获取配送方式详情
    getExpressStyle: {
        method: 'get',
        api: 'manage/order/dispatch/detail'
    },
    // 配送方式列表
    getExpressStyleList: {
        method: 'get',
        api: 'manage/order/dispatch'
    },
    // 修改配送方式默认
    setExpressStyleDefault: {
        method: 'get',
        api: 'manage/order/dispatch/change-default'
    },
    // 修改配送方式状态
    setExpressStyleState: {
        method: 'post',
        api: 'manage/order/dispatch/change-state'
    },
    // 删除配送方式
    deleteExpressStyle: {
        method: 'post',
        api: 'manage/order/dispatch/delete'
    },
    // 获取所有的配送方式列表
    getExpressStyleAllList: {
        method: 'get',
        api: 'manage/order/dispatch/get-list'
    },
    // 获取默认配送方式
    getExpressStyleDefault: {
        method: 'get',
        api: 'manage/order/dispatch/get-default'
    },
    // 获取物流是否开启
    getDispatchEnable: {
        method: 'get',
        api: 'manage/sysset/express/dispatch-enable'
    },    
    // 普通快递开启关闭
    enableExpress: {
        method: 'post',
        api: 'manage/order/dispatch/enable'
    },
    // 获取联系人详情
    getContactDetail: {
        method: 'post',
        api: 'manage/sysset/mall/contact/detail'
    },
    // 保存联系人
    saveContact: {
        method: 'post',
        api: 'manage/sysset/mall/contact/save'
    },
    // 修改订单备注
    setOrderRemark: {
        method: 'post',
        api: 'manage/order/op/update-seller-remark'
    },
    // 获取配送方式
    getDeliveryList: {
        method: 'get',
        api: 'manage/order/list/dispatch-type'
    }
};
