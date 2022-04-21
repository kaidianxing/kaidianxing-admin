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
let afterLocation = item => ({
    data: [{
        validator: (rule, value, callback) => {
            if (item.params.goodsdata == 1&&!item.params.cateid) { //选择分类
                callback(new Error('请添加商品分类')) 
            } else if (item.params.goodsdata == 2&&!item.params.groupid) { //选择分组
                callback(new Error('请添加商品分组'))
            } else if (!item.data.length) {
                callback(new Error('请选择商品'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
})
export default (item) => ({
    afterLocation: afterLocation(item), //定位后的校验
    beforeLocation(data) { //定位前的校验
        if(data.params.componentbg == '2' && !data.params.bgimg) {
            return new Error('请选择背景图片')
        }
        if (data.params.goodsdata == 1) { //选择分类
            if (!data.params.cateid) {
                return new Error('请添加商品分类')
            }
        } else if (data.params.goodsdata == 2) { //选择分组
            if (!data.params.groupid) {
                return new Error('请添加商品分组')
            }
        } else if (data) {
            if (!data.data.length) {
                return new Error('请添加商品')
            }
        }
    },

})