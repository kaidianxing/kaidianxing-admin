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
    <div class="order-table-list" ref="order_table" v-loading="loading">
        <div class="order-table-list-box">
            <div class="table-header">
                <table :style="{width: `${tableWidth}px`}">
                    <colgroup align="left">
                        <col
                                v-for="(column, index) in columns"
                                :key="index + column.width"
                                :width="column.width"
                        />
                    </colgroup>
                    <tr>
                        <th v-for="(column, index) in columns" :key="index">
                            <div class="table-cell">{{column.title}}</div>
                        </th>
                    </tr>
                </table>
            </div>
            <template v-if="data.length > 0">
                <div v-for="(list) in data" :key="list.order_id" class="table-content">
                    <!--下单时间等等-->
                    <div class="table-content-time">
                        <div class="left">
                            <span class="iconfont icon" :class="list.create_from|getSourceIcon" v-if="new Set(['10', '20', '21']).has(list.create_from)"></span>
                            <!-- 活动订单标识 -->
                            <span v-if="list.activity_type == 2" class="iconfont icon-dingdanliebiao-miaosha seckill"></span>
                            <kdx-svg-icon class="iconfont" type="icon-qudao-toutiao2" v-else-if="list.create_from === '30'"></kdx-svg-icon>
                            <kdx-svg-icon class="iconfont" type="icon-qudao-toutiaojisuban" v-else-if="list.create_from === '32'"></kdx-svg-icon>
                            <kdx-svg-icon class="iconfont" type="icon-douyin" v-else-if="list.create_from === '31'"></kdx-svg-icon>
                            <span class="text">下单时间：{{list.created_at}}</span>
                            <span class="text">订单编号：{{list.order_no}}</span>
                            <kdx-copy-text :text="list.order_no">
                                <Button type="text" size="small">复制</Button>
                            </kdx-copy-text>
                        </div>
                        <div class="right">
                        <span
                                class="remaining-time"
                                v-if="list.status === '0'"
                        >{{list.count_down_time}}</span>
                            <!--订单详情-->
                            <Button type="text" @click="checkDetail(list.order_id,list.status)">查看详情</Button>
                        </div>
                    </div>

                    <!--订单信息-->
                    <div class="table-order" v-if="list.goods_info && list.goods_info.length > 0">
                        <table :style="{width: `${tableWidth}px`}">
                            <colgroup align="left">
                                <col
                                        v-for="(column, index) in columns"
                                        :key="index + column.width"
                                        :width="column.width"
                                />
                            </colgroup>
                            <!--合并单元格-->
                            <template v-if="list.goods_info.length > 0">
                                <tr v-for="(goods, index) in list.goods_info" :key="goods.id">
                                    <!--商品信息-->
                                    <td>
                                        <div class="shop">
                                            <div class="shop-image">
                                                <img
                                                        :src="$media(goods.thumb)"
                                                        alt
                                                        @error="replaceImage"
                                                />
                                            </div>
                                            <div class="shop-information">
                                                <!-- <p class="title">{{goods.title}}</p> -->
                                                <div class="title">
                                                    <span class="mark" :class="goods.type === '1' ? 'virtual' : (goods.type === '0' ? 'real' : (goods.type === '2' ?'secret': ''))">
                                                    <!-- type: 0实体 1虚拟 2虚拟卡密-->
                                                    {{ goods.type === '1' ? '虚' : (goods.type === '0' ? '实' : (goods.type === '2' ?'密': ''))}}
                                                    </span>
                                                    {{ goods.title }}
                                                </div>
                                                <div class="shop-label">
                                                    <kdx-tag-label type="warning" size="small" v-if="goods.plugin_identification && goods.plugin_identification.is_commission == '1'">
                                                        <div>
                                                            <span class="iconfont icon-fenxiao"></span>
                                                            <span>分销商品</span>
                                                        </div>
                                                    </kdx-tag-label>
                                                    <kdx-tag-label v-if="goods.option_title" type="info" size="small">{{goods.option_title}}</kdx-tag-label>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <!--商品价格、数量-->
                                    <td>
                                        <div class="shop-price-number price">
                                            <!--商品单价-->
                                            <p>￥{{goods.price_unit}}</p>
                                            <p>X{{goods.total}}</p>
                                        </div>
                                    </td>

                                    <template v-if="index === 0">
                                        <!--实付款-->
                                        <td :rowspan="list.goods_info.length">
                                            <div class="shop-payment">
                                                <div class="shop-payment-price">
                                                    <span>￥{{list.pay_price}}</span>
                                                </div>
                                                <div class="flex align-center pay-info">
                                                <span
                                                        class="iconfont pay-icon"
                                                        :class="getPayType(list.pay_type).icon"
                                                ></span>
                                                    <span
                                                            class="pay-text"
                                                            :class="getPayType(list.pay_type).class"
                                                    >{{getPayType(list.pay_type).text}}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <!--买家-->
                                        <td :rowspan="list.goods_info.length">
                                            <div
                                                    class="shop-buyer"
                                                    v-if="list.buyer_name || list.buyer_mobile"
                                            >
                                                <p class="buyer-name" @click="jumpVip(list.member_id)">{{list.buyer_name}}</p>
                                                <p class="buyey-mobile">{{list.buyer_mobile}}</p>
                                            </div>
                                            <template v-else>-</template>
                                        </td>

                                        <!--分销商-->
                                        <td class="retailer-td" :rowspan="list.goods_info.length">
                                            <div class="retailer">
                                                <div
                                                        class="flex align-center retailer-list"
                                                        v-for="(agent, index) in getLevelInfo(list.anent_info)"
                                                        :key="index"
                                                >
                                                    <div class="retailer-info">
                                                    <span
                                                            class="retailer-level"
                                                    >{{agent.level|getLevelText}}</span>
                                                        <span
                                                                class="retailer-name"
                                                        >{{agent.member &&agent.member.nickname}}</span>
                                                    </div>
                                                    <div class="retailer-money">佣金：￥{{agent.commission}}</div>
                                                </div>

                                                <div
                                                        class="total-money"
                                                        v-if="list.anent_info&&list.anent_info.commission_sum"
                                                >合计佣金：￥{{list.anent_info.commission_sum}}</div>
                                            </div>
                                        </td>
                                        <!--操作-->
                                        <td :rowspan="list.goods_info.length">
                                            <div class="retailer-status">
                                                <div class="retailer-status-info">
                                                    <span class>佣金状态：</span>
                                                    <span
                                                            class="retailer-status-value"
                                                            :class="{
                                                        'success': list.commission_status=='1'
                                                    }"
                                                    >{{list.commission_status=='0'?'未到账':'已到账'}}</span>
                                                </div>
                                                <div class="retailer-status-info order">
                                                    <span class>订单状态：</span>
                                                    <!--0代付款 10待发货 11部分发货 20待收货 30已完成-->
                                                    <span
                                                            class="order-status"
                                                            :class="{
                                                        'wait-payment': list.status == 0,
                                                        'wait-send':list.status == 10 || list.status == 11,
                                                        'wait-receive':list.status ==20,
                                                        'success':list.status ==30,
                                                        'close': list.status == -1
                                                    }"
                                                    >{{list.status | getOrderText}}</span>
                                                </div>
                                                <div class="retailer-status-time">
                                                    <span>到账时间：</span>
                                                    <span>{{list.commission_status=='0'?'-':list.commission_time}}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </template>
                                </tr>
                            </template>
                        </table>
                    </div>
                </div>
            </template>
            <div v-else style="text-align: center;">暂无数据</div>
        </div>
        <div class="table-footer" v-show="total >= 10">
            <kdx-page-component ref="page" :total="total" @on-change="handlePageChange"></kdx-page-component>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrderList',
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
        }
    },
    data() {
        return {
            columns: [
                {
                    title: '商品',
                    key: 'shop',
                    width: 350
                },
                {
                    title: '单价/数量',
                    key: 'price',
                    width: 184
                },
                {
                    title: '实付款',
                    key: 'payment',
                    width: 160
                },
                {
                    title: '买家/电话',
                    key: 'buyer',
                    width: 171
                },
                {
                    title: '分销信息',
                    key: 'delivery',
                    width: 350
                },
                {
                    title: '状态/时间',
                    key: 'action',
                    width: 268
                }
            ],
            cloneColumns: [],
            totalWidth: 0,
            tableWidth: 0,
            page: {
                total: 10
            }
        }
    },
    methods: {
        // 动态改变表格的width
        handleResize() {
            this.tableWidth = this.$refs['order_table']?.offsetWidth - 40
            let columnLength = this.columns.length
            let columnWidth = parseInt(
                (this.tableWidth - this.totalWidth) / columnLength
            )
            this.columns.forEach((item, index) => {
                let width = (this.cloneColumns[index].width || 0) + columnWidth
                this.$set(this.columns[index], 'width', width)
            })
        },
        // 深拷贝columns
        getCloneColumns() {
            this.cloneColumns = JSON.parse(JSON.stringify(this.columns))
        },
        // 获取columns的默认总宽度
        getTotalWidth() {
            this.totalWidth = 0
            this.cloneColumns.forEach(item => {
                this.totalWidth += item.width || 0
            })
        },
        handlePageChange(page) {
            this.$emit('on-page-change', page)
        },
        reset() {
            this.$refs['page'].reset()
        },
        handleRefresh() {
            this.$emit('on-refresh')
        },
        getLevelInfo(info) {
            let keys = ['agent_level1', 'agent_level2', 'agent_level3']
            let obj = {}
            keys.forEach(key => {
                if (info[key]) {
                    obj[key] = info[key]
                }
            })
            let sortArr = Object.values(obj).sort((a, b) => a.level < b.level)
            return sortArr
        },
        getPayType(type) {
            let typeList = [
                {
                    id: '1',
                    text: '后台确认',
                    icon: 'icon-houtaizhifu',
                    class: ''
                },
                {
                    id: '2',
                    text: '余额支付',
                    icon: 'icon-money-pay',
                    class: 'money-text'
                },
                {
                    id: '3',
                    text: '货到付款',
                    icon: 'icon-huodaofukuan',
                    class: ''
                },
                {
                    id: '20',
                    text: '微信支付',
                    icon: 'icon-wechatpay',
                    class: 'wepay-text'
                },
                {
                    id: '30',
                    text: '支付宝支付',
                    icon: 'icon-alipay',
                    class: 'alipay-text'
                },
            ]
            return typeList.filter(list => list.id === type)[0] || {}
        },
        // 查看详情
        checkDetail(id, status) {
            let path = ''
            if (status == '10' || status == '11') {
                path = '/order/detail/send'
            } else if (status == '0') {
                path = '/order/detail/payment'
            } else if (status == '20') {
                path = '/order/detail/receive'
            } else if (status == '30') {
                path = '/order/detail/achieve'
            } else if (status == '-1') {
                path = '/order/detail/close'
            }
            this.$utils.openNewWindowPage(path, { id })
        },
        // 跳转会员详情
        jumpVip(id) {
            this.$utils.openNewWindowPage('/member/detail', {id: id});
        },
    },
    filters: {
        getSourceIcon(source) {
            switch (source) {
                // 百度小程序
                // case '0':
                //     return 'icon-baiduxiaochengxu'
                //     break;
                // 支付宝小程序
                // case '3':
                //     return 'icon-zhifubaoxiaochengxu'
                // H5
                case '10':
                    return 'icon-H'
                // 微信公众号
                case '20':
                    return 'icon-weixin'
                //微信小程序
                case '21':
                    return 'icon-weixinxiaochengxu'
                default:
                    break
            }
        },
        getLevelText(level) {
            let text = {
                '1': '一级分销商：',
                '2': '二级分销商：',
            }
            return text[level]
        },
        getOrderText(status) {
            // 0代付款 10待发货 11部分发货 20待收货 30已完成
            let text = {
                '0': '待付款',
                '10': '待发货',
                '11': '部分发货',
                '20': '待收货',
                '30': '已完成',
                '-1': '已关闭'
            }

            return text[status]
        }
    },

    mounted() {
        this.getCloneColumns()
        this.getTotalWidth()
        setTimeout(() => {
            this.handleResize()
        }, 500)
        // 监听窗口的变化
        window.addEventListener('resize', () => {
            this.handleResize()
        }, 200)
    }
}
</script>

<style scoped lang="scss">
.order-table-list {
    padding: 0 20px;
    background-color: #ffffff;
    position: relative;
    .order-table-list-box {
        padding-bottom: 20px;
        // 表头
        .table-header {
            height: 64px;
            box-sizing: border-box;
            border-bottom: 1px solid $border-color;
            margin-bottom: 20px;

            > table {
                /*width: 100%;*/
                > tr {
                    /*width: 100%;*/
                    > th {
                        .table-cell {
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
        .table-content {
            border-top: 1px solid $border-color;
            border-left: 1px solid $border-color;
            border-radius: 2px;
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
            // 下单时间
            .table-content-time {
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                padding: 0 20px;
                align-items: center;
                @include font-14-20;
                background-color: $background-color;
                height: 50px;
                border-right: 1px solid $border-color;

                .left {
                    .icon {
                        font-size: 18px;
                        margin-right: 10px;
                        vertical-align: middle;
                    }
                    .icon-weixin {
                        color: $success-color;
                    }
                    .icon-weixinxiaochengxu {
                        color: #677de0;
                    }
                    .icon-toutiaoxiaochengxu {
                        color: #239bff;
                    }

                    .icon-zhifubaoxiaochengxu {
                        color: #2094e7;
                    }

                    .icon-baiduxiaochengxu {
                        color: #306cff;
                    }

                    .icon-H {
                        color: #ff6004;
                    }
                    .text {
                        padding-right: 20px;
                        color: $text-third;
                    }

                    .activity-icon {
                        display: inline-block;
                        margin-right: 4px;
                        width: 18px;
                        height: 18px;
                        padding: 2px;
                        vertical-align: middle;
                        &.icon {
                            display: inline-block;
                            width: 18px;
                            height: 18px;
                            line-height: 18px;
                            font-size: 14px;
                            color: #fff;
                            text-align: center;
                            border-radius: 50%;
                        }
                    }

                    .seckill {
                        height: 18px;
                        width: 18px;
                        font-size: 18px;
                        line-height: 18px;
                        vertical-align: middle;
                        color: #ff1f2c;
                            margin-right: 4px;
                    }
                }

                .right {
                    .remaining-time {
                        color: $danger-color;
                        padding-right: 20px;
                    }
                }
            }

            // 订单信息
            .table-order {
                > table {
                    /*width: 100%;*/
                    > tr {
                        /*width: 100%;*/
                        > td {
                            @include font-14-20;
                            color: $text-first;
                            padding: 20px 16px 20px 16px;
                            border-right: 1px solid $border-color;
                            border-bottom: 1px solid $border-color;
                            // 商品信息
                            .shop {
                                display: flex;
                                flex-wrap: nowrap;

                                .shop-image {
                                    width: 80px;
                                    height: 80px;
                                    margin-right: 10px;
                                    box-sizing: border-box;
                                    border: 1px solid $border-color;
                                    border-radius: 2px;
                                    flex-shrink: 0;

                                    > img {
                                        width: 100%;
                                        height: 100%;
                                    }
                                }

                                .shop-information {
                                    > .title {
                                        display: -webkit-box;
                                        word-break: break-all;
                                        -webkit-box-orient: vertical;
                                        -webkit-line-clamp: 3;
                                        overflow: hidden;
                                        height: 60px;
                                        .mark {
                                            @include font-12-16;
                                            border-radius: 2px;
                                            width: 18px;
                                            height: 18px;
                                            text-align: center;
                                            line-height: 18px;
                                            display: inline-block;
                                            &.real {
                                                background-color: #F0FAFF;
                                                color: $brand-color;
                                            }
                                            &.virtual {
                                                background-color: #E6FFF9;
                                                color: #00C5C5;
                                            }
                                            &.secret {
                                                background-color: #FFCDD0;
                                                color: #FF000F;
                                            }
                                        }
                                    }

                                    > .shop-label {
                                        margin-bottom: -10px;
                                        /deep/ .tag-label {
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

                            // 价格、数量
                            .shop-price-number {
                                @include font-14-20-bold;
                            }

                            //实付款
                            .shop-payment {
                                .shop-payment-price {
                                    @include font-14-20-bold;
                                }


                                .pay-info {
                                    margin-top: 7px;
                                }

                                .pay-icon {
                                    font-size: 18px;
                                }

                                .pay-text {
                                    @include font-14-20;
                                }

                                .money-text {
                                    color: #ff9900;
                                }
                                .wepay-text {
                                    color: #19be6b;
                                }
                                .alipay-text {
                                    color: $brand-color;
                                }

                                .icon-houtaizhifu {
                                }
                                .icon-money-pay {
                                    color: #ff9900;
                                }
                                .icon-huodaofukuan {
                                }
                                .icon-wechatpay {
                                    color: #00ac1c;
                                }
                                .icon-alipay {
                                    color: #00a0ee;
                                }
                            }

                            .shop-buyer {
                                @include font-14-20;
                                .buyer-name {
                                    color: $brand-color;
                                    cursor: pointer;
                                }

                                .buyer-mobile {
                                    margin-top: 6px;
                                    color: #262b30;
                                }
                            }

                            &.retailer-td {
                                /*padding: 20px 20px 10px 20px;*/
                            }

                            .retailer {
                                @include font-14-20;
                                &-list {
                                    overflow: hidden;
                                    white-space: nowrap;
                                    justify-content: space-between;
                                    margin-bottom: 10px;
                                }

                                &-level {
                                    color: #262b30;
                                }

                                &-name {
                                    color: $brand-color;
                                }

                                .total-money {
                                    text-align: right;
                                }
                            }

                            .retailer-status {
                                @include font-14-20;
                                color: #262b30;

                                &-time {
                                    margin-top: 20px;
                                }

                                &-value {
                                    font-size: 18px;
                                    line-height: 25px;
                                    color: #ff9900;

                                    &.success {
                                        color: #19be6b;
                                    }
                                }

                                &-info.order {
                                    margin-top: 20px;
                                }
                            }

                            .order-status {
                                @include font-14-20;
                                // 待发货
                                &.wait-send {
                                    color: #ff9900;
                                }
                                // 待收货
                                &.wait-receive {
                                    color: $brand-color;
                                }
                                // 已完成
                                &.success {
                                    color: #19be6b;
                                }
                                // 待付款
                                &.wait-payment {
                                    color: $danger-color;
                                }
                                // 已关闭
                                &.close {
                                    color: $text-third;
                                }
                            }
                        }
                    }
                }
            }

            // 备注佣金
            .table-remark {
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                align-items: center;
                height: 50px;
                padding: 0 20px;
                @include font-14-20;
                border-bottom: 1px solid $border-color;
                border-right: 1px solid $border-color;

                .left {
                    width: 100%;
                    flex: 1;

                    .remark {
                        color: $danger-color;
                        background-color: #fff1f2;
                        border-radius: 2px;
                        padding: 2px 8px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }

                .right {
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
    .table-footer {
        border-top: 1px solid $border-color;
        padding: 20px 0;
        display: flex;
        justify-content: center;
    }
}
    @media (max-width: 1500px) {
        .order-table-list {
            .order-table-list-box .table-content
            .table-order {
                > table > tr > td {
                    .retailer {
                        &-list {
                            flex-direction: column;
                            align-items: flex-start;
                        }

                        &-level {
                            color: #262b30;
                        }

                        &-name {
                            color: $brand-color;
                        }

                        .total-money {
                            text-align: left;
                        }
                    }
                }
            }
        }
    }
</style>
