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
 * @Description:充值奖励
 * @author Gao
 * @date 2021/12/16
 */
export const rechargeRewardApi = {
    // 获取充值奖励 列表
    getRechargeRewardList: {
        method: 'get',
        api: 'manage/rechargeReward/index/list',
    },
    // 删除充值奖励
    deleteRechargeReward: {
        method: 'get',
        api: 'manage/rechargeReward/index/delete',
    },
    // 手动停止充值奖励
    stopRechargeReward: {
        method: 'get',
        api: 'manage/rechargeReward/index/manual-stop',
    },
    // 获取充值奖励 详情
    getRechargeRewardDetail: {
        method: 'get',
        api: 'manage/rechargeReward/index/detail',
    },
    // 添加充值奖励
    addRechargeReward: {
        method: 'post',
        api: 'manage/rechargeReward/index/add',
    },
    // 编辑充值奖励
    editRechargeReward: {
        method: 'post',
        api: 'manage/rechargeReward/index/edit',
    },
    // 领取记录
    getRechargeRewardLog: {
        method: 'get',
        api: 'manage/rechargeReward/log/list',
    }
}