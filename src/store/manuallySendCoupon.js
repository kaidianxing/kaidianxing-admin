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

const model = {
    coupon_id: '',
    send_total: '',
    send_type: 'member',
    member_ids: '',
    member_level: '',
    member_group: '',
    commission_level: '', // 分销商等级
    message_type: '1'
};

export default {
    namespaced: true,
    state: {
        model: Object.assign({}, model),
        vipLabel: [], // 用户标签组
        vipLevel: [], // 用户等级
        commissionLevel: []
    },
    mutations: {
        setDisabled(state, val) {
            state.isDisabled = val;
        },
        // 初始化model
        resetModel(state) {
            state.model = JSON.parse(JSON.stringify(model));
        },
        setModel(state, obj) {
            let modelObj = JSON.parse(JSON.stringify(model));
            state.model = Object.assign(modelObj, obj);
        },
        setVipLabel(state, list) {
            state.vipLabel = list || [];
        },
        setVipLevel(state, list) {
            state.vipLevel = list || [];
        },
        setCommissionLevel(state, list) {
            state.commissionLevel = list;
        }
    }
};
