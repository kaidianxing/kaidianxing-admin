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
        settings: {
            commission_type: 0,
            open: 0,
            show_total: 10,
        },

    },
    mutations: {
        setSettings(state, data) {
            state.settings = deepMerge(state.settings, data);
        },
    },
    actions: {
        getSettings(ctx) {
            api.commissionApi.getRankSettings().then(res => {
                if (res.error == 0) {
                    ctx.commit('setSettings', res.data);
                }
            })
        },
        editSettings({ state }) {
            return new Promise((resolve, reject) => {
                api.commissionApi.editRankSettings(state.settings).then(res => {
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
