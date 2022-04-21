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
/*
 *  用于商品添加编辑功能
 */
import multiOptions from './goodAddEdit/multiOptions.js'
import api from '@/api'
import {dealClassifyList} from '@/assets/helpers'
/**
 * 专门用于处理会员折扣的类
 */
import cacheDiscount from './goodAddEdit/jsTools/vipDiscount.js'
import vipDiscount from './goodAddEdit/vipDiscount.js'
import {model, ext_field} from './goodAddEdit/jsTools/goodModelData'

let setModelData = null

// 拓展字段
const EXT_FIELD = {
    show_sales: '0', //显示销量
    show_stock: '1', // 显示库存
    invoice: '0', //支持发票
    refund: '1', // 退款
    return: '1', // 退款退货（实体商品）
    exchange: '1', // 换货（实体商品）
    is_delivery_pay: '0', // 货到付款（实体商品）
    auto_putaway: '0', // 是否自动下架
    single_max_buy: '',
    single_min_buy: '',
    max_buy: '',
    putaway_time: '',
    note: '', // 商品备注
};

// 初始化多规格options数据
function initMultiOptions(data) {
    let obj = {}
    obj.goods = data
    // 多规格
    if (data.has_option === '1') {
        data.options.forEach((option) => {
            option.childSpecVal = option.title.split('+')
            option._pos = {}
            data.spec.forEach((spec) => {
                spec.items.forEach((item) => {
                    if (option?.specs?.split(',')?.includes(item.id)) {
                        option._pos[`${item.spec_id}`] = item.id
                    }
                })
            })
        })
    }

    obj.options = data.options
    obj.specs = data.spec
    delete obj.goods.options
    delete obj.goods.spec
    return obj
}

const limitLabel = {
    browse_level: [], // 会员等级浏览标签
    browse_label: [], // 会员标签组
    buy_level: [], // 会员等级购买标签
    buy_label: [], // 会员购买标签组
}


export default {
    namespaced: true,
    modules: {multiOptions, vipDiscount},
    state: {
        cityList: [],
        editParams: 1, //商品参数编辑1开启0关闭
        goodParams: [],
        model: Object.assign({}, model, {ext_field}),
        isThumbAddSlide: true, // 是否主图添加到轮播图首图
        validateType: [], // 校验不通过的type名称，用，分开
        shopLabel: {
            list: [],
            data: [],
            value: false,
        },
        limitLabel: Object.assign({}, limitLabel),
        rules: {
            type: [
                {
                    required: true,
                    message: '商品类型必填',
                },
            ],
            title: [
                {
                    required: true,
                    message: '商品标题必填',
                },
            ],
            thumb: [
                {
                    required: true,
                    message: '商品主图必填',
                },
            ],
            sort_by: [
                {
                    pattern: /^(0|[1-9][0-9]{0,4})$/,
                    message: '商品排序为数字类型，最长为4位数',
                },
            ],
            sales: [
                {
                    pattern: /^(0|[1-9][0-9]*)$/,
                    message: '虚拟销量为正整数，最长为8位数',
                },
            ],
            logistics_support: [
                {
                    required: true,
                    message: '物流方式必选',
                    validator(rule, value, callback) {
                        if (value && value.length > 0) {
                            callback()
                        } else {
                            callback(new Error('物流方式必选'));
                        }
                    },
                    trigger: 'blur',
                    type: "array",
                },
            ],
            dispatch_type: [
                {
                    required: true,
                    message: '运费设置必选',
                },
            ],
            dispatch_id: [
                {
                    required: true,
                    message: '请选择运费模板',
                }
            ],
            status: [
                {
                    required: true,
                    message: '上架设置必选',
                },
            ],
            reduction_type: [
                {
                    required: true,
                    message: '库存设置必填',
                },
            ],
            price: [
                {
                    required: true,
                    message: '售卖价必填',
                },
                {
                    pattern: /^(0|[1-9][0-9]{0,6})(.[0-9]{1,2})?$/,
                    message: '支持7位整数两位小数点',
                },
            ],
            original_price: [
                {
                    pattern: /^(0|[1-9][0-9]{0,6})(.[0-9]{1,2})?$/,
                    message: '支持7位整数两位小数点',
                },
            ],
            cost_price: [
                {
                    pattern: /^(0|[1-9][0-9]{0,6})(.[0-9]{1,2})?$/,
                    message: '支持7位整数两位小数点',
                },
            ],
            stock: [
                {
                    required: true,
                    message: '商品库存必填',
                },
                // {
                //     pattern: /^(0|[1-9][0-9]{0,8})$/,
                //     message: '库存为正整数，最长为9位数',
                // },
            ],
            virtual_account_id: [
                {
                    required: true,
                    message: '卡密库必选',
                },
            ],
            dispatch_price: [
                // {
                //     pattern: /^(0|[1-9][0-9]*)(.[0-9]{1,2})?$/,
                //     message: '支持整数或两位小数',
                // },
            ],
            auto_deliver: [
                {
                    required: true,
                    message: '自动发货必填',
                },
            ],
            auto_deliver_content: [
                {
                    required: true,
                    message: '自动发货内容必填',
                },
            ],
            putaway_time: [
                {
                    required: true,
                    message: '上架时间必填',
                },
            ],
        },
        goodsDetail: '', //商品详情
        isMoreInventorySetting: false,
        isShowVideo: false,
        shopLevel: [],
        dispatchList: [], // 运费模板列表
        actionType: 'create', // 商品修改状态：create创建/update修改
        dispatchEnable: {
            express: 0,
        }, // 物流开启状态
        videoParams: {}, // 视频选择器选择数据
        virtualData: {}, //虚拟卡密-卡密库
        goodDecrate: {}, //商品详情信息获取
    },
    mutations: {
        setGoodParams(state, val) {
            state.goodParams = val
        },
        setEditParams(state, val) {
            state.editParams = val
        },
        setGoodDetail(state, val) {
            state.goodDetail = val
        },
        setIsThumbAddSlide(state, val) {
            state.isThumbAddSlide = val
        },
        setIsShowVideo(state, val) {
            state.isShowVideo = val
        },
        setValidateType(state, type) {
            state.validateType = type;
        },
        setModel(state, val) {
            // 处理category_id 商品分类选中问题
            let _category_id = [];

            function assembleData(data) {
                data.forEach(item => {
                    if (new Set(val.goods.category_id).has(item.value)) {
                        if (item.children && item.children.length) {
                            let _cache = item.children.map(v => v.value)
                            let _cache1 = _cache.filter(v => val.goods.category_id.indexOf(v) >= 0)
                            // 判断val.goods.category_id是否包含_cache里的所有数据
                            // if (_cache.length === _cache1.length) {
                            //     _category_id.push(item.value)
                            // }
                            if (_cache1.length === 0) {
                                // 有父级没有子级（添加子级分类）
                                _category_id.push(item.value)
                            }
                            assembleData(item.children)
                        } else {
                            // 没有子集直接添加
                            _category_id.push(item.value)
                        }
                    } else {
                        if (item.children && item.children.length) {
                            assembleData(item.children)
                        }
                    }
                });
            }

            assembleData(state.shopLevel);
            val.goods.category_id = _category_id
            // 物流支持
            if (val.goods?.type === '0') {
                if (val.goods?.dispatch_express === '1') {
                    val.goods.logistics_support.push('1')
                }
            }
            let auto_putaway = val.goods?.ext_field?.auto_putaway
            if (val.goods.status == '0' && auto_putaway === '1') {
                // 自动上架
                val.goods.putaway_time = val.goods?.ext_field?.putaway_time
                val.goods.status = '2'
            }

            state.model = val.goods;

            // 多规格会员等级
            cacheDiscount.setOptions(val.options)
            // 多规格
            if (val.goods.has_option === '1') {
                state.multiOptions.options = val.options

                console.log(state.multiOptions.options, 'state.multiOptions.options>>>>');

                // 多规格赋值
                state.multiOptions.specs = val.specs.map((item, index) => {
                    return {
                        ...item,
                        image_checked: (item.image_checked && new Set(['0', '1']).has(item.image_checked)) ? item.image_checked : val.specs.length === index + 1 ? '1' : '0', // 如果image_checked不为2，则使用image_checked， 2取最后一项选中（兼容老数据）
                    }
                })
                this.commit('goodAddEdit/multiOptions/refreshColumns')
                this.commit('goodAddEdit/multiOptions/refreshOptions');//初始化
                this.commit('goodAddEdit/multiOptions/setgroups')
                this.commit('goodAddEdit/multiOptions/cacheRowSpan')
                this.commit('goodAddEdit/multiOptions/initCacheInput', val.options)
                this.commit('goodAddEdit/multiOptions/refreshOptions');//复值操作
            }
            // 判断视频是否存在
            if (val.goods.video || val.goods.video_thumb) {
                this.commit('goodAddEdit/setIsShowVideo', true);
            } else {
                this.commit('goodAddEdit/setIsShowVideo', false);
            }
        },
        // 初始化model
        resetModel(state) {

            state.model = Object.assign({}, model, {ext_field: JSON.parse(JSON.stringify(EXT_FIELD))})

            this.commit('goodAddEdit/resetLimitLabel')
        },
        // 初始化权限label
        resetLimitLabel(state) {
            state.limitLabel = Object.assign({}, limitLabel)
        },
        // 设置等级权限
        setLimitLevel(state, obj) {
            state.model.browse_level_perm_ids = obj?.model?.browse || []
            state.model.buy_level_perm_ids = obj?.model?.buy
            state.limitLabel.browse_level = obj?.level?.browse || []
            state.limitLabel.buy_level = obj?.level?.buy || []
        },
        // 设置权限标签组
        setLimitLabel(state, obj) {
            state.model.browse_tag_perm_ids = obj?.model?.browse || []
            state.model.buy_tag_perm_ids = obj?.model?.buy || []
            state.limitLabel.browse_label = obj?.label?.browse || []
            state.limitLabel.buy_label = obj?.label?.buy || []
        },
        setModelProps(state, obj) {
            //参数按钮关闭时删除缓存
            if (obj.hasOwnProperty('params_switch') && obj.params_switch === '1') {
                state.model.params = []
            }
            state.model = {
                ...state.model,
                ...obj,
            }
        },
        setCityList(state, list) {
            state.cityList = list
        },
        setShopLabel(state, val) {
            state.shopLabel = val
        },
        setRules(state, val) {
            state.rules = val
        },
        setIsMoreInventorySetting(state, val) {
            state.isMoreInventorySetting = val
        },
        setShopLevel(state, val) {
            // 处理select多选取消选中问题
            function deep(arr = []) {
                if (Array.isArray(arr)) {
                    arr.forEach((item) => {
                        if (item.children && item.children.length > 0) {
                            let checkArr = item.children.filter(
                                (subItem) => {
                                    return subItem.checked === true
                                }
                            )
                            item.indeterminate = !!(checkArr.length && checkArr.length !== item.children.length)
                            deep(item.children)
                        }
                    })
                }
            }
            if (val.opt) {
                val = val.val
            }
            deep(val)
            state.shopLevel = val

        },
        setVideoParams(state, val) {
            state.videoParams = val || {video_url: '', type: '0'}
        },
        setVirtualData(state, val) {
            state.virtualData = val
        },

        setActionType(state, val) {
            state.actionType = val
        },
        // 初始化shopLabel
        initLabelData(state, {recommendList = [], list = []}) {
            let data = []
            let labelId = state.model.label_id ? [...state.model.label_id] : []
            if (labelId.length > 0) {
                recommendList.length > 0 &&
                recommendList.forEach((item) => {
                    if (labelId.indexOf(item.id.toString()) > -1) {
                        data.push(item)
                    }
                })
                list.length > 0 &&
                list.forEach((item) => {
                    if (labelId.indexOf(item.id) > -1) {
                        data.push(item)
                    }
                })
            } else {
                state.actionType === 'create' && recommendList.length > 0 &&
                recommendList.forEach((item) => {
                    data.push(item)
                    labelId.push(item.id)
                })
            }
            this.commit('goodAddEdit/setModelProps', {
                label_id: labelId,
            })
            this.commit('goodAddEdit/setShopLabel', {
                ...state.shopLabel,
                data: data,
            })
        },
        // 设置运费模板
        setDispatchTemplate(state, list) {
            state.dispatchList = list
        },
        // 设置默认配送模板
        initDispatchTemplate(state, res) {
            state.model.dispatch_id = res.id || ''
        },
        // 设置默认配送模板
        setDispatchEnable(state, params) {
            state.dispatchEnable = {
                ...state.dispatchEnable,
                ...params,
            }
        },
    },
    actions: {
        // 获取标签列表
        getLabel(ctx) {
            api.goodsApi
                .getGoodLabel({
                    pager: '0',
                })
                .then((res) => {
                    if (res.error === 0) {
                        let list = [];
                        res.data && res.data.forEach(item => {
                            item.label?.length && item.label.forEach(label => {
                                list.push(label);
                            })
                        })
                        console.log(list, 999)
                        ctx.commit('initLabelData', {
                            recommendList: res?.recommend || [],
                            list: list,
                        })
                    }
                })
        },
        // 获取运费模板
        getDispatchTemplateList(ctx, sub_shop_id) {
            let params = {};
            sub_shop_id && (params['sub_shop_id'] = sub_shop_id);
            api.orderApi.getExpressStyleAllList(params).then((res) => {
                if (res.error === 0) {
                    ctx.commit('setDispatchTemplate', res.list || [])
                }
            })
        },
        // 获取默认运费模板
        getDefaultDispatch(ctx) {
            api.orderApi.getExpressStyleDefault().then((res) => {
                if (res.error === 0) {
                    ctx.commit('initDispatchTemplate', res)
                }
            })
        },
        // 获得商品信息
        async getGoodData(ctx, goodsData) {
            const {id, operate} = goodsData
            let requseParams = {
                id,
            }
            if (operate == 'copy') {
                requseParams.flag = 'copy'
            }
            return new Promise((resolve) => {
                if (id) {
                    api.goodsApi
                        .getGood(requseParams)
                        .then((res) => {
                            if (res.error === 0) {
                                // 处理腾讯视频
                                let editVideo =
                                    {
                                        type: res.data.video_type === '2' ? 'network' : (res.data.video_type === '1' ? 'local' : '0'),
                                        video_url: res.data.video
                                    }
                                this.commit('goodAddEdit/setVideoParams', editVideo)
                                let editGoods = function () {
                                    const {perm_data, ...data} = res.data
                                    if (data.params?.constructor === Object) {
                                        let params = []
                                        for (let k in res.data.params) {
                                            params.push({
                                                key: k,
                                                value: res.data.params[k],
                                            })
                                        }
                                        res.data.params = params
                                    }
                                    // 复制商品处理商品标题
                                    if (operate === 'copy') {
                                        data.title = `副本-${data.title}`
                                        // 截取商品标题前70字符， 防止超出
                                        data.title = data.title.slice(0, 70)
                                        if (data.spec && data.spec.length) {
                                            data.spec.forEach(item => {
                                                delete item.goods_id
                                                item.id = `spec${item.id}`
                                                if (item.items && item.items.length) {
                                                    item.items.forEach(sub => {
                                                        sub.id = `childSpec${sub.id}`
                                                        sub.specId = `spec${sub.specId}`
                                                        if (sub.spec_id) {
                                                            sub.spec_id = `spec${sub.spec_id}`
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        if (data.options && data.options.length) {
                                            data.options.forEach(item => {
                                                delete item.goods_id
                                                delete item.id
                                                item.specs = item.specs.split(',').map(sub => `childSpec${sub}`).join(',')
                                            })
                                        }
                                    }

                                    // 处理主图和轮播图
                                    if (data.thumb_all?.length && data.thumb_all.indexOf(data.thumb) > -1) {
                                        ctx.commit('setIsThumbAddSlide', true)
                                    } else {
                                        ctx.commit('setIsThumbAddSlide', false)
                                    }
                                    // 物流支持（控制必填标识显示） 1:普通快递 
                                    data.logistics_support = []
                                    setModelData = initMultiOptions(data)
                                    ctx.commit('setModel', setModelData)
                                    // 商品权限
                                    if (perm_data) {
                                        ctx.dispatch(
                                            'goodAddEdit/vipDiscount/getVipLevelList',
                                            perm_data,
                                            {root: true}
                                        )
                                        ctx.dispatch(
                                            'goodAddEdit/vipDiscount/getVipGroup',
                                            perm_data,
                                            {root: true}
                                        )
                                    } else {
                                        ctx.commit('resetLimitLabel')
                                    }
                                    ctx.dispatch('getLabel') // 获取标签列表
                                    !ctx.state.model.dispatch_id &&
                                    ctx.dispatch('getDefaultDispatch')
                                }
                                if (res.data.video_type == 2) {
                                    api.accessoryApi.getVideoNetwork({url: res.data.video})
                                        .then(result => {
                                            if (result.error === 0) {
                                                res.data.video = result.data
                                                editGoods()
                                            }
                                        });
                                } else {
                                    editGoods()
                                }
                            }
                            resolve()
                        })
                } else {
                    ctx.dispatch('getLabel') // 获取标签列表
                    !ctx.state.model.dispatch_id &&
                    ctx.dispatch('getDefaultDispatch')
                    // 重置视频选择器选择数据
                    this.commit('goodAddEdit/setVideoParams')
                    resolve()
                }
            })
        },
        // 获取商品分类
        getShopClassify(ctx) {
            return new Promise((resolve) => {
                api.goodsApi.goodClassifyList().then((res) => {
                    if (res.error === 0) {
                        // 待处理
                        let list = dealClassifyList(res.list)
                        ctx.commit('setShopLevel', list)
                    }
                    resolve()
                })
            })
        },

        // 获取物流是否开启
        getDispatchEnable({commit}, params) {
            return new Promise((resove) => {
                api.orderApi.getDispatchEnable(params).then((res) => {
                    if (res.error === 0) {
                        commit('setDispatchEnable', res.data)
                        resove(res.data)
                    } else {
                        resove({})
                    }
                })
            })
        },
        // 获取卡密库数据
        getVirtualData(ctx) {
            return new Promise((resolve) => {
                api.goodsApi.getVirtualData().then((res) => {
                    if (res.error === 0) {
                        ctx.commit('setVirtualData', res.data)
                    }
                    resolve()
                })
            })
        },
    },
    getters: {
        dispatchEnable: state => state.dispatchEnable,
    },
}
