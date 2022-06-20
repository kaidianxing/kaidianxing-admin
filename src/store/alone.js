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
import $api from '@/api'
import $store from '@/store'
export default {
    namespaced: true,
    state: {
        setting: null, // 商城设置
        registSetting: null, // 注册设置
        qrcode_url: null,
        user: {},
        isLogin: null
    },
    mutations: {
        setQrCode(state, qrcode) {
            state.qrcode_url = qrcode
        },
        setInitInfo(state, setting) {
            state.setting = setting
        },
        setRegistSet(state, setting) {
            state.registSetting = setting
        },
        setUserInfo(state, user) {
            state.user = user
        },
        setLoginStatus(state, isLogin) {
            state.isLogin = isLogin
        }
    },
    actions: {
        getInitInfo({ state, commit }, forceUpdate) { // 获取商家端设置
            if (state.setting && !forceUpdate) {
                return Promise.resolve(state.setting)
            }

            return new Promise((resolve) => {
                $api.aloneApi.getAloneInit().then(res => {
                    if (res.error === 0) {
                        // 调整为pc_logo pc_name
                        res.setting.logo = res.setting.pc_logo
                        res.setting.name = res.setting.pc_name
                        resolve(res.setting)
                        commit('setInitInfo', res.setting)
                        commit('setQrCode', res.qrcode_url)
                    }
                })
            })
        },
        getUserInfo({ commit }) { // 获取用户设置
            return new Promise((resolve) => {
                $api.aloneApi.getShopList({ timestamp: Date.now() }).then(res => {
                    if (res.error === 0) {
                        commit('setUserInfo', res.user_info)
                        resolve()
                    }
                })
            })
        },
        getLoginStatus({ state, commit }) { // 获取登录状态
            return new Promise((resolve) => {
                if (state.isLogin != null) {
                    resolve(state.isLogin)
                    return
                }
                $api.aloneApi.getLoginStatus().then(res => {
                    if (res.error === 0) {
                        commit('setLoginStatus', res.login_status)
                        resolve(res.login_status)
                    }
                })
            })

        },
        initUser({commit}){  // 清空用户信息
            commit('setLoginStatus', false)
            commit('setUserInfo', {})
            localStorage.setItem('sessionId','')
            $store.commit('account/setSessionId','')
            $store.commit('config/setUserInfo', {})
        },
        loginOut({ dispatch }) {
            return new Promise((resolve) => {
                $api.accessoryApi.logout().then(res => {
                    if (res.error == 0) {
                        dispatch('initUser')
                        resolve()
                    }
                })
            })
        }
    },
    getters: {
        setting: state => state.setting,
        registSetting: state => state.registSetting
    }

}
