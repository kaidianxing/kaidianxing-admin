/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 

export const creditSignApi = {
    // 活动列表
    creditSignList: {
        method: 'get',
        api: 'manage/creditSign/list/list'
    },
    // 保存活动列表
    addCreditSign: {
        method: 'post',
        api: 'manage/creditSign/list/add'
    },
    // 编辑保存活动列表
    editCreditSign: {
        method: 'post',
        api: 'manage/creditSign/list/edit'
    },
    //  编辑获取数据
    editActivity: {
        method: 'get',
        api: 'manage/creditSign/list/detail'
    },
    // 删除活动
    deleteActivity: {
        method: 'post',
        api: 'manage/creditSign/list/delete'
    },
    // 停止活动
    stopActivity: {
        method: 'post',
        api: 'manage/creditSign/list/stop'
    },
    // 领取奖励
    getRecordList: {
        method: 'get',
        api: 'manage/creditSign/list/total-list'
    },
};
