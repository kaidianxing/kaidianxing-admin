/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div>
        <Form ref="form" :model="model" :label-width="120" :rules="rule"  @submit.native.prevent>
            <kdx-form-title>文章编辑</kdx-form-title>
            <FormItem label="文章头图：" prop="top_thumb_type">
                <RadioGroup v-model="model.top_thumb_type">
                    <Radio label="0">单图</Radio>
                    <Radio label="1">轮播</Radio>
                </RadioGroup>
                <div class="nest-box nest-box-form">
                    <FormItem v-if="model.top_thumb_type == 0" key="top_thumb" prop="top_thumb">
                        <kdx-image-video
                            type="image"
                            :current="model.top_thumb"
                            @on-change="changeThumb" >
                        </kdx-image-video>
                        <kdx-hint-text>用于文章详情页顶部展示的图片，如不添加则不展示</kdx-hint-text>
                    </FormItem>
                    <FormItem v-if="model.top_thumb_type == 1" key="top_thumb_all" prop="top_thumb_all">
                        <kdx-image-video
                            type="image"
                            :limit="5"
                            :multiple="true"
                            :current-list="model.top_thumb_all"
                            is-drag
                            @on-change="changeThumbAll" >
                        </kdx-image-video>
                        <kdx-hint-text>轮播图可以拖拽图片调整顺序，最多上传5张</kdx-hint-text>
                    </FormItem>
                </div>
            </FormItem>
            <FormItem label="文章详情：" prop="content_origin">
                <div class="editor">
                    <editor ref="editor" v-model="model.content_origin" :showVideoPoster="true" @change="handleChange" :plugins="plugins" :height="482"></editor>
                    <div class="btn-group">
                        <Button class="goods-btn default-primary" @click="chooseGoods">插入商品</Button>
                        <Button class="default-primary" @click="chooseCoupon">插入优惠券</Button>
                    </div>
                </div>
            </FormItem>
        </Form>
        <!--商品选择器-->
        <goods-selector 
            v-model="goodsSelector.value"
            :multiple="true" 
            :limit="5"
            :current-list="goodsSelector.data"
            :show_activity="1"
            @on-change="changeGoodList" 
            @on-cancel="goodsClose">
        </goods-selector>
        <!--优惠券选择器-->
        <coupon-selector
            v-model="couponSelector.value"
            :multiple="true"
            :currentList="couponSelector.data"
            @on-change="changeCouponList"
            @on-cancel="couponClose">
        </coupon-selector>
    </div>
</template>

<script>
import Editor from "@/components/Editor";
import goodsSelector from "@/components/selector/GoodsSelector";
import CouponSelector from "@/components/selector/CouponSelector";
import { formatDate } from '../../../../../assets/util';
export default {
    components: { 
        Editor,
        goodsSelector,
        CouponSelector,
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        value: {
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {
            plugins: 'lists image media table wordcount link preview paste quickbars noneditable',
            model: {
                top_thumb_type: "0",
                top_thumb: "",
                top_thumb_all: [],
                content: [],
                content_origin: "",
                goods_ids: [],
                coupon_ids: [],
            },
            rule: {
                content_origin: [{ required: true, message: "文章详情必填" }],
            },
            goodsSelector: {
                value: false,
                data: []
            },
            couponSelector: {
                value: false,
                data: []
            }
        };
    },
    watch: {
        value: {
            handler(newValue) {
                this.model = newValue
            },
            immediate: true,
            deep: true,
        },
        model: {
            handler(newValue) {
                this.$emit('input', newValue);
            },
            deep: true
        },
    },
    computed: {
        noManagePerm(){
            return !this.$getPermMap('article.group.manage')
        }
    },
    filters: {
        formatPrice(value) {
            return parseFloat(value)
        },
    },
    methods: {
        // 文章头图
        changeThumb(path) {
            this.model.top_thumb = path;
        },
        changeThumbAll(path) {
            this.model.top_thumb_all = path;
        },
        // 富文本框删除商品,优惠券
        handleChange() {
            // 商品列表
            let list = ["goods", "coupon"];
            list.forEach((type) => {
                let reg = new RegExp(`<!-- article-item-${type}.*? -->`)
                let itemList = this.model.content_origin.split(reg).filter((item) => {
                    return item.indexOf(`<!-- ${type} -->`) !== -1
                });
                this.model[`${type}_ids`] = itemList.map((item) => {
                    let startStr = `data-${type}-id="`;
                    return item.substring(item.indexOf(startStr) + startStr.length, item.indexOf(`" data-${type}-id-end`));
                })
                this[`${type}Selector`].data = this[`${type}Selector`].data.filter((item) => {
                    let res = false;
                    this.model[`${type}_ids`].forEach((id) => {
                        if(id === item.id) {
                            res = true
                        }
                    })
                    return res
                })
                this.model[`${type}_ids`].forEach((id) => {
                    let res = true;
                    this[`${type}Selector`].data.forEach((item) => {
                        if(id === item.id) {
                            res = false
                        }
                    })
                    if(res) {
                        this[`${type}Selector`].data.push({
                            id,
                        })
                    }
                })
            })
        },
        // 打开商品选择器
        chooseGoods() {
            this.goodsSelector.value = true;
        },
        // 关闭商品选择器
        goodsClose() {
            this.goodsSelector.value = false;
        },
        // 选择商品
        changeGoodList(row) {
            this.changeItem("goods", row)
        },
        // 打开优惠券选择器
        chooseCoupon() {
            this.couponSelector.value = true;
        },
        // 关闭优惠券选择器
        couponClose() {
            this.couponSelector.value = false;
        },
        // 选择优惠券
        changeCouponList(row) {
            this.changeItem("coupon", row)
        },
        // 更改商品优惠券
        changeItem(type, row) {
            this[`${type}Selector`].data = [...row];
            // 删除列表
            let removeList = this.model[`${type}_ids`].filter((id) => {
                let res = true;
                row.forEach((item) => {
                    if(id === item.id) {
                        res = false
                    }
                })
                return res
            })
            // 新增列表
            let addList = row.filter((item) => {
                let res = true;
                this.model[`${type}_ids`].forEach((id) => {
                    if(id === item.id) {
                        res = false
                    }
                })
                return res
            })
            // 删除
            removeList.forEach((id) => {
                let str = `<!-- article-item-${type}${id} -->`;
                let startStr = `<div class='mceNonEditable'>`;
                let start = this.model.content_origin.indexOf(str);
                let end = this.model.content_origin.indexOf(str, start + str.length);
                this.model.content_origin = this.model.content_origin.substring(0, start - startStr.length) + this.model.content_origin.substring(end + str.length + 6)
            })
            // 插入
            addList.forEach((item) => {
                this.insertItem(type, item)
            })
            this.model[`${type}_ids`] = this[`${type}Selector`].data.map((item) => item.id);
            this[`${type}Close`]();
        },
        // 插入模板
        insertItem(type, item) {
            let insertHtml = "";
            if(type === "coupon") {
                insertHtml = 
                `<div class='mceNonEditable'>
                    <!-- article-item-coupon${item.id} -->
                    <!-- coupon -->
                    <div class="article-coupon" data-coupon-id="${item.id}" data-coupon-id-end>
                        <img class="coupon-bg" src="${this.$utils.staticImg('article/coupon-bg.png')}" alt="" />
                        <div class="left">
                            ${ item.is_free == '0' ? ('<div class="coupon-price-icon"><img class="img" src="' + this.$utils.staticImg('coupon/coupon-price-icon.png') + '" alt="" /><div>付费券</div></div>') : '' }
                            <div class="box">
                                <div class="price">
                                    ${item.coupon_sale_type === '1' ? '<span class="rmb">¥</span>' : ''}
                                    <span class="num">${ item.discount_price | this.formatPrice }</span>
                                    ${item.coupon_sale_type === '2' ? '<span class="discount">折</span>' : ''}
                                </div>
                                <div class="rule">
                                    ${ item.enough != '0.00' ? ('满￥' + parseFloat(item.enough) + '可用') : '无门槛' }
                                </div>
                            </div>
                            <div class="coupon-name">${ item.coupon_name }</div>
                        </div>
                        <div class="right"> 立即领取</div>
                    </div>
                    <!-- article-item-coupon${item.id} -->
                </div>
                <br>`;
            }else {
                insertHtml = 
                `<div class='mceNonEditable'>
                    <!-- article-item-goods${item.id} -->
                    <!-- goods -->
                    <div class="article-goods" data-goods-id="${item.id}" data-goods-id-end>
                        <img class="goods-thumb" src="${this.$media(item.thumb)}" />
                        <div class="goods-r">
                            <div class="goods-title">${item.title}</div>
                            <div class="goods-b">
                                <div class="price">${this.goodsPrice(item)}</div>
                                <div class="goods-btn">立即购买</div>
                            </div>
                        </div>
                    </div>
                    <!-- article-item-goods${item.id} -->
                </div>
                <br>`;
            }
            this.$refs.editor.insertHtml(insertHtml)
        },
        // 商品价格
        goodsPrice(data) {
            let res = `￥${data.price}`;
            if(data.has_option === "1") {
                res = `￥${data.min_price} ~ ￥${data.max_price}`
            }
            return res
        },
        // 优惠券角标
        couponTag(data) {
            let res = "店铺优惠券"
            if(this.$store.state.config.shop_type == 20) {
                if(data.sub_shop_id != 0) {
                    res = "商户优惠券"
                }else {
                    res = "平台优惠券"
                }
            }
            return res
        },
        // 优惠券有效期
        couponTimeLimit(data) {
            let res = "";
            if(data.time_limit === "1") {
                if(data.limit_day === "0") {
                    res = "无限制"
                }else {
                    res = `领取${data.limit_day}日之内支持使用`
                }
            }else {
                res = `${formatDate(new Date(data.start_time), "yyyy/MM/dd")}~${formatDate(new Date(data.end_time), "yyyy/MM/dd")}`
            }
            return res
        },
        validateForm() {
            return new Promise((resolve) => {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        resolve(valid);
                    } else {
                        resolve(valid);
                    }
                })
            })
        }
    },
};
</script>
<style lang='scss' scoped>
.editor {
    display: flex;
    flex-wrap: nowrap;
    .btn-group {
        display: flex;
        margin-left: 13px;
        flex-direction: column;
        .goods-btn {
            margin-bottom: 10px;
        }
    }
}

.nest-box {
    padding: 30px 20px 30px;
    margin-top: 10px;
    background-color: $background-color;
    /deep/.ivu-form-item:last-child {
        margin-bottom: 0;
    }
    /deep/.add {
        background: #fff;
    }
    /deep/.slide-image-add {
        background: #fff;
        margin-bottom: 0!important;
    }
}
</style>