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
    <td :rowspan="list.order_goods.length">
        <div class="shop-action action refund" v-if="hasRefundSuc(list.order_goods)">整单维权完成</div>
        <div class="shop-action action" v-else>
            <div class="order-status">
                <!--0代付款 10待发货 11部分发货 20待收货 30已完成-->
                <!--待成团-->
                <!--待发货-->
                <span class="wait-send-goods" v-if="list.status == '10'">待发货</span>
                <!--部分发货-->
                <span class="wait-send-goods" v-if="list.status === '11'">部分发货</span>
                <!--待付款-->
                <span class="wait-payment" v-else-if="list.status === '0'">待付款</span>
                <!--待收货-->

                <span class="wait-tack-goods" v-else-if="list.status === '20'">待收货</span>
                <!--已完成-->
                <span class="order-archive" v-else-if="list.status === '30'">已完成</span>
                <!--已关闭-->
                <span class="order-close" v-else-if="list.status === '-1'">已关闭</span>
            </div>
            <div class="btn" >
                <!--待发货-->
                <template v-if="list.status == '10'">
                    <template >
                        <Button type="text" @click="sendGoods(list)">确认发货</Button>
                        
                        <Button
                                type="text"
                                @click="editReceiveInfo(list)"
                        >修改收货信息
                        </Button>
                    </template>

                    <Button
                            type="text"
                            @click="generalRefund(list)"
                            v-if="list.pay_type != '3' && list.pay_type != '1'"
                    >退款
                    </Button>
                </template>
                <!--部分发货-->
                <template v-else-if="list.status === '11'">
                    <template>
                        <Button type="text" @click="sendGoods(list)">确认发货</Button>
                        <Button
                                type="text"
                                @click="cancelSendGoods(list)"
                        >取消发货
                        </Button>
                    </template>
                    <Button
                            type="text"
                            @click="generalRefund(list)"
                            v-if="list.pay_type != '3' && list.pay_type != '1'"
                    >退款
                    </Button>
                    <template>
                        <Button
                                type="text"
                                @click="editExpress(list)"
                        >修改物流
                        </Button>
                    </template>
                </template>
                <!--待付款-->
                <template v-else-if="list.status === '0'">
                    <Button  type="text" @click="confirmPayment(list)">确认付款
                    </Button>
                    <Button type="text"
                            @click="changePrice(list)">订单改价
                    </Button>
                    <Button type="text" @click="closeOrder(list)">关闭订单</Button>
                </template>
                <!--待收货-->
                <template v-else-if="list.status === '20' && list.dispatch_type!='20'">
                    <template>
                        <Button
                                type="text"
                                @click="confirmTakeGoods(list)"
                        >确认收货
                        </Button>
                        <!-- 虚拟商品不显示  -->
                        <Button
                                type="text"
                                @click="editExpress(list)"
                                v-if="goods.type === '0'"
                        >修改物流
                        </Button>
                        <!-- 实体商品货到付款、虚拟商品待收货且不能是维权订单 -->
                        <Button
                                type="text"
                                @click="generalRefund(list)"
                                v-if="(goods.type === '1'|| list.pay_type == '3')&& list.refund_type!='1'"
                        >退款
                        </Button>
                    </template>
                    <!-- 虚拟商品不显示  -->
                    <Button
                            type="text"
                            @click="packageExpress(list)"
                            v-if="goods.type === '0'"
                    >物流信息
                    </Button>
                </template>
            </div>
        </div>
    </td>
</template>

<script>
    export default {
        props: {
            list: {
                type: Object,
                default: () => ({})
            },
            goods: {
                type: Object,
                default: () => ({})
            },
            status: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                remark: "",
                is_refund_front: '1'
            };
        },
        methods: {
            // 判断有没有整单维权完成
            hasRefundSuc(list) {
                return list.every(
                    item => item.refund_status == 10 || item.refund_status == 11
                );
            },
            // 确认发货
            sendGoods(row) {
                this.$emit("sendGoods", row);
            },
            // 修改收货信息
            editReceiveInfo(row) {
                this.$emit("editReceiveInfo", row);
            },
            // 退款
            generalRefund(row) {
                this.$emit("generalRefund", row);
            },
            // 取消发货
            cancelSendGoods(row) {
                this.$emit("cancelSendGoods", row);
            },
            // 修改物流
            editExpress(row) {
                this.$emit("editExpress", row);
            },
            // 确认付款
            confirmPayment(row) {
                this.$Modal.confirm({
                    title: "提示",
                    content: "确认此单已付款吗？",
                    okText: "确认付款",
                    onOk: () => {
                        let obj = {
                            order_id: row.id,
                        };
                        // 进行确认付款操作
                        this.$api.orderApi
                            .setPayment(obj)
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success("确认付款操作成功");
                                    this.$emit("handleRefresh");
                                }
                            });
                    },
                    onCancel: () => {
                    }
                });
            },
            // 订单改价
            changePrice(row) {
                this.$emit("changePrice", row);
            },
            // 关闭订单
            closeOrder(row) {
                this.$Modal.confirm({
                    title: "是否关闭订单",
                    okText: "确认关闭",
                    onOk: () => {
                        let params = {
                            id: row.id,
                            remark: this.remark
                        };
                        this.$api.orderApi.closeOrder(params).then(res => {
                            if (res.error === 0) {
                                this.$Message.success("订单关闭成功");
                                this.$emit("handleRefresh");
                            }
                        });
                    },
                    onCancel: () => {
                    },
                    render: () => {
                        return (
                            <div>
                                <p style="padding-bottom:15px">请填写关闭订单原因</p>
                                <Input type="textarea" v-model={this.remark} autofocus maxlength="40" show-word-limit placeholder="请填写关闭订单原因"></Input>
                            </div>
                        );
                    }
                });
            },
            // 确认收货
            confirmTakeGoods(row) {
                this.$Modal.confirm({
                    title: "提示",
                    content: "确认此单已收到货了吗？",
                    okText: "确认收货",
                    onOk: () => {
                        // 进行确认收货操作
                        this.$api.orderApi
                            .setFinishOrder({order_id: row.id})
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success("订单确认收货成功");
                                    this.$emit("handleRefresh");
                                }
                            });
                    },
                    onCancel: () => {
                    }
                });
            },
            // 物流信息
            packageExpress(row) {
                this.$emit("packageExpress", row);
            }
        }
    };
</script>

<style lang="scss" scoped>
.danger {
    color: #ff3c29;
}
</style>
