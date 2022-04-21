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
// 必填规则
export const requiredRule = (message, trigger = 'blur') => [{ required: true, message: message || '必填',trigger }]

/* 手机号校验规则 */
export const mobileRule = [{
    required: true, message: '请输入11位手机号码'
}, {
    pattern: /^1[1-9][0-9]{9}$/,
    message: '请填写正确格式的手机号',
    trigger: 'blur'
}]

/* 图形验证码校验规则 */
export const captchaRule = [{ required: true, len: 4, message: '请输入正确的图形验证码',trigger: 'blur' }]

/* 验证码校验规则 */
export const codeRule = [{
    required: true,
    message: '请输入验证码',
}, {
    pattern: /^\d{4}$/,
    message: '请输入正确的短信验证码',
    trigger: 'blur'
}]


/**
 * 密码等级校验
 * @param str
 * @returns level{1,2,3}
 */
 export function levelPass(str) {
    let level = 0;
    //当用户输入的字符串符合一定规则 让等级+1
    if (/\d+/.test(str)) {
        level++;
    }
    if (/[a-zA-Z]+/.test(str)) {
        level++;
    }
    let level3_reg = /[\_\#\@\$\^\%\*\&\!\~\+\-]+/
    if (level3_reg.test(str)) {
        level++;
    }
    return level;
}