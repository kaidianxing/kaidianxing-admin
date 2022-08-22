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
 * @Description: 管理端
 * @author Gao
 * @date 2021/12/9
 */

export const systemApi = {
    //------------------数据管理------------------------
    // 计划任务 读取设置
    getCrontab: {
        method: 'get',
        api: 'manage/system/tools/crontab/get'
    },
    // 计划任务 保存设置
    postCrontab: {
        method: 'post',
        api: 'manage/system/tools/crontab/set'
    },
    //------------------附件设置------------------------
    // 获取附件设置信息
    getAccessorySetting: {
        method: 'get',
        api: 'manage/system/attachment/get'
    },
    // 保存附件设置
    setAccessorySetting: {
        method: 'post',
        api: 'manage/system/attachment/set'
    },
    //------------------远程存储------------------------
    // 获取远程存储设置
    getStorage: {
        method: 'get',
        api: 'manage/system/storage/get'
    },
    // 设置远程存储设置
    setStorage: {
        method: 'post',
        api: 'manage/system/storage/set'
    },
    // 获取阿里云存储列表
    getAliBucket: {
        method: 'post',
        api: 'manage/system/storage/get-oss-bucket'
    },
    // 获取七牛云域名列表
    getQiniuUrl: {
        method: 'post',
        api: 'manage/system/storage/get-qiniu-domain'
    },
    // 获取腾讯云存储列表
    getTencentBucket: {
        method: 'post',
        api: 'manage/system/storage/get-cos-bucket'
    },
    //----------------------清除缓存-------------------
    // 系统维护-缓存数据
    getCacheData: {
        method: 'get',
        api: 'manage/system/tools/cache/info'
    },
    // 系统维护-检查队列-发送任务
    checkQueue: {
        method: 'get',
        api: 'manage/system/tools/queue/send-job'
    },
    // 系统维护-清除缓存
    clearCacheData: {
        method: 'post',
        api: 'manage/system/tools/cache/flush'
    },
    // 系统维护-检查队列-执行状态
    queueStatus: {
        method: 'get',
        api: 'manage/system/tools/queue/get-status'
    },

    //----------------------系统升级-------------------
    // 升级日志初始化
    getUpgradeInfo: {
        method: 'get',
        api: 'manage/system/upgrade/init'
    },
};
