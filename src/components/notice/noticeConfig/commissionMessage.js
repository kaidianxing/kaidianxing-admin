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
    /*-------------------------------------------------------- 买家 --------------------------------*/
    // 成为分销商通知
    commission_buyer_agent_become: {
        icon: 'icon-chengweifenxiaoshangtongzhi',
        title: '成为分销商通知',
        sendTime: '非分销商用户成为分销商后立即发送',
        wechat: {
            title: '恭喜您成为我们的分销商！',
            info: [
                {
                    key: '昵称',
                    title: '张三',
                },
                {
                    key: '时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '欢迎您的加入，如有疑问请联系客服',
                }
            ],
            remark: '感谢您的使用。'
        },
        sms: {
            title: '\'<短信签名>\'恭喜您成为\'<店铺名称>\'的分销商'
        },
    },
    // 新增下级通知
    commission_buyer_agent_add_child: {
        icon: 'icon-xinzengxiajitongzhi',
        title: '新增下级通知',
        sendTime: '新增下级分销商后立即发送',
        wechat: {
            title: '恭喜您，成功发展一名下线',
            info: [
                {
                    key: '推荐人',
                    title: '张三',
                },
                {
                    key: '被推荐人',
                    title: '李四',
                },
                {
                    key: '备注',
                    title: '如有疑问请联系客服',
                }
            ],
            remark: '感谢您的使用。'
        },
        sms: {
            title: '\'<短信签名>\'恭喜您于\'<时间>\'新增一名下级分销员\'<会员>\''
        },
    },
    // 下级付款通知
    commission_buyer_child_pay: {
        icon: 'icon-xiaoxitongzhi-fukuan',
        title: '下级付款通知',
        sendTime: '下级分销商支付订单成功后立即发送',
        wechat: {
            title: '您好，您的下级已完成一笔分销订单支付',
            info: [
                {
                    key: '下级昵称',
                    title: '李四',
                },
                {
                    key: '订单编号',
                    title: '1021200526200731879751',
                },
                {
                    key: '订单金额',
                    title: '99',
                },
                {
                    key: '佣金金额',
                    title: '66',
                },
                {
                    key: '时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '如有疑问请联系客服',
                }
            ],
            remark: '感谢您的使用。'
        },
        sms: {
            title: '\'<短信签名>\'恭喜您，您的\'<下级层级>\'下线\'<会员>\'在\'<下单时间>\'完成一笔订单支付'
        },
    },
    // 提现申请失败通知
    commission_buyer_withdraw_apply_fail: {
        icon: 'icon-tixianshenqingshibai',
        title: '提现申请失败通知',
        sendTime: '后台审核提现至拒绝状态后立即发送',
        wechat: {
            title: '您好，抱歉通知您本次提现申请被驳回',
            info: [
                {
                    key: '业务类型',
                    title: '申请提现',
                },
                {
                    key: '业务内容',
                    title: '99',
                },
                {
                    key: '处理结果',
                    title: '审核通过/审核拒绝',
                },
                {
                    key: '操作时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '如有疑问请联系客服',
                }
            ],
            remark: '感谢您的使用。'
        },
        sms: {
            title: '\'<短信签名>\'很抱歉，您的佣金提现申请未被同意，请联系商家并修改申请'
        },
    },
    // 佣金打款通知
    commission_buyer_commission_pay: {
        icon: 'icon-dakuanchenggong',
        title: '佣金打款通知',
        sendTime: '后台订单审核打款后立即发送',
        wechat: {
            title: '您好，您的佣金已成功打款，请注意查收！',
            info: [
                {
                    key: '业务类型',
                    title: '申请提现',
                },
                {
                    key: '业务内容',
                    title: '99',
                },
                {
                    key: '处理结果',
                    title: '审核通过/审核拒绝',
                },
                {
                    key: '操作时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '如有疑问请联系客服',
                }
            ],
            remark: '感谢您的使用。'
        },
        sms: {
            title: '\'<短信签名>\'恭喜您，您申请的佣金提现已经打款，请注意查收，提现金额：\'<提现金额>\''
        },
    },
    // 分销商升级通知
    commission_buyer_commission_upgrade: {
        icon: 'icon-fenxiaoshangshengjitongzhi',
        title: '分销商升级通知',
        sendTime: '用户的分销等级变更后立即发送',
        wechat: {
            title: '恭喜您，您的分销等级已成功升级！',
            info: [
                {
                    key: '当期等级',
                    title: '二级',
                },
                {
                    key: '原始等级',
                    title: '一级',
                },
                {
                    key: '升级时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '您将拥有更多分销权益，如有疑问请联系客服',
                }
            ],
            remark: '感谢您的使用。'
        },
        sms: {
            title: '\'<短信签名>\'恭喜您，您已成功升级为\'<分销等级>\'，将享受更多权益'
        },
    },
    // 新增下线用户通知
    commission_buyer_agent_add_child_line: {
        icon: 'icon-xinzengxiajitongzhi',
        title: '新增下线用户通知',
        sendTime: '分销商成功邀请新用户并将其绑定为下线关系时立即发送',
        wechat: {
            title: '恭喜您，成功发展一名下级用户',
            info: [
                {
                    key: '用户昵称',
                    title: '推荐人',
                },
                {
                    key: '下级昵称',
                    title: '被推荐人',
                },
                {
                    key: '备注',
                    title: '如有疑问请联系客服',
                }
            ],
            remark: '感谢您的使用。'
        },
        sms: {
            title: '\'<短信签名>\'恭喜您于\'<时间>\'新增一名下线用户\'<用户名称>\''
        },
    },


    /* ---------------------------------------------卖家 -----------------------------------------*/
    // 申请成为分销商通知
    commission_seller_apply: {
        icon: 'icon-chengweifenxiaoshangtongzhi',
        title: '申请成为分销商通知',
        sendTime: '用户提交申请后立即发送',
        wechat: {
            title: '您好，您有用户正在申请成为分销商！',
            info: [
                {
                    key: '申请名称',
                    title: '申请成为分销商',
                },
                {
                    key: '申请人',
                    title: '张三',
                },
                {
                    key: '申请类型',
                    title: '一级',
                },
                {
                    key: '申请时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '请及时处理',
                }
            ],
            remark: '感谢您的使用。'
        },
        sms: {
            title: '\'<短信签名>\'您的用户\'<用户昵称>\'提交了分销商申请，请尽快登录商家后台处理'
        },
    },
    // 新增提现申请通知
    commission_seller_withdraw: {
        icon: 'icon-xinzengtixianshenqing',
        title: '新增提现申请通知',
        sendTime: '分销商发送佣金提现申请后立即发送',
        wechat: {
            title: '您好，您有新的佣金提现申请待处理',
            info: [
                {
                    key: '业务类型',
                    title: '申请提现',
                },
                {
                    key: '业务内容',
                    title: '99',
                },
                {
                    key: '处理结果',
                    title: '待处理',
                },
                {
                    key: '操作时间',
                    title: '2020-06-01 09:00:00',
                },
                {
                    key: '备注',
                    title: '请及时处理',
                }
            ],
            remark: '感谢您的使用。'
        },
        sms: {
            title: '\'<短信签名>\'佣金提现通知：您有新的佣金提现申请，请尽快登录商家后台处理，申请金额：\'<申请金额>\''
        },
    },
    // 新增分销订单通知
    commission_seller_add_commission_order: {
        icon: 'icon-fenxiaodingdan',
        title: '新增分销订单通知',
        sendTime: '分销订单付款成功后立即发送',
        wechat: {
            title: '您好，您有新的分销订单！',
            info: [
                {
                    key: '订单编号',
                    title: '1021200526200731879751',
                },
                {
                    key: '订单内容',
                    title: '新款艾灸盒一盒',
                },
                {
                    key: '订单状态',
                    title: '已付款',
                },
                {
                    key: '备注',
                    title: '请及时处理',
                }
            ],
            remark: '感谢您的使用。'
        },
        sms: {
            title: '\'<短信签名>\'您的\'<店铺名称>\'店铺在\'<支付时间>\'售出\'<商品名称>\'，请尽快处理'
        },
    },
}