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
    <kdx-header-bar>
        <Form 
            :model="model"
            :label-width="100"
            inline
            @submit.native.prevent
        >
            <FormItem label="关键词：">
                <i-input
                    type="text"
                    v-model="model.keywords"
                    placeholder="关键词"
                    class="width-340"
                    @on-enter="handleSearch"
                >
                    <Select
                        v-model="model.search_field"
                        slot="prepend"
                        style="width: 120px"
                    >
                        <Option
                            v-for="(option, index) in optionData.search_field"
                            :value="option.key"
                            :key="index"
                        >
                            {{ option.name }}
                        </Option>
                    </Select>
                </i-input>
            </FormItem>
            <FormItem label="支付方式：">
                <Select
                    v-model="model.pay_type"
                    class="width-160"
                >
                    <Option
                        v-for="item in optionData.pay_type"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="下单时间：">
                <DatePicker
                    v-model="model.time"
                    type="datetimerange"
                    placeholder="下单时间"
                    format="yyyy-MM-dd HH:mm"
                    class="width-340"
                    @on-change="changeDate"
                ></DatePicker>
            </FormItem>
            <FormItem label="订单来源：">
                <Select
                    v-model="model.create_from"
                    class="width-160"
                >
                    <Option
                        v-for="item in optionData.create_from"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="活动订单：">
                <Select
                    :value="model.activity_type"
                    class="width-160"
                    @on-change="changeType"
                >
                    <Option
                        key="all"
                        value="all"
                    >全部</Option>
                    <Option
                        v-for="item in optionData.activity_type"
                        :key="item.key"
                        :value="item.key"
                    >{{item.value}}
                    </Option>
                </Select>
            </FormItem>
            <FormItem
                label="订单状态："
                v-if='status=="all"'
            >
                <Select
                    v-model="model.status"
                    class="width-160"
                >
                    <Option
                        v-for="item in optionData.order_status"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.name }}
                    </Option>
                </Select>
            </FormItem>

            <FormItem
                label="维权类型："
                v-if="managePerm && status === 'refund'"
            >
                <Select
                    v-model="model.refund_type"
                    class="width-160"
                >
                    <Option
                        v-for="item in optionData.refund_type"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem
                label="维权状态："
                v-if="managePerm"
            >
                <Select
                    v-model="model.refund_status"
                    class="width-160"
                >
                    <Option
                        v-for="item in optionData.refund_status"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem
                label="配送方式："
                v-if="managePerm"
            >
                <Select
                    v-model="model.dispatch_type"
                    class="width-160"
                >
                    <Option
                        v-for="item in deliveryList"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="商品类型：">
                <Select v-model="model.type" class="width-160">
                    <Option
                            v-for="item in optionData.goodsType"
                            :key="item.key"
                            :value="item.key"
                    >{{ item.value }}
                    </Option>
                </Select>
            </FormItem>
            <div class="ivu-form-item-btn">
                <Button
                    type="primary"
                    @click="handleSearch"
                >搜索</Button>
                <Button
                    type="text"
                    @click="handleReset"
                >重置</Button>
                <Button
                    type="text"
                    @click="handleExport"
                >导出</Button>
            </div>
        </Form>
    </kdx-header-bar>
</template>

<script>
export default {
    name: 'SearchHeader',
    props: {
        status: String,
    },
    data() {
        return {
            model: {
                keywords: '',
                search_field: 'order_no',
                pay_type: 'all',
                time: '',
                create_from: 'all',
                refund_type: '0',
                refund_status: '',
                dispatch_type: 'all',
                type: 'all'
            },
            optionData: {
                // 关键词
                search_field: [
                    {
                        key: 'order_no',
                        name: '订单编号',
                    },
                    {
                        key: 'member_keywords',
                        name: '会员信息',
                    },
                    {
                        key: 'member_id',
                        name: '会员ID',
                    },
                    {
                        key: 'buyer_keywords',
                        name: '收件人信息',
                    },
                    {
                        key: 'address_keywords',
                        name: '地址信息',
                    },
                    {
                        key: 'goods_title',
                        name: '商品名称',
                    },
                    {
                        key: 'goods_sku',
                        name: '商品编号',
                    },
                ],
                // 支付方式 1 后台确认2 余额支付3 货到付款20 微信支付30 支付宝支付
                pay_type: [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: '0',
                        name: '未支付',
                    },
                    {
                        id: '1',
                        name: '后台支付',
                    },
                    {
                        id: '2',
                        name: '余额支付',
                    },
                    {
                        id: '3',
                        name: '货到付款',
                    },
                    {
                        id: '20',
                        name: '微信支付',
                    },
                    {
                        id: '30',
                        name: '支付宝支付',
                    },
                    {
                        id: '40',
                        name: '字节跳动支付',
                    },
                ],
                create_from: [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: '20',
                        name: '微信公众号',
                    },
                    {
                        id: '21',
                        name: '微信小程序',
                    },
                    {
                        id: '10',
                        name: 'H5',
                    },
                    {
                        id: '31',
                        name: '抖音小程序',
                    },
                    {
                        id: '30',
                        name: '头条小程序',
                    },
                    {
                        id: '32',
                        name: '头条极速版小程序',
                    },
                    // {
                    //     id: '3',
                    //     name: '支付宝小程序',
                    // },
                ],
                // 维权类型
                refund_type: [
                    {
                        id: '0',
                        name: '全部',
                    },
                    {
                        id: '1',
                        name: '仅退款',
                    },
                    {
                        id: '2',
                        name: '退货退款',
                    },
                    {
                        id: '3',
                        name: '换货',
                    },
                    {
                        id: '4',
                        name: '退款（含退款退货）',
                    },
                ],
                // 维权状态
                refund_status: [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: '0',
                        name: '未维权',
                    },
                    {
                        id: '1',
                        name: '维权中',
                    },
                    {
                        id: '2',
                        name: '维权完成',
                    },
                ],
                // 配送方式
                dispatchTypeList: [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: '10',
                        name: '普通快递',
                    },
                ],
                // 订单状态
                order_status: [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: 'wait_send',
                        name: '待发货',
                    },
                    {
                        id: 'wait_pay',
                        name: '待付款',
                    },
                    {
                        id: 'wait_pick',
                        name: '待收货',
                    },
                    {
                        id: 'success',
                        name: '已完成',
                    },
                    {
                        id: 'close',
                        name: '已关闭',
                    },
                ],
                // 活动订单 商城订单  秒杀等
                activity_type: [],
                // 商品类型
                goodsType: []
            },
        }
    },
    computed: {
        managePerm() {
            //维权管理权限
            return this.$getPermMap('order.refund.manage')
        },
        // 配送方式列表
        deliveryList() {
            return this.optionData.dispatchTypeList
        }
    },
    methods: {
        changeType(value) {
            if(value!==undefined){
                this.model.activity_type = value
            }
        },
        // 搜索
        handleSearch() {
            let search = Object.assign({}, this.model)
            search.refund_status = search.refund_status === 'all' ? '' : search.refund_status
            search.activity_type = search.activity_type === 'all' ? '' : search.activity_type
            search.status = search.status === 'all' ? '' : search.status
            search.pay_type = search.pay_type === 'all' ? '' : search.pay_type
            search.create_from = search.create_from === 'all' ? '' : search.create_from
            search.dispatch_type =
                search.dispatch_type === 'all' ? '' : search.dispatch_type
            if (this.status !== 'refund') {
                delete search.refund_type
            }
            this.$emit('on-search', search)
        },
        handleReset() {
            this.$emit('on-search', {})
            // 重置表单
            this.reset()
        },
        handleExport() {
            this.$emit('on-export')
        },
        changeDate(date) {
            this.model.time = date
            if (!date[0]) {
                this.model.time = ''
            }
        },
        reset(model = {}) {
            let data = {
                keywords: '',
                search_field: 'order_no',
                pay_type: 'all',
                time: '',
                create_from: 'all',
                refund_type: '0',
                activity_type: 'all', // 活动订单
                status: 'all',
                refund_status: 'all',
                dispatch_type: 'all',
                type: 'all'
            }
            this.model = Object.assign(data, model)
        },
        getOrderType() {
            this.$api.orderApi.getOrderType({}).then(res => {
                if (res.error === 0) {
                    this.optionData.activity_type = res.activity_type
                }
            })
        },
        getVerylify() {
            this.$api.orderApi.getDeliveryList().then(res => {
                if (res.error === 0) {
                    this.optionData.dispatchTypeList = [{
                        id: 'all',
                        name: '全部',
                    }].concat(res.dispatch_type)
                }
            })
        },
        // 获取商品类型
        getGoodsType() {
            this.$api.orderApi.getGoodsType().then(res => {
                if(res.error === 0) {
                    this.optionData.goodsType = [{
                        key: 'all',
                        value: '全部',
                    }].concat(res.goods_type)
                }
            })
        },
    },
    watch: {
        status: {
            handler(val) {
                // 待发货和待付款 没有快递单号筛选项
                if (val !== 'send' && val !== 'payment') {
                    this.optionData.search_field.splice(7, 1)
                    this.optionData.search_field.push({
                        key: 'express_sn',
                        name: '快递单号',
                    })
                } else {
                    this.optionData.search_field.splice(7, 1)
                }
                if (
                    val === 'refund' &&
                    this.optionData.refund_status.length == 4
                ) {
                    this.optionData.refund_status.splice(1, 1)
                }
            },
            immediate: true,
        },
    },
    mounted() {
        this.getOrderType()
        this.getGoodsType()
        this.reset()
        this.getVerylify()
    },
}
</script>
