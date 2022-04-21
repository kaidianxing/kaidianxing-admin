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
export const settingApi = {
    // 退货地址列表
    getRefundAddressList: {
        method: 'get',
        api: 'manage/sysset/refund-address',
    },
    // 删除退货地址
    deleteRefundAddress: {
        method: 'post',
        api: 'manage/sysset/refund-address/delete',
    },
    // 新增退货地址
    addRefundAddress: {
        method: 'post',
        api: 'manage/sysset/refund-address/add',
    },
    // 编辑退货地址
    editRefundAddress: {
        method: 'post',
        api: 'manage/sysset/refund-address/edit',
    },
    // 设置退货地址默认状态
    changeRefundDefault: {
        method: 'get',
        api: 'manage/sysset/refund-address/change-default',
    },
    // 退货地址详情
    detailRefundAddress: {
        method: 'get',
        api: 'manage/sysset/refund-address/detail',
    },
    // 获取物流信息配置
    getExpress: {
        method: 'get',
        api: 'manage/sysset/express',
    },
    // 保存物流设置
    addExpress: {
        method: 'post',
        api: 'manage/sysset/express/edit',
    },
    // 获取地址设置
    getAddressInfo: {
        method: 'get',
        api: 'manage/sysset/address-set/get-info',
    },
    // 获取地址设置
    setAddressInfo: {
        method: 'post',
        api: 'manage/sysset/address-set/update',
    },
    //获取基础设置
    getBaseSetting: {
        method: 'get',
        api: 'manage/sysset/mall/basic',
    },
    //删除商城
    deleleShop: {
        method: 'post',
        api: 'manage/sysset/mall/basic/delete',
    },
    //修改商城基础设置
    changeBaseSetting: {
        method: 'post',
        api: 'manage/sysset/mall/basic/edit'
    },
    // 编辑商城分享设置
    editShareSetting: {
        method: 'post',
        api: 'manage/sysset/mall/share/edit',
    },
    // 获取商城分享设置
    getShareSetting: {
        method: 'post',
        api: 'manage/sysset/mall/share',
    },
    // 获取交易设置
    getBusinessSetting: {
        method: 'post',
        api: 'manage/sysset/trade/get-info',
    },
    // 修改交易设置
    editBusinessSetting: {
        method: 'post',
        api: 'manage/sysset/trade/update',
    },
    // 获取维权设置
    getSafeguardSetting: {
        method: 'post',
        api: 'manage/sysset/refund/get-info',
    },
    // 修改维权设置
    editSafeguardSetting: {
        method: 'post',
        api: 'manage/sysset/refund/update',
    },
    getCreditSetting: {
        method: 'get',
        api: 'manage/sysset/credit/get-info'
    },
    // 更新积分设置
    editCreditSetting: {
        method: 'post',
        api: 'manage/sysset/credit/update'
    },
    // 获取注册信息
    getRegisterSetting: {
        method: 'get',
        api: 'manage/channel/registry-setting/get',
    },
    // 设置注册信息
    setRegisterSetting: {
        method: 'post',
        api: 'manage/channel/registry-setting/set',
    },
    // 获取余额设置
    getBalanceSetting: {
        method: 'get',
        api: 'manage/sysset/balance/get-info'
    },
    // 更新余额设置
    editBalanceSetting: {
        method: 'post',
        api: 'manage/sysset/balance/update'
    },
    // 获取积分设置头部数据
    getCreditStatistics: {
        method: 'get',
        api: 'manage/sysset/credit/get-statistics'
    },
    // 获取余额设置头部数据
    getBalanceStatistics: {
        method: 'get',
        api: 'manage/sysset/balance/get-statistics'
    },
    // 获取支付配置
    getPaymengtSetting: {
        method: 'get',
        api: 'manage/sysset/pay-type-set/get-info',
    },
    // 修改支付配置
    editPaymentSetting: {
        method: 'post',
        api: 'manage/sysset/pay-type-set/update',
    },
    // 获取打款设置
    getPaySetting: {
        method: 'get',
        api: 'manage/sysset/pay-set/get-info',
    },
    // 设置打款设置
    editPaySetting: {
        method: 'post',
        api: 'manage/sysset/pay-set/update',
    },
    // 获取支付模板列表
    getPayMouldList: {
        method: 'get',
        api: 'manage/sysset/pay-template-set/',
    },
    // 支付模板详情
    getPayMouldDetail: {
        method: 'get',
        api: 'manage/sysset/pay-template-set/detail/',
    },
    // 删除支付模板
    deletePayMould: {
        method: 'post',
        api: 'manage/sysset/pay-template-set/delete/',
    },
    // 批量删除支付模板
    bulkDeleteMould: {
        method: 'post',
        api: 'manage/sysset/pay-template-set/delete/',
    },
    // 新增支付模板
    addPayMould: {
        method: 'post',
        api: 'manage/sysset/pay-template-set/add',
    },
    // 修改支付模板
    editPayMould: {
        method: 'post',
        api: 'manage/sysset/pay-template-set/update',
    },
    // 获取地址列表
    getAddressList: {
        method: 'get',
        api: 'manage/utility/address',
    },
    // 获取所有退货地址
    getAllRefundAddress: {
        method: 'get',
        api: 'manage/sysset/refund-address/all-refund-address',
    },
    // 获取所有快递列表
    getExpressList: {
        method: 'get',
        api: 'manage/order/refund/all-express',
    },
    // 获取操作日志列表
    getOperateLogList: {
        method: 'get',
        api: 'manage/sysset/log/list',
    },
    // 获取操作日志详情
    getOperateLogDetail: {
        method: 'get',
        api: 'manage/sysset/log/detail',
    },
    // 获取验证码配置
    getCodeSet: {
        method: 'get',
        api: 'manage/sysset/sms/code',
    },
    // 修改验证码配置
    editCodeSet: {
        method: 'post',
        api: 'manage/sysset/sms/edit-code',
    },
    // 获取角色列表
    getRoleList: {
        method: 'get',
        api: 'manage/user/role',
    },
    // 获取所有角色列表
    getRoleAllList: {
        method: 'get',
        api: 'manage/user/role/all-role',
    },
    // 创建角色
    createRole: {
        method: 'post',
        api: 'manage/user/role/create',
    },
    // 编辑角色
    editRole: {
        method: 'get',
        api: 'manage/user/role/edit',
    },
    // 启用角色
    activeRole: {
        method: 'post',
        api: 'manage/user/role/active',
    },
    // 禁用角色
    forbiddenRole: {
        method: 'post',
        api: 'manage/user/role/forbidden',
    },
    // 更改角色保存
    saveRole: {
        method: 'post',
        api: 'manage/user/role/save',
    },
    // 删除角色
    deleteRole: {
        method: 'post',
        api: 'manage/user/role/delete',
    },
    // 获取所有权限
    getAllPerms: {
        method: 'get',
        api: 'manage/user/role/get-all-perms',
    },
    // 操作员列表
    getOperatorList: {
        method: 'get',
        api: 'manage/user/index',
    },
    // 编辑管理员
    editOperator: {
        method: 'get',
        api: 'manage/user/index/edit',
    },
    // 启用操作员
    activeOperator: {
        method: 'post',
        api: 'manage/user/index/active',
    },
    // 禁用操作员
    forbiddenOperator: {
        method: 'post',
        api: 'manage/user/index/forbidden',
    },
    // 删除操作员
    deleteOperator: {
        method: 'post',
        api: 'manage/user/index/delete',
    },
    // 更改管理员保存
    saveOperator: {
        method: 'post',
        api: 'manage/user/index/save',
    },
    // 创建管理员
    createOperator: {
        method: 'post',
        api: 'manage/user/index/create',
    },
    // 公告列表
    getNoticeList: {
        method: 'get',
        api: 'manage/sysset/mall/notice/index',
    },
    // 新增公告
    addNotice: {
        method: 'post',
        api: 'manage/sysset/mall/notice/add',
    },
    // 编辑公告
    editSysNotice: {
        method: 'post',
        api: 'manage/sysset/mall/notice/edit',
    },
    // 公告详情
    getNoticeDetail: {
        method: 'get',
        api: 'manage/sysset/mall/notice/detail',
    },
    // 删除/批量删除公告
    deleteNotice: {
        method: 'post',
        api: 'manage/sysset/mall/notice/delete',
    },
    // 修改/批量修改公告状态
    changeNoticeStatus: {
        method: 'post',
        api: 'manage/sysset/mall/notice/change-status',
    },
    // 校验用户是否存在
    checkUser: {
        method: 'get',
        api: 'manage/user/index/check-user',
    },
    // 保存推广佣金设置
    saveExtentsionSettings:{
        method: 'post',
        api: 'manage/merchant/platform/merchant/settings/commission/set',
    },
    // 获取推广佣金设置
    getExtentsionSettings:{
        method: 'get',
        api: 'manage/merchant/platform/merchant/settings/commission/get',
    }
}
