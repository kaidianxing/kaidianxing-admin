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
export const aloneApi = {
    getSessionId: { // 获取session-id
        method: 'get',
        api: 'manage/account/index/get-session-id'
    },
    getAloneInit: {  // 获取商家设置
        method: 'get',
        api: 'manage/account/login/init'
    },
    getCapture: { // 获取图形验证码
        method: 'get',
        api: 'manage/account/register/get-capture'
    },
    sendSmsCode: { //  获取短信验证码
        method: 'post',
        api: 'manage/account/register/send-sms-code'
    },
    submitLogin: { // 登录
        method: 'post',
        api: 'manage/account/login/submit'
    },
    submitForget: { // 忘记密码
        method: 'post',
        api: 'manage/account/register/forget-password'
    },
    getUserRegist: { // 获取用户资料
        method: 'get',
        api: 'manage/account/audit/index'
    },
    setUserRegist: { // 保存用户资料
        method: 'post',
        api: 'manage/account/audit/index'
    },
    modifyPass: { // 修改密码
        method: 'post',
        api: 'manage/account/change-password'
    },
    getLoginStatus: { // 获取当前登录状态
        method: 'get',
        api: 'manage/account/login/get-login-status'
    }
}