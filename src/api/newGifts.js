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
 * @Description: 新人送礼
 * @author Gao
 * @date 2021/12/16
 */
export const newGiftsApi = {
    // -------------------------新人送礼---------------------------------
    // 新人送礼活动列表
    getNewGiftsList: {
        method: 'get',
        api: 'manage/newGifts/index/list',
    },
    // 删除新人送礼活动
    deleteNewGiftsActivity: {
        method: 'get',
        api: 'manage/newGifts/index/delete',
    },
    // 手动停止新人送礼活动
    stopNewGiftsActivity: {
        method: 'get',
        api: 'manage/newGifts/index/manual-stop',
    },
    // 新增新人送券活动
    addNewGiftsActivity: {
        method: 'post',
        api: 'manage/newGifts/index/add',
    },
    // 修改新人送券活动
    editNewGiftsActivity: {
        method: 'post',
        api: 'manage/newGifts/index/edit',
    },
    // 新人送礼活动线详情
    getNewGiftsDetail: {
        method: 'get',
        api: 'manage/newGifts/index/detail',
    },
    // 新人送礼领取记录
    getNewGiftsLog: {
        method: 'get',
        api: 'manage/newGifts/log/index',
    }
}