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
    <div class="table-list">
        <div class="thead">
            <div class="tr">
                <div class="th">
                    <Checkbox
                        v-model="allSelectedFlag"
                        :indeterminate="indeterminate"
                        :disabled="disabled"
                        @on-change="changeAllSelected"
                    ></Checkbox>
                    <div class="text">订单编号</div>
                </div>
                <div class="th">
                    <div class="text">商品</div>
                </div>
                <div class="th">
                    <div class="text">单价/数量</div>
                </div>
                <div class="th">
                    <div class="text">电子面单打印状态</div>
                </div>
                <div class="th">
                    <div class="text">发货单打印状态</div>
                </div>
                <div class="th">
                    <div class="text">订单状态</div>
                </div>
                <div class="th">
                    <div class="text">会员</div>
                </div>
                <div class="th">
                    <div class="text">收件人</div>
                </div>
                <div class="th">
                    <div class="text">下单时间</div>
                </div>
                <div class="th">
                    <div class="text">订单金额</div>
                </div>
            </div>
        </div>
        <div class="tbody" v-if="list.length">
            <div class="tr" v-for="(item, index) in list" :key="item.id">
                <div class="td">
                    <div class="flex align-center pl20 pr20">
                        <Checkbox
                            v-model="item.checked"
                            :indeterminate="item.indeterminate"
                            :disabled="item.disabled"
                            @on-change="changeChecked(index, $event)"
                        ></Checkbox>
                        <div class="text">
                            <div class="no">{{ item.order_no }}</div>
                            <div
                                class="copy brand"
                                v-clipboard:copy="item.order_no"
                                v-clipboard:success="onCopySuccess"
                                v-clipboard:error="onCopyError"
                            >
                                复制
                            </div>
                        </div>
                    </div>
                </div>
                <div class="td">
                    <div>
                        <div
                            class="item pl20"
                            v-for="(subItem, subIndex) in item.order_goods"
                            :key="subItem.id"
                        >
                            <Checkbox
                                v-model="subItem.checked"
                                @on-change="
                                    changeSecChecked(index, subIndex, $event)
                                "
                            ></Checkbox>
                            <div class="text">
                                <div class="name">
                                    <span
                                        class="mark"
                                        v-if="subItem.option_id !== '0'"
                                        >多</span
                                    >{{ subItem.title }}
                                </div>
                                <div class="spec" v-if="subItem.option_title">
                                    {{ subItem.option_title }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="td">
                    <div>
                        <div
                            class="item pl20"
                            v-for="subItem in item.order_goods"
                            :key="subItem.id"
                        >
                            <div class="text">
                                <div class="price">¥{{ subItem.price_unit }}</div>
                                <div class="num">x{{ subItem.total }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="td">
                    <div>
                        <div
                            class="item pl20"
                            v-for="subItem in item.order_goods"
                            :key="subItem.id"
                        >
                            <div
                                class="text"
                                :class="{
                                    warning: parseInt(subItem.print_num) === 0,
                                }"
                            >
                                <template
                                    v-if="parseInt(subItem.print_num) === 0"
                                >
                                    未打印
                                </template>
                                <template v-else>
                                    已打印<span class="success">
                                        {{ subItem.print_num }}
                                    </span>
                                    次
                                </template>
                                <!-- {{
                                    parseInt(subItem.print_num) !== 0
                                        ? `已打印${}次`
                                        : '未打印'
                                }} -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="td">
                    <div
                        class="text pl20"
                        :class="{
                            warning: item.is_bill_print === '0',
                        }"
                    >
                        <template
                            v-if="item.is_bill_print === '0'"
                        >
                            未打印
                        </template>
                        <template v-else>
                            已打印<span class="success">
                                {{ item.bill_print_num }}
                            </span>
                            次
                        </template>
                        <!-- {{
                            parseInt(subItem.print_num) !== 0
                                ? `已打印${}次`
                                : '未打印'
                        }} -->
                    </div>
                </div>
                <div class="td">
                    <div class="box pl20">
                        <div
                            class="text fwb warning"
                            v-if="item.status === '10'"
                        >
                            待发货
                        </div>
                        <div
                            class="text fwb warning"
                            v-if="item.status === '11'"
                        >
                            部分发货
                        </div>
                        <div class="text fwb brand" v-if="item.status === '20'">
                            待收货
                        </div>
                        <div
                            class="text fwb success"
                            v-if="item.status === '30'"
                        >
                            已完成
                        </div>
                    </div>
                </div>
                <div class="td">
                    <div class="box pl20">
                        <div class="text brand">{{ item.member_nickname }}</div>
                    </div>
                </div>
                <div class="td">
                    <div class="box pl20">
                        <div class="text">{{ item.buyer_name }}</div>
                        <div class="text">{{ item.buyer_mobile }}</div>
                    </div>
                </div>
                <div class="td">
                    <div class="box pl20">
                        <div class="text normal">{{ item.created_at }}</div>
                    </div>
                </div>
                <div class="td">
                    <div class="box pl20">
                        <div class="text fwb">￥{{ item.pay_price }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="nodata" v-else>暂无数据</div>
    </div>
</template>

<script>
export default {
    props: ['data'],
    data() {
        return {
            list: [],
            allSelectedFlag: false,
            indeterminate: false,
            disabled: false,
        }
    },
    methods: {
        // 点击全选
        changeAllSelected(value) {
            let arr_has_unPrinted = this.list.filter((item) => {
                return item.order_goods.some((subItem) => {
                    return parseInt(subItem.print_num) === 0 && !subItem.checked
                })
            })
            if (arr_has_unPrinted.length > 0) {
                this.list.forEach((item, index) => {
                    this.changeChecked(index, value)
                    let unChecked = item.order_goods.some((subItem) => {
                        return (
                            parseInt(subItem.print_num) === 0 &&
                            !subItem.checked
                        )
                    })
                    if (unChecked) {
                        this.changeChecked(index, value)
                    }
                })
            } else {
                this.list.forEach((item, index) => {
                    this.changeChecked(index, value)
                })
            }
        },
        // 点击单个订单编号
        changeChecked(index, value) {
            let checked = value
            // 打印过的商品
            // let arr_printed = this.list[index].order_goods.filter((item) => {
            //     return parseInt(item.print_num) !== 0
            // })
            // let unselected_printed = arr_printed.some((item) => {
            //     return item.checked === false
            // })
            // 未打印过的商品
            let arr_not_printed = this.list[index].order_goods.filter(
                (item) => {
                    return parseInt(item.print_num) === 0
                }
            )
            let unselected_not_printed = arr_not_printed.some((item) => {
                return item.checked === false
            })
            if (unselected_not_printed) {
                checked = true
            } else {
                checked = false
            }
            this.list[index].order_goods.forEach((item) => {
                if (parseInt(item.print_num) === 0) {
                    item.checked = checked
                } else {
                    if (!unselected_not_printed) {
                        item.checked = checked
                    }
                }
            })
            // 更新
            this.updateTable(index)
        },
        // 点击商品
        changeSecChecked(index, subIndex, value) {
            let checked = value
            // 是否打印过
            let isPrinted =
                parseInt(this.list[index].order_goods[subIndex].print_num) !== 0
            if (isPrinted && checked) {
                // 打印过的选中给提示
                this.$Modal.confirm({
                    title: '提示',
                    content: '您要打印的订单中包含已打印状态订单，是否继续？',
                    onOk: () => {
                        // 关联商品选中
                        let _print_relation = this.list[index].order_goods[
                            subIndex
                        ].print_relation
                        this.list[index].order_goods.forEach((item) => {
                            if (new Set(_print_relation).has(item.id)) {
                                item.checked = true
                            }
                        })
                        // 更新
                        this.updateTable(index)
                    },
                    onCancel: () => {
                        this.list[index].order_goods[subIndex].checked = false
                        // 更新
                        this.updateTable(index)
                    },
                })
            } else if (isPrinted && !checked) {
                // 打印过的取消选中 关联商品取消选中
                let _print_relation = this.list[index].order_goods[subIndex]
                    .print_relation
                this.list[index].order_goods.forEach((item) => {
                    if (new Set(_print_relation).has(item.id)) {
                        item.checked = false
                    }
                })
                // 更新
                this.updateTable(index)
            }
            // 更新
            this.updateTable(index)
        },
        // 更新
        updateTable(index) {
            // 是否有未选中
            let flag1 = this.list[index].order_goods.some((item) => {
                return item.checked === false
            })
            // 是否有已选中
            let flag2 = this.list[index].order_goods.some((item) => {
                return item.checked === true
            })
            // 是否有未打印过的
            let flag3 = this.list[index].order_goods.some((item) => {
                return parseInt(item.print_num) === 0
            })
            this.$nextTick(() => {
                this.list[index].checked = !flag1
                this.list[index].indeterminate = flag1 && flag2
                this.list[index].disabled = !flag2 && !flag3
                // 强刷页面
                this.list = this.list.slice(0)
                // 传值
                let res = this.getSelectedData()
                this.$emit('on-change', res)
            })
            // 强刷页面
            this.list = this.list.slice(0)
        },
        // 获取选中的商品
        getSelectedData() {
            // 有选中数据的订单
            let order_hasData = this.list.filter((item) => {
                return item.checked || item.indeterminate
            })
            // 筛选出订单中选中的商品
            order_hasData.forEach((item) => {
                item.selectedGoods = item.order_goods.filter((subItem) => {
                    return subItem.checked
                })
            })
            let res = order_hasData.map((item) => {
                return {
                    order_id: item.id,
                    order_goods_id: item.selectedGoods.map(
                        (subItem) => subItem.id
                    ),
                }
            })
            // 处理全选按钮状态
            if (order_hasData.length === 0) {
                // 一个没选
                this.allSelectedFlag = false
                this.indeterminate = false
                this.disabled = !this.list.some((item) => {
                    return item.disabled === false
                })
            } else {
                this.disabled = false
                if (order_hasData.length !== this.list.length) {
                    // 有未选中的订单
                    this.allSelectedFlag = false
                    this.indeterminate = true
                } else {
                    let indeterminate = order_hasData.some(
                        (item) => item.indeterminate
                    )
                    this.allSelectedFlag = !indeterminate
                    this.indeterminate = indeterminate
                }
            }
            return res
        },
        // 提示弹窗
        fnConfirm(content) {
            let _content =
                content || '您要打印的订单中包含已打印状态订单，是否继续？'
            return new Promise((resolve) => {
                this.$Modal.confirm({
                    title: '提示',
                    content: _content,
                    onOk: () => {
                        resolve('ok')
                    },
                    onCancel: () => {
                        resolve('cancel')
                    },
                })
            })
        },
        // 复制成功
        onCopySuccess() {
            this.$Message.success('内容已复制到剪切板！')
        },
        // 复制失败
        onCopyError() {
            this.$Message.error('抱歉，复制失败！')
        },
    },
    watch: {
        data: {
            handler(value) {
                this.list = [...value]
                this.list.forEach((item) => {
                    item.indeterminate = false
                    item.checked = false
                    if (item.order_goods && item.order_goods.length) {
                        item.order_goods.forEach((subItem) => {
                            subItem.checked = false
                        })
                        item.disabled = !item.order_goods.some((subItem) => {
                            return parseInt(subItem.print_num) === 0
                        })
                    } else {
                        item.disabled = true
                    }
                })
                // 重置全选按钮状态
                this.$nextTick(() => {
                    this.allSelectedFlag = false
                    this.indeterminate = false
                    this.disabled = !this.list.some((item) => {
                        return item.disabled === false
                    })
                })
            },
            deep: true,
        },
    },
}
</script>

<style scoped lang="scss">
.pl20 {
    padding-left: 16px;
}
.pr20 {
    padding-right: 16px;
}
.success {
    color: $success-color;
}
.warning {
    color: $warning-color;
}
.brand {
    color: $brand-color;
}
.danger {
    color: $danger-color;
}
.fwb {
    font-weight: bold;
}
.table-list {
    .tbody {
        .tr {
            margin-top: 10px;
            border: 1px solid $border-color;
        }
    }
    .tr {
        display: flex;
        border-bottom: 1px solid $border-color;
        &:hover {
            .td {
                .text {
                    .copy {
                        display: block;
                    }
                }
            }
        }
        /deep/ .ivu-checkbox-wrapper {
            margin-right: 0;
        }
        .th {
            padding-left: 16px;
            height: 62px;
            flex: 1;
            font-weight: bold;
            font-size: 12px;
            line-height: 20px;
            color: $text-first;
            display: flex;
            align-items: center;
            &:nth-child(1) {
                width: 150px;
                flex: none !important;
                .text {
                    padding-left: 10px;
                }
            }
            &:nth-child(2) {
                min-width: 300px;
                flex-shrink: 0;
                .text {
                    padding-left: 30px;
                }
            }
            &:nth-child(4) {
                width: 120px;
                flex: none !important;
            }
            &:nth-child(5),&:nth-child(6) {
                width: 100px;
                flex: none !important;
            }
        }
        .td {
            flex: 1;
            font-size: 12px;
            line-height: 20px;
            color: $text-first;
            display: flex;
            align-items: center;
            border-right: 1px solid $border-color;
            .copy {
                display: none;
            }
            .item {
                display: flex;
                align-items: center;
                border-bottom: 1px solid $border-color;
                height: 80px;
                &:last-child {
                    border-bottom: none;
                }
            }
            .text {
                word-break: break-all;
                &.normal {
                    word-break: normal;
                }
            }
            &:nth-child(1) {
                width: 150px;
                flex: none !important;
                .text {
                    cursor: pointer;
                    padding-left: 10px;
                }
            }
            &:nth-child(2) {
                min-width: 300px;
                flex-shrink: 0;
                > div {
                    flex: 1;
                }
                .item {
                    .text {
                        padding-left: 14px;
                        padding-top: 10px;
                        padding-bottom: 10px;
                        .name {
                            width: 240px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            .mark {
                                font-size: 12px;
                                color: #ed4014;
                                background-color: #ffefe6;
                                border-radius: 2px;
                                margin-right: 4px;
                                width: 18px;
                                height: 18px;
                                display: inline-block;
                                text-align: center;
                                line-height: 18px;
                                transform: scale(0.9);
                            }
                        }
                        .spec {
                            display: inline-block;
                            padding: 2px 8px;
                            font-size: 12px;
                            line-height: 16px;
                            color: $brand-color;
                            background-color: $brand-light;
                            transform: scale(0.9);
                        }
                    }
                }
            }
            &:nth-child(3) {
                > div {
                    flex: 1;
                }
            }
            &:nth-child(4) {
                font-weight: bold;
                width: 110px;
                flex: none !important;
                > div {
                    flex: 1;
                }
            }
            &:nth-child(5),&:nth-child(6) {
                width: 100px;
                flex: none !important;
            }
            &:last-child {
                border-right: none;
            }
        }
    }
    .nodata {
        text-align: center;
        padding-top: 20px;
        padding-bottom: 20px;
    }
}
@media screen and (max-width: 1500px) {
    .table-list {
        .tr {
            .th {
                &:nth-child(2) {
                    min-width: 230px;
                }
            }
            .td {
                &:nth-child(2) {
                    min-width: 230px;
                    .item {
                        .text {
                            .name {
                                width: 170px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
