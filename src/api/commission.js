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
export const commissionApi = {
    // 分销商列表
    distributorList: {
        method: 'get',
        api: 'manage/commission/agent'
    },
    // 解绑上级分销商
    unbindAgent: {
        method: 'post',
        api: 'manage/commission/agent/unbind'
    },
    // 获取分销设置
    getSettings: {
        method: 'get',
        api: 'manage/commission/settings/commission/get'
    },
    // 编辑分销设置
    editSettings: {
        method: 'post',
        api: 'manage/commission/settings/commission/set'
    },
    // 获取结算设置
    getSettleSettings: {
        method: 'get',
        api: 'manage/commission/settings/settlement/get'
    },
    // 修改结算设置
    editSettleSettings: {
        method: 'post',
        api: 'manage/commission/settings/settlement/set'
    },
    // 获取其他设置
    otherSettings: {
        method: 'get',
        api: 'manage/commission/settings/other/get'
    },
    // 修改其他设置
    editOtherSettings: {
        method: 'post',
        api: 'manage/commission/settings/other/set'
    },
    // 读取排行榜设置
    getRankSettings: {
        method: 'get',
        api: 'manage/commission/settings/rank/get'
    },
    // 提交排行榜设置
    editRankSettings: {
        method: 'post',
        api: 'manage/commission/settings/rank/set'
    },
    // 获取通知设置
    getNoticeSettings: {
        method: 'get',
        api: 'manage/commission/settings/notice/get'
    },
    // 修改通知设置
    editNoticeSettings: {
        method: 'post',
        api: 'manage/commission/settings/notice/set'
    },
    // 分销商下线 头部信息
    sublineHeadInfo: {
        method: 'get',
        api: 'manage/commission/agent/detail'
    },
    // 分销商下线列表
    sublineList: {
        method: 'get',
        api: 'manage/commission/agent/child-list'
    },
    //取消/通过/拒绝 分销商资格
    changeStatus: {
        method: 'post',
        api: 'manage/commission/agent/change-status'
    },
    orderList: {//分销订单列表
        method: 'get',
        api: 'manage/commission/order'
    },
    levelList: {//分销等级列表
        method: 'get',
        api: 'manage/commission/level/list'
    },
    addLevel: {
        method: 'post',
        api: 'manage/commission/level/add'
    },
    editLevel: {//编辑等级
        method: 'post',
        api: 'manage/commission/level/edit'
    },
    delLevel: {//删除分销等级
        method: 'post',
        api: 'manage/commission/level/delete'
    },
    goodsList: {//分销商品列表
        method: 'get',
        api: 'manage/commission/goods/list'
    },
    getLevelList: { // 获取分销商等级
        method: 'get',
        api: 'manage/commission/apply/init-list'
    },
    getWaitCheckList: {// 获取待审核列表
        method: 'get',
        api: 'manage/commission/apply/get-wait-check-list'
    },
    getWaitRemitList: {// 获取待打款列表
        method: 'get',
        api: 'manage/commission/apply/get-wait-remit-list'
    },
    getSuccessList: {// 获取打款成功列表
        method: 'get',
        api: 'manage/commission/apply/get-success-list'
    },
    getInvalidList: {// 获取无效列表
        method: 'get',
        api: 'manage/commission/apply/get-invalid-list'
    },
    applyCheckedAgree: { // 同意提现申请
        method: 'post',
        api: 'manage/commission/apply/check-agreed'
    },
    applyCheckedRefuse: { // 拒绝提现申请
        method: 'post',
        api: 'manage/commission/apply/check-refuse'
    },
    // 打款
    applyRemit: {
        method: 'post',
        api: 'manage/commission/apply/remit'
    },
    manaualRemit: { // 手动打款
        method: 'post',
        api: 'manage/commission/apply/manual-remit'
    },
    checkAgain: { // 重新审核
        method: 'post',
        api: 'manage/commission/apply/check-again'
    },
    applyDetail: {  // 查看提现详情
        method: 'get',
        api: 'manage/commission/apply/detail'
    },
    autoUpgrade: {// 修改分销商自动升级
        method: 'post',
        api: 'manage/commission/agent/change-upgrade'
    },
    changeAgent: {// 修改分销商上级
        method: 'post',
        api: 'manage/commission/agent/change-agent'
    },
    changeLevel: {// 修改分销商分销等级
        method: 'post',
        api: 'manage/commission/agent/change-level'
    },
    fixUpline: {// 固定上级
        method: 'post',
        api: 'manage/commission/agent/lock-agent'
    },
    setGoodCommissionStatus: {// 设置商品不参与分销
        method: 'post',
        api: 'manage/commission/goods/cancel'
    },
    //通过、拒绝分销商资格
    setToAuditStatus: {
        method: 'post',
        api: 'manage/commission/agent/change-status'
    },
    //通过、拒绝分销商资格
    manualSetCommission: {
        method: 'get',
        api: 'manage/commission/agent/manual-agent'
    },
    // 获取全部分销商列表
    getDistributorList: {
        method: 'get',
        api: 'manage/commission/agent'
    },
    // 分销商下线头部信息
    getAgentDetailHeader: {
        method: 'get',
        api: 'manage/commission/agent/detail'
    },
    // 分销商下线列表
    getAgentChildList: {
        method: 'get',
        api: 'manage/commission/agent/child-list'
    },
    // 分销商等级列表
    getAgentGradeList: {
        method: 'get',
        api: 'manage/commission/level/list'
    },
    // 获取已被使用的分销商等级
    getAgentGradeUse: {
        method: 'get',
        api: 'manage/commission/level/get-used'
    },
    // 新增分销商等级
    addAgentGrade: {
        method: 'post',
        api: 'manage/commission/level/add'
    },
    // 修改分销商等级
    editAgentGrade: {
        method: 'post',
        api: 'manage/commission/level/edit'
    },
    // 删除分销商等级
    deleteAgentGrade: {
        method: 'get',
        api: 'manage/commission/level/delete'
    },
    // 分销商等级详情
    getAgentGradeDetail: {
        method: 'get',
        api: 'manage/commission/level/detail'
    },
    // 修改分销商等级状态
    setAgentGradeStatus: {
        method: 'get',
        api: 'manage/commission/level/change-status'
    },
    // 获取分销商等级全部列表
    getAgentGradeAllList: {
        method: 'get',
        api: 'manage/commission/level/get-list'
    },
    // 获取分销层级
    getCommissionLevel: {
        method: 'get',
        api: 'manage/commission/settings/commission/get-level'
    },
    // 分销概览
    getCommissionIndex: {
        method: 'get',
        api: 'manage/commission/index'
    }
}
