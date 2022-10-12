/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
/***
 * 路由数据的持久化，用于页面操作后返回页面的先前状态
 * 使用该状态需要使用 $router.go(-1)来路由返回
 * ***/

import store from '@/store'
import {deepCopy} from '@/assets/util'
class History {
    history = {}
    currentRoute = null;
    constructor() {
        // this.history=store.state.setting.history;//持久化
    }
    setRoute(route) {
        this.currentRoute = route
        if(!this.currentRoute.query.timestamp){
            console.error('需要配置路由参数:{meta:{timestamp:true}}')
        }
        return this;
    }
    clear(path) {
        if(typeof path === 'object'){
            path=path.path
        }else if(!path){
            path=this.currentRoute.path
        }
        delete this.history[path]
        store.commit('setting/setHistory',this.history)
        return this
    }
    clearAll(){
        this.history={}
        store.commit('setting/setHistory',this.history)
        return this
    }
    setData(data){
        try{
            if (this.currentRoute) {
                let path = this.currentRoute.path
                let timestamp = this.currentRoute.query.timestamp;
                if (timestamp) {
                    this.history[path] = {
                        [timestamp]: deepCopy(data),
                    }
                    store.commit('setting/setHistory',this.history)
                }else{
                    console.error('没有配置时间戳,不能存储状态')
                }
            }else{
                console.error('请先setRoute')
            }
        }catch(e){
            console.error(e)
        }
        return this
    }

    getData(callback) {
        if(typeof callback=='function'){
            let route=this.currentRoute
            if (route) {
                let path = route.path
                let timestamp = route.query.timestamp
                let history = this.history[path] || {}
                if (timestamp) {
                    callback(history[timestamp] || {},route) 
                    return
                }

            }
            callback({},route)
        }
        return this
    }
}
let h = new History()
export default h