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
import { shallowCompare, deepCopy } from '../assets/jsTools/objectTools.js'
/*
*  用于商品分类创建
 */

export default {
    namespaced: true,
    state: {
        list: [],
        level: '0',// 层级 0一层级，1二层级，2三层级
        item: {
            name: '',
            thumb: '',
            status: '0'
        }
    },
    mutations: {
        // 全部展开/收缩
        setExpandAll(state, isExpand) {
            state.list.forEach((item, index) => {
                state.list[index].expand = isExpand;
                if (state.level == '2' && item.children && item.children.length > 0) {
                    item.children.forEach((childItem, childIndex) => {
                        state.list[index].children[childIndex].expand = isExpand;
                    });
                }
            });
            this.commit('createGoodClassification/refreshList')
        },
        setLevel(state, level) {
            state.level = level
        },
        // 设置单个展开/收缩
        setExpand(state, { isExpand, index, twoIndex }) {
            if (twoIndex || twoIndex === 0) {
                state.list[index].children[twoIndex].expand = isExpand
            } else {
                state.list[index].expand = isExpand
            }
        },
        refreshList(state) {
            state.list = JSON.parse(JSON.stringify(state.list))
        },
        setList(state, list) {
            state.list = list
        },
        // 添加第一层级
        addFirstClassify(state) {
            // console.log('item', state.item, deepCopy(state.item));
            // state.list.unshift(deepCopy(state.item));
            let _classificationItem = {
                name: '',
                thumb: '',
                status: '1',
                id: `cus_${Date.now()}`,
            }
            state.list.unshift(deepCopy(_classificationItem));
        },
    },
    actions: {


    }
};
