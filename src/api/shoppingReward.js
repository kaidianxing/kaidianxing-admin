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
 * @Description: 购物奖励
 * @author Gao
 * @date 2021/12/16
 */
export const shoppingRewardApi = {
    // 获取购物奖励 列表
    getShoppingRewardList: {
        method: 'get',
        api: 'manage/shoppingReward/index/list',
    },
    // 手动停止购物奖励活动
    stopShoppingRewardActivity: {
        method: 'get',
        api: 'manage/shoppingReward/index/manual-stop',
    },
    // 删除购物奖励活动
    deleteShoppingRewardActivity: {
        method: 'get',
        api: 'manage/shoppingReward/index/delete',
    },
    // 获取购物奖励 详情
    getShoppingRewardDetail: {
        method: 'get',
        api: 'manage/shoppingReward/index/detail',
    },
    // 添加购物奖励活动
    addShoppingRewardActivity: {
        method: 'post',
        api: 'manage/shoppingReward/index/add',
    },
    // 修改购物奖励活动
    editShoppingRewardActivity: {
        method: 'post',
        api: 'manage/shoppingReward/index/edit',
    },
    // 购物奖励领取记录
    getShoppingRewardLog: {
        method: 'get',
        api: 'manage/shoppingReward/log/list',
    }
}