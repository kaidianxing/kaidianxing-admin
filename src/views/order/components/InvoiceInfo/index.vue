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
    <kdx-modal-frame
        v-model="value"
        title="发票信息"
        :width="700"
        okText="确认开票"
        :cancelText="cancelText"
        :isOk="isOk"
        :disabled-ok="noManagePerm"
        @on-cancel="handleCancel"
        @on-ok="handleOk"
    >
        <Form ref="form" :label-width="100" class="order-invoice-info">
            <FormItem label="发票类型：" class="r-form-item-text">
                <span
                    v-if="
                        data.is_electronic == '1' || data.is_electronic == '0'
                    "
                    >纸质发票</span
                >
                <span v-else-if="data.is_electronic == '2'">电子发票</span>
            </FormItem>
            <FormItem label="抬头类型：" class="r-form-item-text">
                <span v-if="data.is_company == '1'">个人</span>
                <span v-else-if="data.is_company == '2'">企业</span>
                <span v-else>-</span>
            </FormItem>
            <FormItem label="发票抬头：" class="r-form-item-text">
                <span>{{ data.title }}</span>
            </FormItem>
            <FormItem label="发票金额：" class="r-form-item-text">
                <span class="money">￥{{ price }}</span>
            </FormItem>
            <FormItem label="税号：" class="r-form-item-text">
                <span>{{ data.number }}</span>
            </FormItem>
            <FormItem
                label="邮箱地址："
                class="r-form-item-text"
                v-if="data.is_electronic == '2'"
            >
                <span>{{ data.address || '-' }}</span>
            </FormItem>
        </Form>
    </kdx-modal-frame>
</template>

<script>
export default {
    name: 'index',
    props: {
        data: {
            type: Object,
            default: () => {}
        },
        price: {
            type: [Number, String]
        },
        id: {
            type: [Number, String]
        }
    },
    data() {
        return {
            value: false,
            model: {},
            cancelText: '取消',
            isOk: true
        }
    },
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('order.op.change_invoice_status')
        },
    },
    methods: {
        setValue() {
            this.value = !this.value
            if (this.value) {
                if (this.data.status == '1') {
                    this.isOk = false
                    this.cancelText = '关闭'
                } else {
                    this.isOk = true
                    this.cancelText = '取消'
                }
            }
        },
        handleCancel() {
            this.setValue()
        },
        handleOk() {
            this.$api.orderApi
                .changeInvoiceStatus({ order_id: this.id })
                .then(res => {
                    if (res.error === 0) {
                        this.$Message.success('开票成功')
                        this.setValue()
                        this.$emit('on-refresh')
                    }
                })
        }
    }
}
</script>

<style scoped lang="scss">
.order-invoice-info {
    padding: 20px 40px;

    .money {
        @include font-18-25-bold;
        color: $warning-color;
        line-height: 20px;
    }
}
</style>
