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
import App from './App.vue';
// import './registerServiceWorker';
import router from './router';
import store from './store';
import api from './api/index.js';
import ViewUI from 'view-design';
import iViewPro from '@/libs/iview-pro/iview-pro.min.js';
import VueClipboard from 'vue-clipboard2';
import '@vant/touch-emulator';
import 'view-design/dist/styles/iview.css'
import '@/libs/iview-pro/iview-pro.css';
import '@/assets/css/reset.scss';
import '@/assets/css/theme.css';
import {media} from '@/assets/helpers'; // 图片文件地址
// loading
import Loading from '@/components/loading/index';
// 图标（装修使用）
import '@/assets/font/iconfont.js';
// 图标（后台使用）
import '@/assets/font/iconfont-pc.js';
// 保证组件css层级高于iview层级
import {Lazyload} from 'vant';
import mixins from '@/helpers/mixins.js';
import '@/api/config/settings.js'
import './changeTheme.js'
import * as utils from '@/assets/helpers'
import {$focusError} from '@/helpers/directives.js'
import history from '@/helpers/pageHistory'
// options 为可选参数，无则不传
Vue.use(Lazyload, {
    lazyComponent: true,
    loading: '',
    error: ''
});
//全局自定义组件
let requireComponent = require.context('./components', true, /\/.*\.g\.vue$/);
requireComponent.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName);
    const component = componentConfig.default || componentConfig;
    // 组件注册,组件必须写name
    Vue.component(component.name, component);
});
// svg文件
const svgFile = require.context('./assets/svg', false, /\.svg$/);
const svgRequireAll = requireContent => requireContent.keys().map(requireContent);
svgRequireAll(svgFile);
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$media = media;
Vue.prototype.$utils = utils;
Vue.prototype.$isPC = true;
Vue.prototype.$css = window.cssThemeVar;
Vue.prototype.$focusError=$focusError;
Vue.prototype.$history=history
Vue.prototype.bus = new Vue()
Vue.prototype.process = { env: Object.assign({}, process.env) };
Vue.use(ViewUI, {
    transfer: true
});
Vue.use(iViewPro);

// 复制文本
Vue.use(VueClipboard);
Vue.use(Loading);
/**
 * 全局混入
 */
Vue.mixin(mixins);
new Vue({
    router: router.router,
    store,
    render: h => h(App)
}).$mount('#app');
