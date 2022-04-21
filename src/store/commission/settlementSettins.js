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
import { Message } from 'view-design'
export default {
    namespaced: true,
    state: {
        cacheSettings: {},
        settings: {
            calculate_type: '1', // 佣金计算方式 1商品折扣价 2 实际支付方式
            withdraw_limit: 1, // 最低提现额度
            withdraw_fee_type: '1', // 提现手续费 1不扣除 2 自定义
            withdraw_fee: '', // 提现手续费百分比
            free_fee_type: '1', // 提现手续费 免手续费 1不免手续费 2自定义免手续
            free_fee_start: '',
            free_fee_end: '',
            settlement_day_type: '1', // 结算天数 1订单完成后既可提现 2自定义结算天数
            settlement_days: '1', // 结算天数
            withdraw_audit: '1', // 提现审核 1手动审核 2自动审核
            auto_check_level: '', // 分销等级(自动通过审核等级)
            auto_check_price: '', // 提现金额(自动通过审核金额)
            auto_pay: '', // 自动打款(暂时没有)
            withdraw_type: [], // 提现方式
        },
    },
    mutations: {
        setSettings(state, data) {
            state.settings = {
                ...state.settings,
                ...data,
            }
            state.cacheSettings = JSON.parse(
                JSON.stringify(state.cacheSettings)
            )
        },
    },
    actions: {
        getSettings({ commit }) {
            api.commissionApi.getSettleSettings().then((res) => {
                if (res.error == 0) {
                    res = res.settings
                    res.auto_check_level = res.auto_check_level + ''
                    commit('setSettings', res)
                }
            })
        },
        editSettings({ dispatch, state }) {
            return new Promise(async (resolve, reject) => {
                // 处理参数
                await dispatch('formatSettings')
                api.commissionApi
                    .editSettleSettings(state.settings)
                    .then((res) => {
                        if (res.error == 0) {
                            resolve(res)
                        } else {
                            resolve(res)
                        }
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        },
        formatSettings({ state }) {
            return new Promise((resolve) => {
                // 提现手续费
                if (state.settings.withdraw_fee_type === '1') {
                    state.settings.withdraw_fee = ''
                    state.settings.free_fee_type = '1'
                    state.settings.free_fee_start = ''
                    state.settings.free_fee_end = ''
                } else if (state.settings.withdraw_fee_type === '2') {
                    if (state.settings.free_fee_type === '1') {
                        state.settings.free_fee_start = ''
                        state.settings.free_fee_end = ''
                    } else {
                        if (
                            state.settings.free_fee_start === '' ||
                            state.settings.free_fee_end === ''
                        ) {
                            Message.error('请填写免手续费区间')
                            return
                        }
                        if (
                            state.settings.free_fee_start >=
                            state.settings.free_fee_end
                        ) {
                            Message.error('免手续费区间开始不能大于结束')
                            return
                        }
                    }
                }
                // 结算天数
                if (state.settings.settlement_day_type === '1') {
                    state.settings.settlement_days = ''
                }
                // 提现审核
                if (state.settings.withdraw_audit === '1') {
                    state.settings.auto_check_level = ''
                    state.settings.auto_check_price = ''
                }
                resolve()
            })
        },
    },
}
