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
import store from '@/store'
import Vue from 'vue'
import getSessionId from '@/api/config/getSessionId'
import {clearErrorCache} from '@/helpers/directives'
import {deepCopy, deepCompare} from '@/assets/helpers'
import redirectRoutes from './redirectRoutes.js' //重定向路由备选表
import permMapper from '../router-permit/permMap.js'

export const beforeEach = (to, from, next) => {
    to.path.indexOf('/decorate/') > -1 && store.commit('layout/setRouterEntering', true)
    localStorage.setItem('reload', '');//用来强制刷新页面的标识，''是指下次报错可以强制刷新，1是指下次有错也不能刷新
    next()
}
export const afterEach = (to) => {
    store.commit('layout/setRouterEntering', false)
    store.commit('setCurRoute', to)
    clearErrorCache();//页面错误定位功能
}

class BeforeGuard {
    constructor() {
        this.cacheShopId = ''
        this.cacheUserId = ''  // 独立版
        this.permList = []
        this.shopChanged = false
    }

    /* 是否重定向跳转 */
    rediectPath(to, from, next) {
        return new Promise((resolve, reject) => {
            if (to.path == from.path) {
                let toQuery = deepCopy(to.query)
                let fromQuery = deepCopy(from.query)
                delete toQuery.timestamp
                delete fromQuery.timestamp
                if (deepCompare(toQuery, fromQuery)) {//防止反复重定向
                    next(false)
                    reject('反复重定向')
                }
            }
            resolve()
        })
    }

    /* 调整参数 */
    parsePath(to, from, next) {
        return new Promise((resolve, reject) => {
            if (to.meta?.timestamp && !to.query?.timestamp) {
                next({
                    path: to.path,
                    query: {
                        ...to.query,
                        timestamp: new Date().getTime()
                    }
                })
                reject('调整参数')

            } else {
                resolve()
            }
        })

    }

    /* 检测登录 */
    checkLogin(to, from, next) {
        let sessionId_s = store.state.account?.sessionId
        let handler = this.checkAloneLogin
        if (typeof handler !== 'function') {
            return Promise.reject('当前渠道登录方式未注册')
        }
        return handler.call(this, {
            sessionId_s,
            next,
            to
        })
    }

    checkAloneLogin({sessionId_s, to, next}) {
        return new Promise(async (resolve, reject) => {
            let flag = !!sessionId_s
            if (!sessionId_s) {
                await getSessionId()
            } else {
                flag = await store.dispatch('alone/getLoginStatus');
            }
            if (flag) {
                if (to.path == '/account/login') {
                    next('/')
                    reject('当前已登录')
                } else {
                    resolve()
                }
            } else if (to.meta && to.meta.module == 'account') {
                next()
                reject('checkAloneLogin---重定向')
            } else {
                // 清空用户信息
                store.commit('alone/setUserInfo', {})
                next({
                    path: '/account/login'
                })
                reject('重定向登录' + to.path)
            }
        })
    }

    // 检测权限
    checkPerm({to, from, next}) {
        // 检测userId有没有变更，变更请求init接口
        const userId = store.state.config?.user?.id
        if (this.cacheUserId != userId || !userId) {
            this.shopChanged = true
            this.cacheUserId = userId
        }

        return new Promise(async (resolve, reject) => {
            if (!this.permList.length || this.shopChanged) {
                await store.dispatch('config/getShopInit', {to, forceUpdate: true}).then(res => {
                    if (res.error === 100201) {
                        // 清空用户信息
                        store.commit('alone/setUserInfo', {})
                        localStorage.clear()
                        next({
                            path: '/account/login'
                        })
                        reject('用户未找到,重定向登录' + to.path)
                    }
                })
                this.permList = store.state.config.user?.perms || []
            } else {
                // 商家端的设置ico = logo
                store.commit('config/setBaseSetting', store.state.config.baseSetting || {});
            }

            if (this.shopChanged) {
                permMapper.resetPerm()
            }

            if (!permMapper.getPermsMap(this.permList).hasPerm(to)) {
                //无权限的页面；1有权限  0无权限
                let routes = redirectRoutes(to.path)
                for (let path of routes) {
                    //遍历重定向页面列表找到最近一个有权限的路由
                    if (permMapper.hasPerm(path)) {
                        if (path.split('/')[1] != to.path.split('/')[1]) {
                            //要去的模块一个有权限的页面都没有
                            Vue.prototype.$Message.info('暂无权限:' + to.path)
                        }
                        next(path)
                        reject('暂无权限：' + to.path)
                        return
                    }
                }
            }
            beforeEach(to, from, next)
        })

    }
}

export const beforeGuard = new BeforeGuard()