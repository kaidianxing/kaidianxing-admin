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
 * 实现类似axios的请求方法
 */
import axios from 'axios'
import { config as settings } from './settings.js'
import qs from 'qs'
import flatten from '../../assets/jsTools/flatter'
import Responsibility from "./filter/api.filter";
import getSessionId from './getSessionId.js'

let base_url = settings.base_url

// 解决跨域使用
base_url = process.env.NODE_ENV === 'development' ? '/manageApi/' : settings.base_url

let http = axios.create({
    baseURL: base_url,
    withCredentials: true,
    transformRequest: [
        function(data) {
            // 解决传递数组变成对象的问题
            data = flatten(data) //对象扁平化
            Object.keys(data).forEach((key) => {
                if (typeof data[key] === 'object') {
                    data[key] = JSON.stringify(data[key]) // 这里必须使用内置JSON对象转换
                }
            })
            data = qs.stringify(data) // 这里必须使用qs库进行转换
            return data
        },
    ],
})
// 请求拦截
//注意请求头中不能有null或undefined的存在，不然会报错
http.interceptors.request.use(
    (config) => {
        return new Promise((r) => {
            if (
              !config.url.includes("get-session-id")
            ) {
                getSessionId().then((res) => {
                    config.headers["Session-Id"] = res;
                r(config);
              });
            } else {
              r(config);
            }
        })
    },
    (error) => {
        return Promise.reject(error)
    }
)
http.interceptors.request.use(
    (config) => {
        Responsibility(config);
        return config
    },
    (err) => {
        //请求失败
        console.error('请求失败')
        return Promise.reject(err)
    }
)

// 响应拦截
http.interceptors.response.use(
    (response) => {
        // if (response.headers['content-type'].indexOf('text/html') > -1) {
        //     window.location.replace(settings.base_url)
        // }
        // 返回进入拦截成功
        return Promise.resolve(response.data)
    },
    function(error) {
        // 返回进入拦截失败
        return Promise.reject(error)
    }
)

export default http
