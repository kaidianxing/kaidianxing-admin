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
// 该类专门用于处理商品会员折扣
//分别在store/goodAddEdit 、store/goodAddEdit/multiOptions、views/goods/add/member/index.vue中引入
import store from '@/store'
const model = () => ({
    id: '',
    level_id: '',//对应的会员等级id
    type: 2,//1折扣 2价格
    discount: '0.00',//折扣金额 type为1时 0.01-0.99 2时 最大9999999.99
})
class Discount {
    $store = null;
    constructor() {
        this.clear()
    }
    /**
     *
     * @param {获取this.$store指针} $store
     */
    setStore($store) {
        this.$store = $store
    }
    clear() {
        this.member_level_discount = {//接口获取的数据缓存
            2: {
                //[level_id]: model()
            },//指定会员等级缓存

            3: {
                // [option_id]:{
                //     [level_id]: model()
                // }
            },//多规格会员等级缓存
        };
        this.vipLevels = [//会员等级列表
            // {
            // level_name: "等级名字",
            // level_id: 0
            // }
        ];
        this.options = [];//商品规格列表multiOptions=>state.options
        this.discountType = -1;//指定会员等级，3多规格折扣

        if (this.$store) {
            this.$store.commit('goodAddEdit/multiOptions/setLevelDiscount', [])
            this.$store.commit('goodAddEdit/multiOptions/setMultiDiscount', [])
        }
    }
    setCache() {//缓存折扣索引，防止会员等级列表变化后，商品多规格对应不上
        if (this.discountType && this.vipLevels.length) {
            let getCache = this.member_level_discount[this.discountType];
            let tmp = null;
            let list = [];
            if (this.discountType == 3) {//3多规格折扣
                if (this.options.length) {
                    this.options.forEach((item, index) => {
                        this.vipLevels.forEach((val, key) => {
                            let copy = model();
                            tmp = list?.[index]?.[key] || copy
                            tmp.level_id = val.level_id
                            tmp.option_id = item.tmpid
                            if (getCache[item.tmpid]) {
                                getCache[item.tmpid][val.level_id] = Object.assign(tmp, getCache[item.tmpid][val.level_id]);
                            } else {
                                getCache[item.tmpid] = { [val.level_id]: tmp };
                            }
                            if (list[index]) {
                                list[index][key] = getCache[item.tmpid][val.level_id]
                            } else {
                                list[index] = [
                                    getCache[item.tmpid][val.level_id]
                                ]
                            }
                        })

                    })
                }
            } else if (this.discountType == 2) {//指定会员等级
                this.vipLevels.forEach((item, index) => {
                    let copy = model();
                    tmp = list[index] || copy
                    copy.level_id = item.level_id
                    getCache[item.level_id] = Object.assign(tmp, getCache[item.level_id]);
                    list[index] = getCache[item.level_id]

                })

            }
            if (this.$store) {
                if (this.discountType == 2) {
                    this.$store.commit('goodAddEdit/multiOptions/setLevelDiscount', list)
                } else if (this.discountType == 3) {
                    this.$store.commit('goodAddEdit/multiOptions/setMultiDiscount', list)
                }
            }
        }
    }
    /**
        *
        * @param {2指定会员等级，3多规格折扣;} type
        * @param {折扣金额 : data.member_level_discount} list
        */
    setDiscountType(type) {
        if (this.discountType == -1 && this.member_level_discount['-1']) {
            this.member_level_discount[type] = this.member_level_discount['-1']
        }
        if (this.discountType != type) {
            this.discountType = type;
            this.setCache();
        }

    }
    setMemLevelDiscount(data, type) {//获取接口返回的商品会员折扣
        let tmp = JSON.parse(JSON.stringify(data));
        // let item = null
        // if (type == 3) {
        //     for (let k in tmp) {
        //         for (let n in tmp[k]) {
        //             item = tmp[k][n]
        //             if (item.type == 1) {
        //                 item.discount = item.discount
        //             }
        //         }
        //     }
        // } else if (type == 2) {
        //     for (let k in tmp) {
        //         item = tmp[k]
        //         if (item.type == 1) {
        //             item.discount = item.discount
        //         }
        //     }
        // }
        this.member_level_discount[type] = tmp
        this.setCache();
    }
    setVipLevels(vipLevels) {//获取vipLevels
        if (this.vipLevels != vipLevels) {
            this.vipLevels = vipLevels;
            this.setCache();
        }

    };
    setOptions(options) {//options
        if (this.options != options) {
            this.options = options?.map((item, index) => {
                item.tmpid = '_tmpID_' + index
                if (item.id) {
                    item.tmpid = item.id
                }
                return item;
            });
            this.setCache();
        }

    };

}
const obj = new Discount();
export default obj;
