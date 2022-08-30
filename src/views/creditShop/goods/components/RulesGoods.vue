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
    <div class="rules-goods-table">
        <Form ref="goodsForm" :model='form' :rules='rules'>
            <Table :columns="columns" :data="form.goodsList">
                <template slot-scope="{ row }" slot="shop">
                    <div class="shop-box" v-if="type === '0'">
                        <div class="image">
                            <img :src="$media(row.thumb)" @error="replaceImage">
                        </div>
                        <div class="title-content">
                            <div class="content-text">
                                <span class="mark more" v-if="1 === +row.has_option">多</span>
                                <span class="mark real" v-if="0 === +row.type">实</span>
                                <span class="mark virtual" v-else-if="1 === +row.type">虚</span>
                                <span class="mark card" v-else>密</span>
                                <span class="text">{{row.title}}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex align-center" v-else>
                        <div class="coupons-type" :class="row.coupon_sale_type === '2'?'deduction':'full-reduction'">
                            <span>{{row.coupon_sale_type === '2'?'折扣券':'满减券'}}</span>
                            <img :src="require(`@/assets/image/coupons/subtract-${row.coupon_sale_type === '2'?'blue':'yellow'}.png`)" alt="">
                        </div>
                        <div class="marginL-10">
                            <p>{{row.coupon_name}}</p>
                            <p class="disabled-color">{{row.content}}</p>
                        </div>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="price">
                    <div class="price" v-if="type==='0'">
                        <div v-if="row.has_option == 1" class="flex-wrap">
                            <div>￥{{row.min_price}}</div>
                            <div>~</div>
                            <div>￥{{row.max_price}}</div>
                        </div>
                        <span v-else>￥{{row.price}}</span>
                    </div>

                    <div v-else>
                        <span v-if="parseFloat(row.credit) !== 0">{{ parseFloat(row.credit)}}积分</span>
                        <span v-if="parseFloat(row.credit) !== 0 && parseFloat(row.balance) !== 0">+</span>
                        <span v-if="parseFloat(row.balance) !== 0">{{ parseFloat(row.balance) }}元</span>
                    </div>

                </template>
                <template slot-scope="{ row }" slot="stock">
                    <div v-if="type === '0'">{{parseInt(row.stock)>999?'999+':parseInt(row.stock)}}</div>
                    <div v-else>
                        <div v-if="row.stock_type === '0'">不限制</div>
                        <div v-else>{{ parseInt(row.stock) - parseInt(row.get_total) }}</div>
                    </div>
                </template>
                <template slot-scope="{ row, index }" slot="rules">
                    <div class="deposit-btn" v-if="row.has_option == 1">
                        <Button class="default-primary off-set" v-if="!isSetRules(row)"
                                @click="handleSelectOption(row.id)">未设置积分价格及库存
                        </Button>
                        <Button class="default-primary on-set" v-else @click="handleSelectOption(row.id)">已设置（可点击修改）
                        </Button>
                    </div>
                    <div class="flex" v-else>
                        <div class="table-input flex">
                            <FormItem :prop="`goodsList.${index}.credit_shop_credit`" :rules="rules.credit_shop_credit">
                                <kdx-rr-input class="width-160" type="text" number :fixed='0' :maxValue="9999999"
                                          v-model="form.goodsList[index].credit_shop_credit">
                                    <span slot="append">积分</span>
                                </kdx-rr-input>
                            </FormItem>
                            <i class="iconfont icon-tianjia"></i>
                            <FormItem :prop="`goodsList.${index}.credit_shop_price`" :rules="rules.credit_shop_price">
                                <kdx-rr-input class="width-160" type="text" number :fixed='2' :maxValue="9999999.99"
                                          v-model="form.goodsList[index].credit_shop_price">
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                        </div>
                        <div class="table-input">
                            <FormItem :prop="`goodsList.${index}.credit_shop_stock`" :rules="rules.credit_shop_stock">
                                <kdx-rr-input class="width-160" type="text" number :fixed='0' :maxValue="999999999"
                                          v-model="form.goodsList[index].credit_shop_stock">
                                    <span slot="append">件</span>
                                </kdx-rr-input>
                            </FormItem>
                        </div>
                    </div>
                </template>
            </Table>
        </Form>
        <div class="footer-page" v-show="form.goodsList && form.goodsList.length > 0">
            <kdx-page-component ref="page" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
        <!-- 多规格规则设置 -->
        <specifications-rules v-model="specificationsData.rulesModal"
                              :goodsId="specificationsData.goodsId"
                              :spaceRules="specificationsData.spaceRules"
                              @spaceGoods="handleSpaceGoods">
        </specifications-rules>
    </div>
</template>

<script>

    import specificationsRules from './SpecificationsRules'

    export default {
        name: "RulesGoods",
        components: {
            specificationsRules
        },
        props: {
            type: {
                type: [String, Number],
                default: '0' // 选择类型 0 商品 1 优惠券
            },
            value: {
                type: Array,
                default: () => []
            },
            isDisabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                page: {
                    pageSize: 10,
                    pageNumber: 1,
                },
                specificationsData: {
                    rulesModal: false,
                    goodsId: '',
                    spaceRules: [], // 多规格规则
                },
                form: {
                    goodsList: [],
                },
                columns: [
                    {
                        slot: 'shop',
                        minWidth: 176,
                        renderHeader: () => {
                            return (
                                <div>{this.type === '0'?'商品':'优惠券名称'}</div>
                            );
                        }
                    },
                    {
                        title: '价格',
                        slot: 'price',
                        minWidth: 110,
                    },
                    {
                        title: '现库存',
                        slot: 'stock',
                        minWidth: 60
                    },
                    {
                        slot: 'rules',
                        minWidth: 520,
                        renderHeader: () => {
                            return (
                                <div class="flex">
                                    <p class="table-title">积分价</p>
                                    <p class="table-title">积分商品库存</p>
                                </div>
                            );
                        },
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 60,
                        render: (h, params) => {
                            return (
                                <Button type="text" class="action-btn" disabled={this.isDisabled} onClick={() => {this.handleDelete(params.index)}}>删除</Button>
                            )
                        }
                    },
                ],
                rules: {
                    credit_shop_credit: [
                        {required: true, message: '积分不能为空'},
                        {
                            validator: (rule, value, callback) => {
                                if (+value === 0) {
                                    callback(new Error('积分不能为0'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ],
                    credit_shop_price: [
                        {required: true, message: '金额不能为空'},
                    ],
                    credit_shop_stock: [
                        {required: true, message: '库存不能为空'},
                        {
                            validator: (rule, value, callback) => {
                                let index = rule.field.split('.')[1];
                                if (Number(value) === 0) {
                                    callback(new Error('库存不能为0'))
                                } else if (this.type === '1' && this.form.goodsList[index]?.stock_type === '0') {
                                    callback()
                                } else if (Number(this.form.goodsList[index].stock) < Number(value)) {
                                    callback(new Error('积分商品库存不能大于现库存'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ],
                }
            }
        },
        computed: {
            total() {
                return this.form.goodsList?.length || 0
            }
        },
        watch: {
            value: {
                handler(newValue) {
                    this.form.goodsList = newValue
                },
                immediate: true
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            validateForm() {
                return new Promise((resolve, reject) => {
                    if (this.form.goodsList.some(item => item.has_option == 0)) {
                        this.$refs['goodsForm'].validate(valid => {
                            if (valid) {
                                resolve()
                            } else {
                                reject()
                            }
                        })
                    } else {
                        resolve()
                    }
                })
            },
            // 切换页码
            changePage(page) {
                this.page = page;
            },
            // 删除
            handleDelete(index) {
                this.form.goodsList.splice(index, 1);
                this.$emit('input', this.form.goodsList);
            },
            handleSelectOption(id) {
                this.specificationsData.rulesModal = true;
                this.specificationsData.goodsId = id;
                this.form.goodsList.map(item => {
                    if (item.id == id && item?.rules?.length > 0) {
                        this.specificationsData.spaceRules = item.rules
                    }
                })
            },
            handleSpaceGoods(data) {
                this.form.goodsList = this.form.goodsList.map(item => {
                    if (item.id == data.id) {
                        item.goods_id = item.id;
                        item.rules = data.rules;
                    }
                    return item
                });
                this.$emit('input', this.form.goodsList);
            },
            isSetRules(item) {
                return item.rules?.length > 0 && item.rules?.some(item => item.is_join == '1')
            }
        },
    }
</script>

<style lang="scss" scoped>
    .rules-goods-table {
        padding: 0 20px;
        background-color: #ffffff;
        .flex-wrap {
            display: flex;
            flex-wrap: wrap;
        }
        /deep/ .ivu-table {
            .ivu-table-body {
                margin-bottom: -2px;
            }
            th {
                padding: 0;
                .ivu-table-cell {
                    width: 100%;
                    padding: 15px;
                }
                .table-title {
                    flex: 1;
                    /*padding: 0 10px;*/
                    &:first-child {
                        flex: 2;
                        padding-right: 30px;
                    }
                }
            }
            td {
                .ivu-table-cell {
                    overflow: inherit;
                }
                // 优惠券类型
                .coupons-type {
                    flex-shrink: 0;
                    position: relative;
                    padding: 5px 14px 5px 16px;
                    border-radius: 2px;
                    color: #ffffff;
                    display: inline-block;

                    > img {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        right: -2px;
                    }
                }

                .deduction {
                    background-color: $brand-color;
                }

                .full-reduction {
                    background-color: $warning-color;
                }
                .shop-box {
                    display: flex;
                    flex-wrap: nowrap;
                    .image {
                        width: 60px;
                        height: 60px;
                        margin-right: 10px;
                        border: 1px solid $border-color;
                        border-radius: 2px;
                        overflow: hidden;
                        > img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .title-content {
                        width: 100%;
                        flex: 1;
                        .content-text {
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                            height: 50px;
                            padding: 10px 0;
                            .mark {
                                @include font-12-16;
                                color: #ed4014;
                                background-color: #ffefe6;
                                border-radius: 2px;
                                margin-right: 4px;
                                width: 18px;
                                height: 18px;
                                text-align: center;
                                line-height: 18px;
                                display: inline-block;
                                &:nth-last-child(2) {
                                    margin-right: 6px;
                                }
                                &.real {
                                    background-color: #F0FAFF;
                                    color: $brand-color;
                                }
                                &.virtual {
                                    background-color: #E6FFF9;
                                    color: #00C5C5;
                                }
                                &.card {
                                    color: $danger-color;
                                    background-color: $danger-light;
                                }
                            }
                            .text {
                                @include font-14-20;
                            }
                        }
                    }
                }
                .price {
                    color: $text-first;
                    word-break: break-all;
                    @include font-14-20-bold;
                }
                .table-input {
                    flex: 1;
                    /*padding: 0 10px;*/
                    &.flex {
                        padding-right: 20px;
                    }
                    .ivu-form-item {
                        margin-bottom: 0 !important;
                    }
                    .ivu-form-item-error-tip {
                        padding-left: 0 !important;
                        width: max-content;
                    }
                    .icon-tianjia {
                        line-height: 32px;
                        font-size: 20px;
                        color: $text-first;
                    }
                }
                .ivu-btn {
                    width: 100%;
                }
                .deposit-btn {
                    padding: 0 5px;
                    .off-set {
                        color: #ff3c29;
                        &:hover {
                            border-color: transparent;
                            background: #f4f6f8;
                        }
                    }
                    .on-set {
                        color: #19be6b;
                        &:hover {
                            border-color: transparent;
                            background: #f4f6f8;
                        }
                    }
                }
                .next-box {
                    .ivu-form-item-error-tip {
                        padding-left: 0 !important;
                    }
                }
            }
        }

        /deep/ .action-btn {
            text-align: left;
        }
        .footer-page {
            border-top: 1px solid $border-color;
            background-color: #ffffff;
            padding-top: 20px;
            display: flex;
            justify-content: center;
        }
    }
</style>