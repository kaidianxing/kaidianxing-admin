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
    <Modal
        :title="title"
        :transfer="transfer"
        :value="value"
        :width="width"
        @input="inputHandler"
    >
        <slot></slot>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </Modal>
</template>

<script>
export default {
    name: 'AModal',
    props: {
        title: {
            type: String,
            default: ''
        },
        value: {
            type: Boolean
        },
        // 是否放置于body
        transfer: {
            type: Boolean,
            default: false
        },
        width: {
            type: [String, Number],
            default: 520
        }
    },
    methods: {
        inputHandler(e) {
            this.$emit('input', e)
        }
    }
}
</script>


<style lang="scss" scoped>
/deep/ .ivu-modal {
    .ivu-modal-header {
        height: 60px;
        padding: 20px;
    }
    .ivu-modal-close {
        top: 15px;
        right: 15px;
    }
    .ivu-modal-content {
        border-radius: 16px;
    }

    .ivu-modal-body {
        padding: 20px 20px 20px 40px;
        height: 560px;
        overflow-y: scroll;
    }

    .ivu-modal-footer {
        padding: 16px;
        text-align: center;
    }
}
</style>