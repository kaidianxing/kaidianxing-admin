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
/*
 * @Description: api 地址过滤器
 * @Autor: ding.luchao
 */
import store from '@/store'
/**
 * 责任链过滤所有的内容。
 * 注册中心
 */
const Responsibility = [
  (options = {})=> {
    if(!options.baseURL.includes('manageApi')&& options.url.includes('adminApi')) {
      options.baseURL = `${location.origin}/${store.state.config.admin?.enter}/api`
      options.url = options.url.replace('adminApi','')
      return false
    } else if(options.url.includes('adminApi')) {
      options.baseURL = '/'
      return false
    }
  },
  // 过滤admin
  (options = {}) => {
    if (!options.baseURL.includes("manageApi")) {
      options.url = options.url.replace(/\/?manage\//, "/");
    }
  },
];

export default (options = {}) => {
  for (let i = 0; i < Responsibility.length; i++) {
    if(Responsibility[i](options)== false) {
      break
    }
  }
};
