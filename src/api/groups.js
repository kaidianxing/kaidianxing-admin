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
export const groupsApi = {
    // 拼团列表
    getGroupActivities: {
        method: 'get',
        api: 'manage/groups/index/list'
    },
    // 拼团活动添加
    addGroupsActivity: {
        method: 'post',
        api: 'manage/groups/index/add'
    },
    // 获取拼团活动
    getGroupsActivityDetail: {
        method: 'get',
        api: 'manage/groups/index/detail'
    },
    // 活动修改
    editGroupsActivity: {
        method: 'post',
        api: 'manage/groups/index/edit'
    },
    // 手动停止活动
    stopGroupsActivity: {
        method: 'post',
        api: 'manage/groups/index/manual-stop'
    },
    // 删除拼团活动
    deleteGroupsActivity: {
        method: 'post',
        api: 'manage/groups/index/delete'
    },
    // 获取活动列表中的数据
    getGroupsActivityListData: {
        method: 'get',
        api: 'manage/groups/index/statistics'
    },
    // 获取拼团订单
    getGroupsOrderList: {
        method: 'get',
        api: 'manage/groups/team'
    },
    // 获取拼团订单详情
    getGroupsOrderDetail: {
        method: 'get',
        api: 'manage/groups/team/get-team-detail'
    },
    // 确认成团
    confirmGroups: {
        method: 'post',
        api: 'manage/groups/team/edit-groups-status'
    },
    // 获取拼团设置
    getGroupsSetting: {
        method: 'get',
        api: 'manage/groups/settings/get'
    },
    // 保存拼团设置
    setGroupsSetting: {
        method: 'post',
        api: 'manage/groups/settings/set'
    },
    // 拼团数据统计 销售额占比统计 秒杀活动营销状况
    getGroupsStatistics: {
        method: 'get',
        api: 'manage/groups/data',
    },
    // 拼团折线图
    getGroupsLineData: {
        method: 'get',
        api: 'manage/groups/data/view'
    },
    // 活动数据
    getGroupsActivityData: {
        method: 'get',
        api: 'manage/groups/data/activity'
    },
    // 活动数据
    getGroupsGoodsData: {
        method: 'get',
        api: 'manage/groups/data/goods'
    },
    // 平台秒杀概览获取应用信息
    getGroupsMerchant: {
        method: 'get',
        api: 'manage/groups/platform/get-merchant-statistics'
    },
    // 拼团数据统计 销售额占比统计 秒杀活动营销状况
    getGroupsPlatStatistics: {
        method: 'get',
        api: 'manage/groups/platform',
    },
    // 拼团折线图
    getGroupsPlatLineData: {
        method: 'get',
        api: 'manage/groups/platform/view'
    },
    // 获取平台活动状态
    getGroupsStatus: {
        method: 'get',
        api: 'manage/groups/index/get-status',
    },
    // 修改平台活动状态
    changeGroupsStatus: {
        method: 'get',
        api: 'manage/groups/index/change-status'
    },
}
