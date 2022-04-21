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
    <div class='drag-progress'>
        <div class='slider-box'>
            <Slider :step="step" v-model="percent" :active-color="$css['--theme-color']" bar-height="8px" :min="min*ratio" :max="max*ratio" @input='change'>
                <div slot="button">
                    <Tooltip placement="top" :content="percent">
                        <div class="custom-button" :class="{hover:hoverClick}"></div>
                    </Tooltip>
                </div>
            </Slider>
        </div>
         <kdx-rr-input class="drag-progress-input" type="text" :value='percent' number :fixed='0' :min-value='min' :max-value='max'  @on-change='getInput' >
        <span slot="append" v-if='unit'>{{unit}}</span>
        </kdx-rr-input>
    </div>
</template>

<script>
    import {
        Slider
    } from 'vant';
    export default {
        components: {
            Slider,
        },
        props: {
            unit: {
                type: String,
                default: ''
            },
            ratio: { //输入输出换算比例
                type: Number,
                default: 1
            },
            value: {
                type: [String, Number],
                default: 1
            },
            max: {
                type: [String, Number],
                default: 30
            },
            min: {
                type: [String, Number],
                default: 1
            },
            step: {
                type: [String, Number],
                default: 1
            }
        },
        watch: {
            value: {
                immediate: true,
                handler() {
                    if (this.value < this.min) {
                        this.percent = this.min * this.ratio
                    } else if (this.value > this.max) {
                        this.percent = this.max * this.ratio
                    } else {
                        this.percent = this.value * this.ratio
                    }
                }
            },
            percent: {
                handler(newVal) {
                    this.hoverClick = true
                    setTimeout(()=>{
                        if(this.percent === newVal) {
                            this.hoverClick = false
                        }
                    },500)
                }
            }
        },
        data() {
            return {
                percent: 0,
                throttle: false,
                hoverClick: false, // 是否点击或者悬浮
            }
        },
        methods: {
            getInput(e) {
                let val = e.target.value;
                if (val < this.min * this.ratio) {
                    this.percent = this.min * this.ratio
                } else if (val > this.max * this.ratio) {
                    this.percent = this.max * this.ratio
                } else {
                    this.percent = val * 1;
                }
                this.change()
            },
            change() {
                this.$emit('input', this.percent / this.ratio);
                this.$emit('change', this.percent / this.ratio);
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/.ivu-tooltip-popper .ivu-tooltip-inner{
        padding: 12px 14px !important;
    }
    .drag-progress {
        display: flex;
        flex-wrap: nowrap;
        .slider-box {
            width: 0;
            flex: 1;
            margin-right: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .custom-button {
            width: 12px;
            height: 12px;
            color: #fff;
            font-size: 10px;
            line-height: 18px;
            text-align: center;
            border: 2px solid $brand-color;
            background-color: #fff;
            border-radius: 50%;
            position: relative;
            transition: all 0.3s;
            &:hover,
            &.hover{
                transform: scale(1.5);
                cursor: grab;
                border-color: #2d8cf0;
                &+.custom-tip {
                    display: block;
                }
            }
        }
        /deep/ .ivu-input-wrapper {
            width: 100px;
        }
    }
</style>