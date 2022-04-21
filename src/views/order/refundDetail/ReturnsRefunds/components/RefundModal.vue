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
    title="维权处理"
    :width="700"
    @on-cancel="handleCancel"
    @on-ok="handleOk"
  >
    <Form
      ref="form"
      :label-width="120"
      :model="model"
      class="order-refund-detail-refund-modal"
      :rules="rules"
    >
      <FormItem label="维权类型：" class="r-form-item-text">
        <kdx-tag-label type="danger" size="small">退款退货</kdx-tag-label>
      </FormItem>
      <FormItem label="处理方式：" class="r-form-item-checkbox" prop="type">
        <RadioGroup v-model="model.type">
          <Radio label="0" v-if="getStatus===0">通过申请</Radio>
          <Radio label="1">同意退款</Radio>
          <Radio label="2" v-if="getStatus===0">驳回申请</Radio>
          <Radio label="3">手动退款</Radio>
        </RadioGroup>
        <kdx-hint-alert :show-icon="false" type="info" v-show="model.type === '0'">
          通过申请后需要收到客户寄回商品才可进行下一步操作
        </kdx-hint-alert>
        <kdx-hint-alert :show-icon="false" v-show="model.type === '1'">
          <p v-if="getStatus===0" class="alert-blue">直接同意退款无需客户寄回商品，直接进行退款</p>
          <p v-else>请确认您已经收到客户寄出的商品后同意退款.</p>
          <p>微信支付方式：会返回到相应的支付渠道(如零钱或银行卡)</p>
          <p>其他支付方式：会返回到微信钱包(需商户平台余额充足)</p>
          <p>如有余额抵扣：会返回金额到商城用户余额</p>
          <p>如有积分抵扣：申请维权的订单抵扣积分会返回到用户积分中</p>
        </kdx-hint-alert>
      </FormItem>
      <FormItem label="退货地址：" v-show="model.type === '0'" prop="address">
        <Select class="width-430" v-model="model.address">
          <Option
            :label="address.title"
            :value="address.id"
            v-for="address in address.list"
            :key="address.id"
          ></Option>
        </Select>
      </FormItem>
      <!-- <FormItem label="返回方式：" v-show="model.type === '3'">
        <Input v-model="model.style" class="width-430" placeholder="请手动输入返回方式" />
      </FormItem>-->
<!--      <FormItem label="留言：" v-show="model.type === '0'" prop="message">-->
<!--        <Input-->
<!--          v-model="model.message"-->
<!--          type="textarea"-->
<!--          autosize-->
<!--          :maxlength="200"-->
<!--          class="width-430"-->
<!--          placeholder="请输入"-->
<!--        />-->
<!--      </FormItem>-->
      <FormItem label="驳回原因：" v-show="model.type === '2'" prop="reason">
        <Input
          v-model="model.reason"
          type="textarea"
          autosize
          :maxlength="200"
          class="width-430"
          placeholder="请输入"
        />
      </FormItem>
    </Form>
  </kdx-modal-frame>
</template>

<script>
export default {
  name: 'RefundModal',
  props: {
    visible: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      value: false,
      model: {
        type: '0',
        // message: '',
        address: '',
        style: ''
      },
      address: {
        list: []
      },
      rules: {
        address: [{ required: true, message: '请选择退货地址' }]
      }
    }
  },
  computed: {
    getStatus() {
      if (this.data.refund_info) {
        return this.data.refund_info.status
      } else {
        return 0
      }
    }
  },
  watch: {
    visible() {
      this.value = true
      this.getAddress()
    },
    getStatus: {
      handler(val) {
        if (val > 0) {
          this.model.type = '1'
        }
      },
      immediate: true
    }
  },
  methods: {
    getAddress() {
      if (this.address.list.length) {
        return
      }
      this.$api.settingApi.getAllRefundAddress().then(res => {
        if (res.error === 0) {
          this.address.list = res.list
        }
      })
    },
    handleCancel() {
      this.value = false
      this.$refs.form.resetFields()
    },
    handleOk() {
      let type = this.model.type
      let {
        id,
        refund_type,
        refund_info: { order_goods_id }
      } = this.data

      let data = {
        order_id: id
      }

      if (refund_type == '2') {
        data.order_goods_id = order_goods_id
      }

      if (type === '2') {
        if (this.model.reason) {
          data.reject_reason = this.model.reason
        }
        this.rejectHandler(data)
      } else if (type === '3') {
        this.manualHandler(data)
      } else if (type === '1') {
        this.autoHandler(data)
      } else {
        data.refund_address_id = this.model.address

        // if (this.model.message) {
        //   data.seller_message = this.model.message
        // }
        this.agreeHandler(data)
      }
    },
    agreeHandler(data) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$api.orderApi
            .agreeReturn(data)
            .then(res => {
              if (res.error === 0) {
                this.$Message.success('操作成功')
                this.$parent.$parent.getData()
              }
            })
            .finally(() => {
              this.value = false
            })
        }
      })
    },
    autoHandler(data) {
      this.$api.orderApi
        .autoRefund(data)
        .then(res => {
          if (res.error === 0) {
            this.$Message.success('操作成功')
            this.$parent.$parent.getData()
          }
        })
        .finally(() => {
          this.value = false
        })
    },
    manualHandler(data) {
      this.$api.orderApi
        .manualRefund(data)
        .then(res => {
          if (res.error === 0) {
            this.$Message.success('操作成功')
            this.$parent.$parent.getData()
          }
        })
        .finally(() => {
          this.value = false
        })
    },
    rejectHandler(data) {
      this.$api.orderApi
        .refundRejectOrder(data)
        .then(res => {
          if (res.error === 0) {
            this.$Message.success('操作成功')
            this.$parent.$parent.getData()
          }
        })
        .finally(() => {
          this.value = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.order-refund-detail-refund-modal {
  padding: 30px 20px 20px 0;
  .ivu-form-item {
    margin-bottom: 20px;
    .hint-alert-component {
      margin-top: 10px;
      p {
        @include font-12-24;
      }
      .alert-blue {
        color: $brand-color;
      }
    }
  }
}
</style>
