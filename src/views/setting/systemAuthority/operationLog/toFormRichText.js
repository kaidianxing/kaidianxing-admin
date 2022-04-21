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
let observableDiff = require('deep-diff/dist/deep-diff.min').observableDiff;
let Diff = require('diff/dist/diff.min');
import {deepCompare} from '@/assets/jsTools/objectTools'

function judgeType(change) {
    if (arguments.length == 0) {
        return ''; //无参数传入
    }
    if (change === null) {
        return 'null'
    }
    if (change === undefined && arguments.length > 0) {
        return 'undefined'
    }
    if (change instanceof Function) {
        return 'function'
    }
    if (Object.prototype.toString.call(change) == "[object Object]") {
        return 'object'
    }
    if (change instanceof Array) {
        return 'arry'
    }
    if (change instanceof Number || typeof change == 'number') {
        return 'number'
    }
    if (change instanceof String || typeof change == 'string') {
        return 'string'
    }
    if (change instanceof Boolean || typeof change == 'boolean') {
        return 'boolean'
    }
}
/***
 * isSamePath 比较是否有删除项
 * */
function isSamePath(diff, path) {
    let D = diff['D'] || [];
    let tmp = null;
    for (let i = 0; i < D.length; i++) {
        tmp = D[i].path; //
        if (deepCompare(tmp, path)) {
            return true
        }
    }
    return false;
}

function turnArrToTable(arr) {
    let thead = null;
    let tr = arr.map(item => {
        let td = [];
        let th = [];
        for (let k in item) {
            if (!thead) {
                th.push(`<th>${k}</th>`)
            }
            td.push(`<td>${item[k]}</td>`)
        }
        if (!thead) {
            thead = `<tr>${th.join('')}</tr>`;
        }
        return `<tr>${td.join('')}</tr>`
    });
    let table = `<table><thead>${thead}</thead><tbody>${tr.join('')}</tbody></table>`;
    return table;
}

function getCompareValue(tree, path) {
    let res = tree;
    for (let val of path) {
        res = res ? res[val] : '';
    }
    return res;
}

export function toForm(obj, compare) {
    let diff = null;
    if (compare) {
        diff = delRow(obj, compare);
    }

    function getRichText(obj, path = [], tree = 1) {
        let str = '';
        if (judgeType(obj) == 'object') {
            for (let k in obj) {
                let nextPath = [...path, k];
                if (judgeType(obj[k]) == 'object' || (judgeType(obj[k]) == 'arry' && judgeType(obj[k][0])=='object')) { //
                    str += `<div class='form-${tree} ${isSamePath(diff, nextPath) ? "delRow" : ""}'>
                        <p class='form-title form-title-${tree}'>${k}</p>
                        <div class='form-body form-body-${tree}'>${getRichText(obj[k], nextPath, tree + 1)}</div>
                    </div>`
                } else {
                    str += `<div class='form-${tree} ${isSamePath(diff, nextPath) ? "delRow flex" : "flex"}'>
                        <p class=' form-label form-label-${tree}'>${k}：</p>
                        <div class='form-value form-value-${tree}'>${getRichText(obj[k], nextPath, tree + 1)}</div>
                    </div>`
                }
            }
        } else if (judgeType(obj) == 'arry') {
            // for (let i = 0; i < obj.length; i++) {
            //     toForm(obj[i])
            // }
            if(judgeType(obj[0]) !== 'object') {
                return getRichText(obj.join('、'))
            } else {
                return turnArrToTable(obj)
            }
            
        } else {
            let tmp = getCompareValue(compare, path);
            return editStr(obj, tmp)
        }
        return str
    }
    return getRichText(obj)
}


export function delRow(obj1, obj2) {
    let diff = {};
    observableDiff(obj1, obj2, function (d) {
        diff[d.kind] = diff[d.kind] || [];
        diff[d.kind].push(d)
    });
    return diff;
}

export function editStr(str1, str2) {
    if (str1 && str2) {
        let str = '';
        const diff = Diff.diffChars(str1 + '', str2 + '');
        diff.forEach((part) => {
            switch (part.added ? 'add' : part.removed ? 'del' : 'same') {
                case 'del':
                    str += `<span class='del'>${part.value}</span>`
                    break;
                case 'same':
                    str += `<span class='same'>${part.value}</span>`
                    break;
            }
        });
        return str
    }
    return str1
}