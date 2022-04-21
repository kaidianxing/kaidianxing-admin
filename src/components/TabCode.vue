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
    <div class="banner_qr_code">
        <div class="banner">
            <canvas class="qrcode" ref="qrcode"></canvas>
        </div>
    </div>
</template>

<script>
    import Qrious from 'qrious';

    export default {
        name: "QrCode",
        props: {
            // 商品路径
            url: {
                type: String,
                required: true
            },
            // 二维码背景色
            backgroundColor: {
                type: String,
                default: '#fff'
            },
            // 二维码背景透明度
            backgroundAlpha: {
                type: Number,
                default: 0.8
            },
            // 二维码颜色
            foregroundColor: {
                type: String,
                default: '#000'
            },
            // 二维码透明度
            foregroundAlpha: {
                type: Number,
                default: 0.8
            },
            // 二维码纠错等级
            level: {
                type: String,
                default: 'H',
                validator(value) {
                    return ['L', 'M', 'Q', 'H'].indexOf(value) !== -1;
                }
            },
            // 二维码大小(像素)
            size: {
                type: Number,
                default: 100
            }
        },
        watch: {
            url: {
                handler() {
                    this.url && this.markQrcode();
                },
                immediate: true
            },
            size: {
                handler() {
                    this.url && this.markQrcode();
                },
                immediate: true
            }
        },
        methods: {
            // 生成二维码
            markQrcode() {
                const element = this.$refs.qrcode;
                new Qrious({
                    element,
                    value: this.url,
                    background: this.backgroundColor,
                    backgroundAlpha: this.backgroundAlpha,
                    foreground: this.foregroundColor,
                    foregroundAlpha: this.foregroundAlpha,
                    level: this.level,
                    size: this.size,
                });
            }
        },
        mounted() {
            this.url && this.markQrcode();
        }
    };
</script>

<style scoped lang="scss">
    .banner_qr_code {

    }
</style>
