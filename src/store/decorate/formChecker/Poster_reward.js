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
let afterLocation = (item) => ({
    recommender: [{
        validator: (rule, value, callback) => {
            if (item.params.open == 0) {
                callback();
                return
            }
            if (!item.params.recommend.reward.length) {
                callback(new Error('请选择推荐人获得'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    recommenderScore: [{
        validator: (rule, value, callback) => {
            if (item.params.open == 0) {
                callback();
                return
            }
            if (item.params.recommend.score.num <= 0) {
                callback(new Error('请填写推荐人获得积分'));
            } else if (item.params.recommend.score.limit !== '' && (item.params.recommend.score.num * 1) > (item.params.recommend.score.limit * 1)) {
                callback(new Error('推荐人奖励积分超限'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    recommenderCash: [{
        validator: (rule, value, callback) => {
            if (item.params.open == 0) {
                callback();
                return
            }
            if (item.params.recommend.cash.num <= 0) {
                callback(new Error('请选择推荐人获得'));
            } else if (item.params.recommend.cash.limit !== '' && (item.params.recommend.cash.num * 1) > (item.params.recommend.cash.limit * 1)) {
                callback(new Error('推荐人奖励现金超限'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    recommenderCoupon: [{
        validator: (rule, value, callback) => {
            if (item.params.open == 0) {
                callback();
                return
            }
            if (!item.params.recommend.coupon.list.length) {
                callback(new Error('请选择推荐人获得优惠券'));
            }else if (item.params.recommend.coupon.list.length) {
                let val=item.params.recommend.coupon.list[0];
                if(val.stock_type==0){
                    callback();
                }else if(item.params.recommend.coupon.limit > val.stock){
                    callback(new Error('推荐人优惠券大于库存'));
                }
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    follower: [{
        validator: (rule, value, callback) => {
            if (item.params.open == 0) {
                callback();
                return
            }
            if (!item.params.follower.reward.length) {
                callback(new Error('请选择关注人获得'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    followerScore: [{
        validator: (rule, value, callback) => {
            if (item.params.open == 0) {
                callback();
                return
            }
            if (item.params.follower.score.num <= 0) {
                callback(new Error('请填写关注人获得积分'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    followerCash: [{
        validator: (rule, value, callback) => {
            if (item.params.open == 0) {
                callback();
                return
            }
            if (item.params.follower.cash.num <= 0) {
                callback(new Error('请填写关注人获得现金'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    followerCoupon: [{
        validator: (rule, value, callback) => {
            if (item.params.open == 0) {
                callback();
                return
            }
            if (!item.params.follower.coupon.list.length) {
                callback(new Error('请选择关注人获得优惠券'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
})

function checkRecommend(data) {

    if (data.reward.indexOf('score') > -1) {
        if (!data.score.num) {
            return new Error('请填写推荐人奖励积分')
        } else if (data.score.limit !== '' && (data.score.num * 1) > (data.score.limit * 1)) {
            return new Error('推荐人奖励积分超限');
        }
    }
    if (data.reward.indexOf('cash') > -1) {
        if (!data.cash.num) {
            return new Error('请填写推荐人奖励现金')
        } else if (data.cash.limit !== '' && (data.cash.num * 1) > (data.cash.limit * 1)) {
            return new Error('推荐人奖励现金超限');
        }
    }
    if (data.reward.indexOf('coupon') > -1) {
        if (!data.coupon.list.length) {
            return new Error('请选择推荐人奖励优惠券')
        }else if(data.coupon.list.length){
            let val=data.coupon.list[0]
            if(val.stock_type==1&&data.coupon.limit>val.stock){
                return new Error('推荐人优惠券大于库存')
            }
        }
        
    }
}

function checkFollower(data) {
    if (data.reward.indexOf('score') > -1) {
        if (!data.score.num) {
            return new Error('请填写关注人奖励积分')
        }
    }
    if (data.reward.indexOf('cash') > -1) {
        if (!data.cash.num) {
            return new Error('请填写关注人奖励现金')
        }
    }
    if (data.reward.indexOf('coupon') > -1) {
        if (!data.coupon.list.length) {
            return new Error('请选择关注人奖励优惠券')
        }
    }
}
export default (item) => ({
    afterLocation: afterLocation(item),
    beforeLocation(data) {
        if (data.params.open == 0) {
            return
        }
        if (data.params.recommend.reward.length == 0 || data.params.follower.reward.length == 0) {
            return new Error('请完善奖励设置')
        }

        let res = checkRecommend(data.params.recommend)
        if (res) {
            return res
        }
        res = checkFollower(data.params.follower)
        if (res) {
            return res
        }
    }
})