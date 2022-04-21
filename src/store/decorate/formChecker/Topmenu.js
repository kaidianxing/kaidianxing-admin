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

let afterLocation = item=>({
    data: [{
        validator: (rule, value, callback) => {
            if (!item.data.length) {
                callback(new Error('请添加选项'));
            } else {
                callback();
            }
        }
    }],
})
export default item => ({
    afterLocation:afterLocation(item), //定位后的校验
    beforeLocation(data) { //定位前的校验
        if (data) {
            if (!data.data.length) {
                return new Error('请添加选项')
            } else if(data.data.some(v=>!v.linkurl)) {
                return new Error('请选择页面')
            }
        }
    },
    
})