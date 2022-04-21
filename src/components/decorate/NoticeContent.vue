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
            <Slider v-model="percent" :active-color="$css['--theme-color']" bar-height="4px" :min="min" :max="max" @input='change'>
                <div slot="button" class="custom-button"></div>
            </Slider>
        </div>
        <Input :value='percent' @on-input='getInput'>
        <span slot="append" v-if='unit'>{{unit}}</span></Input>
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
            unit:{
                type:String,
                default:''
            },
            value: {
                type: [String, Number],
                default: 15
            },
            max: {
                type: [String, Number],
                default: 30
            },
            min: {
                type: [String, Number],
                default: 2
            },
        },
        watch: {
            value: {
                immediate: true,
                handler() {
                    if (this.value < this.min) {
                        this.percent = this.min * 1
                    } else if (this.value > this.max) {
                        this.percent = this.max * 1
                    }
                }
            }
        },
        data() {
            return {
                percent: 15,
                throttle: false
            }
        },
        methods: {
            getInput(val) {
                if (val < this.min) {
                    this.percent = this.min * 1
                } else if (val > this.max) {
                    this.percent = this.max * 1
                } else {
                    this.percent = val * 1;
                }
            },
            change() {
                this.$emit('input', this.percent);
                this.$emit('change', this.percent);
            }
        }
    }
</script>

<style lang="scss" scoped>
    
    
</style>