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
    <div class="order-detail-table-list">
        <Table ref="table" :columns="handleColumns" :data="data.orderGoods" :span-method="handleSpan"
               class="table-form"></Table>
        <div class="shop-total">
            <div class="shop-total-box" v-for="(item, index) in priceList" :key="index">
                <div class="shop-total-content">
                    <div class="label">{{ item.title }}</div>
                    <div class="number" :class="{'red': item.color}">{{ item.price }}</div>
                </div>
            </div>
            <!--实付款-->
            <div class="shop-total-box">
                <div class="shop-total-content payment">
                    <div class="label">实付款：</div>
                    <!-- 普通 -->
                    <div class="number price">￥{{ data.pay_price }}</div>
                </div>
            </div>
            <!--维权退款-->
            <div class="shop-total-box" v-if="data.refund_info && parseFloat(data.refund_info.price) > 0">
                <div class="shop-total-content">
                    <div class="label">维权退款：</div>
                    <div class="number">{{ formatPrice(data.refund_info.price) }}</div>
                </div>
            </div>
        </div>
        <!--修改快递-->
        <edit-express ref="edit_express" :id="modal.id" :package-id="modal.packageId"></edit-express>
        <!--查看物流-->
        <package-express ref="package_express" :id="modal.id" :package-id="modal.packageId"></package-express>
        <!-- 查看备注 -->
        <remark-modal v-model="remarkModal" :content="remarkContent"></remark-modal>
    </div>
</template>

<script>
import EditExpress from '@/views/order/components/EditExpress/index'
import PackageExpress from '@/views/order/components/PackageExpress/index'
import RemarkModal from '@/views/order/components/RemarkModal/index'

export default {
    name: 'TableList',
    components: {EditExpress, PackageExpress, RemarkModal},
    props: {
        data: {
            type: Object,
            default: () => {
            }
        },
        isRefund: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            columns: [
                {   // 商品标题
                    title: '商品标题',
                    key: 'title',
                    minWidth: 240,
                    render: (h, params) => {
                        let label;
                        if (params.row.plugin_identification && params.row.plugin_identification.is_commission == '1') {
                            label = (
                                <div class="shop-label">
                                    <kdx-tag-label type="warning" size="small">
                                        <div>
                                            <span class="iconfont icon-fenxiao"></span>
                                            <span>分销商品</span>
                                        </div>
                                    </kdx-tag-label>
                                </div>
                            )
                        }
                        return (
                            <div class="shop-title">
                                <div class="image">
                                    <img src={this.goodsImage(params.row?._index)} onError={e => {
                                        this.replaceImage(e)
                                    }}/>
                                </div>
                                <div class="content">
                                    <div class="text">
                                        {params.row[params.column.key]}
                                    </div>
                                    {label}
                                </div>
                            </div>
                        )
                    }
                },
                {   // 规格/编码/条码
                    title: '规格/编码/条码',
                    key: 'type',
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            'div',
                            {
                                class: {
                                    'shop-size': true
                                }
                            },
                            [
                                h('p', [
                                    h(
                                        'span',
                                        {
                                            class: {
                                                label: true
                                            }
                                        },
                                        '规格:'
                                    ),
                                    h(
                                        'span',
                                        {
                                            class: {
                                                specification: params.row.option_title ? true : false,
                                                coupon: params.row.ext_field.content ? true : false
                                            }
                                        },
                                        params.row.option_title || params.row.ext_field.content || '-'
                                    )
                                ]),
                                h('p', [
                                    h(
                                        'span',
                                        {
                                            class: {
                                                label: true
                                            }
                                        },
                                        '编码:'
                                    ),
                                    h(
                                        'span',
                                        {
                                            class: {
                                                'label-text': true
                                            }
                                        },
                                        params.row.goods_sku || '-'
                                    )
                                ]),
                                h('p', [
                                    h(
                                        'span',
                                        {
                                            class: {
                                                label: true
                                            }
                                        },
                                        '条码:'
                                    ),
                                    h(
                                        'span',
                                        {
                                            class: {
                                                'label-text': true
                                            }
                                        },
                                        params.row.bar_code || '-'
                                    )
                                ]),
                            ]
                        )
                    }
                },
                {   // 售卖价
                    title: '售卖价',
                    key: 'price_unit',
                    minWidth: 120,
                    render: (h, params) => {
                        if (params.row?.credit) {
                            if (params.row.price_unit === '0') return h('div', `${params.row.credit_unit} 积分`);
                            return h('div', `${params.row.credit_unit} 积分 + ￥${params.row.price_unit}`);
                        }
                        return h('div', `￥${params.row[params.column.key]}`)
                    }
                },
                {
                    title: '数量',
                    key: 'total',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('div', `X${params.row[params.column.key]}`)
                    }
                },
                {
                    title: '优惠金额',
                    key: 'price_discount',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('div', `￥${params.row[params.column.key]}`)
                    }
                },
                {
                    title: '小计',
                    key: 'price_original',
                    minWidth: 120,
                    render: (h, params) => {
                        if (params.row?.credit) {
                            if (!params.row.price_original) return h('div', `${params.row.credit} 积分`);
                            return h('div', `${params.row.credit} 积分 + ￥${params.row.price_original}`);
                        }
                        // 单价
                        let price = parseFloat(params.row.price_unit) || '0'
                        let total = parseInt(params.row.total) || '0'
                        let price_original = (price * total).toFixed(2)
                        return h('div', `￥${price_original}`)
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    minWidth: 80,
                    maxWidth: 150,
                    render: (h, params) => {
                        let path = this.getPath(this.data, params.row)
                        //订单状态 0代付款 10待发货 11部分发货 20待收货 30已完成
                        if (this.isRefundSuc) {
                            return (
                                <div>
                                    <div style={{color: '#19BE6B'}}>
                                        维权完成
                                    </div>
                                </div>
                            )
                        } else if (params.row.refund_status_text) {
                            let refundStatus;
                            if (params.row.refund_status == '10' || params.row.refund_status == '11') {
                                refundStatus = (
                                    <kdx-status-text type="success">维权完成</kdx-status-text>
                                )
                            } else {
                                refundStatus = (
                                    <kdx-status-text type="danger">维权中</kdx-status-text>
                                )
                            }
                            return (
                                <div>
                                    <div>
                                        {refundStatus}
                                    </div>
                                    <Button
                                        type="text"
                                        style={{
                                            display: this.isRefund
                                                ? 'none'
                                                : 'inline-block'
                                        }}
                                        to={path}
                                    >
                                        维权详情
                                    </Button>
                                </div>
                            )
                        } else {
                            const status = params.row.status
                            const isGroup = this.data.groups_rebate_activity_data?.success==='0'
                            return (
                                <div>
                                    <span
                                        style={{
                                            color: '#ff9900',
                                            display:
                                                status === '10'
                                                    ? 'inline-block'
                                                    : 'none'
                                        }}
                                    >
                                         {isGroup?'待成团':'待发货'}
                                    </span>
                                    <span
                                        style={{
                                            color: this.$css['--theme-color'],
                                            display:
                                                params.row.status === '20'
                                                    ? 'inline-block'
                                                    : 'none'
                                        }}
                                    >
                                        待收货
                                    </span>
                                    <span
                                        style={{
                                            color: '#ff1f2c',
                                            display:
                                                params.row.status === '0'
                                                    ? 'inline-block'
                                                    : 'none'
                                        }}
                                    >
                                        待付款
                                    </span>
                                    <span
                                        style={{
                                            color: '#19BE6B',
                                            display:
                                                params.row.status === '30'
                                                    ? 'inline-block'
                                                    : 'none'
                                        }}
                                    >
                                        已完成
                                    </span>
                                    <span
                                        style={{
                                            color: '#19BE6B',
                                            display:
                                                params.row.status === '-1'
                                                    ? 'inline-block'
                                                    : 'none'
                                        }}
                                    >
                                        已关闭
                                    </span>
                                </div>
                            )
                        }
                    }
                },
                {
                    title: '物流信息',
                    key: 'logistics',
                    minWidth: 100,
                    maxWidth: 200,
                    render: (h, params) => {
                        if (this.isRefund) {
                            const price = this.data.refund_info.is_contain_dispatch == 1 ? this.data.refund_info.price - this.data.dispatch_price : this.data.refund_info.price;
                            return (
                                <div>
                                    <span>
                                        {this.data.refund_info.refund_type != 3 && `￥${price}` || '-'}
                                    </span>
                                </div>
                            )
                        } else {
                            const base = [h(
                                'Button',
                                {
                                    props: {
                                        type: 'text',
                                        to: '' // 跳转到物流
                                    },
                                    style: {
                                        display:
                                            params.row.status === '20'
                                                ? 'inline-block'
                                                : 'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.packageExpress(
                                                params.row
                                            )
                                        }
                                    }
                                },
                                '查看物流'
                            )]
                            const last = [
                                h(
                                    'span',
                                    {
                                        style: {
                                            display:
                                                params.row.status !== '20'
                                                    ? 'inline-block'
                                                    : 'none'
                                        }
                                    },
                                    (params.row.type === '1' && params.row.auto_deliver === '1') ? '自动发货' : '暂无信息'
                                )
                            ]
                            return h(
                                'div',
                                {
                                    class: {
                                        'action-btn': true
                                    }
                                },
                               [
                                    ...base,
                                    h(
                                        'Button',
                                        {
                                            props: {
                                                type: 'text',
                                                disabled: !this.noManagePerm.send
                                            },
                                            style: {
                                                display:
                                                    params.row.status === '20'
                                                        ? 'inline-block'
                                                        : 'none'
                                            },
                                            on: {
                                                click: () => {
                                                    this.editExpress(params.row)
                                                }
                                            }
                                        },
                                        '修改物流'
                                    ),
                                    ...last,
                                ]
                            )
                        }
                    },
                    renderHeader: () => {
                        return (
                            <div>{this.isRefund ? '维权金额(不含运费)' : '物流信息'}</div>
                        )
                    }
                }
            ],
            total: {
                subtotal: 1000 //小计
            },
            modal: {
                editExpress: 0,
                packageId: '',
                packageExpress: 0,
                id: ''
            },
            colTitle: '维权金额',
            remarkModal: false,
            remarkContent: ''
        }
    },
    computed: {
        priceList() {
            let result = [];
            let goodsInfo = this.data.goods_info, goods_type;
            if (goodsInfo && goodsInfo.length > 0) {
                goods_type = goodsInfo[0].type
            }
            result = [
                {
                    title: '商品小计：',
                    price: this.handlePrice,
                    show: true,
                    color: false
                },
                {
                    title: `运费：`,
                    price: `￥${this.data?.dispatch_price}`,
                    show: +this.data.dispatch_type !== 20 && +goods_type === 0,
                    color: false
                },
                {
                    title: '改价：',
                    price: this.formatPrice(this.data.change_price),
                    show: this.data.change_price && parseFloat(this.data.change_price) != '0',
                    color: false
                },
                {
                    title: '会员折扣：',
                    price: '-' + this.formatPrice(this.data?.extra_price_package?.member_price),
                    show: this.data.extra_price_package && this.data.extra_price_package.member_price,
                    color: true
                },
                {
                    title: '积分抵扣：', // 积分抵扣
                    price: '-' + this.formatPrice(this.data?.extra_price_package?.credit),
                    show: this.data.extra_price_package && this.data.extra_price_package.credit,
                    color: true
                },
                {
                    title: '余额抵扣：', // 余额抵扣
                    price: '-' + this.formatPrice(this.data?.extra_price_package?.balance),
                    show: this.data.extra_price_package && this.data.extra_price_package.balance,
                    color: true
                },
                {
                    title: '优惠券：',
                    price: '-' + this.formatPrice(this.data?.extra_price_package?.coupon),
                    show: this.data.extra_price_package && this.data.extra_price_package.coupon,
                    color: true
                },
                {
                    title: '满额立减：',
                    price: '-' + this.formatPrice(this.data?.extra_price_package?.full_deduct),
                    show: this.data.extra_price_package && this.data.extra_price_package.full_deduct,
                    color: true
                },
                {
                    title: '秒杀优惠：',
                    price: '-' + this.formatPrice(this.data?.extra_price_package?.seckill),
                    show: this.data.extra_price_package && this.data.extra_price_package?.seckill,
                    color: true
                },
                {
                    title: '拼团优惠：',
                    price: '-'+this.formatPrice(this.data?.extra_price_package?.groups),
                    show: this.data.extra_price_package && this.data.extra_price_package?.groups,
                    color: false
                },
            ];

            result = result.filter(item => item.show);
            return result
        },
        isRefundSuc() {
            return this.data.orderGoods.every(
                v => v.refund_status == 10 || v.refund_status == 11
            )
        },
        noManagePerm() {
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
            return permMap;
        },
        handleColumns() {
            let result = [...this.columns];
            if (!this.isRefund) {
                result = result.filter(col => col.key !== 'logistics')
            }
            let formColumn = [
                {
                    type: 'expand',
                    width: 0,
                    minWidth: 0,
                    maxWidth: 0,
                    slot: 'nickname',
                    render: (h, params) => {
                        if (params.row?.form_data) {
                            let data = params.row.form_data?.content ? JSON.parse(params.row.form_data.content) : '';
                            let imageList = data.filter(item => item.id === 'pictures');
                            return (
                                <kdx-goods-detail-info form-content={data} image-list={imageList}></kdx-goods-detail-info>
                            )
                        } else {
                            return (
                                <div>暂无数据</div>
                            )
                        }
                    }
                },
            ]
            result = result.concat(formColumn);
            let remarkColumn = [
                {
                    title: '备注',
                    key: 'remark',
                    width: 80,
                    render: (h, params) => {
                        if (params.row?.ext_field?.note) {
                            return (
                                <Button type="text" onClick={() => {
                                    this.viewRemark(params.row?.ext_field?.note)
                                }}>查看</Button>
                            )
                        } else {
                            return (
                                <div class="disabled-color">无</div>
                            )
                        }
                    }
                }
            ];

            result = result.concat(remarkColumn)

            return result
        },
        handlePrice() {
            return (`￥${this.data.goods_price}`)
        },
    },
    created() {},
    methods: {
        goodsImage(index) {
            if (!this.data.orderGoods[index].thumb) {
                if (this.data.orderGoods[index].ext_field.coupon_sale_type == '1') {
                    return (require('@/assets/image/coupons/full-reduction.png'))
                }
            }
            return (this.$media(this.data.orderGoods[index].thumb))
        },
        // 修改物流
        editExpress(row) {
            this.modal.id = this.data.id
            if (this.data.status === '11') {
                this.modal.packageId = row.package_id
            } else {
                this.modal.packageId = ''
            }
            this.$nextTick(() => {
                this.$refs['edit_express'].setValue()
            })
        },
        // 物流信息
        packageExpress(row) {
            this.modal.id = this.data.id
            this.modal.packageId = row.package_id
            this.$nextTick(() => {
                this.$refs['package_express'].setValue()
            })
        },
        formatPrice(price) {
            if (parseFloat(price) >= 0) {
                return `￥${parseFloat(price).toFixed(2)}`
            } else {
                return `-￥${Math.abs(parseFloat(price)).toFixed(2)}`
            }
        },
        handleSpan({rowIndex, columnIndex}) {
            if (this.isRefundSuc || this.data.refund_type == '1') {
                if (rowIndex != 0 && columnIndex == 6) {
                    return {
                        rowspan: 0,
                        colspan: 1
                    }
                }
                if (rowIndex == 0 && columnIndex == 6) {
                    return {
                        colspan: 1,
                        rowspan: this.data.orderGoods.length
                    }
                }
            }
        },
        getPath({refund_type, id, is_refund}, goods) {
            let path = '/order/'
            if (goods.refund_type === '1') {
                path += 'refund-detail'
            } else if (goods.refund_type === '2') {
                path += 'returns-refunds-detail'
            } else if (goods.refund_type === '3') {
                path += 'exchange-goods-detail'
            } else {
                return ''
            }

            path += `?id=${id}&is_refund=${is_refund}`

            if (refund_type === '2') {
                path += `&ids=${goods.id}`
            }

            return path
        },

        viewRemark(data) {
            // 查看备注
            this.remarkModal = true;
            this.remarkContent = data
        }
    },
}
</script>

<style lang="scss" scoped>
.order-detail-table-list {
    color: $text-first;
    padding: 40px 40px 0;

    .table-form {
        /deep/ .ivu-table {
            .ivu-table-body,
            .ivu-table-header {
                tr {
                    th {
                        background: #F4F6F8;

                        &:nth-last-child(2) {
                            /*background-color: red;*/
                            .ivu-table-cell {
                                padding: 0; // 适配表单
                            }
                        }
                    }
                }
            }

            .ivu-table-expanded-cell {
                background-color: $brand-hover;
                padding-left: 0;
            }

            .ivu-table-body {
                font-size: 12px;
            }
        }
    }

    /deep/ .ivu-table-cell {
        > div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        &.ivu-table-cell-with-expand {
            display: none;
        }

        .action-btn {
            /*word-wrap:break-word;*/
            /*word-break:normal;*/
            white-space: inherit;
            margin-right: -10px;

            .ivu-btn {
                padding-right: 10px;
            }
        }

        // 商品标题
        .shop-title {
            display: flex;
            overflow: inherit;
            text-overflow: inherit;
            white-space: inherit;
            align-items: center;

            > .image {
                width: 80px;
                height: 80px;

                > img {
                    width: 80px;
                    height: 80px;
                    border: 1px solid $border-color;
                    border-radius: 2px;
                    box-sizing: border-box;
                }
            }

            > .content {
                margin-left: 10px;

                > .text {
                    /*margin-top: 10px;*/
                    @include font-12-16;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                    max-height: 60px;
                    word-break: break-all;
                }

                > .shop-label {
                    margin-bottom: -10px;

                    .tag-label {
                        margin-bottom: 10px;

                        &:first-child {
                            margin-right: 10px;
                        }

                        .label-warning {
                            span {
                                color: $warning-color;
                            }

                            .iconfont {
                                padding-right: 2px;
                                vertical-align: bottom;
                            }
                        }
                    }
                }
            }

        }

        // 规格/编码/条码
        .shop-size {
            @include font-12-16;

            > p {
                padding-bottom: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                > .label {
                    padding-right: 10px;
                }

                > .specification, .coupon {
                    color: #197be1;
                    background-color: #f0faff;
                    padding: 2px 5px;
                    font-size: 12px;
                }
            }
        }

        .ivu-btn.ivu-btn-text {
            font-size: 12px;
        }
    }

    // 商品总计
    .shop-total {
        padding: 40px 0;

        > .shop-total-box {
            display: flex;
            justify-content: flex-end;

            > .shop-total-content {
                display: flex;
                align-items: center;
                color: $text-first;
                @include font-14-20;
                padding-bottom: 10px;

                > .label {
                    width: 120px;
                    text-align: right;
                    margin-right: 5px;
                }

                > .number {
                    width: 190px;
                    text-align: right;
                }

                > .red {
                    color: $danger-color;
                }
            }

            > .payment {
                @include font-14-20-bold;
                padding-top: 10px;

                > .price {
                    @include font-18-25-bold;
                    color: $danger-color;
                }
            }
        }
    }
}
</style>
