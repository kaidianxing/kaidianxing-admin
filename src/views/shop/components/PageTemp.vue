/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息.
 */ 
<template>
    <div class="page-temp" :class="{
        'has_hover': tempHover
    }">
        <div class="temp-img-content" :style="{
            'background-image': `url(${$utils.media(info.thumb)})`
        }">
            <div class="temp-action flex">

                <div class="temp-action-btn primary" :class="{'temp-action-btn-disabled': noManagePerm}" @click="useTemp">使用模板</div>

                <div class="temp-action-btn danger" :class="{'temp-action-btn-disabled': noManagePerm}"  @click="delTemp">删除模板</div>
            </div>
        </div>
        <div class="temp-detail">

            <div class="price-tag custom" v-if="info.type =='0'">自定义</div>
            <div class="price-tag free" v-else>免费使用</div>
            <div class="line-hide temp-name">{{info.name}}</div>
            <div class="temp-time" v-if="showUpdate">更新时间：{{info.create_time}}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {}
        },
        tempHover: {
            type: Boolean,
            default: false
        },
        delabled: {
            type: Boolean,
            default: true
        },
        showUpdate: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        noManagePerm() { //管理权限
            return !this.$getPermMap('diypage.template.manage')
        },
    },
    methods: {
        delTemp() {
            this.$emit('on-delete', this.info.id)
        },
        useTemp() {
            this.$emit('on-use', this.info.id,this.info.type)
        }
    }
}
</script>

<style lang="scss" scoped>
.page-temp {
    border: 1px solid #e9edef;
    border-radius: 4px;
    width: 225px;
    cursor: pointer;
    box-sizing: border-box;

    &.has_hover {
        &:hover {
            box-shadow: 0px 1px 14px rgba(133, 148, 162, 0.2);
            transform: translateY(-5px);
            transition: all 0.3s linear;


            .temp-action {
            display: flex;
        }
        }
    }

    .temp-img-content,
    .temp-img,
    .temp-action {
        width: 223px;

        height: 275px;
        border-radius: 4px 4px 0 0;
    }

    .temp-img-content {
        position: relative;
        background-color: #e9e9e9;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .temp-img-content {
        border-bottom: 1px solid $border-color;
    }

    .temp-action {
        display: none;
        position: absolute;
        top: 0;
        background: rgba(0, 0, 0, 0.7);
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 2;

        &-btn {
            border-radius: 2px;
            height: 32px;
            width: 88px;
            font-size: 14px;
            font-weight: bold;
            line-height: 32px;
            text-align: center;
            color: #fff;
            cursor: pointer;

            &.default {
                position: relative;
                border: 1px solid #fff;

                &:hover {
                    border: 1px solid $brand-color;
                }

                /deep/ .hint-tooltip span {
                    line-height: 32px;
                }
            }

            &.primary {
                margin-top: 20px;
                background: $brand-color;
            }

            &.danger {
                margin-top: 20px;
                border: 1px solid #ffffff;
                color: #ffffff;
                    &:hover {
                        border: 1px solid #ff1f2c;
                        color: #ff1f2c;
                    }
            }
            &.temp-action-btn-disabled {
                background-color: #ffffff;
                border-color: $border-color;
                color: rgba(38,43,48,0.6);
                cursor:not-allowed;
                pointer-events: none;
                &:hover {
                    background-color: #ffffff;
                    border-color: $border-color;
                    color: rgba(38,43,48,0.6);
                }
            }
        }
    }

    .temp-tag {
        @include font-12-16;
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        border-top-right-radius: 2px;
        border-bottom-left-radius: 6px;
        height: 24px;
        width: 54px;
        font-weight: bold;
        line-height: 24px;
        text-align: center;
        color: #ead4a9;
        background: #262b30;
    }

    .temp-detail {
        padding: 10px;

        .temp-price {
            @include font-12-16;
            color: #ff1f2c;

            .price-num {
                @include font-14-20;
            }
        }

        .price-tag {
            width: 62px;
            height: 20px;
            padding: 0 10px 0 4px;
            font-size: 12px;
            font-weight: bold;
            line-height: 20px;
            color: #fff;

            background-size: cover;

            &.free {
                background-image: url('../../../assets/image/decorate/free_tag.png');
            }

            &.custom {
                background-image: url('../../../assets/image/decorate/custom_tag.png');
            }
        }

         .temp-name {
            @include font-14-20;
            margin-top: 10px;
            font-weight: bold;
            color: #262b30;
        }

        .temp-time {
            @include font-12-16;
            margin-top: 4px;
            color: #939799;
            width: 100%;
        }
    }
}
</style>
