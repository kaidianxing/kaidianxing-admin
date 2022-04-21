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
import store from '../../store'
import api from '../index'
/**
 * 专门用于处理sessionId的请求与处理
 */
let throttle
const getSessionId = () => {
    let sessionId = localStorage.getItem('sessionId')
     //  过滤存储undefined
     if(sessionId=='undefined') {
        sessionId = ''
    }
    //所属店铺数据不存在就重新请求
    if (!sessionId) {
        // 判断是否正在请求sessionId,''或undefined是没有正在请求
        if (throttle) return throttle;
        throttle = new Promise((resolve, reject) => {
            api.aloneApi.getSessionId().then(res => {
                // 请求sessionId完毕
                if (res.error === 0) {
                    store.commit('account/setSessionId', res.session_id)
                    resolve(res.session_id);
                    throttle = null
                } else {
                    reject('获取sessionId失败')
                }
            }).catch((err) => {
                reject('获取sessionId失败',err);
            })
        })
        return throttle

    } else {
        return Promise.resolve(sessionId)
    }
}

export default getSessionId
