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
 * 用于优惠券的添加/编辑功能
 */
import $api from '@/api'

const model = {
    coupon_name: '',
    coupon_sale_type: '1', // 优惠券类型
    enough: '',
    discount_price: '',
    stock_type: '1',
    stock: '',
    time_limit: '0',
    limit_day: '',
    start_time: new Date(),
    end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    sort: '',
    limit_member: '0', // 领取人限制
    member_level: [], // 会员限制
    commission_level: [], // 分销商等级
    get_max_type: '1',
    get_max: '',
    pick_type: '0',
    is_free: '1',
    balance: '',
    credit: '',
    goods_limit: '0', // 商品限制
    goods_ids: '', // 商品、商品分类
    coupon_sale_limit: '0',
    category_id: '',
    default_description: '1',
    description: ''
}

export default {
    namespaced: true,
    state: {
        model: Object.assign({}, model),
        isDisabled: false,
        shopLevel: [],
        vipLevel: [], // 会员等级
        commissionLevel: [], // 分销商等级
        goods: {
            list: [],
            data: [],
            total: 0
        } // 商品列表
    },
    mutations: {
        setDisabled(state, val) {
            state.isDisabled = val
        },
        // 初始化model
        resetModel(state) {
            state.model = JSON.parse(JSON.stringify(model))
        },
        setModel(state, obj) {
            state.model = {
                ...state.model,
                ...obj
            }
        },
        // 商品分类
        setShopLevel(state, val) {
            state.shopLevel = val || []
        },
        // 会员等级
        setVipLevel(state, val) {
            state.vipLevel = val || []
        },
        // 分销商等级
        setCommissionLevel(state, val) {
            state.commissionLevel = val || []
        },
        // 初始化商品
        initGoodsList(state, list) {
            if (list) {
                state.goods.list = list
                state.goods.data = list.slice(0, 10)
                state.goods.total = list.length
            } else {
                state.goods.list = []
                state.goods.data = []
                state.goods.total = 0
            }
        }
    },
    actions: {
        // 获取分销商全部列表
        getAgentGradeAllList({ commit }) {
            $api.commissionApi.getAgentGradeAllList({}).then(res => {
                if (res.error === 0) {
                    commit('setCommissionLevel', res.list)
                }
            })
        }
    }
}
