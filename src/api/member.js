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

export const memberApi = {
    // 获取会员统计
    getVipInfo: {
        method: 'get',
        api: 'manage/statistics/member'
    },
    // 会员列表
    memberList: {
        method: 'get',
        api: 'manage/member/list/'
    },
    // 视频号链接获取会员列表
    videoMemberList: {
        method: 'get',
        api: 'manage/videoAccount/member/list/'
    },
    // 获取会员增长趋势
    getVipIncrease: {
        method: 'get',
        api: 'manage/statistics/member/trend'
    },
    // 获取会员详情
    getMemberDetail: {
        method: 'get',
        api: 'manage/member/detail'
    },
    // 获取会员详情
    getMemberCoupon: {
        method: 'get',
        api: 'manage/sale/coupon-log/get-member-coupon'
    },
    // 设置黑名单状态
    setMemberBlackStatus: {
        method: 'post',
        api: 'manage/member/list/set-black'
    },
    // 批量删除会员
    deleteBatchMember: {
        method: 'post',
        api: 'manage/member/list/set-black&is_black=0'
    },
    // 后台积分/余额充值
    rechargeMember: {
        method: 'post',
        api: 'manage/member/list/recharge'
    },
    // 删除会员
    deleteMember: {
        method: 'post',
        api: 'manage/member/detail/delete'
    },
    // 修改会员手机号
    changeMemberMobile: {
        method: 'post',
        api: 'manage/member/detail/change-mobile'
    },
    // 修改会员备注
    changeRemark: {
        method: 'post',
        api: 'manage/member/detail/change-remark'
    },
    // 修改会员等级
    changeMemberLevel: {
        method: 'post',
        api: 'manage/member/list/change-level'
    },
    // 批量/修改会员分组
    changeMemberGroup: {
        method: 'post',
        api: 'manage/member/list/change-group'
    },
    // 修改密码
    changePassword: {
        method: 'post',
        api: 'manage/member/detail/change-password'
    },
    // 导出
    exportMember: {
        method: 'get',
        api: 'manage/member/list/export'
    },

    // 获取会员等级列表
    getLevelList: {
        method: 'get',
        api: 'manage/member/level'
    },
    // 修改等级状态
    setLevelState: {
        method: 'get',
        api: 'manage/member/level/change-state'
    },
    // 删除等级
    deleteLevel: {
        method: 'post',
        api: 'manage/member/level/delete'
    },
    // 添加等级
    addLevel: {
        method: 'post',
        api: 'manage/member/level/add'
    },
    // 检测等级是否存在
    testLevelId: {
        method: 'post',
        api: 'manage/member/level/check-level'
    },
    // 获取等级详情
    getLevel: {
        method: 'get',
        api: 'manage/member/level/detail'
    },
    // 修改等级
    editLevel: {
        method: 'post',
        api: 'manage/member/level/edit'
    },
    // 获取标签组列表
    getGroupList: {
        method: 'get',
        api: 'manage/member/group'
    },
    // 添加标签组
    addGroup: {
        method: 'post',
        api: 'manage/member/group/add'
    },
    // 修改标签组
    editGroup: {
        method: 'post',
        api: 'manage/member/group/edit'
    },
    // 删除标签组
    deleteGroup: {
        method: 'post',
        api: 'manage/member/group/delete'
    },
    // 获取消费排行
    getConsumeList: {
        method: 'get',
        api: 'manage/statistics/member/money-rank'
    },
    // 获取排行榜设置
    getRank: {
        method: 'get',
        api: 'manage/member/rank'
    },
    // 修改排行榜设置
    editRank: {
        method: 'post',
        api: 'manage/member/rank/edit'
    },
    // 获取升级设置
    getUpgrade: {
        method: 'get',
        api: 'manage/member/level/get-type'
    },
    // 升级配置
    setUpgrade: {
        method: 'get',
        api: 'manage/member/level/set-type'
    },
    // 可赠送优惠券列表
    getCouponList: {
        method: 'get',
        api: 'manage/sale/coupon-list'
    },
    // 赠送优惠券
    setCoupon: {
        method: 'post',
        api: 'manage/sale/coupon/batch-send/member-send'
    },
    // 分销关系接口
    getRelationLog: {
        method: 'get',
        api: 'manage/member/detail/get-commission-relation-log'
    }
}
