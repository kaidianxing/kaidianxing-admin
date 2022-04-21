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
    <div class="hint-tooltip">
        <!--二维码-->
        <Poptip
            v-if="type === 'qrCode'"
            placement="bottom"
            transfer
            class="qrCode-tooltip"
            :trigger="trigger"
            @on-popper-show="onPopperShow"
        >
            <!--二维码图标-->
            <slot></slot>
            <template #content>
                <div class="qr-code-tooltip-content">
                    <div class="image">
                        <qr-code :size="150" :url="$media(url)" v-if="!qrcode_url"></qr-code>
                        <img  v-else :src="qrcode_url" alt="">
                    </div>
                    <p class="text">扫描二维码预览</p>
                    <kdx-copy-text :text="$media(url)" v-if="!qrcode_url">
                        <Button type="text">{{text}}</Button>
                    </kdx-copy-text>
                    <kdx-copy-text :text="url" v-else>
                        <Button type="text">{{text}}</Button>
                    </kdx-copy-text>
                </div>
            </template>
        </Poptip>
        <!--文字和图片提示-->
        <Tooltip
            v-else
            :max-width="maxWidth"
            :content="content"
            theme="light"
            :placement="placement"
            class="hint-tooltip-tooltip"
            transfer
            :delay="delay"
            :hintText="hintText"
        >
            <template v-if="!$slots.header">
                <!--文字和form展示-->
                <div class="tooltip-icon" v-if="type === 'text' || type === 'form'">
                    <i class="iconfont icon-icon-test" style="vertical-align:-1px;margin-left:5px;"></i>
                    <span v-if="type === 'form'" class="hint-text">说明</span>
                </div>
                <!--图片提示-->
                <div class="tooltip-icon" v-else-if="type === 'image'">
                    <i class="iconfont icon-shili" style="vertical-align:-1px;" :style="{color:color}"></i>
                    <span class="hint-text" :style="{color:color}">{{hintText}}</span>
                </div>
            </template>
            <template v-else-if="$slots.header">
                <slot name="header"></slot>
            </template>
            <template #content>
                <div class="hint-tooltip-text-content">
                    <div class="tooltip-text" v-if="type === 'text'">
                        <slot></slot>
                    </div>
                    <div class="tooltip-image" :style="{width:width}" v-else-if="type === 'image'">
                        <img :src="imgUrl ||image" alt @error="replaceImage" />
                    </div>
                    <div class="tooltip-form" v-else-if="type === 'form'">
                        <slot></slot>
                    </div>
                </div>
            </template>
        </Tooltip>
    </div>
</template>

<script>
import QrCode from '../QrCode'
// 问号弹窗提示
export default {
    name: 'kdxHintTooltip',
    components: { QrCode },
    props: {
        content: {
            type: String
        },
        maxWidth: {
            type: Number,
            default: 340
        },
        // 类型，用来区分二维码和其他文字描述
        type: {
            type: String,
            default: 'text',
            validator: val => ['text', 'form', 'image', 'qrCode'].includes(val)
        },
        image: {
            type: String,
            default: require('@/assets/image/shop/module-detail.png')
        },
        // 延时显示(毫秒)
        delay: {
            type: Number,
            default: 0
        },
        // 要复制提示文字
        text: {
            type: String,
            default: '复制链接'
        },
        // 二维码地址
        url: {
            type: String,
            default: 'https://www.baidu.com/'
        },
        // 二维码图片地址
        qrcode_url: {
            type: String,
            default: ''
        },
        placement: {
            type: String,
            default: 'top'
        },
        width: String,
        trigger: {
            type: String,
            default: 'hover'
        },
        hintText: {
            type: String,
            default: '示例'
        },
        color: String, // 示例文本字体颜色
    },
    data() {
        return {
            imgUrl: ''
        }
    },
    mounted(){
        if(this.image && this.image.indexOf('static/dist/shop/')==-1) {
            this.imgUrl = this.$media(this.image)
        }
    },
    methods: {
        onPopperShow() {
            this.$emit('on-popper-show')
        }
    },
}
</script>

<style scoped lang="scss">
.hint-tooltip {
    display: inline-block;
    line-height: inherit;
    padding: 0;

    /deep/ .hint-tooltip-tooltip {
        color: $text-second;
        cursor: pointer;
        .icon {
            line-height: inherit;
        }
        .icon-shili {
            padding-left: 10px;
            color: $text-second;
        }
        .hint-text {
            @include font-12-16;
            padding-left: 2px;
            color: $text-second;
            &:hover {
                color: $brand-color;
                .iconfont {
                    color: $brand-color;
                }
            }
        }
        .tooltip-icon {
            &:hover {
                .hint-text {
                    color: $brand-color;
                }
                .iconfont {
                    color: $brand-color;
                }
            }
        }
    }
}

// 文字提示
.hint-tooltip-text-content {
    color: $text-second;
    @include font-12-16;
    padding: 0;
    // text
    .tooltip-text {
        @include font-12-16;
        color: $text-second;
    }
    // from
    .tooltip-form {
        color: $text-first;
        /deep/ .ivu-form {
            .ivu-form-item {
                margin-bottom: 0;
                padding-bottom: 12px;
                color: $text-first;
                /*display: flex;*/

                &:last-child {
                    padding-bottom: 0;
                }

                .ivu-form-item-label {
                    padding: 0;
                    @include font-12-16-bold;
                }

                .ivu-form-item-content {
                    @include font-12-16;
                }
            }
        }
    }
    // image
    .tooltip-image {
        border: 1px solid $border-color;
        border-radius: 2px;
        width: 200px;
        /*height: 310px;*/
        overflow: hidden;
        > img {
            width: 100%;
            height: 100%;
            display: block;
        }
    }
}

.qr-code-tooltip-content {
    padding: 8px;
    text-align: center;
    > .image {
        // width: 150px;
        // height: 150px;
        border-radius: 2px;
        img {
            width: 150px;
            // height: 150px;
        }
    }
    > .text {
        @include font-12-16;
        color: $text-second;
        padding-top: 10px;
    }
    .ivu-btn {
        @include font-12-16;
    }
}
</style>

<style lang="scss">
.ivu-tooltip-popper {
    .ivu-tooltip-inner {
        padding: 12px;
        /*min-height: 0;*/
    }
    .ivu-tooltip-inner-with-width {
        white-space: inherit;
    }
}
</style>
