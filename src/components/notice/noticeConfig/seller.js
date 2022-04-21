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
export default {
    // 卖家付款成功通知
    seller_order_pay: {
        icon: 'icon-xiaoxitongzhi-fukuan',
        title: '订单付款通知',
        sendTime: '买家付款后通知',
        wechat: {
            title: '支付成功通知',
            info: [
                {
                    key: '订单金额',
                    title: '99',
                },
                {
                    key: '交易编号',
                    title: '1021200526200731879751',
                },
                {
                    key: '备注',
                    title: '你好，顾客已支付成功。',
                },
            ],
            remark: '你好，顾客已支付成功。'
        },
        wxapp: {
            title: '支付成功通知',
            info: [
                {
                    key: '付款金额',
                    title: '【支付金额】',
                },
                {
                    key: '订单编号',
                    title: '【订单编号】',
                },
                {
                    key: '温馨提示',
                    title: '您好，顾客已支付成功',
                },
            ]
        },
        sms: {
            title: '您的\'<店铺名称>\'店铺在\'<支付时间>\'售出\'<商品标题>\'，请尽快处理'
        },
    },
    // 订单收货通知
    seller_order_receive: {
        icon: 'icon-xiaoxitongzhi-shouhuotongzhi',
        title: '订单收货通知',
        sendTime: '买家确认收货后通知',
        wechat: {
            title: '您好，您有订单客户已收货',
            info: [
                {
                    key: '客户账号',
                    title: '张三',
                },
                {
                    key: '订单编号',
                    title: '1021200526200731879751',
                },
                {
                    key: '付款金额',
                    title: '99',
                },
                {
                    key: '付款时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '感谢您的使用。',
                }
            ],
            remark: '感谢您的使用。'
        },
        wxapp: {
            title: '支付成功通知',
            info: [
                {
                    key: '订单编号',
                    title: '【订单编号】',
                },
                {
                    key: '订单金额',
                    title: '【支付金额】',
                },
                {
                    key: '签收时间',
                    title: '【收货时间】',
                },
                {
                    key: '温馨提示',
                    title: '当前订单已确认收货',
                },
            ]
        },
        sms: {
            title: '\'<短信签名>\'您的发货订单\'<订单编号>\'已被签收，签收时间：\'<完成时间>\'，请登录商家后台查看'
        },
    },
    // 维权订单通知
    seller_order_refund: {
        icon: 'icon-xiaoxitongzhi-weiquan1',
        title: '订单维权通知',
        sendTime: '用户发起售后时通知',
        wechat: {
            title: '【张三】发起售后维权申请',
            info: [
                {
                    key: '业务类型',
                    title: '售后维权申请',
                },
                {
                    key: '业务内容',
                    title: '退款',
                },
                {
                    key: '处理结果',
                    title: '等待处理',
                },
                {
                    key: '操作时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '感谢您的使用',
                },
            ],
            remark: '感谢您的使用。'
        },
        wxapp: {
            title: '支付成功通知',
            info: [
                {
                    key: '售后类型',
                    title: '【维权类型】',
                },
                {
                    key: '订单编号',
                    title: '【订单编号】',
                },
                {
                    key: '申请时间',
                    title: '【处理时间】',
                },
                {
                    key: '温馨提示',
                    title: '请及时处理',
                },
            ]

        },
        sms: {
            title: '\'<短信签名>\'您的买家发起了维权申请，订单编号：\'<订单编号>\'，请尽快登录商家后台处理'
        },
    },
};