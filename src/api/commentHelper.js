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
export const commentHelperApi = {
    // 添加商品评价库
    getCommentList: {
        method: 'get',
        api: 'manage/commentHelper/index/goods-list'
    },
    // 获取商品信息
    getCommentGoodInfo: {
        method: 'get',
        api: 'manage/commentHelper/index/goods-info'
    },
    // 获取商品评价列表
    getCommentGoodList: {
        method: 'get',
        api: 'manage/commentHelper/index/goods-comment-list'
    },
    // 手动创建
    saveManualCreate: {
        method: 'post',
        api: 'manage/commentHelper/index/manual-create'
    },
    // API抓取
    saveAPI: {
        method: 'post',
        api: 'manage/commentHelper/index/grab'
    },
    // 精选
    setChoice: {
        method: 'get',
        api: 'manage/commentHelper/index/choice'
    },
    // 奖励
    saveReward: {
        method: 'post',
        api: 'manage/commentHelper/index/reward'
    },
    // 编辑评价
    editComment: {
        method: 'post',
        api: 'manage/commentHelper/index/edit'
    },

    // 设置
    getSetting: {
        method: 'get',
        api: 'manage/commentHelper/setting/get'
    },
    // 设置
    setSetting: {
        method: 'post',
        api: 'manage/commentHelper/setting/set'
    },
    // 显示/隐藏评价
    changeStatus: {
        method: 'get',
        api: 'manage/commentHelper/index/change-status'
    },

}