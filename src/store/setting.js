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
import api from '@/api'
export default {
    namespaced: true,
    state: {
        systemSetting: null,
        wap_url: '',
        randomGoodId: '',
        history:{},
        
    },
    mutations: {
        setHistory(state,data){
            state.history=data
        },
        setRanGoodId(state, id) {
            state.randomGoodId = id
        },
        setWapUrl(state, wap_url) {
            state.wap_url = wap_url
        },
        setSystemSetting(state, res) {
            state.systemSetting = res;
        }
    },
    actions: {
        getSysSetting(ctx) {
            return new Promise((resolve,reject)=>{
                if(ctx.state.systemSetting){
                    resolve(ctx.state.systemSetting)
                    return
                }
                api.settingApi.getBaseSetting().then(res => {
                    if (res.error == 0) {
                        ctx.commit('setSystemSetting', {
                            basic: {
                                ...res
                            }
                        })
                        resolve(res)
                    }else{
                        reject(res)
                    }
                })
            })
        },
    }
}