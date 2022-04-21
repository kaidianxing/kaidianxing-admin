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
    <div class='input-label'>
        <p class="label" :style='{"min-width":labelWidth+"px"}'>{{label}}：</p>
        <InputWithReset v-model='val' @input='change'></InputWithReset>
    </div>
</template>

<script>
    import InputWithReset from './InputWithReset'
    export default {
        components: {
            InputWithReset
        },
        props: {
            label: {
                type: String,
                default: 'Label'
            },
            value: {
                type: [String],
                default: ''
            },
            labelWidth: {
                type: [String, Number],
                default: 80
            }
        },
        watch: {
            value: {
                immediate: true,
                handler() {
                    this.val = this.value;
                }
            }
        },
        data() {
            return {
                val: ''
            }
        },
        methods: {
            change(val) {
                this.val = val;
                this.$emit('input', this.val)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-label {
        display: flex;
        height: 34px;
        flex-wrap: nowrap;
        .label {
            /* regular/14 */
            font-family: PingFang SC;
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 20px;
            /* identical to box height */
            display: flex;
            align-items: center;
            text-align: right;
            color: #262B30;
        }
    }
</style>