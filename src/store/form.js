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

import {
    deepMerge,
    deepCopy
} from '@/assets/jsTools/objectTools'
import * as allItems from './form/allItems.js'
export default {
    namespaced: true,
    modules: {

    },
    state: {
        model: {
            title: '',
            is_submit_number: '0',
            is_notification:'1'
        },
        formSetting: {},
        formItems: [],
        errorInfo: null,
        validator: {},
        dpr: 1, //设备像素比
    },
    mutations: {
        initForm(state) {
            state.formItems = [];
            state.model.title = '';
        },
        setFormItems(state, list) {
            state.formItems = list
        },
        delFormItem(state,index){
            state.formItems.splice(index,1)
        },
        setFormSetting(state,{
            pageId,
            data
        }){
            state.formSetting = deepMerge(state.formSetting, data);
            this.commit('form/changeFocus', {
                pageId,
                item: state.formSetting
            })
        },
        changeFocus() { //更改当前操作的元素

        },
        setTitle(state, title) {
            state.model.title = title;
        }
    },
    actions: {
        delModal(){},
        addModal({
            state,
            commit
        }, item) { //添加元素
            let tmp=deepCopy(allItems[item.type])
            state.formItems.push(tmp)
            commit('setFormItems',state.formItems)
        },
    }
};
