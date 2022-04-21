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
    <div class='icon-selector-icon'>
        <p class="label" :style='{width:labelWidth+"px"}'>{{label}}</p>
        <p class='icon-box' @click='addImg'>
            <img :src="src" alt="" v-if='src'>
            <i :class='[icon]' style='font-size:24px;' v-else-if='icon'></i>
            <i class="ivu-icon ivu-icon-md-add brand-color" v-else></i>
            <span class="close ivu-icon ivu-icon-md-close-circle" @click.stop='delImg(item)'></span>
        </p>
    </div>
</template>

<script>
    export default {
        props: {
            label: {
                type: String,
                default: '图标：'
            },
            labelWidth: {
                type: [Number,String],
                default: 90
            },
            icon: {
                type: String,
                default: ''
            },
            src: {
                type: String,
                default: ''
            }
        },
        methods: {
            delImg() {
                this.$emit('delImg')
            },
            addImg() {
                this.$emit('addImg')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .icon-selector-icon {
        display: flex;
        flex-wrap: nowrap;
        .label {
            color: #262B30;
            padding: 6px 10px 6px 0;
            line-height: 20px;
            text-align: right;
        }
        .icon-box {
            width: 40px;
            height: 40px;
            border-radius: 2px;
            border: 1px solid #E9EDEF;
            display: inline-block;
            position: relative;
            cursor: pointer;
            background: #fff;
            i {
                width: 100%;
                height: 100%;
                line-height: 38px;
                text-align: center;
                top: 0;
                left: 0;
            }
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
            .close {
                position: absolute;
                font-size: 18px;
                top: -6px;
                right: -9px;
                color: rgba(0, 0, 0, 0.3);
                display:none;
            }
            &:hover{
                .close{
                    display:inline;
                }
            }
        }
    }
</style>