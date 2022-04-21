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
import axios from './axios.config.js'
// import buildURL from 'axios/lib/helpers/buildURL'
import store from '@/store'
// import { config as settings } from './settings.js'

// 请求配置对象
let config = {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Client-Type': 50, // 50  后台
        'Session-Id': '',
    },
}

let request = {}
/**
 *  post 请求
 * @param apiPath 路由
 * @param params 参数
 */
request.post = (apiPath = '', params = {}, requestConfig = {}) => {

    let url = apiPath

    // 处理请求头， 添加Session-Id
    config.headers['Session-Id'] = store.state?.account?.sessionId
    config.headers['Client-Type'] = requestConfig?.clientType || config.headers['Client-Type']

    return new Promise(async (resolve, reject) => {
        axios
            .post(url, params, config)
            .then((result) => {
                resolve(result)
            })
            .catch((res) => {
                reject(res)
            })
    })
}

/**
 *  get 请求
 * @param apiPath 路由
 * @param params 参数
 */
request.get = (apiPath = '', params = {}, requestConfig = {}) => {
    let url = apiPath;
   
    if(process.env.NODE_ENV === 'development'){
        // 路径拼接参数
        // 这里需要去手动拼接url,所以直接使用了axios里面辅助方法的buildURL,
        // buildURL就是实现了url和params的拼接
        // let curl = buildURL(url, params).replace('?', '&')
        // console.log(curl);
        // params = {}
    }

    // 处理请求头， 添加Session-Id
    config.headers['Session-Id'] = store.state?.account?.sessionId
    config.headers['Client-Type'] = requestConfig?.clientType || config.headers['Client-Type']

    return new Promise(async (resolve, reject) => {
        axios
            .get(url, { params, ...config })
            .then((result) => {
                resolve(result)
            })
            .catch((res) => {
                reject(res)
            })
    })
}

export default request
