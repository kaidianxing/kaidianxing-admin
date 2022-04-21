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
export const model = {
    checkOptions: false,
    type: '0',
    title: '',
    sub_name: '',
    short_name: '',
    thumb: '',
    video: '',
    video_thumb: '', // 视频封面
    thumb_all: [],
    category_id: [], //商品分类
    sub_shop_category_id: [], // 商户产品分类
    is_recommand: '1',
    is_new: '1',
    is_hot: '1',
    sort_by: '',
    is_commission: '0',
    putaway_time: '',
    sales: '', // 虚拟销量
    label_id: [], // 商品标签
    has_option: '0', //规格
    price: '',
    original_price: '',
    cost_price: '',
    stock: '',
    virtual_account_id: '0', //虚拟卡密库-卡密库ID
    weight: '', // 重量（实体商品）
    reduction_type: '0',
    goods_sku: '',
    bar_code: '',
    logistics_support: 20 === +localStorage.getItem("shopType") ? ['1'] : [], // 物流支持（控制必填标识显示） 1:普通快递 
    dispatch_express: '0', // 普通快递
    dispatch_type: '0', // 运费设置（实体商品）
    dispatch_id: '0', // 运费模板（实体商品）
    dispatch_price: '0', // 统一运费（实体商品）
    auto_deliver: '1', // 自动发货（虚拟商品）
    auto_deliver_content: '', // 自动发货内容（虚拟商品）
    status: '1', // 上架设置
    params_switch: '0', // 参数状态
    params: [], // 参数
    // 商品详情
    content: '',
    // 权限部分
    browse_level_perm: '0', // 商品浏览权限
    browse_level_perm_ids: [], // 会员等级标签
    browse_tag_perm: '0', //
    browse_tag_perm_ids: [],
    buy_level_perm: '0',
    buy_level_perm_ids: [],
    buy_tag_perm: '0',
    buy_tag_perm_ids: [],
    // 营销
    deduction_credit_type: '0', // 积分抵扣
    deduction_credit: '', // 最多抵扣多少
    deduction_balance_type: '0', // 余额抵扣
    deduction_balance: '', // 抵扣多少
    single_full_unit_switch: '0', //是否单品满件包邮
    single_full_unit: '', // 满多少包邮
    single_full_quota_switch: '0', // 满额包邮
    single_full_quota: '', // 满多少元包邮
    deduction_balance_repeat: '0',
    deduction_credit_repeat: '0', // 允许多件累计抵扣
    give_credit_status: '0', // 消费得积分
    give_credit_num: '', // 消费送积分
};
export const ext_field = {
    show_sales: '0', //显示销量
    show_stock: '1', // 显示库存
    invoice: '0', //支持发票
    refund: '1', // 退款
    return: '1', // 退款退货（实体商品）
    exchange: '1', // 换货（实体商品）
    is_delivery_pay: '0', // 货到付款（实体商品）
    auto_putaway: '0', // 是否自动下架
    single_max_buy: '',
    single_min_buy: '',
    max_buy: '',
    putaway_time: '',
    note: '', // 商品备注
};
