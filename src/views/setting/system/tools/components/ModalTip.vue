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
    <kdx-modal-frame :value="value" :width="430" :closable="false" okText="确认" @on-cancel="handleCancel"
                 @on-ok="handleOk">
        <div class="order-list-refund-modal">
            <div class="refund-box">
                <div class="icon">
                    <Icon type="ios-help-circle"/>
                </div>
                <div class="content">
                    <div class="title">
                        提示
                    </div>
                    <slot></slot>
                </div>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "index",
        props: {
            value: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            inputHandler(e){
                console.log(e)
            },
            handleCancel() {
                this.$emit('on-cancel')
            },
            handleOk() {
                this.$emit('on-ok')
            }
        }
    };
</script>

<style scoped lang="scss">
    .order-list-refund-modal {
        padding: 32px 20px 26px;
        .refund-box {
            display: flex;
            .icon {
                font-size: 24px;
                color: $warning-color;
                padding-right: 10px;
                /deep/ .ivu-icon {
                    vertical-align: super;
                }
            }
            .content {
                .title {
                    @include font-16-22-bold;
                    color: $text-first;
                    padding: 1px;
                }
                .text {
                    @include font-14-20;
                    padding: 10px 0;
                }
                .ivu-form-item {
                    margin-bottom: 9px !important;
                }
            }
        }
    }
    /deep/.ivu-modal-footer button+button {
        margin-left: 20px;
    }
</style>
