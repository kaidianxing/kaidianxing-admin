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
    <div class="wrapper">
        <div class="mask"></div>
        <span class="btn close" @click="close">
            <Icon type="ios-close-circle-outline" />
        </span>
        <span class="btn prev" @click="prevImg">
            <i class="iconfont icon-line-left" />
        </span>
        <span class="btn next" @click="nextImg">
            <i class="iconfont icon-line-right" />
        </span>
        <div class="btn actions">
            <div class="inner">
                <i
                    class="iconfont icon-tupianyulan-suoxiao"
                    @click="scaleSmall"
                />
                <i class="iconfont icon-tupianyulan-fangda" @click="scaleBig" />
                <i
                    class="iconfont icon-tupianyulan-quanping"
                    v-if="!fullScreen"
                    @click="changeFull(true)"
                />
                <i
                    class="iconfont icon-tupianyulan-_"
                    v-if="fullScreen"
                    @click="changeFull(false)"
                />
                <i
                    class="iconfont icon-tupianyulan-xuanzhuan-zuo"
                    @click="rotateLeft"
                />
                <i
                    class="iconfont icon-tupianyulan-xuanzhuan-you"
                    @click="rotateRight"
                />
            </div>
        </div>
        <div class="canvas">
            <img
                :src="$media(imgList[current])"
                class="img"
                :style="getStyle"
                @error="replaceImage"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        imgList: {
            type: Array,
            default: () => []
        },
        currentIndex: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            current: 0,
            style: {
                scale: 1,
                deg: 0,
                left: 0,
                top: 0,
                height: 90,
                width: 90
            },
            fullScreen: true
        }
    },
    computed: {
        getStyle() {
            let style = {
                transform: `scale(${this.style.scale}) rotate(${this.style.deg}deg)`,
                marginLeft: `${this.style.left}px`,
                marginTop: `${this.style.top}px`
            }

            if (!this.fullScreen) {
                style = {
                    ...style,
                    maxHeight: `${this.style.height}%`,
                    maxWidth: `${this.style.width}%`
                }
            }
            return style
        }
    },
    watch: {
        currentIndex(value) {
            this.current = value
            this.initStyle()
        },
        current() {
            this.initStyle()
        }
    },
    mounted() {
        if (this.currentIndex) {
            this.current = this.currentIndex
        }
        this.initStyle()
    },
    methods: {
        initStyle() {
            this.style = {
                scale: 1,
                deg: 0,
                left: 0,
                top: 0,
                height: 90,
                width: 90
            }
        },
        prevImg() {
            if (this.current == 0) {
                this.current = this.imgList.length - 1
            } else {
                this.current--
            }
        },
        nextImg() {
            if (this.current < this.imgList.length - 1) {
                this.current++
            } else {
                this.current = 0
            }
        },
        scaleSmall() {
            if (this.style.scale >= 0.4) {
                this.style.scale -= 0.2
            }
        },
        scaleBig() {
            if (this.style.scale <= 5) {
                this.style.scale += 0.2
            }
        },
        changeFull(status) {
            this.fullScreen = status
        },
        rotateLeft() {
            this.style.deg -= 90
        },
        rotateRight() {
            this.style.deg += 90
        },
        close() {
            this.$emit('on-close')
            this.$emit('on-change', this.current);
        }
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;

    .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0.5;
        background: #000;
    }

    .btn {
        position: absolute;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        opacity: 0.8;
        cursor: pointer;
        box-sizing: border-box;
        user-select: none;
    }

    .close {
        top: 40px;
        right: 40px;
        width: 40px;
        height: 40px;
        font-size: 40px;
        font-weight: 600;
        color: #fff;
    }

    .prev,
    .next {
        top: 50%;
        transform: translateY(-50%);
        width: 44px;
        height: 44px;

        background-color: #606266;
        border-color: #fff;

        .icon-line-right,
        .icon-line-left {
            font-size: 24px;
            font-weight: normal;
            color: #fff;
        }
    }

    .prev {
        left: 40px;
    }
    .next {
        right: 40px;
    }

    .actions {
        left: 50%;
        bottom: 30px;
        transform: translateX(-50%);
        width: 282px;
        height: 44px;
        padding: 0 23px;
        background-color: #606266;
        border-color: #fff;
        border-radius: 22px;

        .inner {
            width: 100%;
            height: 100%;
            text-align: justify;
            cursor: default;

            display: flex;
            align-items: center;
            justify-content: space-around;

            .iconfont {
                font-size: 23px;
                color: #fff;
                cursor: pointer;
                &:hover {
                    color: $brand-color;
                }
            }
        }
    }

    .canvas {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .img {
            border-radius: 6px;
            transition: transform 0.3s ease 0s;
        }
    }
}
</style>
