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
/* eslint-disable */
import { shallowCompare, deepCopy } from '../../assets/jsTools/objectTools.js'
import api from '@/api'
export default {
    namespaced: true,
    state: {

    },
    mutations: {

    },
    actions: {

        //获取会员等级列表
        getVipLevels(ctx) {
            api.memberApi.getLevelList().then(res => {
                ctx.commit('goodAddEdit/multiOptions/getLevels', res.list, { root: true });
            });
        },
        // 获取全部会员等级
        getVipLevelList(ctx, data) {
            api.memberApi.getLevelList({is_all: 1}).then(res => {
                if (res.error === 0) {
                    let model = {}, level = {};
                    if (data?.browse?.member_level) {
                        model.browse = data.browse.member_level;
                        level.browse = [];
                    } else {
                        model.browse = [];
                        level.browse = [];
                    }
                    if (data?.buy?.member_level) {
                        model.buy = data.buy.member_level;
                        level.buy = [];
                    } else {
                        model.buy = [];
                        level.buy = [];
                    }
                    res.list.forEach(item => {
                        if (model.browse.length > 0) {
                            if (model.browse.includes(item.id)) {
                                level.browse.push(item);
                            }
                        }
                        if (model.buy.length > 0) {
                            if (model.buy.includes(item.id)) {
                                level.buy.push(item);
                            }
                        }
                    })
                    ctx.commit('goodAddEdit/setLimitLevel', { model, level }, { root: true });
                }
            });
        },
        // 获取会员标签组
        getVipGroup(ctx, data) {
            api.memberApi.getGroupList({is_all: 1}).then(res => {
                if (res.error === 0) {
                    let model = {}, label = {};
                    if (data?.browse?.member_tag) {
                        model.browse = data.browse.member_tag;
                        label.browse = [];
                    } else {
                        model.browse = [];
                        label.browse = [];
                    }
                    if (data?.buy?.member_tag) {
                        model.buy = data.buy.member_tag;
                        label.buy = [];
                    } else {
                        model.buy = [];
                        label.buy = [];
                    }
                    res.list.forEach(item => {
                        if (model.browse.length > 0) {
                            if (model.browse.includes(item.id)) {
                                label.browse.push(item);
                            }
                        }
                        if (model.buy.length > 0) {
                            if (model.buy.includes(item.id)) {
                                label.buy.push(item);
                            }
                        }
                    })
                    ctx.commit('goodAddEdit/setLimitLabel', { model, label }, { root: true });
                }
            });
        }
    },
    getters: {

    },
};