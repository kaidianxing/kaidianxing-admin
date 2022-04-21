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

import store from '../store';
import router from '@/router';
import Vue from "vue";

/**
 * 请求拦截;
 * beforeRequest 请求前拦截
 * afterRequest  请求后拦截
 */
const interceptor = {
    beforeRequest: null,
    afterRequest: null
}
/**
 * 请求前拦截，调用next方法继续下一步请求
 * requestParams接口信息
 * data 请求的参数
 */
interceptor.beforeRequest = ({
    next,
    // requestParams,
    // data
}) => {
    // console.log(requestParams, data);
    next()
}
/**
 * 请求后拦截，调用next方法继续返回值
 * result 请求的结果
 * requestId 只是一个请求的标识，没用其他用处，会在afterRequest的返回对象中返回；
 * requestId 主要用来区分请求的来源,可以拼接页面路由上去
 */

//  ,

interceptor.afterRequest = ({
    next,
    result,
    requestInfo
}) => {
    if (result.error !== 0) {
        // 系统未安装，跳转安装部分

        if (result.error === -11001) {
            window.location.href = window.config.base_url + '/install';
        } else if (result.error === -12001) {
            router.router.push({
                path: '/create/index'
            })
        } else if (result.error === 100200) {
            // 100200：未登录、
            if (window.localStorage.getItem('shopFlag') == 1) {
                Vue.prototype.$Message.error({ content: result.message, duration: 3 });
                window.localStorage.setItem('shopFlag', 0);
                router.router.replace("/account/login");
                // setTimeout(()=> {
                //     window.location.replace(window.config?.base_url.split(new RegExp(`(?<=[a-zA-Z])/`))[0])
                // },1000)
            }
        }else if(result.error === 100202) { // 用户session-id失效
            store.dispatch('alone/initUser').then(()=> {
                router.router.replace("/account/login");
            })
        }  else if(new Set([100309, 121211, 121222,121310]).has(result.error)) {
            // 100309：店铺操作员不存在、121211：店铺被禁用、121222：店铺被删除  121310: 店铺未找到
            store.commit('alone/setLoginStatus', false)
            store.commit('account/setSessionId', '')
            Vue.prototype.$Message.error({ content: result.message, duration: 3 });
            router.router.replace("/account/login");


        } else {
            if(requestInfo.settings && requestInfo.settings.hasOwnProperty('errorToast') &&  requestInfo.settings.errorToast ===false){
                //不返回报错信息
                store.commit('setRequestInfo', { result: { error: 0}, requestInfo })
            }else{
                store.commit('setRequestInfo', { result, requestInfo })
            }
        }
    } else if (result.error === 0) {
        store.commit('setRequestInfo', { result: { error: 0 }, requestInfo })
    }
    next()
};
export default interceptor;
