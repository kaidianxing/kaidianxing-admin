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
import * as utils from '@/assets/helpers/index.js';
import store from '@/store';

export function previewUrl(path,previewId){
    let previewUrl =  store.state.setting.wap_url
     
    switch (path) {
        case 'goods-detail':
            previewUrl =
                previewUrl +
                '/kdxGoods/detail/index?goods_id=' +
                store.state.setting.randomGoodId
            break
        case 'vip-center':
            previewUrl = previewUrl + '/kdxMember/index/index'
            break
        case 'distribution':
            previewUrl = previewUrl + '/kdxCommission/index/index'
            break
    }
    
    return utils.addQueryParams(
        previewUrl, {
            previewId: previewId //模板id
        }
    )
}
export function clickTmp(pageId,item){
    if (item) {
        store.commit('decorate/changeFocus',{
            item,
            pageId: pageId
        })
    } else {
        store.commit('decorate/changeFocus',{
            item: { ...store.state.decorate.pageInfo,
                params: {},
                style: {},
                data: []
            },
            pageId: pageId
        })
    }
}
export const searchComponent=(keyword,list)=>{
    let obj={}
    list.forEach(item=>{
        obj[item._comIndex_]=false;
        if(!keyword){
            obj[item._comIndex_]=true
        }else if(item.name.indexOf(keyword)>-1){
            obj[item._comIndex_]=true
        } 
    })
    return obj
}