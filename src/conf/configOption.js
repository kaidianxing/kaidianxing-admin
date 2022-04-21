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
/**
 * @Description: 用于存放公共的模板字段
 */
// 页码
export const page = {
    pageSize: 10,
    pageNumber: 1,
}
// 渠道状态配置
export const allSourceOption = {
    10: {
        class: 'icon-H color-icon-H',
        type: 'icon-qudao-H5-gray',
        name: '手机浏览器H5',
        iconType: 'class', // 图标类型class: class使用，svg按照svg使用
    },
    20: {
        class: 'icon-weixin color-weixin',
        type: 'icon-qudao-weixin-gray',
        name: '公众号',
        iconType: 'class'
    },
    21: {
        class: 'icon-weixinxiaochengxu color-weixinxiaochengxu',
        type: 'icon-qudao-weixinxiaochengxu-gray',
        name: '微信小程序',
        iconType: 'class'
    },
    30: {
        class: 'icon-qudao-toutiao2',
        type: 'icon-qudao-toutiao2-gray',
        name: '头条小程序',
        iconType: 'svg'
    },
    32: {
        class: 'icon-qudao-toutiaojisuban',
        type: 'icon-qudao-toutiaojisuban-gray',
        name: '头条小程序',
        iconType: 'svg'
    },
    31: {
        class: 'icon-douyin',
        type: 'icon-qudao-douyin-gary',
        name: '抖音小程序',
        iconType: 'svg'
    }
}
