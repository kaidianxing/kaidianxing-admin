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
export default ()=>({
    beforeLocation(data) {
        let err = false;
        if (data.params.datatype == '0') {
            let start = (data.params.starttime + '').trim();
            let end = (data.params.endtime + '').trim();
            if (!(/^\d+$/.test(start) && /^\d+$/.test(end))) {
                return new Error('请填写随机时间区间')
            }
        } else if (data.params.datatype == '2') {
            for (let item of data.data) {
                if (!item.imgurl) {
                    err = new Error('请选择图片')
                } else if (!item.nickname) {
                    err = new Error('请填写昵称')
                } else if (!item.time) {
                    err = new Error('请填写下单时间')
                }

                if (err) {
                    return err
                }
            }
        }


    }
})