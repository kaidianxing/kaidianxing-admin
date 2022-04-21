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
    <kdx-modal-frame v-model="value" title="创建优惠券" width="500" @on-ok="handleOk"
                 @on-cancel="handleCancel">
        <div class="save-coupon-modal">
            <p class="hint">您正在创建一张</p>
            <p class="title">
                消费<span> {{content}} </span>的优惠券
            </p>
            <p class="text">
                请确认其他限制条件，保存后立即生效，部分限制条件不可再次修改。
            </p>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "SaveModal",
        props: {
            content: {
                type: String
            }
        },
        data() {
            return {
                value: false
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
            },
            handleOk() {
                this.setValue();
                this.$emit('on-change');
            },
            handleCancel() {
                this.setValue();
            }
        }
    };
</script>

<style scoped lang="scss">
    .save-coupon-modal {
        padding: 40px 30px 70px 30px;

        p {
            text-align: center;
        }

        .hint {
            color: $text-first;
            @include font-14-20;
        }

        .title {
            color: $text-first;
            @include font-14-20;
            padding: 20px 0;

            > span {
                @include font-24-34-bold;
                color: $warning-color;
            }
        }

        .text {
            @include font-12-16;
            color: $text-third;
        }
    }
</style>
