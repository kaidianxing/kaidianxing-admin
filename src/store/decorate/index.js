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
/* eslint-disable */
/*************工具函数******************* */
import {
    deepCopy, //深度拷贝
    deepMerge, //深度合并
    deepCompare, //深度比较
    shallowCompare, //浅比较
} from '../../assets/jsTools/objectTools'
import store from '@/store'
/**
 * 页面的装修组件配搭
 */
let paths = require.context('./pages/', false, /\/.*\.js$/); //获取当前全部路由
let pageItems = {}; //各个页面的装修组件配置
paths.keys().forEach(item => { //获取本级目录下的全部配置参数
    let name = item.replace(/.+\/(\w+).js/, '$1');
    pageItems[name] = paths(item).default;
});
/**
 * 全部组件数据模板
 */
import * as modal from './allItems'
/**
 * 获取模板数据
 * @param {模板id} modalName
 */
export function getModal(modalName) {
    let modalTmp = modal[modalName];
    if (modalTmp) {
        modalTmp.id = modalName;
        return deepCopy(modalTmp)
    }
    throw new Error('无此模板')
}
let cache = null;
/**
 * 全部模板id
 */
export function getAllModalName() {
    if (!cache) {
        cache = []
        for (let k in modal) {
            cache.push(k)
        }
    }
    return cache
}

/**
 * 分组信息
 * yIndex控制展示的顺序；越大越在下
 *
 * @param {} id
 */
export function groupInfo(id) {
    switch (id) {
        case 'global':
            return {
                groupName: '全局组件',
                groupType: 'global',
                yIndex: 5,
                color: window.cssThemeVar['--decorate-color'], //
            };
        case 'base':
            return {
                groupName: '基础组件',
                yIndex: 2,
                groupType: 'base',
                color:  window.cssThemeVar['--decorate-color'], //
            }
        case 'market':
            return {
                groupName: '营销组件',
                yIndex: 4,
                groupType: 'market',
                color:  window.cssThemeVar['--decorate-color'], //
            }
        case 'vipCenter':
            return {
                groupName: '会员中心组件',
                groupType: 'vipCenter',
                yIndex: 1,
                color: '#FF9900', //
            }
        case 'distribution':
            return {
                groupName: '分销组件',
                yIndex: 1,
                groupType: 'distribution',
                color: '#FF9900', //
            }
        case 'goodsDetail':
            return {
                groupName: '商品详情组件',
                yIndex: 1,
                groupType: 'goodsDetail',
                color: '#FF9900', //
            }
        case 'other':
            return {
                groupName: '功能组件',
                yIndex: 6,
                groupType: 'other',
                color:  window.cssThemeVar['--decorate-color'], //
            }
    }
}
/**
 * 组件对应的svg
 * @param {*} id
 */
function componentIcon(id) {
    switch (id) {
        case 'topmenu':
            return {
                svg: 'dingbudaohang', name: '顶部菜单'
            }
        case 'search':
            return {
                svg: 'sousuo1',
                name: '搜索框'
            }
        case 'banner':
            return {
                svg:'tupianlunbo', name: '图片轮播'
            }
        case 'menu':
            return {
                svg: 'anniuzu',
                name: '按钮组'
            }
        case 'menu2':
            return {
                icon: 'iconfont icon-anniuzu2', name: '按钮组2'
            }
        case 'title':
            return {
                icon: 'iconfont icon-biaotilan', name: '标题栏'
            }
        case 'listmenu':
            return {
                icon: 'iconfont icon-liebiaodaohang', name: '列表导航'
            }
        case 'goods':
            return {
                icon: 'iconfont icon-shangpinzu', name: '商品组',
            }
        case 'credit':
            return {
                icon: 'iconfont icon-zujian-jifenxinxi', name: '积分信息',
            }
        case 'tabbar':
            return {
                svg: 'xuanxiangka', name: '标签页'
            }
        case 'blank':
            return {
                svg: 'fuzhukongbai', name: '辅助空白'
            }
        case 'line':
            return {
                icon: 'iconfont icon-fuzhuxian', name: '辅助线'
            }
        case 'fixedsearch':
            return {
                icon: 'iconfont icon-gudingsousuo2', name: '固定搜索框'
            }
        case 'notice':
            return {
                icon: 'iconfont icon-gonggao', name: '公告'
            }
        case 'icongroup':
            return {
                icon: 'iconfont icon-tubiaozu', name: '图标组'
            } ////
        case 'pictures':
            return {
                svg: 'tupianzhanbo',
                name: '图片展播'
            }
        case 'richtext':
            return {
                svg: 'fuwenben', name: '富文本'
            }
        case 'video':
            return {
                svg: 'shipinzu', name: '视频组'
            }
        case 'picture':
            return {
                svg: 'dantuzu', name: '单图组'

            }
        case 'coupon':
            return {
                icon: 'iconfont icon-youhuiquan-zx-copy', name: '优惠券'
            }
        case 'detail_info':
            return {
                icon: 'iconfont icon-xiangqing-shangpinxinxi', name: '商品信息'
            }
        case 'detail_swipe':
            return {
                svg: 'xiangqing-shangpintupian', name: '商品图'
            }
        case 'detail_comment':
            return {
                icon: 'iconfont icon-xiangqing-pingjia', name: '商品评价'
            }
        case 'detail_spec':
            return {
                svg: 'xiangqing-shangpinguige', name: '商品规格'
            }
        case 'detail_navbar':
            return {
                svg: 'xiangqing-dibudaohang1', name: '底部导航'
            }
        case 'detail_pullup':
            return {
                svg: 'xiangqing-shangpinxiangqing', name: '商品详情'
            }
        case 'detail_sale':
            return {
                icon: 'iconfont icon-xiangqing-yingxiaoxinxi', name: '营销信息'
            }
        case 'logout':
            return {
                icon: 'iconfont icon-huiyuan-tuichudenglu1', name: '退出登录'
            }
        case 'commission_sharecode':
            return {
                icon: 'iconfont icon-fenxiao-erweima', name: '分享二维码'
            }
        case 'distributor':
            return {
                icon: 'iconfont icon-huiyuan-huiyuanxinxi', name: '分销商信息'
            } ////
        case 'blockgroup':
            return {
                svg: 'fenxiao-fenxiaoshuju', name: '分销数据'
            }
        case 'member':
            return {
                icon: 'iconfont icon-huiyuan-huiyuanxinxi', name: '会员信息'
            }
        case 'bindmobile':
            return {
                icon: 'iconfont icon-huiyuan-bangdingshouji', name: '绑定手机'
            }
        case 'diymenu':
            return {
                svg: 'bottom-menu',
                name: '底部菜单',
            }
        case 'gotop':
            return {
                name: '返回顶部'
            }
        case 'followbar':
            return {
                name: '关注条'
            }
        case 'liver': {
            return {
                name: '小程序直播',
                svg:  'liver'
            }
        }
        case 'seckill': {
            return {
                name: '秒杀',
                svg: 'seckill'
            }
        }
        case 'hot_area': {
            return {
                name: '热区',
                svg:  'hot_area'
            }
        }
        case 'customer': {
            return {
                name: '客服',
                svg: 'customer'
            }
        }
        case 'poster_bgimg':
            return {
                svg:'tupianzhanbo', name: '背景图片'
            }
        case 'poster_img':
            return {
                svg: 'tupianzhanbo', name: '图片'
            }
        case 'poster_goodimg':
            return {
                icon: 'iconfont icon-shangpinzu', name: '商品图片'
            }
        case 'poster_shoplogo':
            return {
                name: '店铺LOGO'
            }
        case 'poster_qrcode':
            return {
                svg:'erweima', name: '二维码'
            }
        case 'poster_avatar':
            return {
                name: '头像'
            }
        case 'poster_nickname':
            return {
                name: '昵称'
            }
        case 'poster_goodname':
            return {
                svg: 'fuwenben',
                name: '商品名称'
            }
        case 'poster_delprice':
            return {
                svg: 'haibao-yuanjia',
                name: '商品划线价'
            }
        case 'poster_sellprice':
            return {
                svg:'haibao-xianjia',
                name: '商品售卖价'
            }
        case 'poster_price':
            return {
                svg:'haibao-huiyuanjia',
                name: '商品会员价'
            }
        case 'poster_text':
            return {
                name: '文本'
            }
        case 'poster_exptime':
            return {
                name: '失效时间'
            }
        case 'poster_reward':
            return {
                name: '奖励设置'
            }
        case 'cube':
            return {
                name: '魔方',
                svg:  'cube'
            }
    }

}
/**
 * 用于遍历页面装修组件搭配树；
 * 将分组信息合并进去，主要用来设置控制面板的图标以及颜色等
 * @param {} tree
 */
function forTree(tree) {
    let tmp = [];
    for (let k in tree) {
        tmp = tree[k];
        for (let i = 0; i < tmp.length; i++) {
            let group = groupInfo(k);
            let info = componentIcon(tmp[i].type);
            tmp[i] = {
                ...tmp[i],
                ...group,
                ...info
            };
        }
    }
    return tree
}
const cacheTree = {};
/**
 * 获取不同页面的装修控制面板信息
 * @param {*} page
 */
export function getPageItems(page = '') {
    if (typeof page == 'string') {
        let id = page.split('-').map((item, index) => {
            if (index > 0) {
                return item.slice(0, 1).toUpperCase() + item.slice(1);
            }
            return item
        }).join('');
        cacheTree[id] = cacheTree[id] || forTree(pageItems[id]);
        return deepCopy(cacheTree[id])
    }
    return {}
}
/**
 * 反向查询模板的对应控制面板信息
 *
 * @param {模板id} type
 */
export function searchBrief(page, type) {
    let tree = getPageItems(page)

    let tmp = [];
    for (let k in tree) {
        tmp = tree[k];
        for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].type == type) {
                let group = groupInfo(k);
                let info = componentIcon(type);
                return {
                    ...tmp[i],
                    ...group,
                    ...info
                }
            }

        }
    }
}
