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
    <div>
        <!--订单状态-->
        <Row class="order-information" type="flex">
            <!-- 当前订单状态 -->
            <Col span="8" class="status-col">
                <!--待付款-->
                <template v-if="data.status === '0'">
                    <p class="title" style="padding-left: 0">
                        当前订单状态
                    </p>
                    <p class="big-title">
                        <img :src="image.payment" alt="">
                        <span class="title">待付款</span>
                    </p>

                    <Button type="primary" :disabled='!permMap.pay' class="status-btn" @click="confirmPayment">
                        确认付款
                    </Button>
                    <kdx-hint-text>
                        友情提示：如果无法进行发货，请及时联系买家
                    </kdx-hint-text>
                    <div class="footer-btn">
                        <Button class="default-primary" :disabled='!permMap.change_price'
                                @click="changePrice">
                            订单改价
                        </Button>
                        <Button class="default-primary" v-if="goods_type != '2' && data.order_type != '40'" :disabled='!permMap.edit_address' @click="editReceiveInfo">
                            修改收货信息
                        </Button>
                        <Button class="default-primary" :disabled='!permMap.close' @click="closeOrder">
                            关闭订单
                        </Button>
                    </div>

                </template>
                <!--待发货-->
                <template v-else-if="data.status === '10'">
                    <p class="title" style="padding-left: 0">
                        当前订单状态
                    </p>
                    <p class="big-title">
                        <img :src="image.send" alt="">
                        <span class="title">待发货</span>
                    </p>

                    <template>
                        <Button :disabled='!permMap.send' type="primary" @click="sendGoods" class="status-btn">确认发货</Button>
                        <kdx-hint-text>
                            友情提示：如果无法进行发货，请及时联系买家
                        </kdx-hint-text>
                    </template>
                    <div class="footer-btn">
                        <Button v-if=" data.goods_info[0].type != '2' && data.order_type != '40'" class="default-primary" :disabled='!permMap.edit_address' @click="editReceiveInfo">
                            修改收货信息
                        </Button>
                        <Button class="default-primary" :disabled='!permMap.close_refund' @click="generalRefund"
                                v-if="data.pay_type != '3' && data.pay_type != '1'">
                            退款
                        </Button>
                    </div>
                </template>
                <!--部分发货-->
                <template v-else-if="data.status === '11'">
                    <p class="title" style="padding-left: 0">
                        当前订单状态
                    </p>
                    <p class="big-title">
                        <img :src="image.send" alt="">
                        <span class="title">部分发货</span>
                    </p>
                        <Button type="primary" :disabled='!permMap.send' class="status-btn" @click="sendGoods">确认发货</Button>
                        <kdx-hint-text>
                            友情提示：如果无法进行发货，请及时联系买家
                        </kdx-hint-text>
                    <div class="footer-btn" >
                        <Button  class="default-primary" :disabled='!permMap.edit_address' @click="editReceiveInfo">
                            修改收货信息
                        </Button>
                        <Button class="default-primary" :disabled='!permMap.close_refund' @click="generalRefund"
                                v-if="data.pay_type != '3' && data.pay_type != '1'">
                            退款
                        </Button>
                    </div>
                </template>
                <!--待收货-->
                <template v-else-if="data.status === '20'">
                    <p class="title" style="padding-left: 0">
                        当前订单状态
                    </p>
                    <p class="big-title">
                        <img :src="image.put" alt="">
                        <span class="title">{{'待收货'}}</span>
                    </p>
                        <Button type="primary" :disabled='!permMap.finish' class="status-btn" @click="confirmTakeGoods">
                            确认收货
                        </Button>
                        <kdx-hint-text>
                            友情提示：如果无法进行发货，请及时联系买家
                        </kdx-hint-text>

                    <div class="footer-btn" >
                        <div style="display: inline-block" >
                            <Button class="default-primary" :disabled='!permMap.cancel_send' @click="cancelSendGoods"
                                    v-if="goods_type === '0' && data.scene != '20'">
                                取消发货
                            </Button>
                            <Button class="default-primary" :disabled='!permMap.edit_address' @click="editReceiveInfo"
                                    v-if="goods_type === '0' && data.order_type != '40'">
                                修改收货信息
                            </Button>
                            <!-- 实体商品货到付款待收货或者虚拟商品的待收货状态 -->
                            <Button class="default-primary" :disabled='!permMap.close_refund' @click="generalRefund" v-if="data.pay_type == '3' || goods_type === '1'">退款</Button>
                        </div>
                        <template>
                            <Button class="default-primary" @click="generalRefund" v-if="data.scene != '20'" :disabled='!permMap.close_refund'>退款</Button>
                        </template>
                    </div>
                </template>
                <!--交易完成-->
                <template v-else-if="data.status === '30'">
                    <p class="title" style="padding-left: 0">
                        当前订单状态
                    </p>
                    <p class="big-title finish">
                        <span class="iconfont icon-zujian-yingxiaoxinxi-duihao"></span>
                        <span class="title">交易完成</span>
                    </p>
                </template>
                <!--交易关闭-->
                <template v-else-if="data.status === '-1'">
                    <p class="title" style="padding-left: 0">
                        当前订单状态
                    </p>
                    <p class="big-title close">
                        <span class="iconfont icon-del"></span>
                        <span class="title">交易关闭</span>
                    </p>
                    <p class="time-out word-break">
                        {{data.cancel_reason || data.refund_reason||''}}
                    </p>
                </template>
                <p class="title" style="padding: 30px 0 0 0;" v-if="showPrintText">打印</p>
                <div class="footer-btn">
                    <Button class="default-primary" @click="jumpEOrder" :disabled="noManagePerm" v-if="hasOrderSheet(data) && !data.not_show_express">电子面单</Button>
                    <Button v-if="permMap.printer" class="default-primary" @click="handlePrinter">小票</Button>
                    <Button class="default-primary" @click="jumpEOrder" :disabled="noManagePerm" v-if="hasOrderSheet(data) && !data.not_show_express">发货单</Button>
                </div>
            </Col>
            <!-- 发货信息 -->
            <Col span="8">
                <p class="title">
                    发货信息
                </p>
                <Form :label-width="100">
                    <FormItem label="配送方式：">
                        <div class="dispatch-type flex">
                            <template v-if="goods_type === '0' || (goods_type == '1' && data.dispatch_type =='20')">
                                <img class="dispatch_img" :src="getDeliveryImg" />
                                <span class="text">{{getDispatch}}</span>
                            </template>
                            <template v-else-if="goods_type === '1' && auto_deliver === '1'">
                                <img class="dispatch_img" :src="getDeliveryImg" />
                                <span class="text">自动发货（虚拟物品）</span>
                            </template>
                            <template v-else-if="goods_type === '2' && auto_deliver === '1'">
                                <img class="dispatch_img" :src="getDeliveryImg" />
                                <span class="text">自动发货（虚拟卡密）</span>
                            </template>
                            <template v-else>-</template>
                        </div>
                    </FormItem>
                    <!-- 虚拟商品不显示 -->
                    <FormItem label="收货人姓名：" v-if="goods_type === '0'">
                        <template v-if="data.buyer_name">
                            {{data.buyer_name}}
                        </template>
                        <template v-else>
                            -
                        </template>
                    </FormItem>
                    <!-- 虚拟商品不显示 -->
                    <FormItem label="联系方式：" v-if="goods_type === '0'">
                        <template v-if="data.buyer_mobile">
                            <span>{{data.buyer_mobile}}</span>
                            <kdx-copy-text :text="data.buyer_mobile">
                                <Button type="text" size="small">复制</Button>
                            </kdx-copy-text>
                        </template>
                        <template v-else>
                            -
                        </template>
                    </FormItem>
                    <!-- 虚拟商品不显示 -->
                    <FormItem label="收货地址：" v-if="goods_type === '0'">
                        <div class="paragraph">
                            <template v-if="addressDetail">
                                <span>{{addressDetail}}</span>
                                <kdx-copy-text :text="addressDetail">
                                    <Button type="text" size="small">复制</Button>
                                </kdx-copy-text>
                            </template>
                            <template v-else>-</template>
                        </div>
                    </FormItem>
                    <!-- 虚拟商品不显示 -->
                    <FormItem label="物流单号：" v-if="goods_type === '0'">
                        <div class="paragraph">
                            <template v-if="data.package_info">
                                <ul class="logistics">
                                    <li v-for="(item, index) in data.package_info" :key="index">
                                        <div class="tag" v-if="data.send_type === 1">{{ `包裹${index + 1}` }}</div>
                                        <div class="name">{{ item.express_com }}</div>
                                        <div class="number">{{ item.express_sn }}</div>
                                        <kdx-copy-text :text="item.express_sn">
                                            <Button type="text" size="small">复制</Button>
                                        </kdx-copy-text>
                                    </li>
                                </ul>
                            </template>
                            <template v-else>-</template>
                        </div>
                    </FormItem>
                    <FormItem label="发货内容：" v-if="goods_type === '1' && auto_deliver_content">
                        <!-- 虚拟商品显示发货内容 -->
                        <div class="paragraph">
                            <template>
                                <span>{{ auto_deliver_content }}</span>
                                <kdx-copy-text :text="auto_deliver_content">
                                    <Button type="text" size="small">复制</Button>
                                </kdx-copy-text>
                            </template>
                        </div>
                    </FormItem>
                    <!-- 虚拟卡密商品显示 -->
                    <FormItem label="发货内容：" v-if="goods_type === '2'">
                        <div class="paragraph">
                            <template>
                                <div v-if="virtual_setting.config">
                                    <span class="goAddress" @click="deliveryContent">查看发货内容</span>
                                </div>
                                <span v-else>-</span>
                            </template>
                        </div>
                    </FormItem>
                    <FormItem :label="virtual_setting.use_address && virtual_setting.use_address != '0' ?virtual_setting.use_address_title : '使用地址：'" v-if="goods_type === '2'" class="overText">
                        <div class="paragraph">
                            <template v-if="virtual_setting.use_address!='0'">
                                <span>： {{virtual_setting.use_address_address || '-'}}</span>
                                <span class="goAddress" @click="goAddress(virtual_setting.use_address_address)">查看地址</span>
                            </template>
                            <template v-else>
                                <span>-</span>
                            </template>
                        </div>
                    </FormItem>
                    <FormItem label="邮箱地址：" v-if="goods_type === '2'">
                        <div class="paragraph">
                            <template >
                                <span>{{data.to_mailer || '-'}}</span>
                            </template>
                        </div>
                    </FormItem>
                    <FormItem label="买家备注：">
                        <span class="paragraph">
                            <template v-if="data.buyer_remark">
                                    {{data.buyer_remark}}
                            </template>
                            <template v-else>
                                -
                            </template>
                        </span>
                    </FormItem>
                    <FormItem label="发票信息：">
                        <template v-if="isInvoiceInfo">
                            <Button type="text" @click="packageInvoiceInfo">查看发票信息</Button>
                            <span class="no-invoice" v-if="data.invoice_info.status == '0'">
                                <span>未开票</span>
                            </span>
                        </template>
                        <template v-else>
                            无
                        </template>
                    </FormItem>

                </Form>
            </Col>
            <Col span="8">
                <p class="title">
                    订单信息
                </p>
                <Form :label-width="100">
                    <FormItem label="会员：">
                        <div class="vip-name line-hide" @click="jumpPage(data.member_id)">{{data.member_nickname}}</div>
                    </FormItem>
                    <FormItem label="订单类型：">
                        <!-- 秒杀 -->
                        <span class="flex" v-if="data.activity_type == 2">
                            <span v-if="is_Seckill" class="iconfont icon-dingdanliebiao-miaosha seckill-icon"></span>
                            秒杀订单
                        </span>
                        <span v-else>普通订单</span>
                    </FormItem>

                    <FormItem label="订单编号：" class="order-no">
                        <div class="flex">
                            <!--微信图标 订单来源 10:wap-h5 20:公众号 21:微信小程序 30:字节跳动小程序 50:PC-->
                            <!--公众号-->
                            <span v-if="data.create_from == '20'" class="iconfont icon-weixin icon"></span>
                            <!--微信小程序-->
                            <span v-if="data.create_from == '21'" class="iconfont icon-weixinxiaochengxu icon"></span>
                            <!--头条小程序-->
                            <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2"
                                      v-else-if="data.create_from == '30'"></kdx-svg-icon>
                            <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban"
                                      v-else-if="data.create_from == '32'"></kdx-svg-icon>
                            <!--抖音小程序-->
                            <kdx-svg-icon class="iconfont" type="icon-douyin"
                                      v-else-if="data.create_from == '31'"></kdx-svg-icon>
                            <!--支付宝小程序-->
                            <!--<span v-if="data.create_from === '3'" class="iconfont icon-zhifubaoxiaochengxu icon"></span>-->
                            <!--百度小程序-->
                            <!--<span v-if="data.create_from === '0'" class="iconfont icon-baiduxiaochengxu icon"></span>-->
                            <!--h5-->
                            <span v-if="data.create_from == '10'" class="iconfont icon-H icon"></span>
                            <span>{{data.order_no}}</span>
                            <kdx-copy-text :text="data.order_no">
                                <Button type="text" size="small">复制</Button>
                            </kdx-copy-text>
                        </div>
                    </FormItem>
                    <FormItem label="支付方式：">
                        <!--图标/图片-->
                        <!--后台确认-->
                        <!--支付类型 1 后台确认2 余额支付3 货到付款20 微信支付 30 支付宝支-->
                        <template v-if="data.pay_type === '1'">
                            <payment-tag type="houtai"></payment-tag>
                        </template>
                        <!--余额支付-->
                        <template v-else-if="data.pay_type === '2'">
                            <payment-tag type="balance"></payment-tag>
                        </template>
                        <!--货到付款-->
                        <template v-else-if="data.pay_type === '3'">
                            <payment-tag type="payDelivery"></payment-tag>
                        </template>
                        <!--微信支付-->
                        <template v-else-if="data.pay_type === '20'">
                            <payment-tag type="weichat"></payment-tag>
                        </template>
                        <!--支付宝支付-->
                        <template v-else-if="data.pay_type === '30'">
                            <payment-tag type="alipay"></payment-tag>
                        </template>
                        <!--字节跳动支付-->
                        <template v-else-if="data.pay_type === '40' || data.pay_type === '41'">
                            <payment-tag type="byte_dance"></payment-tag>
                        </template>
                        <span v-else>
                            <payment-tag type="noPay" :status="data.status"></payment-tag>
                        </span>
                    </FormItem>
                    <FormItem label="交易单号：">
                        <!--交易单号存在-->
                        <template v-if="data.trade_no&&data.trade_no !== '0'">
                            <span>{{data.trade_no}}</span>
                            <kdx-copy-text type="qrCode" :text="data.trade_no">
                                <Button type="text" size="small">复制</Button>
                            </kdx-copy-text>
                        </template>
                        <template v-else>
                            -
                        </template>
                    </FormItem>

                    <FormItem label="外部交易单号：">
                        <!--外部交易单号-->
                        <template v-if="data.out_trade_no&&data.out_trade_no !== '0'">
                            <span>{{data.out_trade_no}}</span>
                            <kdx-copy-text type="qrCode" :text="data.out_trade_no">
                                <Button type="text" size="small">复制</Button>
                            </kdx-copy-text>
                        </template>
                        <template v-else>
                            -
                        </template>
                    </FormItem>

                    <FormItem label="商家备注：" v-if="data.seller_remark">
                        <span class="paragraph">
                                {{data.seller_remark}}
                        </span>
                    </FormItem>
                </Form>
            </Col>
        </Row>
        <!--确认发货-->
        <send-goods ref="send_goods" :id="modal.id" :dispatch_type="modal.dispatch_type"
                    @on-refresh="handleRefresh"></send-goods>
        <!--修改收货信息-->
        <edit-receiving-goods ref="edit_receiving_goods" :id="modal.id" :dispatch_type="modal.dispatch_type"
                              @on-refresh="handleRefresh"></edit-receiving-goods>
        <!--订单改价-->
        <change-price ref="change_price" :id="modal.id" @on-refresh="handleRefresh"></change-price>
        <!--关闭订单-->
        <close-order ref="close_order" :visible="modal.closeOrder" :id="modal.id" :title="modal.title"
                     @on-refresh="handleRefresh"></close-order>
        <!--分包裹---取消发货-->
        <cancel-send-goods ref="cancel_send_goods" :id="modal.id" @on-refresh="handleRefresh"></cancel-send-goods>
        <!--发票-->
        <invoice-info ref="invoice_info" :data="invoiceInfo.data" :price="invoiceInfo.price" :id="modal.id"
                      @on-refresh="handleRefresh"></invoice-info>
        <!--退款-->
        <refund-modal ref="refund_modal" :id="modal.id" @on-refresh="handleRefresh"></refund-modal>
        <!-- 小票打印 -->
        <kdx-modal-frame v-model="printerModal" title="请选择相关信息" :width="610" @on-cancel="printerCancel" @on-ok="printerOk">
            <div class="printer-modal">
                <Form ref="form" :label-width="120" :model="printerModelData" :rules="rules" @submit.native.prevent>
                    <FormItem label="打印机：" prop="printer_id">
                        <Select class="width-340" v-model="printerModelData.printer_id" placeholder="请选择打印机">
                            <Option v-for="item in printerList" :key="item.id" :value="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="打印模板：" prop="template_id">
                        <Select class="width-340" v-model="printerModelData.template_id" placeholder="请选择打印模板">
                            <Option v-for="item in templateList" :key="item.id" :value="item.id">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
        </kdx-modal-frame>
        <!-- 卡密商品发货内容 -->
        <delivery-content v-model="deliverModal" :virtual="virtual"></delivery-content>
    </div>
</template>

<script>
    import EditReceivingGoods from '@/views/order/components/EditReceiveGoods/index';
    import SendGoods from '@/views/order/components/SendGoods/index';
    import ChangePrice from '@/views/order/components/ChangePrice/index';
    import CloseOrder from '@/views/order/components/CloseOrder/index';
    import CancelSendGoods from '@/views/order/components/CancelSendGoods/index';
    import InvoiceInfo from '@/views/order/components/InvoiceInfo/index';
    import PaymentTag from "@/components/little/PaymentTag";
    import RefundModal from "@/views/order/components/RefundModal";
    import DeliveryContent from "@/views/order/components/DeliveryContent/index"

    export default {
        name: "OrderStatus",
        components: {
            EditReceivingGoods,
            SendGoods,
            ChangePrice,
            CloseOrder,
            CancelSendGoods,
            InvoiceInfo,
            PaymentTag,
            RefundModal,
            DeliveryContent, //卡密商品的发货内容
        },
        props: {
            data: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                modal: {
                    cancelSendGoodsModal: 0,
                    editExpress: 0,
                    changePrice: 0,
                    closeOrder: 0,
                    packageExpress: 0,
                    invoiceInfo: 0,
                    title: '',
                    id: '',
                    dispatch_type: '',
                },
                image: {
                    payment: require('@/assets/image/order/payment.png'),
                    put: require('@/assets/image/order/put.png'),
                    send: require('@/assets/image/order/send.png')
                },
                invoiceInfo: {
                    data: {},
                    price: '',
                    status: true
                },
                printerList: [],
                templateList: [],
                printerModal: false,
                printerModelData: {
                    printer_id: '',
                    template_id: '',
                    order_id: '',
                },
                rules: {
                    printer_id: [
                        {required: true, message: '请输入打印机名称'}
                    ],
                    template_id: [
                        {required: true, message: '请选择打印模板'}
                    ],
                },
                remark: "",
                is_refund_front: '1',
                virtual: [], //虚拟卡密发货内容展示数据
                deliverModal: false,
                virtual_setting: {
                    to_mailer: "",
                    use_address: "0",
                    use_address_address: "",
                    use_address_title: "使用地址",
                    use_description: "0",
                    use_description_remark: "",
                    use_description_title: "使用说明",
                }
            };
        },
        watch: {
            data: {
                handler(){
                    this.isCheck()
                }
            }
        },
        computed: {
             // 是否秒杀活动
            is_Seckill(){
                return this.data.activity_type ==2
            },
            // 发票是否存在
            isInvoiceInfo() {
                let is_company = this.data?.invoice_info?.is_company; // 1个人 2企业
                return is_company && (is_company == '1' || is_company == '2');
            },
            // 收货地址
            addressDetail() {
                return this.data.address_state + this.data.address_city + this.data.address_area + this.data.address_detail;
            },
            // 自动发货
            auto_deliver() {
                return this.data.goods_info?.[0]?.auto_deliver
            },
            // 自动发货内容
            auto_deliver_content() {
                return this.data.goods_info?.[0]?.auto_deliver_content
            },
            // 判断是否为虚拟商品
            goods_type() {
                return this.data.goods_info?.[0]?.type
            },
            permMap() {
                //权限
                let permMap = {};
                if (this.$getPermMap("order.op.view")) {
                    //查看权限
                    permMap.view = true;
                    permMap.send = this.$getPermMap("order.op.send"); //发货
                    permMap.edit_address = this.$getPermMap(
                        "order.op.edit_address"
                    ); //修改收货信息
                    permMap.close_refund = this.$getPermMap(
                        "order.op.close_refund"
                    ); //退款
                    permMap.cancel_send = this.$getPermMap("order.op.cancel_send"); //取消发货
                    permMap.pay = this.$getPermMap("order.op.pay"); //确认付款
                    permMap.change_price = this.$getPermMap(
                        "order.op.change_price"
                    ); //订单改价
                    permMap.close = this.$getPermMap("order.op.close"); //关闭订单
                    permMap.finish = this.$getPermMap("order.op.finish"); //确认收货
                    }
                if (this.$getPermMap("printer.index.view")) {
                    // 小票权限
                    permMap.printer = true;
                }
                return permMap;
            },
            noManagePerm() {
                // 管理权限
                return !this.$getPermMap('expressHelper.print.manage')
            },
            // 是否显示打印文字
            showPrintText() {
                return (1 === +this.data?.icon?.electronic_sheet) || (this.permMap.printer)
            },
            // 获取快递配送方式
            getDispatch(){
                const dispatchOpt = {
                    '10': '快递',
                }
                return dispatchOpt[this.data.dispatch_type] || '快递'
            },
            getDeliveryImg() {
                let imgSrcObj = {
                    '10': 'order/delivery_map.png',
                    '0': 'order/delivery_auto.png'
                }

                let src = imgSrcObj[this.data.dispatch_type] || 'order/delivery_map.png'
                if (src) {
                    return this.$utils.staticImg(src)
                }
                return ''
            },
            getDeliverName() {
                let dispatchOpt = {
                    30: '配送时间'
                }
                return dispatchOpt[this.data.dispatch_type];
            },
            // 配送时间字段
            getDeliverTime() {
                return this.data?.extra_package?.delivery_time && this.data?.extra_package?.delivery_time !== '0000-00-00 00:00:00'
                        ? this.data?.extra_package?.delivery_time : '';
            }
        },
        methods: {
            // 确认发货
            sendGoods() {
                this.modal.id = this.data.id;
                this.modal.dispatch_type = this.data.dispatch_type
                this.$nextTick(() => {
                    this.$refs['send_goods'].setValue();
                });
            },
            // 退款
            generalRefund() {
                this.modal.id = this.data.id;
                this.$nextTick(() => {
                    this.$refs['refund_modal'].setValue();
                });
            },
            // 修改收货信息
            editReceiveInfo() {
                this.modal.id = this.data.id;
                this.modal.dispatch_type = this.data.dispatch_type;
                this.$nextTick(() => {
                    this.$refs['edit_receiving_goods'].setValue();
                });
            },
            // 订单改价
            changePrice() {
                this.modal.id = this.data.id;
                this.$nextTick(() => {
                    this.$refs['change_price'].setValue();
                });
            },
            // 关闭订单
            closeOrder() {
                this.$Modal.confirm({
                    title: '是否关闭订单',
                    okText: '确认关闭',
                    onOk: () => {
                        let params = {
                            id: this.data.id,
                            remark: this.remark
                        };
                        this.$api.orderApi.closeOrder(params)
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('订单关闭成功');
                                    this.handleRefresh();
                                }
                            });
                    },
                    onCancel: () => {
                    },
                    render: () => {
                        return (
                            <div>
                                <p style="padding-bottom:15px">请填写关闭订单原因</p>
                                <Input type="textarea" v-model={this.remark} maxlength="40" show-word-limit autofocus placeholder="请填写关闭订单原因"></Input>
                            </div>
                        );
                    },
                });
            },
            // 取消发货
            cancelSendGoods() {
                // 整单取消
                // 分包裹取消
                this.modal.id = this.data.id;
                this.$nextTick(() => {
                    this.$refs['cancel_send_goods'].setValue();
                });
            },
            // 查看发票信息
            packageInvoiceInfo() {
                this.modal.id = this.data.id;
                this.invoiceInfo.data = this.data.invoice_info;
                this.invoiceInfo.price = this.data.pay_price;
                this.$nextTick(() => {
                    this.$refs['invoice_info'].setValue();
                });
            },
            // 确认付款
            confirmPayment() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认此单已付款吗？',
                    okText: '确认付款',
                    onOk: () => {
                        let obj = {
                            order_id: this.data.id,
                        };
                        // 进行确认付款操作
                        this.$api.orderApi.setPayment(obj)
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('确认付款操作成功');
                                    this.handleRefresh();
                                }
                            });
                    },
                    onCancel: () => {
                    }
                });
            },
            // 确认收货
            confirmTakeGoods() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认此单已收到货了吗？',
                    okText: '确认收货',
                    onOk: () => {
                        // 进行确认收货操作
                        this.$api.orderApi.setFinishOrder({order_id: this.data.id})
                            .then(res => {
                                if (res.error === 0) {
                                    this.$Message.success('订单确认收货成功');
                                    this.handleRefresh();
                                }
                            });
                    },
                    onCancel: () => {

                    }
                });
            },
            handleRefresh() {
                this.$emit('on-refresh');
            },
            // 跳转电子面单打印
            jumpEOrder() {
                let url = `/eOrder/orderPrint/index?order_no=${this.data.order_no}`
                this.$utils.openNewWindowPage(url)
            },
            // 打印小票
            handlePrinter() {
                this.$api.printerApi.printerList({only_list: 1, status: 1}).then(res => {
                    if (res.error == 0) {
                        if (res.data.length <= 0) {
                            this.toPrinterList()
                        } else {
                            this.printerList = res.data;
                            this.checkPrinter(this.data.id)
                        }
                    }
                })
            },
            toPrinterList() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '您当前还未配置打印机，立即前往进行配置。',
                    okText: '立即配置',
                    cancelText: '暂不配置',
                    onOk: () => {
                        this.$utils.openNewWindowPage('/printer/manage/list');
                    },
                    onCancel: () => {

                    }
                });
            },
            getPrinterTemList() {
                this.$api.printerApi.getPrinterTemList({only_list: 1}).then(res => {
                    if (res.error == 0) {
                        this.templateList = res.data;
                        this.printerModal = true;
                    }
                })
            },
            checkPrinter(id) {
                this.$api.printerApi.executePrinter({order_id: id, is_check: 1}).then(res => {
                    if (res.error == 0) {
                        this.printerModelData.order_id = id;
                        if (res?.message > 0) {
                            this.checkPrinterNum(res.message)
                        } else {
                            this.getPrinterTemList()
                        }
                    }
                })
            },
            checkPrinterNum(num) {
                this.$Modal.confirm({
                    title: '提示',
                    content: `您已经打印${num}次，是否继续打印`,
                    okText: '立即打印',
                    cancelText: '暂不打印',
                    onOk: () => {
                        this.getPrinterTemList()
                    },
                    onCancel: () => {

                    }
                });
            },
            printerCancel() {
                this.printerModal = false;
            },
            printerOk() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.$api.printerApi.executePrinter(this.printerModelData).then(res => {
                            if (res.error == 0) {
                                this.$Message.success('打印成功');
                            }
                            this.printerModal = false;
                        })
                    }
                });
            },
            // 判断显示发货单和电子面单
            hasOrderSheet(item) {
                return item.icon?.electronic_sheet === 1
            },
            // 虚拟卡密商品-发货信息展示
            isCheck() {
                this.virtual = this.data?.virtual_account_data || [];
                if(this.virtual.length >0) {
                    this.virtual.forEach((item,index) => {
                        this.$set(item,'ischeck', false)
                        let config = JSON.parse(item.config), itemData = JSON.parse(item.data)
                        if(config.length>0) {
                            config.forEach((secItem,index)=> {
                                this.$set(secItem,'ischeck', false)
                                if(itemData[`value${index+1}`].length> 28) {
                                    this.$set(item,'is_wrap',true)
                                }
                            })
                        }
                        item.config = config
                        item.data = itemData
                        if(index == 0) {
                            this.virtual_setting = {...item}
                        }
                    })
                }
            },
            //虚拟卡密发货内容
            deliveryContent() {
                this.deliverModal = true
            },
            // 卡密商品使用地址 点击跳转
            goAddress(url) {
                if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1 ) {
                    window.open(url)
                }else {
                    window.open('http://' + url)
                }
            },
            // 会员跳转
            jumpPage(id) {
                this.$utils.openNewWindowPage('/member/detail',{id: id})
            },
        }
    };
</script>

<style scoped lang="scss">
    .order-information {
        padding-bottom: 40px;
        align-items: stretch;
        // form 字体调整
        /deep/ .ivu-form {
            //对卡密使用地址特殊处理
            /deep/ .overText {
                .ivu-form-item-label {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
            .ivu-form-item-label {
                @include font-12-16;
                padding: 0;
            }

            .ivu-form-item-content {
                @include font-12-16;
                // transform: translateY(-4px);
                &:hover {
                    .copy-text {
                        display: inline-block;
                    }
                }

                .copy-text {
                    display: none;

                    .ivu-btn {
                        height: 12px;
                        vertical-align: inherit;
                    }
                }

                .paragraph {
                    @include font-12-18;
                    word-break: break-all;
                    .logistics {
                        li {
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;
                            &:last-child {
                                margin-bottom: 0;
                            }
                            .tag {
                                padding: 2px 8px;
                                line-height: 16px;
                                background-color: #F4F6F8;
                                color: #636669;
                                margin-right: 4px;
                                min-width: 56px;
                                text-align: center;
                            }
                            .number {
                                margin-left: 10px;
                            }
                        }
                    }
                }

                .ivu-btn {
                    @include font-12-16;
                    transform: translateY(-1px);
                }

                .icon-weixin {
                    color: $success-color;
                }
                .icon-weixinxiaochengxu {
                    color: $channel-weixinxiaochengxu;
                }
                .icon-toutiaoxiaochengxu {
                    color: #239BFF;
                }

                .icon-zhifubaoxiaochengxu {
                    color: #2094E7;
                }

                .icon-baiduxiaochengxu {
                    color: #306CFF;
                }

                .icon-H {
                    color: #FF6004;
                }
                // 配送方式
                .dispatch-type {
                    align-items:center;
                    .dispatch_img {
                        height: 18px;
                        width: 18px;
                    }

                    .icon-peisongfangshi-huodaofukuan {
                        color: $warning-color;
                    }
                    .text {
                        vertical-align: text-bottom;
                        padding-left: 4px;
                    }
                }
                .vip-name {
                    color: $brand-color;
                    cursor: pointer;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width:100%;
                    display: block;
                }
            }

            .refund-money-label {
                > .ivu-form-item-label {
                    padding-top: 5px;
                }
            }
        }
        .order-no {
            .iconfont {
                font-size: 18px;
            }
        }
        // 未开票
        .no-invoice {
            font-size: 10px;
            font-weight: bold;
            line-height: 16px;
            padding: 0 4px;
            border-radius: 8px;
            background-color: #ff1f2c;
            color: #ffffff;
            margin-left: 10px;
           >span {
                display: inline-block;
                transform:scale(0.85)
            }
        }
        > .status-col {
            padding-left: 20px;
        }
        > .ivu-col {
            padding-right: 30px;
            border-right: 1px solid $border-color;
            .title {
                padding-left: 20px;
            }

            &:last-child {
                border-right: none;
            }
        }

        .title {
            @include font-16-22-bold;
            color: $text-first;
            padding-bottom: 30px;


        }

        .big-title {
            > img {
                /*vertical-align: bottom;*/
                padding-right: 6px;
            }
            >.iconfont {
                font-size: 32px;
                padding-right: 4px;
                line-height: 32px;
            }
            >.title {
                @include font-24-34-bold;
                vertical-align: bottom;
                padding-left: 4px;
                padding-bottom: 0;
            }
        }

        .time-out {
            color: $text-third;
            padding-left: 38px;
        }

        .finish {
            .title {
                color: $success-color;
            }
            .iconfont {
                color: $success-color;
            }
        }

        .close {
            .iconfont,
           .title {
               color: $text-third;
           }
        }

        .status-btn {
            margin: 20px 0 10px 0;
        }

        .footer-btn {
            margin-top: 15px;
            margin-bottom: -10px;

            .ivu-btn {
                margin-right: 10px;
                margin-bottom: 10px;
            }
        }

        .ivu-form {
            .ivu-form-item {
                margin-bottom: 20px;
            }
        }

        .ivu-btn-text {
            margin-left: 10px;
        }
        .iconfont.icon-yingyong-pintuan {
            color: #F66000;
            font-size: 18px;
        }

        .icon-dingdanliebiao-pintuanfanli {
            color: #FF9900;
            font-size: 18px;
        }
        .seckill-icon {
            font-size: 18px;
            color: #ff1f2c;
        }
        .icon-dingdanliebiao-jifen {
            font-size: 18px;
            color: #6100FF;
        }
    }
    .printer-modal {
        padding: 30px 0;
    }
    .goAddress{
        font-size: 12px;
        color: #2d8cf0;
        margin-top: 2px;
        margin-left: 10px;
        cursor: pointer;
    }
</style>
