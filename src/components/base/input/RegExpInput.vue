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
    <!-- 自定义格式化检查及限制输入Input -->
    <div class='regExp-Input' >
        <Input v-model="result" :maxlength='maxlength' :autosize="true" :placeholder="placeholder" @input='getInput' @on-blur='getEvent'>
            <slot></slot>
            <slot name='append' slot="append"></slot>
            <slot name='prepend' slot="prepend"></slot>
            <slot name='suffix' slot="suffix"></slot>
            <slot name='prefix' slot="prefix"></slot>
        </Input>
        <p class='errorMessage' v-show='getErrorMessage&&!hideError'>{{getErrorMessage}}</p>
    </div>
</template>

<script>
    import {
        Input,
        Button
    } from 'iview'
    export default {
        data() {
            return {
                result: '', //
                lastResult: '', //lastResult
                error: '',
                curType: '', //触发error提示的事件类型
            }
        },
        props: {
            allCheck:false,//监听变化来触发检查数据格式
            value: '',
            maxlength: null,
            placeholder: {
                type: String,
                default: ''
            },
            hideError:false,//是否隐藏错误提示
            reg: { //正则校验,暂时只支持blur事件校验
                type: [RegExp, Object,String],
                default: () => /.*/, //{input:{reg:/.*/,limitInput:false}}
            },
        },
        watch: {
            allCheck(){
                this.curType='blur'
            },
            value() {
                this.result = this.value;
                this.lastResult = this.value;
            }
        },
        mounted() {
            this.result = this.value;
            this.lastResult = this.value;
        },
        computed: {
            getErrorMessage() {
                let regexp = this.reg.reg || /.*/;
                let regRes = '';
                if (this.reg instanceof RegExp) {} else if (typeof this.reg == 'object') {
                    if (!regexp.test(this.result)) {
                        regRes = this.reg.showError;
                        let trigger = this.reg.trigger instanceof Array ? this.reg.trigger : [this.reg.trigger];
                        regRes = trigger.includes(this.curType) ? regRes : ((this.curType == 'input' || this.curType == '') ? '' : regRes); //显示条件：trigger包含的事件；隐藏条件:input事件(前提是trigger不包含input); 
                    }
                }
                return regRes;
            }
        },
        components: {
            Input,
            Button
        },
        methods: {
            getEvent(e) {
                this.curType = e.type;
            },
            getInput(e) {
                this.curType = 'input';
                let reg = this.reg || {
                    reg: /.*/,
                    limitInput: false, //是否限制输入 ，输入无效
                    showError: '', //错误输入的提示语，空为默认不显示
                    trigger: ['blur'], //错误提示触发条件
                }
                if (reg instanceof RegExp) { //如果输入的是正则
                    this.$nextTick(() => { //只输出与显示正确的输入值
                        if (reg.test(e)) {
                            this.lastResult = e;
                            this.result = e;
                            this.$emit('input', e);
                        } else {
                            this.result = this.lastResult
                        }
                    })
                } else if (typeof reg == 'object') { //对象格式如上
                    let regexp = reg.reg || /.*/;
                    this.$nextTick(() => { //只输出与显示正确的输入值
                        if (!reg.limitInput) { //不限制输入
                            this.lastResult = e;
                            this.result = e;
                            this.$emit('input', e);
                        } else {
                            if (regexp.test(e)) {
                                this.lastResult = e;
                                this.result = e;
                                this.$emit('input', e);
                            } else {
                                this.result = this.lastResult;
                            }
                        }
                        this.error = !regexp.test(e) ? reg.showError : ''; //
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .regExp-Input {
        position: relative;
        border: none;
        overflow: visible;
        .errorMessage {
            color: red; 
            bottom:-12px;
            left:0;
            height:12px;
            line-height: 12px;
            border:none;
            position: absolute;
            white-space: nowrap;
            width: 100%;
        }
    }
</style>