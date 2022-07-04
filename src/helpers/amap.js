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
/**
 * 异步创建script标签
 *
 * @param key
 * @param code 表示高德新申请的key的安全密钥
 */
export function MapLoader(key, code) {
    return new Promise((resolve, reject) => {

        window._AMapSecurityConfig = {
            securityJsCode: null
        }

        // 改变key或者code 会直接初始化
        if(window.AMap?.User.key !== key || window?._AMapSecurityConfig.securityJsCode !== code) {
            if(code) {
                window._AMapSecurityConfig = {
                    securityJsCode: code,
                }
            }
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.id = 'amapKey'
            script.async = true
            script.src = 'https://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key=' + key
            script.onerror = reject
            var amapJs = document.getElementById('amapKey');
            if(amapJs) {
                amapJs.parentNode.removeChild(amapJs);
            }
            document.head.appendChild(script)
            window.initAMap = () => {
                resolve(window.AMap)
            }
        } else if(window.AMap) {
            resolve(window.AMap)
        }
    })

}
