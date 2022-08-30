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
    <kdx-modal-frame title="设置拼团商品信息" :value="modal" width="1020" :mask-closable="false"
                 :loading="loading" :footerHide="isDisabled"
                 @on-cancel="handleCancel" @on-ok="handleOK">
        <div class="multi-specification">
            <!--批量设置-->
            <div class="setting flex">
                <span>批量设置：</span>
                <div class="setting-input flex">
                    <Checkbox v-model="allSeckill" true-value="1" false-value="0" :disabled="isDisabled"
                              @on-change="changeSeckill">参与拼团
                    </Checkbox>
                    <kdx-rr-input type="text" placeholder="拼团库存" number :fixed='0'
                              v-model="batchData.activity_stock" :disabled="isDisabled" :maxValue="999999999">
                        <span slot="append">件</span>
                    </kdx-rr-input>
                    <kdx-rr-input type="text" placeholder="拼团价格" number :fixed='2'
                              v-model="batchData.activity_price" :disabled="isDisabled" :maxValue="9999999.99">
                        <span slot="append">元</span>
                    </kdx-rr-input>
                    <kdx-rr-input type="text" placeholder="团长价(非必填)" number :fixed='2'
                              v-model="batchData.leader_price" :disabled="isDisabled" :maxValue="9999999.99">
                        <span slot="append">元</span>
                    </kdx-rr-input>
                    <Button class="default-primary" :disabled="isDisabled" @click="handleBatchChange">应用</Button>
                </div>
            </div>
            <div class="table-list">
                <Form ref="goodsForm" :model='form' :rules='rules'>
                    <Table ref="table" :columns="columns" :data="form.goodsList" :span-method="handleSpan">
                        <template #is_join="{index}">
                            <FormItem :prop="`goodsList.${index}.is_join`" :rules="rules.is_join">
                                <Checkbox v-model="form.goodsList[index].is_join" true-value="1" false-value="0"
                                          :disabled="isDisabled">参与
                                </Checkbox>
                            </FormItem>
                        </template>
                        <template #activity_stock="{index}">
                            <FormItem :prop="`goodsList.${index}.activity_stock`" :rules="rules.activity_stock">
                                <kdx-rr-input type="text" number :fixed='0' v-model="form.goodsList[index].activity_stock" :maxValue="999999999"
                                          :disabled="isDisabled">
                                    <span slot="append">件</span>
                                </kdx-rr-input>
                            </FormItem>
                        </template>
                        <template #activity_price="{index}">
                            <FormItem :prop="`goodsList.${index}.activity_price`" :rules="rules.activity_price">
                                <kdx-rr-input type="text" number :fixed='2' v-model="form.goodsList[index].activity_price" :maxValue="9999999.99"
                                          :disabled="isDisabled">
                                    <span slot="append">元</span>
                                </kdx-rr-input>
                            </FormItem>
                        </template>
                        <template #leader_price="{index}">
                            <FormItem :prop="`goodsList.${index}.leader_price`"
                                      :rules="rules.leader_price">
                                <kdx-rr-input type="text" number :fixed='2'
                                          v-model="form.goodsList[index].leader_price"
                                          :maxValue="9999999.99"
                                          :disabled="isDisabled">
                                    <span slot="append">元</span>
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
        type: {
            type: String,
            default: ''
        },
        spaceRules: {
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
            loading: false,
            modal: false,
            specs: [], // 规格
            form: {
                goodsList: [],
            },
            colspan: {0: 1, 1: 1, 2: 1},
            batchData: {
                activity_stock: '',
                activity_price: '',
                leader_price: '',
                is_join: '0'
            },
            submitValid: false,
            columns: [],
            defaultColumns: [
                {
                    title: '售卖价',
                    key: 'price',
                    render: (h, params) => {
                        return (
                                <div>{'￥' + params.row.price}</div>
                        );
                    }
                },
                {
                    title: '总库存',
                    key: 'stock',
                    width: 80,
                    render: (h, params) => {
                        return (
                                <div>{params.row.stock}</div>
                        );
                    }
                },
                {
                    title: '参与拼团',
                    slot: 'is_join',
                    width: 100,
                },
                {
                    title: '拼团库存',
                    slot: 'activity_stock',
                },
                {
                    title: '拼团价格',
                    slot: 'activity_price',
                },
                {
                    title: '团长价(非必填)',
                    slot: 'leader_price',
                },
            ],

            rules: {
                is_join: [],
                activity_price: [
                    {
                        validator: (rule, value, callback) => {
                            let index = rule.field.split('.')[1];
                            let { price, is_join } = this.form.goodsList[index]

                             // 规格不参与活动
                            if(is_join!='1'){
                                return callback()
                            }

                            if (Number(price) <= Number(value)) {
                                callback(new Error(`拼团价格需小于售价`));
                            } else if (is_join == '1' && !value) {
                                callback(new Error(`拼团价格不能为空`));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                activity_stock: [
                    {
                        validator: (rule, value, callback) => {
                            let index = rule.field.split('.')[1];
                            let { stock, is_join } = this.form.goodsList[index]

                            // 规格不参与活动
                            if(is_join!='1'){
                                return callback()
                            }

                            if (Number(stock) < Number(value)) {
                                callback(new Error('拼团库存大于库存'));
                            } else if (!value) {
                                callback(new Error('拼团库存不能为空'));
                            } else if (Number(value) === 0) {
                                callback(new Error('拼团库存不能为0'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                leader_price: [
                    {
                        validator: (rule, value, callback) => {
                            value = Number(value);
                            let index = rule.field.split('.')[1],
                                    is_join = this.form.goodsList[index].is_join,
                                    price = Number(this.form.goodsList[index]?.price),
                                    activityPrice = Number(this.form.goodsList[index]?.activity_price || price);
                            if (is_join == 1 && value) {
                                if (price <= value) {
                                    callback(new Error(`团长价格需小于售售卖价`));
                                } else if (activityPrice <= value) {
                                    callback(new Error(`团长价格需小于拼团价格`));
                                }
                            }
                            callback();
                        }
                    }
                ]
            }
        };
    },
    watch: {
        goodsId: {
            handler(newValue) {
                if (newValue) {
                    this.getGoodsData(newValue);
                }
            },
            immediate: true
        },
        value(newValue) {
            // 解决点击取消丢失上次数据的问题
            this.getGoodsData(this.goodsId);
            // 解决切换拼团类型表格字段显示错误的问题
            this.handleColumns();
            // 重置批量设置输入框
            this.refreshInput();
            this.modal = newValue;
        }
    },
    computed: {
        allSeckill: {
            get() {
                return this.form.goodsList.every(item => item.is_join == '1') ? '1' : '0';
            },
            set(val) {
                this.batchData.is_join = val;
            }
        }
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
                                let key = !this.isDisabled ? 'option_id' : 'id';
                                if (item.id == val[key]) {
                                    item.activity_stock = val?.activity_stock || '';
                                    item.activity_price = val?.activity_price || '';
                                    item.is_join = val?.is_join || '0';
                                    item.leader_price = val?.leader_price == -1 ? '' : val?.leader_price;
                                }
                            });
                        } else {
                            item.activity_stock = '';
                            item.activity_price = '';
                            item.is_join = '0';
                            item.leader_price = '';
                        }
                        return {...item};
                    });
                    // this.form.goodsList = list;
                    this.handleColumns();
                    this.initTable(list);
                    this.initColspan();
                    this.loading = false;
                }
            });
        },
        handleColumns() {
            this.initColumns(this.defaultColumns);
        },
        // 初始化表头
        initColumns(result) {
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
            this.columns = [...columns, ...result];
        },
        // 初始化表格
        initTable(options = []) {
            if (options.length > 1) {
                this.form.goodsList = options.sort((a, b) => {
                    let arr1 = a.specs.split(',').map(v => parseInt(v));
                    let arr2 = b.specs.split(',').map(v => parseInt(v));
                    let len = Math.min(arr1.length, arr2.length);
                    for (let i = 0; i < len; i++) {
                        if (arr1[i] !== arr2[i]) {
                            return arr1[i] - arr2[i];
                        }
                    }
                });
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
                    });
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
            this.$emit('input', this.modal);
        },
        validateForm() {
            return new Promise((resolve, reject) => {
                this.$refs['goodsForm'].validate(valid => {
                    this.submitValid = false;
                    if (valid) {
                        if (this.form.goodsList.some(v => v.is_join == '1')) {
                            resolve();
                        } else {
                            this.$Message.error('请至少选择一个规格参加活动');
                            reject();
                        }
                    } else {
                        reject();
                    }
                });
            });
        },
        async handleOK() {
            this.submitValid = true;
            await this.validateForm();
            // 处理参数
            let goodsData = {
                id: this.goodsId,
                rules: this.form.goodsList.map(item => {
                    return {
                        option_id: item.id,
                        activity_stock: item.activity_stock,
                        activity_price: item.activity_price,
                        leader_price: item.leader_price || '-1',
                        is_join: item.is_join
                    };
                })
            };
            this.$emit('spaceGoods', goodsData);
            // 关闭弹窗
            this.handleCancel();
        },
        changeSeckill(data) {
            this.form.goodsList.map(item => {
                item.is_join = data;
            });
        },
        handleBatchChange() {
            // 批量应用
            this.form.goodsList.forEach(item => {
                (this.batchData.activity_price ) && (item.activity_price = this.batchData.activity_price);
                (this.batchData.activity_stock ) && (item.activity_stock = this.batchData.activity_stock);
                item.leader_price = this.batchData.leader_price;
            });
        },
        refreshInput() {
            this.batchData = {
                ...this.batchData,
                activity_stock: '',
                activity_price: '',
                leader_price: '',
            };
        }

    },
};
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
        border-radius: 2px;

        span {
            flex-shrink: 0;
            margin-right: 20px;
        }

        .setting-input {
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            .ivu-checkbox-wrapper {
                margin-right: 0;
            }

            /deep/ .ivu-input-wrapper {
                margin-left: 20px;
                width: 190px;

                .ivu-input-group-append {
                    width: 30px;

                    span {
                        margin-right: 0;
                    }
                }
            }

            .default-primary {
                margin-left: 20px;
            }
        }
    }

    .table-list {
        border: 1px solid $border-color;
        border-bottom: 0;
        border-radius: 2px;

        .ivu-form {
            .ivu-form-item-content {
                .ivu-form-item-error-tip {
                    top: 2px;
                }
            }
        }
    }
}
</style>
