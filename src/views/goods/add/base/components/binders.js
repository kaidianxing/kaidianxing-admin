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
import store from '@/store'

export const modelMap = () => { //v-model绑定vuex/goodAddEdit模块下的state/model中的参数
    let dataObj = {};
    let model = store.state.goodAddEdit.model;
    for (let key in model) {
        dataObj[`model_${key}`] = {
            get() {
                return store.state.goodAddEdit.model[key]
            },
            set(val) {
                store.commit('goodAddEdit/setModelProps', {
                    [key]: val
                });
            }
        };
    }
    return dataObj;
}
export const stateMap = (prop) => { //v-model绑定vuex/goodAddEdit模块下的state中的参数
    let obj = {}
    if (typeof prop === 'string') {
        obj = {
            [prop]: {
                get() {
                    return store.state.goodAddEdit[prop]
                },
                set(val) {
                    store.commit(`goodAddEdit/set${prop.replace(/^./, res => {
                        return res.toUpperCase();//首字母大写
                    })}`, val);
                }
            }

        }
    } else if (prop instanceof Array) {
        prop.forEach(item => {
            obj[item] = {
                get() {
                    return store.state.goodAddEdit[item]
                },
                set(val) {
                    store.commit(`goodAddEdit/set${item.replace(/^./, res => {
                        return res.toUpperCase();//首字母大写
                    })}`, val);
                }
            }
        })
    }
    return obj
}
