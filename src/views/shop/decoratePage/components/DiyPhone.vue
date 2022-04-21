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
    <div class="page-content">
        <div class="row relative w840">
            <div class="diy-phone">
                <div class="phone-body">
                    <div class="phone-title" :class="[currentModal.id]" @click="changeFocus({item:pageInfo,pageId:$route.params.page})">
                        <div class="phone-top">
                            <div style="width:375px;height:64px;" :style='{background:pageInfo.params.navbgcolor}' class='custom-navbar'>
                                <img style="width:375px;height:20px;position:absolute;top:0;left:0;z-index:100;" :src="pageInfo.params.funbtncolor=='white'?require('@/assets/image/decorate/Status-Bars-White.png'):require('@/assets/image/decorate/Status-Bars-Black.png')" alt />
                                <img class='navbgimg' :src="$media(pageInfo.params.navbgimg)" alt="" v-if='pageInfo.params.navbgtype=="img"&&pageInfo.params.navbgimg'>
                                <img :src="require(pageInfo.params.funbtncolor=='white'?'@/assets/image/decorate/right-white.png':'@/assets/image/decorate/right-black.png')" alt />
                            </div>
                        </div>
                        <p class="page-title" :style='{color:pageInfo.params.funbtncolor}' v-if='pageInfo.title'>{{pageInfo.title| sliceStr}}</p>
                        <p class="page-title page-title-left" :style='{color:pageInfo.params.funbtncolor}' v-else-if="pageId === 'goods-detail'">2020年夏季新款韩版宽色短款...</p>
                    </div>
                    <div class="phone-main" :style="{background:pageInfo.background_color||'#F4F6F8'}" id="toCanvas" :class="{
                                'phone-img-box': bgImg
                            }">
                        <slot name="top"></slot>
                        <div style="flex:1;width:100%;min-height:100%;">
                            <img v-if="bgImg" :src="bgImg" class="phone-main-img" />
                            <draggable v-model="sortAbleList" :options="{draggable:'.drag-item'}" @end="onEnd">
                                <transition-group name="flip-list" tag="div">
                                    <slot></slot>
                                </transition-group>
                            </draggable>
                        </div>
                        <div style="width:100%;" class="bottom-items">
                            <slot name="bottom"></slot>
                        </div>
                        <slot name="fixed"></slot>
                        <p style="text-align: center; line-height: 400px" v-if="!pageList.length">您还没有添加任何元素</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- 复制粘贴模板操作 -->
        <input type="text" id='forFocus' @keyup.ctrl.67="copy" @keyup.ctrl.86="past">
    </div>
</template>

<script>
    import draggable from "vuedraggable";
    import {
        mapState,
        mapMutations,
    } from "vuex";
    export default {
        props: {
            bgImg: {
                type: String,
                default: ''
            },
        },
        computed: {
            ...mapState("decorate", {
                pageList: state => state.pageList,
                pageInfo: state => state.pageInfo,
                currentModal: state => state.currentModal,
                topItem: state => state.topItem,
                copyComponent: state => state.copyModal,
                onlyOne: state => state.onlyOneComponent
            }),
            sortAbleList: {
                get() {
                    return this.$store.state.decorate.sortAbleList;
                },
                set(val) {
                    this.$store.state.decorate.sortAbleList = val;
                }
            },
            pageList: {
                get() {
                    return this.$store.state.decorate.pageList;
                },
                set(val) {
                    this.$store.state.decorate.pageList = val;
                }
            },
            pageId() {
                return this.$route.params.page
            },
        },
        components: {
            draggable
        },
        methods: {
            ...mapMutations("decorate", ["changeFocus", "copyModal", "pastModal"]),
            hasItem(arr, obj, key) {
                let index = -1;
                arr.forEach((v, i) => {
                    if (v[key] == obj[key]) {
                        index = i
                    }
                })
                return index
            },
            copy() {
                if (this.onlyOne) {
                    this.$Message.error('无法复制该模板')
                    return
                }
                this.$nextTick(() => {
                    this.copyModal(e => {
                        if (e) {
                            this.$Message.success('复制成功')
                        }
                    })
                })
            },
            past() {
                if (this.onlyOne) {
                    return
                }
                if (this.copyComponent) {
                    if (this.copyComponent.istop && this.topItem.length) { //已经有了置顶元素,置顶元素只能有一个，除了跟followbar一起可以有两个
                        let index = this.hasItem(this.topItem, this.copyComponent, 'id'); //查找相同id
                        let errorMessage = '';
                        if (index > -1) { //（两个置顶元素相同）
                            errorMessage = '此元素最多允许添加1个';
                        } else if (this.copyComponent.id != 'followbar' && ((this.topItem.length == 1 && this.topItem[0].id != 'followbar') || this.topItem.length > 1)) { //两个置顶元素不同,只能与followbar共存
                            index = 0
                            errorMessage = '已有顶部固定元素，请删除后添加';
                        }
                        if (errorMessage) {
                            this.$Message['error']({
                                background: true,
                                content: errorMessage
                            })
                            return
                        }
                        if (this.copyComponent.max) { //查看最大允许添加数量
                            let hasnum = 0
                            this.pageList.forEach(item => {
                                if (item.id == this.copyComponent.id) {
                                    hasnum = hasnum + 1
                                }
                            })
                            if (hasnum >= this.copyComponent.max) {
                                this.$Message['error']({
                                    background: true,
                                    content: `此元素最多允许添加${this.copyComponent.max}个`
                                })
                                return
                            }
                        }
                    }
                    this.pastModal(this.$route.params.page)
                } else {
                    this.$Message.error('请先复制一个模板')
                }
            },
            onEnd() {
                this.$store.commit("decorate/mergeStortableListPageList");
            }
        },
        filters: {
            sliceStr(str) {
                if (typeof str == 'string' && str.length > 11) {
                    str = str.substring(0, 11) + "…"
                    return str
                } else {
                    return str
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .phone-body {
        background: rgb(243, 243, 243);
    }
    .page-content {
        min-height: 100%;
        width: 375px;
    }
    .phone-top {
        display: flex;
        flex-direction: column;
        width: 375px;
        overflow: hidden;
        .custom-navbar {
            position: relative;
            img {
                position: absolute;
                right: 7px;
                width: 87px;
                height: 32px;
                bottom: 6px;
            }
            .navbgimg {
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
            }
        }
    }
    .phone-title,
    .phone-body,
    .diy-phone {
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
    }
    .diy-phone {
        width: 375px;
        height: auto;
        min-height: 100%;
        background: #fff;
    }
    .diy-phone .phone-title {
        height: 64px;
        background: #fff;
        background-size: 100% auto;
        text-align: center;
        cursor: pointer;
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
        .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }
        .page-title {
            position: absolute;
            z-index: 100;
            font-family: PingFang SC;
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 25px;
            display: flex;
            align-items: center;
            text-align: center;
            /* 文字信息/21 */
            color: #212121;
            left: 50%;
            transform: translate(-50%, 0);
            bottom: 10px;
        }
        .page-title-left {
            width: 100%;
            padding: 0 100px 0 15px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
    .phone-title.pageInfo {
        box-shadow: 0 0 2px 0 $brand-color;
        z-index: 1000;
        position: relative;
    }
    .diy-phone .phone-main {
        min-height: 667px;
        box-sizing: border-box;
        border-top: 0;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .diy-phone .phone-main.phone-img-box {
        overflow: hidden;
    }
    .diy-phone .phone-main .phone-main-img {
        position: absolute;
        width: 100%;
        z-index: 0;
    }
    .diy-phone .phone-main p {
        margin: 0;
        padding: 0;
    }
    .diy-phone .phone-main .highlight {
        height: 50px;
        border: 2px dashed #999;
        text-align: center;
        font-size: 16px;
        color: #999;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .diy-phone .phone-main .drag {
        position: relative;
        min-height: 20px;
        display: block;
        overflow: hidden;
    }
    .diy-phone .phone-main .drag.selected:before,
    .diy-phone .phone-main .drag:hover:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px dashed #00a0e9;
        cursor: move;
        z-index: 10;
    }
    .diy-phone .phone-main .drag.fixed:before {
        cursor: default;
    }
    .diy-phone .phone-main .drag .btn-edit-del {
        height: 16px;
        position: absolute;
        right: 2px;
        bottom: 2px;
        display: none;
        z-index: 90;
    }
    .diy-phone .phone-main .drag .btn-edit-del>div {
        width: 32px;
        height: 16px;
        line-height: 16px;
        display: inline-block;
        text-align: center;
        font-size: 10px;
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        margin-left: 2px;
        cursor: pointer;
        position: relative;
        z-index: 11;
    }
    .diy-phone .phone-main .drag.selected .btn-edit-del,
    .diy-phone .phone-main .drag:hover .btn-edit-del {
        display: block;
    }
    .diy-phone .phone-main .drag.nodelete .btn-edit-del .btn-del {
        display: none;
    }
    .diy-phone .phone-main a {
        color: #337ab7;
    }
    .form-control[disabled],
    .form-control[readonly],
    fieldset[disabled] .form-control {
        background: #f7f7f7;
    }
    .diy-menu {
        width: 840px;
        height: auto;
        background: #fdfdfd;
        margin-right: -455px;
        border: 1px solid #ddd;
        border-radius: 3px;
        position: fixed;
        bottom: 0;
        right: 50%;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
        z-index: 999;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
    }
    .page-content {
        .action {
            display: flex;
            justify-content: flex-end;
            position: relative;
            #gotop {
                position: absolute;
                left: 10px;
            }
        }
        /deep/ .btn {
            margin: 0 5px;
        }
    }
    .flip-list-move {
        transition: transform 0.5s;
    }
    #forFocus {
        position: fixed;
        width: 0;
        height: 0;
        opacity: 0;
        z-index: -1;
    }
</style>
