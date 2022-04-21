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
 * vue-router配置，
 * 最终会被展开合并进入./index.js
 */
import Layout from '@/views/layout/index.vue'
let pluginRoutes = [{
    name: '应用中心',
    path: '/plugins/center/index',
    perm: '',
    component: () => import('@/views/center/view/index.vue')
}]; 
/**
 * vuex的配置
 *
 */
export default [
    {
        name: '应用',
        path: '/plugins',
        perm: '',
        component: Layout,
        children: pluginRoutes
    }
]
