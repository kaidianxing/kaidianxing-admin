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
        <!--待付款-->
        <p class="title" style="padding-left: 0">维权状态</p>

        <!--驳回申请-->
        <template v-if="getStatus === -1">
            <p class="big-title" style="color: #939799">
                <Icon type="ios-close-circle" />
                <span>驳回申请</span>
            </p>
            <div class="dismiss-reason">
                <p class="label">驳回原因：</p>
                <p class="text word-break">{{data.refund_info.reject_reason}}</p>
            </div>
        </template>
        <!-- 申请中 -->
        <template v-else>
            <p
                class="flex align-center big-title"
                :style="{
              color:statusObj.color
            }"
            >
                <span
                    v-if="statusObj.icon"
                    class="iconfont icon-yes status-icon"
                    :style="{
                        color:statusObj.color
                    }"
                ></span>
                <span
                    class="iconfont icon-dengdai status-icon"
                    :style="{
                        color:statusObj.color
                    }"
                    v-else
                ></span>

                <span>{{statusObj.text}}</span>
            </p>
            <p class="reality-refund-money" v-if="statusObj.money">
                <span>实际退款金额：</span>
                <span class="reality-money">￥{{data.refund_info.price}}</span>
            </p>

            <template >
                <Button v-if="statusObj.btn" :disabled="noManagePerm" type="primary" class="status-btn" @click="dealRefund">处理申请</Button>
            </template>
        </template>
    </div>
</template>


<script>
export default {
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            imgModal: false,
            imgList: [],
            type: ''
        }
    },
    computed: {
        noManagePerm() {
            return !this.$getPermMap("order.refund.manage");
        },
        getStatus() {
            return this.data.refund_info.status || 0
        },
        statusObj() {
            let textObj = {
                color: '#f90',
                text: '',
                btn: true
            }
            if (this.data.refund_info?.need_platform == 1 && this.getStatus == 0) {
                textObj.text = '等待平台处理维权'
            } else if (this.getStatus == 0) {
                textObj.text = '等待商家处理维权 '
            } else if (this.getStatus == 1) {
                textObj.text = '等待买家退回商品 '
            } else if (this.getStatus == 2) {
                textObj.text = '买家退回物品，等待商家重新发货 '
            } else if (this.getStatus == 3) {
                if (this.type == 3) {
                    textObj.text = '商家已发货，等待客户收货'
                } else {
                    textObj.text = '买家退回物品，等待退款'
                }
            } else if (this.getStatus == 10 || this.getStatus == 11) {
                textObj.btn = false
                textObj.color = '#19be6b'
                textObj.icon = true

                if (this.type == 3) {
                    textObj.text = '换货完成'
                } else {
                    textObj.money = true

                    if (this.type == 1) {
                        textObj.text = '退款完成'
                    } else {
                        textObj.text = '退款退货完成'
                    }
                }
            }

            return textObj
        },
    },
    watch: {
        data: {
            handler() {
                this.initGoods()
            },
            immediate: true
        }
    },
    methods: {
        initGoods() {
            let { refund_info } = this.data
            this.type = refund_info.refund_type
        },
        dealRefund() {
            this.$emit('action')
        }
    }
}
</script>


<style lang="scss" scoped>
.big-title {
    @include font-24-34-bold;
    .status-icon {
        font-weight: normal;
        font-size: 32px;
        padding-right: 6px;
    }
}

.status-btn {
    margin: 20px 0;
}

// 驳回原因
.dismiss-reason {
    display: flex;
    flex-wrap: nowrap;
    margin-top: 20px;
    color: $text-first;
    > .label {
        @include font-12-16;
    }
    > .text {
        @include font-12-18;
        width: 200px;
    }
}

.reality-refund-money {
    padding-top: 20px;
    .reality-money {
        @include font-18-25-bold;
        color: $success-color;
    }
}
</style>
