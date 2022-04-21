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
    <div
        class="modal"
        v-show="value"
        @click.stop
    >
        <div class="modal-mask"></div>
        <div class="modal-content">
            <div
                class="close"
                @click="fnCloseModal"
                v-if="!loading"
            >
                <Icon
                    type="ios-close"
                    :size="24"
                />
            </div>
            <div
                class="icon iconfont icon-xiaochengxuzhibo-tongbu"
                v-if="checking"
            ></div>
            <div
                class="icon iconfont icon-yes"
                v-if="process_success"
            ></div>
            <div
                class="icon iconfont icon-del"
                v-if="process_fail"
            ></div>
            <div class="tips">{{ tipsText }}</div>
            <div class="check">
                <div
                    class="progress"
                    v-if="loading"
                >
                    <div class="bg">
                        <div
                            class="current"
                            :style="`width: ${progress}%;`"
                        ></div>
                    </div>
                </div>
            </div>
            <div class="btn-wrap">
                <div class="type type2">
                    <Button
                        type="primary"
                        :long="true"
                        :loading="loading"
                        @click="fnStart"
                    >
                        {{ step | formatStep }}
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'value',
        'loading',
        'step',
    ],
    data() {
        return {
            tipsText: '', // 提示文字
            progress: 0,
            timeId: null, // 定时器对象
            interval: 20, // 定时器步伐
        }
    },
    computed: {
        checking() {
            return (
                this.step === 0 && this.loading
            )
        },
        process_success() {
            return (
                this.step == 1 && !this.loading
            )
        },
        process_fail() {
            return this.step == -1
        },
    },
    watch: {
        step: {
            handler(value) {
                if (value == 0) {
                    this.tipsText = '正在同步直播间'
                } else if (value === 1) {
                    // 检查阶段完成 进入更新阶段
                    this.tipsText = '同步完成'
                    this.progress = 100
                    clearInterval(this.timeId)
                } else if (value === -1) {
                    // 系统检查失败
                    this.tipsText = '同步失败'
                    this.progress = 100
                    clearInterval(this.timeId)
                }
            },
            immediate: true,
        },
        loading: {
            handler(value) {
                if (!value) {
                    if (this.timeId) {
                        clearInterval(this.timeId)
                    }
                } else {
                    // 处理进度条
                    this.progress = 0
                    this.interval = 3
                    this.timeId = setInterval(() => {
                        this.progress += this.interval
                        if (this.progress >= 90) {
                            clearInterval(this.timeId)
                        }
                    }, 1000)
                }
            },
            immediate: true,
        },

    },
    methods: {
        // 点击开始按钮
        fnStart() {
            if(this.step == 1) {
                this.$emit('on-ok')
            } else if(this.step == -1) {
                this.$emit('on-refresh')
            }
        },
        // 关闭弹窗
        fnCloseModal() {
            this.$emit('input', false)
        },
    },
    filters: {
        formatStep(value) {
            let text = ''
            switch (value) {
                case 0:
                    text = ''
                    break
                case 1:
                    text = '确定'
                    break
                case -1:
                    text = '重新同步'
                    break
                default:
                    text = '确定'
                    break
            }
            return text
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
            &.icon-xiaochengxuzhibo-tongbu {
                color: #FF9900;
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
                color: #262b30;
                span {
                    color: #19be6b;
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
