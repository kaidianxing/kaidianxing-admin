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
    <div class="drag-item" ref='dragItem' :key="item._comIndex_" @mouseenter="mouseEnter" @mouseleave="mouseLeave" @click.capture="clickTmp(item)" :class="[{'active-item':activeItem,chooseable:chooseable,errorInfo:(errorInfo&&errorInfo._comIndex_==item._comIndex_)},item._comIndex_]">
        <!-- 动态组件 -->
        <slot></slot>
        <span data-html2canvas-ignore class="del" @click.stop="delTmp(item)" v-if="showDel">删除</span>
        <div class="del-modal" v-if="modalShow && activeItem" data-html2canvas-ignore>
            <div class="del-title">确认删除该组件吗？</div>
            <div class="modal-btn-group">
                <div class="modal-btn sure" @click="sureHandler">确认</div>
                <div class="modal-btn cancel" @click="cancelHandler">取消</div>
            </div>
        </div>
        <i class="left-border border" data-html2canvas-ignore></i>
        <i class="right-border border" data-html2canvas-ignore></i>
    </div>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    import initPageDecoratePerm from '@/store/decorate/templatePerms'
    import Updater from '@/store/decorate/pageListUpdater'
    export default {
        props: {
            item: {
                type: [Object, Array],
                default: null
            },
            lazyUpdate:{
                type: Boolean,
                default:false
            }
        },
        data() {
            return {
                modalShow: false,
                permsChecker: {},
                moving: false,
                updater:null,
            }
        },
        computed: {
            chooseable() { //禁止底部导航的鼠标：hover虚线效果
                return this.item.id != 'diymenu'
            },
            ...mapState('decorate', {
                currentModal: state => state.currentModal,
                onlyOneComponent: state => state.onlyOneComponent,
                errorInfo: state => state.errorInfo,
            }),
            activeItem() {
                return this.currentModal === this.item && !this.onlyOneComponent
            },
            showDel(){
                return  (!this.onlyOneComponent) &&
                (this.currentModal == this.item || (this.moving && this.chooseable)) &&
                this.currentModal.params &&
                this.item.params.delable !==false
            }
        },
        watch: {
            lazyUpdate:{
                immediate: true,
                handler(){
                    this.isEdit=this.$route.query.type=='edit'
                    if(this.isEdit&&this.lazyUpdate) {
                        this.updater=Updater[this.item.id];
                        if(this.updater&&typeof this.updater.update=='function'){
                            this.updater.update(this.item,this.$slots.default[0])
                        }
                    }
                }
            },
            activeItem(status) {
                if (!status) {
                    this.modalShow = false
                }
            }
        },
        created() {
            // this.$nextTick(() => {
            //     this.$refs.dragItem.oncontextmenu=()=>false ;//禁用默认右键菜单
            // })
            this.permsChecker = initPageDecoratePerm();
        },
        methods: {
            ...mapMutations('decorate', ['changeFocus', 'delModal']),
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
                document.getElementById('forFocus').focus();//为了复制模板功能添加的input元素
                if (item !== this.currentModal) {
                    if (item.id == "diymenu") return
                    this.$emit("beforeChange", item)
                    this.$nextTick(() => {
                        this.changeFocus({
                            item,
                            pageId: this.$route.params.page
                        });
                    })
                }
            },
            mouseEnter(){
                this.moving = true
            },
            mouseLeave(){
                this.moving = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .drag-item {
        position: relative;
        width: 100%;
        overflow: visible;

        .cover {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 10px;
            width: 100%;
            z-index: 100;
            background: rgba(0, 0, 0, 0);
        }
        .cover-disabled {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            font-weight: 400;
            font-size: 12px;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-radius: 2px;
            transition: all 0.5s;
            text-align: center;
            z-index:100;
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
            transform: translate(100%, 0);
        }
        .del-modal {
            position: absolute;
            top: 11px;
            right: 8px;
            z-index: 1000;
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
        &.chooseable:hover {
            &::before,
            &::after {
                border-top: 1px dashed $brand-color;
            }
            .border {
                border-left: 1px dashed $brand-color;
            }
        }
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
    .drag-item.followbar {
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
        &.advs {
            &::before,
            &::after {
                border-color: transparent!important;
            }
            .border {
                border-color: transparent!important;
            }
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
