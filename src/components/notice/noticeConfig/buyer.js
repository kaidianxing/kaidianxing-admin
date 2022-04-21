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
    // 买家付款成功通知
    buyer_order_pay: {
        icon: 'icon-xiaoxitongzhi-fukuan',
        title: '订单支付通知',
        sendTime: '买家付款成功后立即发送',
        wechat: {
            title: '您好，您有新的订单付款成功',
            info: [
                {
                    key: '订单编号',
                    title: '1021200526200731879751',
                },
                {
                    key: '商品名称',
                    title: '迪士尼水杯',
                },
                {
                    key: '下单时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '订单金额',
                    title: '99',
                },
                {
                    key: '买家备注',
                    title: '感谢你的使用。我们将尽快给您安排发货！',
                },
            ],
            remark: '感谢您的使用，我们将尽快给您安排发货！'
        },
        wxapp: {
            title: '付款成功通知',
            info: [
                {
                    key: '订单编号',
                    title: '1021200526200731879751',
                },
                {
                    key: '商品名称',
                    title: '迪士尼水杯',
                },
                {
                    key: '订单金额',
                    title: '99',
                },
                {
                    key: '支付时间',
                    title: '2020-06-01 09:00:00',
                },
            ]

        },
        sms: {
            title: '\'<短信签名>\'亲，您购买的\'<商品名称>\'已支付成功，我们会尽快为您打包，请耐心等待。'
        },
    },
    // 订单发货通知
    buyer_order_send: {
        icon: 'icon-xiaoxitongzhi-dingdantongzhi',
        title: '订单发货通知',
        sendTime: '卖家发货后立即发送',
        wechat: {
            title: '您购买的订单已经发货啦！',
            info: [
                {
                    key: '订单编号',
                    title: '1021200526200731879751',
                },
                {
                    key: '发货时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '物流公司',
                    title: '顺丰快递',
                },
                {
                    key: '快递单号',
                    title: 'SF6332541512',
                },
                {
                    key: '收件信息',
                    title: '张三 18888888888 山东省-青岛市-市北区',
                },
                {
                    key: '买家备注',
                    title: '请保持您的手机畅通！',
                },
            ],
            remark: '请保持您的手机畅通！'
        },
        wxapp: {
            title: '订单发货通知',
            info: [
                {
                    key: '订单编号',
                    title: '1021200526200731879751',
                },
                {
                    key: '商品名称',
                    title: '迪士尼水杯',
                },
                {
                    key: '快递公司',
                    title: '顺丰',
                },
                {
                    key: '快递单号',
                    title: 'SF6332541512',
                },
                {
                    key: '发货时间',
                    title: '2020-06-01 09:00:00',
                },
            ]

        },
        sms: {
            title: '\'<短信签名>\'亲，您购买的\'<商品名称>\'已发货，发货时间：\'<发送时间>\''
        },
    },
    // 订单手动退款通知
    buyer_order_cancel_and_refund: {
        icon: 'icon-xiaoxitongzhi-tuikuantongzhi',
        title: '订单手动退款通知',
        sendTime: '卖家同意退款立即发送',
        wechat: {
            title: '您的订单已经完成退款，【99】已经退回您的付款账户，请留意查收。',
            info: [
                {
                    key: '退款金额',
                    title: '99',
                },
                {
                    key: '商品详情',
                    title: '迪士尼水杯',
                },
                {
                    key: '订单编号',
                    title: '1021200526200731879751',
                },
                {
                    key: '备注',
                    title: '给您带来不便，敬请谅解！',
                }
            ],
            remark: '给您带来不便，敬请谅解！'
        },
        wxapp: {
            title: '退款成功通知',
            info: [
                {
                    key: '退款金额',
                    title: '【退款金额】',
                },
                {
                    key: '商品名称',
                    title: '【商品名称】',
                },
                {
                    key: '订单编号',
                    title: '【订单编号】',
                },
                {
                    key: '温馨提示',
                    title: '您的订单已经完成退款，请注意查收',
                },
            ]

        },
        sms: {
            title: '\'<短信签名>\'您的退款订单已完成，退款金额：\'<退款金额>\'，请确认是否到账'
        },
    },
    // 余额提现成功通知
    buyer_pay_withdraw: {
        icon: 'icon-xiaoxitongzhi-tixian',
        title: '提现成功通知',
        sendTime: '买家提现成功立即发送',
        wechat: {
            title: '提现成功。',
            info: [
                {
                    key: '提现金额',
                    title: '99',
                },
                {
                    key: '提现时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '提现成功，请注意查收',
                },
            ],
            remark: '提现成功，请注意查收'
        },
        wxapp: {
            title: '提现成功通知',
            info: [
                {
                    key: '变动金额',
                    title: '99',
                },
                {
                    key: '账户余额',
                    title: '9999',
                },
                {
                    key: '变动时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '变动原因',
                    title: '余额提现',
                },
            ]
        },
        sms: {
            title: '\'<短信签名>\'恭喜您，您申请的余额提现已经打款，请注意查收，提现金额：\'<提现金额>\''
        },
    },
    // 积分变动通知
    buyer_pay_credit: {
        icon: 'icon-xiaoxitongzhi-yongjin',
        title: '积分变动通知',
        sendTime: '积分充值成功通知',
        wechat: {
            title: '您好，您的账户积分发生变动！',
            info: [
                {
                    key: '业务类型',
                    title: '【变动账户】',
                },
                {
                    key: '业务内容',
                    title: '【账户积分】',
                },
                {
                    key: '处理结果',
                    title: '【充值金额】',
                },
                {
                    key: '操作时间',
                    title: '【充值时间】',
                },
                {
                    key: '备注',
                    title: '请注意查收',
                },
            ],
            remark: '请注意查收'
        },
        wxapp: {
            title: '后台积分充值成功后',
            info: [
                {
                    key: '变更数量',
                    title: '【充值金额】',
                },
                {
                    key: '累计积分',
                    title: '【账户积分】',
                },
                {
                    key: '变动时间',
                    title: '【充值时间】',
                },
                {
                    key: '温馨提示',
                    title: '您的账户金粉发生变动，请注意查收',
                },
            ]

        },
        sms: {
            title: '\'<短信签名>\'您的账户积分发生变动，积分：\'<变动积分>\'，当前积分：\'<当前积分>\'，如有疑问，请联系我们'
        },
    },
    // 会员升级通知
    buyer_member_update: {
        icon: 'icon-huiyuanzhongxin1',
        title: '会员变动通知',
        sendTime: '买家会员变动发送',
        wechat: {
            title: '提现成功。',
            info: [
                {
                    key: '提现金额',
                    title: '￥33',
                },
                {
                    key: '提现时间',
                    title: '2014-12-09 16:00',
                },
            ],
            remark: '提现成功，请注意查收'
        },
        wxapp: {
            title: '提现成功通知',
            info: [
                {
                    key: '提现金额',
                    title: '99',
                },
                {
                    key: '账户余额',
                    title: '9999',
                },
                {
                    key: '变动时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '变动原因',
                    title: '余额提现',
                },
            ]

        },
        // sms: {
        //     title: '\'<短信签名>\'亲，您购买的\'<商品名称>\'已支付成功，我们会尽快为您打包，请耐心等待~~'
        // },
    },
    // 余额充值成功通知
    buyer_pay_recharge: {
        icon: 'icon-jinqian1',
        title: '充值成功通知',
        sendTime: '买家余额充值成功后立即发送',
        wechat: {
            title: '您好，您已成功充值到账。',
            info: [
                {
                    key: '充值账户',
                    title: '张三',
                },
                {
                    key: '充值金额',
                    title: '99',
                },
                {
                    key: '充值方式',
                    title: '在线充值',
                },
                {
                    key: '充值时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '感谢你的使用。',
                },
            ],
            remark: '感谢您的使用'
        },
        wxapp: {
            title: '充值成功通知',
            info: [
                {
                    key: '变动金额',
                    title: '99',
                },
                {
                    key: '账户余额',
                    title: '9999',
                },
                {
                    key: '变动时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '变动原因',
                    title: '余额充值',
                },
            ]

        },
        sms: {
            title: '\'<短信签名>\'您的账户余额发生变动，金额：\'<变动金额>\'，当前余额：\'<账户余额>\'，如有疑问，请联系我们'
        },
    },

    /*------------------------------------- 营销关怀 -------------------------------------------------*/
    // 优惠券发放通知
    buyer_coupon_send: {
        icon: 'icon-youhuiquan1',
        title: '优惠券发放通知',
        sendTime: '用户获得优惠券后通知',
        wechat: {
            title: '恭喜您，获得全场满300元减20元优惠券1张！',
            info: [{
                key: '业务类型',
                title: '优惠券发放',
            },
                {
                    key: '业务内容',
                    title: '全场满300元减20元',
                },
                {
                    key: '发放状态',
                    title: '成功',
                },
                {
                    key: '发放时间',
                    title: '2018-10-18  10:00:00',
                }
            ]
        },
        wxapp: {
            title: '优惠券发放通知',
            info: [
                {
                    key: '会员名称',
                    title: '【用户昵称】',
                },
                {
                    key: '卡券名称',
                    title: '【优惠券类型】',
                },
                {
                    key: '领取时间',
                    title: '【发放时间】',
                },
                {
                    key: '温馨提示',
                    title: '优惠券已领取成功，感谢您的使用',
                },
            ]
        },
        sms: {
            title: '\'<短信签名>\'恭喜您，获得\'<店铺名称>\'店铺 \'<优惠券名称>\'优惠券1张，请登录店铺查看！'
        },
    },

    /*-------------------------------------- 验证码 -----------------------------------------------------*/
    // 买家注册通知
    user_reg: {
        icon: 'icon-huiyuanzhongxin1',
        title: '用户注册',
        sendTime: '用户注册时发送',
        sms: {
            title: '\'<短信签名>\'您的验证码为：\'<验证码>\'，请查看周边环境，不要泄露给其他人。'
        },
    },
    // 买家找回密码通知
    retrieve_pwd: {
        icon: 'icon-xiaoxitongzhi-zhaohuimima',
        title: '找回密码',
        sendTime: '找回密码时发送',
        sms: {
            title: '\'<短信签名>\'您的验证码为：\'<验证码>\'，请查看周边环境，不要泄露给其他人。'
        },
    },
    // 买家登录通知
    login_code: {
        icon: 'icon-xiaoxitongzhi-yonghudenglu',
        title: '用户登录',
        sendTime: '手机号验证码登录时发送',
        sms: {
            title: '\'<短信签名>\'您的验证码为：\'<验证码>\'，请查看周边环境，不要泄露给其他人。'
        },
    },
    // 买家绑定手机号通知
    bind: {
        icon: 'icon-shouji',
        title: '用户进行绑定手机号时发送',
        sendTime: '绑定或修改手机号时发送',
        sms: {
            title: '\'<短信签名>\'您正在使用验证码进行绑定手机号，验证码为：\'<验证码>\'，请查看周边环境，不要泄露给其他人。'
        },
    },
};