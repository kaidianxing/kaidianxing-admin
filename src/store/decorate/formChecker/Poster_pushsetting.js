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

let afterLocation = (item) => ({
    type: [{
        required: true,
        message: '请选择推送方式',
        trigger: 'blur'
    }, ],
    thumb: [{
        validator: (rule, value, callback) => {
            if (!item.params.thumb&&item.params.type==1) {
                callback(new Error('请选择推送封面'));
            } else {
                callback();
            }
        },
        trigger: 'blur'
    }],
    title: [{
        required: true,
        message: '请输入推送标题',
        trigger: 'blur'
    }],
    content: [{
        required: true,
        message: '请输入推送描述',
        trigger: 'blur'
    }],
    linkurl: [{
        required: true,
        message: '请选择推送链接',
        trigger: 'blur'
    }],
})
export default (item) => ({
    afterLocation: afterLocation(item),
    beforeLocation(data) {
        let flag = !data.params.title || !data.params.content
        if(data.params.type =='1'){
            flag = flag && !data.params.linkurl
        }
        
        if(flag){
            return new Error('请完善推送设置')
        }
       
        if(!data.params.thumb&&data.params.type==1){
            return new Error('请选择推送封面')
        }
    }
})