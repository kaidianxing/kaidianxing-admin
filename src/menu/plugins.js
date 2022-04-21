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
 * 插件路由名规则：
 * 文件名就是插件名！！！
 * @/menu/plugins 与 @/router/plugins 中的文件一一对应
 */
import { menuTraverser } from '../assets/jsTools/traverser.js'
let paths = require.context('./', false, /\/.*Plugin\.js$/);//获取当前全部路由
let menus = {};//各个模块的路由配置集合
let pageIndex = 0
paths.keys().forEach(item => {
    let def = paths(item).default;
    menuTraverser(def, res => {
        if (typeof res == 'object' && !res._pageId) {
            res._pageId = '_pageId' + new Date().getTime() + '_' + pageIndex++
        }
    })
    if (def) {
        menus[item.replace(/(\.\/)|(\.js)/g,'')]=def
    }
});
export default {
    title: '应用',
    name: '应用',
    path: '/plugins/center/index',
    show: true,
    icon: 'icon-zuocedaohang-yingyong',
    zIndex: 100,
    children: {
        applicationCenter: {
            title: '应用中心',
            name: '应用中心',
            path: '/plugins/center/index',
            show: false,
            perm:'apps.index',
        },
        ...menus,
    }
}
