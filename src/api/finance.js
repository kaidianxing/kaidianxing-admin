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
export const financeApi = {
    // 佣金提现导出
    withdrawExport: {
        method: 'get',
        api:
            'manage/merchant/platform/merchant/commission/withdraw/export',
    },
    // 推广记录_导出
    commissionExport: {
        method: 'get',
        api: 'manage/merchant/platform/merchant/commission/record/export',
    },
    // 推广明细列表
    getCommissionListRecord: {
        method: 'get',
        api: 'manage/merchant/platform/merchant/commission/record/list',
    },
    //拒绝
    doReject: {
        method: 'post',
        api:
            'manage/merchant/platform/merchant/commission/withdraw/refuse',
    },
    //手动打款
    doWithdrawApply: {
        method: 'post',
        api:
            'manage/merchant/platform/merchant/commission/withdraw/manual-remit',
    },
    // 自动打款
    autoWithdrawApply: {
        method: 'post',
        api: 'manage/merchant/platform/merchant/commission/withdraw/remit',
    },
    // 佣金提现_获取列表
    getCommissionList: {
        method: 'get',
        api: 'manage/merchant/platform/merchant/commission/withdraw/list',
    },
    // 充值记录列表
    getRechargeList: {
        method: 'get',
        api: 'manage/finance/log/recharge',
    },
    // 提现记录列表
    getWithdrawList: {
        method: 'get',
        api: 'manage/finance/log/withdraw',
    },
    // 提现审核
    updateStatus: {
        method: 'post',
        api: 'manage/finance/log/update-status',
    },
    // 充值退款
    rechargeRefund: {
        method: 'post',
        api: 'manage/finance/log/recharge-refund',
    },
    // 提现申请
    withdrawApply: {
        method: 'post',
        api: 'manage/finance/log/withdraw-apply',
    },
    // 获取申请提现筛选标签
    getWithdrawApplyLabel: {
        method: 'get',
        api: 'manage/finance/log/label',
    },
    // 获取积分余额筛选标签
    getReditRecordLabel: {
        method: 'get',
        api: 'manage/finance/credit-record/label',
    },
    // 积分列表
    getIntegralList: {
        method: 'get',
        api: 'manage/finance/credit-record/integral',
    },
    // 余额列表
    getBalanceList: {
        method: 'get',
        api: 'manage/finance/credit-record/balance',
    },
    // 红包列表
    getRedpacketList: {
        method: 'get',
        api: 'manage/finance/red-package/list',
    },
    // 短信数量购买记录
    getBuySmsList: {
        method: 'get',
        api: 'manage/finance/counter-record/sms-list',
    },
    // 退款记录列表
    getRefundList: {
        method: 'get',
        api: 'manage/finance/refund-log/list',
    },
    // 获取退款记录筛选条件
    getRefundType: {
        method: 'get',
        api: 'manage/finance/refund-log/type-list',
    },
    // 导出
    export: {
        method: 'get',
        api: 'manage/finance/refund-log/export',
    },
    // 审核列表页面
    getStateList: {
        method: 'get',
        api: 'manage/finance/refund-log/getStateList',
    },

    // 提现详情
    getWithdrawalDetails: {
        method: 'get',
        api: 'manage/merchant/platform/finance/index/detail',
    },
    // 申请提现详情订单
    getFnOrderList: {
        method: 'get',
        api: 'manage/merchant/platform/finance/index/order-list',
    },
    // 导出
    eporder: {
        method: 'get',
        api:
            'manage/merchant/platform/finance/index/order-export',
    },
    // 审核通过
    platformSuccess: {
        method: 'get',
        api: 'manage/merchant/platform/finance/index/success',
    },
    // 拒绝申请
    platformReject: {
        method: 'get',
        api: 'manage/merchant/platform/finance/index/reject',
    },
    // 手动打款
    manualPay: {
        method: 'get',
        api: 'manage/merchant/platform/finance/index/manual-pay',
    },
    //  打款
    doManualPay: {
        method: 'get',
        api: 'manage/merchant/platform/finance/index/pay',
    },
}
