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
 * 
 * 文件上传
 * 
 * */

import axios from 'axios'
import settings from './settings'
import store from '@/store'
import Responsibility from "./filter/api.filter";

// 请求配置对象
let config = {
    headers: {
        'Content-Type': 'multipart/form-data',
        'Client-Type': 50, //  50  后台
        'Session-Id': '',
    },
}

let base_url = settings.config.base_url

// 解决跨域使用
if (process.env.NODE_ENV === 'development') {
    base_url = '/manageApi'
}

let instance = axios.create({
    baseURL: base_url,
    headers: {
        'Client-Type': 50, // 50  后台
        'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
})
/* 接口请求处理一下生产环境问题 */
instance.interceptors.request.use(
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

const uploadFile = (path = '', params = {}) => {
    path = `${path}`
    // 处理请求头， 添加session-id  shop-id
    config.headers['Session-Id'] =store.state?.account?.sessionId

    return new Promise((resolve, reject) => {
        instance
            .post(path, params, config)
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

export { uploadFile }
