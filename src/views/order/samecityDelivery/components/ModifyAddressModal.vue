/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <kdx-modal-frame
        v-model="showModal"
        :title="title"
        :ok-text="okText"
        @on-ok="handleOk"
        @on-cancel="handleCancel"
    >
        <div class="modal-content" v-if="type === 'modify'">
            <!-- <div class="text">取货地址修改后，将影响你以下几点：</div> -->
            <div class="text">
                已设置的配送范围信息将被清空，请修改地址后记得重新配置配送范围；
            </div>
            <!-- <div class="text">
                2.已开通的第三方配送都会重新审核，请准备3~7天审核期的其他配送方式。
            </div> -->
        </div>
        <div class="modal-content" v-else-if="type === 'open'">
            <div class="text">
                开启同城配送需要先设置发货地址，您还未设置，请在联系我们处设置。
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'modify',
        },
        title: {
            type: String,
            default: '地址修改提示',
        },
        okText: {
            type: String,
            default: '去修改',
        },
    },
    data() {
        return {
            showModal: false,
        }
    },
    watch: {
        value: {
            handler(value) {
                this.showModal = value
            },
            immediate: true,
        },
    },
    methods: {
        handleOk() {
            this.$emit('handleOk')
            this.$emit('input', false)
        },
        handleCancel() {
            this.showModal = false
            this.$emit('input', false)
        },
    },
}
</script>
<style lang="scss" scoped>
.modal-content {
    padding: 20px;
    .text {
        font-size: 14px;
        color: $text-first;
    }
}
</style>
