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
 * 异步创建script标签
 *
 * @param key
 */
export function MapLoader(key) {
    return new Promise((resolve, reject) => {
        if (window.AMap) {
            resolve(window.AMap)
        } else {
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.async = true
            script.src = 'https://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key=' + key
            script.onerror = reject
            document.head.appendChild(script)
        }
        window.initAMap = () => {
            resolve(window.AMap)
        }
    })

    // const mp = new Promise((resolve, reject) => {
    //     let hasLoaded1 = document.getElementById('amap')
    //     if (hasLoaded1) {
    //         // 只加载一次
    //         return
    //     }
    //     let script = document.createElement('script')
    //     script.type = 'text/javascript'
    //     script.src =
    //         'https://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key=' + key
    //     script.id = 'amap'
    //     script.onerror = reject
    //     document.head.appendChild(script)
    //     window.initAMap = function() {
    //         resolve(window.AMap)
    //     }
    // })
    // const mpUI = new Promise((resolve, reject) => {
    //     let hasLoaded2 = document.getElementById('amapUI')
    //     if (hasLoaded2) {
    //         // 只加载一次
    //         return
    //     }
    //     let script2 = document.createElement('script')
    //     script2.type = 'text/javascript'
    //     script2.src = '//webapi.amap.com/ui/1.1/main-async.js'
    //     script2.id = 'amapUI'
    //     script2.onerror = reject
    //     script2.onload = function() {
    //         resolve('success')
    //     }
    //     document.head.appendChild(script2)
    // })
    // return Promise.all([mp, mpUI])
    //     .then((result) => {
    //         return result[0]
    //     })
    //     .catch((e) => {
    //         console.log(e)
    //     })
}
