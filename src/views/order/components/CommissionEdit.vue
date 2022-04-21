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
    <kdx-modal-frame v-model="value" title="修改佣金" :width="970" @on-cancel="cancelHandler">
        <div class="content">
            <div class="item">
                <span class="label">会员名称：</span>
                <img
                    :src="member_info.avatar || $utils.staticImg('decorate/avatar_mobile.png')"
                    class="user-avatar"
                />
                <span class="user-name" @click="goMember">{{member_info.nickname}}</span>
                <span class="label">手机号码：</span>
                <span class="value">{{member_info.mobile}}</span>
            </div>
            <div class="item order">
                <div>
                    <span class="label">订单编号：</span>
                    <span class="value">{{orderNo}}</span>
                </div>
                <span class="tip">提示：不能修改的佣金为已申请或已结算佣金</span>
            </div>
            <commision-table :editable="editable" :data="list" ref="table"></commision-table>
        </div>
        <template #footer>
            <Button class="default-long" @click="cancelHandler">取消</Button>
            <Button class="default-long" @click="resetTable">恢复默认</Button>
            <Button class="primary-long" @click="sureHandler" :disabled="!editable">确认修改</Button>
        </template>
    </kdx-modal-frame>
</template>

<script>
import CommisionTable from './commisionTable'
export default {
    name: 'CommissionEdit',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        orderId: String,
        orderNo: String,
        memberId: String
    },
    components: {
        CommisionTable
    },
    data() {
        return {
            value: false,
            list: [],
            member_info: {},
            editable: false
        }
    },
    watch: {
        visible: {
            handler() {
                this.value = this.visible
                this.visible && this.getInfo()
            },
            immediate: true
        }
    },
    methods: {
        getInfo() {
            this.$api.orderApi
                .getCommisionInfo({
                    order_id: this.orderId,
                    member_id: this.memberId
                })
                .then(res => {
                    if (res.error === 0) {
                        let { member_info, commission_info, is_can_edit } = res
                        this.list = commission_info
                        this.member_info = member_info
                        this.editable = is_can_edit
                    }
                })
        },
        goMember() {
            this.$utils.openNewWindowPage('/member/detail', { id: this.memberId })
        },
        cancelHandler() {
            this.$emit('update:visible', false)
            this.value = false
        },
        resetTable() {
            this.$refs.table.refreshData()
        },
        sureHandler() {
            let commission_info = this.$refs.table.dealData()
            let params = {
                order_id: this.orderId,
                member_id: this.memberId,
                commission_info
            }

            this.$api.orderApi.editCommisionInfo(params).then(res => {
                if (res.error === 0) {
                    this.cancelHandler()
                    this.$emit('on-success')
                    this.$Message.success('操作成功')
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.content {
    padding: 0 20px 60px;

    .item {
        display: flex;
        align-items: center;
        margin-top: 20px;

        &.order {
            justify-content: space-between;
        }
    }

    .label {
        width: 70px;
        @include font-14-20;
        color: #262b30;
    }

    .value {
        @include font-14-20;
        color: #262b30;
        cursor: pointer;
    }

    .user-avatar {
        margin-right: 10px;
        border: 1px solid $uni-border-color;
        border-radius: 50%;
        height: 30px;
        width: 30px;
    }

    .user-name {
        margin-right: 20px;
        @include font-14-20;
        color: $brand-color;
        cursor: pointer;
    }

    .tip {
        @include font-14-20;
        color: #636669;
    }

    /deep/ .first-input {
        .ivu-input-group-prepend {
            background-color: $brand-color;
            color: #fff;
            border: 0;
        }
    }
    /deep/ .second-input {
        .ivu-input-group-prepend {
            border: 0;
            background-color: #ff9900;
            color: #fff;
        }
    }
    /deep/ .third-input {
        .ivu-input-group-prepend {
            background-color: #19be6b;
            color: #fff;
            border: 0;
        }
    }
}
</style>
