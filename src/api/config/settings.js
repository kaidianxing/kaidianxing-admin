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

var config = {
	base_url: 'http://free.shopstar.cn/api',
	attachment_url: 'http://free.shopstar.cn/data/attachment/',
	public_url: 'http://free.shopstar.cn/',
	wap_dist_url: 'http://free.shopstar.cn/static/dist/shop/renren_wap/',
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
