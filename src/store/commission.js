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
*  用于页面的一些宽度等基础配置
 */  
import settings from './commission/settings'
import settlementSettings from './commission/settlementSettins'
import otherSettings from './commission/otherSettings'
import rankSettings from './commission/rankSettings'
import noticeSettings from './commission/noticeSettings'
export default {
    namespaced: true,
    modules:{
        settings,
        settlementSettings,
        otherSettings,
        rankSettings,
        noticeSettings
    },
    state: {
         
    },
    mutations: {
        
    },
    actions: {
         
    }
};
