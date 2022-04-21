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
import Vue from 'vue';
import Loading from './index.vue'

const Mask = Vue.extend(Loading);
const loadingDirective = {};

loadingDirective.install = Vue => {

    const toggleLoading = (el, binding) => {
        if (binding.value) {
            el.instance.visible = true;
            el.instance.title = binding.title || '正在加载...'
            insertDom(el, el, binding);
        } else {
            el.instance.visible = false;
        }
    }
    const insertDom = (parent, el) => {
        el.instance.visible = true;
        parent.appendChild(el.mask);
    }

    Vue.directive('loading', {
        bind: function(el, binding) {
            const mask = new Mask({
                el: document.createElement('div'),
                data: {
                    fullscreen: !!binding.modifiers.fullscreen
                }
            })
            el.instance = mask;
            el.mask = mask.$el;
            if(typeof binding.value == 'boolean') {
                binding.value && toggleLoading(el, binding)
            } else {
                binding.title = binding.value.title 
                binding.value = binding.value.loading
                binding.value && toggleLoading(el, binding)
            }
        },
        update: function(el, binding) {
            if(typeof binding.value !== 'boolean') {
                binding.title = binding.value.title
                binding.value = binding.value.loading
            }

                toggleLoading(el, binding);
        },
        unbind: function(el) {
            el.instance && el.instance.$destroy()
        }
    })
}

export default loadingDirective;
