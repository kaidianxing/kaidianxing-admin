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
 * @Description:店铺助手小程序
 * @author Gao
 * @date 2021/12/16
 */
export const assistantAPi = {
    // 店铺助手小程序设置
    setWxAppBaseAssistant: {
        method: 'post',
        api: 'manage/assistant/settings/set',
    },
    // 获取店铺助手登录状态
    getWxAppLoginStatusAssistant: {
        method: 'get',
        api: 'manage/assistant/upload/get-login-qrcode-status',
    },
    // 店铺助手小程序上传状态
    getWxAppUploadStatusAssistant: {
        method: 'get',
        api: 'manage/assistant/upload/get-upload-status',
    },
    // 上传店铺助手小程序
    uploadWxAppAssistant: {
        method: 'post',
        api: 'manage/assistant/upload/upload',
    },
    //店铺助手版本列表
    getVersionListAssistant: {
        method: 'get',
        api: 'manage/assistant/upload/list',
    },
    // 获取审核店铺助手小程序信息
    getWxAppVersionDataAssistant: {
        method: 'get',
        api: 'manage/assistant/upload/init',
    },

}