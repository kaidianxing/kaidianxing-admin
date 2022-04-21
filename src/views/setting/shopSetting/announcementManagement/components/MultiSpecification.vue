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
<template>
    <kdx-modal-frame v-model="value" title="修改商品信息" :width="880" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <div class="multi-specification">
            <Table ref="table" border :columns="columns" :data="data" v-loading="loading"
                   :span-method="handleSpan"></Table>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "MultiSpecification",
        props: {
            id: {
                type: [Number, String]
            }
        },
        data() {
            return {
                value: false,
                columns: [],
                data: [],
                fixColumn: [
                    {
                        title: '价格（元）',
                        key: 'price',
                        render: (h, params) => {
                            return (<kdx-rr-input type='text' value={params.row[params.column.key]} number max-value={9999999.99} fixed={2} onOn-blur={e => {
                                this.setMultiplePrice(params.index, params.column.key, e.target.value);
                            }}></kdx-rr-input>);
                        }
                    },
                    {
                        title: '库存（件）',
                        key: 'stock',
                        render: (h, params) => {
                            return (<kdx-rr-input type='text' value={params.row[params.column.key]} number fixed={0} max-value={999999999} onOn-blur={e => {
                                this.setMultipleStock(params.index, params.column.key, e.target.value);
                            }}></kdx-rr-input>);

                        }
                    }
                ],
                specs: [],
                options: [],
                colspan: {0: 1, 1: 1, 2: 1},
                loading: false
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    this.getGoodsData();
                }
            },
            // 获取多规格数据
            getGoodsData() {
                this.loading = true;
                this.$api.goodsApi.getGoodInformation({id: this.id})
                    .then(res => {
                        this.loading = false;
                        if (res.error === 0) {
                            this.specs = res.data.spec;
                            this.data = res.data.options;
                            this.initColumns();
                            this.initTable();
                            this.initColspan();
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
                this.columns = [...columns, ...this.fixColumn];
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
            // 初始化表格
            initTable() {
                this.data.forEach(item => {
                    item.childSpecVal = item.title.split('+');
                });
            },
            initColspan() {
                let colspan = {0: 0, 1: 0, 2: 0};
                this.specs.forEach((item, index) => {
                    if (item.items.length > 0) {
                        colspan[index] = item.items.length;
                    }
                });
                colspan[0] = (colspan[1] + colspan[2]) || 1;
                colspan[1] = colspan[2] || 1;
                this.colspan = colspan;
            },
            // 多规格 价格
            setMultiplePrice(index, key, value) {
                this.data[index][key] = '';
                let data = '';
                if (parseFloat(value)) {
                    data = parseFloat(value).toFixed(2);
                }
                this.$nextTick(() => {
                    this.data[index][key] = data;
                });
            },
            // 多规格 库存
            setMultipleStock(index, key, value) {
                this.$nextTick(() => {
                    this.data[index][key] = value;
                });
            },
            handleCancel() {
                this.setValue();
            },
            getParams() {
                let options = this.data.map(item => {
                    return {
                        id: item.id,
                        price: item.price,
                        stock: item.stock
                    };
                });
                return {
                    goods_id: this.id,
                    options: options
                };
            },
            validate() {
                let flag = true;
                for (let item of this.data) {
                    if (!item.price || (!item.stock && item.stock != '0')) {
                        this.$Message.error('请填写完整的价格和库存');
                        flag = false;
                        break;
                    }
                }
                return flag;
            },
            handleOk() {
                if (this.validate()) {
                    this.loading = true;
                    this.$api.goodsApi.editInformation(this.getParams())
                        .then(res => {
                            this.loading = false;
                            if (res.error === 0) {
                                this.$emit('on-refresh');
                                this.setValue();
                            }
                        });
                }
            }
        }
    };
</script>

<style scoped lang="scss">
    .multi-specification {
        padding: 40px;

        /deep/ .ivu-table {
            .ivu-table-header {
                tr {
                    > th {
                        &:nth-last-child(2) {
                            .ivu-table-cell {
                                color: $danger-color !important;
                            }
                        }

                        &:nth-last-child(1) {
                            .ivu-table-cell {
                                color: $danger-color !important;
                            }
                        }
                    }
                }
            }
            .ivu-table-body {
                 td {
                    .ivu-table-cell {
                        .error {
                            .ivu-input {
                                border-color: $danger-color;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
