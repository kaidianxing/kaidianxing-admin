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
 * 本目录下各个js文件只是将路由分类配置导出，
 * 最终仍然展开汇入这里的routes中
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import permMapper from './router-permit/permMap.js'
import { afterEach,beforeGuard } from './router-guard/index'
import store from '@/store'

// 解决路由报错 NavigationDuplicated
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch((error) => error)
}

let paths = require.context('./', false, /\/.*\.js$/) //获取当前全部路由
let routes = [] //各个模块的路由配置集合
paths
        .keys()
        .map((item) => {
            //获取本级目录下的全部配置参数
            return paths(item).default
        })
        .filter((item) => item)
        .forEach((item) => {
            routes = routes.concat(item)
        })
Vue.use(VueRouter)
const router = new VueRouter({
    mode: "history",
    // base: "shop",
    // routes: []
    routes: routes,
})
// import DynRouteAdder from './router-permit/DynamicRouteAdder'
// let routeAdder = new DynRouteAdder(routes); //动态路由注册功能对象
permMapper.init(routes) //路由权限查询对象
store.commit('config/setRoutes', routes)
router.afterEach(afterEach)
router.beforeEach(async (to, from, next) => {
    try {
        /* 检测路径 */
        await beforeGuard.rediectPath(to, from, next)
        /* 调整路由参数 */
        await beforeGuard.parsePath(to, from, next)
        /* 检测登录状态 */
        await beforeGuard.checkLogin(to, from, next)
        /* 检测权限 */
        await beforeGuard.checkPerm({ to, from, next })
    } catch (error) {
        console.log(error)
    }

})

export default {
    router,
}
