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
    <div class='button-group'>
        <RadioGroup type="button" v-model="selected" @on-change='change'>
            <Radio :label="index" v-for='(item,index) in filterItem' :key='item.id' :disabled='item.disabled'>
                <i class='button-icon' :class="item.icon" :style="{color: item.disabled ? '#b8b9bb':(item.id==value?(item.activeColor||$css['--theme-color']):(item.iconColor||'#939799')),}" v-if='!item.img'></i>
                <img class='button-img' :src="item.img" alt="" v-else>
                <span class='label'>{{item.label}}</span></Radio>
        </RadioGroup>
        <div class='content' v-if='$slots.default&&$slots.default.length'>
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: [String, Number],
                default: ''
            },
            lazy: {
                type: Boolean,
                default: false
            },
            items: {
                type: Array,
                default: () => [{
                    label: 'large',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    iconColor: '#939799',
                    activeColor: '',
                    disabled: false,
                }, {
                    label: 'large2',
                    icon: 'ivu-icon ivu-icon-ios-contract',
                    iconColor: '#939799',
                    activeColor: '',
                    disabled: false
                }]
            }
        },
        watch: {
            value: {
                immediate: true,
                handler() {
                    for (let k = 0; k < this.items.length; k++) {
                        if (this.items[k].id == this.value) {
                            this.selected = k;
                        }
                    }
                }
            }
        },
        computed: {
            filterItem(){
                return this.items.filter(item => !item.hide)
            }
        },
        data() {
            return {
                selected: ''
            }
        },
        methods: {
            change(value) {
                if (this.lazy) {
                    if (this.lastSelected !== null) {
                        this.$nextTick(() => {
                            this.selected = this.lastSelected
                            let val = this.filterItem[value].id;
                            this.$emit('input', val); //优先返回id
                            this.$emit('change', val, this.filterItem[value]); //优先返回id 
                        })
                    } else {
                        this.lastSelected = this.selected
                        let val = this.filterItem[this.selected].id;
                        this.$emit('input', val); //优先返回id
                        this.$emit('change', val, this.filterItem[this.selected]); //优先返回id 
                    }
                } else {
                    let val = this.filterItem[this.selected].id;
                    this.$emit('input', val); //优先返回id
                    this.$emit('change', val, this.filterItem[this.selected]); //优先返回id 
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .button-group {
        /deep/ label.ivu-radio-group-item {
            position: relative;
             &:not(.ivu-radio-wrapper-disabled) {
                &:hover {
                    background: #fff;
                    border-color: $brand-color;
                    color: $brand-color;
                    z-index: 1;
                    &::before{
                        content: "";
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        width: 0;
                        border-left: 1px solid $brand-color;
                    }
                    i {
                        color: $brand-color!important;
                    }
                }

             }
        }
        .ivu-radio-wrapper {
            position: relative;
            min-width: 60px;
            padding: 0 5px;
            text-align: center;
            &.ivu-radio-wrapper-checked {
                .button-icon {
                    color: $brand-color!important;
                }
            }
            .button-icon {
                font-size: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                display: inline-block;
                color: #939799;
                margin-top: 4px;
            }
            .button-img {
                width: 24px;
                max-height: 24px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .label {
                /* regular/12 */
                position: absolute;
                font-family: PingFang SC;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                line-height: 16px;
                /* identical to box height, or 133% */
                display: flex;
                align-items: center;
                text-align: center;
                /* text/second */
                color: #636669;
                left: 50%;
                bottom: -22px;
                transform: translate(-50%, 0);
            }
        }
    }
    .content {
        margin-top: 40px;
        background: #F4F6F8;
        border-radius: 2px;
        box-sizing: border-box;
        padding: 20px;
    }
</style>
