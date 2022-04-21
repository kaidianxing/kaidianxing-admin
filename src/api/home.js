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
export const homeApi = {
    // 首页订单总览
    getOrderInfo: {
        method: 'get',
        api: 'manage/index/order'
    },
    // 经营状况总览
    getManageOverview: {
        method: 'get',
        api: 'manage/index/manage-overview'
    },
    // 经营状况折线图
    getLineData: {
        method: 'get',
        api: 'manage/index/manage'
    },
    // 商品销量TOP排行榜
    getGoodsRank: {
        method: 'get',
        api: 'manage/index/goods-rank'
    },
    // 用户购买力TOP排行榜
    getMoneyRank: {
        method: 'get',
        api: 'manage/index/money-rank'
    },
    // 首页分销数据
    getCommission: {
        method: 'get',
        api: 'manage/index/commission'
    },
    writeLoginTime: { // 记录店铺登录时间
        method: 'get',
        api: 'manage/account/shop/op/login-shop'
    },
    // ---------交易分析---------
    // 获取交易信息
    getTransactionData: {
        method: 'get',
        api: 'manage/statistics/trade/'
    },
    // 获取核心销售数据
    getMarketData: {
        method: 'get',
        api: 'manage/statistics/trade/core-indicator'
    },
    //-----------商品数据--------------
    // 获取商品信息
    getGoodsInfo: {
        method: 'get',
        api: 'manage/statistics/goods'
    },
    // 获取商品排行榜
    getStatisticsGoodsRank: {
        method: 'get',
        api: 'manage/statistics/goods/rank'
    },
    // 获取商品详情
    getGoodsDetail: {
        method: 'get',
        api: 'manage/statistics/goods/detail/'
    },
    // --------------------渠道管理------------------
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
    // 获取渠道信息
    getChannelList: {
        method: 'get',
        api: 'manage/channel/index/get-channel'
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
    // 获取公众号配置
    getWechatConfig: {
        method: 'get',
        api: 'manage/wechat/index/get'
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
