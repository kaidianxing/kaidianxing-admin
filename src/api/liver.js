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
export const liverApi = {
  // 上传小程序临时素材
  uploadImg: {
    method: 'post',
    api: 'manage/wxapp/media/upload-image'
  },
  // 创建直播间
  createLiver: {
    method: 'post',
    api: 'manage/broadcast/room/add'
  },
  // 直播间列表
  getLiverList: {
    method: 'get',
    api: 'manage/broadcast/room/list'
  },
  decorateLiver: {
    method: 'get',
    api: 'manage/broadcast/room/room-and-goods-list'
  },
  // 直播间详情
  getLiverDetail: {
    method: 'get',
    api: 'manage/broadcast/room/detail'
  },
  // 直播间商品
  getLiverGoods: {
    method: 'get',
    api: 'manage/broadcast/room-operation/goods-list'
  },
  // 详情直播间商品
  liverDetailGoods: {
    method: 'get',
    api: 'manage/broadcast/room/detail-goods'
  },
  // 商品库列表
  getGoodsStore: {
    method: 'get',
    api: 'manage/broadcast/goods/list'
  },
  // 添加商品审核
  addAduit: {
    method: 'post',
    api: 'manage/broadcast/goods/add-audit'
  },
  // 撤销商品审核
  resetAduit: {
    method: 'post',
    api: 'manage/broadcast/goods/reset-audit'
  },
  // 重新商品审核
  repeatAudit: {
    method: 'post',
    api: 'manage/broadcast/goods/repeat-audit'
  },
  // 隐藏直播间
  hideLiver: {
    method: 'post',
    api: 'manage/broadcast/room/hide'
  },
  // 添加直播间商品
  addLiverGoods: {
    method: 'post',
    api: 'manage/broadcast/room-operation/add-room-goods'
  },
  // 删除直播间商品
  deleteLiverGoods: {
    method: 'post',
    api: 'manage/broadcast/goods/delete'
  },
  // 销售总览
  allIncome: {
    method: 'get',
    api: 'manage/broadcast/analyze/all'
  },
  // 销售分析
  sellSummary: {
    method: 'get',
    api: 'manage/broadcast/analyze/goods'
  },
  // 同步直播间
  syncLiver: {
    method: 'post',
    api: 'manage/broadcast/room/sync'
  },
  // 获取分享二维码
  getCodeImg: {
    method: 'get',
    api: 'manage/broadcast/room/get-qrcode'
  }
};
