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
    <vdr :w="w" :h="h" :x="x" :y="y" @dragging="onDrag" @resizing="onResize" :parent="true" :lock-aspect-ratio="lockAspectRatio" :draggable="draggable" :resizable='resizable' class-name="dragable-resize-item-box" class-name-active="dragable-resize-item-box-active"
        :class='{activedItem:currentModal===item}' :grid="[1,1]" :style="{zIndex:getZIndex}" @deactivated="onDeactivated" @activated="clickTmp">
        <slot></slot>
        <p class="delitem" @click="del" data-html2canvas-ignore v-if='item.params.delable!==false'>
            <i class="iconfont icon-huiyuan-shanchu"></i>
        </p>
        <div class="sure-modal" v-if="showDelModal" data-html2canvas-ignore>
            <p class="p1">确认删除该组件吗？</p>
            <p class="btn btn1" @click="delItem(true)">确认</p>
            <p class="btn btn2" @click="delItem(false)">取消</p>
        </div>
    </vdr>
</template>

<script>
    import vdr from "vue-draggable-resizable-gorkys";
    import "vue-draggable-resizable-gorkys/dist/VueDraggableResizable.css";
    let throttle = false;
    import {
        mapState,
        mapMutations
    } from "vuex";
    let screenSize = {
        width: 375,
        height: 667
    };
    export default {
        components: {
            vdr
        },
        props: {
            item: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                vLine: [],
                hLine: [],
                showDelModal: false,
            };
        },
        computed: {
            ...mapState("decorate", {
                currentModal: state => state.currentModal,
                errorInfo: state => state.errorInfo,
            }),
            getZIndex() {
                if (this.item.id !== "poster_bgimg") {
                    return this.item === this.currentModal ? 10000 : this.item.style.zIndex
                } else {
                    return 1
                }
            },
            lockAspectRatio() { //是否等比例縮放
                return this.item.params.imgscaletype == 0
            },
            draggable() {
                return this.item.params.draggable !== false
            },
            resizable() {
                return this.item.params.resizable !== false
            },
            x() {
                return this.item.style.left / 2;
            },
            y() {
                return this.item.style.top / 2;
            },
            w() {
                if (typeof this.item.style.width == "number") {
                    return this.item.style.width / 2;
                } else if (typeof this.item.style.width == "string") {
                    if (this.item.style.width.indexOf("%") > -1) {
                        return (
                            screenSize.width *
                            (this.item.style.width.replace("%", "") / 100)
                        );
                    }
                    return this.item.style.width / 2;
                }
                return 100;
            },
            h() {
                if (typeof this.item.style.height == "number") {
                    return this.item.style.height / 2;
                } else if (typeof this.item.style.height == "string") {
                    if (this.item.style.height.indexOf("%") > -1) {
                        return (
                            screenSize.height *
                            (this.item.style.height.replace("%", "") / 100)
                        );
                    }
                    return this.item.style.height / 2;
                }
                return 100;
            }
        },
        methods: {
            ...mapMutations("decorate", ["delModal", "changeFocus"]),
            onDeactivated() {
                this.showDelModal = false;
            },
            del() {
                this.showDelModal = true;
            },
            delItem(status) {
                if (status) {
                    this.delModal({
                        item: this.item,
                        pageId: this.$route.params.page
                    });
                }
                this.showDelModal = false;
            },
            clickTmp() {
                if (this.item !== this.currentModal) {
                    this.$emit("beforeChange", this.item);
                    this.$nextTick(() => {
                        this.changeFocus({
                            item:this.item,
                            pageId: this.$route.params.page
                        });
                    });
                }
            },
            px2rpx(px, rate = 1) {
                return (px / 2) * rate;
            },
            onResize(x, y, width, height) {
                if (!throttle) {
                    throttle = true
                    setTimeout(() => {
                        this.item.style.width = width * 2;
                        this.item.style.height = height * 2;
                        this.item.style.left = x * 2;
                        this.item.style.top = y * 2;
                        throttle = false;
                    }, 60);
                }
            },
            onDrag(x, y) {
                this.item.style.left = x * 2;
                this.item.style.top = y * 2;
            }
        }
    };
</script>

<style lang="scss" scoped>
    .fixed-item {
        position: absolute;
    }
    .activedItem {
        border: 1px solid $brand-color;
    }
    .delitem {
        width: 18px;
        height: 16px;
        position: absolute;
        top: 0;
        background: #fff;
        right: -19px;
        /* shadow/card */
        box-shadow: 0px 1px 4px rgba(133, 148, 162, 0.2);
        border-radius: 0px 1px 1px 0px;
        display: flex;
        justify-content: center;
        cursor: pointer;
        .iconfont {
            font-size: 12px;
            color: #262b30;
            width: 12px;
            height: 12px;
            line-height: 12px;
            text-align: center;
            margin: auto;
        }
        &:hover {
            background: #ff1f2c;
            .iconfont {
                font-size: 12px;
                color: #fff;
                width: 12px;
                height: 12px;
                line-height: 12px;
                text-align: center;
                margin: auto;
            }
        }
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
    .dragable-resize-item-box {
        /deep/ .handle {
            width: 7px;
            height: 7px;
        }
        .delitem {
            display: none;
        }
    }
    .dragable-resize-item-box-active {
        border: 1px solid $brand-color;
        /deep/ .handle {
            border: 1px solid $brand-color;
            z-index: 1;
        }
        .delitem {
            display: flex;
        }
    }
</style>