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
let paths = require.context('./', false, /\/.*\.js$/); //获取当前目录全部文件
let modules = require.context('../pages', false, /\/.*\.js$/)
import * as allItems from '../allItems'

class ValidPluginPerm {

    _perms = {}
    _pageModules = {}

    _cachePerms = {};
    _cachePageModule = {}


    constructor() {
        this.loadSpecialPerm()
        this.loadAllPageModule()
        this.initAllPerm()
    }

    // 初始化所有装修组件权限
    initAllPerm() {
        for (let k in allItems) {
            this._cachePerms[k] = this._perms[k] || {
                showOperBtn: true,
            };
        }
    }
    // 获取需要特殊组件装修权限的模块
    loadSpecialPerm() {
        paths.keys().forEach(item => { //获取本级目录下的全部配置参数
            let name = item.replace(/.+\/(\w+).js/, '$1');
            let moduleDefault = paths(item).default
            moduleDefault && (this._perms[name] = moduleDefault);
        });
    }
    // 加载页面所包括的装修组件
    loadAllPageModule() {
        modules.keys().forEach(item => {
            let name = item.replace(/.+\/(\w+).js/, '$1');
            this._pageModules[name] = {
                name,
                item,
                modules
            }
        })
    }
    // 按需加载页面对应的装修组件列表
    load(pageId) {
        // vip-center => vipCenter 
        pageId = pageId.replace(/(-\w{1})/, ($1) => $1.slice(1).toUpperCase())
        if (!this._cachePageModule[pageId]) {
            this.getPageComponent(pageId)
            this.initPagePerm(pageId)
        }
    }

    // 缓存页面对应的装修组件列表
    getPageComponent(pageId) {
        let { item, modules } = this._pageModules[pageId]

        let moduleDefault = modules(item).default

        if (moduleDefault) {
            this._cachePageModule[pageId] = []
            Object.keys(moduleDefault).forEach(k => {
                this._cachePageModule[pageId] = [...this._cachePageModule[pageId], ...moduleDefault[k]]
            })
        }
    }
    // 初始化页面所有的装修组件权限
    initPagePerm(pageId) {
        let result = this.getExectorPerm(pageId)


        for (let i = 0; i < result.length; i++) {
            let item = result[i]
            let cur = this._cachePerms[item.type]
            if (cur.cached) { continue }

            // 过滤出来可以执行的函数和promise
            let promises = Object.keys(cur).filter((key) =>
                isExecutor(cur, key)).map(key => Promise.resolve(cur[key]().then(res=> {
                    cur[key] =res
                }))
            );

            if (promises.length == 0) {
                cur.cached = true
            } else {
                Promise.all(promises).then(() => cur.cached = true)
            }
        }

        // 判断是可以执行的函数
        function isExecutor(cur, key) {
            return typeof cur[key] == 'function' && key != 'customPerm'
        }
    }
    // 获取需要页面对应且需要特殊处理的装修插件权益
    getExectorPerm(pageId) {
        return this._cachePageModule[pageId].reduce((t, k) => {
            // 判断需要单独处理的装修文件存在 且没有被缓存过
            if (this._perms[k.type] && !this._cachePerms[k.type].cached) {
                t.push({ type: k.type, permsList: this._perms[k.type] })
            }
            return t
        }, [])
    }
    // 初始化组件独特插件权益
    initCustomPerm(item) {

        if (!item && !this._perms[item.type]) return;
        let { customPerm } = this._perms[item.type] || {}
        if (customPerm && typeof customPerm === 'function') {
            return Promise.resolve(customPerm.call(this._perms[item.type], item) || {})
        }
        return Promise.resolve({})
    }

    get cachePerms() {
        return this._cachePerms
    }
}


function getInstancePerm() {
    let instance;
    return (pageId) => {
        if (!instance) {
            instance = new ValidPluginPerm();
        }
        pageId && instance.load(pageId)
        return instance
    }
}

// 导出单例
let initPageDecoratePerm = getInstancePerm()

export default initPageDecoratePerm
