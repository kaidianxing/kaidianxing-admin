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
    <kdx-modal-frame v-model="value" title="删除优惠券" width="400" @on-cancel="handleCancel" @on-ok="handleOk">
        <div class="delete-coupon-modal">
            <RadioGroup v-model="type">
                <Radio label="1">会员已领取的优惠券可正常使用</Radio>
                <Radio label="2">一并删除</Radio>
            </RadioGroup>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "DeleteCouponsModal",
        props: {},
        data() {
            return {
                value: false,
                type: '1'
            };
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value) {
                    this.type = '1';
                }
            },
            handleCancel() {
                this.setValue();
            },
            handleOk() {
                this.$Modal.confirm({
                    title: '提示',
                    content: '确认删除优惠券？',
                    onOk: () => {
                        this.$emit('on-change', this.type);
                        this.setValue();
                    },
                    onCancel: () => {
                    }
                });
            }
        }
    };
</script>

<style scoped lang="scss">
    .delete-coupon-modal {
        padding: 20px;
        height: 100px;
        label {
            display: block;
            &:last-child {
                padding-top: 20px;
            }
        }
    }
</style>
npm
