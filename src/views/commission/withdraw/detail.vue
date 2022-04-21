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
    <div class="detail">
        <Card>
            <Steps :current="getCurrent.current" :status="getCurrent.status">
                <Step
                    v-for="step in getSteps"
                    :key="step.key"
                    :title="step.text"
                    :content="applyInfo[step.content] |getTime"
                ></Step>
            </Steps>
        </Card>
        <div class="detail-content">
            <kdx-form-title>提现信息</kdx-form-title>
            <div class="flex">
                <div class="detail-list">
                    <detail-retailer :info="agentInfo" :apply-info="applyInfo"></detail-retailer>
                </div>
                <div class="detail-list">
                    <detail-commission :count="count" :info="applyInfo" @refresh="getInfo"></detail-commission>
                </div>
                <div class="detail-list">
                    <detail-collect :info="applyInfo"></detail-collect>
                </div>

                <div class="detail-list">
                    <detail-retail :info="agentInfo"></detail-retail>
                </div>
            </div>
            <kdx-form-title>商品信息</kdx-form-title>
            <div>
                <detail-list :status="status" :data="orderList"></detail-list>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import DetailRetailer from './components/detail/DetailRetailer'
import DetailCommission from './components/detail/DetailCommission'
import DetailCollect from './components/detail/DetailCollect'
import DetailRetail from './components/detail/DetailRetail'
import DetailList from './components/detail/DetailList'
export default {
    components: {
        DetailRetailer,
        DetailCommission,
        DetailCollect,
        DetailRetail,
        DetailList
    },
    data() {
        return {
            orderList: [],
            id: '',
            agentInfo: {},
            applyInfo: {},
            count: 0,
            status: 0,
            steps: [
                { text: '申请中', content: 'apply_time' },
                { text: '商家审核', content: 'check_time' },
                { text: '商家打款', content: 'pay_time' },
                { text: '提现完成', content: 'pay_time' },
                { text: '无效', content: 'apply_time' }
            ]
        }
    },
    computed: {
        getCurrent() {
            if (this.status == 10) {
                return {
                    current: 2,
                    status: 'finish'
                }
            }

            if (this.status == 20 || this.status == 21) {

                return {
                    current: 4,
                    status: 'finish'
                }
            }

            if (this.status == 30 || this.status == 31) {
                return {
                    current: 2,
                    status: 'error'
                }
            }

            return {
                current: 1,
                status: 'finish'
            }
        },

        getSteps() {
            let [step1, step2, step3, step4, step5] = this.steps
            if (this.status == 30 || this.status == 31) {
                return [step1, step2, step5]
            }

            return [step1, step2, step3, step4]
        }
    },
    mounted() {
        this.id = this.$route.query.id
        this.getInfo()
    },
    methods: {
        getInfo() {
            this.$api.commissionApi.applyDetail({ id: this.id }).then(res => {
                let { error, agent_info, order_info, apply_info, order_count } = res
                if (error === 0) {
                    this.orderList = order_info
                    this.agentInfo = agent_info
                    this.applyInfo = apply_info
                    this.status = apply_info.status
                    this.count = order_count
                }
            })
        }
    },
    filters: {
        getTime(time) {
            if (time === '0000-00-00 00:00:00') {
                return ''
            } else {
                return time
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.detail {
    background-color: #f5f5f5;
    margin-top: 20px;
    /deep/ .ivu-card-body {
        padding: 30px;
        .ivu-steps {
            padding: 0 130px;
        }
    }
    &-content {
        overflow: hidden;
        margin-top: 10px;
        padding: 40px 40px 0;
        background-color: #ffffff;
    }
    /deep/ .ivu-steps-title {
        @include font-14-20;
        color: $text-first;
    }
    /deep/ .ivu-steps-content {
        @include font-12-16;
        color: $text-second;
    }

    /deep/ .ivu-card {
        border: none;
        &:hover {
            box-shadow: none;
        }
    }

    .detail-list {
        border-right: 1px solid #e9edef;
        margin-bottom: 45px;
        flex: 1;
    }
}
</style>
