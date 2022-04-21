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
import { shallowCompare, deepCopy, deepCompare } from '../../assets/jsTools/objectTools.js'
import { trackError, specsError } from '@/store/goodAddEdit/jsTools/formDataChecker.js'
import {model} from './jsTools/goodModelData'
import store from '@/store'

/**
 * 专门用于处理会员折扣的类
 */
import cacheDiscount from './jsTools/vipDiscount.js'
import obj from "./jsTools/vipDiscount";
let combinations = (groups) => {
    let allcombs = []
    let combine = (index, tmp = []) => {
        if (index < groups.length) {
            groups[index].forEach((item) => {
                combine(index + 1, [...tmp, item])
            })
        } else {
            allcombs.push(tmp)
        }
    }
    combine(0)
    return allcombs
}
let cachePos = {}
let _cachePos = {} // 缓存 缓存pos
let cacheObj = {}
let initSpecId = 'spec' + new Date().getTime()
let initChildSpec = 'childSpec' + new Date().getTime()
let cacheInput = {}
let _position = {} //存options的key
let forCompareColumns = [], forCompareOptions = [];
function getCacheQuick(_pos, type) {
    //根据_pos查询cacheInput中缓存的值
    if (!shallowCompare(cachePos, _pos)) {
        // 两个对象值比较,相同说明本次操作的目标对象与上一次相同，避免频繁的遍历查找
        _cachePos = cachePos
        cachePos = _pos
        cacheObj = checkCache(_pos, type)
    }
    return cacheObj
}
let checkCache = (_pos, type) => {
    let k = ''
    let thumb = ''
    let tmp = cacheInput
    for (let i = 0; i < _position.length; i++) {
        k = _position[i]
        thumb = tmp[_cachePos[k]]?.thumb || ''
        if (!tmp[_pos[k]]) {
            if (type === 'formatThumb') {
                tmp[_pos[k]] = {
                    thumb
                }
            } else {
                tmp[_pos[k]] = {}
            }
        }
        tmp = tmp[_pos[k]]
    }
    return tmp
}
export default {
    namespaced: true,
    state: {
        vipLevels: [
            {
                // level_name: "等级名字",
                // level_id: 0
            },
        ],
        getCache: {},
        cacheRowSpan: { 0: 1, 1: 1, 2: 1 },//合并单元格的缓存参数
        groups: [],
        rowSpan: [],
        // 批量设置
        columns: [
            {
                title: '',
                key: '',
                render: (h, params) => {
                    return <span>{params.row.childSpecVal[0]}</span>
                },
            },
        ],
        specs: [
            {
                id: initSpecId,
                title: '',
                items: [
                    {
                        id: initChildSpec,
                        title: '',
                    },
                ],
            },
        ],
        levelDiscount: [], //指定会员等级折扣
        multiDiscount: [], //多规格会员等级折扣
        options: [
            {
                childSpecVal: [''],
                _pos: { [initSpecId]: initChildSpec },
                thumb: '',
                price: '',
                original_price: '',
                cost_price: '',
                stock: '',
                goods_sku: '',
                bar_code: '',
                weight: '',
                virtual_account_id: '',//虚拟卡密-卡密库ID
            },
        ],
        cacheFormError: null,
        cacheSpecsError: null,
    },
    mutations: {
        init(state) {
            //退出页面的时候初始化
            initSpecId = 'spec' + new Date().getTime()
            initChildSpec = 'childSpec' + new Date().getTime()
            cacheInput = {}
            _position = {} //存options的key
            state.getCache = {}
            state.cacheRowSpan = { 0: 1, 1: 1, 2: 1 }
            state.groups = []
            state.rowSpan = []
            // 批量设置
            state.columns = [
                {
                    title: '',
                    key: '',
                    render: (h, params) => {
                        return <span>{params.row.childSpecVal[0]}</span>
                    },
                },
            ]
            state.specs = [
                {
                    id: initSpecId,
                    title: '',
                    image_checked: '0',
                    items: [
                        {
                            id: initChildSpec,
                            title: '',
                        },
                    ],
                },
            ]
            state.options = [
                {
                    childSpecVal: [''],
                    _pos: { [initSpecId]: initChildSpec },
                    thumb: '',
                    price: '',
                    original_price: '',
                    cost_price: '',
                    stock: '',
                    goods_sku: '',
                    bar_code: '',
                    weight: '',
                    virtual_account_id: '',//虚拟卡密-卡密库ID
                },
            ]

            state.specAutoTimeData =  {
                [initChildSpec]: {
                    start_time: '',
                    end_time: '',
                    time: [],
                    time_span: '',
                    checkAll: true,
                    span_detail: [],
                    span_detail_all: [],
                }
            };
            state.cacheTimeData = {
                start_time: '',
                end_time: '',
                time: [],
                time_span: '',
                checkAll: true,
                span_detail: [],
                span_detail_all: [],
            };
            state.specCustomTimeData = {
                [initChildSpec]: [
                    {
                        _id: 'timeSpec' + new Date().getTime(),
                        time: []
                    }
                ],
            };
            state.customDisableDate = {
                [initChildSpec]: {
                    disabledHours: [], // 禁选时间
                    disabledMin: [] // 禁选分钟
                }
            };
            state.cacheDisableDate = {
                disabledHours: [], // 禁选时间
                disabledMin: [] // 禁选分钟
            };
            state.cacheCustomData = [
                {
                    _id: 'time' + new Date().getTime(),
                    time: []
                }
            ];
        },
        setLevelDiscount(state, list) {
            state.levelDiscount = list
        },
        setMultiDiscount(state, list) {
            state.multiDiscount = list
        },
        refreshDiscount(state) {
            state.levelDiscount = [...state.levelDiscount]
            state.multiDiscount = [...state.multiDiscount]
        },
        cacheInput(
            state,
            {
                //缓存输入值，根据坐标对象_pos查找state.options中的对应的项({...})，然后设置其[key]=value
                _pos, //{spec1522665665:childSpec1525496565656}
                key,
                value,
            }
        ) {
            checkCache(_pos)[key] = value
        },
        getCache(state, _pos) {
            //根据_pos查询cacheInput中缓存的值
            state.getCache = getCacheQuick(_pos)
            return state.getCache
        },
        cacheRowSpan(state) {//用来缓存表格合并单元格的相关参数
            let arr = state.groups
            const calRowSpan = (columnIndex) => {
                let rowspan = 1
                for (let i = arr.length - 1; i > columnIndex; i--) {
                    rowspan = rowspan * arr[i].length
                }
                state.cacheRowSpan = {
                    ...state.cacheRowSpan,
                    [columnIndex]: rowspan,
                }
            }
            for (let i = 0; i < state.groups.length; i++) {
                calRowSpan(i)
            }
        },
        setBatch(state, val) {
            //批量设置
            let batch = val
            for (let k in val) {
                if (batch[k] === '') {
                    delete batch[k]
                }
            }
            state.options = state.options.map((item) => {
                //刷新各个数据
                return {
                    ...item,
                    ...batch,
                }
            })
            state.options.forEach((item) => {
                //刷新缓存数据
                Object.assign(checkCache(item._pos), val) //合并对象
            })
        },
        initCacheInput(state, options) {//编辑商品的时候用的
            state.options.forEach((item) => {
                for (let val of options) {
                    if (deepCompare(item._pos, val._pos)) {
                        let { bar_code,
                            cost_price,
                            goods_sku,
                            original_price,
                            price,
                            stock,
                            thumb,
                            weight,
                            virtual_account_id,//虚拟卡密-卡密库ID
                            id } = val
                        //刷新缓存数据
                        Object.assign(checkCache(item._pos), {
                            bar_code,
                            cost_price,
                            goods_sku,
                            original_price,
                            price,
                            stock,
                            weight,
                            thumb,
                            virtual_account_id,//虚拟卡密-卡密库ID
                            id
                        }) //合并对象
                        break
                    }
                }

            })
        },
        addChildSpec(state, idx) {
            //添加子规格
            let id = 'childSpec' + new Date().getTime()
            state.specs[idx].items.push({
                id,
                title: '',
            })
            state.specs = [...state.specs]
            let specsLength = state.specs.length
            let type
            if (specsLength > 1 && idx !== 0) {
                // 至少2种规格 获取添加图片按钮所在规格位置
                let image_checked_spec_index = state.specs.findIndex((item) => {
                    return item.image_checked === '1'
                })
                if ((image_checked_spec_index + 1) !== specsLength) {
                    // 判断 添加图勾选的不是最后一个规格
                    type = 'formatThumb'
                }
            }
            this.commit('goodAddEdit/multiOptions/refreshOptions', type)
            this.commit('goodAddEdit/multiOptions/cacheRowSpan')
        },
        delChildSpec(state, { row, col }) {
            //删除子规格
            state.specs[row].items.splice(col, 1)
            state.specs = [...state.specs]
            this.commit('goodAddEdit/multiOptions/refreshOptions')
            this.commit('goodAddEdit/multiOptions/cacheRowSpan')
        },
        editChildSpec(state, { row, col, val, goods_type}) {
            //编辑子规格
            state.specs[row].items[col] = {
                ...state.specs[row].items[col],
                ...val,
            }
            state.specs = [...state.specs]

            this.commit('goodAddEdit/multiOptions/refreshOptions')
            // 规格项有校验问题时进行重新校验
            if (state.cacheSpecsError) {
                this.dispatch('goodAddEdit/multiOptions/checkSpecs')
            }
        },
        refreshColumns(state) {
            //更新列表的columns
            if (!deepCompare(forCompareColumns, state.columns)) {
                state.columns = state.specs.map((item, index) => {
                    return {
                        title: item.title,
                        key: '',
                        render: (h, params) => {
                            return <span>{params.row.childSpecVal?.[index]} </span>
                        },
                    }
                })
                // 初始化规格图片位置
                state.specs.forEach((item, index) => {
                    if (item.image_checked === '1') {
                        state.columns.splice(index + 1, 0, {
                            title: '规格图片',
                            key: 'thumb',
                            slot: 'thumb',
                        })
                    }
                })
                forCompareColumns = deepCopy(state.columns);
            }
        },
        refreshOptions(state, type) {
            // console.log(state.options,'state.options>>>>>');
            if (!deepCompare(forCompareOptions, state.options)) {

                //更新列表数据，慎用！！可以利用对象的引用直接赋值，性能问题
                _position = []
                state.groups = state.specs.map((item, index) => {
                    let children = item.items.map((val) => {
                        val.specId = item.id
                        return val
                    })
                    _position.push(item.id)
                    return children
                })
                state.options = combinations(state.groups).map((item) => {
                    //全排列组合
                    let _pos = {}
                    let childSpecVal = []
                    item.forEach((item) => {
                        _pos[item.specId] = item.id
                        childSpecVal.push(item.title)
                    })
                    let getCache = getCacheQuick(_pos, type)
                    return {
                        _pos, //定位缓存 {spec1522665665:childSpec1525496565656}
                        childSpecVal,
                        thumb: '',
                        price: '',
                        original_price: '',
                        cost_price: '',
                        stock: '',
                        virtual_account_id: '',//虚拟卡密-卡密库ID
                        goods_sku: '',
                        bar_code: '',
                        weight: '',
                        ...getCache,
                    }
                })
                forCompareOptions = deepCopy(state.options)
                cacheDiscount.setOptions(state.options)
            }

        },
        setgroups(state) {
            let group = state.specs.map((item, index) => {
                let children = item.items.map((val) => {
                    val.specId = item.id
                    return val
                })
                return children
            })
            state.groups = group
        },
        addSpec(state) {
            //添加规格名称
            let id = 'spec' + new Date().getTime() //主规格id
            state.specs.push({
                id,
                title: '',
                image_checked: '0',
                items: [
                    {
                        id: 'childSpec' + new Date().getTime(), //子规格id
                        title: '',
                    },
                ],
            })
            cacheInput = {} //清除缓存
            this.commit('goodAddEdit/multiOptions/refreshColumns')
            this.commit('goodAddEdit/multiOptions/refreshOptions')
        },
        delSpecs(state, index) {
            //删除规格名称
            state.specs.splice(index, 1)
            cacheInput = {} //清除缓存
            this.commit('goodAddEdit/multiOptions/refreshOptions')
            this.commit('goodAddEdit/multiOptions/refreshColumns')
            this.commit('goodAddEdit/multiOptions/cacheRowSpan')
        },
        editSpec(state, { row, val }) {//编辑主规格
            state.specs[row] = { ...state.specs[row], ...val }
            this.commit('goodAddEdit/multiOptions/refreshColumns')
        },
        getLevels(state, list = []) {
            //获取会员等级列表
            state.vipLevels = list.map((item, index) => {
                return {
                    level_name: item.level_name,
                    level_id: item.id,
                }
            })
            cacheDiscount.setVipLevels(state.vipLevels)
        },
        setCacheFormError(state, error) {
            state.cacheFormError = error
        },
        setCacheSpecsError(state, error) {
            state.cacheSpecsError = error
        },
        // 禁选时间
        customDisableTime(state, {childrenID, idx, time_rule_type}) {
            let data = state.cacheDisableDate,
                cacheTime = state.cacheCustomData;
            if (time_rule_type === '2') {
                data = state.customDisableDate[childrenID];
                cacheTime = state.specCustomTimeData[childrenID]
            }
            data.disabledHours = [];
            data.disabledMin = [];
            let endTime = cacheTime[idx]?.time?.[1].split(':');
            let endHours = Number(endTime[0]);
            let endMin = Number(endTime[1]);
            for (let i = 0; i < endHours; i++) {
                data.disabledHours.push(i);
            }
            for (let i = 0; i < endMin+1; i++) {
                data.disabledMin.push(i);
            }
        },
        customDisableMin(state, {time_rule_type, date, childrenID}) {
            let data = state.cacheDisableDate,
                cacheTime = state.cacheCustomData;
            if (time_rule_type === '2') {
                data = state.customDisableDate[childrenID];
                cacheTime = state.specCustomTimeData[childrenID]
            }

            let str = date[0].split(':');
            let end = date[1].split(':');
            let strHours = Number(str[0]);
            let endHours = Number(end[0]);
            let disHours = data.disabledHours[data.disabledHours.length - 1]+1;

            if (strHours>disHours) {
                data.disabledMin = []
            } else if (endHours>disHours) {
                data.disabledMin = []
            }
        },


    },
    actions: {
        checkSpecs({ state, commit }) {//检查规格名称是否填写
            let error = specsError(state.specs)
            return new Promise((resolve, reject) => {
                commit('setCacheSpecsError', error)
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        },
        checkSpecSettings({ state, commit }) {//检查规格表格填写是否符合邀请
            let error = null
            return new Promise(resolve => {
                let item = null;
                let err = null;
                let tmp = '';
                for (let i = 0; i < state.options.length; i++) {
                    item = state.options[i];
                    for (let k in item) {
                        tmp = item[k] + ''
                        err = trackError(k, tmp);
                        if (err) {
                            if (!error) {
                                error = {}
                            }
                            if (error[i]) {
                                error[i][k] = err
                            } else {
                                error[i] = { [k]: err }
                            }
                        }
                    }
                }
                commit('setCacheFormError', error)
                if (error) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        }
    },
    getters: {
        getFormData(state) {
            let arr = state.options.map((item) => {
                return checkCache(item._pos)
            })
            return arr
        },
    },
}
