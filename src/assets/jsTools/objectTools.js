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
import { formatDate } from '@/assets/helpers'
/**
 * 比较两个对象是否key：val相等
 */
export const shallowCompare = (obj1, obj2) => {
    var propsCurr = Object.getOwnPropertyNames(obj1)
    // 要比较的另外一个Object对象
    var propsCompare = Object.getOwnPropertyNames(obj2)
    if (propsCurr.length != propsCompare.length) {
        return false
    }
    for (var i = 0, max = propsCurr.length; i < max; i++) {
        var propName = propsCurr[i]
        if (obj1[propName] !== obj2[propName]) {
            return false
        }
    }
    return true
}
/**
 * 判断此对象是否是Object类型
 * @param {Object} obj 
 */
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * 判断此类型是否是Array类型
 * @param {Array} arr 
 */
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}
/**
 * 深度比较两个对象是否相同
 * @param {Object} oldData 
 * @param {Object} newData 
 */
export function deepCompare(oldData, newData) {
    // 类型为基本类型时,如果相同,则返回true
    if (oldData === newData) return true;
    if (isObject(oldData) && isObject(newData) && Object.keys(oldData).length === Object.keys(newData).length) {
        // 类型为对象并且元素个数相同
        // 遍历所有对象中所有属性,判断元素是否相同
        for (const key in oldData) {
            if (oldData.hasOwnProperty(key)) {
                if (!deepCompare(oldData[key], newData[key]))
                    // 对象中具有不相同属性 返回false
                    return false;
            }
        }
    } else if (isArray(oldData) && isArray(oldData) && oldData.length === newData.length) {
        // 类型为数组并且数组长度相同
        for (let i = 0, length = oldData.length; i < length; i++) {
            if (!deepCompare(oldData[i], newData[i]))
                // 如果数组元素中具有不相同元素,返回false
                return false;
        }
    } else {
        // 其它类型,均返回false
        return false;
    }
    // 走到这里,说明数组或者对象中所有元素都相同,返回true
    return true;
}

export function deepCopy(obj1, obj2) { //深拷贝
    if (typeof obj1 != 'object') {
        return obj1;
    }
    //深拷贝
    if (obj2 === undefined) {
        if (Array.isArray(obj1)) {
            obj2 = []
        } else {
            obj2 = {}
        }
    }
    for (let i in obj1) {
        if (obj1.hasOwnProperty(i)) {
            if (Array.isArray(obj1[i])) {
                obj2[i] = [];
                deepCopy(obj1[i], obj2[i]);
            } else if (typeof obj1[i] === "function") {
                obj2[i] = obj1[i];
            } else if (obj1[i] instanceof Object) {
                obj2[i] = {};
                deepCopy(obj1[i], obj2[i]);
            } else {
                obj2[i] = obj1[i];
            }
        }
    }
    return obj2;
}

/**
 * 如果target(也就是FirstOBJ[key])存在，
 * 且是对象的话再去调用deepObjectMerge，
 * 否则就是FirstOBJ[key]里面没这个对象，需要与SecondOBJ[key]合并
 */
export function deepMerge(FirstOBJ, SecondOBJ) { // 深度合并对象
    if (FirstOBJ === SecondOBJ) {
        return FirstOBJ
    }
    if (typeof SecondOBJ != 'object' ||SecondOBJ === null || typeof FirstOBJ != 'object') {
        return FirstOBJ
    }
    for (var key in SecondOBJ) {
        FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
            deepMerge(FirstOBJ[key], SecondOBJ[key]) : (FirstOBJ[key] = SecondOBJ[key]);
    }
    return FirstOBJ;
}

/**
 * 遍历数据，将空数组串换成空字符串
 * 将空字符串转换成’0‘
 */
export function exchangeArrayToString(data) {
    // 深拷贝一层
    let obj = Object.assign({}, data)
    forExchangeArrayToString(obj)
    return obj
}

function forExchangeArrayToString(obj) {
    // 需要进行重置为’0‘的字段
    let keys =
            'original_price,cost_price,sort_by,sales,single_full_unit,single_full_quota,deduction_credit,deduction_balance,weight',
        limitKeys =
            'browse_level_perm,browse_tag_perm,buy_level_perm,buy_tag_perm'; // 当为‘0’时情况ids
    if (obj.ext_field) {
        obj.ext_field.putaway_time = formatDate(
            obj.putaway_time,
            'yyyy-MM-dd hh:mm:ss'
        )
    }
    // 自动上货时，status = 2
    if (obj.status == '2') {
        obj.ext_field.auto_putaway = '1'
        obj.status = '0'
    }
    // 当商品为多规格时，库存和价格/重量必填，默认为0
    if (obj.has_option == '1') {
        obj.price = '0';
        obj.stock = '0';
        obj.weight = '0';
    }

    // 参数处理
    if (obj.params_switch == '0') {
        obj.params = '';
    }
    for (let o in obj) {
        // 配置默认值为0
        if (keys.indexOf(o) > -1 && obj[o] === '') {
            obj[o] = '0'
        }
        // 进行权限部分处理，将状态为‘0’清空所选值
        if (limitKeys.indexOf(o) > -1 && obj[o] == '0') {
            obj[`${o}_ids`] = ''
        }
        if (obj[o] instanceof Array && obj[o].length === 0) {
            obj[o] = ''
        }
        if (obj[o] instanceof Object) {
            forExchangeArrayToString(obj[o])
        }
    }
}
