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
    <div class='input-with-reset'>
        <Input :placeholder='placeholder' :maxlength="maxLength" class='input' ref="input" v-model="val" @on-change='change' @on-blur="blurChange">
            <span v-if="prependText" slot="prepend">{{prependText}}</span>
            <i-button class="reset-btn" slot="append" :disabled='disabled||value===""||defaultValue==val' @click='reset'>重置</i-button>
        </Input>
    </div>
</template>

<script>
    export default {
        props: {
            placeholder: {
                type: String,
                default: ''
            },
            disabled:{
                type: Boolean,
                default: false
            },
            default: {
                type: String,
                default: ''
            },
            width: {
                type: [String, Number],
                default: 50
            },
            value: {
                type: [String, Number],
                default: ''
            },
            prependText: {
                type: String,
                default: ''
            },
            maxLength: {
                type: [Number],
                default: null
            },
            emptySubmit: {
                type: Boolean,
                default: true
            },
            color: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            value: {
                immediate: true,
                handler() {
                    if(this.emptySubmit) {
                        this.val = this.value || this.default
                    } else {
                        this.val = this.value
                    }
                }
            },
            default(newVal){
                this.defaultValue = newVal
            }
        },
        data() {
            return {
                val: '',
                defaultValue:''
            }
        },
        created(){this.defaultValue = this.default},
        methods: {
            change(e) {
                let value = e.target.value
                if(this.color) {
                   let color = value.replace(/#/g, '')

                   if(color.length == 7) {
                       color = color.substr(0,6)
                   }

                  this.val = value = this.$refs.input.currentValue  = color
                }

                if (value) {
                    this.val = value || this.default;
                } 

                if(this.emptySubmit) {
                    this.$emit('input', this.val || this.default)
                } else {
                    this.$emit('input', value)
                }

                
            },
            reset() {
                this.val = this.default;
                this.$emit('input', this.val || this.default);
            },
            blurChange(){
                this.$emit('on-blur', (this.val|| this.default).replace('#', ' '));
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-with-reset {
        /deep/ .input {
            box-sizing: border-box;
            width: 160px;
            .ivu-input-search {
                color: #B8B9BD!important;
            }
            .ivu-input-search:hover {
                color: #fff!important;
            }

        }
        /deep/ .ivu-input-group-append {
            background-color: #fff;
            border: 0;
            .ivu-btn:hover {
                color: $brand-color!important;
                box-shadow: none;
                border: 1px solid $brand-color;
            }
        }

        .reset-btn {
            background-color: #fff;
            border-color: #e3e5e8;
        }
    }
</style>