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
import api from '@/api'
import * as utils from '@/assets/helpers'

class Updater {
    getGoodsList() {
        throw new Error('Please implement it in a subclass')
    }
}
class GoodsUpdater extends Updater {
    constructor(props) {
        super(props)
    }
    getParams = (tmp) => {
        let sort = {
            0: {
                key: '',
                by: 'desc'
            },
            1: {
                key: 'sales',
                by: 'desc'
            },
            2: {
                key: 'price',
                by: 'desc'
            },
            3: {
                key: 'price',
                by: 'asc'
            }
        }
        let params = { //获取商品组列表
            label_field: '',
            sort: sort[tmp.params.goodssort].key,
            by: sort[tmp.params.goodssort].by,
        }
        let id = [];
        switch (tmp.params.goodsdata + '') {
            case '0': //手动选择

                tmp.data.forEach(item => {
                    if (item.gid) {
                        id.push(item.gid)
                    }
                })

                params = id.length ? {
                    ids: id,
                    sort: '',
                    by: '',
                    page: 1,
                    pagesize: tmp.data.length
                } : null
                break;
            case '1': //选择分类
                params = tmp.params.cateid ? {
                    ...params,
                    category_id: tmp.params.cateid,
                    page: 1,
                    pagesize: tmp.data.length
                } : null
                break;
            case '2': //选择分组
                params = tmp.params.groupid ? {
                    ...params,
                    group_id: tmp.params.groupid,
                    page: 1,
                    pagesize: tmp.data.length
                } : null
                break;
            case '3': //新品商品
            case 'is_new':
                params = {
                    ...params,
                    is_new: 1,
                    page: 1,
                    pagesize: tmp.data.length
                }
                break;
            case '4': //热卖商品
            case 'is_hot':
                params = {
                    ...params,
                    is_hot: 1,
                    page: 1,
                    pagesize: tmp.data.length
                }
                break;
            case '5': //推荐商品
            case 'is_recommand':
                params = {
                    ...params,
                    is_recommand: 1,
                    page: 1,
                    pagesize: tmp.data.length
                }
                break;
        }
        if (params) {
            params.get_activity = 1
        }
        return params
    }

    getGoodsList = (res) => { //获取商品组
        return new Promise((resolve) => {
            let list = res.data
            if (list && list.length) {
                let params = this.getParams(res);
                if (!params) return
                api.goodsApi.goodsList(params).then(res => {
                    if (res.error == 0) {
                        let list = res.list.filter(item => item).map(item => {
                            let tmp = {
                                thumb: utils.media(item.thumb),
                                price: parseFloat(item.activities?.member_price ? item.activities?.member_price : item.price),
                                productprice: parseFloat(item.original_price),
                                title: item.title,
                                sales: item.sales,
                                gid: item.id,
                                bargain: 0,
                                credit: 0,
                                ctype: 1,
                                stock: item.stock,
                                sub_name: item.sub_name,
                                commission: item.activities?.commission || null,
                                has_option: item.has_option,
                                goodstype: item.type,
                                activities: item?.activities,
                                type: item.type
                            }
                            return tmp;
                        });
                        resolve(list)
                    } else {
                        resolve([])
                    }
                })
            }
        })
    }
}
class CreditGoodsUpdater extends Updater {
    adapterData(item) { // 转换数据
        let { id, thumb, sale, type: act_type, credit_shop_stock } = item
        let result = {
            id: id,
            gid: id,
            thumb,
            act_type,
            sales: +sale,
            stock: credit_shop_stock,
            credit_shop_credit: item.credit_shop_credit,
            credit_shop_price: item.credit_shop_price,
            bargain: 0,
            credit: 0,
            ctype: 0,
            type: act_type
        }
        // 积分商品
        if (item.type == '1') {
            let { coupon_name: title, content: sub_title, coupon_sale_type, shop_coupon_balance, shop_coupon_credit } = item
            result = {
                ...result,
                title,
                sub_title,
                coupon_sale_type,
                shop_coupon_balance,
                shop_coupon_credit
            }

        } else {
            let { title, sub_title, has_option, price, goods_type: type } = item
            result = {
                ...result,
                title,
                sub_title,
                has_option,
                type,
                productprice: price,
            }
            if (has_option == '1') {
                result.credit_shop_credit = item.rules?.min?.credit_shop_credit
                result.credit_shop_price = item.rules?.min?.credit_shop_price
            }
        }
        return result
    }

    getGoodsList = (item) => {
        return new Promise((resolve) => {
            let params = {
                status: "1",
            }

            if (item.params.creditgoodsdata == '0') {
                params.id = item.data.map(v => v.id).join(',')
                params.pagesize = item.data.length
            }
            api.creditShopApi
                .getList(params)
                .then((res) => {
                    if (res.error === 0) {
                        let list = res.list.map(item => this.adapterData(item))
                        resolve(list)
                        console.log(list,'listlist')
                    }
                })
                .catch();
        })
    }
}
class Goods {
    update(item) {
        let updater;
        if (item.params.goodstype == '0') {
            updater = new GoodsUpdater()
        } else if (item.params.goodstype == '1') {
            updater = new CreditGoodsUpdater()
        }
        updater.getGoodsList(item).then(data => {
            item.data = data.map(item => {
                return {
                    ...item,
                    id: item.gid,
                }
            })
        })
    }

}
export default new Goods()