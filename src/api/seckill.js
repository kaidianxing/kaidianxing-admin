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
 * @Description:秒杀活动
 * @author Gao
 * @date 2021/12/16
 */
export const seckillApi = {
    // 秒杀活动列表
    getSeckillActivities:{
        method: 'get',
        api: 'manage/seckill/index/list'
    },
    // 停止秒杀活动
    stopSeckillActivity: {
        method: 'get',
        api: 'manage/seckill/index/manual-stop'
    },
    // 删除秒杀活动
    delSeckillActivity: {
        method: 'get',
        api: 'manage/seckill/index/delete'
    },
    // 获取秒杀数据
    getSeckillData: {
        method: 'get',
        api: 'manage/seckill/index/statistics'
    },
    // 添加活动
    addSeckillActivity: {
        method: 'post',
        api: 'manage/seckill/index/add',
    },
    // 编辑
    editSeckillActivity: {
        method: 'post',
        api: 'manage/seckill/index/edit'
    },
    // 商品秒杀活动详情
    getSeckillDetail: {
        method: 'get',
        api: 'manage/seckill/index/detail',
    },
    // 获取秒杀活动设置
    getSeckillSet: {
        api: 'manage/seckill/index/get-setting',
        method: 'get'
    },
    // 保存设置
    setSeckillSet: {
        method: 'post',
        api: 'manage/seckill/index/set-setting',
    },
    // 查看秒杀活动列表
    getSeckillActivityList: {
        method: 'get',
        api: 'manage/seckill/index/list'
    },
    // 秒杀数据统计 销售额占比统计 秒杀活动营销状况
    getSeckillStatistics: {
        method: 'get',
        api: 'manage/seckill/statistics/index',
    },
    // 秒杀数据统计 活动曝光
    getSeckillStatisticsView: {
        method: 'get',
        api: 'manage/seckill/statistics/view',
    },
    // 秒杀数据统计 活动列表
    getSeckillStatisticsList: {
        method: 'get',
        api: 'manage/seckill/statistics/activity',
    },
    // 获取秒杀数据更新时间
    getSeckillUpdateTime: {
        method: 'get',
        api: 'manage/seckill/statistics/get-update-time'
    },

    // 平台秒杀概览获取应用信息
    getSeckillMerchant: {
        method: 'get',
        api: 'manage/seckill/statistics/get-merchant-statistics'
    },

    // 修改平台活动状态
    changeSeckillStatus: {
        method: 'get',
        api: 'manage/seckill/index/change-status'
    },

    // 获取平台活动状态
    getSeckillStatus: {
        method: 'get',
        api: 'manage/seckill/index/get-status',
    }
}