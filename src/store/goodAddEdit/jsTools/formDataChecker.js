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
import store from '@/store';
/*
* key 校验的属性名
* val 值
* modelType 商品类型
* */
export function trackError(key, val) {
    let modelType = store.state.goodAddEdit.model.type
    let tmp = (val + "").trim();
    if (key == "price") {
        //必填检测
        if (!(tmp*1) && parseFloat(tmp) != 0) {
            return "请输入";
        }
    }
    if (
        key == "price" ||
        key == "original_price" ||
        key == "cost_price"
    ) {
        //售卖价，划线价，成本价，小数或整数
        if (tmp === "") {
            //非必填
            return;
        } else if (/^\d{1,7}(\.\d{1,2})?$/.test(tmp)) {
            return;
        } else {
            return "支持小数点前7位小数点后2位，或整数";
        }
    } else if (key == "stock" && modelType != '2') {
        if (/^\d{1,9}$/.test(tmp)) {
            return;
        } else {
            return  "支持最多9位整数";
        }
    } else if(key == 'virtual_account_id' && modelType == '2') {
        if(!tmp) {
            return  "卡密库必选";
        }
    }
}
export function specsError(specs){
    let error=null;
    let item = null;
    let tmp = '';
    for (let i = 0; i < specs.length; i++) {
        item = specs[i];
        if(!item.title.trim()){
            if (!error) {
                error = {
                    [item.id]:'请填写规格名称'
                }
            }else{
                error[item.id]='请填写规格名称'
            }
        }
        for (let k in item.items) {
            tmp = item.items[k];
            if(!tmp.title.trim()){
                if (!error) {
                    error = {
                        [tmp.id]:'请填写规格名称'
                    }
                }else{
                    error[tmp.id]='请填写规格名称'
                }
            }
        }
    }
    return error
}
