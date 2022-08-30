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
    <kdx-modal-frame title="修改积分商品信息" :value="modal" width="1000" :mask-closable="false"
                 :loading="loading" @on-cancel="handleCancel" @on-ok="handleOK">
        <div class="multi-specification">
            <!--批量设置-->
            <div class="setting flex">
                <span>批量设置：</span>
                <div class="setting-input flex">
                    <Checkbox v-model="allJoin" true-value="1" false-value="0"
                              @on-change="changePresell">参与积分商城
                    </Checkbox>
                    <kdx-rr-input type="text" placeholder="积分价" number :fixed='0' :maxValue="9999999"
                              v-model="batchData.credit_shop_credit">
                        <span slot="append">积分</span>
                    </kdx-rr-input>
                    <i class="iconfont icon-tianjia"></i>
                    <kdx-rr-input type="text" placeholder="积分价" number :fixed='2'  :maxValue="9999999.99"
                              v-model="batchData.credit_shop_price">
                        <span slot="append">元</span>
                    </kdx-rr-input>
                    <kdx-rr-input type="text" placeholder="积分商品库存" number :fixed='0' :maxValue="999999999"
                              v-model="batchData.credit_shop_stock">
                        <span slot="append">件</span>
                    </kdx-rr-input>

                    <Button class="default-primary" @click="handleBatchChange">应用</Button>
                </div>
            </div>
            <div class="table-list">
                <Form ref="goodsForm" :model='form' :rules='rules'>
                    <Table ref="table" :columns="columns" :data="form.goodsList" :span-method="handleSpan">
                        <template slot-scope="{ index }" slot="is_join">
                            <FormItem :prop="`goodsList.${index}.is_join`" :rules="rules.is_join">
                                <Checkbox v-model="form.goodsList[index].is_join" true-value="1" false-value="0">参与</Checkbox>
                            </FormItem>
                        </template>
                        <template slot-scope="{ index }" slot="credit_shop_credit">
                            <div class="flex">
                                <FormItem :prop="`goodsList.${index}.credit_shop_credit`" :rules="rules.credit_shop_credit">
                                    <kdx-rr-input type="text" number :fixed='0' :maxValue="9999999" v-model="form.goodsList[index].credit_shop_credit">
                                        <span slot="append">积分</span>
                                    </kdx-rr-input>
                                </FormItem>
                                <i class="iconfont icon-tianjia"></i>
                                <FormItem :prop="`goodsList.${index}.credit_shop_price`" :rules="rules.credit_shop_price">
                                    <kdx-rr-input type="text" number :fixed='2' :maxValue="9999999.99"
                                              v-model="form.goodsList[index].credit_shop_price">
                                        <span slot="append">元</span>
                                    </kdx-rr-input>
                                </FormItem>
                            </div>
                        </template>
                        <template slot-scope="{ index }" slot="credit_shop_stock">
                            <FormItem :prop="`goodsList.${index}.credit_shop_stock`" :rules="rules.credit_shop_stock">
                                <kdx-rr-input type="text" number :fixed='0' :maxValue="999999999" v-model="form.goodsList[index].credit_shop_stock">
                                    <span slot="append">件</span>
                                </kdx-rr-input>
                            </FormItem>
                        </template>
                    </Table>
                </Form>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "SpecificationsRules",
        components: {},
        props: {
            value: {
                type: Boolean,
                default: false
            },
            goodsId: {
                type: [String, Number],
                default: ''
            },
            spaceRules: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
                loading: false,
                modal: false,
                specs: [], // 规格
                form: {
                    goodsList: [],
                },
                colspan: {0: 1, 1: 1, 2: 1},
                batchData: {
                    credit_shop_stock: '',
                    credit_shop_price: '',
                    credit_shop_credit: '',
                    is_join: '0'
                },
                submitValid: false,
                columns: [],
                defaultColumns: [
                    {
                        title: '售卖价',
                        key: 'price',
                        width: 100,
                        render: (h, params) => {
                            return (
                                <div>{'￥' + params.row.price}</div>
                            )
                        }
                    },
                    {
                        title: '总库存',
                        key: 'stock',
                        width: 80,
                        render: (h, params) => {
                            return (
                                <div>{params.row.stock}</div>
                            )
                        }
                    },
                    {
                        title: '是否参与',
                        slot: 'is_join',
                        width: 100,
                    },
                    {
                        title: '积分价',
                        minWidth: 260,
                        slot: 'credit_shop_credit',
                    },
                    {
                        title: '积分商品库存',
                        minWidth: 120,
                        slot: 'credit_shop_stock',
                    }

                ],
                rules: {
                    is_join: [],
                    credit_shop_credit: [
                        {
                            validator: (rule, value, callback) => {
                                let index = rule.field.split('.')[1];
                                let { is_join } = this.form.goodsList[index]

                                // 规格不参与活动
                                if(is_join!='1'){
                                    return callback()
                                }

                                if(is_join=='1' && !value) {
                                    callback(new Error('积分不能为空'))
                                } else if(Number(value) === 0 &&is_join=='1') {
                                    callback(new Error('积分不能为0'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ],
                    credit_shop_price: [
                        {
                            validator: (rule, value, callback) => {
                                let index = rule.field.split('.')[1];
                                let { is_join } = this.form.goodsList[index]
                                // 规格不参与活动
                                if(is_join!='1'){
                                    return callback()
                                }
                                if(is_join=='1' && !value) {
                                    callback(new Error('金额不能为空'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ],
                    credit_shop_stock: [
                        {
                            validator: (rule, value, callback) => {
                                let index = rule.field.split('.')[1];
                                let { stock, is_join } = this.form.goodsList[index]
                                // 规格不参与活动
                                if(is_join!='1'){
                                    return callback()
                                }
                                if(Number(stock) < Number(value)){
                                    callback(new Error('库存不能大于总库存'))
                                } else if(is_join=='1' && !value) {
                                    callback(new Error('库存不能为空'))
                                } else if(Number(value) === 0 && is_join=='1') {
                                    callback(new Error('库存不能为0'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ]
                }
            }
        },
        watch: {
            goodsId:{
                handler(newValue) {
                    if (newValue) {
                        this.getGoodsData(newValue)
                    }
                },
                immediate: true
            },
            value(newValue) {
                // 解决点击取消丢失上次数据的问题
                this.getGoodsData(this.goodsId)
                this.initColumns();
                // 重置批量设置输入框
                this.refreshInput();
                this.modal = newValue
            }
        },
        computed: {
            allJoin:{
                get(){
                    return this.form.goodsList.every(item=>item.is_join=='1')?'1':'0';
                },
                set(val){
                    this.batchData.is_join = val
                }
            }
        },
        created() {
        },
        mounted() {
        },
        methods: {
            // 获取多规格数据
            getGoodsData(id) {
                this.loading = true;
                this.$api.goodsApi.getGoodInformation({id}).then(res => {
                    if (res.error === 0) {
                        this.specs = res.data.spec;
                        let list = res.data.options.map(item => {
                            if (this.spaceRules.length > 0) {
                                this.spaceRules.map(val => {
                                    if (item.id == val['option_id']) {
                                        item.credit_shop_stock = val?.credit_shop_stock || '';
                                        item.credit_shop_price = val?.credit_shop_price || '';
                                        item.credit_shop_credit = val?.credit_shop_credit || '';
                                        item.is_join = val?.is_join || '0';
                                    }
                                });
                            } else {
                                item.credit_shop_stock = '';
                                item.credit_shop_price = '';
                                item.credit_shop_credit = '';
                                item.is_join = '0';
                            }
                            return {...item}
                        });
                        // this.form.goodsList = list;
                        this.initColumns()
                        this.initTable(list);
                        this.initColspan();
                        this.loading = false;
                    }
                });
            },
            // 初始化表头
            initColumns() {
                let columns = this.specs.map((item, index) => {
                    return {
                        title: item.title,
                        key: '',
                        render: (h, params) => {
                            return (
                                <div>{params.row.childSpecVal[index]}</div>
                            );
                        }
                    };
                });

                this.columns = [...columns,...this.defaultColumns];
            },
            // 初始化表格
            initTable(options = []) {
                if (options.length > 1) {
                    this.form.goodsList =  options.sort((a, b) => {
                        let arr1 = a.specs.split(',').map(v => parseInt(v))
                        let arr2 = b.specs.split(',').map(v => parseInt(v))
                        let len = Math.min(arr1.length, arr2.length)
                        for (let i = 0; i < len; i++) {
                            if (arr1[i] !== arr2[i]) {
                                return arr1[i] - arr2[i]
                            }
                        }
                    })
                } else {
                    this.form.goodsList = options;
                }
                this.form.goodsList.forEach(item => {
                    let data = [];
                    this.specs.forEach(s => {
                        s.items.forEach(child => {
                            if (item.specs.indexOf(child.id) > -1) {
                                data.push(child.title);
                            }
                        })
                    });
                    item.childSpecVal = data;
                });
            },
            initColspan() {
                let colspan = {0: 1, 1: 1, 2: 1};
                this.specs.forEach((item, index) => {
                    if (item.items.length > 0) {
                        colspan[index] = item.items.length;
                    }
                });
                colspan[0] = (colspan[1] * (colspan[2] || 1)) || 1;
                colspan[1] = colspan[2] || 1;
                colspan[2] = colspan[2] ? 1 : 0;
                this.colspan = colspan;
            },
            handleSpan({rowIndex, columnIndex}) {
                let span = {
                    rowspan: 0,
                    colspan: 1
                };
                if (columnIndex < this.specs.length) {
                    if (rowIndex % this.colspan[columnIndex] == 0) {
                        span = {
                            rowspan: this.colspan[columnIndex],
                            colspan: 1
                        };
                    }
                    return span;
                } else {
                    return [1, 1];
                }
            },
            handleCancel() {
                this.modal = false;
                this.$emit('input', this.modal)
            },
            validateForm() {
                return new Promise((resolve, reject) => {
                    this.$refs['goodsForm'].validate(valid => {
                        this.submitValid =false
                        if (valid) {
                            if(this.form.goodsList.some(v=>v.is_join=='1')) {
                                resolve()
                            } else {
                                this.$Message.error('请至少选择一个规格参加活动')
                                reject()
                            }
                        } else {
                            reject()
                        }
                    })
                })
            },
            async handleOK() {
                this.submitValid = true
                await this.validateForm();
                // 处理参数
                let goodsData = {
                    id: this.goodsId,
                    rules: this.form.goodsList.map(item => {
                        return {
                            option_id: item.id,
                            credit_shop_stock: item.credit_shop_stock,
                            credit_shop_credit: item.credit_shop_credit,
                            credit_shop_price: item.credit_shop_price || 0,
                            is_join: item.is_join
                        }
                    })
                };
                this.$emit('spaceGoods', goodsData);
                // 关闭弹窗
                this.handleCancel()
            },
            changePresell(data) {
                this.form.goodsList.map(item => {
                    item.is_join = data
                })
            },
            handleBatchChange() {
                // 批量应用
                if (!this.batchData.credit_shop_credit && !this.batchData.credit_shop_price && !this.batchData.credit_shop_stock) {
                    return
                }
                this.form.goodsList.map(item => {
                    item.credit_shop_credit = this.batchData.credit_shop_credit
                    item.credit_shop_price = this.batchData.credit_shop_price || 0
                    item.credit_shop_stock = this.batchData.credit_shop_stock
                })
            },
            refreshInput(){
                this.batchData={...this.batchData,credit_shop_credit:'',credit_shop_price:'',credit_shop_stock:''}
            }

        },
    }
</script>

<style lang="scss" scoped>
    .multi-specification {
        padding: 40px;

        /deep/ .ivu-table {
            th {
                background-color: $background-color;
            }

            td {
                .ivu-table-cell {
                    overflow: inherit;
                }

                .ivu-form-item {
                    margin-bottom: 0 !important;
                }
            }

            .ivu-form-item-error-tip {
                width: max-content;
            }
        }

        .setting {
            margin-bottom: 10px;
            padding: 0 20px;
            height: 52px;
            align-items: center;
            background-color: $background-color;

            span {
                flex-shrink: 0;
                margin-right: 20px;
            }

            .setting-input {
                align-items: center;
                justify-content: space-between;
                width: 100%;
               /deep/ .ivu-input-wrapper {
                   width: 190px;
                    .ivu-input-group-append {
                        width: 30px;
                        span {
                            margin-right: 0;
                        }
                    }
                }
            }
        }

        .table-list {
            border: 1px solid $border-color;
            border-bottom: 0;
            .ivu-form {
                .ivu-form-item-content {
                    .ivu-form-item-error-tip {
                        top: 2px;
                    }
                }
            }
            .icon-tianjia {
                line-height: 32px;
                font-size: 20px;
                color: $text-first;
            }
        }
    }
</style>
