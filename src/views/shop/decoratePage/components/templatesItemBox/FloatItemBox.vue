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
        class="float-item"
        :key="item._comIndex_"
        @click.capture="clickTmp(item)"
        :class="[{'on':activeItem,errorInfo:(errorInfo&&errorInfo._comIndex_==item._comIndex_)},item._comIndex_]"
        :style="getStyle"
    >
        <!-- 动态组件 -->
        <slot></slot>
        <div class="del-mask" data-html2canvas-ignore>
            <span
                class="del"
                @click.stop="delTmp(item)"
                v-show="!onlyOneComponent&&currentModal===item"
            >删除</span>
            <div class="del-modal" v-if="modalShow && activeItem">
                <div class="del-title">确认删除该组件吗？</div>
                <div class="modal-btn-group">
                    <div class="modal-btn sure" @click="sureHandler">确认</div>
                    <div class="modal-btn cancel" @click="cancelHandler">取消</div>
                </div>
            </div>
        </div>

        <i class="left-border border" data-html2canvas-ignore></i>
        <i class="right-border border" data-html2canvas-ignore></i>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { px2rpx } from '@/assets/jsTools/environment'
export default {
    props: {
        item: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            modalShow: false
        }
    },
    computed: {
        ...mapState('decorate', {
            currentModal: state => state.currentModal,
            onlyOneComponent: state => state.onlyOneComponent,
            errorInfo: state => state.errorInfo
        }),
        activeItem() {
            return this.currentModal === this.item && !this.onlyOneComponent
        },
        getStyle() {
            if (this.item.id == 'gotop') {
                let style = {
                    height: px2rpx(this.item.style.width),
                    width: px2rpx(this.item.style.width),
                    margin: `0 ${px2rpx(this.item.style.left * 1 + 30)}`,
                    bottom: px2rpx(this.item.style.top * 1 + 100)
                }
                if (this.item.params.iconposition.indexOf('left') > -1) {
                    style.left = 0
                } else {
                    style.right = 0
                }
                return style
            } else if (this.item.id == 'layer') {
                let style = {
                    height: px2rpx(this.item.style.width),
                    width: px2rpx(this.item.style.width),
                    margin: `0 ${px2rpx(
                        this.item.style.offset_left_right * 1 + 30
                    )}`
                }
                this.item.position.split(' ').forEach(v => {
                    if (v == 'top' || v == 'bottom') {
                        style[v] = px2rpx(
                            this.item.style.offset_up_down * 1 + 100
                        )
                    } else {
                        style[v] = 0
                    }
                })

                return style
            } else if (this.item.id == 'customer') {

                // console.log(this.item,'item>>>>>');

                let style = {};
                if (this.item.style.showType === '1') {
                    style = {
                        height: px2rpx(this.item.style.width),
                        width: px2rpx(this.item.style.width),
                        margin: `0 ${px2rpx(
                            this.item.style.offset_left_right * 1 + 30
                        )}`
                    }
                } else if (this.item.style.styleType === 'one') {
                    style = {
                        height: px2rpx(this.item.style.width*1.1),
                        width: px2rpx(this.item.style.width),
                        margin: `0 ${px2rpx(
                            this.item.style.offset_left_right * 1 + 30
                        )}`
                    }
                } else if (this.item.style.styleType === 'three') {
                    style = {
                        height: px2rpx(this.item.style.width/0.25),
                        width: px2rpx(this.item.style.width),
                        margin: `0 ${px2rpx(
                            this.item.style.offset_left_right * 1
                        )}`
                    };
                } else {
                    style = {
                        height: px2rpx(this.item.style.width/3.95),
                        width: px2rpx(this.item.style.width),
                        margin: `0 ${px2rpx(
                            this.item.style.offset_left_right * 1
                        )}`
                    };
                }
                this.item.position.split(' ').forEach(v => {
                    if (v == 'top' || v == 'bottom') {
                        style[v] = px2rpx(
                            this.item.style.offset_up_down * 1 + 110
                        )
                    } else {
                        style[v] = 0
                    }
                });

                return style
            } else {
                return {}
            }
        }
    },
    watch: {
        activeItem(status) {
           if(!status) {
               this.modalShow = false
           }
        }
    },
    methods: {
        delTmp() {
            this.modalShow = true
        },
        sureHandler() {
            this.delModal({
                item: this.item,
                pageId: this.$route.params.page
            })
            this.modalShow = false
        },
        cancelHandler() {
            this.modalShow = false
        },
        clickTmp(item) {
            if (item.id == 'diymenu') return
            this.$emit('beforeChange')
            this.$nextTick(() => {
                this.changeFocus({
                    item,
                    pageId: this.$route.params.page
                })
            })
        },
        ...mapMutations('decorate', ['changeFocus', 'delModal'])
    }
}
</script>

<style lang="scss" scoped>
.float-item {

    &:hover {
        .del {
            display: block!important;
        }
    }
    &.on {
        .del-mask {
            border: 1px solid $brand-color;
            position: absolute;
            display: block;
            background: rgba(255, 255, 255, 0.5);
            box-shadow: 0px 1px 14px rgba(133, 148, 162, 0.2);

            .del {
                top: -1px;
                right: 0;
            }
        }
    }

    &.gotop,
    &.layer,
    &.customer {
        position: absolute;
        /deep/ .gotop,
        /deep/ .layer,
        /deep/ .customer {
            position: relative;
            margin: 0 !important;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
        }

        &.on {
            .del-mask {
                top: -2.5px;
                left: -15px;
                width: calc(100% + 30px);
                height: calc(100% + 5px);

                .del {
                    transform: translateX(100%);
                }
            }
        }
    }
    &.customer {
        display: flex;
        justify-content: center;
        align-items: center;
        &.on {
            .del-mask {
                height: calc(100% + 10px);
            }
        }
    }

    &.layer {
        display: flex;
        align-items: center;
    }
    .del-mask {
        display: none;
    }

    .del {
        position: absolute;
        width: 40px;
        height: 20px;
        right: 0;
        top: 0;
        /* danger/def */
        background: #ff1f2c;
        border-radius: 0px 0px 2px 2px;
        text-align: center;
        line-height: 18px;
        /* regular/12 */
        font-family: PingFang SC;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        color: #fff;
        cursor: pointer;
        z-index: 1000;
    }

    .del-modal {
        position: absolute;
        top: 11px;
        right: 8px;
        z-index: 1003;
        border-radius: 2px;
        width: 197px;
        height: 86px;
        padding: 10px;
        background: #ffffff;
        box-shadow: 0px 1px 14px rgba(133, 148, 162, 0.2);

        .del-title {
            font-size: 14px;
            line-height: 20px;
            color: #262b30;
        }

        .modal-btn-group {
            margin-top: 22px;
            display: flex;
            justify-content: flex-end;

            .modal-btn {
                border-radius: 2px;
                width: 40px;
                height: 24px;
                font-size: 12px;
                text-align: center;
                line-height: 24px;
                cursor: pointer;

                &.sure {
                    margin-right: 10px;
                    border: 1px solid $brand-color;
                    color: $brand-color;
                }

                &.cancel {
                    border: 1px solid #e9edef;
                    color: #262b30;
                }
            }
        }
    }
    &::before,
    &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 0;
        left: 0;
        z-index: 100;
    }
    &::before {
        top: 0;
    }
    &::after {
        bottom: 0;
    }
    .border {
        height: 100%;
        width: 0;
        position: absolute;
        top: 0;
    }
    .left-border {
        left: 0;
    }
    .right-border {
        right: 0;
    }
    // &:hover {
    //     &::before,
    //     &::after {
    //         border-top: 1px dashed $brand-color;
    //     }
    //     .border {
    //         border-left: 1px dashed $brand-color;
    //     }
    // }
    &.errorInfo:hover {
        &::before,
        &::after {
            border-color: #ed4014;
        }
        .border {
            border-color: #ed4014;
        }
    }
}
.float-item.followbar {
    position: relative;
}
.active-item {
    position: relative;
    z-index: 1000;
    position: relative;
    &::before,
    &::after {
        border-top: 1px solid $brand-color !important; 
    }
    .border {
        border-left: 1px solid $brand-color !important;
    }
}
.errorInfo.active-item {
    &::before,
    &::after {
        border-color: #ed4014 !important;
    }
    .border {
        border-color: #ed4014 !important;
    }
}
</style>
