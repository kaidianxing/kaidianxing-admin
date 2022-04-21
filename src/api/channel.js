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
export const channelApi = {
    // 获取wxapp信息
    getWxAppData: {
        method: 'get',
        api: 'manage/wxapp/index/get',
    },
    // 获取微信信息
    getWeChatData: {
        method: 'get',
        api: 'manage/wechat/index/get',
    },
    // 获取h5渠道信息
    getH5Data: {
        method: 'get',
        api: 'manage/wap/index/get',
    },
    // 获取小程序基本信息
    getWxAppBase: {
        method: 'get',
        api: 'manage/wxapp/index/get-setting',
    },
    // 店铺助手小程序基本信息
    getWxAppBaseAssistant: {
        method: 'get',
        api: 'manage/assistant/settings/get',
    },

    // 进行小程序设置
    setWxAppBase: {
        method: 'post',
        api: 'manage/wxapp/index/set-setting',
    },
    // 设置微信小程序消息通知
    setWxSetting: {
        method: 'post',
        api: 'manage/wxapp/index/set-setting',
    },
    // 获取小程序开发者二维码
    getWxAppQrCode: {
        method: 'get',
        api: 'manage/wxapp/upload/get-login-qrcode',
    },
    getWxAppQrCodeAssistant: {
        method: 'get',
        api: 'manage/assistant/upload/get-login-qrcode',
    },

    // 获取开发者登录状态
    getWxAppLoginStatus: {
        method: 'get',
        api: 'manage/wxapp/upload/get-login-qrcode-status',
    },
    // 获取腾讯云智服自定义
    getCustomServiceName: {
        method: 'post',
        api: 'manage/wxapp/index/get-plugins-name'
    },

    // 获取注册信息
    getRegisterSetting: {
        method: 'get',
        api: 'manage/channel/registry-setting/get',
    },
    // 设置注册信息
    setRegisterSetting: {
        method: 'post',
        api: 'manage/channel/registry-setting/set',
    },
    getNewWxAppAssistant: {
        method: 'get',
        api: 'manage/assistant/upload/get-audit-qrcode',
    },
    // 获取字节跳动小程序基本信息
    getTtAppSetting: {
        method: 'get',
        api: 'manage/byteDance/index/get-setting',
    },
    // 设置字节跳动小程序基本信息
    setTtAppSetting: {
        method: 'post',
        api: 'manage/byteDance/index/set-setting',
    },
    // 获取审核正式小程序信息(字节跳动)
    getTtAppVersionData: {
        method: 'get',
        api: 'manage/byteDance/upload/init',
    },
    // 获取版本列表(字节跳动)
    getTtUploadLog: {
        method: 'get',
        api: 'manage/byteDance/upload/log',
    },
    // 获取图形验证码(字节跳动)
    getTtCaptcha: {
        method: 'get',
        api: 'manage/byteDance/upload/get-captcha',
    },
    // 获取手机验证码(字节跳动)
    getTtSms: {
        method: 'post',
        api: 'manage/byteDance/upload/send-sms',
    },
    // 手机号登录(字节跳动)
    ttSmsLogin: {
        method: 'post',
        api: 'manage/byteDance/upload/sms-login',
    },
    // 邮箱登录(字节跳动)
    ttEmailLogin: {
        method: 'post',
        api: 'manage/byteDance/upload/email-login',
    },
    // 上传小程序(字节跳动)
    uploadTt: {
        method: 'post',
        api: 'manage/byteDance/upload/upload',
    },
    // 获取小程序上传状态(字节跳动)
    getTtUploadStatus: {
        method: 'get',
        api: 'manage/byteDance/upload/get-upload-status',
    },
    // 获取二维码(字节跳动)
    getTtQrcode: {
        method: 'get',
        api: 'manage/byteDance/index/get-byte-dance-qrcode',
    },
    // 获取登录状态(字节跳动)
    getTtLoginStatus: {
        method: 'get',
        api: 'manage/byteDance/upload/get-login-status',
    },
    // 设置渠道状态
    setChannelStatus: {
        method: 'post',
        api: 'manage/channel/index/set-status'
    },
    // 手动添加公众号配置
    setWechatConfig: {
        method: 'post',
        api: 'manage/wechat/index/set'
    },
    // 获取公众号类型
    getWechatType: {
        method: 'get',
        api: 'manage/wechat/index/get-type'
    },
    // 获取公众号urltocken等配置
    getWechatToken: {
        method: 'post',
        api: 'manage/wechat/index/get-url'
    },
    // 测试公众号配置
    testWechatConfig: {
        method: 'post',
        api: 'manage/wechat/index/test'
    },
    // 获取公众号绑定类型
    getWechatBindType: {
        method: 'get',
        api: ''
    },

}
