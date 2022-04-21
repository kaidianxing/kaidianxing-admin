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
        settings: {
            become_agent: "成为分销商",
            agent_name: "分销商名称",
            head_agent: "总店",
            agent_center: "分销中心",
            agent_commission: "分销佣金",
            commission_order: "分销订单",
            withdraw_detail: "提现明细",
            my_down_line: "我的下线",
            level_description:'等级说明',
            commission_rank:'佣金排名',
            commission: "佣金",
            withdraw: "提现",
            can_withdraw_commission: "可提现佣金",
            count_commission: "累计佣金",
            wait_audit_commission:'待审核佣金',
            wait_pay_commission: "待打款佣金",
            wait_account_commission:'待入账佣金',
            level_name_1: "一级",
            level_name_2: "二级",
            level_name_3: "三级",
            agreement_content: "协议内容",
            agreement_title: "协议名称",
            commission_detail: "佣金明细",
            deduct_withdraw_fee: "扣除提现手续费",
            down_line: "下线",
            invalid_commission: "无效佣金",
            money: "元",
            un_settlement_commission: "未结算佣金",
            wait_receive_commission: "待收货佣金",
            mine:'我的',
        },

    },
    mutations: {
        setModelList(state, list) {
            state.modelList = list;
        },
        setSettings(state, data) {
            state.settings = deepMerge(state.settings, data);
            state.cacheSettings = JSON.parse(JSON.stringify(state.cacheSettings));
        },
    },
    actions: {
        getSettings(ctx) {
            api.commissionApi.otherSettings().then(res => {
                if (res.error == 0) {
                    res = res.settings
                    ctx.commit('setSettings', res);
                }
            })
        },
        editSettings({state}) {
            return new Promise((resolve, reject) => {
                api.commissionApi.editOtherSettings(state.settings).then(res => {
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
