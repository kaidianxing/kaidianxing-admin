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
    <div class="modal" v-show="value" @click.stop>
        <div class="modal-mask"></div>
        <div class="modal-content">
            <div class="close" @click="fnCloseModal">
                <Icon type="ios-close" :size="24" />
            </div>
            <div class="icon iconfont icon-xitong-sousuo" v-if="checking"></div>
            <div class="icon iconfont icon-yes" v-if="process_success"></div>
            <div class="icon iconfont icon-del" v-if="process_fail"></div>
            <div class="tips">{{ tipsText }}</div>
            <div class="check">
                <div class="progress" v-if="loading">
                    <div class="bg">
                        <div
                                class="current"
                                :style="`width: ${progress}%;`"
                        ></div>
                    </div>
                </div>
            </div>
            <!--<div class="btn-wrap">
                <div class="type type2">
                    <Button
                            type="primary"
                            :long="true"
                            :loading="loading"
                    >
                        {{ tipsBtn }}
                    </Button>
                </div>
            </div>-->
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'value',
            'loading',
            'step',
            'tipsText',
        ],
        data() {
            return {
                progress: 0,
                timeId: null, // 定时器对象
                interval: 10, // 定时器步伐
            }
        },
        computed: {
            check_start() {
                return new Set(['', '50']).has(this.step)
            },
            checking() {
                return (
                    new Set(['', '0']).has(this.step) ||
                    (this.step === '1' && this.loading)
                )
            },
            check_finished() {
                return this.step === '1'
            },
            process_success() {
                return (
                    new Set(['1']).has(this.step) &&
                    !this.loading
                )
            },
            process_fail() {
                return new Set(['12']).has(this.step)
            },
        },
        watch: {
            loading: {
                handler(value) {
                    if (!value) {
                        if (this.timeId) {
                            clearInterval(this.timeId)
                        }
                    } else {
                        // 处理进度条
                        this.progress = 0
                        this.interval = 10
                        this.timeId = setInterval(() => {
                            this.progress += this.interval
                            this.progress >=90 && this.step != 1 ? this.progress = 90 : this.progress
                            if (this.progress >= 100) {
                                clearInterval(this.timeId)
                            }
                        }, 1000)
                    }
                },
                immediate: true,
            },
        },
        methods: {
            // 关闭弹窗
            fnCloseModal() {
                if(this.timeId) {
                    clearInterval(this.timeId)
                }
                this.$emit('input', false)
            },
        },
    }
</script>

<style lang="scss" scoped>
    .modal {
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        .modal-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
        }
        .modal-content {
            position: relative;
            background-color: #fff;
            border-radius: 2px;
            padding: 40px 45px;
            width: 340px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .close {
                position: absolute;
                right: 20px;
                top: 20px;
            }
            .icon {
                font-size: 56px;
                height: 56px;
                display: flex;
                align-items: center;
                justify-content: center;
                &.icon-xitong-sousuo {
                    color: $success-color;
                }
                &.icon-yes {
                    color: $success-color;
                }
                &.icon-xitong-xiazai {
                    color: $warning-color;
                }
                &.icon-del {
                    color: $danger-color;
                }
            }
            .tips {
                font-size: 14px;
                line-height: 20px;
                color: #000000;
                margin-top: 24px;
            }
            .check {
                padding-top: 10px;
                padding-bottom: 30px;
                .progress {
                    width: 250px;
                    padding-top: 10px;
                    padding-bottom: 6px;
                    .bg {
                        position: relative;
                        height: 4px;
                        border-radius: 2px;
                        background-color: #f4f6f8;
                        .current {
                            position: absolute;
                            top: 0;
                            left: 0;
                            height: 4px;
                            border-radius: 2px;
                            background: linear-gradient(
                                            172.84deg,
                                            #29bfff 0%,
                                            #0b88fb 94.51%
                            );
                        }
                    }
                }
                .result {
                    text-align: center;
                    font-size: 14px;
                    line-height: 20px;
                    color: $text-first;
                    .success {
                        color: $success-color;
                    }
                    .danger {
                        color: $danger-color;
                    }
                }
            }
            .btn-wrap {
                width: 250px;
                .type {
                    display: flex;
                    justify-content: center;
                }
                .type1 {
                    button {
                        width: 100px;
                    }
                    button:nth-child(2) {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
</style>
