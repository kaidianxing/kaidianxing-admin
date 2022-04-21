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
    <kdx-modal-frame v-model="value" :width="430" :footer-hide="true" :closable="type=== 'API'&&progress >= 100" @on-cancel="handleOk" @on-ok="handleOk">
        <div class="goods-helper-progress-bar">
            <div class="icon" v-if="type=== 'manual'">
                <span class="iconfont icon-chenggong-shixin"></span>
            </div>
            <div class="icon" v-else>
                <span v-if="progress < 100" class="iconfont icon-xiaochengxuzhibo-tongbu"></span>
                <template v-else>
                    <span v-if="status==='success'" class="iconfont icon-chenggong-shixin"></span>
                    <span v-if="status==='error'" class="iconfont icon-del"></span>
                </template>
            </div>
            <div class="content" v-if="type=== 'manual'">
                <p class="text">商品评价创建成功</p>
            </div>
            <div class="content" v-else>
                <template v-if="progress < 100">
                    <p class="text">正在获取中...</p>
                    <div>
                        <Progress :percent="progress" hide-info :stroke-width="4"/>
                    </div>
                </template>
                <p class="text" v-if="status==='success'">商品评价成功抓取{{count}}条</p>
                <p class="text" v-if="status==='error'">商品评价抓取失败</p>
            </div>
            <div class="footer-btn" v-if="type=== 'manual'">
                <Button class="primary-long marginR-10" @click="handleOk">继续创建</Button>
                <Button class="default-long" @click="readComment">查看评价</Button>
            </div>
            <div class="footer-btn" v-if="type=== 'API'&&status==='success'">
                <Button class="primary-long marginR-10" @click="handleOk">继续抓取</Button>
                <Button class="default-long" @click="readComment">查看评价</Button>
            </div>
            <div class="footer-btn" v-if="type=== 'API'&&status==='error'">
                <Button class="primary-long marginR-10" @click="handleOk">确定</Button>
            </div>
        </div>
    </kdx-modal-frame>
</template>

<script>
    export default {
        name: "ProgressBar",
        props: {
            type: {
                type: String,
                default: 'manual'
            },
            current: {
                type: [String, Number],
                default: '0'
            },
            count: {
                type: [String, Number],
                default: '0'
            },
            status: {
                type: String,
                default: 'normal'
            }
        },
        data() {
            return {
                value: false,
                progress: 0,
                timeInterval: null
            };
        },
        watch: {
            current: {
                handler(value) {
                    this.progress = value
                }
            }
        },
        methods: {
            setValue() {
                this.value = !this.value;
                if (this.value&&this.type === 'API') {
                    this.progress = 0;
                    this.setProgress();
                }
            },
            handleOk() {
                this.setValue();
                if (this.status!=='error') {
                    this.$emit('on-reset');
                }
            },
            readComment() {
                this.setValue();
                this.$emit('readComment');
            },
            setProgress() {
                this.timeInterval = setTimeout(() => {
                    if (this.progress < 60) {
                        this.progress += 2;
                        this.setProgress();
                    } else if (this.progress < 80) {
                        this.progress += 1;
                        this.setProgress();
                    } else if (this.progress < 90) {
                        this.progress += 0.5;
                        this.setProgress();
                    }
                    this.timeInterval = null;
                }, 1000);
            }
        },
        beforeDestroy() {
            this.timeInterval && clearTimeout(this.timeInterval);
        }
    };
</script>

<style scoped lang="scss">
    .goods-helper-progress-bar {
        padding: 40px;
        .icon {
            text-align: center;
            line-height: initial;
            .iconfont {
                font-size: 67px;
                &.icon-xiaochengxuzhibo-tongbu {
                    color: $warning-color;
                }
                &.icon-chenggong-shixin {
                    color: $success-color;
                }
                &.icon-del {
                    color: $danger-color;
                }
            }
        }
        .content {
            text-align: center;
            .text {
                padding: 20px 0;
                @include font-14-20;
                color: #000000;
            }
        }
        .footer-btn {
            text-align: center;
            margin-top: 30px;
        }
    }
</style>
