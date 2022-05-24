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
 * 将本目录下导出的菜单配置对象引入，
 * 合并为一个大的对象导入store/menu.js中
 * zIndex是菜单的排序权重，大在下；
 * zIndex只在同父级的兄弟间进行比较
 */
import { menuTraverser } from '../assets/jsTools/traverser.js'
let paths = require.context('./', false, /^((?!Plugin).)*\.js$/);//获取当前非plugin 结尾 js文件
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
export default menus
