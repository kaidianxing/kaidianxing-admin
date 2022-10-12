/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
import router from '@/router';
import * as objTools from '../jsTools/objectTools';
import store from '@/store';
import {getUserInfo} from "@/utils/getUserInfo";
import qs from 'qs'
import * as platformObj from './platform'
let settings = require('@/api/config/settings.js').config

export const isAlonePlat = platformObj.isAlonePlat
export const deepCopy = objTools.deepCopy;
export const deepCompare = objTools.deepCompare;
export const deepMerge = objTools.deepMerge;

export const dealClassifyList = (list, expand = true) => {
    list.forEach(item => {
        item.title = item.name;
        item.value = item.id;
        item.expand = expand;
        if (item.children ?.length > 0) {
            dealClassifyList(item.children);
        }
    });
    return list;
};

let util = {
    SIGN_REGEXP: /([yMdhsm])(\1*)/g,
    DEFAULT_PATTERN: 'yyyy-MM-dd'
};

util.padding = (s, len) => {
    let lens = len - (s + '').length;
    for (let i = 0; i < lens; i++) {
        s = '0' + s;
    }
    return s;
};
export function arrGroup(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}
export const formatDate = (date, pattern) => {
    if (!date) {
        return '';
    }
    if (typeof date != 'object') {
        return date;
    }
    pattern = pattern || util.DEFAULT_PATTERN;
    return pattern.replace(util.SIGN_REGEXP, $0 => {
        switch ($0.charAt(0)) {
            case 'y':
                return util.padding(date.getFullYear(), $0.length);
            case 'M':
                return util.padding(date.getMonth() + 1, $0.length);
            case 'd':
                return util.padding(date.getDate(), $0.length);
            case 'w':
                return date.getDay() + 1;
            case 'h':
                return util.padding(date.getHours(), $0.length);
            case 'm':
                return util.padding(date.getMinutes(), $0.length);
            case 's':
                return util.padding(date.getSeconds(), $0.length);
        }
    });
};

export function hash2Query(path) {
    path=path.replace('#/#/','#/');
    let paths = path.split('#')
    if (paths.length == 1) {
        return path
    }
    if (paths[0].indexOf('?')>0) {
        return path.replace('#', '&_route=')
    } else {
        return path.replace('#', '?_route=')
    }
}
export function samePath(path1, path2) { //path1路由配置项，path2访问的路由
    if (!/[:(]/.test(path1 + path2)) { //非动态路由
        return path1 === path2
    } else if (/[:(]/.test(path2)) { //path2为动态路由规则
        let tmp = path1;
        path1 = path2;
        path2 = tmp;
    }
    path1 = path1.split('/')
    path2 = path2.split('/')
    let tmp1 = '';
    let tmp2 = '';
    let same = false
    if (path1.length == path2.length) {
        for (let i = 0; i < path1.length; i++) {
            tmp1 = path1[i];
            tmp2 = path2[i];
            if (tmp1 == tmp2) {
                same = true;
                continue;
            }
            if (/^:/.test(tmp1)) { // 校验 /path/:pathData/....
                same = true;
                continue;
            } else if (tmp1.indexOf('(') > -1) { // 校验 /path/path(.*)/....
                let start = tmp1.split('(')[0];
                same = tmp2.indexOf(start) == 0;
                if (same) {
                    continue;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        return same
    } else {
        return false
    }
}
/**
 * 提取url中的query以及hash中的query
 *
 * @param {} url
 */
export function getQueryParams(url) {
    if (/^http(?:s)?/.test(url)) {
        let tmp = url.split('#').filter(Boolean);
        let host = /^http(?:s)?:\/\/(?:.*?)\//.exec(url) || '';

        if (host) {
            host = host[0].replace(/\/$/, '');
        }
        let location = {
            hash: tmp[1] ? '#' + tmp[1] : '',
            path: tmp[0],
            href: url,
            host,
            pathname: tmp[0].split('?')[0].replace(host, ''),
            query: {},
            hashQuery: {},
            search: tmp[0].split('?')[1] || ''
        };
        let query = {};
        if (location.search) {
            location.search
                .split('&')
                .filter(Boolean)
                .forEach(item => {
                    let tmp = item.split('=');
                    query[tmp[0]] = tmp[1] || '';
                });
            location.query = query;
        }

        if (tmp.length > 1) {
            let hashQuery = {};
            if (location.hash.indexOf('?') > -1) {
                location.hash
                    .split('?')[1]
                    .split('&')
                    .forEach(item => {
                        let tmp = item.split('=');
                        hashQuery[tmp[0]] = tmp[1] || '';
                    });
            }
            location.hashQuery = hashQuery;
        }
        return location;
    }
    return null;
}

/**
 * 向url中添加query参数
 *
 * @param {*} obj
 */
export function addQueryParams(url, params, pos = 0) {
    if (url) {
        let location = getQueryParams(url);
        if (!location) {
            return '';
        }
        let string = '';
        for (let item in params) {
            string += item + '=' + params[item] + '&';
        }
        string = string.replace(/&$/, '');
        let res = '';
        if (pos === 0) {
            let query = '';
            Object.assign(location.query, params);
            Object.keys(location.query).forEach(key => {
                query = query ? `${query}&${key}=${location.query[key]}` : `${key}=${location.query[key]}`;
            });
            let path = location.path;
            if (path.indexOf('?') > -1) {
                res =
                    location.host +
                    location.pathname +
                    '?' +
                    '&' +
                    query +
                    location.hash;
            } else {
                res = path + '?' + string + location.hash;
            }
        } else {
            if (location.hash.indexOf('?') > -1) {
                res = location.href + '&' + string;
            } else {
                res = location.href + '?' + string;
            }
        }
        return res.replace(/[?&]$/, '');
    }
    return '';
}

/**
 * 获取预览地址
 */
export function getPreviewUrl(type, id, url) {
    url = url || store.state.setting.wap_url;
    if (type === 'goods') { // 商品详情
        url= `${url}/pagesGoods/detail/index?goods_id=${id}`;
    } else if (type === 'couponLink') { // 优惠券
        url=  `${url}/pagesMember/coupon/detail/index?id=${id}`;
    } else if (type === 'page-detail') { // 商品详情
        url=  `${url}/pagesGoods/detail/index?goods_id=${id}`;
    } else if (type === 'page-vip') { // 会员
        url=  `${url}/pagesMember/index/index`;
    } else if (type === 'page-commission') { // 分销
        url=  `${url}/pagesCommission/index/index`;
    } else if (type === 'page-custom') { // 自定义页面
        url=  `${url}/pagesCustom/index/index?pageId=${id}`;
    } else if (type === 'giftCard') { // 礼品卡
        url=  `${url}/pagesGiftCard/convert/detail?${id}`;
    } else if (type === 'creditShop') { // 积分商城
        url= `${url}/pagesCreditShop/detail?id=${id}`
    } else if (type === 'distributor') {//分销商
        url= `${url}?inviter_id=${id}`
    } else if (type === 'quickBuy') {// 快速购买
        url= `${url}/pagesQuickBuy/index?id=${id}`;
    }
    return hash2Query(url)
}

/**
 * 转换图片实际url
 * @author lfg
 * @param urls 单个图片/数组图片/富文本
 * @param type type: video/manage(为系统图片，不属于当前店铺的，不适用店铺独立存储)有值时使用attachment_url
 * @returns {*}
 */
export function media(urls, type) {
    if(!urls) {return ''} 
    if(typeof urls === "object" && urls) {
        if(urls?.path.indexOf('http://') !== -1 || urls?.path.indexOf('https://') !== -1) {
            return urls.path
        }else {
            if ((!type || type === 'video') && store.state.config.shop_attachment_url) {
                if (type === 'video') {
                    return store.state.config.shop_attachment_url + urls.path
                }
                return store.state.config.shop_attachment_url + urls.path + getUrlSuffix();
            }
            return window.config.attachment_url + urls.path
        }
        // return urls.path
    }else {
        if (urls.indexOf('data:image') === 0) {
            //base64
            return urls;
        }
        // if (typeof (urls) === 'object') {
        //     //数组
        //     urls.forEach(src => {
        //         src = tomedia(src);
        //     });
        //     return urls;
        //
        // } else if (urls.indexOf('<img') !== -1) {
        //     //富文本
        //     return urls.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
        //         return match.replace(capture, tomedia(capture));
        //     });
        // }
        return tomedia(urls, type);
    }
}

/**
 * 转换图片实际url
 * @author lfg
 * @param src 单个图片path
 * @returns {*}
 */
export function tomedia(src, type) {
    /*if (src.indexOf('http://') !== -1 || src.indexOf('https://') !== -1) {
        return src;
    }*/
    if (src.indexOf('//') !== -1) { // 适配评价助手抓取回来的地址: //image.suning.cn/uimg/cmf/cust_headpic/0000000000_24_60x60.jpg
        return src;
    }
    if (src.substr(0, 1) === '/') {
        if(src.indexOf(`/static/dist/shop/renren_wap/`)==0){
            return src
        }
        return window.config.public_url + src.slice(1);
    } else {
        if ((!type || type === 'video') && store.state.config.shop_attachment_url) {
            if (type === 'video') {
                return store.state.config.shop_attachment_url + src
            }
            return store.state.config.shop_attachment_url + src + getUrlSuffix();
        }
        return window.config.attachment_url + src;
    }
}

export function setThemeColor(shop_type){
    if(shop_type=='20'){//修改主题色
        window.cssThemeVar={
            '--brand-color': '#5D60F6',
            '--c9e9ff':'#F0F3FF',
            '--tab-hover':'#8a90ff'
        }
        for(let k in  window.cssThemeVar){
            document.documentElement.style.setProperty(k, window.cssThemeVar[k])
        }
    } else {
        window.cssThemeVar={
            '--brand-color': '#2d8cf0',
            '--c9e9ff':'#c9e9ff',
        }
        for(let k in  window.cssThemeVar){
            document.documentElement.style.setProperty(k, window.cssThemeVar[k])
        }
    }
}
/**
 *
 * @param {移动端的图片} url
 */
export function staticImg(url) {
    if (url.indexOf('/') == 0) {
        return url;
    } else if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
        return url;
    }
    return window.config.wap_dist_url + url;
}

// 返回图片的替换图
export function replaceImage(e, type) {
    let path = '';
    switch (type) {
        case 'avatar': // 头像
            path = require('@/assets/image/replace/avatar.png');
            break;
        case 'template': // 模板
            path = require('@/assets/image/replace/check-template.png');
            break;
        case 'page': // 应用中的页面
            path = require('@/assets/image/replace/using-page.png');
            break;
        case 'video': // 视频
            path = require('@/assets/image/replace/video.png');
            break;
        case 'video-cover': // 视频封面
            path = require('@/assets/image/replace/video-cover.png');
            break;
        case 'ad': // 分类广告
            path = require('@/assets/image/replace/check-template.png');
            break;
        case 'merchant-logo': // 店铺logo
            path = require('@/assets/image/replace/merchant_logo_default.png');
            break;
        case 'chain': // 门店logo
            path = require('@/assets/image/replace/chain.png');
            break;
        default:
            // 商品图片
            path = require('@/assets/image/replace/goods.png');
            break;
    }
    e.target.src = path;
}

// 打开新的窗口
export const openNewWindowPage = (url, query) => {
    console.log('url', url, query);
    let routeUrl = router.router.resolve({
        path: url,
        query: query
    });
    window.open(routeUrl.href, '_blank');
};

// 数据超长处理问题
export const formatNumberData = (data) => {
    if (data) {
        if (parseFloat(data) >= 1000000) {
            return `${(parseFloat(data) / 10000).toFixed(2)}万`
        } else {
            return data;
        }
    } else {
        return '0'
    }
}
// 富文本图片url删除工具
export const delmedia = (content) => {
    if (content.indexOf('<img') !== -1) {
        //富文本
        return content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
            return match.replace(capture, frommedia(capture));
        });
    }
    return content
};

export const frommedia = (src) => {
    if (src.indexOf('http://') !== -1 || src.indexOf('https://') !== -1) {
        // 独立存储url
        if (store.state.config.shop_attachment_url) {
            src = src.replace(store.state.config.shop_attachment_url, '');
            let image_compression_rule = store.state.config.shopStorage.image_compression_rule;
            if (image_compression_rule && src.indexOf(image_compression_rule) > -1) {
                src = src.replace(`?${image_compression_rule}`, '');
            }
            return src;
        }
        return src.replace(window.config.attachment_url, '');
    }
    return src;
};
// 富文本视频选择器 url 替换地址 处理
export const alterVideo = (content) => {
    if(content.indexOf('<video') !== -1) {
        return content.replace(/<video [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
            return match.replace(capture,newUrl(match,capture))
        });
    }
    return content
}
export const newUrl = (match,capture) =>{
    /*
    * match 需要处理的video
    * capture 为了保存本地视频地址
    * return url 有效的视频链接
    * */
    let url = capture
    match.replace(/<video [^>]*data-url=['"]([^'"]+)[^>]*>/gi, function(allVideo, dataUrl) {
        if(dataUrl) {
            url =  dataUrl
        }
    })
    // 本地视频去掉域名
    if (store.state.config.shop_attachment_url && url.indexOf(store.state.config.shop_attachment_url) > -1) {
        url = url.replace(store.state.config.shop_attachment_url, '');
    } else if(url.indexOf(window.config.attachment_url) !== -1) {
        url = url.replace(window.config.attachment_url, '')
    }
    return url
}
// 富文本图片url拼接
export const richMedia = (content) => {
    if (content.indexOf('<img') !== -1) {
        //富文本
        return content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
            return match.replace(capture, media(capture));
        });
    }
    return content
};
// 富文本视频url拼接
export const richMediaVideo = (content) => {
    if (content.indexOf('<video') !== -1) {
        //富文本
        return content.replace(/<video [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
            return match.replace(capture, media(capture, 'video'));
        });
    }
    return content
};


export const getImgSize = (url) => {
    return new Promise((resolve) => {
        let img = new Image()
        img.src = url
        img.onload = () => {
            resolve(img)
        }
    })
}


export const getWechatImg = (url) => {
    if (url) {
        if(url.indexOf('http')>-1) {
            let imgUrl = window.config.base_url + '/utility/attachment/index/get-wechat-image' + `?${qs.stringify(getUserInfo())}&url=` + url
            console.log('img-url', imgUrl)
            return imgUrl
        } else {
            return media(url)
        }
    } else {
        return ''
    }
}

export function colorRgb (color,opacity=1) {
    color = color.toLowerCase();
    var pattern = /^#([0-9|a-f]{3}|[0-9|a-f]{6})$/;
    if (color && pattern.test(color)) {
        if (color.length == 4) {
            // 将三位转换为六位
            color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
        }
        //处理六位的颜色值
        var colorNew = [];
        for (var i = 1; i < 7; i += 2) {
            colorNew.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        colorNew.push(opacity)
        return "rgba(" + colorNew.join(",") + ")";
    }
    return color;
}

// 倒计时方法，return days hours minutes seconds
export const countDown = (timePoint, time, stamp = true) => {
    // 当前时间
    let now = parseInt(Date.now() / 1000);
    let leftTime = 0; //
    if (timePoint) {
        leftTime = timePoint > now ? (timePoint - now) : 0; //时间差
        leftTime = parseInt(leftTime);
    }
    if (time) {
        leftTime = parseInt(time);
    }
    if (leftTime == 0) {
        return false;
    } else {
        let day = Math.floor(leftTime / (60 * 60 * 24));
        let hour = Math.floor((leftTime - day * 24 * 60 * 60) / 3600);
        let minute = Math.floor((leftTime - day * 24 * 60 * 60 - hour * 3600) / 60);
        let second = Math.floor(leftTime - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
        let time;
        if (stamp) {
            time = [day, hour < 10 ? '0' + hour : hour, minute < 10 ? '0' + minute : minute, second < 10 ? '0' + second : second];
        } else {
            hour = day * 24 + hour
            time = [hour < 10 ? '0' + hour : hour, minute < 10 ? '0' + minute : minute, second < 10 ? '0' + second : second];
        }
        return time;
    }
};


/**
 * 异步并发数限制
 * 1. new promise 一经创建，立即执行
 * 2. 使用 Promise.resolve().then 可以把任务加到微任务队列，防止立即执行迭代方法
 * 3. 微任务处理过程中，产生的新的微任务，会在同一事件循环内，追加到微任务队列里
 * 4. 使用 race 在某个任务完成时，继续添加任务，保持任务按照最大并发数进行执行
 * 5. 任务完成后，需要从 doingTasks 中移出
 */
export function limit(count, array, iterateFunc) {
    const tasks = []
    const doingTasks = []
    let i = 0
    const enqueue = () => {
      if (i === array.length) {
        return Promise.resolve()
      }
      const task = Promise.resolve().then(() => iterateFunc(array[i++]))
      tasks.push(task)
      const doing = task.then(() => doingTasks.splice(doingTasks.indexOf(doing), 1))
      doingTasks.push(doing)
      const res = doingTasks.length >= count ? Promise.race(doingTasks) : Promise.resolve()
      return res.then(enqueue)
    };
    return enqueue().then(() => Promise.all(tasks))
}
export function toMobileRichText(content){
    let reg = new RegExp(`(?<=<[a-z]+? [^>]*?style=['"])([^'"]+?)['"][^>]*?>`, "g");
    let reg2=/(\d+)(px)/g
    let substring=''
    let str=content.replace(reg,(val,substr)=>{

        substring=substr.replace(reg2,(string)=>{
            return parseInt(string)/2+'px'
        })
        return val.replace(substr,substring)
    })
    return str
}
export function toPCRichText(content){
    let reg = new RegExp(`(?<=<[a-z]+? [^>]*?style=['"])([^'"]+?)['"][^>]*?>`, "g");
    let reg2=/(\d+)(rpx)/g
    let substring=''
    let str=content.replace(reg,(val,substr)=>{
        substring=substr.replace(reg2,(string)=>{
            return parseInt(string)*2+'px'
        })
        return val.replace(substr,substring)
    })
    return str
}
// 获取图片压缩的后缀
function getUrlSuffix() {
    let suffix = '';
    if (store.state.config.shopStorage?.image_compression_rule) {
        suffix = `?${store.state.config.shopStorage?.image_compression_rule}`;
    }
    return suffix;
}

/**
 * 拼接路由及参数
 * @param routes
 * @param params
 * @returns {*}
 */
 export function getUrl(routes, params) {
    let url = routes
    let base_url = settings?.base_url || '';

    /* account 生产兼容 */
    if(isAlonePlat()  && routes.indexOf('account/')>-1) {
        base_url = settings.public_url
    }

    if (params && typeof (params) === 'object') {
        let string = ''
        for (let item in params) {
            string += item + '=' + params[item] + '&'
        }

        url += (((base_url + url).indexOf('?') === -1) ? '?' : '&') + string
    }
    if (/.+\?$/.test(url)) { //？结尾的去掉？
        url = url.slice(0, -1)
    }
    return (base_url || '') + url
}

/**
 * 获取店铺的图片地址,可能使用
 * @param data
 * @param imageKey  从data中获取图片的key
 * @returns {string|*}
 */
export const mediaShop = (data, imageKey = 'path') => {
    let storage = data.storage || {};
    let rule = '';
    // 20是店铺使用独立存储
    if (20 === storage?.storage_model) {
        // 是否开启压缩
        if (storage?.type !== 'local' && 1 === +storage?.[storage.type]?.image_compression &&
            storage?.[storage.type]?.image_compression_rule?.rule) {
            rule = `?${storage?.[storage.type]?.image_compression_rule?.rule}`;
        }
    }
    return data.shop_attachment_url + data[imageKey] + rule;
    // return media(data[imageKey]);
}

export function esToFixed2(value) {
    if (isNaN(value)) {
        return ''
    } else {
        var newValue = value.toString()
        if (newValue.indexOf('.') != -1) {
            var int = newValue.slice(0, newValue.indexOf('.'))
            var float = newValue.slice(newValue.indexOf('.') + 1);
            if (float.length == 1) {
                return int + '.' + float + '0'
            } else if (float.length == 2) {
                return int + '.' + float
            } else if (float > 2) {
                float = float.slice(0, 2)
                return int + '.' + float
            } else {
                return int + '.00'
            }
        } else {
            return value + '.00'
        }
    }
}
// 是否开启分销返积分
export function showCommissionIntegral() {
    return store.state.config?.shop_type==0 && store.state.config?.commissionIntegral == 1
}
// 是否开启过分销返积分
export function hasOpenCommissionIntegral() {
    return store.state.config?.shop_type==0 && store.state.config?.hasOpenCommissionIntegral == 1
}

// 是否微擎版
export const APP_ISW7 = false;
