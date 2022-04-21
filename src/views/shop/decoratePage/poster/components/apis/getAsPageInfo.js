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
export const poster_pushsetting = (res) => {
    let push = res.data.push
    return {
        id: 'poster_pushsetting',
        type: 'poster_pushsetting',
        name: '推送设置',
        isfixed: 1,
        asPageInfo: true, //存入asPageInfo的组件
        params: {
            type: push.type,
            thumb: push.thumb,
            title: push.title,
            content: push.description,
            linkurl: push.url,
            linkurl_name: push.url_name,
            draggable: false,
            resizable: false,
            delable: false
        },
        style: {
            width: '100%',
            top: 0,
            left: 0,
            height: '100%',
        },
        data: []
    }
}
export const poster_reward = (res) => {
    let award = res.data.award
    let reward1 = [],
        reward2 = [];
    if (award.rec_credit_enable == 1) {
        reward1.push('score')
    }
    if (award.rec_cash_enable == 1) {
        reward1.push('cash')
    }
    if (award.rec_coupon_enable == 1) {
        reward1.push('coupon')
    }
    if (award.sub_credit_enable == 1) {
        reward2.push('score')
    }
    if (award.sub_cash_enable == 1) {
        reward2.push('cash')
    }
    if (award.sub_coupon_enable == 1) {
        reward2.push('coupon')
    }
    return {
        id: 'poster_reward',
        type: 'poster_reward',
        name: '奖励设置',
        isfixed: 1,
        asPageInfo: true, //存入asPageInfo的组件
        notemplate: true, //本身无模板的组件
        params: {
            open: award.status,
            recommend: {
                reward: reward1,
                score: {
                    num: award.rec_credit,
                    limit: award.rec_credit_limit
                },
                cash: {
                    num: award.rec_cash,
                    limit: award.rec_cash_limit,
                    type: award.rec_cash_type == 1 ? 'balance' : 'redpackets', //balance余额 redpackets红包
                },
                coupon: {
                    list: award.rec_coupon?[award.rec_coupon]:[],
                    limit: award.rec_coupon_limit
                },
            },
            follower: {
                reward: reward2,
                score: {
                    num: award.sub_credit,
                },
                cash: {
                    type: award.sub_cash_type == 1 ? 'balance' : 'redpackets',
                    num: award.sub_cash,
                },
                coupon: {
                    list: award.sub_coupon?[award.sub_coupon]:[],
                },
            }
        },
        style: {},
        data: []
    }
}