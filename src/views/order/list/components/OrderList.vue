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
    <div class="order-table-list" v-loading="loading">
        <div class="order-table-list-box" ref="order_table">
            <div class="table-header">
                <table :style="{ width: `${tableWidth || checkWidth}px` }" style="border-collapse:collapse">
                    <colgroup align="left">
                        <col v-for="(column, index) in columns" :key="index + '_' + column.width" :width="column.width"/>
                    </colgroup>
                    <tr>
                        <th v-for="(column, index) in columns" :key="index">
                            <div class="table-cell">{{ column.title }}</div>
                        </th>
                    </tr>
                </table>
            </div>
            <template v-if="data.length > 0">
                <div v-for="list in data" :key="list.id" class="table-content">
                    <!--下单时间等等-->
                    <OrderListItemHead :item="list" :count-time="list.count_down_time" @on-refresh="handleRefresh"></OrderListItemHead>
                    <!--订单信息-->
                    <div class="table-order" v-if="list.order_goods && list.order_goods.length > 0">
                        <table :style="{ width: `${tableWidth || checkWidth}px` }" style="border-collapse:collapse">
                            <colgroup align="left">
                                <col
                                    v-for="(column, index) in columns"
                                    :key="index + '_' + column.width"
                                    :width="column.width"
                                />
                            </colgroup>
                            <!--合并单元格-->
                            <template v-if="list.order_goods.length > 0">
                                <tr v-for="(goods, index) in list.order_goods" :key="goods.id+ '_'  + index">
                                    <!--商品信息-->
                                    <TableTd1 :goods="goods"></TableTd1>
                                    <!--商品价格、数量-->
                                    <td>
                                        <div class="shop-price-number price">
                                            <!-- 其他普通商品单价 -->
                                            <p>￥{{ goods.price_unit }}</p>
                                            <p>X {{ goods.total }}</p>
                                        </div>
                                    </td>
                                    <!--商品维权状态-->
                                    <template v-if="cellStatus(list, index)">
                                        <TableTd3 :list="list" :goods="goods" :status="status"></TableTd3>
                                    </template>

                                    <template v-if="index === 0">
                                        <!--买家-->
                                        <td :rowspan="list.order_goods.length">
                                            <div class="shop-buyer buyer" v-if="list.buyer_name || list.buyer_mobile">
                                                <p>{{ list.buyer_name }}</p>
                                                <p>{{ list.buyer_mobile }}</p>
                                            </div>
                                            <template v-else>-</template>
                                        </td>
                                        <!--实付款-->
                                        <TableTd5 :list="list" :goods="goods"></TableTd5>
                                        <!--支付、配送-->
                                        <td :rowspan="list.order_goods.length">
                                            <div class="shop-payment delivery">
                                                <p>{{ list.pay_type_text }}</p>
                                                <p v-if="goods.type == '0' || ((goods.type == '1' || goods.type == '3'))">{{ list.dispatch_type_text }}</p>
                                            </div>
                                        </td>
                                        <!--操作-->
                                        <TableTd7
                                            :list="list"
                                            :goods="goods"
                                            :status="status"
                                            @sendGoods="sendGoods"
                                            @editReceiveInfo="editReceiveInfo"
                                            @generalRefund="generalRefund"
                                            @cancelSendGoods="cancelSendGoods"
                                            @editExpress="editExpress"
                                            @handleRefresh="handleRefresh"
                                            @changePrice="changePrice"
                                            @packageExpress="packageExpress"
                                        ></TableTd7>
                                    </template>
                                </tr>
                            </template>
                        </table>
                    </div>
                    <!--订单备注-->
                    <OrderComment :list="list" @click="editCommision(list)"></OrderComment>
                </div>
            </template>
            <div v-else style="text-align: center;padding: 20px 0">暂无数据</div>
        </div>
        <div class="table-footer" v-show="total >= 10">
            <kdx-page-component ref="page" :current='current' :pageSize='pageSize' :total="total" @on-change="handlePageChange"></kdx-page-component>
        </div>
        <!--确认发货-->
        <send-goods ref="send_goods" :id="modal.id" :dispatch_type="modal.dispatch_type" @on-refresh="handleRefresh"></send-goods>
        <!--分包裹---取消发货-->
        <cancel-send-goods ref="cancel_send_goods" :id="modal.id" @on-refresh="handleRefresh"></cancel-send-goods>
        <!--分包裹---修改快递-->
        <edit-express ref="edit_express" :id="modal.id" :package-id="modal.packageId" @on-refresh="handleRefresh"></edit-express>
        <!--订单改价-->
        <change-price ref="change_price" :id="modal.id" @on-refresh="handleRefresh"></change-price>
        <!--关闭订单-->
        <close-order ref="close_order" :visible="modal.closeOrder" :id="modal.id" :title="modal.title" @on-refresh="handleRefresh"></close-order>
        <!--查看物流-->
        <package-express ref="package_express" :id="modal.id" :package-id="modal.packageId"></package-express>
        <!--修改收货信息-->
        <edit-receiving-goods ref="edit_receiving_goods" :id="modal.id" :dispatch_type="modal.dispatch_type" @on-refresh="handleRefresh"></edit-receiving-goods>
        <!--退款-->
        <refund-modal ref="refund_modal" :id="modal.id" :pay_type="modal.pay_type" :good_type="modal.good_type" @on-refresh="handleRefresh"></refund-modal>
    </div>
</template>

<script>
import SendGoods from "@/views/order/components/SendGoods/index";
import CancelSendGoods from "@/views/order/components/CancelSendGoods/index";
import EditExpress from "@/views/order/components/EditExpress/index";
import ChangePrice from "@/views/order/components/ChangePrice/index";
import CloseOrder from "@/views/order/components/CloseOrder/index";
import PackageExpress from "@/views/order/components/PackageExpress/index";
import EditReceivingGoods from "@/views/order/components/EditReceiveGoods/index";
import RefundModal from "@/views/order/components/RefundModal";
import OrderListItemHead from "./OrderListItemHead";
import TableTd1 from "./OrderListTd1";
import TableTd3 from "./OrderListTd3";
import TableTd5 from "./OrderListTd5";
import TableTd7 from "./OrderListTd7";
import OrderComment from "./OrderComment";
export default {
     name: "OrderList",
    components: {
        SendGoods,
        CancelSendGoods,
        EditExpress,
        ChangePrice,
        CloseOrder,
        PackageExpress,
        EditReceivingGoods,
        RefundModal,
        OrderListItemHead,
        TableTd1,
        TableTd3,
        TableTd5,
        TableTd7,
        OrderComment,
    },
    props: {
        data: {
            type: Array,
            default: () => []
        },
        total: {
            type: Number,
            default: 0
        },
        loading: {
            type: Boolean,
            default: false
        },
        // 每页多少条
        pageSize: {
            type: Number,
            default: 10
        },
        // 当前页码
        current:{
            type: Number,
            default: 1
        },
        status: {
            type: [Number, String]
        },
        checkWidth:{
            type: [Number, String]
        },
    },
    data() {
        return {
            columns: [
                {
                    title: "商品",
                    key: "shop",
                    width: 350
                },
                {
                    title: "单价/数量",
                    key: "price",
                    width: 100
                },
                {
                    title: "维权状态",
                    key: "status",
                    width: 100
                },
                {
                    title: "买家",
                    key: "buyer",
                    width: 100
                },
                {
                    title: "实付款",
                    key: "payment",
                    width: 100
                },
                {
                    title: "支付/配送",
                    key: "delivery",
                    width: 100
                },
                {
                    title: "操作",
                    key: "action",
                    width: 100
                }
            ],
            cloneColumns: [],
            totalWidth: 0,
            tableWidth: 0,
            page: {
                total: 10
            },
            modal: {
                cancelSendGoodsModal: 0,
                editExpress: 0,
                changePrice: 0,
                closeOrder: 0,
                packageExpress: 0,
                title: "",
                id: "",
                packageId: "",
                dispatch_type: ""
            },
            commisionInfo: {}
        };
    },
    methods: {
        // 动态改变表格的width
        handleResize() {
            // 40 padding 2 border
            this.tableWidth = this.$refs["order_table"]?.offsetWidth - 40 - 1;
            let columnLength = this.columns.length;
            let columnWidth = Math.floor(
                (this.tableWidth - this.totalWidth) / columnLength
            );
            this.columns.forEach((item, index) => {
                let width = (this.cloneColumns[index].width || 0) + columnWidth;
                if (index === columnLength - 1) {
                    let totalWidth = this.getUpdateTotalWidth();
                    width = this.tableWidth - totalWidth + 100 || 0;
                }
                this.$set(this.columns[index], "width", width);
            });
        },
        // 深拷贝columns
        getCloneColumns() {
            this.cloneColumns = this.columns.map(item =>
                JSON.parse(JSON.stringify(item))
            );
        },
        // 获取columns的默认总宽度
        getTotalWidth() {
            this.totalWidth = 0;
            this.cloneColumns.forEach(item => {
                this.totalWidth += item.width || 0;
            });
        },
        // getUpdateTotalWidth() {
        getUpdateTotalWidth() {
            let totalWidth = 0;
            this.columns.forEach(item => {
                totalWidth += item.width || 0;
            });
            return totalWidth;
        },
        handlePageChange(page) {
            this.$emit("on-page-change", page);
        },
        // 确认发货
        sendGoods(row) {
            this.modal.id = row.id;
            this.modal.dispatch_type = row.dispatch_type;
            this.$nextTick(() => {
                console.log('this.$refs["send_goods"]', this.$refs["send_goods"])
                this.$refs["send_goods"]?.setValue();
            });
        },
        // 取消发货
        cancelSendGoods(row) {
            // 分包裹取消
            this.modal.id = row.id;
            this.$nextTick(() => {
                this.$refs["cancel_send_goods"].setValue();
            });
        },
        // 修改收货信息
        editReceiveInfo(row) {
            this.modal.id = row.id;
            this.modal.dispatch_type = row.dispatch_type;
            this.$nextTick(() => {
                this.$refs["edit_receiving_goods"].setValue();
            });
        },
        // 退款
        generalRefund(row) {
            this.modal.id = row.id;
            this.$nextTick(() => {
                this.$refs["refund_modal"].setValue();
            });
        },
        // 修改物流
        editExpress(row) {
            this.modal.id = row.id;
            if (this.data.status === "11") {
                this.modal.packageId = row.package_id;
            } else {
                this.modal.packageId = "";
            }
            this.$nextTick(() => {
                this.$refs["edit_express"].setValue();
            });
        },
        // 订单改价
        changePrice(row) {
            this.modal.id = row.id;
            this.$nextTick(() => {
                this.$refs["change_price"].setValue();
            });
        },
        // 物流信息
        packageExpress(row) {
            this.modal.id = row.id;
            this.modal.packageId = row.order_goods[0].package_id;
            this.$nextTick(() => {
                this.$refs["package_express"].setValue();
            });
        },
        reset(page) {

            this.$refs["page"]?.reset(page);
        },
        handleRefresh() {
            this.$emit("on-refresh");
        },
        cellStatus({ is_refund, refund_type }, index) {
            if (is_refund === "0" || refund_type === "1") {
                return index === 0;
            }
            if (refund_type === "2") {
                return true;
            }
        },
        editCommision({ id, member_id, order_no }) {
            this.$emit("on-edit", { id, member_id, order_no });
        }
    },
    filters: {
        getRefundText(status) {
            if (status === "1") {
                return "退款";
            } else if (status === "2") {
                return "退货退款";
            } else if (status === "3") {
                return "退货";
            } else {
                return "未维权";
            }
        }
    },
    beforeDestroy() {
        window.onresize = null;
    },
    mounted() {
        this.getCloneColumns();
        this.getTotalWidth();
        setTimeout(() => {
            this.handleResize();
        }, 500);
        // 监听窗口的变化
        window.addEventListener("resize", () => {
            setTimeout(() => {
                this.handleResize();
            }, 200);
        });
    }
};
</script>

<style scoped lang="scss">
.order-table-list {
    background-color: #ffffff;
    position: relative;
    .order-table-list-box {
        padding: 0 20px 20px 20px;
        margin-bottom: -2px;
        // 表头
        > .table-header {
            height: 64px;
            /*box-sizing: border-box;*/
            border-bottom: 1px solid $border-color;
            /*margin-bottom: 20px;*/
            > table {
                /*width: 100%;*/
                > tr {
                    /*width: 100%;*/
                    > th {
                        > .table-cell {
                            @include font-14-20-bold;
                            color: $text-first;
                            padding: 20px 15px;
                            box-sizing: border-box;
                            text-align: left;
                        }
                    }
                }
            }
        }
        // 表格内容
        > .table-content {
            border-top: 1px solid $border-color;
            border-left: 1px solid $border-color;
            border-radius: 2px;
            margin-top: 20px;

            // 订单信息
            /deep/ .table-order {
                > table {
                    /*width: 100%;*/
                    > tr {
                        /*width: 100%;*/
                        > td {
                            @include font-14-20;
                            color: $text-first;
                            padding: 20px 15px;
                            border-right: 1px solid $border-color;
                            border-bottom: 1px solid $border-color;

                            // 价格、数量
                            > .shop-price-number {
                                @include font-14-20-bold;
                            }

                            // 维权
                            .shop-status {
                                .refund-status-box {
                                    padding: 10px 0;
                                }
                                /deep/ .status-text {
                                    .status-text-size-default {
                                        font-size: 14px;
                                        font-weight: bold;
                                    }
                                }
                                .refund-status-text {
                                    padding: 2px 6px;
                                    background-color: $danger-light;
                                    border-radius: 2px;
                                    color: $danger-color;
                                    margin-bottom: 10px;
                                }
                            }

                            //实付款
                            .shop-payment {
                                > .shop-payment-price {
                                    @include font-14-20-bold;
                                }
                                .label {
                                    @include font-14-20;
                                    color: $danger-color;
                                    padding: 2px 6px;
                                    background-color: $danger-light;
                                    border-radius: 2px;
                                    margin-left: 6px;
                                }
                            }

                            // 操作
                            > .shop-action {
                                &.refund {
                                    color: #19be6b;
                                }
                                > .order-status {
                                    @include font-18-25-bold;
                                    padding-bottom: 10px;
                                    // 待发货
                                    .wait-send-goods {
                                        color: $warning-color;
                                    }

                                    // 待付款
                                    .wait-payment {
                                        color: $danger-color;
                                    }

                                    // 待收货
                                    .wait-tack-goods {
                                        color: $brand-color;
                                    }

                                    // 已完成
                                    .order-archive {
                                        color: $success-color;
                                    }

                                    // 已关闭
                                    .order-close {
                                        color: $text-third;
                                    }
                                }

                                > .btn {
                                    > .ivu-btn {
                                        margin-right: 20px;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 备注佣金
            /deep/.table-remark {
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                align-items: center;
                height: 50px;
                padding: 0 20px;
                @include font-14-20;
                border-bottom: 1px solid $border-color;
                border-right: 1px solid $border-color;

                > .left {
                    text-align: left;

                    > .remark {
                        color: $success-color;
                        background-color: $success-light;
                        border-radius: 2px;
                        padding: 2px 8px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }

                > .right {
                    flex: 1;
                    text-align: right;
                    .text {
                        color: $text-first;
                        padding-right: 10px;
                    }

                    .price {
                        color: $danger-color;
                    }
                }
            }
        }
    }

    // 分页
    > .table-footer {
        border-top: 1px solid $border-color;
        padding: 20px 0;
        display: flex;
        justify-content: center;
    }
}
</style>
