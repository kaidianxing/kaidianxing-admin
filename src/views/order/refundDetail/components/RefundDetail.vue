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
    <!--退款退货状态-->
    <Row class="order-detail-return-refund-status">
      <!--维权状态-->
      <Col :span="span">
        <refund-status :data="data" @action="dealRefund" />
      </Col>
      <!--维权信息-->
      <Col :span="span" class="middle-border">
        <refund-info :info="data.refund_info" :order-info="data"></refund-info>
      </Col>
      <!--客户退货信息-->
      <Col :span="span" v-if="span===6" class="middle-border">
        <express-info :dispatch_type="data.dispatch_type" :info="data.refund_info" :isExchange="isExchange" />
      </Col>
      <!--订单信息-->
      <Col :span="span">
        <order-info :data="data"></order-info>
      </Col>
    </Row>
    <!--维权处理-->
    <slot></slot>
  </div>
</template>

<script>
import RefundStatus from './RefundStatus'
import RefundInfo from './RefundInfo'
import OrderInfo from './OrderInfo'
import ExpressInfo from './ExpressInfo'

export default {
  name: 'status',
  components: {
    RefundStatus,
    RefundInfo,
    OrderInfo,
    ExpressInfo
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    isExchange: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    span() {
      let {
        status,
        member_express_sn,
        seller_express_sn
      } = this.data.refund_info
      if (
        status >= 2 &&
        status <= 11 &&
        (member_express_sn || seller_express_sn)
      ) {
        return 6
      }
      return 8
    }
  },

  methods: {
    dealRefund() {
      this.$parent.dealRefund()
    }
  }
}
</script>

<style scoped lang="scss">
.order-detail-return-refund-status {
  padding-top: 30px;
  padding-bottom: 40px; // form 字体调整
  /deep/ .ivu-form {
    .ivu-form-item-label {
      @include font-12-16;
      padding: 0;
    }
    .ivu-form-item-content {
      @include font-12-16;
      .ivu-btn {
        @include font-12-16;
        height: 16px;
        transform: translateY(-1px);
      }
      &:hover {
        .copy-text {
          display: inline-block;
        }
      }
      .copy-text {
        display: none;
      }
    }
  }
  > .ivu-col {
    /*padding-left: 20px;*/
    padding-right: 30px;
    height: 100%;
  }
  > .middle-border {
    border-left: 1px solid $border-color;
    border-right: 1px solid $border-color;
  }

  /deep/ .title {
    @include font-16-22-bold;
    color: $text-first;
    padding-bottom: 20px;
    padding-left: 20px;
  }

  .footer-btn {
    margin-top: 15px;
    .ivu-btn {
      margin-right: 10px;
      width: inherit;
      padding: 6px 12px;
      color: $brand-color;
    }
  }
  /deep/ .ivu-form {
    .ivu-form-item {
      margin-bottom: 20px;
    }
  }
}
</style>
