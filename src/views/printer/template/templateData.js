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
let templateList = [
    {
        value: '头部内容',
        type: 'header_info',
        children: [
            {
                value: '商城名称',
                type: 'shop_name',
                status: 1
            },
            // {
            //     value: '商城logo',
            //     type: 'shop_logo',
            //     status: 1
            // }
        ]
    },
    {
        value: '商品信息',
        type: 'goods_info',
        children: [
            {
                value: '商品名称',
                type: 'goods_name',
                status: 1,
                disabled: true
            },
            {
                value: '商品数量',
                type: 'goods_num',
                status: 1
            },
            // {
            //     value: '商品库存',
            //     type: 'goods_stock',
            //     status: 1
            // },
            {
                value: '商品金额',
                type: 'goods_price',
                status: 1
            },
            {
                value: '商品编码',
                type: 'goods_sku',
                status: 1,
                disabled: false
            },
            {
                value: '商品规格',
                type: 'goods_option',
                status: 0,
                disabled: true
            },
        ]
    },
    {
        value: '结算信息',
        type: 'calculate_info',
        children: [
            {
                value: '合计',
                type: 'order_original_price',
                status: 1
            },
            {
                value: '运费',
                type: 'dispatch_price',
                status: 0
            },
            {
                value: '优惠金额',
                type: 'order_discounts_price',
                status: 1
            },
            {
                value: '实付金额',
                type: 'order_pay_price',
                status: 1,
                disabled: true
            },
        ]
    },
    {
        value: '订单信息',
        type: 'order_info',
        children: [
            {
                value: '订单编号',
                type: 'order_no',
                status: 1
            },
            {
                value: '支付方式',
                type: 'pay_type',
                status: 0
            },
            {
                value: '支付渠道',
                type: 'pay_channel',
                status: 0
            },
            {
                value: '下单时间',
                type: 'created_at',
                status: 1
            },
            {
                value: '付款时间',
                type: 'pay_time',
                status: 0
            },
            {
                value: '收货时间',
                type: 'finish_time',
                status: 0
            },
            {
                value: '物流方式',
                type: 'dispatch_type',
                status: 0,
            },
            {
                value: '统一下单表单',
                type: 'order_form',
                status: 0,
            },
        ]
    },
    {
        value: '会员信息',
        type: 'member_info',
        children: [
            {
                value: '会员昵称',
                type: 'nickname',
                status: 1
            },
            {
                value: '会员手机号',
                type: 'mobile',
                status: 0
            },
            {
                value: '会员等级',
                type: 'level',
                status: 1
            },
            {
                value: '分销商等级',
                type: 'commission_level',
                status: 0
            }
        ]
    },
    {
        value: '备注信息',
        type: 'mark_info',
        children: [
            {
                value: '买家留言',
                type: 'customer_mark',
                status: 0
            },
            // {
            //     value: '商家备注',
            //     type: 'saler_mark',
            //     status: 0
            // }
        ]
    },
    {
        value: '买家信息',
        type: 'customer_info',
        children: [
            {
                value: '买家姓名',
                type: 'name',
                status: 1
            },
            {
                value: '联系方式',
                type: 'mobile',
                status: 1
            },
            {
                value: '买家地址',
                type: 'address',
                status: 0
            }
        ]
    },
    {
        value: '商城信息',
        type: 'shop_info',
        children: [
            {
                value: '商城二维码',
                type: 'qrcode',
                status: 0
            },
            {
                value: '联系方式',
                type: 'mobile',
                status: 1
            },
            {
                value: '商城地址',
                type: 'address',
                status: 1
            },
        ]
    },
];
export {templateList}
