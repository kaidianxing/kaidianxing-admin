/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
export default {
    // 支付尾款通知
    credit_sign_notice: {
        icon: 'icon-xiaoxitongzhi-fukuan',
        title: '签到提醒',
        sendTime: '每日20:00',
        wechat: {
            title: '',
            info: [
                {
                    key: '办理事项',
                    title: '签到送好礼',
                },
                {
                    key: '待办进程',
                    title: '连续签到有机会获得积分、优惠劵',
                },
                {
                    key: '时间',
                    title: '2021.08.10-2021.09.08',
                },
                {
                    key: '备注',
                    title: '点此快速签到>>',
                }
            ],
        },
        wxapp: {
            title: '签到提醒',
            info: [
                {
                    key: '活动名称',
                    title: '签到得好礼',
                },
                {
                    key: '签到奖励',
                    title: '3积分',
                },
                {
                    key: '连续签到天数',
                    title: '9',
                },
                {
                    key: '温馨提示',
                    title: '连续签到有机会获得积分、优惠劵',
                }
            ]
        },
        sms: {
            title: '\'<短信签名>\'今日还未签到哦~连续签到有机会获得大礼包，速速前往商城！\''
        },
    },
};