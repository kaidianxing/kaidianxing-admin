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
    <vdr
        :w="point.w"
        :h="point.h"
        :x="point.x"
        :y="point.y"
        :parent="true"
        draggable
        resizable
        class-name="dragable-item"
        class-name-active="dragable-item-active"
        @deactivated="onDeactivated"
        @activated="clickTmp"
        @dragging="onDrag"
        @resizing="onResize"
    >
        <slot></slot>
        <img
            class="delitem"
            :src="isHover?delIcon1:delIcon2"
            @click="del"
            @mouseenter="hoverHander(true)"
            @mouseleave="hoverHander(false)"
            v-if="active&&is_delete"
            data-html2canvas-ignore
        />

        <div
            class="sure-modal"
            v-if="active && showDelModal"
            data-html2canvas-ignore
        >
            <p class="p1">确认删除该组件吗？</p>
            <p
                class="btn btn1"
                @click="delItem(true)"
            >确认</p>
            <p
                class="btn btn2"
                @click="delItem(false)"
            >取消</p>
        </div>
    </vdr>
</template>


<script>
import vdr from "vue-draggable-resizable-gorkys";
import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
let throttle;
export default {
    props: {
        point: {
            type: Object,
            default: () => {
                return {
                    x: 0,
                    y: 0,
                    w: 100,
                    h: 100
                }
            }
        },
        width: {
            type: Number,
            default: 300
        },
        height: {
            type: Number,
            default: 300
        },
        active: {
            type: Boolean,
            default: false
        },
        is_delete: {
            type: Boolean,
            default: true
        },
    },
    components: {
        vdr
    },
    data() {
        return {
            showDelModal: false,
            isHover: false,
            delIcon1: require('@/assets/svg/del-hover.svg'),
            delIcon2: require('@/assets/svg/del-normal.svg'),
        }
    },
    methods: {
        del() {
            this.showDelModal = true
        },
        delItem(status) {
            if (status) {
                this.$emit('on-del')
            }
            this.showDelModal = false
        },
        onDeactivated() {
            this.showDelModal = false
            this.$emit('on-deactivated')
        },
        onDrag(x, y) {
            clearTimeout(throttle)
            throttle = setTimeout(() => {
                this.$emit('on-drag', { x, y })
            }, 100)
        },
        onResize(x, y, w, h) {
            this.$emit('on-resize', { x, y, w, h })
        },
        clickTmp() {
            this.$emit('on-activated')
        },
        hoverHander(status) {
            this.isHover = status
        },

    }
}
</script>

<style lang="scss" scoped>
.dragable-item {
    background: rgba(45, 140, 240, 0.6);
    border: 1px solid $brand-color;
    position: absolute;
    cursor: all-scroll;

    /deep/ .handle {
        height: 5px;
        width: 5px;
        border: 1px solid $brand-color;
    }

    &-active {
        z-index: 9999!important;
        .delitem {
            display: block;
        }

        .sure-modal {
            display: block;
        }
    }
}

.delitem {
    position: absolute;
    top: -12px;
    right: -12px;
    font-size: 20px;
    height: 20px;
    line-height: 20px;
    width: 20px;
    color: #636669;
    cursor: pointer;
    z-index: 999;
}
.sure-modal {
    position: absolute;
    background: #ffffff;
    border-radius: 2px;
    top: 0;
    right: 10px;
    width: 197px;
    height: 86px;
    z-index: 1000;
    transform: translate(0, -40%);
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid rgb(230, 231, 235);
    .p1 {
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 20px;
    }
    .btn {
        position: absolute;
        width: 40px;
        height: 24px;
        background: #ffffff;
        /* global/border */
        border: 1px solid #e9edef;
        box-sizing: border-box;
        border-radius: 2px;
        bottom: 10px;
        right: 10px;
        text-align: center;
        line-height: 22px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        cursor: pointer;
        &:hover {
            color: $brand-color;
            border-color: $brand-color;
        }
    }
    .btn1 {
        right: 60px;
    }
    &::after {
        content: "";
        width: 12px;
        height: 12px;
        position: absolute;
        top: 50%;
        right: 0;
        background: #fff;
        border-radius: 2px;
        transform: translate(40%, -50%) rotate(45deg);
    }
}
</style>