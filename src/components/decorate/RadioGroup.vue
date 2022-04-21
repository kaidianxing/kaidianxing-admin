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
    <div class='radio-group'>
        <RadioGroup v-model="selected" @on-change='onChange' :type='type' :vertical='vertical'>
            <Radio :label="index" v-for="(item,index) in items" :key='index' :disabled='item.disabled||disabled'>
                <span v-if="!$slots.example">
                    {{item.label}}
                </span>
                <slot name="example" v-bind:example="item" />

            </Radio>
        </RadioGroup>
        <div class='tip' v-if='$slots.tip&&$slots.tip.length'>
            <slot name='tip'></slot>
        </div>
        <div class='content' v-if='$slots.default&&$slots.default.length'>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            vertical: {
                type: Boolean,
                default: false
            },
            value: {
                type: [String, Number],
                default: ''
            },
            disabled: {
                type: Boolean,
                default: false
            },
            lazy: {
                type: Boolean,
                default: false
            },
            items: {
                type: Array,
                default: () => [{
                    label: 'label1',
                    iconType: '',
                    disabled: false,
                }, {
                    label: 'label2',
                    iconType: '',
                    disabled: false,
                }, ]
            },
            type: {
                type: String,
                default: undefined
            }
        },
        watch: {
            value: {
                immediate: true,
                handler() {
                    this.selected = '-1';
                    for (let k = 0; k < this.items.length; k++) {
                        if (this.items[k].id == this.value) {
                            this.selected = k;
                        }
                    }
                    if (this.selected == '-1') { //没有匹配值就看有没有id=‘’，作为默认值
                        for (let k = 0; k < this.items.length; k++) {
                            if (this.items[k].id === '') {
                                this.selected = k;
                            }
                        }
                    }
                    this.lastSelected = this.selected
                }
            }
        },
        data() {
            return {
                selected: '',
                lastSelected: null
            }
        },
        methods: {
            onChange(value) {
                if (this.lazy) {
                    if (this.lastSelected !== null) {
                        this.$nextTick(() => {
                            this.selected = this.lastSelected
                            let val = this.items[value].id;
                            this.$emit('input', val); //优先返回id
                            this.$emit('change', val, this.items[value]); //优先返回id 
                        })
                    }else{
                        this.lastSelected=this.selected
                        let val = this.items[this.selected].id;
                        this.$emit('input', val); //优先返回id
                        this.$emit('change', val, this.items[this.selected]); //优先返回id 
                    }
                }else{
                    let val = this.items[this.selected].id;
                    this.$emit('input', val); //优先返回id
                    this.$emit('change', val, this.items[this.selected]); //优先返回id 
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .radio-group {
        display: flex;
        flex-direction: column;
        .label {
            line-height: 32px;
            text-align: right;
        }
        .content {
            margin-top: 10px;
            background: #F4F6F8;
            border-radius: 2px;
            box-sizing: border-box;
            padding: 20px;
        }

    }
</style>