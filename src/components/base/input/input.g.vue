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
    <div :class="wrapClasses">
        <template v-if="type !== 'textarea'">
            <div :class="[prefixCls + '-group-prepend']" v-if="prepend" v-show="slotReady">
                <slot name="prepend"></slot>
            </div>
            <i class="ivu-icon" :class="['ivu-icon-ios-close', prefixCls + '-icon', prefixCls + '-icon-clear' , prefixCls + '-icon-normal']" v-if="clearable && currentValue" @click="handleClear"></i>
            <i class="ivu-icon" :class="['ivu-icon-' + icon, prefixCls + '-icon', prefixCls + '-icon-normal']" v-else-if="icon" @click="handleIconClick"></i>
            <transition name="fade">
                <i class="ivu-icon ivu-icon-load-c ivu-load-loop" :class="[prefixCls + '-icon', prefixCls + '-icon-validate']" v-if="!icon"></i>
            </transition>
            <input
                :id="elementId"
                :autocomplete="autocomplete"
                :spellcheck="spellcheck"
                ref="input"
                :type="type"
                :class="inputClasses"
                :placeholder="placeholder"
                :disabled="disabled"
                :maxlength="maxlength"
                :showLimit="showLimit"
                :readonly="readonly"
                :name="name"
                :value="currentValue"
                :number="number"
                :autofocus="autofocus"
                @keyup.enter="handleEnter"
                @keyup="handleKeyup"
                @keypress="handleKeypress"
                @keydown="handleKeydown"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="handleInput"
                @change="handleChange">
            <div :class="[prefixCls + '-group-append']" v-if="append" v-show="slotReady">
                <slot name="append"></slot>
            </div>
            <div class="maxlength" v-if="maxlength && showLimit" style="vertical-align: middle" :style="disabled?'background:#f7f7f7;cursor: not-allowed;':''">{{presentlength}}/{{maxlength}}</div>
        </template>
        <textarea
            v-else
            :id="elementId"
            :wrap="wrap"
            :autocomplete="autocomplete"
            :spellcheck="spellcheck"
            ref="textarea"
            :class="textareaClasses"
            :style="textareaStyles"
            :placeholder="placeholder"
            :disabled="disabled"
            :rows="rows"
            :maxlength="maxlength"
            :readonly="readonly"
            :name="name"
            :value="currentValue"
            :autofocus="autofocus"
            @keyup.enter="handleEnter"
            @keyup="handleKeyup"
            @keypress="handleKeypress"
            @keydown="handleKeydown"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleInput">
        </textarea>
        <div class="maxlength" v-if="maxlength && type == 'textarea'" :style="disabled?'background:#f7f7f7;cursor: not-allowed;':''">{{presentlength}}/{{maxlength}}</div>
    </div>
</template>
<script>
    import {oneOf, findComponentUpward} from 'view-design/src/utils/assist';
    import calcTextareaHeight from 'view-design/src/utils/calcTextareaHeight';
    import Emitter from 'view-design/src/mixins/emitter';

    const prefixCls = 'ivu-input';
    let timer;
    export default {
        name: 'kdxRrInput',
        mixins: [Emitter],
        props: {
            type: {
                validator(value) {
                    return oneOf(value, ['text', 'textarea', 'password', 'url', 'email', 'date']);
                },
                default: 'text'
            },
            value: {
                type: [String, Number],
                default: ''
            },
            size: {
                validator(value) {
                    return oneOf(value, ['small', 'large', 'default']);
                }
            },
            placeholder: {
                type: String,
                default: ''
            },
            maxlength: {
                type: Number
            },
            showLimit: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            icon: String,
            autosize: {
                type: [Boolean, Object],
                default: false
            },
            rows: {
                type: Number,
                default: 2
            },
            readonly: {
                type: Boolean,
                default: false
            },
            name: {
                type: String
            },
            number: {
                type: Boolean,
                default: false
            },
            fixed: {
                type: Number,
                default: -1
            },
            minValue: {
                type: Number,
            },
            maxValue: {
                type: Number,
            },
            autofocus: {
                type: Boolean,
                default: false
            },
            spellcheck: {
                type: Boolean,
                default: false
            },
            autocomplete: {
                validator(value) {
                    return oneOf(value, ['on', 'off']);
                },
                default: 'off'
            },
            clearable: {
                type: Boolean,
                default: false
            },
            elementId: {
                type: String
            },
            wrap: {
                validator(value) {
                    return oneOf(value, ['hard', 'soft']);
                },
                default: 'soft'
            }
        },
        data() {
            let presentlength = this.value? this.value.length : 0
            return {
                currentValue: this.value,
                prefixCls: prefixCls,
                prepend: true,
                append: true,
                slotReady: false,
                textareaStyles: {},
                presentlength,
                isFoucs: false
            };
        },
        computed: {
            wrapClasses() {
                return [
                    `${prefixCls}-wrapper`,
                    {
                        [`${prefixCls}-wrapper-${this.size}`]: !!this.size,
                        [`${prefixCls}-type`]: this.type,
                        [`${prefixCls}-group`]: this.prepend || this.append,
                        [`${prefixCls}-max-length`]: this.maxlength,
                        [`${prefixCls}-group-${this.size}`]: (this.prepend || this.append) && !!this.size,
                        [`${prefixCls}-group-with-prepend`]: this.prepend,
                        [`${prefixCls}-group-with-append`]: this.append,
                        [`${prefixCls}-hide-icon`]: this.append,  // #554
                        [`${prefixCls}-foucs`]: this.isFoucs
                    }
                ];
            },
            inputClasses() {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-${this.size}`]: !!this.size,
                        [`${prefixCls}-disabled`]: this.disabled
                    }
                ];
            },
            textareaClasses() {
                return [
                    `${prefixCls}`,
                    {
                        [`${prefixCls}-disabled`]: this.disabled
                    }
                ];
            }
        },
        methods: {
            handleEnter(event) {
                this.$emit('on-enter', event);
            },
            handleKeydown(event) {
                this.$emit('on-keydown', event);
            },
            handleKeypress(event) {
                this.$emit('on-keypress', event);
            },
            handleKeyup(event) {
                this.$emit('on-keyup', event);
            },
            handleIconClick(event) {
                this.$emit('on-click', event);
            },
            handleFocus(event) {
                this.isFoucs = true
                this.$emit('on-focus', event);
            },
            handleBlur(event) {
                this.isFoucs = false
                let value = event.target.value;
                if(this.number && value !== ''){
                    if(this.maxValue !== undefined && value > this.maxValue) {
                        if(this.fixed === 0) {
                            value = parseInt(this.maxValue);
                            event.target.value = value;
                        }else {
                            value = parseFloat(this.maxValue).toFixed(this.fixed);
                            event.target.value = value;
                        }
                    }
                    if(this.minValue !== undefined && value < this.minValue) {
                        if(this.fixed === 0) {
                            value = parseInt(this.minValue);
                            event.target.value = value;
                        }else {
                            value = parseFloat(this.minValue).toFixed(this.fixed);
                            event.target.value = value;
                        }
                    }
                }
                this.$emit('on-blur', event);
                this.$emit('input', event.target.value);
                this.$emit('on-change', event);
                if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
                    this.dispatch('FormItem', 'on-form-blur', this.currentValue);
                }
            },
            handleInput(event) {
                let value = event.target.value;
                if(event.target.value==' ' || event.target.value=='') {
                    event.target.value = '';
                    value = '';
                }else if (this.number) {
                    //判断是否为数字
                    if(Number(event.target.value) === +Number(event.target.value)) {
                        if(this.fixed===0) {
                            event.target.value = parseInt(event.target.value);
                            value = parseInt(event.target.value);
                        }else {
                            let _value_ = value.split('.');
                            let _value = _value_[1];
                            if (this.fixed > 0&&_value) {
                                _value = _value.slice(0, this.fixed);//小数位限制
                            }
                            _value = _value ? _value : '';
                            let value__ = _value_[0] + (value.includes('.') ? '.' : '') + _value;
                            event.target.value = value__;
                            value = value__;
                        }
                    }else {
                        //判断是否能转换成数字
                        if(parseFloat(event.target.value) === +parseFloat(event.target.value)) {
                            event.target.value = parseFloat(event.target.value)
                            value = parseFloat(event.target.value)
                        }else {
                            event.target.value = '';
                            value = '';
                        }
                    }

                    if(this.maxValue !== undefined && value > this.maxValue) {
                        if(this.fixed === 0) {
                            value = parseInt(this.maxValue);
                            event.target.value = value;
                        }else {
                            value = parseFloat(this.maxValue).toFixed(this.fixed);
                            event.target.value = value;
                        }
                    }
                    clearTimeout(timer)
                    /* 最小值添加延时校验 */
                    timer = setTimeout(() => {
                        if(this.minValue !== undefined && value < this.minValue) {
                            if(this.fixed === 0) {
                                value = parseInt(this.minValue);
                                event.target.value = value;
                            }else {
                                value = parseFloat(this.minValue).toFixed(this.fixed);
                                event.target.value = value;
                            }

                            this.$emit('input', value);
                            this.setCurrentValue(value);
                            this.$emit('on-change', event);
                            this.presentlength = event.target.value.length;
                        }
                    }, 500);
                }
                this.$emit('input', value);
                this.setCurrentValue(value);
                this.$emit('on-change', event);
                this.presentlength = event.target.value.length;
            },
            handleChange(event) {
                this.$emit('on-input-change', event);
            },
            setCurrentValue(value) {
                if (value === this.currentValue) return;
                this.$nextTick(() => {
                    this.resizeTextarea();
                });
                this.currentValue = value;
                if (!findComponentUpward(this, ['DatePicker', 'TimePicker', 'Cascader', 'Search'])) {
                    this.dispatch('FormItem', 'on-form-change', value);
                }
            },
            resizeTextarea() {
                const autosize = this.autosize;
                if (!autosize || this.type !== 'textarea') {
                    return false;
                }

                const minRows = autosize.minRows;
                const maxRows = autosize.maxRows;

                this.textareaStyles = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
            },
            focus() {
                if (this.type === 'textarea') {
                    this.$refs.textarea.focus();
                } else {
                    this.$refs.input.focus();
                }
            },
            blur() {
                if (this.type === 'textarea') {
                    this.$refs.textarea.blur();
                } else {
                    this.$refs.input.blur();
                }
            },
            handleClear() {
                const e = {target: {value: ''}};
                this.$emit('input', '');
                this.setCurrentValue('');
                this.$emit('on-change', e);
            }
        },
        watch: {
            value(val) {
                this.setCurrentValue(val);
                this.presentlength = String(val).length
            }
        },
        mounted() {
            if (this.type !== 'textarea') {
                this.prepend = this.$slots.prepend !== undefined;
                this.append = this.$slots.append !== undefined;
            } else {
                this.prepend = false;
                this.append = false;
            }
            this.slotReady = true;
            this.resizeTextarea();
        }
    };
</script>
<style lang='scss'>
    textarea.ivu-input {
        &::-webkit-scrollbar {
            display: none;
        }
    }
    input {
        /*box-shadow: 0 0 0 1000px white inset !important;*/
    }
</style>
