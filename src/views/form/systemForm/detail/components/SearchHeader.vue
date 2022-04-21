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
            :label-width="100"
            inline
            @submit.native.prevent
        >
            <FormItem label="提交会员：">
                <Input
                    type="text"
                    v-model="model.keyword"
                    placeholder="会员昵称/会员ID"
                    class="width-340"
                    @on-enter="handleSearch"
                />
            </FormItem>
            <FormItem label="订单编号：" v-if="type === 'order'">
                <Input
                    type="text"
                    v-model="model.order_no"
                    placeholder="订单编号"
                    class="width-340"
                    @on-enter="handleSearch"
                />
            </FormItem>
            <FormItem label="商品属性：" v-if="type != 'order'">
                <Select v-model="model.source" class="width-160">
                    <Option
                        v-for="item in goods_type"
                        :key="item.id"
                        :value="item.id"
                    >{{ item.title }}
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
    name: 'SearchHeader',
    props: {
        type: {
            type: String
        }
    },
    data() {
        return {
            model: {
                keyword: '',
                goodsType: '', //商品属性
            },
            goods_type: [
                {
                    id: '',
                    title: '全部',
                },
                {
                    id: 1,
                    title: '下单商品',
                },
                {
                    id: 2,
                    title: '价格面议',
                },

            ]
        }
    },
    mounted() {
        this.resetModel();
    },
    methods: {
        // 搜索
        handleSearch() {
            let model = Object.assign({}, this.model);
            this.$emit('on-change', model)
        },
        handleReset() {
            this.$emit('on-change', {})
            // 重置表单
            this.resetModel()
        },
        resetModel() {
            if (this.type === 'order') {
                this.model = {
                    keyword: '',
                    order_no: '',
                }
            } else {
                this.model = {
                    keyword: '',
                    source: '',
                }
            }
        }
    },
}
</script>

<style scoped lang="scss">

</style>
