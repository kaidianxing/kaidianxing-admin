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
//
// var config = {//测试站
//     "base_url": "https://free-shopstar.v5bsklk.getpkg.cn/api",
//     "attachment_url": "https://free-shopstar.v5bsklk.getpkg.cn/data/attachment/",
//     "public_url": "https://free-shopstar.v5bsklk.getpkg.cn/",
//     "wap_dist_url": "https://free-shopstar.v5bsklk.getpkg.cn/static/dist/shop/kdx_wap/",
//     "route": "history"
// }
// var config = { //lkx
//     "base_url": "http://likexin.shopstar.cn/api",
//     "attachment_url": "http://likexin.shopstar.cn/data/attachment/",
//     "public_url": "http://likexin.shopstar.cn/",
//     "wap_dist_url": "http://likexin.shopstar.cn/static/dist/shop/kdx_wap/",
//     "route": "history"
// }
var config = {
	base_url: 'http://yuning-free.kdxdev.com/api',
	attachment_url: 'http://yuning-free.kdxdev.com/data/attachment/',
	public_url: 'http://yuning-free.kdxdev.com/',
	wap_dist_url: 'http://yuning-free.kdxdev.com/static/dist/shop/kdx_wap/',
	route: 'history',
};
try {
	if (window) {
		window.config = window.config
			? Object.assign(config, window.config)
			: config;
		config = window.config;
	}
} catch (e) {
	console.log(e);
}

try {
	exports.config = config;
} catch (e) {
	console.log(e);
}
