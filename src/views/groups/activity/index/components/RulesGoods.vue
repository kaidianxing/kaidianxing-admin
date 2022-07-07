<template>
    <div class="rules-goods-table">
        <Form ref="goodsForm" :model='form' :rules='rules'>
            <Table :columns="columns" :data="form.goodsList">
                <template slot-scope="{ row }" slot="shop">
                    <div class="shop-box">
                        <div class="image">
                            <img :src="$media(row.thumb)" @error="replaceImage">
                        </div>
                        <div class="title-content">
                            <div class="content-text">
                                <span class="mark"
                                      :style="row.has_option == 1?'display:inline-block':'display:none'">多</span>
                                <span class="mark"
                                      :class="goodsType(row.type).goodsName">{{ goodsType(row.type).goodsText }}</span>
                                <span class="text">{{ row.title }}</span>
                            </div>
                        </div>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="price">
                    <div class="price">
                        <div v-if="row.has_option == 1" class="flex-wrap">
                            <div>￥{{ row.min_price }}</div>
                            <div>~</div>
                            <div>￥{{ row.max_price }}</div>
                        </div>
                        <span v-else>￥{{ row.price }}</span>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="stock">
                    <div>{{ parseInt(row.stock) > 999 ? '999+' : parseInt(row.stock) }}</div>
                </template>
                <template slot-scope="{ row, index }" slot="rules">
                    <div class="deposit-btn" v-if="row.has_option == 1">
                        <Button class="default-primary off-set" v-if="!isSetRules(row)"
                                @click="handleSelectOption(row.id)">未设置拼团库存及价格
                        </Button>
                        <Button class="default-primary on-set" v-else @click="handleSelectOption(row.id)">已设置（可点击修改）
                        </Button>
                    </div>
                    <div class="flex" v-else>
                        <div class="table-input">
                            <FormItem :prop="`goodsList.${index}.activity_stock`" :rules="rules.activity_stock">
                                <kdx-rr-input type="text" number :fixed='0' :maxValue="999999999" v-model="form.goodsList[index].activity_stock"
                                          :disabled="isDisabled">
                                    <span slot="append">件</span>
                                </kdx-rr-input>
                            </FormItem>
                        </div>
                        <div class="table-input">
                            <FormItem :prop="`goodsList.${index}.activity_price`" :rules="rules.activity_price">
                                <kdx-rr-input type="text" number :fixed='2' :maxValue="9999999.99" v-model="form.goodsList[index].activity_price"
                                          :disabled="isDisabled">
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                        </div>
                        <div class="table-input">
                            <FormItem :prop="`goodsList.${index}.leader_price`"
                                      :rules="rules.leader_price">
                                <kdx-rr-input type="text" number :fixed='2' :maxValue="9999999.99"
                                          v-model="form.goodsList[index].leader_price"
                                          :disabled="isDisabled">
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                        </div>

                    </div>
                </template>
            </Table>
        </Form>
        <div class="footer-page" v-show="form.goodsList && form.goodsList.length > 0">
            <kdx-page-component ref="page" size="small" :total="total" @on-change="changePage"></kdx-page-component>
        </div>
        <!-- 多规格规则设置 -->
        <specifications-rules v-model="specificationsData.rulesModal" :goodsId="specificationsData.goodsId" :type="type" :is-disabled="isDisabled"
                              :spaceRules="specificationsData.spaceRules" @spaceGoods="handleSpaceGoods">
        </specifications-rules>
    </div>
</template>

<script>
import specificationsRules from './SpecificationsRules';

export default {
    name: "RulesGoods",
    components: {
        specificationsRules
    },
    props: {
        value: {
            type: Array,
            default: () => []
        },
        type: {
            type: String,
            default: ''
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
            total: 0,
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
                    title: '商品',
                    slot: 'shop',
                    minWidth: 220,
                },
                {
                    title: '售卖价',
                    slot: 'price',
                    minWidth: 130,
                },
                {
                    title: '现库存',
                    slot: 'stock',
                    minWidth: 80
                },
                {
                    slot: 'rules',
                    minWidth: 450,
                    renderHeader: () => {
                        return (
                                <div class="flex">
                                    <p class="table-title">拼团库存</p>
                                    <p class="table-title">拼团价格</p>
                                    <p class="table-title">团长价(非必填)</p>
                                </div>
                        );
                    },
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 80,
                    render: (h, params) => {
                        return (
                                <Button type="text" class="action-btn" disabled={this.isDisabled} onClick={() => {
                                    this.handleDelete(params.index);
                                }}>删除</Button>
                        );
                    }
                },
            ],
            rules: {
                activity_stock: [
                    {
                        validator: (rule, value, callback) => {
                            let index = rule.field.split('.')[1];
                            if (!value) {
                                callback(new Error('拼团库存不能为空'));
                            } else if (Number(value) === 0) {
                                callback(new Error('拼团库存不能为0'));
                            } else if (Number(this.form.goodsList[index].stock) < Number(value)) {
                                callback(new Error('拼团库存大于现库存'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                activity_price: [
                    {
                        validator: (rule, value, callback) => {
                            let index = rule.field.split('.')[1];
                            if (!value) {
                                callback(new Error(`拼团价格不能为空`));
                            } else if (Number(this.form.goodsList[index].price) <= Number(value)) {
                                callback(new Error(`拼团价格需小于售卖价`));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                leader_price: [
                    {
                        validator: (rule, value, callback) => {
                            let index = rule.field.split('.')[1],
                                    price = this.form.goodsList[index]?.price,
                                    activityPrice = this.form.goodsList[index]?.activity_price || price;
                            if (value) {
                                if (Number(price) <= Number(value)) {
                                    callback(new Error(`团长价格需小于售售卖价`));
                                } else if (Number(activityPrice) <= Number(value)) {
                                    callback(new Error(`团长价格需小于拼团价格`));
                                }
                            }
                            callback();
                        }
                    }
                ],
            }
        };
    },
    watch: {
        value: {
            handler() {
                this.$nextTick(() => {
                    this.reset();
                });
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
                if (this.form.goodsList.some(item => item.has_option != 1)) {
                    this.$refs['goodsForm'].validate(valid => {
                        if (valid) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                } else {
                    // 判断多规格是否设置库存价格
                    if (this.form.goodsList.some(item => !item.rules)) {
                        this.$Message.error('每个商品必须有一个规格参加活动');
                        reject();
                    }
                    resolve();
                }
            });
        },
        reset() {
            this.$refs['page']?.reset();
            this.page = {
                pageSize: 10,
                pageNumber: 1
            };
            this.getPageData();
        },
        // 获取当前显示的商品
        getPageData() {
            this.total = this.value.length;
            let start = this.page.pageSize * (this.page.pageNumber - 1),
                end = this.page.pageSize * this.page.pageNumber;
            this.form.goodsList = this.value.slice(start, end);
        },
        // 切换页码
        changePage(page) {
            this.page = page;
            this.getPageData();
        },
        // 删除
        handleDelete(index) {
            let pageIndex = (this.page.pageNumber-1)*this.page.pageSize + index;
            this.$emit('delete', pageIndex);
        },
        handleSelectOption(id) {
            this.specificationsData.rulesModal = true;
            this.specificationsData.goodsId = id;
            this.form.goodsList.map(item => {
                if (item.id == id && item?.rules?.length > 0) {
                    this.specificationsData.spaceRules = item.rules;
                }
            });
        },
        handleSpaceGoods(data) {
            let list = this.value.map(item => {
                if (item.id == data.id) {
                    item.goods_id = item.id;
                    item.rules = data.rules;
                }
                return item;
            });
            this.$emit('input', list);
        },
        isSetRules(item) {
            return item.rules?.length > 0 && item.rules?.some(item => item.is_join == '1');
        },

        // 商品类型
        goodsType(type) {
            let getType = {
                goodsName : '',
                goodsText: ''
            };
            switch (type) {
                case '0':
                    getType = {
                        goodsName : 'real',
                        goodsText : '实'
                    }
                    break;

                case '1':
                    getType = {
                        goodsName : 'virtual',
                        goodsText : '虚'
                    }
                    break;

                case '2':
                    getType = {
                        goodsName: 'secret',
                        goodsText: '密'
                    }
                    break;

                case '3':
                    getType = {
                        goodsName: 'appoint',
                        goodsText: '预'
                    }
                    break;
                case '5':
                    getType = {
                        goodsName: 'verifyCount',
                        goodsText: '次'
                    }
                    break;
                case '6':
                    getType = {
                        goodsName: 'netRecharge',
                        goodsText: '充'
                    }
                    break;
                case '7':
                    getType = {
                        goodsName: 'medicine',
                        goodsText: '药'
                    }
                    break;
                default:
                    getType = {
                        goodsName: '',
                        goodsText: ''
                    }
                    break;
            }
            return getType
        },
    },
};
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
                /*width: 33.33%;*/
                /*flex-shrink: 0;*/
                flex: 1;
                padding: 0 5px;
            }
        }

        td {
            .ivu-table-cell {
                overflow: inherit;
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
                                color: #2D8CF0;
                            }

                            &.virtual {
                                background-color: #E6FFF9;
                                color: #00C5C5;
                            }
                            &.secret {
                                background-color: #FFCDD0;
                                color: #FF000F;
                            }
                            &.appoint {
                                background-color: #E2E7FF;
                                color: #4B66E3;
                            }
                            &.verifyCount {
                                background-color: #FEE3FF;
                                color: #FA00FF;
                            }
                            &.netRecharge {
                                background-color: #FFE4EB;
                                color: #FF4370;
                            }
                            &.medicine {
                                background-color: #E9FFF8;
                                color: #1ED79F;
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
                /*width: 33.33%;*/
                /*flex-shrink: 0;*/
                flex: 1;
                padding: 0 5px;


                .ivu-form-item {
                    margin-bottom: 0 !important;
                }

                .ivu-form-item-error-tip {
                    margin-left: 0;
                    padding-left: 0 !important;
                    width: max-content;
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
