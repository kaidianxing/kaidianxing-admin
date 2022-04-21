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
import * as utils from '@/assets/helpers'
let afterLocation = item => ({
    name: [{
        required: true,
        message: '请输入页面名称',
        trigger: 'blur'
    }, ],
    keywords: [{
        required: true,
        message: '请输入关键词',
        trigger: 'blur'
    }, ],
    title: [{
        required: true,
        message: '请输入页面标题',
        trigger: 'blur'
    }],
    expire_start_time: [{
        validator: (rule, value, callback) => {
            if (!item.params ?.expire_start_time || !item.params ?.expire_end_time) {
                callback(new Error('请输入有效期'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    expire_time: [{
        validator: (rule, value, callback) => {
            if (!item.params ?.expire_time && item.params ?.expire_time !== 0) {
                callback(new Error('请输入有效期'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    limitlevel:[{
        validator: (rule, value, callback) => {
            if (item.params.limitlevel==1&&!item.params.browsepermlevels.length) {
                callback(new Error('请选择会员等级'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    limitlabel:[{
        validator: (rule, value, callback) => {
            if (item.params.limitlabel==1&&!item.params.browsepermlabels.length) {
                callback(new Error('请选择会员标签'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }]
})
export default (item, $route) => ({
    afterLocation: afterLocation(item),
    beforeLocation(data) {
        if (data) {
            if ($route.params.page === 'goods-detail') {
                if (!data.name) {
                    return new Error('请完善页面设置')
                }
            } else {
                if (!data.name || !data.title) {
                    return new Error('请完善页面设置')
                }
            }
        }
        if (utils.samePath($route.path, '/decorate/poster/followposter')) { //海报装修
            if (!data.keywords || !data.params.expire_end_time || !data.params.expire_start_time || !data.params.expire_time) {
                return new Error('请完善海报设置')
            }
        } else if (utils.samePath($route.path, '/decorate/poster/:page')) { //海报装修
            if (!data.title) {
                return new Error('请完善海报设置')
            }
        } else if($route.path=='/decorate/custom'){
            if(item.params.limitlabel==1&&!item.params.browsepermlabels.length){
                return new Error('请选择会员标签')
            }else if(item.params.limitlevel==1&&!item.params.browsepermlevels.length){
                return new Error('请选择会员等级')
            }
        }
    }
})
