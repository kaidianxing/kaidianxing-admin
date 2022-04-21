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
import {
    getModal,
    getAllModalName,
    getPageItems,
    searchBrief
} from './decorate/index.js'
import {pageInfo} from './decorate/allItems.js'
import {
    getSystemInfo
} from '../assets/jsTools/environment'
import * as utils from '@/assets/helpers'
import {
    deepMerge,//深度合并
    deepCopy
} from '@/assets/jsTools/objectTools'
import {
    getValidator,
    checkForm
} from './decorate/formChecker'
import html2canvas from 'html2canvas';
const pageTypeId = { //自定义页面的类型
    'index': 10, //首页
    'goods-detail': 11, //商品详情
    'vip-center': 12, //会员中心
    'custom': 0, //自定义页面
    'distribution': 20, //分销页面
};
const posterTypeId = { //自定义海报的类型
    'goodposter': 10,
    'followposter': 30,
    'commissionposter': 20,
};
import * as decorateUtils from './decorate/utils.js'

// 获取可以聚焦的组件
const getItem = (list, index) => {
    if (index == -1) return
    return list[index] || getItem(list, index - 1)
}

let curPageId = '';
export default {
    namespaced: true,
    state: {
        copyModal:null,
        onlyOneComponent: false, //只有一个global组件就默认专门设置页
        bottomItem: [], //置底元素
        fixedItem: [], //悬浮元素
        topItem: [], //置顶元素
        dpr: 1, //设备像素比
        validator: {},
        errorInfo: null,
        pageInfo: pageInfo,
        asPageInfo: {}, //只需要一个的组件，并且不可被删除
        pageList: [], //装修后的模板页面数据
        sortAbleList: [], //可排序的元素列表
        currentModal: {}, //当前操作的模板组件对象信息
        currentModalIndex: 0,
        currentSortableModalIndex: -1, // 当前在可排序中的位置
        curModalBrief: {}, //当前操作的模板组件对象简介、额外信息
        systemSoldOutIcon: utils.staticImg('default/sale-by.png'), //系统设置的售磬图标
        html2canvasing: -1,
        recordPageList:[],
        filteComponentKeyword:''
    },
    mutations: {
        copyModal(state,callback){
            state.copyModal = deepCopy(state.currentModal);
            if(typeof callback=='function'){
                callback(state.copyModal)
            }
        },
        pastModal(state,pageId){
            if(state.copyModal){
                let copy=deepCopy(state.copyModal)
                copy._comIndex_ = `${copy.type}_${state.pageList.length}_${new Date().getTime()}`;
                this.dispatch('decorate/addModal',{
                    pageId,
                    list: copy
                })
            }
        },
        setKeyword(state,keyword){
            state.filteComponentKeyword= keyword;
        },
        setHtml2canvasing(state,status){
            decorateUtils.setHtml2canvasing(state,status)
        },
        setPageInfo(state, {
            pageId,
            item
        }) {
            curPageId = pageId;
            state.pageInfo = deepCopy(deepMerge(state.pageInfo, item));
            this.commit('decorate/changeFocus', {
                pageId,
                item: state.pageInfo
            })
        },
        refreshPageInfo(state, data = {}) {
            state.pageInfo = deepMerge(state.pageInfo, data)
        },
        clear(state) {
            state.fixedItem = []; //悬浮元素
            state.bottomItem = []; //置底元素
            state.topItem = []; //置顶元素
            state.dpr = 1; //设备像素比
            state.asPageInfo={}
            state.pageList = []; //装修后的模板页面数据
            state.sortAbleList = []; //可排序的元素列表
            state.currentModal = {}; //当前操作的模板组件对象信息
            state.currentModalIndex = 0;
            state.currentSortableModalIndex = -1;
            state.curModalBrief = {}; //当前操作的模板组件对象简介、额外信息
            state.systemSoldOutIcon = utils.staticImg('default/sale-by.png'); //系统设置的售磬图标
            state.pageInfo = { //页面信息
                name: '未命名页面',
                title: '自定义页面',
                keywords: '',
                description: '',
                thumb: '',
                background_color: '#f5f5f5',
                diy_menu: '0',
                menu_id: '',
                menu_name: '',
                id: 'pageInfo',
                params: {
                    navbgtype:'color',
                    navbgcolor:'#ffffff',
                    navbgimg:'',
                    titlecolor:'#212121',
                    funbtncolor:'black',
                    linkid: 1,
                    expire_start_time: '',
                    expire_end_time: '',
                    expire_time: 3,
                    access_type: 0,
                    showmenu: '0',
                    shareimg: '',
                    sharetext: ''
                },
                style: {},
                data: [],
            }; //
        },
        getSortableList(state) { //获取可以拖动排序的列表
            state.sortAbleList = state.pageList.filter(item => {
                return !item.istop && !item.isbottom && !item.isfixed
            })
        },
        changeFocus(state, {
            item,
            pageId,
        }) { //更改当前操作的元素
            curPageId = pageId;
            state.validator = getValidator.call(this, item);
            state.currentModalIndex = state.pageList.length;
            state.currentSortableModalIndex = -1;

            if (item.id == 'pageInfo' && (pageTypeId[pageId] !== undefined || posterTypeId[pageId] !== undefined)) { //页面设置的定位;只有几个页面需要定位；自定义菜单diymenu以及启动广告advs是不需要定位pageInfo的
                state.pageInfo = deepMerge(state.pageInfo, item)
                state.currentModal = state.pageInfo;
                state.curModalBrief = {
                    color: item.color || window.cssThemeVar['--decorate-color'],
                    groupName: item.groupName || "基础组件",
                    groupType: item.groupType || "base",
                    icon: item.icon || "iconfont icon-zujian-yemianshezhi",
                    name: item.name || "页面设置",
                    type: item.type || "pageInfo"
                }
            } else if (item.id != 'pageInfo') {
                let tmp = getModal(item.type || item.id); //获取元素数据模板
                if (tmp.asPageInfo) {
                    if (!state.asPageInfo[tmp.id]) {
                        state.asPageInfo[item.type || item.id] = tmp
                    }
                    state.currentModal = state.asPageInfo[item.type || item.id];
                } else {
                    state.currentModal = item;
                    for (let i = 0; i < state.pageList.length; i++) {
                        if (state.pageList[i] == state.currentModal) {
                            state.currentModalIndex = i;
                            break;
                        }
                    }
                    this.commit('decorate/setSortableIndex')
                }
                state.curModalBrief = searchBrief(pageId, item.id);
            }
            decorateUtils.scrollTo(item)
        },
        delModal(state, {
            item,
            pageId
        }) { //删除元素
            curPageId = pageId;
            if (item.isfixed) {
                for (let i = 0; i < state.fixedItem.length; i++) {
                    if (item === state.fixedItem[i]) {
                        state.fixedItem.splice(i, 1);
                        state.fixedItem = [...state.fixedItem];
                        break;
                    }
                }
            }
            if (item.isbottom) {
                for (let i = 0; i < state.bottomItem.length; i++) {
                    if (item === state.bottomItem[i]) {
                        state.bottomItem.splice(i, 1);
                        state.bottomItem = [...state.bottomItem];
                        break;
                    }
                }
            }
            if (item.istop) {
                for (let i = 0; i < state.topItem.length; i++) {
                    if (item === state.topItem[i]) {
                        state.topItem.splice(i, 1);
                        state.topItem = [...state.topItem];
                        break;
                    }
                }
            }
            if (item.asPageInfo) {
                delete state.asPageInfo[item.type || item.id]
            } else {
                for (let i = 0; i < state.pageList.length; i++) {
                    if (item === state.pageList[i]) {
                        state.pageList.splice(i, 1);
                        // 删除组件时防止聚焦 自定义菜单和顶部菜单
                        let newList = state.pageList.filter(v => v.type != 'advs' && v.type != 'diymenu')
                        if (newList.length) { //自动聚焦上一个或下一个
                            this.commit('decorate/changeFocus', {
                                item: getItem(newList, i),
                                pageId
                            })
                        } else {
                            state.currentModal = {};
                            state.curModalBrief = {};
                        }
                        state.pageList = [...state.pageList];
                        break;
                    }
                }
                this.commit('decorate/getSortableList')
                this.commit('decorate/setSortableIndex')
            }
        },
        refreshCurrentModal(state) { //改变当前焦点元素
            for (let i = 0; i < state.pageList.length; i++) {
                if (state.pageList[i] === state.currentModal) {
                    state.pageList[i] = {
                        ...state.pageList[i]
                    };
                    if (state.currentModal.isbottom) {
                        for (let j = 0; j < state.bottomItem.length; j++) {
                            if (state.bottomItem[j] === state.currentModal) {
                                state.bottomItem[j] = state.pageList[i]; //注意要保持这两者的链接
                                break;
                            }
                        }
                    }
                    if (state.currentModal.isfixed) {
                        for (let j = 0; j < state.fixedItem.length; j++) {
                            if (state.fixedItem[j] === state.currentModal) {
                                state.fixedItem[j] = state.pageList[i]; //注意要保持这两者的链接
                                break;
                            }
                        }
                    }
                    if (state.currentModal.istop) {
                        for (let j = 0; j < state.topItem.length; j++) {
                            if (state.topItem[j] === state.currentModal) {
                                state.topItem[j] = state.currentModal; //注意要保持这两者的链接
                                break;
                            }
                        }
                    }
                    state.currentModal = state.pageList[i]
                    break;
                }
            }
            state.pageList = [...state.pageList];
            this.commit('decorate/getSortableList');
        },
        mergeStortableListPageList(state) { //同步拖拽列表与页面列表
            state.pageList = state.topItem.length ? [...state.topItem, ...state.sortAbleList] : [...state.sortAbleList];
            state.pageList = [...state.pageList, ...state.bottomItem, ...state.fixedItem];
        },
        setPageList(state, {
            list,
            pageId
        }) {
            curPageId = pageId;
            state.pageList = [];
            this.dispatch('decorate/addModal', {
                list,
                pageId
            });
            if (pageId == 'index' || pageId == 'goods-detail' || pageId == 'vip-center' || pageId == 'custom' || pageId == 'distribution') {
                this.commit('decorate/changeFocus', {
                    item: state.pageInfo,
                    pageId
                });
            } else if(state.pageList.length){
                this.commit('decorate/changeFocus', {
                    item: state.pageList[0],
                    pageId
                });
            }
        },
        checkError(state, error) {
            state.errorInfo = error;
        },
        // 缓存当前装修请求值
        setRecordPageList(state, pageList) {
            state.recordPageList = pageList;
        },
        // 设置排序sortAbleList值
        setSortAbleList(state, pageList) {
            state.sortAbleList = pageList;
            this.commit('decorate/mergeStortableListPageList')
        },
        // 设置sortable 索引
        setSortableIndex(state) {
            state.currentSortableModalIndex = -1;
            if (!state.currentModal?.istop && !state.currentModal?.isbottom && !state.currentModal?.isfixed) {
                for (let i = 0; i< state.sortAbleList.length; i++) {
                    if (state.sortAbleList[i] == state.currentModal) {
                        state.currentSortableModalIndex = i;
                        break;
                    }
                }
            }
        }
    },
    actions: {
        addModal({
            state,
            commit
        }, {
            pageId,
            list
        }) { //添加元素
            return new Promise((resolve, reject) => {
                try {
                    let items = [];
                    let tmps = []
                    if (Array.isArray(list)) {
                        items = list
                    } else {
                        items = [list]
                    }
                    for (let item of items) {
                        let tmp = null; //获取元素数据模板
                        try{
                            tmp = getModal(item.type || item.id); //获取元素数据模板
                        }catch(e){
                            continue;
                        }
                        if (item.data) {
                            tmp.data = item.data
                        }
                        if (item.items) {
                            tmp.items = item.items
                        }
                        if (!tmp._comIndex_) {
                            tmp._comIndex_ = `${item.type}_${state.pageList.length}_${new Date().getTime()}`;
                        }
                        tmp = deepMerge(tmp, item);
                        tmps.push(tmp);
                        if (!tmp.notemplate && !tmp.asPageInfo) {
                            state.currentModalIndex++;
                        }
                        state.currentModal = tmp;
                        state.curModalBrief = searchBrief(pageId, tmp.id); //模板其他信息
                        if (tmp.asPageInfo) {
                            if (!state.asPageInfo[item.type || item.id]) {
                                state.asPageInfo[item.type || item.id] = tmp
                            }
                        } else if (tmp.isfixed) {
                            state.fixedItem.push(tmp);
                            state.pageList = [...state.pageList, tmp];
                        } else if (tmp.isbottom) {
                            if (state.bottomItem.length > 0) {
                                state.bottomItem = [...state.bottomItem, tmp].sort((a, b) => {
                                    return a.isbottom - b.isbottom
                                })
                            } else {
                                state.bottomItem = [tmp];
                            }
                            state.pageList = [...state.pageList, tmp].sort((a, b) => {
                                return (a.isbottom || 0) - (b.isbottom || 0)
                            });
                        } else {
                            if (tmp.istop) { //置顶元素
                                state.topItem = [...state.topItem, tmp].sort((a, b) => {
                                    return b.istop - a.istop
                                });
                                state.pageList = [tmp, ...state.pageList];
                            } else { //已有置顶元素，新加入的元素非置顶元素
                                state.pageList.splice(state.currentModalIndex, 0, tmp);
                                state.pageList = [...state.pageList];
                            }
                        }
                    }
                    if(items[items.length-1]){
                        state.validator = getValidator.call(this, items[items.length-1]);
                    }
                    commit('getSortableList');
                    commit('setSortableIndex')
                    resolve(tmps);
                } catch (e) {
                    reject(e)
                }
            })
        },
        createPoster(ctx, pageId) {
            curPageId = pageId;
            return new Promise((resolve, reject) => {
                if (ctx.state.errorInfo) {
                    reject('')
                    return
                }
                let id = pageId == 'diymenu' ? "customMenu" : "toCanvas"; //选择截图区域
                let params = {
                    useCORS: true,
                    backgroundColor: null,
                    width: 375,
                    windowHeight: 535,
                    height: pageId == 'diymenu' ? 50 : 535,
                }
                if (pageId == 'diymenu' || pageTypeId[pageId] !== undefined) { //装修模板的缩略图生成；自定义菜单以及5个装修页面需要缩略图；分别再次处理
                    setTimeout(() => {
                        html2canvas(document.getElementById(id), params).then((canvas) => {
                            let img = canvas.toDataURL('image/jpeg', pageId == 'diymenu' ? 1 : 0.3)
                            resolve(img);
                            ctx.commit('setHtml2canvasing', false)
                        }).catch(error => {
                            reject(error);
                        });
                    },100)
                } else if (posterTypeId[pageId] !== undefined) { //海报装修
                    setTimeout(() => {
                        params.windowHeight = 667;
                        params.height = 667
                        params.width=372;//375有黑边，原因不明
                        html2canvas(document.getElementById(id), params).then((canvas) => {
                            let img = canvas.toDataURL('image/jpeg', 1)
                            resolve(img);
                            ctx.commit('setHtml2canvasing', false)
                        }).catch(error => {
                            reject(error);
                        });
                    },100)
                } else {
                    resolve('')
                }
            })
        },
        checkForm(ctx, $route) { //表单校验函数
            let {
                state,
                commit
            } = ctx
            let checkList = []
            let pageId = $route.params.page
            switch (pageId) {
                case 'diymenu': //自定义菜单
                    checkList = state.pageList;
                    break;
                default:
                    checkList = [state.pageInfo, ...state.pageList]
            }
            commit('checkError', null)
            return new Promise((resolve, reject) => {
                checkForm(checkList, $route, ctx).then(res => {
                    resolve(res);
                }).catch(res => {
                    console
                    .log(res)
                    let item = null;
                    if (res.errorMessage) {
                        item = res.item;
                        reject(res.errorMessage);
                    } else if (res.id) {
                        item = res;
                        reject(item)
                    }
                    if (item) {
                        commit('checkError', item); //保存错误信息源
                        decorateUtils.scrollTo(item); //滚动到错误源
                        commit('changeFocus', {
                            pageId: curPageId,
                            item: item
                        }); //聚焦到错误源
                    }
                });
            })
        }
    },
    getters: {
        getPageBottomHeight() { //页面底部高度
            return 0
        },
        getpageTopheight() { //页面顶部高度
            return 0
        },
        getDpr(state) {
            if (!state.dpr) {
                state.dpr = getSystemInfo().pixelRatio
            }
            return state.dpr
        },
        getModal() {
            return name => {
                return getModal(name)
            }
        },
        getAllModalName() {
            return () => {
                return getAllModalName()
            }
        },
        getPageItems(state) {
            return (id = 'index') => {
                let res = getPageItems(id);
                state.onlyOneComponent = false;
                if (!res.common && !res.base && !res.market) {
                    if (res.global && res.global.length == 1) {
                        state.onlyOneComponent = true;
                    }
                }
                return res
            }
        },
    }
};
