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
        <template #header>
            <Button
                type="primary"
                :disabled="noManagePerm"
                to="/market/coupons/base/add"
            >
                +添加优惠券
            </Button>
        </template>
        <Form
            ref="form"
            :model="model"
            :label-width="100"
            inline
            @submit.native.prevent
        >
            <FormItem label="优惠券名称：">
                <Input
                    type="text"
                    v-model="model.keyword"
                    placeholder="优惠券名称"
                    class="width-340"
                    @on-enter="handleSearch"
                />
            </FormItem>
            <FormItem label="优惠券类型：">
                <Select v-model="model.coupon_sale_type" class="width-160">
                    <Option
                        v-for="item in optionData.coupon_sale_type"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="领取方式：">
                <Select v-model="model.pick_way" class="width-160">
                    <Option
                        v-for="item in optionData.pick_way"
                        :key="item.id"
                        :value="item.id"
                    >
                        {{ item.name }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="创建时间：">
                <DatePicker
                    v-model="createTime"
                    type="datetimerange"
                    @on-change="changeCreateTime"
                    placeholder="优惠券创建时间"
                    class="width-340"
                ></DatePicker>
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
    name: 'SearchHeader',
    computed: {
        noManagePerm() {
            //管理权限
            return !this.$getPermMap('sale.coupon-list.manage')
        },
    },
    data() {
        return {
            model: {
                keyword: '',
                coupon_sale_type: '',
                pick_way: '',
                start_time: '',
                end_time: '',
            },
            createTime: [],
            optionData: {
                // 优惠券类型
                coupon_sale_type: [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: 1,
                        name: '满减券',
                    },
                    {
                        id: 2,
                        name: '折扣券',
                    },
                ],
                // 领取方式
                pick_way: [
                    {
                        id: 'all',
                        name: '全部',
                    },
                    {
                        id: 1,
                        name: '免费领取',
                    },
                    {
                        id: 2,
                        name: '付费领取',
                    },
                    {
                        id: 3,
                        name: '链接领取',
                    },
                    {
                        id: 4,
                        name: '活动领取',
                    }
                ],
            },
        }
    },
    methods: {
        // 搜索
        handleSearch() {
            let model = Object.assign({}, this.model)
            model.coupon_sale_type =
                model.coupon_sale_type === 'all' ? '' : model.coupon_sale_type
            model.pick_way = model.pick_way === 'all' ? '' : model.pick_way
            this.$emit('on-search', model)
        },
        handleReset() {
            this.$emit('on-search', {})
            this.resetModel()
        },
        resetModel() {
            this.model = {
                keywords: '',
                coupon_sale_type: 'all',
                pick_way: 'all',
                start_time: '',
                end_time: '',
            }
            this.createTime = ''
        },
        changeCreateTime(date) {
            this.model.start_time = date[0]
            this.model.end_time = date[1]
        },
    },
    mounted() {
        this.resetModel()
    },
}
</script>
