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
  <div class="order-detail-refund">
    <!--退货/退款状态-->
    <Card>
      <Steps :current="getCurrent" :status="getStatus">
        <Step title="客户申请维权" :content="refund_info.created_at|getTime"></Step>
        <Step title="处理维权" :content="refund_info.seller_accept_time|getTime"></Step>
        <Step v-if="showCustom" title="客户退回商品" :content="refund_info.member_express_time|getTime"></Step>
        <Step
          v-if="status !== -1"
          title="商家重新发货"
          :content="refund_info.seller_express_time|getTime"
        ></Step>
        <Step :title="step.lastTitle" :content="refund_info.finish_time|getTime"></Step>
      </Steps>
    </Card>
    <div class="order-detail-content">
      <refund-detail :data="info" v-if="info.refund_info" isExchange>
        <refund-modal :visible="modal.refundModal" :data="info" :status="refund_info.status"></refund-modal>
      </refund-detail>
    </div>
    <div class="order-detail-con">
      <ul class="detail_tab">
        <li class="tab" @click="clickTab(0)" :class="{active: 0 == clickIndex}">商品信息</li>
        <li class="tab" @click="clickTab(1)" :class="{active: 1 == clickIndex}" v-if="commission_info">分销商信息</li>
        <li class="tab" @click="clickTab(2)" :class="{active: 2 == clickIndex}" v-if="form.content">表单信息</li>
      </ul>
      <!--表单信息 isShow 控制表头显示-->
      <form-info v-if="form.content && clickIndex == 2" :data="form.content" :isShow="false"></form-info>
      <!--分销商(没有分销则不显示)-->
      <distributor-information
          :info="commission_info"
          v-if="commission_info && clickIndex == 1"
          @edit="editCommision"
      ></distributor-information>
      <order-detail-list is-refund :data="info" @on-change-goods-info="changeGoodsInfo" v-if="clickIndex==0"></order-detail-list>
      <commission-edit :orderId="id" :orderNo="orderNo" :memberId="member_id" :visible.sync="visible" @on-success="getData"></commission-edit>
    </div>
  </div>
</template>

<script>
import RefundDetail from '../components/RefundDetail'
import RefundModal from './components/RefundModal'
import DistributorInformation from '@/views/order/components/DistributorInformation'
import OrderDetailList from '@/views/order/components/OrderDetailList'
import CommissionEdit from '../../components/CommissionEdit'
import FormInfo from "@/components/form/FormInfo";

import mixins from '../mixins'

export default {
  // 退货退款
  name: 'index',
  mixins: [mixins],
  components: {
    RefundDetail,
    RefundModal,
    DistributorInformation,
    OrderDetailList,
    CommissionEdit,
    FormInfo
  },

  computed: {
    getCurrent() {
      let current = this.status
      if (0 <= this.status && this.status <= 3) {
        current++
      }
      // 商家驳回
      if (this.status === -1) {
        current = 2
      }
      // 商家完成换货
      if (this.status === 10 || this.status === 11) {
        current = 5
        // 用户是否退回了商品
        if (this.showCustom) {
          current--
        }
      }
      return current
    },
    showCustom() {
      if (this.status === -1) return false
      if (
        (this.status === 10 || this.status === 11||this.status===3) &&
        !this.refund_info.member_express_sn
      ) {
        return false
      }
      return true
    }
  },
  watch: {
    status(val) {
      if (val === 0) {
        this.step.lastTitle = '换货完成'
      } else if (val > 0) {
        this.step.lastTitle = '换货成功'
      } else {
        this.step.lastTitle = '换货失败'
      }
    }
  },
  data(){
    return {
      clickIndex: 0, //tab选中
    }
  },
  methods: {
    // 切换tab
    clickTab(i) {
      this.clickIndex = i
    }
  },
}
</script>

<style scoped lang="scss">
@import '../css/common.scss';
</style>
