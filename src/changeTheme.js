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
window.cssThemeVar={
    '--theme-color': '#1F65D7',
    '--theme-submenuBackground':'#E2EBFB',
    '--theme-navBackground':'#1F65D7',
    '--decorate-color':'#2d8cf0'
}     
for(var k in  window.cssThemeVar){
    document.documentElement.style.setProperty(k, window.cssThemeVar[k])
}
exports.cssThemeVar= window.cssThemeVar