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
    <div class="page-content">
        <div class="page-content-title">
            <template v-if="type === 'order'">
                统一下单资料表单预览
            </template>
        </div>
        <div class="row relative w840 page-content-item">
            <div class="diy-phone">
                <div class="phone-body">
                    <div class="phone-title">
                        <div class="phone-top">
                            <img style="width:375px;" v-if="type==='order'" :src="require('@/assets/image/form/order_header.png')" alt />
                        </div>
                    </div>
                    <div class="phone-main" id="toCanvas">
                        <slot name="top"></slot>
                        <div class="phone-main-content-box" :style="{'min-height': type === 'order' ? '232px': '0'}">
                            <div class="phone-main-content">
                                <div v-for="(item,index) in items" :key='index' class="phone-main-content-item">
                                    <form-items :model='item'></form-items>
                                </div>
                            </div>
                        </div>
                        <div style="width:100%;" class="bottom-items">
                            <slot name="bottom"></slot>
                        </div>
                        <slot name="fixed"></slot>
                    </div>
                     <div class="phone-footer">
                         <div class="order-footer" v-if="type === 'order'">
                             <img style="width:375px;display: block" :src="require('@/assets/image/form/order_foot.png')" alt />
                         </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import FormItems from '../templates/index'
import {mapState} from 'vuex'
    export default {
        components:{
            FormItems
        },
        props: {
          type: {
              type: String,
              default: ''
          }
        },
        computed: {
            ...mapState('form',{
                items:state => state.formItems
            })
        }

    };
</script>

<style lang="scss" scoped>
    .phone-body {
        background: rgb(243, 243, 243);
    }
    .page-content {
        min-height: 100%;
        /*width: 375px;*/
        .page-content-title {
            @include font-16-22-bold;
            padding-bottom: 20px;
            text-align: center;
        }
        .page-content-item {
            box-shadow: 0 4px 8px rgba(133, 148, 162, 0.3);
            transform: scale(0.8);
            -webkit-transform-origin: top;
        }
    }
    .phone-top {
        display: flex;
        flex-direction: column;
        width: 375px;
        overflow: hidden;
    }
    .phone-title,
    .phone-body,
    .diy-phone {
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
    }
    .diy-phone {
        width: 375px;
        min-height: 667px;
        background: #f5f5f5;
    }
    .diy-phone .phone-title {
        /*height: 64px;*/
        background: #fff;
        background-size: 100% auto;
        text-align: center;
        cursor: pointer;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
        .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
        .page-title {
            position: absolute;
            z-index: 100;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 25px;
            display: flex;
            align-items: center;
            text-align: center;
            /* 文字信息/21 */
            color: #212121;
            left: 50%;
            transform: translate(-50%, 0);
            bottom: 8px;
        }
    }
    .phone-title.pageInfo {
        box-shadow: 0 0 2px 0 $brand-color;
        z-index: 1000;
        position: relative;
    }
    .diy-phone .phone-main {
        height: 100%;
        box-sizing: border-box;
        border-top: 0;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .diy-phone .phone-main.phone-img-box {
        overflow: hidden;
    }

    .diy-phone .phone-main .phone-main-img {
        position: absolute;
        width: 100%;
        z-index: 0;
    }

    .diy-phone .phone-main p {
        margin: 0;
        padding: 0;
    }
    .diy-phone .phone-main .highlight {
        height: 50px;
        border: 2px dashed #999;
        text-align: center;
        font-size: 16px;
        color: #999;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .diy-phone .phone-main .drag {
        position: relative;
        min-height: 20px;
        display: block;
        overflow: hidden;
    }
    .diy-phone .phone-main .drag.selected:before,
    .diy-phone .phone-main .drag:hover:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px dashed #00a0e9;
        cursor: move;
        z-index: 10;
    }
    .diy-phone .phone-main .drag.fixed:before {
        cursor: default;
    }
    .diy-phone .phone-main .drag .btn-edit-del {
        height: 16px;
        position: absolute;
        right: 2px;
        bottom: 2px;
        display: none;
        z-index: 90;
    }
    .diy-phone .phone-main .drag .btn-edit-del>div {
        width: 32px;
        height: 16px;
        line-height: 16px;
        display: inline-block;
        text-align: center;
        font-size: 10px;
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        margin-left: 2px;
        cursor: pointer;
        position: relative;
        z-index: 11;
    }
    .diy-phone .phone-main .drag.selected .btn-edit-del,
    .diy-phone .phone-main .drag:hover .btn-edit-del {
        display: block;
    }
    .diy-phone .phone-main .drag.nodelete .btn-edit-del .btn-del {
        display: none;
    }
    .diy-phone .phone-main a {
        color: #337ab7;
    }
    .diy-phone .phone-main {
        .phone-main-content-box {
            margin: 0 12px;
            border-radius: 6px;
            flex:1;
            /*width:100%;*/
            min-height:100%;
            margin-bottom: 10px;
            background-color: #FFFFFF;
            &.phone-main-content-box-goods {
                border-radius: 0;
                padding: 0;
                /*margin-bottom: 0;*/
                margin: 0;
            }
            .phone-manual {
                background-color: #FFFFFF;
                /*margin: 0 12px;*/
                padding-left: 12px;
                border-top-left-radius: px2rpx(12);
                border-top-right-radius: px2rpx(12);
                &.phone-manual-radius {
                    border-radius: px2rpx(12);
                }
                .phone-manual-item {
                    padding: 14px 0;
                    border-bottom: 1px solid $border-color;
                    display: flex;
                    flex-wrap: nowrap;
                    >.label {
                        @include font-14-20;
                        color: #212121;
                        width: 80px;
                        flex-shrink: 0;
                        > .label-required {
                            color: $danger-color;
                            width: 12px;
                            display: inline-block;
                        }
                    }
                    >.content {
                        @include font-14-20;
                        color: #CCCCCC;
                    }
                }
            }
        }
        .phone-main-content {
            border-radius: 6px;
            padding-bottom: px2rpx(16);
            background-color: #FFFFFF;
        }
        .phone-main-content {
            background-color: #ffffff;
            .phone-main-content-item {
                /*margin-left: px2rpx(12);*/
                /*border-bottom: 1px solid #E6E7EB;*/
                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }
    .form-control[disabled],
    .form-control[readonly],
    fieldset[disabled] .form-control {
        background: #f7f7f7;
    }
    .diy-menu {
        width: 840px;
        height: auto;
        background: #fdfdfd;
        margin-right: -455px;
        border: 1px solid #ddd;
        border-radius: 3px;
        position: fixed;
        bottom: 0;
        right: 50%;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        z-index: 999;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
    }
    .page-content {
        .action {
            display: flex;
            justify-content: flex-end;
            position: relative;
            #gotop {
                position: absolute;
                left: 10px;
            }
        }
        /deep/ .btn {
            margin: 0 5px;
        }
    }
    .flip-list-move {
        transition: transform 0.5s;
    }
    .phone-footer{
        .order-footer {
            .order-footer-content {
                height: 228px;
            }
        }
        .commission-footer {
            padding: 0 12px;
            >.protocol {
                display: flex;
                padding: 0 12px 12px 12px;
                .checkbox {
                    width: 14px;
                    height: 14px;
                    border: 1px solid #FFFFFF;
                    background-color: #FFFFFF;
                    border-radius: 2px;
                }
                .text {
                    font-size: 12px;
                    line-height: 17px;
                    color: #212121;
                    padding-left: 6px;
                    > span {
                        color: #367BF5 ;
                    }
                }
            }
            >.commission-btn {
                width: 100%;
                height: 40px;
                text-align: center;
                font-size: 14px;
                line-height: 20px;
                font-weight: bold;
                color: #FFFFFF;
                background-color: #FF3C29;
                border-radius: 20px;
                padding: 10px 0;
            }
            > .commission-hint {
                padding: 8px 15px;
                font-size: 12px;
                line-height: 17px;
                color: #969696;
            }
        }
    }
</style>
