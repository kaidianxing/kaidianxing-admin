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
        <p class="title">佣金信息</p>
        <div class="flex align-center info-list">
            <div class="info-label">申请佣金：</div>
            <div class="info-desc"><span class="bold">￥{{info.apply_commission}}</span> (含{{count}}笔订单)</div>
        </div>
        <div class="flex align-center info-list">
            <div class="info-label">提现手续费：</div>
            <div class="info-desc">￥{{info.charge_deduction|| '0.00'}}</div>
        </div>
        <div class="flex align-center info-list">
            <div class="info-label">实际佣金：</div>
            <div class="info-desc info-actual">￥{{info.final_commission|| '0.00'}}</div>
            <div class="info-commission" v-if="info.ladder_commission>0">(含阶梯佣金：￥{{info.ladder_commission}})</div>
        </div>
        <div class="flex align-center info-list">
            <div class="info-label">申请时间：</div>
            <div class="info-desc">{{info.apply_time}}</div>
        </div>
        <div class="flex align-center info-list" v-if="info.status>0">
            <div class="info-label">审核时间：</div>
            <div class="info-desc">{{info.check_time}}</div>
        </div>
        <div class="flex align-center info-list" v-if="info.status==20||info.status==21">
            <div class="info-label">打款时间：</div>
            <div class="info-desc">{{info.pay_time}}</div>
        </div>
        <div class="flex align-center info-list" v-if="info.status==30||info.status==31">
            <div class="info-label">无效时间：</div>
            <div class="info-desc">{{info.check_time}}</div>
        </div>
        <div class="flex btn-group">
            <Button type="primary" v-if="status==0" class="btn" :disabled="noManagePerm" @click="agreeHandler">审核通过</Button>
            <Button class="btn" v-if="status==0" :disabled="noManagePerm" @click="refuseHandler">驳回申请</Button>
            <Button type="primary" v-if="status==10" :disabled="noManagePerm" class="btn" @click="payHandler">打款</Button>
            <Button class="btn" v-if="status==10" :disabled="noManagePerm" @click="manaualHandler">手动打款</Button>
            <Button class="btn" v-if="status==10" :disabled="noManagePerm" @click="checkAgagin">重新审核</Button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        count: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            status: 0
        }
    },
    computed: {
        noManagePerm(){//管理权限
            return !this.$getPermMap('finance.withdraw.manage')
        }
    },
    watch: {
        info: {
            handler() {
                this.status = this.info.status
            },
            immediate: true
        }
    },
    methods: {
        // 同意提现申请
        agreeHandler() {
            this.$Modal.confirm({
                title: '提示',
                content: '确认通过此用户的提现申请?',
                cancelText: '取消',
                onOk: () => {
                    this.$api.commissionApi
                        .applyCheckedAgree({ id: this.info.id })
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功')
                                this.$emit('refresh', {})
                            }
                        })
                }
            })
        },
        // 拒绝提现申请
        refuseHandler() {
            this.$Modal.confirm({
                title: '提示',
                content: '确认拒绝此用户的提现申请?',
                cancelText: '取消',
                onOk: () => {
                    this.$api.commissionApi
                        .applyCheckedRefuse({ id: this.info.id })
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功')
                                this.$emit('refresh', {})
                            }
                        })
                }
            })
        },
        // 打款
        payHandler() {
            this.$Modal.confirm({
                title: '提示',
                content: '确认打款给此用户吗?',
                cancelText: '取消',
                onOk: () => {
                    this.$api.commissionApi
                        .applyRemit({ id: this.info.id })
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功')
                                this.$emit('refresh', {})
                            }
                        })
                }
            })
        },
        // 手动打款
        manaualHandler() {
            this.$Modal.confirm({
                title: '提示',
                content: '确认手动打款给此用户吗?',
                cancelText: '取消',
                onOk: () => {
                    this.$api.commissionApi
                        .manaualRemit({ id: this.info.id })
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功')
                                this.$emit('refresh', {})
                            }
                        })
                }
            })
        },
        checkAgagin(){
            this.$Modal.confirm({
                title: '提示',
                content: '确认重新审核吗?',
                cancelText: '取消',
                onOk: () => {
                    this.$api.commissionApi
                        .checkAgain({ id: this.info.id })
                        .then(res => {
                            if (res.error === 0) {
                                this.$Message.success('操作成功')
                                this.$emit('refresh', {})
                            }
                        })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.title {
    @include font-16-22-bold;
    color: $text-first;
    padding: 0 0 20px 20px;
}

.info-list {
    margin-bottom: 24px;
    @include font-12-16;

    .info-label {
        width: 100px;
        text-align: right;
        color: #262b30;
    }
    .info-commission {
        text-align: right;
        color: #262b30;
        margin-left: 10px;
    }

    .info-value {
        color: #262b30;

        &.bold {
            font-weight: bold;
        }
    }
    .info-actual {
        @include font-18-25-bold;
        color: $warning-color;
    }
}

.btn-group {
    padding-left: 40px;

    .btn {
        margin-right: 10px;
        &.ivu-btn-default {
            min-width: 88px;
            color: $brand-color;
        }
    }
}
</style>
