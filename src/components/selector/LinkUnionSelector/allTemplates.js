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
 * @date 2021-09-10 17:51
 * @describe 所有组件汇总页 注意组件名称等于文件名
 */
let paths = require.context('./components/', false, /\/.*\.vue$/);//获取当前全部路由
let components = {};
paths.keys().forEach(item => {//获取本级目录下的全部配置参数
    let name = item.replace(/.+\/(\w+).vue/, 'Link$1');
    components[name] = paths(item).default;
});
export default components
