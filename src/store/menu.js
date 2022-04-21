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
import menus from '../menu/index'
import {
    menuTraverser,
    searchPath
} from '../assets/jsTools/traverser'
import {
    deepMerge,
    deepCopy,
    deepCompare
} from '@/assets/jsTools/objectTools.js'
const CACHE_PERM_MAP = {}; //缓存对应菜单的权限，避免重复查找
let cachePerms = null;
let permMap = {} 
function editShowFunc(obj, permMap) {
    if (typeof CACHE_PERM_MAP[obj._pageId] != 'boolean') { //权限查询结果的缓存；用来优化，不会每次都indexOf查找一遍权限
        if (obj.perm) { //如果有perm字段就查找对应权限是否有
            let perm = '' 
            if (typeof obj.perm == 'function') {
                perm = obj.perm
            } else {
                perm = !!permMap[obj.perm]
            }
            CACHE_PERM_MAP[obj._pageId] = perm
        } else { //没有perm字段或者没有填写权限就当做有权限
            CACHE_PERM_MAP[obj._pageId] = true;
        }
    }
    obj.perm = CACHE_PERM_MAP[obj._pageId];//获取菜单对应的权限缓存
    if(!permMap.length){
        CACHE_PERM_MAP[obj._pageId]=null
    }
    if (obj.show !== false) {//将菜单中的perm合并进入show函数 ，共同控制菜单的显示隐藏；如果false就默认隐藏；若为undefined，true,function等就继续向下具体分析
        let showProp = obj.show;
        obj.show = ($route, $store) => {//这里将show转换为函数
            let show = true;
            if (typeof showProp == 'function') {//show原值为函数
                show = showProp($route, $store)
            } else {
                show = showProp;//若为true，undefined等其他值
            }
            if (show || show === undefined || show === null || show === '') { //这里再根据权限来限制show；这里的undefined、null、''、等值都默认为true
                let perm = ''
                if (typeof obj.perm == 'function') {
                    perm = obj.perm($route.path)
                }else{
                    perm = obj.perm
                }
                if( typeof perm=='boolean'){
                    return perm
                }
                return permMap[perm]; //如果权限函数返回权限字段
            }
            return show;
        }
    }
}

export default {
    namespaced: true,
    state: {
        menus,
        currentPageInfo: null,
        allPaths: [], //menu下的全部的路由
        firstLevelMenu:[],
        systemMenu:[],//系统设置菜单
        secondLevelMenu:{},
        cacheSubmenu:{},
        topMenuList: {},
        activeTopMenu: '',
        leftMenuList: {},
        activeLeftMenu: '',
        crumbs: [],
        routerNextFunction:{},
    },
    mutations: {
        routerNextFunction: (state, result) => {
            state.routerNextFunction = result;
        },
        setTopMenuList: (state, result) => {
            console.log('store:setTopMenuList')
            state.topMenuList = result;
        },
        setActiveTopMenu: (state, result) => {
            console.log('store:setActiveTopMenu',result)
            state.activeTopMenu = result;
        },
        setLeftMenuList: (state, result) => {
            console.log('store:setLeftMenuList',result)
            state.leftMenuList = result;
        },
        setCrumbs: (state, result) => {
            console.log('store:setCrumbs')
            state.crumbs = result;
        },
        refreshMenu(state, $route) {
            let tmp = deepCopy(menus);
            let item = null;
            let perms = this.state.config.user?.perms || [];
            if (cachePerms != perms&&perms.length) {
                cachePerms = perms;
                permMap = {}
                perms.forEach(item => {
                    permMap[item] = item;
                })
            }
            for (let k in tmp) {
                item = tmp[k]
                menuTraverser(item, val => {
                    if (typeof val == 'object') {
                        editShowFunc(val, permMap); //根据权限perm处理show字段；
                        for (let k in val) {
                            if (typeof val[k] == 'function') {
                                val[k] = val[k]($route, this);
                            }
                        }
                    }
                })
            }
            state.menus = tmp;
        },
        setCurPage(state, data) {
            state.currentPageInfo = data
        },
        editMenu(state, menu) {
            state.menus = {
                ...deepMerge(state.menu, menu)
            }
        },
        refresh(state) {
            state.menus = {
                ...state.menus
            }
        }
    },
    getters: {
        getLeftMenuList(state){
            return state.leftMenuList
        },
        getSystemMenu(state){//系统设置菜单
            let menus = [];
            for (let k in state.menus.system.children) {
                menus.push(state.menus.system.children[k])
            }
            state.systemMenu= menus.sort((a, b) => a.zIndex - b.zIndex)
            return state.systemMenu
        },
        getBreadcrumb(state) {

            //查询当前页的面包屑
            return path => {
                return searchPath(state.menus, path)
            }
        },
        getFirstLevelMenu(state) { 
            // 缓存影响菜单切换，暂时关闭 22542
            // if(state.firstLevelMenu.length){
            //     return state.firstLevelMenu
            // }
            //获取一级菜单
            let menus = [];
            for (let k in state.menus) {
                menus.push(state.menus[k])
            }
            state.firstLevelMenu= menus.sort((a, b) => a.zIndex - b.zIndex)
            return state.firstLevelMenu
        },
        getSecondLevelMenu(state) {
            //获取二级菜单
            return id => {
                let children = state.menus[id] ?.children || state.menus.plugins.children[`${id}Plugin`] ?.children
                let menus = [];
                for (let k in children) {
                    menus.push(children[k])
                }
                menus= menus.sort((a, b) => a.zIndex - b.zIndex)
                
                if(!deepCompare(state.secondLevelMenu[id],menus)){
                    state.secondLevelMenu[id]= menus
                }
                return state.secondLevelMenu[id]
            }
        },
        getAllSubMenu(state) {
            //获取二级及以下的全部导航
            return id => {
                let menu = []
                let subMenu = state.menus[id] || state.menus.plugins.children[`${id}Plugin`]
                menuTraverser(subMenu, (res, level) => {
                    if (level !== 0 && (res.path || res.redirect)) {
                        //排除一级目录以及无path的
                        menu.push(res)
                    }
                })
                if(!deepCompare(state.cacheSubmenu[id],menu)){
                    state.cacheSubmenu[id]= menu
                }
                return state.cacheSubmenu[id]
            }
        },
        getAllPaths(state, getters) {
            //全部路由
            if(state.allPaths.length){
                return state.allPaths
            }
            let tmp = state.menus
            let firLevel = Object.keys(tmp).map(item => tmp[item].path)
            let subPath = []
            firLevel.forEach(item => {
               item &&( subPath = [
                    ...subPath,
                    ...getters['getAllSubMenu'](item.split('/')[1]).map(
                        item => item.path
                    )
                ])
            })
            state.allPaths = [...firLevel, ...subPath]
            return state.allPaths
        },
    }
}
