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
 * 路由权限控制，
 * "goods.category.view": {//'key'：权限名称
 *      '/goods/classify': 1,//  页面路径 ：0默认不跳转；1默认跳转
 * 函数的入参perm为数组：["goods.category.view","goods.label.view"];
 * 根据perm 将 allPerm 中的对应项的页面路由的：0/1都改为1（即可跳转）；
 * ##本目录中不包含的路由项默认为可跳转##
 *
 */
import {
    samePath
} from '@/assets/helpers/index.js'
let allRoutes = null
import store from '@/store'
import { getReg } from '@/assets/jsTools/traverser'


class PermMap {
    pagePermMap = {}; //路由：权限映射map；{[route]:[perm]}；其中的route包括动态路由匹配规则
    permMap = {}; //权限映射{[perm]:[perm]}；用来判断一个页面的权限参数是否存在，不存在说明无权限
    cachePerms = null;//权限表缓存，避免重复计算permMap；缓存getPermsMap(perms)中的perms，如果每次传入的perms相同就不再继续后续计算
    cachePagePerm = {};//路由权限缓存 ；主要用来缓存动态路由相关的页面，避免重复匹配动态路由权限

    /**
     * @/router/*中全部模块页面配置参数
     * @param {路由配置树} routes 
     */
    init(routes) {
        let that = this;
        function traverse(tree) {//提取并展开页面的权限映射
            if (tree.length) {
                for (let i = 0; i < tree.length; i++) {
                    if (tree[i].perm||tree[i].perm===false) {
                        that.pagePermMap[tree[i].path] = tree[i].perm;
                    }
                    if (tree[i].children) {
                        traverse(tree[i].children);
                    }
                }
            }
        }
        traverse(routes); 
    }

    resetPerm() {
       this.cachePerms = null
       this.cachePagePerm = {}
    }

    getPermsMap(perms) {//输入值是用户的权限列表['app.view',...]
        if (perms === this.cachePerms&&perms ?.length) {//本次的perms与上次的相同就不再继续后续计算
            return this
        }
        this.cachePerms = perms;
        if (perms.length) {
            this.permMap={}
            this.cachePagePerm={}
            perms.forEach(item => {
                this.permMap[item] = item
            })
        }
        return this
    }
    hasPerm(route,needRefreshMenu=true) {
        let path=''
        let $route=route
        if(typeof route === 'string'){
            path=route
            $route={ 
                path,
                meta:{},
                query:{},
                params: {}
            }
            needRefreshMenu&&store.commit('menu/refreshMenu',$route);//刷新菜單
        }else{
            path=$route.path
            needRefreshMenu&&store.commit('menu/refreshMenu',$route);//刷新菜單
        } 
        if (typeof this.cachePagePerm[path] == 'boolean') {
            return this.cachePagePerm[path]
        }
        allRoutes = store.getters['menu/getAllPaths']
        
        let canNext = false //是否可以跳转
        /**
         * 检查store/menu/菜单中是否有这个页面的配置
         * 所有的页面路由都必须在store/menu中注册过，否则无法跳转
         */
        for (let i = 0; i < allRoutes.length; i++) {
            var reg = getReg(allRoutes[i]);//获取对应路由的正则表达式
            canNext = reg.test(path);//
            if (canNext) {
                break
            }
        }

        if(!canNext){//先判断该页面是否在menu中存在
            return false
        }
        let perm = ''
        
        if (this.pagePermMap[path]||this.pagePermMap[path]===false) { //直接查到页面对应的权限字段
            // if (this.cachePerms ?.length) { //已经获得了权限列表
                if (typeof this.pagePermMap[path] == 'function') {
                    perm = this.pagePermMap[path]($route, store)
                } else {
                    perm = this.pagePermMap[path]
                }
                if(typeof perm == 'boolean'){
                    this.cachePagePerm[path]=perm;
                    return perm
                } 
                if ((perm&&this.permMap[perm])||!perm) { //权限列表中有该页面的权限参数;或者权限为''或者undefined等空值
                    this.cachePagePerm[path]=true;
                    return true
                }
            // }
            this.cachePagePerm[path]=false;
            return false;
        } else { //如果没有查到页面的值，有可能是动态路由；或者没有设置权限；需要具体分析
        
            for (let k in this.pagePermMap) {
                if (samePath(k, path)) { //动态路由匹配到该页面对应的权限字段
                    if (typeof this.pagePermMap[k] == 'function') {
                        perm = this.pagePermMap[k]($route, store) 
                    } else {
                        perm = this.pagePermMap[k]
                    }
                    if(typeof perm == 'boolean'){
                        this.cachePagePerm[path]= perm
                    }else if(typeof perm == 'function'){
                        this.cachePagePerm[path]= perm($route, store)
                    }else{
                        this.cachePagePerm[path]=!!this.permMap[perm]
                    }
                    return this.cachePagePerm[path] //权限列表中是否有该页面的权限参数 
                }
            }
            this.cachePagePerm[path]=true;
            return true; //该页面没有设置权限
        }
    }
}
export default new PermMap;