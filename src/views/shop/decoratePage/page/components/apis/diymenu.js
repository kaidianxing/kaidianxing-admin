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
/* eslint-disable */
function trim(data) {
    if (typeof data == 'object') {
        for (let k in data) {
            if (typeof data[k] == 'string') {
                data[k] = data[k].trim();
            } else if (typeof data[k] == 'object') {
                trim(data[k])
            }

        }
    }
    return data;
}

import { diymenu } from '@/store/decorate/allItems'
import { deepMerge,deepCopy } from '@/assets/jsTools/objectTools'
export function getter({
    pageId,
    type,//操作类型edit：编辑 ；add:添加
    tplId,//模板id
}) {
    if (type == 'edit') { 
        // let params = {}
        // type && (params.type = type)
        // tplId && (params.id = tplId)
        this.$api.decorateApi.getNewDiyMenuDetail({ id: tplId }).then(res => {
            if (res.error == '0') {
                let {name,content} = res.data;
                let tmp=deepCopy(diymenu);
                tmp.items = [];
                tmp.name = name 
                res = deepMerge(tmp, JSON.parse(content));
                res.style.bordertopcolor=res.style.bordertopcolor||'#eeeeee'
                res.id = 'diymenu';
                res.type = 'diymenu';
                res.isbottom = 3
                res = trim(res);
                this.$nextTick(() => {
                    Object.assign(this.pageList[0], res);///合并值
                    this.pageInfo.title = res.name;
                    this.refreshCurrentModal();
                    this.refreshPageInfo()
                })
            }
        })
    }

}
export function setter({
    pageId,
    type,//操作类型edit：编辑 ；add:添加
    tplId,//模板id
    action,
    previewImage
}) {
    if (type == 'edit') {
        let {name,...info} = this.currentModal
        let params = {
            id: tplId,
            name,
            content: JSON.stringify(info),
            thumb:previewImage,
        }

        if (action === 'publish') {
            params.status = '1'
        }
        
        return this.$api.decorateApi.updateNewDiyMenu(params)
    } else {
        let {name,app_type,...info} = this.currentModal
        let params = {
            id: undefined,
            name,
            type:app_type,
            content: JSON.stringify(info),
            thumb: previewImage,
        }
        if (action === 'publish') {
            params.status = '1'
        }
        return this.$api.decorateApi.createNewDiyMenu(params)
    }


}