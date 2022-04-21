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
 * 查找路由对应的路由配置模块
 * 缓存已注册的路由供查找
 */
import {
    samePath
} from '@/assets/helpers/index.js'
class RouteAdder {
    cachePath = {};
    allRoutes = []
    routes = [];
    dynamicPaths={}
    constructor(routes) {
        this.routes = routes;//完整的路由配置
    }
    searchRoutes(path) { //查找路由配置项
        let childrenPath = [];
        function traverse(tree, treePath = []) {//遍历方法
            for (let i = 0; i < tree.length; i++) {
                if (childrenPath.length) {
                    return
                }
                if (samePath(tree[i].path, path)) {
                    childrenPath = [...treePath, tree[i]];
                }
                if (tree[i].children) {
                    traverse(tree[i].children, [...treePath, tree[i]]);
                }
            }
            return false
        }
        let start = path.split('/')[1];//路径第一个单词通常作为模块id
        let module = '';
        for (let k in this.routes) {
            if (this.routes[k].path.split('/')[1]===start) {//路由配置的第一层级页面路径的模块id是否包含
                module = this.routes[k];
                break;
            }
        }
        if (module) {
            traverse([module]); //预先限定查找范围
        } else {
            traverse(this.routes); //全部模块遍历查找
        }
        if(childrenPath.length){ 
            this.cachePath[path]=true
            this.setCachePath([childrenPath[0]]);
            return [childrenPath[0]];//第0项为树结构最顶层的对象
        }
        return []
        
    }
    setCachePath(paths) { //缓存已注册的路由,将路由配置中的全部路由取出并缓存，避免重复注册
        let that = this;
        function traverse(tree) {
            for (let i = 0; i < tree.length; i++) {
                that.cachePath[tree[i].path] = true;
                if (tree[i].children) {
                    traverse(tree[i].children);
                }
            }
            return false
        }
        traverse(paths); //预先限定查找范围
    }
    hasPath(path) {//搜索this.cachePath，查看path是否已经注册过
        let hasPath = false
        if (!this.cachePath[path]) {
            for(let k in this.cachePath){
                if(samePath(k,path)){
                    hasPath=true;
                    break;
                }
            }
        }else{
            return true
        }
        return hasPath
    }
}
export default RouteAdder