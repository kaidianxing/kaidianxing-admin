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
export const noticeApi = {
    // 获取微信模板库列表
    getNoticeList: {
        method: 'get',
        api: 'manage/notice/index/init',
    },

    /*  -------------------------- 公众号  ----------------------------------     */
    // 获取微信模板库列表
    getWexinTemplate: {
        method: 'get',
        api: 'manage/notice/wechat-template/',
    },
    // 获取微信模板库详情
    getWexinTemplateDetail: {
        method: 'get',
        api: 'manage/notice/wechat-template/detail',
    },
    // 添加微信模板库
    addWexinTemplate: {
        method: 'post',
        api: 'manage/notice/wechat-template/add-template',
    },
    // 删除微信模板库
    deleteWexinTemplate: {
        method: 'post',
        api: 'manage/notice/wechat-template/delete',
    },
    // 批量删除微信模板库
    bulkDeleteWexinTemplate: {
        method: 'post',
        api: 'manage/notice/wechat-template/delete',
    },
    // 添加微信模板
    addWechatNotice: {
        method: 'post',
        api: 'manage/notice/index/wechat-notice',
    },
    // 获取微信模板
    getWechatNotice: {
        method: 'get',
        api: 'manage/notice/index/get-wechat-notice',
    },


    /*  -------------------------- 短信  ----------------------------------     */
    // 获取短信消息库模板列表
    getSmsList: {
        method: 'get',
        api: 'manage/notice/sms/',
    },
    // 启用禁用/批量启用禁用 短信模板
    changeSmsState: {
        method: 'post',
        api: 'manage/notice/sms/change-state',
    },
    // 删除短信模板
    deleteSms: {
        method: 'post',
        api: 'manage/notice/sms/delete',
    },
    // 测试发送数据
    sendData: {
        method: 'post',
        api: 'manage/notice/sms/send-data',

    },
    // 获取测试发送数据
    setSendData: {
        method: 'post',
        api: 'manage/notice/sms/test-send',
    },
    // 获取短信模板详情
    getSmsDetail: {
        method: 'get',
        api: 'manage/notice/sms/detail',
    },
    // 添加短信模板
    addSms: {
        method: 'post',
        api: 'manage/notice/sms/add',
    },
    // 编辑短信模板
    editSms: {
        method: 'post',
        api: 'manage/notice/sms/edit',
    },
    // 添加短信模板
    addSmsNotice: {
        method: 'post',
        api: 'manage/notice/index/sms-notice',
    },
    // 获取短信模板
    getSmsNotice: {
        method: 'get',
        api: 'manage/notice/index/get-sms-notice',
    },
    // 签名简单列表
    getSmsSignList: {
        method: 'get',
        api: 'manage/notice/sms-signature/simple-list',
    },
    // 签名简单列表
    getSmsSignApplyList: {
        method: 'get',
        api: 'manage/notice/sms-signature/list',
    },
    // 签名简单列表
    addSmsSignApply: {
        method: 'post',
        api: 'manage/notice/sms-signature/apply',
    },
    // 启用短信签名
    enableSmsSign: {
        method: 'post',
        api: 'manage/notice/sms-signature/enabled',
    },
    // 获取短信模板详情
    getSmsTemDetail: {
        method: 'get',
        api: 'manage/notice/sms/detail',
    },
    // 获取短信模板发送场景值
    getSmsScene: {
        method: 'get',
        api: 'manage/notice/sms/get-scene',
    },
    // 获取短信套餐和短信模板套餐
    getSmsPlan: {
        method: 'get',
        api: 'manage/notice/sms/get-plan',
    },
    //获取短信设置
    getAccessKey: {
        method: 'get',
        api: 'manage/notice/sms/get-access-key',
    },
    //设置短信设置
    setAccessKey: {
        method: 'post',
        api: 'manage/notice/sms/set-access-key',
    },

    /*  -------------------------- 小程序  ----------------------------------     */
    // 添加小程序模板
    addWxappNotice: {
        method: 'post',
        api: 'manage/notice/index/wxapp-notice',
    },
    // 获取小程序模板
    getWxappNotice: {
        method: 'get',
        api: 'manage/notice/index/get-wxapp-notice',
    },

    /* ------------------------------- 邮箱设置 ------------------------------------------- */
    // 邮箱设置-获取邮箱配置
    getMailer: {
        method: 'get',
        api: 'manage/notice/mailer/get'
    },
    // 邮箱设置-保存配置
    setMailer: {
        method: 'post',
        api: 'manage/notice/mailer/set'
    },
    // 邮箱设置-测试发送邮件
    testSendMailer: {
        method: 'post',
        api: 'manage/notice/mailer/test-send'
    },

};