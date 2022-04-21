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
export const goodsApi = {
    // 商品列表
    goodsList: {
        method: 'get',
        api: 'manage/goods/index/list'
    },
    // 获取单个商品信息
    getGood: {
        method: 'get',
        api: 'manage/goods/index/get'
    },
    // 添加商品
    addGood: {
        method: 'post',
        api: 'manage/goods/index/add'
    },
    // 修改商品
    editGood: {
        method: 'post',
        api: 'manage/goods/index/edit'
    },
    // 获取商品价格和库存
    getGoodInformation: {
        method: 'get',
        api: 'manage/goods/operation/get-price-and-stock'
    },
    // 设置商品价格和库存
    editInformation: {
        method: 'post',
        api: 'manage/goods/operation/set-price-and-stock'
    },
    // 批量下架
    batchSoldOut: {
        method: 'post',
        api: 'manage/goods/operation/unshelve'
    },
    // 批量设置商品分类
    setBatchClassify: {
        method: 'post',
        api: 'manage/goods/operation/set-category'
    },
    // 删除商品
    deleteGood: {
        method: 'post',
        api: 'manage/goods/operation/delete'
    },
    // 修改商品属性：营销标签、商品标题
    editGoodAttribute: {
        method: 'post',
        api: 'manage/goods/index/property'
    },
    // 获取单个商品分类
    getGoodClassify: {
        method: 'get',
        api: 'manage/goods/category/get-one'
    },
    // 商品分类列表
    goodClassifyList: {
        method: 'get',
        api: 'manage/goods/category/get-list'
    },
    // 商户商品分类
    goodMerchantsClassifyList: {
        method: 'get',
        api: 'manage/merchant/merchant/goods/category/get-list'
    },
    // 删除商品分类
    deleteGoodClassify: {
        method: 'post',
        api: 'manage/goods/category/forever-delete'
    },
    // 保存商品分类
    daveGoodClassify: {
        method: 'post',
        api: 'manage/goods/category/save'
    },
    editGoodClassifyStatus: {
        method: 'post',
        api: 'manage/goods/category/switch'
    },
    // 设置分类层级
    settingClassifyLevel: {
        method: 'post',
        api: 'manage/goods/category/set-setting'
    },
    // 获取分类层级设置
    getSettingClassifyLevel: {
        method: 'get',
        api: 'manage/goods/category/get-setting'
    },
    // 修改商品分类
    editGoodClassify: {
        method: 'post',
        api: 'manage/goods/category/update'
    },
    // 获取单个商品分组
    getGoodGroup: {
        method: 'get',
        api: 'manage/goods/group/get-one'
    },
    // 商品分组列表
    goodGroupList: {
        method: 'get',
        api: 'manage/goods/group/get-list'
    },
    //新增商品分组
    addGoodGroup: {
        method: 'post',
        api: 'manage/goods/group/create'
    },
    // 修改商品分组
    editGoodGroup: {
        method: 'post',
        api: 'manage/goods/group/update'
    },
    // 删除商品分组
    deleteGoodGroup: {
        method: 'post',
        api: 'manage/goods/group/forever-delete'
    },
    // 商品组状态修改
    editGoodGroupStatus: {
        method: 'post',
        api: 'manage/goods/group/switch'
    },
    // 商品标签组列表
    goodLabelGroupList: {
        method: 'get',
        api: 'manage/goods/label-group/get-list'
    },
    // 标签组删除
    deleteLabelGroup: {
        method: 'post',
        api: 'manage/goods/label-group/forever-delete'
    },
    // 标签组状态修改
    editLabelGroupStatus: {
        method: 'post',
        api: 'manage/goods/label-group/switch'
    },
    // 获取标签组单个
    getLabelGroup: {
        method: 'get',
        api: 'manage/goods/label-group/get-one'
    },
    // 新增标签组
    addLabelGroup: {
        method: 'post',
        api: 'manage/goods/label-group/create'
    },
    //修改标签组
    editLabelGroup: {
        method: 'post',
        api: 'manage/goods/label-group/update'
    },
    // 获取标签列表（包涵推荐和自定义）
    getGoodLabel: {
        method: 'get',
        api: 'manage/goods/label-group/get-list-and-label'
    },
    //批量永久删除
    foreverDel: {
        method: 'post',
        api: 'manage/goods/operation/forever-delete'
    },
    //批量上架
    launch: {
        method: 'post',
        api: 'manage/goods/operation/putaway'
    },
    //恢复
    recover: {
        method: 'post',
        api: 'manage/goods/operation/recover'
    },
    // 随机获取商品id
    getGoodsRanId: {
        method: 'get',
        api: 'manage/goods/index/rand-one-id'
    },
    // 获取商品小程序二维码
    getGoodQrcode: {
        method: 'get',
        api: 'manage/goods/index/get-goods-qrcode'
    },
    // 获取卡密库
    getVirtualData: {
        method: 'get',
        api: 'manage/goods/index/get-virtual-account'
    },
    // 获取活动商品列表-多
    getActivityGoods: {
        method: 'get',
        api: 'manage/goods/index/get-activity-goods'
    },
};
