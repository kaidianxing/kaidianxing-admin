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
            ref="form"
            :model="query"
            :label-width="100"
            inline
            @submit.native.prevent
        >
            <FormItem label="订单编号：" prop="order_no">
                <Input
                    class="width-340"
                    type="text"
                    v-model="query.order_no"
                    @on-enter="handleSearch"
                    placeholder="订单编号"
                />
            </FormItem>

            <FormItem label="会员信息：" prop="member_keyword">
                <Input
                    class="width-340"
                    v-model="query.member_keyword"
                    type="text"
                    placeholder="昵称/姓名/手机号"
                    @on-enter="handleSearch"
                />
            </FormItem>

            <FormItem label="会员ID：">
                <i-input
                    type="text"
                    placeholder="会员ID"
                    class="width-340"
                    v-model="query.member_id"
                    @on-enter="handleSearch"
                >
                    <Select
                        v-model="query.member_type"
                        slot="prepend"
                        style="width: 120px"
                    >
                        <Option
                            v-for="(option, index) in memberTypeList"
                            :value="option.id"
                            :key="index"
                        >
                            {{ option.label }}
                        </Option>
                    </Select>
                </i-input>
            </FormItem>
            <FormItem label="商品名称：" prop="goods_title">
                <Input
                    class="width-340"
                    v-model="query.goods_title"
                    type="text"
                    placeholder="商品名称"
                    @on-enter="handleSearch"
                />
            </FormItem>
            <FormItem label="下单时间：">
                <DatePicker
                    v-model="time"
                    type="datetimerange"
                    placeholder="下单时间"
                    format="yyyy-MM-dd HH:mm"
                    class="width-340"
                    @on-change="changeDate"
                ></DatePicker>
            </FormItem>
            <FormItem label="佣金状态：" prop="commission_status">
                <Select
                    class="width-160"
                    placeholder="请选择"
                    v-model="query.commission_status"
                >
                    <Option
                        v-for="status in commissionStatus"
                        :key="status.id"
                        :label="status.text"
                        :value="status.id"
                    ></Option>
                </Select>
            </FormItem>
            <FormItem label="订单状态：" prop="status">
                <Select
                    class="width-160"
                    placeholder="请选择"
                    v-model="query.order_status"
                >
                    <Option
                        v-for="status in orderStatus"
                        :key="status.id"
                        :label="status.name"
                        :value="status.id"
                    ></Option>
                </Select>
            </FormItem>
            <FormItem label="订单类型：">
                <Select v-model="query.type" class="width-160">
                    <Option
                            v-for="item in goodsType"
                            :key="item.key"
                            :value="item.key"
                    >{{ item.value }}
                    </Option>
                </Select>
            </FormItem>
            <div class="ivu-form-item-btn">
                <Button type="primary" @click="handleSearch">搜索</Button>
                <Button type="text" @click="handleReset">重置</Button>
                <Button type="text" @click="handleExport">导出</Button>
            </div>
        </Form>
    </kdx-header-bar>
</template>

<script>
export default {
    name: 'SearchHeader',
    data() {
        return {
            query: {
                order_no: '',
                member_keyword: '',
                member_id: '',
                member_type: '1',
                goods_title: '',
                start_time: '',
                end_time: '',
                commission_status: '-1',
                order_status: 'all',
                type: 'all', //订单类型
            },
            time: [],
            memberTypeList: [
                {
                    id: '1',
                    label: '获得返佣',
                },
                {
                    id: '0',
                    label: '自主下单',
                },
            ],
            commissionStatus: [
                {
                    id: '-1',
                    text: '全部',
                },
                {
                    id: '0',
                    text: '未入账',
                },
                {
                    id: '1',
                    text: '已入账',
                },
            ],
            timeArea: [],
            orderStatus: [
                {
                    id: 'all',
                    name: '全部',
                },
                {
                    id: '0',
                    name: '待付款',
                },
                {
                    id: '10',
                    name: '待发货',
                },
                {
                    id: '20',
                    name: '待收货',
                },
                {
                    id: '30',
                    name: '已完成',
                },
                {
                    id: '-1',
                    name: '已关闭',
                },
            ],
            // 订单类型
            goodsType: [],
        }
    },
    created() {
        let { member_id, member_type } = this.$route.query
        this.query = {
            ...this.query,
            member_id: member_id || '',
            member_type: member_type || '1',
        }
        this.handleSearch()
        this.getGoodsType()
    },
    methods: {
        // 搜索
        handleSearch() {
            let search = Object.assign({}, this.query)
            if (search.commission_status == '-1') {
                delete search.commission_status
            }
            search.order_status =
                search.order_status === 'all' ? '' : search.order_status
            Object.keys(search).forEach((k) => {
                if (search[k] == '') {
                    delete search[k]
                }
            })
            this.$emit('on-search', search)
        },
        handleReset() {
            // 重置表单
            this.reset()
            this.handleSearch()
        },
        handleExport() {
            this.$emit('on-export')
        },
        reset() {
            this.query = {
                order_no: '',
                member_keyword: '',
                member_id: '',
                member_type: '1',
                goods_title: '',
                start_time: '',
                end_time: '',
                commission_status: '-1',
                order_status: 'all',
                type: 'all'
            }
        },
        changeDate(date) {
            this.query.start_time = date[0]
            this.query.end_time = date[1]
        },
        // 获取商品类型
        getGoodsType() {
            this.$api.orderApi.getGoodsType().then(res => {
                if(res.error === 0) {
                    this.goodsType = [{
                        key: 'all',
                        value: '全部',
                    }].concat(res.goods_type)
                }
            })
        },
    },
}
</script>
