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
*  用于页面的一些宽度等基础配置
 */
import api from '@/api'
import {
    deepMerge,//深度合并
} from '@/assets/jsTools/objectTools'
export default {
    namespaced: true,
    state: {
        cacheSettings: {},
        goodsList: [],
        settings: {
            commission_level: 0,
            self_buy: 0,
            become_condition: 0,
            is_audit: 0,
            write_info: 0,
            child_condition: 1,
            become_goods_ids: '',
            become_order_money: '',
            become_order_count: '',
            show_agreement: 0,
            become_order_status:1,
            banner:'',
            show_commission:0,
            show_commission_level: 1,
            show_commission_level_type: 1,
            commission_type: 1,
            compete_safe_type: 0,
            compete_safe_days: '',
            compete_delay_type: 0,
            compete_delay_one_price: '',
            compete_delay_total_price: '',
        },
        lastLevel: ''
    },
    mutations: {
        setGoodsList(state, list) {
            state.goodsList = list;
            state.settings.become_goods_ids = list.map(item=>item.id).join(',');
        },
        setSettings(state, data) {
            state.settings = deepMerge(state.settings, data);
            state.cacheSettings = JSON.parse(JSON.stringify(state.cacheSettings));
        },
        setLastLevel(state, level) {
            state.lastLevel = level;
        }
    },
    actions: {
        getGoodsList(ctx, ids) {
            if (ids.length) {
                api.goodsApi.goodsList({
                    ids,
                }).then(res => {
                    ctx.commit('setGoodsList', res.list)
                })
            }
        },
        getSettings(ctx) {
            api.commissionApi.getSettings().then(res => {
                if (res.error == 0) {
                    delete res.notice;
                    res.settings?.compete_delay_type !== 1 ? res.settings.compete_delay_one_price = '': res.settings?.compete_delay_type !== 2 ? res.settings.compete_delay_total_price = '':'';
                    res = res.settings
                    ctx.commit('setSettings', res);
                    ctx.dispatch('getGoodsList', (res.become_goods_ids).split(',').filter(item=>item))
                    ctx.commit('setLastLevel', res.commission_level);
                    ctx.commit('config/setCommissionSetting', res, {root: true})
                }
            })
        },
        editSettings(ctx) {
            return new Promise((resolve, reject) => {
                api.commissionApi.editSettings(ctx.state.settings).then(res => {
                    if (res.error == 0) {
                        resolve(res);
                    } else {
                        resolve(res);
                    }
                }).catch(err => {
                    reject(err);
                })
            })
        }

    }
};
