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
        template_list: [],
        settings: {
            seller: {// 卖家通知
                apply: {// 申请成为分销商通知
                    template: {// 模板消息设置
                        state: '',// 状态 0关闭 1开启
                        id: '',// 模板id
                        member_id: [],// 通知人 [1,2,3]
                        member_info:[]
                    }
                },
                withdraw: {// 提现通知
                    template: {
                        state: '',// 状态
                        id: '',// 模板id
                        member_id: [],// 通知人id
                        member_info:[]
                    }
                },
            },
            buyer:{//买家通知
                agent:{//分销通知
                    become:{//成为分销商通知
                        template: {
                            state: '',
                            id: '', 
                        }
                    },
                    add_child:{//新增下线通知
                        template: {
                            state: '',
                            id: '', 
                            level:'',//通知级别 1一级 2 一级+二级 3 全部
                        }
                    },
                },
                child:{//下级通知
                    pay:{//下级付款通知
                        template: {
                            state: '',
                            id: '', 
                            level:''
                        }
                    },
                    receive:{//下级确认收货通知
                        template: {//模板消息
                            state: '',
                            id: '', 
                            level:''
                        }
                    },
                },
                withdraw:{//提现通知
                    apply:{//提现申请通知
                        template: {
                            state: '',
                            id: '',
                        }
                    },
                    finish:{//提现完成通知
                        template: {
                            state: '',
                            id: '',
                        }
                    },
                },
                commission:{//佣金通知
                    pay:{//佣金打款通知
                        template: {
                            state: '',
                            id: '',
                        }
                    },
                    upgrade:{//分销商升级通知
                        template: {
                            state: '',
                            id: '',
                        }
                    },
                },
            }
        },
        vipLevels: [{
            label: '一级',
            id: '1'
        }, {
            label: '二级',
            id: '2'
        }, {
            label: '三级',
            id: '3'
        }]
    },
    getters: {
        applyMemberInfo: state => state.settings.seller.apply.template.member_info || [],
        withdrawMemberInfo: state => state.settings.seller.withdraw.template.member_info || [],
    },
    mutations: {
        setTmpList(state, list) {
            state.template_list = list;
        },
        setSettings(state, data) {
            state.settings = deepMerge(state.settings, data);
        },
        changeMemberInfo(state, data) {
            state.settings.seller[data.type].template.member_info = [...data.data]
        },
    },
    actions: {
        getSettings(ctx) {
            api.commissionApi.getNoticeSettings({}).then(res => {
                if (res.error == 0) {
                    if (res.settings.seller.apply.template.member_id === '[]') res.settings.seller.apply.template.member_id = []
                    if (res.settings.seller.withdraw.template.member_id === '[]') res.settings.seller.withdraw.template.member_id = []
                    ctx.commit('setTmpList', res.template_list);
                    ctx.commit('setSettings', res.settings);
                }
            })
        },
        editSettings({ dispatch, state }) {
            return new Promise(async (resolve, reject) => {
                await dispatch('formatSettings')
                api.commissionApi.editNoticeSettings(state.settings).then(res => {
                    if (res.error == 0) {
                        resolve(res);
                    } else {
                        resolve(res);
                    }
                }).catch(err => {
                    reject(err);
                })
            })
        },
        formatSettings({ state }) {
            return new Promise((resolve) => {
                // 卖家通知 申请成为分销商
                if (state.settings.seller.apply.template.state === '0') {
                    state.settings.seller.apply.template.member_id = []
                }
                // 卖家通知 分销商提现
                if (state.settings.seller.withdraw.template.state === '0') {
                    state.settings.seller.withdraw.template.member_id = []
                }
                delete state.settings.seller.withdraw.template.member_info
                delete state.settings.seller.apply.template.member_info
                resolve()
            })
        },
    }
};
