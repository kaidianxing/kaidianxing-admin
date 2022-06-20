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
import $api from '@/api/index';
import * as $utils from '@/assets/helpers'
// import { resolve } from 'core-js/fn/promise';
let cacheReqPerm = null;

export default {
    namespaced: true,
    state: {
        systemOutput: '', //
        routes: [],
        // 商城基本设置
        baseSetting: {
            logo: '',
            name: ''
        },
        // 抵扣
        deduct: {
            credit_state: '', // 积分抵扣状态 0 未开启，1开启
            balance_state: '', // 余额抵扣状态 0未开启，1开启
            credit_num: ''
        },
        // 交易设置
        business: {
            invoice: '' // 发票0不开启，1纸质2电子
        },
        // 地址库
        address: [],
        // 上传设置
        uploadSetting: {
            image: null,
            video: null,
            audio: null
        },
        // 分销
        commission: {
            setting: {}
        },
        // 数据统计的更新时间
        data: {
            updateTimeText: '',
            updateTime: ''
        },
        // 用户数据
        user: {},
        // 右侧的链接
        right_top_link: {},
        copyright: '',
        // 应用过期信息
        apps: {},
        amap_key: '', //高德key
        amap_code: '', //高德安全密钥
        // 店铺存储信息  默认托管存储
        shopStorage: {
            storage_model: 10
        },
        shop_attachment_url: '',
        shop_expire_day: null, // 逾期天数
        is_trial: 0,//套餐是否是体验
        admin: null,    // 管理端信息
        admin_status: '1', // 管理端开启商城状态
    },
    getters: {
        /**
         * 权限查询
         * @param {*} state
         */
        getPermMap(state) {
            return key => {
                if (state.user.perms && state.user.perms.indexOf) {
                    return state.user.perms.indexOf(key) > -1
                }

            }
        },
        getPermMaps(state) {
            return key => {
                if (state.user.perms && state.user.perms.indexOf) {
                    return state.user.perms.indexOf(key) > -1
                }

            }
        },
    },
    mutations: {
        setUserInfo(state, user={}) {
            state.user = user
        },
        setRoutes(state, routes) {
            state.routes = routes
        },
        setBaseSetting(state, option) {
            state.baseSetting.logo = option.logo;
            state.baseSetting.name = option.name;
            state.baseSetting.icp_code = option.icp_code;
            // document.title = option.name
            // 网页图标替换
            document.querySelector('link[rel="icon"]').href = $utils.media(option.logo);
        },
        // 设置抵扣项
        setMDeduct(state, option) {
            state.deduct = {
                ...option
            };
        },
        // 设置交易设置
        setBusiness(state, option) {
            state.business = Object.assign(state.business, option);
        },
        // 添加地址库
        setAddress(state, address) {
            state.address = address;
        },
        // 添加上传设置
        setUploadSetting(state, res) {
            state.uploadSetting = res;
        },
        // 添加分销设置
        setCommissionSetting(state, res) {
            Object.assign(state.commission.setting, res);
        },
        // 添加数据更新时间字段
        setDataUpdateTimeText(state, time) {
            state.data.updateTimeText = `数据更新于${time}，每日更新一次`;
            state.data.updateTime = time;
        },
        // 获取用户数据
        setShopInit(state, res) {
            state.user = res?.user;
            state.right_top_link = res?.right_top_link;
            state.copyright = "<p>青岛开店星信息技术有限公司提供技术支持<br/> <br/>网站备案号:鲁ICP备2021028233号-1</p>"
            state.admin_status = res?.admin_status
            state.shop_expire_day = res?.shop_expire_day
            state.is_trial = res?.is_trial
            state.admin = res?.admin||{}

        },
        // 获取高德地图key
        setAMapKey(state, {amap_key, amap_code}) {
            state.amap_key = amap_key
            state.amap_code = amap_code
        },
        setShopStorage(state, res) {
            let { storage } = res;
            // 店铺存储
            let data = {
                storage_model: storage?.storage_model || 10,
                type: storage?.type
            };
            state.shop_attachment_url = 20 === +data.storage_model ? res?.shop_attachment_url : '';
            if (storage?.type !== 'local' && 1 === +storage?.[storage.type]?.image_compression) {
                data.image_compression = 1;
                data.image_compression_rule = storage?.[storage.type]?.image_compression_rule?.rule;
            }
            state.shopStorage = data;
        },
    },
    actions: {
        init({ dispatch }, to) {
            Promise.all([dispatch('execute'), dispatch('getCommissionSetting'), dispatch('getDataUpdateTime'), dispatch('getShopInit', { to })]).then(() => {
                return Promise.resolve()
            })
        },
        // 获取余额、积分抵扣设置
        getDeduction({
            commit
        }) {
            $api.marketApi.getDeduction().then(res => {
                if (res.error === 0) {
                    commit('setMDeduct', {
                        credit_state: res.credit_state,
                        balance_state: res.balance_state,
                        credit_num: res.credit_num
                    });
                }
            });
        },
        // 获取发票信息
        getBusiness({
            commit
        }) {
            $api.settingApi.getBusinessSetting().then(res => {
                let {
                    error,
                    ...info
                } = res;
                if (error === 0) {
                    commit('setBusiness', info);
                }
            });
        },
        // 获取地址库地址
        getAddress({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                if (!state.address?.length) {
                    $api.settingApi.getAddressList().then(res => {
                        if (res.error === 0) {
                            formatAddress(res.list)
                            commit('setAddress', res.list)
                            resolve(res.list)
                        }
                        reject(res)
                    })
                } else {
                    resolve(state.address)
                }
            })
        },
        // 获取图片、视频、音频上传设置
        getUploadSetting({
            commit,
            state
        }) {
            !state.uploadSetting.image && $api.accessoryApi.getUploadSetting().then(res => {
                if (res.error === 0) {
                    commit('setUploadSetting', res.data)
                }
            })
        },
        // 获取图片、视频、音频上传设置在没有shopid情况下
        getAccountUploadSetting({
            commit,
            state
        }) {
            !state.uploadSetting.image && $api.accessoryApi.getAccountUploadSetting().then(res => {
                if (res.error === 0) {
                    commit('setUploadSetting', res.data)
                }
            })
        },
        // 获取分销商设置
        getCommissionSetting({ commit }) {
            return new Promise((resolve) => {
                $api.commissionApi.getSettings().then(res => {
                    if (res.error == 0) {
                        commit('setCommissionSetting', res.settings)
                        resolve()
                    }
                })
            })
        },
        // 获取数据更新时间
        getDataUpdateTime({ commit }) {
            return new Promise((resolve) => {
                $api.dataApi.getUpdateTime()
                    .then(res => {
                        if (res.error === 0) {
                            commit('setDataUpdateTimeText', res.time)
                            resolve()
                        }
                    })
            })
        },
        // 商城初始化数据、权限、用户、修改密码等链接
        getShopInit({
            dispatch,
        }, { to, forceUpdate }) {
            if (!cacheReqPerm||!forceUpdate) { // 没有缓存或者强制刷新
                cacheReqPerm = new Promise((resolve, reject) => {
                    $api.accessoryApi.getShopInit()
                        .then(res => {
                            resolve(res)
                        }).catch(err => {
                            reject(err)
                        }).finally(() => {
                            cacheReqPerm = null;
                        })
                })
            }

            cacheReqPerm.then(res=> dispatch('setShopInit',{response:res,toPath:to}))

            return cacheReqPerm
        },
        // 初始化店铺设置
        setShopInit({commit},{response,toPath}){
            if (response.error === 0) {
                commit('setShopStorage', response);

                commit('setting/setWapUrl', response.wap_url, {
                    root: true
                })
                commit('setShopInit', response);

                commit('menu/refreshMenu', toPath, {
                    root: true
                })
                commit('setBaseSetting', response.settings || {});
            } else {
                commit('setShopInit', null);
            }
        },
        execute() {
            $api.decorateApi.execute()
        },
    },
};

// 地址库数据格式化
function formatAddress(data) {
    data.forEach(item => {
        item.id = item.code_id // 传的是adcode
        item.value = item.name
        item.label = item.name
        item.children = item.child || []
        delete item.child
        /*添加国外选项无子集省市区处理 长度等于0 -wyn*/
        if (item.children.length > 0) {
            Object.assign(item, {
                expand: false,
                expand_left: false, //左边是否展开
                expand_right: false, //右边是否展开
                add: false, //是否已经添加
                all_add: false, //子城市是否全部添加
                show: true //是否显示
            })
            formatAddress(item.children)
        }
    })
}
