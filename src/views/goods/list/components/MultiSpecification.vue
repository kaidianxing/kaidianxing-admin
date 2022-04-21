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
    <kdx-modal-frame
        v-model="value"
        title="修改商品信息"
        :width="880"
        @on-cancel="handleCancel"
        @on-ok="handleOk"
    >
        <div class="multi-specification">
            <div class="batch-settings">
                <div class="label">批量设置:</div>
                <kdx-rr-input
                    class="width-280"
                    placeholder="价格"
                    number
                    :fixed="2"
                    :min-value="0"
                    :max-value="9999999.99"
                    v-model="batch_price"
                    :disabled="is_activity_goods"
                >
                    <span slot="append">元</span>
                </kdx-rr-input>
                <kdx-rr-input
                    class="width-280"
                    placeholder="库存"
                    number
                    :fixed="0"
                    :min-value="0"
                    :max-value="999999999"
                    v-model="batch_stock"
                    :disabled="is_activity_goods || model_type == '2'"
                >
                    <span slot="append">件</span>
                </kdx-rr-input>
                <Button :disabled="is_activity_goods" @click="fnBatchSet">应用</Button>
            </div>
            <Table
                ref="table"
                border
                :columns="columns"
                :data="data"
                :loading="loading"
                :span-method="handleSpan"
            ></Table>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: 'MultiSpecification',
    props: {
        // 商品类型 0实体商品 1虚拟商品 2虚拟卡密
        model_type: {
            type: [Number, String]
        },
        id: {
            type: [Number, String],
        },
        is_activity_goods: {
            type: Boolean
        },
        isExternal: { // 是否是外部使用，当外部使用时需要手动关闭弹窗
            type: Boolean,
            default: false
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
                        return (
                            <kdx-rr-input
                                type="text"
                                value={params.row[params.column.key]}
                                number
                                fixed={2}
                                max-value={9999999.99}
                                disabled={this.is_activity_goods}
                                onOn-blur={(e) => {
                                    this.setMultiplePrice(
                                        params.index,
                                        params.column.key,
                                        e.target.value
                                    )
                                }}
                            ></kdx-rr-input>
                        )
                    },
                },
                {
                    title: '库存（件）',
                    key: 'stock',
                    render: (h, params) => {
                        return (
                            <kdx-rr-input
                                type="text"
                                value={params.row[params.column.key]}
                                number
                                fixed={0}
                                max-value={999999999}
                                disabled={this.is_activity_goods || this.model_type == '2'}
                                onOn-blur={(e) => {
                                    this.setMultipleStock(
                                        params.index,
                                        params.column.key,
                                        e.target.value
                                    )
                                }}
                            ></kdx-rr-input>
                        )
                    },
                },
            ],
            specs: [],
            options: [],
            colspan: { 0: 1, 1: 1, 2: 1 },
            loading: false,
            batch_price: 0, // 批量设置价格
            batch_stock: 0, // 批量设置库存
        }
    },
    methods: {
        setValue() {
            this.value = !this.value
            // 清空批量设置价格、库存
            this.batch_price = 0
            this.batch_stock = 0
            if (this.value) {
                this.getGoodsData()
            }
        },
        // 获取多规格数据
        getGoodsData() {
            this.loading = true
            this.$api.goodsApi
                .getGoodInformation({ id: this.id })
                .then((res) => {
                    this.loading = false
                    if (res.error === 0) {
                        this.specs = res.data.spec
                        // this.data = res.data.options
                        this.initColumns()
                        this.initTable(res.data.options)
                        this.initColspan()
                    }
                })
        },
        // 初始化表头
        initColumns() {
            let columns = this.specs.map((item, index) => {
                return {
                    title: item.title,
                    key: '',
                    render: (h, params) => {
                        return <div>{params.row.childSpecVal[index]}</div>
                    },
                }
            })
            this.columns = [...columns, ...this.fixColumn]
        },
        // 初始化表格
        initTable(options = []) {
            if (options.length > 1) {
                this.data =  options.sort((a, b) => {
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
                this.data = options;
            }
            this.data.forEach((item) => {
                let data = []
                this.specs.forEach((s) => {
                    s.items.forEach((child) => {
                        if (item.specs.indexOf(child.id) > -1) {
                            data.push(child.title);
                        }
                    })
                })
                item.childSpecVal = data
            })
        },
        initColspan() {
            // let colspan = { 0: 0, 1: 0, 2: 0 }
            let colspan = { 0: 0, 1: 0, 2: 0 }

            const calRowSpan = (columnIndex) => {
                let rowspan = 1
                for (let i = this.specs.length - 1; i > columnIndex; i--) {
                    rowspan = rowspan * this.specs[i].items.length
                }
                colspan = {
                    ...colspan,
                    [columnIndex]: rowspan,
                }
            }
            for (let i = 0; i < this.specs.length; i++) {
                calRowSpan(i)
            }
            // this.specs.forEach((item, index) => {
            //     if (item.items.length > 0 && index <= 2) {
            //         colspan[index] = item.items.length
            //     }
            // })
            this.colspan = colspan
        },
        // 多规格 价格
        setMultiplePrice(index, key, value) {
            this.data[index][key] = ''
            let data = ''
            if (parseFloat(value)) {
                data = parseFloat(value).toFixed(2)
            }
            this.$nextTick(() => {
                this.data[index][key] = data
            })
        },
        // 多规格 库存
        setMultipleStock(index, key, value) {
            this.$nextTick(() => {
                this.data[index][key] = value
            })
        },
        // 批量设置
        fnBatchSet() {
            // 设置价钱
            if (
                parseFloat(this.batch_price) ||
                parseFloat(this.batch_price) === 0
            ) {
                this.data.forEach((item) => {
                    item.price = parseFloat(this.batch_price)
                })
            }
            // 设置库存
            if (
                (parseFloat(this.batch_stock) ||
                parseFloat(this.batch_stock) === 0) &&
                    this.model_type != 2
            ) {
                this.data.forEach((item) => {
                    item.stock = parseFloat(this.batch_stock)
                })
            }
        },
        // 取消
        handleCancel() {
            this.setValue()
        },
        handleOk() {
            if (this.validate()) {
                this.loading = true
                this.$api.goodsApi
                    .editInformation(this.getParams())
                    .then((res) => {
                        this.loading = false
                        if (res.error === 0) {
                            if (!this.isExternal) {
                                this.$Message.success('保存成功')
                                this.setValue()
                            }
                            this.$emit('on-refresh')
                        }
                    })
            }
        },
        validate() {
            let flag = true
            for (let item of this.data) {
                if ((!item.price && item.price != 0) || (!item.stock && item.stock != '0')) {
                    this.$Message.error('请填写完整的价格和库存')
                    flag = false
                    break
                }
            }
            return flag
        },
        getParams() {
            let options = this.data.map((item) => {
                return {
                    id: item.id,
                    price: item.price||0,
                    stock: item.stock||0,
                }
            })
            return {
                goods_id: this.id,
                options: options,
            }
        },
        // 合并单元格
        handleSpan({ rowIndex, columnIndex }) {
            let span = {
                rowspan: 0,
                colspan: 1,
            }
            if (columnIndex < this.specs.length) {
                if (rowIndex % this.colspan[columnIndex] == 0) {
                    span = {
                        rowspan: this.colspan[columnIndex],
                        colspan: 1,
                    }
                }
                return span
            } else {
                return [1, 1]
            }
        },
    },
}
</script>

<style scoped lang="scss">
.multi-specification {
    padding: 40px;
    .batch-settings {
        background-color: #f4f6f8;
        border: 1px solid #e9edef;
        border-radius: 2px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px;
        .label {
            font-weight: 700;
            font-size: 14px;
            line-height: 20px;
            color: #262b30;
        }
        /deep/ .ivu-btn {
            width: 100px;
            color: $brand-color;
        }
    }
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
