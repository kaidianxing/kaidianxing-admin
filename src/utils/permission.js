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
/**
 * 判断是否多商户，store 里面也有个当store 无法使用可以使用这个验证
 * store 可以考虑用此函数替代
 */
import store from '@/store';
export default {
    isMultiMerchant: () => {
        return 20 === +store?.state?.account?.shop?.shopType
    }
}