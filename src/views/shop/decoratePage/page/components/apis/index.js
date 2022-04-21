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
import api from '@/api'
import store from '@/store'
import { diymenu, logout } from '@/store/decorate/allItems'
import * as utils from '@/assets/helpers'
let cache = {};
const pageTypeId = { //自定义页面的类型
    'index': 10, //首页
    'goods-detail': 11, //商品详情
    'vip-center': 12, //会员中心
    'distribution': 20, //分销页面
};
const diyComponent = { //自定义组件的处理
    'diymenu': require('./diymenu.js'), //自定义菜单
}

const menuTypeId = {
    'index': 10,
    'vip-center': 10,
    'custom': 0
}

const hasMenuPage = ['index', 'vip-center']

function getRanGoodsId() {
    if (store.state.setting.randomGoodId) {
        return
    }
    api.goodsApi.getGoodsRanId()
        .then(res => {
            if (res.error === 0) {
                store.commit('setting/setRanGoodId', res.goods_id)
            }
        })
};


const deal_goods = (list) => {
    return list.map(v => {
        if (v.id === 'goods') {
            v.defaultData = []
            v.params = {
                ...v.params
            }
        } else if (v.id === 'tabbar') {
            v.data.forEach(item => {
                item.goods.defaultData = []
                item.goods.params = {
                    ...item.goods.params
                }
            })
        } else if (v.id === 'richtext') {
            let content = v.params?.content;
            if (content) {
                content = utils.delmedia(content);
                content = utils.alterVideo(content);
                v.params.content = content;
            }
        }
        return v
    })
}

const deal_diymenu = (list, hasMenu, diymenuItem1, diymenuItem2) => {
    if (hasMenu) {
        list.forEach(v => {
            if (v.type == 'diymenu') {
                Object.assign(v, diymenuItem1)
            }
        })
    } else {
        list.push(diymenuItem2 || diymenuItem1)
    }
}

const getDiyMenu = (params = {}) => {
    return new Promise((resolve,reject)=> {
        api.decorateApi.getNewMenuContent(params, { nomessage: true }).then(result => {
            resolve(result)
        })
    })
}


export function getPage({
    pageId = '', //页面类型index：商城首页，goods-detail：商品详情,vip-center：会员中心；custom：自定义,distribution:分销
    type = '', //操作类型edit：编辑 ；add:添加
    tplId = '', //模板id
    options, // 更多配置参数
}) {
    cache = {
        pageId,
        type,
        tplId
    };
    if (pageId == 'goods-detail') {
        getRanGoodsId.call(this);
    }
    if (tplId && pageTypeId[pageId] != null) { //编辑或者根据模板创建四个页面
        if (type == 'add') {
            this.loading = true
            this.$api.shopApi.getTempContent({
                id: tplId
            }).then(res => {
                if (res.error === 0) {
                    let { content } = res.data
                    content = Array.isArray(JSON.parse(content)) ? richMedia(JSON.parse(content)) : []

                    let hasMenu = false,hasLogout = false;
                    let pageList = content.map(item => {
                        let id = item.type;
                        let typeid = item.id;

                        if (id === 'goods') {
                            item.defaultData = []
                            item.params = { ...item.params }
                            item.params.goodsdata = '0';//作为模板的商品组默认手动选择
                            item.data.forEach(val=>{
                                val.isFrom='tpl_'+tplId;//用于区分是来自目模板的假商品还是手动添加的商品
                            })
                            item.tpl_data=item.data;//模板商品
                            item.data=[];
                        } else if (item.id === 'tabbar') {
                            item.data.forEach(v => {
                                if(v.goods){
                                    v.goods.defaultData = []
                                    v.goods.params = {
                                        ...v.goods.params
                                    }
                                    v.goods.data.forEach(good => {
                                        good.isFrom='tpl_'+tplId;//用于区分是来自目模板的假商品还是手动添加的商品
                                    })
                                    v.goods.tpl_data=v.goods.data;//模板商品
                                    v.goods.data=[];
                                }
                            })
                        } else if (item.type == 'diymenu') {
                            hasMenu = true
                        }

                        if(pageId == 'vip-center' && item.id =='logout') {
                            item.params.delable = false
                            hasLogout = true
                        }

                        return {
                            ...item,
                            id,
                            typeid
                        }
                    })

                    if (pageId == 'vip-center') {
                        !hasLogout && (pageList.push(logout))
                    }
                    // 处理底部菜单
                    if (hasMenuPage.includes(pageId)) {
                        let type = menuTypeId[pageId]
                        getDiyMenu({type}).then(result => {
                            if (result.error == 0) {
                                if (result.content && JSON.parse(result.content).id) {
                                    deal_diymenu(pageList, hasMenu, JSON.parse(result.content))
                                } else {
                                    deal_diymenu(pageList, hasMenu, JSON.parse(result.content), diymenu)
                                }
                                setPageContent(this, pageList, {
                                    pageId,
                                    ...res.data
                                })
                            } else {
                                if(!hasMenu) {
                                    pageList.push(diymenu)
                                }
                                setPageContent(this, pageList, {
                                    pageId,
                                    ...res.data
                                })
                            }
                        })
                    } else {
                        setPageContent(this, pageList, {
                            pageId,
                            ...res.data
                        })
                    }
                }

            }).finally(() => {
                setTimeout(() => {
                    this.loading = false
                }, 500);
            })
        } else {
            //   页面修改
            this.loading = true
            this.$api.decorateApi.getNewPageDetail({
                id: tplId,
                type: pageTypeId[pageId]
            }).then(res => {
                if (res.error === 0) {
                    let {
                        content
                    } = res.data
                    content = Array.isArray(JSON.parse(content)) ? richMedia(JSON.parse(content)) : []
                    store.commit('decorate/setRecordPageList',[...content])
                    let hasMenu = false;

                    // 处理装修组件列表
                    let pageList = content.map(item => {
                        let id = item.type;
                        let typeid = item.id;
                        if (id === 'goods') {
                            item.defaultData = []
                            item.params = {
                                ...item.params
                            }
                        } else if (id === 'tabbar') {
                            item.data.forEach(v => {
                                v.goods.defaultData = []
                                v.goods.params = {
                                    ...v.goods.params
                                }
                                v.goods.data=v.goods.data?.filter(good=>good.id||good.gid)??[]
                            })
                        } else if (id == "diymenu") {
                            hasMenu = true
                        } 

                        return {
                            ...item,
                            id,
                            typeid
                        }
                    })


                    if (!hasMenuPage.includes(pageId)) {
                        setPageContent(this, pageList, {
                            pageId,
                            ...res.data
                        })
                    } else {
                        let type = menuTypeId[pageId]
                        getDiyMenu({type}).then(result => {
                            if (result.error == 0) {
                                if (result.content && JSON.parse(result.content).id) {
                                    deal_diymenu(pageList, hasMenu, JSON.parse(result.content))
                                } else {
                                    deal_diymenu(pageList, hasMenu, JSON.parse(result.content), diymenu)
                                }

                                setPageContent(this, pageList, {
                                    pageId,
                                    ...res.data
                                })
                            } else {
                                let {
                                    common,
                                    ...info
                                } = res.data;
                                common = common ? JSON.parse(common) : {};
                                setPageContent(this, pageList, {
                                    pageId,
                                    ...info,
                                    common: JSON.stringify(common)
                                })
                            }
                        })
                    }
                }
            }).finally(() => {
                setTimeout(() => {
                    this.loading = false
                }, 500);
            })
        }

    } else if(!tplId && pageTypeId[pageId] == 0) {
        let type = menuTypeId[pageId]
        getDiyMenu({type}).then( async result=> {
            if(result.error == 0) {
                let list = [JSON.parse(result.content)], formItem;
                this.setPageList({
                    list: list,
                    pageId
                })

                this.setPageInfo({ //自动聚焦页面设置
                    pageId,
                    item: this.pageInfo
                })
                if (formItem) {
                    store.commit('decorate/changeFocus', {item: formItem, pageId})
                }
            }
        })
    } else if (diyComponent[pageId]) { //自定义组件处理对象
        diyComponent[pageId].getter.call(this, {
            pageId,
            type, //操作类型edit：编辑 ；add:添加
            tplId, //模板id
        })
    } else {
        this.setPageInfo({ //自动聚焦页面设置
            pageId,
            item: this.pageInfo
        })
    }

}
/**
 * 这里主要是页面的模板处理方法
 * 自定义组件的处理交由专门的自定义组件的处理对象处理
 *
 */
export function setPage(action, previewImage) {
    let {
        pageId = '', //页面类型index：商城首页，goods-detail：商品详情,vip-center：会员中心；custom：自定义
        type = '', //操作类型edit：编辑 ；add:添加
        tplId = '', //模板id
    } = cache;
    if (pageTypeId[pageId] != null) { //四个页面的保存
        let apiName;
        let { name, template_id, ...common } = this.pageInfo
        let pageList = this.pageList;
        if(pageTypeId[pageId]===0) {
            pageList = pageList.filter(item=>item.type!='diymenu')
        }
        common.page_name = name; // 将name复制到common中，用于在移动端表单位置的提交
            let params = {
                type: pageTypeId[pageId],
                id: tplId,
                name,
                thumb: previewImage,
                common: JSON.stringify(common),
                content: JSON.stringify(deal_goods(pageList))
            }

            if(type == 'edit') {
                apiName = 'updateNewPage'
            } else {
                apiName = 'createNewPage'
                params.id = undefined;
                params.template_id = tplId || 0;
            }

            if (action === 'publish') {
                params.status = '1'
            }
            return this.$api.decorateApi[apiName](params)

    } else if (diyComponent[pageId]) { //自定义组件处理对象
        return diyComponent[pageId].setter.call(this, {
            pageId, //页面类型index：商城首页，goods-detail：商品详情,vip-center：会员中心；custom：自定义
            type, //操作类型edit：编辑 ；add:添加
            tplId, //模板id
            action,
            previewImage
        })
    } else {
        return new Promise((resolve, reject) => {
            reject(new Error('无此模板'))
        })
    }
}


const setPageContent = (vm, pageList, {
    pageId,
    common,
    name,
    thumb
}) => {
    common = common ? JSON.parse(common) : {};
    let {
        title,
        keywords,
        background_color,
        desc,
        menu_name,
        menu_id,
        diy_menu,
        params
    } = common
    vm.setPageList({
        list: pageList,
        pageId
    })

    vm.setPageInfo({ //自动聚焦页面设置
        pageId,
        item: {
            name,
            title,
            keywords,
            desc,
            thumb,
            background_color,
            diy_menu,
            params,
            menu_name,
            menu_id,
            id: 'pageInfo',
        }
    })
}


// 富文本装修拼接图片、视频url
const richMedia = (list = []) => {
    return list.map(item => {
        if (item.id === 'richtext') {
            let content = item.params?.content;
            content = utils.richMedia(content);
            content = utils.richMediaVideo(content);
            item.params.content = content;
        }
        return item;
    })
}