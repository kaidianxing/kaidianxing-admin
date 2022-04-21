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
    <div class="color-picker">
        <ColorPicker v-model="getColor" recommend editable  @on-active-change="colorChange" @on-change="colorChange" />
        <InputWithReset prependText="#" color :empty-submit="false" @on-blur="change" :maxLength="7" :default="defaultVal" :disabled='disabled'  :value="color" @input="change" v-if="withInput"></InputWithReset>
    </div>
</template>

<script>
    import InputWithReset from './InputWithReset'
    export default {
        components: {
            InputWithReset
        },
        props: {
            default: {
                type: String,
                default: ''
            },
            withInput: {
                type: Boolean,
                default: true
            },
            value: {
                type: String,
                default: ''
            }
        },
        computed: {
            disabled() {
                return this.default == this.color
            },
            getColor: {
                get(){
                    return '#'+ this.color.toUpperCase()
                },
                set(val){
                    this.color = val.replace('#').toUpperCase()
                }
            }
        },
        watch: {
            value: {
                immediate: true,
                handler() {
                    if (/^#?([0-9a-f]{6})$/i.test(this.value)) {
                        this.color = this.value.replace('#', '').toUpperCase()
                    }
                }
            },
            default: {
                immediate: true,
                handler() {
                    this.defaultVal = this.default.replace('#', '').toUpperCase()
                }
            }
        },
        data() {
            return {
                defaultVal: '',
                color: ''
            }
        },
        methods: {
            colorChange(val){
                if(!val){
                    val = this.defaultVal
                }
                this.color = val.replace('#', '').toUpperCase()
                this.$emit('change', '#'+this.color)
                this.$emit('input', '#'+this.color)
            },
            change(val) {
                this.color = val.replace('#', '').toUpperCase()
                this.$emit('change', '#'+this.color)
                this.$emit('input', '#'+this.color)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .color-picker {
        display: flex;
        height: 34px;
        flex-wrap: nowrap;
        /deep/ .ivu-color-picker {
            width: 66px;
            margin: 0 10px 0 0;
            .ivu-color-picker-color {
                width: 100%;
                height: 100%;
            }
            .ivu-icon-ios-arrow-down {
                display: none;
            }
            .ivu-color-picker-input {
                padding: 2px 4px 6px 4px;
                box-sizing: border-box;
            }
            .ivu-icon-ios-close {
                margin-top: 2px;
            }
        }
    }
</style>