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
            :model="model"
            :label-width="130"
            inline
            @submit.native.prevent
        >
            <FormItem label="订单编号：">
                <i-input
                    type="text"
                    v-model="model.order_no"
                    placeholder="请输入订单编号"
                    @on-enter="handleSearch"
                    class="width-340"
                />
            </FormItem>
            <FormItem label="下单时间：">
                <DatePicker
                    v-model="date"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="请选择"
                    @on-change="changeDate"
                    class="width-340"
                ></DatePicker>
            </FormItem>
            <FormItem label="商品名称：">
                <i-input
                    type="text"
                    v-model="model.title"
                    placeholder="请输入商品名称"
                    @on-enter="handleSearch"
                    class="width-340"
                />
            </FormItem>
            <FormItem label="收件人：">
                <i-input
                    type="text"
                    v-model="model.buyer_name"
                    placeholder="收件人姓名/手机号 "
                    @on-enter="handleSearch"
                    class="width-340"
                />
            </FormItem>
            <FormItem label="电子面单打印状态：">
                <Select v-model="model.is_print" class="width-160">
                    <Option
                        v-for="item in printStatusList"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </Option>
                </Select>
            </FormItem>
             <FormItem label="发货单打印状态：">
                <Select v-model="model.is_bill_print" class="width-160">
                    <Option
                        v-for="item in printStatusList"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </Option>
                </Select>
            </FormItem>
             <FormItem label="订单类型：">
                <Select v-model="model.activity_type" class="width-160">
                    <Option key="all" value="all">全部</Option>
                    <Option
                            v-for="item in orderTypes"
                            :key="item.key"
                            :value="item.key"
                    >{{ item.value }}</Option
                    >
                </Select>
            </FormItem>
            <FormItem label="订单状态：">
                <Select v-model="model.status" class="width-160">
                    <Option
                        v-for="item in orderStatusList"
                        :key="item.value"
                        :value="item.value"
                    >
                        {{ item.label }}
                    </Option>
                </Select>
            </FormItem>
            <div class="ivu-form-item-btn">
                <Button type="primary" @click="handleSearch">搜索</Button>
                <Button type="text" @click="handleReset">重置</Button>
            </div>
        </Form>
    </kdx-header-bar>
</template>

<script>
export default {
    props: ['order_no'],
    data() {
        return {
            model: {
                order_no: '',
                created_at: [],
                title: '',
                buyer_name: '',
                is_print: 'all',
                is_bill_print: 'all',
                status: 'all',
                activity_type: 'all'
            },
            date: [],
            printStatusList: [
                {
                    value: 'all',
                    label: '全部',
                },
                {
                    value: '1',
                    label: '已打印',
                },
                {
                    value: '0',
                    label: '未打印',
                },
            ],
            orderStatusList: [
                {
                    value: 'all',
                    label: '全部',
                },
                {
                    value: '10',
                    label: '待发货',
                },
                {
                    value: '11',
                    label: '部分发货',
                },
                {
                    value: '20',
                    label: '待收货',
                },
                {
                    value: '30',
                    label: '已完成',
                },
            ],
            orderTypes: []
        }
    },
    mounted(){
        this.getOrderType()
    },
    methods: {
        changeDate(date) {
            this.model.created_at = [...date]
        },
        getOrderType() {
            this.$api.orderApi.getOrderType({}).then(res => {
                if (res.error === 0) {
                    this.orderTypes = res.activity_type
                }
            })
        },
        // 搜索
        handleSearch() {
            let params = {
                ...this.model,
            }

            let allKeys = ['is_print','status','activity_type','is_bill_print']
            allKeys.forEach(key=> {
                if(this.model[key]==='all') {
                    params[key] =''
                }
            })
          
            this.$emit('on-search', params)
        },
        // 重置
        handleReset() {
            this.reset()
            this.handleSearch()
        },
        reset() {
            this.model = {
                order_no: '',
                created_at: [],
                title: '',
                buyer_name: '',
                is_print: 'all',
                status: 'all',
                activity_type: 'all',
                is_bill_print:'all'
            }
            this.date = []
        },
    },
    watch: {
        order_no: {
            handler(value) {
                this.model.order_no = value
            },
            immediate: true,
        },
    },
}
</script>
<style lang="scss" scoped></style>
