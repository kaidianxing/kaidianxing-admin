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
export const merchantApi = {

    // -------------------------------小程序管理------------------------------
    // 小程序设置_获取设置
    getWxappSettings: {
        method: 'get',
        api: 'manage/merchant/platform/wxapp/settings/get',
    },
    // 小程序设置_保存设置
    setWxappSettings: {
        method: 'post',
        api: 'manage/merchant/platform/wxapp/settings/set',
    },
    // 小程序上传_初始化
    initWxappUpload: {
        method: 'get',
        api: 'manage/merchant/platform/wxapp/upload/init',
    },
    // 上传小程序_获取审核二维码
    getAuditQrcode: {
        method: 'get',
        api: 'manage/merchant/platform/wxapp/upload/get-audit-qrcode',
    },
    // 上传小程序_获取登录二维码
    getLoginQrcode: {
        method: 'get',
        api: 'manage/merchant/platform/wxapp/upload/get-login-qrcode',
    },
    // 上传小程序_获取登录二维码扫码状态
    getLoginQrcodeStatus: {
        method: 'get',
        api: 'manage/merchant/platform/wxapp/upload/get-login-qrcode-status',
    },
    // 上传小程序_执行上传
    uploadWxapp: {
        method: 'post',
        api: 'manage/merchant/platform/wxapp/upload/upload',
    },
    // 上传小程序_获取上传状态
    getUploadStatus: {
        method: 'get',
        api: 'manage/merchant/platform/wxapp/upload/get-upload-status',
    },
    // 获取发布版本记录
    getUploadList: {
        method: 'get',
        api: 'manage/merchant/platform/wxapp/upload/list',
    },
}
