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
    <canvas class="qrcode" ref="qrcode"></canvas>
</template>

<script>
    import Qrious from 'qrious';
    export default {
        props: {
            value: {
                type: String,
                default: 'https://www.baidu.com'
            },
            color: {
                type: String,
                default: '#000000'
            }
        },
        data() {
            return {
                qrcode: null
            }
        },
        watch: {
            color: {
                immediate: true,
                handler() {
                    this.refresh()
                }
            },
            value: {
                immediate: true,
                handler() {
                    this.refresh()
                }
            }
        },
        methods: {
            refresh() {
                this.$nextTick(() => {
                    if (!this.qrcode) {
                        const element = this.$refs.qrcode;
                        this.qrcode = new Qrious({
                            element,
                            value: this.value,
                            foreground: this.color,
                        });
                    }
                    this.qrcode.value = this.value;
                    this.qrcode.foreground = this.color
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.qrcode{
    width: 100%;
    height: 100%;
}
</style>