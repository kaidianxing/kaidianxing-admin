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
    // 用户参与拼团通知
    groups_join: {
        icon: 'icon-cantuantongzhi',
        title: '用户参与拼团通知',
        sendTime: '用户参与拼团成功即发送给团长',
        wechat: {
            title: '您好，有用户成功拼团啦',
            info: [
                {
                    key: '拼团订单编号',
                    title: '1021200526200731879751',
                },
                {
                    key: '拼团人员',
                    title: '张三/李四/王五',
                },
                {
                    key: '拼团商品',
                    title: 'iphoneX',
                },
                {
                    key: '拼团金额',
                    title: '6000元',
                },
                {
                    key: "备注",
                    title: '感谢您的使用'
                }
            ],
            remark: '感谢您的使用'
        },
        wxapp: {
            title: '您好，有用户成功拼团啦',
            info: [
                {
                    key: '拼团商品',
                    title: '【商品名称】',
                },
                {
                    key: '拼团进度',
                    title: '已有【成团人数】人参团',
                },
                {
                    key: '成团人数',
                    title: '【成团人数】',
                },
                {
                    key: "截止时间",
                    title: '【活动结束时间】'
                },
                {
                    key: "温馨提示",
                    title: '您开的团已有用户成功参团'
                }
            ],
        },
        sms: {
            title: '\'<短信签名>\'您发起的拼团\'<拼团商品名称>\',有用户成功拼团啦，更多拼团信息请登录查看。'
        },
        subscribe: {
            title: '拼团进度通知',
            info: [
                {
                    key: '拼团商品',
                    title: '红富士苹果一箱10斤装',
                },
                {
                    key: '拼团成员',
                    title: '张三'
                },
                {
                    key: '温馨提示',
                    title: '有会员成功参团，距离成团又近了一步'
                },
            ],
        }
    },
    // 拼团成功过通知
    groups_success: {
        icon: 'icon-dakuanchenggong',
        title: '拼团成功通知',
        sendTime: '买家付款成功后立即发送',
        wechat: {
            title: '恭喜您拼团成功',
            info: [
                {
                    key: '商品',
                    title: '苹果',
                },
                {
                    key: '拼团成员',
                    title: '黑格尔、康德',
                },
                {
                    key: "备注",
                    title: '谢谢惠顾'
                }
            ],
            remark: '谢谢惠顾'
        },
        wxapp: {
            title: '恭喜您拼团成功',
            info: [
                {
                    key: '拼团商品',
                    title: '【商品名称】',
                },
                {
                    key: '拼团进度',
                    title: '已有【成团人数】人参团',
                },
                {
                    key: '成团人数',
                    title: '【成团人数】',
                },
                {
                    key: "截止时间",
                    title: '【活动结束时间】'
                },
                {
                    key: "温馨提示",
                    title: '恭喜您拼团成功，请等待发货'
                }
            ],
        },
        sms: {
            title: '\'<短信签名>\'您发起的拼团\'<拼团商品名称>\',恭喜您拼团成功，请等待发货。'
        },
        subscribe: {
            title: '拼团进度通知',
            info: [
                {
                    key: '商品名称',
                    title: '红富士苹果一箱10斤装',
                },
                {
                    key: '商品金额',
                    title: '100.00',
                },
                {
                    key: '温馨提示',
                    title: '恭喜您拼团成功，请等待发货'
                },
            ],
        }
    },
    // 拼团失败通知
    groups_defeated: {
        icon: 'icon-tixianshenqingshibai',
        title: '拼团失败通知',
        sendTime: '拼团失败立即发送',
        wechat: {
            title: '你好，您参加的拼团有雨团已过期，拼团失败。',
            info: [
                {
                    key: '拼团商品',
                    title: '精选新西兰猕猴桃6枚',
                },
                {
                    key: '商品金额',
                    title: '10',
                },
                {
                    key: '退款金额',
                    title: '99',
                },
                {
                    key: "备注",
                    title: '您的退款已经提交微信审核，感谢您的参与！'
                }
            ],
            remark: '您的退款已经提交微信审核，感谢您的参与！'
        },
        wxapp: {
            title: '你好，您参加的拼团有雨团已过期，拼团失败。',
            info: [
                {
                    key: '拼团商品',
                    title: '【商品名称】',
                },
                {
                    key: '拼团进度',
                    title: '已有【成团人数】人参团',
                },
                {
                    key: '成团人数',
                    title: '【成团人数】',
                },
                {
                    key: "截止时间",
                    title: '【活动结束时间】'
                },
                {
                    key: "温馨提示",
                    title: '当前活动未成团，您的订单金额将原路退回'
                }
            ],
        },
        sms: {
            title: '\'<短信签名>\' 您参与的\'<商品名称>\'，有效期内拼团未成功，您支付的商品金额将原路退还，请耐心等待。'
        },
        subscribe: {
            title: '拼团进度通知',
            info: [
                {
                    key: '商品名称',
                    title: '红富士苹果一箱10斤装',
                },
                {
                    key: '商品金额',
                    title: '100.00',
                },
                {
                    key: '退款金额',
                    title: '100.00',
                },
                {
                    key: '温馨提示',
                    title: '您参加的拼团已过期，拼团失败，订单金额将原路退还'
                },
            ],
        }
    },
};