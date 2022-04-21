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

export function formatData(originalVal, originalData) {
    let cache = [];
    function format(data) {
        data.forEach(item => {
            if (new Set(originalVal).has(item.value)) {
                if (item.children && item.children.length) {
                    let _cache = item.children.map(v => v.value)
                    let _flag = _cache.some(v => originalVal.indexOf(v) >= 0)
                    if (!_flag) {
                        cache.push(item.value)
                    }
                    format(item.children)
                } else {
                    // 没有子集直接添加
                    cache.push(item.value)
                }
            } else {
                if (item.children && item.children.length) {
                    format(item.children)
                }
            }
        });
    }
    format(originalData);
    return cache
}