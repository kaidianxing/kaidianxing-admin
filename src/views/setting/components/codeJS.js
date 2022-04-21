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
    {
        type: 'order',
        name: '订单类',
        children: [
            {
                name: '订单信息',
                children: [
                    {
                        name: '商城名称'
                    },
                    {
                        name: '商品名称'
                    },
                    {
                        name: '粉丝昵称'
                    },
                    {
                        name: '订单号'
                    },
                    {
                        name: '订单金额'
                    },
                    {
                        name: '运费'
                    },
                    {
                        name: '商品详情'
                    },
                    {
                        name: '单品详情'
                    },
                    {
                        name: '快递公司'
                    },
                    {
                        name: '快递单号'
                    },
                    {
                        name: '购买者姓名'
                    },
                    {
                        name: '购买者电话'
                    },
                    {
                        name: '收货地址'
                    },
                    {
                        name: '下单时间'
                    },
                    {
                        name: '支付时间'
                    },
                    {
                        name: '发货时间'
                    },
                    {
                        name: '收货时间'
                    },
                    {
                        name: '积分变动'
                    },
                    {
                        name: '积分余额'
                    }
                ]
            },
            {
                name: '售后相关',
                children: [
                    {
                        name: '售后类型'
                    },
                    {
                        name: '申请金额'
                    },
                    {
                        name: '退款金额'
                    },
                    {
                        name: '退货地址'
                    },
                    {
                        name: '换货快递公司'
                    },
                    {
                        name: '换货快递单号'
                    }
                ]
            },
            {
                name: '订单状态更新',
                children: [
                    {
                        name: '粉丝昵称'
                    },
                    {
                        name: '订单编号'
                    },
                    {
                        name: '原收货地址'
                    },
                    {
                        name: '新收货地址'
                    },
                    {
                        name: '订单原价格'
                    },
                    {
                        name: '订单新价格'
                    },
                    {
                        name: '修改时间'
                    }
                ]
            }
        ]
    },
    {
        type: 'upgrade',
        name: '升级类',
        children: [
            {
                children: [
                    {
                        name: '商城名字'
                    },
                    {
                        name: '粉丝昵称'
                    },
                    {
                        name: '旧等级'
                    },
                    {
                        name: '新等级'
                    }
                ]
            }
        ]
    },
    {
        type: 'withdraw',
        name: '充值提现类',
        children: [
            {
                name: '充值',
                children: [
                    {
                        name: '支付方式'
                    },
                    {
                        name: '充值金额'
                    },
                    {
                        name: '充值时间'
                    },
                    {
                        name: '赠送金额'
                    },
                    {
                        name: '实际到账'
                    }
                ]
            },
            {
                name: '充值退款',
                children: [
                    {
                        name: '支付方式'
                    },
                    {
                        name: '充值金额'
                    },
                    {
                        name: '充值时间'
                    },
                    {
                        name: '赠送金额'
                    },
                    {
                        name: '实际到账'
                    },
                    {
                        name: '退款金额'
                    }
                ]
            },
            {
                name: '提现',
                children: [
                    {
                        name: '提现金额'
                    },
                    {
                        name: '提现时间'
                    }
                ]
            },
        ]
    },
    {
        type: 'commission',
        name: '分销类',
        children: [
            {
                name: '成为下级或分销商',
                children: [
                    {
                        name: '昵称'
                    },
                    {
                        name: '时间'
                    }
                ]
            },
            {
                name: '新增下线通知',
                children: [
                    {
                        name: '下线层级'
                    },
                    {
                        name: '下级昵称'
                    },
                    {
                        name: '时间'
                    }
                ]
            },
            {
                name: '下级付款类',
                children: [
                    {
                        name: '下级昵称'
                    },
                    {
                        name: '订单编号'
                    },
                    {
                        name: '订单金额'
                    },
                    {
                        name: '商品详情'
                    },
                    {
                        name: '佣金金额'
                    },
                    {
                        name: '时间'
                    },
                    {
                        name: '下线层级'
                    }
                ]
            },
            {
                name: '提现申请和佣金打款类',
                children: [
                    {
                        name: '昵称'
                    },
                    {
                        name: '时间'
                    },
                    {
                        name: '金额'
                    },
                    {
                        name: '提现方式'
                    }
                ]
            },
            {
                name: '分销商等级升级通知',
                children: [
                    {
                        name: '昵称'
                    },
                    {
                        name: '旧等级'
                    },
                    {
                        name: '旧一级分销比例'
                    },
                    {
                        name: '旧二级分销比例'
                    },
                    {
                        name: '旧三级分销比例'
                    },
                    {
                        name: '新等级'
                    },
                    {
                        name: '新一级分销比例'
                    },
                    {
                        name: '新二级分销比例'
                    },
                    {
                        name: '新三级分销比例'
                    },
                ]
            },
        ]
    },
]

export default codeList