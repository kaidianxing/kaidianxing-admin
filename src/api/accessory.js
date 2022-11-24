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
export const accessoryApi = {
    // 获取图片选择器中的列表
    getAccessoryList: {
        method: 'get',
        api: 'manage/utility/attachment/list/get-list',
    },
    // 获取图片分组
    getImageGroup: {
        method: 'get',
        api: 'manage/utility/attachment/group/get-list',
    },
    // 修改图片分组
    changeImageGroup: {
        method: 'post',
        api: 'manage/utility/attachment/list/change-group',
    },
    // 修改图片名称
    changeImageName: {
        method: 'post',
        api: 'manage/utility/attachment/list/rename',
    },
    // 上传文件 10图片、20视频、30音频
    uploadFile: {
        method: 'post',
        api: 'manage/utility/attachment/list/upload',
    },
    // 获取腾讯视频
    getVideoNetwork: {
      method: 'post',
      api: 'manage/utility/attachment/list/get-tencent-video'
    },
    // 获取视频、图片、音频上传大小
    getVideoSize: {
        method: 'get',
        api: 'manage/utility/attachment/index/get-config'
    },
    // 添加分组
    addImageGroup: {
        method: 'post',
        api: 'manage/utility/attachment/group/add',
    },
    // 删除分组
    deleteImageGroup: {
        method: 'post',
        api: 'manage/utility/attachment/group/delete',
    },
    // 修改图片分组
    editImageGroup: {
        method: 'post',
        api: 'manage/utility/attachment/group/edit',
    },
    // 删除文件
    deleteFile: {
        method: 'post',
        api: 'manage/utility/attachment/list/delete',
    },
    // 获取上传设置
    getUploadSetting: {
        method: 'get',
        // api: 'manage/utility/attachment/list/get-settings',
        api: 'manage/utility/attachment/index/get-config'
    },
    // 获取上传设置
    getAccountUploadSetting: {
        method: 'get',
        api: 'manage/utility/attachment/index/get-config'
    },
    // 初始化信息
    getShopInit: {
        method: 'get',
        api: 'manage/init',
    },
    // ---------------------店铺相关-----------------------------------
    // 检测登录用户密码
    checkPassword: {
        method: 'post',
        api: 'adminApi/init/check-password',
    },
    // 退出登录
    logout: {
        method: 'post',
        api: 'manage/account/logout',
    },
    // 执行后台异步任务
    runAsyncTask: {
        method: 'get',
        api: 'manage/utility/asyncTask/execute'
    },
    // 上传图片
    uploadImageNoShop: {
        method: 'get',
        api: 'manage/utility/attachment/list/upload'
    },

}
