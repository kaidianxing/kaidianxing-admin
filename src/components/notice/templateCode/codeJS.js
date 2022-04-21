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
const codeList = [
    // 订单类
    {
        value: '[订单类]',
        label: '订单类',
        children: [
            {
                value: '[订单信息]',
                label: '订单信息',
                children: [
                    {
                        value: '[商城名称]',
                        label: '商城名称'
                    },
                    {
                        value: '[商品名称]',
                        label: '商品名称'
                    },
                    {
                        value: '[会员昵称]',
                        label: '会员昵称'
                    },
                    {
                        value: '[订单编号]',
                        label: '订单编号'
                    },
                    {
                        value: '[支付金额]',
                        label: '支付金额'
                    },
                    {
                        value: '[运费]',
                        label: '运费'
                    },
                    {
                        value: '[商品详情]',
                        label: '商品详情'
                    },
                    {
                        value: '[快递公司]',
                        label: '快递公司'
                    },
                    {
                        value: '[快递单号]',
                        label: '快递单号'
                    },
                    {
                        value: '[买家姓名]',
                        label: '买家姓名'
                    },
                    {
                        value: '[买家电话]',
                        label: '买家电话'
                    },
                    {
                        value: '[收货地址]',
                        label: '收货地址'
                    },
                    {
                        value: '[下单时间]',
                        label: '下单时间'
                    },
                    {
                        value: '[支付时间]',
                        label: '支付时间'
                    },
                    {
                        value: '[发货时间]',
                        label: '发货时间'
                    },
                    {
                        value: '[收货时间]',
                        label: '收货时间'
                    },
                    {
                        value: '[积分变动]',
                        label: '积分变动'
                    },
                    {
                        value: '[积分余额]',
                        label: '积分余额'
                    },
                    {
                        value: '[订单状态]',
                        label: '订单状态'
                    },
                    {
                        value: '[买家备注]',
                        label: '买家备注'
                    },
                ]
            },
            {
                label: '售后相关',
                value: '[售后相关]',
                children: [
                    {
                        value: '[订单编号]',
                        label: '订单编号'
                    },
                    {
                        value: '[售后类型]',
                        label: '售后类型'
                    },
                    {
                        value: '[申请时间]',
                        label: '申请时间'
                    },
                    {
                        value: '[退款金额]',
                        label: '退款金额'
                    },
                    {
                        value: '[退货地址]',
                        label: '退货地址'
                    },
                    {
                        value: '[换货快递公司]',
                        label: '换货快递公司'
                    },
                    {
                        value: '[换货快递单号]',
                        label: '换货快递单号'
                    },
                    {
                        value: '[退款状态]',
                        label: '退款状态'
                    }
                ]
            },
            /*{
                label: '订单状态更新',
                children: [
                    {
                        label: '粉丝昵称'
                    },
                    {
                        label: '订单编号'
                    },
                    {
                        label: '原收货地址'
                    },
                    {
                        label: '新收货地址'
                    },
                    {
                        label: '订单原价格'
                    },
                    {
                        label: '订单新价格'
                    },
                    {
                        label: '修改时间'
                    }
                ]
            }*/
        ]
    },
    // 账户变动类
    {
        value: '[账户变动类]',
        label: '账户变动类',
        children: [
            {
                value: '[变动账户]',
                label: '变动账户',
                children: [
                    {
                        value: '[变动账户]',
                        label: '变动账户',
                    }
                ]
            },
            {
                value: '[变动时间]',
                label: '变动时间',
                children: [
                    {
                        value: '[充值时间]',
                        label: '充值时间',
                    },
                    {
                        value: '[退款时间]',
                        label: '退款时间',
                    },
                    {
                        value: '[提现时间]',
                        label: '提现时间',
                    }
                ]
            },
            {
                value: '[变动金额]',
                label: '变动金额',
                children: [
                    {
                        value: '[充值金额]',
                        label: '充值金额',
                    },
                    {
                        value: '[退款金额]',
                        label: '退款金额',
                    },
                    {
                        value: '[提现金额]',
                        label: '提现金额',
                    }
                ]
            },
            {
                value: '[账户余额]',
                label: '账户余额',
                children: [
                    {
                        value: '[账户余额]',
                        label: '账户余额',
                    },
                    {
                        value: '[账户积分]',
                        label: '账户积分',
                    }
                ]
            },
            {
                value: '[优惠券类型]',
                label: '优惠券类型',
                children: [
                    {
                        value: '[优惠券类型]',
                        label: '优惠券类型',
                    }
                ]
            },
            {
                value: '[发放状态]',
                label: '发放状态',
                children: [
                    {
                        value: '[发放状态]',
                        label: '发放状态',
                    }
                ]
            },
            {
                value: '[发放时间]',
                label: '发放时间',
                children: [
                    {
                        value: '[发放时间]',
                        label: '发放时间',
                    }
                ]
            },
        ]
    },

    // 注册登录类
    {
        value: '[注册登录类]',
        label: '注册登录类',
        children: [
            {
                value: '[验证码]',
                label: '验证码',
                children: [
                    {
                        value: '[验证码]',
                        label: '验证码',
                    }
                ]
            }
        ]
    },

    // 分销类
    {
        value: '[分销类]',
        label: '分销类',
        children: [
            {
                value: '[分销身份变更]',
                label: '分销身份变更',
                children: [
                    {
                        value: '[商城名称]',
                        label: '商城名称'
                    },
                    {
                        value: '[用户昵称]',
                        label: '用户昵称'
                    },
                    {
                        value: '[手机号]',
                        label: '手机号'
                    },
                    {
                        value: '[变动时间]',
                        label: '变动时间'
                    },
                    {
                        value: '[下级昵称]',
                        label: '下级昵称'
                    },
                    {
                        value: '[下级等级]',
                        label: '下级等级'
                    },
                    {
                        value: '[旧等级]',
                        label: '旧等级'
                    },
                    {
                        value: '[新等级]',
                        label: '新等级'
                    }
                ]
            },
            {
                value: '[分销订单]',
                label: '分销订单',
                children: [
                    {
                        value: '[订单编号]',
                        label: '订单编号'
                    },
                    {
                        value: '[订单金额]',
                        label: '订单金额'
                    },
                    {
                        value: '[佣金金额]',
                        label: '佣金金额'
                    },
                    {
                        value: '[商品名称]',
                        label: '商品名称'
                    },
                    {
                        value: '[付款时间]',
                        label: '付款时间'
                    },
                    {
                        value: '[下级层级]',
                        label: '下级层级'
                    }
                ]
            },
            {
                value: '[佣金与提现]',
                label: '佣金与提现',
                children: [
                    {
                        value: '[提现时间]',
                        label: '提现时间'
                    },
                    {
                        value: '[提现金额]',
                        label: '提现金额'
                    },
                    {
                        value: '[审核结果]',
                        label: '审核结果'
                    }
                ]
            },
        ]
    },
    {
        value: '[表单类]',
        label: '表单类',
        children: [
            {
                value: '[用户昵称]',
                children: [
                    {
                        value: '[用户昵称]',
                        label: '用户昵称',
                    },
                    {
                        value: '[操作时间]',
                        label: '操作时间',
                    },
                    {
                        value: '[表单名称]',
                        label: '表单名称',
                    },
                    {
                        value: '[应用页面]',
                        label: '应用页面',
                    },
                    {
                        value: '[数据ID]',
                        label: '数据ID',
                    },
                ]
            }
        ]
    },


    /*{
        value: 'upgrade',
        label: '升级类',
        children: [
            {
                children: [
                    {
                        label: '商城名字'
                    },
                    {
                        label: '粉丝昵称'
                    },
                    {
                        label: '旧等级'
                    },
                    {
                        label: '新等级'
                    }
                ]
            }
        ]
    },*/
    /* {
         value: 'withdraw',
         label: '充值提现类',
         children: [
             {
                 label: '充值',
                 children: [
                     {
                         label: '支付方式'
                     },
                     {
                         label: '充值金额'
                     },
                     {
                         label: '充值时间'
                     },
                     {
                         label: '赠送金额'
                     },
                     {
                         label: '实际到账'
                     }
                 ]
             },
             {
                 label: '充值退款',
                 children: [
                     {
                         label: '支付方式'
                     },
                     {
                         label: '充值金额'
                     },
                     {
                         label: '充值时间'
                     },
                     {
                         label: '赠送金额'
                     },
                     {
                         label: '实际到账'
                     },
                     {
                         label: '退款金额'
                     }
                 ]
             },
             {
                 label: '提现',
                 children: [
                     {
                         label: '提现金额'
                     },
                     {
                         label: '提现时间'
                     }
                 ]
             },
         ]
     },*/
    /*{
        value: 'commission',
        label: '分销类',
        children: [
            {
                label: '成为下级或分销商',
                children: [
                    {
                        label: '昵称'
                    },
                    {
                        label: '时间'
                    }
                ]
            },
            {
                label: '新增下线通知',
                children: [
                    {
                        label: '下线层级'
                    },
                    {
                        label: '下级昵称'
                    },
                    {
                        label: '时间'
                    }
                ]
            },
            {
                label: '下级付款类',
                children: [
                    {
                        label: '下级昵称'
                    },
                    {
                        label: '订单编号'
                    },
                    {
                        label: '订单金额'
                    },
                    {
                        label: '商品详情'
                    },
                    {
                        label: '佣金金额'
                    },
                    {
                        label: '时间'
                    },
                    {
                        label: '下线层级'
                    }
                ]
            },
            {
                label: '提现申请和佣金打款类',
                children: [
                    {
                        label: '昵称'
                    },
                    {
                        label: '时间'
                    },
                    {
                        label: '金额'
                    },
                    {
                        label: '提现方式'
                    }
                ]
            },
            {
                label: '分销商等级升级通知',
                children: [
                    {
                        label: '昵称'
                    },
                    {
                        label: '旧等级'
                    },
                    {
                        label: '旧一级分销比例'
                    },
                    {
                        label: '旧二级分销比例'
                    },
                    {
                        label: '旧三级分销比例'
                    },
                    {
                        label: '新等级'
                    },
                    {
                        label: '新一级分销比例'
                    },
                    {
                        label: '新二级分销比例'
                    },
                    {
                        label: '新三级分销比例'
                    },
                ]
            },
        ]
    },*/
]

export default codeList
